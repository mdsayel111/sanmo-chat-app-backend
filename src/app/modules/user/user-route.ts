import express from "express";
import { createUploader } from "../../../lib/multer";
import { authorizeApiMiddleware } from "../../middlewares/HOF-middlewares/authorization-middleware";
import validateRequestBody from "../../middlewares/HOF-middlewares/validate-middleware";
import userControllers from "./user-controllers";
import userZodSchemas from "./user-validation-schema";

const upload = createUploader({
  destination: "uploads/images",
  maxSize: 2 * 1024 * 1024,
  allowedTypes: ["image/jpeg", "image/png"],
});

// create router
const userRouter = express.Router();

// otp route
userRouter.put(
  "/profile-update",
  authorizeApiMiddleware("user"),
  upload.single("image"),
  validateRequestBody(userZodSchemas.updateUserValidationSchema),
  userControllers.updateUserProfile,
);

userRouter.get("/profile", authorizeApiMiddleware("user"), userControllers.getUserProfile);

export default userRouter;
