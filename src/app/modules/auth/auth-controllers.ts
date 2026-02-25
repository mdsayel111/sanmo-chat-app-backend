import { RequestHandler } from "express";
import catchAsync from "../../middlewares/HOF.middlewares/catch-async.middleware";
import sendResponse from "../../utils/send-response";
import authService from "./auth-service";
import { createToken } from "../../../lib/jwt";

// create admin middleware
// wrap the middleware by catch async for async error handling
const createAdmin: RequestHandler = catchAsync(async (req, res) => {
  // create admin
  const adminInfo = await authService.createAdmin(req.body);

  // send response
  sendResponse(res, {
    success: true,
    message: "Admin registered successfully",
    data: adminInfo,
  });
});

// get otp middleware
// wrap the middleware by catch async for async error handling
const getOTP: RequestHandler = catchAsync(async (req, res) => {
  // create otp
  const otp = await authService.getOTP(req.body);

  // send response
  sendResponse(res, {
    success: true,
    message: "OTP generated successfully",
    data: otp,
  });
});

// verify otp middleware
// wrap the middleware by catch async for async error handling
const verifyOTP: RequestHandler = catchAsync(async (req, res) => {
  // verify otp
  const userData =await authService.verifyOTP(req.body);
const data ={
  user: userData,
  token: createToken({ phone: userData.phone, role: userData.role })
}
  // send response
  sendResponse(res, {
    success: true,
    message: "OTP verified successfully",
    data: data,
  });
});

// auth controllers
const authControllers = {
  createAdmin,
  getOTP,
  verifyOTP,
};

export default authControllers;
