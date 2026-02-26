import { Schema, model } from "mongoose";
import { TUser } from "./user-interface";

// create schema
const userSchema = new Schema<TUser>(
  {
    name: { type: String },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    phone: { type: String, required: true },
    address: { type: String },
    designation: { type: String },
    image: { type: String },
    emergencyContact: {
      type: {
        name: { type: String },
        phone: { type: String },
        relation: { type: String },
      },
      required: false,
    },
    isDeleted: { type: Boolean, required: false, select: false },
  },
  { timestamps: true },
);

// create model
export const User = model<TUser>("User", userSchema);
