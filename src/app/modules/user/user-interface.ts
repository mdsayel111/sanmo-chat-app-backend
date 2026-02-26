import { Types } from "mongoose";

// creat role type
export type TRole = "user" | "admin";

// creat user type
export type TUser = {
  _id: Types.ObjectId;
  name: string;
  password: string;
  phone: string;
  role: TRole;
  address: string;
  designation: string;
  image: string;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  isDeleted: boolean;
};
