/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import AppError from "../../custom-error/app-error";
import { TUser } from "../user/user-interface";
import { User } from "../user/user-model";

// update user profile service
const updateUserProfile = async (payload: TUser) => {
    // update user profile
    const user = await User.findOneAndUpdate({ phone: payload.phone }, payload, {
        new: true,
        runValidators: true,
    });

    if (!user) {
        throw new AppError(400, "Failed to update user profile !");
    }
    
    return user.toObject();
};

// user services
const userService = {
    updateUserProfile,
};

export default userService;
