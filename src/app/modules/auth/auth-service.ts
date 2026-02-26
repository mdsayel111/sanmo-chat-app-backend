/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import AppError from "../../custom-error/app-error";
import { TUser } from "../user/user-interface";
import { User } from "../user/user-model";

// Temp otp
const otpStore: Record<string, string> = {};

// create otp service
const getOTP = async (payload: Pick<TUser, "phone">) => {
  // generate random 6 digit otp
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[payload.phone] = otp;

  setTimeout(() => {
    delete otpStore[payload.phone];
  }, 60000);

  return otp;
};

const verifyOTP = async (payload: Pick<TUser, "phone"> & { otp: string }) => {
  // check if otp exist or not
  if (!otpStore[payload.phone]) {
    throw new AppError(400, "OTP is not exist !");
  }

  // check if otp is correct or not
  if (otpStore[payload.phone] !== payload.otp) {
    throw new AppError(400, "OTP is incorrect !");
  }

  const userFromDB = await User.findOne({ phone: payload.phone }).select(
    "+isDeleted",
  );

  // if user exist
  if (userFromDB) {
    return userFromDB.toObject();
  } else {
    const data = await createUser(payload);
    if (data) {
      delete otpStore[payload.phone];
    }
    return data;
  }
};

// create user service
const createUser = async (payload: Pick<TUser, "phone">) => {
  // create user
  const user = await User.create(payload);

  // if user is null
  if (!user) {
    throw new AppError(400, "Failed to create user !");
  }

  return user.toObject();
};

// create admin service
const createAdmin = async (payload: TUser) => {
  // do role = "admin" forcefully, because admin can create only admin account
  payload.role = "admin";

  // create user
  const adminInfo = await User.create(payload);

  // if user is null
  if (!adminInfo) {
    throw new AppError(400, "Failed to create admin !");
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  /* eslint-disable no-unused-vars */
  // delete isDeleted property by destructuring
  const { isDeleted, password, ...userInfo } = adminInfo.toObject();

  return userInfo;
};

// auth services
const authService = {
  createUser,
  createAdmin,
  getOTP,
  verifyOTP,
};

export default authService;
