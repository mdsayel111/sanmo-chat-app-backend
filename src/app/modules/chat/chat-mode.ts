import { Schema, model } from "mongoose";
import { TChat } from "./chat-interface";

const fileSchema = new Schema(
    {
        fileUrl: String,
        fileName: String,
        mimeType: String,
        size: Number,
    },
    { _id: false }
);

const callSchema = new Schema(
    {
        callType: { type: String, enum: ["audio", "video"] },
        startedAt: Date,
        endedAt: Date,
        duration: Number,
        status: {
            type: String,
            enum: ["missed", "completed", "rejected"],
        },
    },
    { _id: false }
);

const chatSchema = new Schema<TChat>(
    {
        sender: { type: String, required: true, index: true },
        receiver: { type: String, required: true, index: true },
        type: {
            type: String,
            enum: ["text", "file", "call"],
            required: true,
        },
        text: String,
        file: fileSchema,
        call: callSchema,
        isDeleted: { type: Boolean, default: false },
        readAt: Date,
    },
    { timestamps: true }
);

chatSchema.index({ sender: 1, receiver: 1, createdAt: 1 });

export const Chat = model<TChat>("Chat", chatSchema);