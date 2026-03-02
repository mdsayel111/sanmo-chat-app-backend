import { TChat } from "./chat-interface";
import { Chat } from "./chat-mode";


/**
 * Create message
 */
export const createMessage = async (payload: TChat) => {
    return await Chat.create(payload);
};

/**
 * Get conversation
 */
export const getConversation = async (
    user1: string,
    user2: string
) => {
    return await Chat.find({
        $or: [
            { sender: user1, receiver: user2 },
            { sender: user2, receiver: user1 },
        ],
        isDeleted: false,
    }).sort({ createdAt: 1 });
};

/**
 * Mark message as read
 */
export const markAsRead = async (messageId: string) => {
    return await Chat.findByIdAndUpdate(
        messageId,
        {
            isRead: true,
            readAt: new Date(),
        },
        { new: true }
    );
};

/**
 * Delete message globally
 */
export const deleteMessage = async (messageId: string) => {
    return await Chat.findByIdAndUpdate(
        messageId,
        { isDeleted: true },
        { new: true }
    );
};