import { z } from "zod";

const textSchema = z.object({
    sender: z.string(),
    receiver: z.string(),
    type: z.literal("text"),
    text: z.string().min(1),
});

const fileSchema = z.object({
    sender: z.string(),
    receiver: z.string(),
    type: z.literal("file"),
});

const callSchema = z.object({
    sender: z.string(),
    receiver: z.string(),
    type: z.literal("call"),
    call: z.object({
        callType: z.enum(["audio", "video"]),
        status: z.enum(["missed", "completed", "rejected"]),
    }),
});

export const createMessageZodSchema = z.union([
    textSchema,
    fileSchema,
    callSchema,
]);