import express from "express";
import { authorizeApiMiddleware } from "../../middlewares/HOF-middlewares/authorization-middleware";
import messageControllers from "./message-controllers";

// create router
const messageRouter = express.Router();

// get all messages
messageRouter.get(
    "/:type/:id",
    authorizeApiMiddleware("user"),
    messageControllers.getAllMessages,
);

messageRouter.post(
    "/:type/:id",
    authorizeApiMiddleware("user"),
    messageControllers.createMessage,
);


export default messageRouter;
