/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { deleteFileIfExists } from "../../../lib/multer";
import { socketUserStore } from "../../../stores/socket";
import AppError from "../../custom-error/app-error";
import { TUser } from "./user-interfaces";
import { User } from "./user-model";

// update user profile service
const updateUserProfile = async (
  payload: TUser & {
    emergencyContactName: string;
    emergencyContactPhone: string;
    emergencyContactRelation: string;
  },
) => {
  const userFromDb = await User.findOne({ phone: payload.phone });
  if (!userFromDb) {
    throw new AppError(404, "User not found");
  }

  const oldImage = userFromDb.image;

  const updatedUser = await User.findOneAndUpdate(
    { phone: payload.phone },
    {
      ...payload,
      emergencyContact: {
        name: payload.emergencyContactName,
        phone: payload.emergencyContactPhone,
        relation: payload.emergencyContactRelation,
      },
    },
    { new: true, runValidators: true },
  );

  if (!updatedUser) {
    throw new AppError(400, "Failed to update user profile!");
  }

  // Delete old image AFTER successful update
  if (payload.image && oldImage && payload.image !== oldImage) {
    await deleteFileIfExists(oldImage);
  }

  return updatedUser.toObject();
};

// get user profile service
const getUserProfile = async (phone: string) => {
  // get user profile
  const user = await User.findOne({ phone: phone }).select("+isDeleted");

  if (!user) {
    throw new AppError(400, "Failed to get user profile !");
  }

  return user.toObject();
};

const getUserProfileById = async (id: string) => {
  // get user profile
  const user = await User.findById(id).select("-password -isDeleted");

  if (!user) {
    throw new AppError(400, "Failed to get user profile !");
  }

  return user.toObject();
};

const getAllUsers = async (currentUserId: string) => {
  const users = await User.find({ isDeleted: false, _id: { $ne: currentUserId } }).select("-password -isDeleted");
  const socketUserIds = Object.keys(socketUserStore);
  const activeUsers = users.filter((user) => socketUserIds.includes(user._id.toString()));
  const inactiveUsers = users.filter((user) => !socketUserIds.includes(user._id.toString()));
  return {
    activeUsers,
    inactiveUsers,
  };
}

// user services
const userService = {
  updateUserProfile,
  getUserProfile,
  getUserProfileById,
  getAllUsers,
};

export default userService;
