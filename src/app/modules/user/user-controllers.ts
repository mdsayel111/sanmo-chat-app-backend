import { RequestHandler } from "express";
import catchAsync from "../../middlewares/HOF-middlewares/catch-async-middleware";
import userService from "./user-service";

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
})

// auth controllers
const userControllers = {
    updateUserProfile,
};

export default userControllers;
