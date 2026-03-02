import { Schema, model } from "mongoose";
import { TMessage } from "./message-interface";

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

const messageSchema = new Schema<TMessage>(
    {
        sender: { type: String, required: true, index: true },
        type: {
            type: String,
            enum: ["text", "file", "call"],
            required: true,
        },
        text: String,
        file: fileSchema,
        call: callSchema,
        isDeleted: { type: Boolean, default: false },
        readBy: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        chat: {
            type: Schema.Types.ObjectId,
            ref: "Chat",
            required: true,
        },
    },
    { timestamps: true }
);

export const Message = model<TMessage>("Message", messageSchema);