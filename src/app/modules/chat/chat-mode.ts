import { Schema, model } from "mongoose";
import { TChat } from "./chat-interface";

const chatSchema = new Schema<TChat>(
    {
        id: String,
        name: String,
        image: String,
        type: { type: String, enum: ["group", "private"] },
        members: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    { timestamps: true }
);
chatSchema.index({ name: 1, phone: 1, createdAt: 1 });

export const Chat = model<TChat>("Chat", chatSchema);