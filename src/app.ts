import express, { Request, Response } from "express";
import globalErrorHandleMiddleware from "./app/middlewares/global-error-handler.middleware";
import notFound from "./app/middlewares/not-found-middleware";
import router from "./app/router";
import cors from "cors";

// create app
const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

app.use("/uploads", express.static("uploads"));

// parse req.body
app.use(express.json());

app.use("/api", router);

// default route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.all("*", notFound);

// global error handler
app.use(globalErrorHandleMiddleware);

export default app;
