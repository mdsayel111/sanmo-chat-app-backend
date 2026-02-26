import express from "express";
import validateRequestBody from "../../middlewares/HOF-middlewares/validate-middleware";
import authControllers from "./auth-controllers";
import authZodSchemas from "./auth-validation-schema";

// create router
const authRouter = express.Router();

// otp route
authRouter.post(
  "/get-otp",
  validateRequestBody(authZodSchemas.getOTPValidationSchema),
  authControllers.getOTP,
);

authRouter.post(
  "/verify-otp",
  validateRequestBody(authZodSchemas.loginValidationSchema),
  authControllers.verifyOTP,
);

// create admin route
// authRouter.post(
//   "/create-admin",
//   authorize("admin"),
//   validateRequestBody(authZodSchemas.signupValidationSchema),
//   authControllers.createAdmin,
// );

export default authRouter;
