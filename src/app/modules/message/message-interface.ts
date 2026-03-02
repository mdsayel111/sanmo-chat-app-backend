export type MessageType = "text" | "file" | "call";
export type CallType = "audio" | "video";

export type TFile = {
    fileUrl: string;
    fileName: string;
    mimeType: string;
    size: number;
}

export type TCall = {
    callType: CallType;
    startedAt: Date;
    endedAt?: Date;
    duration?: number;
    status: "missed" | "completed" | "rejected";
}

export type TMessage = {
    sender: string;
    type: MessageType;
    text?: string;
    file?: TFile;
    call?: TCall;
    createdAt?: Date;
    updatedAt?: Date;
    readBy?: string[];
    isDeleted?: boolean;
}