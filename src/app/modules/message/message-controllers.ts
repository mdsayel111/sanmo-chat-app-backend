import { RequestHandler } from "express";
import catchAsync from "../../middlewares/HOF-middlewares/catch-async-middleware";
import sendResponse from "../../utils/send-response";
import { Chat } from "../chat/chat-mode";
import { User } from "../user/user-model";
import { Message } from "./message-model";

// get all messages middleware
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
    }

    if (type === "private") {
        const chatFromDB = await Chat.findById(id).populate("members").select("members");


        const messages = await Message.find({ chat: id });
        const chat = chatFromDB?.members.find(m => (m?._id).toString() !== req.user?._id.toString());
        return sendResponse(res, {
            success: true,
            status: 200,
            message: "Messages fetched successfully",
            data: {
                chat,
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
        );
        return sendResponse(res, {
            success: false,
            status: 200,
            message: "No messages found",
            data: {
                chat: updatedChat,
                message,
            },
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
