import express from "express";
import authRouter from "../modules/auth/auth-router";

// /api router
const router = express.Router();

// array of all router path and router
const routers = [
  {
    path: "/auth",
    router: authRouter,
  }
];

// add all routers in router
routers.map((element) => router.use(element.path, element.router));

export default router;
