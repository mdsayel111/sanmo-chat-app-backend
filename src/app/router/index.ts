import express from "express";
import authRouter from "../modules/auth/auth-router";
import userRouter from "../modules/user/user-route";
import chatRouter from "../modules/chat/chat-routes";

// /api router
const router = express.Router();

// array of all router path and router
const routers = [
  {
    path: "/auth",
    router: authRouter,
  },
  {
    path: "/user",
    router: userRouter,
  },
  {
    path: "/chat",
    router: chatRouter,
  },
];

// add all routers in router
routers.map((element) => router.use(element.path, element.router));

export default router;
