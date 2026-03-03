import express from "express";
import { authorizeApiMiddleware } from "../../middlewares/HOF-middlewares/authorization-middleware";
import chatControllers from "./chat-controllers";

// create router
const chatRouter = express.Router();

// otp route
chatRouter.get(
    "/search-chats",
    authorizeApiMiddleware("user"),
    chatControllers.getSearchChats,
);

chatRouter.get(
    "/",
    authorizeApiMiddleware("user"),
    chatControllers.getChats,
)


export default chatRouter;
