import { RequestHandler } from "express";
import catchAsync from "../../middlewares/HOF-middlewares/catch-async-middleware";
import sendResponse from "../../utils/send-response";
import { Chat } from "./chat-mode";
import chatService from "./chat-services";

// update user profile middleware
// wrap the middleware by catch async for async error handling
const getSearchChats: RequestHandler = catchAsync(async (req, res) => {
    const searchQuery = (req.query.searchQuery as string)?.trim() || "";
    const combinedResults = await chatService.getSearchChats(searchQuery, req.user?.phone as string);
    sendResponse(res, {
        success: true,
        message: "Chats retrieved successfully",
        data: combinedResults,
    });
});

const getChats: RequestHandler = catchAsync(async (req, res) => {
    const chats = await Chat.find({
        members: req.user?._id
    }).populate("members lastMessage").select("members lastMessage type image name");
    sendResponse(res, {
        success: true,
        message: "Chats retrieved successfully",
        data: chats,
    });
})

// auth controllers
const chatControllers = {
    getSearchChats,
    getChats
};

export default chatControllers;
