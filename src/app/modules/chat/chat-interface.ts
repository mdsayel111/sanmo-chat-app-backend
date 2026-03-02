import { ObjectId } from "mongoose";

export type TChat = {
    id: string;
    members: [ObjectId];
    name: string;
    image: string;
    type: "group" | "private";
}