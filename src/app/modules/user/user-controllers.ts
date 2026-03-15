import { RequestHandler } from "express";
import catchAsync from "../../middlewares/HOF-middlewares/catch-async-middleware";
import userService from "./user-services";
import sendResponse from "../../utils/send-response";

// update user profile middleware
// wrap the middleware by catch async for async error handling
const updateUserProfile: RequestHandler = catchAsync(async (req, res) => {
  const updatedUserData = { ...req.body, phone: req.user?.phone };
  if (req.file) {
    updatedUserData.image = req.file.path;
  }

  // update user profile
  const userInfo = await userService.updateUserProfile(updatedUserData);

  res.status(200).json({
    success: true,
    message: "User profile updated successfully",
    data: userInfo,
  });
});

// get user profile middleware
// wrap the middleware by catch async for async error handling
const getUserProfile: RequestHandler = catchAsync(async (req, res) => {
  const phone = req.user?.phone as string;

  // get user profile
  const userInfo = await userService.getUserProfile(phone);

  res.status(200).json({
    success: true,
    message: "User profile retrieved successfully",
    data: userInfo,
  });
});

const getSingleUserById: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id as string;

  // get user profile
  const userInfo = await userService.getUserProfileById(id);

  sendResponse(res, {
    success: true,
    message: "User profile retrieved successfully",
    data: userInfo,
  });
});

const getAllUsers: RequestHandler = catchAsync(async (req, res) => {

  // get user profile
  const users = await userService.getAllUsers(req?.user?._id as string);
  
  sendResponse(res, {
    success: true,
    message: "User profile retrieved successfully",
    data: users,
  });
});

// auth controllers
const userControllers = {
  updateUserProfile,
  getUserProfile,
  getSingleUserById,
  getAllUsers,
};

export default userControllers;
