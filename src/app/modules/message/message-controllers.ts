import { RequestHandler } from "express";
import catchAsync from "../../middlewares/HOF-middlewares/catch-async-middleware";
import sendResponse from "../../utils/send-response";
import { Chat } from "../chat/chat-mode";
import { User } from "../user/user-model";
import { Message } from "./message-model";

// get all messages middleware
import { Types } from "mongoose";
import { io } from "../../../server";
import { socketUserStore } from "../../../temporaty-stores/socket";

const getAllMessages: RequestHandler = catchAsync(async (req, res) => {
    const { type, id } = req.params;

    if (type === "user") {
        const user = await User.findById(id);

        if (!user) {
            return sendResponse(res, {
                success: false,
                status: 404,
                message: "User not found",
                data: null,
            });
        }

        return sendResponse(res, {
            success: true,
            status: 200,
            message: "User chat fetched successfully",
            data: {
                chat: user,
                messages: [],
            },
        });
    } else if (type === "private") {
        // populate members fully
        const chatFromDB = await Chat.findById(id)
            .populate("members")
            .select("members");

        if (!chatFromDB) {
            return sendResponse(res, {
                success: false,
                status: 404,
                message: "Chat not found",
                data: null,
            });
        }

        // Type assertion: tell TS that members are Users
        const members = chatFromDB.members as unknown as Array<{ _id: Types.ObjectId; name: string }>;

        // find the other member (not current user)
        const reciverUserInfo = members.find(
            (m) => m._id.toString() !== req.user?._id.toString()
        );

        const messages = await Message.find({ chat: id });

        return sendResponse(res, {
            success: true,
            status: 200,
            message: "Messages fetched successfully",
            data: {
                chat: reciverUserInfo,
                messages,
            },
        });
    }

    return sendResponse(res, {
        success: false,
        status: 400,
        message: "Invalid chat type",
        data: null,
    });
});

const createMessage: RequestHandler = catchAsync(async (req, res) => {
    const { type, id } = req.params
    if (type === "user") {
        const chat = await Chat.create({
            type: "private",
            members: [req.body.sender, id],
        });

        const message = await Message.create({
            sender: req.body.sender,
            type: req.body.type,
            text: req.body.text,
            chat: chat._id,
        });

        const updatedChat = await Chat.findByIdAndUpdate(
            chat._id,
            { lastMessage: message._id },
            { new: true }
        ).populate("members lastMessage");

        io.to(socketUserStore[id as string]).emit("chat:receive", updatedChat);

        return sendResponse(res, {
            success: false,
            status: 200,
            message: "No messages found",
            data: {
                chat: updatedChat,
                message,
            },
        });
    } else if (type === "private") {
        const chatFromDB = await Chat.findById(id).populate("members");

        if (!chatFromDB) {
            return sendResponse(res, {
                success: false,
                status: 404,
                message: "Chat not found",
                data: null,
            });
        }

        const message = await Message.create({
            sender: req.user?._id,
            type: req.body.type,
            text: req.body.text,
            chat: id,
        });

        const updatedChat = await Chat.findByIdAndUpdate(
            chatFromDB._id,
            { lastMessage: message._id },
            { new: true }
        ).populate("members lastMessage");

        // Type assertion: tell TS that members are Users
        const members = chatFromDB.members as unknown as Array<{ _id: Types.ObjectId; name: string }>;

        // find the other member (not current user)
        const reciverUserInfo = members.find(
            (m) => m._id.toString() !== req.user?._id.toString()
        );



        io.to(socketUserStore[reciverUserInfo?._id.toString() as string]).emit("message:receive", message);

        io.emit(`message:receive:${chatFromDB?._id.toString()}`, message);

        return sendResponse(res, {
            success: false,
            status: 200,
            message: "No messages found",
            data: message,
        });
    }

    // send response
    sendResponse(res, {
        success: true,
        message: "Admin registered successfully",
        data: [],
    });
});

// auth controllers
const messageControllers = {
    getAllMessages,
    createMessage,
};

export default messageControllers;
