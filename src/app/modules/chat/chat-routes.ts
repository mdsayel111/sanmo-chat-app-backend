import express from "express";
import { createUploader } from "../../../lib/multer";
import { authorizeApiMiddleware } from "../../middlewares/HOF-middlewares/authorization-middleware";
import validateRequestBody from "../../middlewares/HOF-middlewares/validate-middleware";
import chatControllers from "./chat-controllers";
import chatZodSchemas from "./chat-validation-schema";

// create router
const chatRouter = express.Router();

// otp route
chatRouter.get(
    "/search-chats",
    authorizeApiMiddleware("user"),
    chatControllers.getChats,
);


export default chatRouter;
