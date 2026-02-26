import express from "express";
import authRouter from "../modules/auth/auth-router";
import userRouter from "../modules/user/user-route";

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
];

// add all routers in router
routers.map((element) => router.use(element.path, element.router));

export default router;
