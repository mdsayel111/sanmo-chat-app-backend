/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import AppError from "../../custom-error/app-error";
import { User } from "../user/user-model";
import { TChat } from "./chat-interfaces";
import { Chat } from "./chat-mode";

// create otp service
const getSearchChats = async (searchQuery: string, phone: string) => {
    if (!searchQuery) {
        return {
            success: true,
            message: "No search query provided",
            data: [],
        }
    }

    const currentUser = await User.findOne({ phone: phone }).select("_id");

    if (!currentUser) {
        throw new AppError(401, "You have no access to this route");
    }

    const currentUserId = currentUser._id;
    const normalizedQuery = searchQuery.toLowerCase();

    // 🔹 Helper to calculate match strength
    const getMatchType = (value: string) => {
        if (!value) return 0;
        if (value === normalizedQuery) return 3;
        if (value.startsWith(normalizedQuery)) return 2;
        if (value.includes(normalizedQuery)) return 1;
        return 0;
    };

    /*
     ===============================
     1️⃣ Existing Private Chats
     ===============================
    */

    const privateChats = await Chat.find({
        type: "private",
        members: currentUserId,
    })
        .populate("lastMessage members")
        .select("members lastMessage")


    const formattedPrivateChats = privateChats.map(chat => {
        const otherUser = (chat.members as any[]).find(
            m => m._id.toString() !== currentUserId.toString()
        );

        const name = otherUser?.name?.toLowerCase() || "";
        const phone = otherUser?.phone?.toLowerCase() || "";

        const phoneMatch = getMatchType(phone);
        const nameMatch = getMatchType(name);

        let searchField = "";
        let matchScore = 0;

        if (phoneMatch > 0) {
            searchField = "phone";
            matchScore = phoneMatch;
        } else if (nameMatch > 0) {
            searchField = "name";
            matchScore = nameMatch;
        }

        return {
            type: "private",
            _id: chat._id, // conversation id
            name: otherUser?.name,
            phone: otherUser?.phone,
            image: otherUser?.image,
            searchField,
            matchScore,
            lastMessage: chat.lastMessage,
            members: chat.members,
        };
    });
    /*
     ===============================
     2️⃣ Users WITHOUT Private Chat
     ===============================
    */

    const existingUserIds = privateChats.flatMap(chat =>
        (chat.members as any[]).filter(
            member => member._id.toString() !== currentUserId.toString()
        ).map(m => m._id)
    );

    const users = await User.find({
        _id: { $nin: [...existingUserIds, currentUserId] },
        isDeleted: { $ne: true },
        $or: [
            { name: { $regex: searchQuery, $options: "i" } },
            { phone: { $regex: searchQuery, $options: "i" } },
        ],
    })
        .populate("lastMessage members")
        .select("name phone image")
        .limit(30);

    const formattedUsers = users.map(user => {
        const name = user.name?.toLowerCase() || "";
        const phone = user.phone?.toLowerCase() || "";

        const phoneMatch = getMatchType(phone);
        const nameMatch = getMatchType(name);

        let searchField = "";
        let matchScore = 0;

        if (phoneMatch > 0) {
            searchField = "phone";
            matchScore = phoneMatch;
        } else if (nameMatch > 0) {
            searchField = "name";
            matchScore = nameMatch;
        }

        return {
            type: "user",
            _id: user._id, // user id (new private chat)
            name: user.name,
            phone: user.phone,
            image: user.image,
            searchField,
            matchScore,
            members: [user],
        };
    });

    /*
     ===============================
     3️⃣ Groups
     ===============================
    */

    const groups = await Chat.find({
        type: "group",
        name: { $regex: searchQuery, $options: "i" },
        members: currentUserId,
    })
        .populate("lastMessage members")
        .select("name image lastMessage")
        .limit(30);

    const formattedGroups = groups.map(group => {
        const name = group.name?.toLowerCase() || "";
        const nameMatch = getMatchType(name);

        return {
            type: "group",
            _id: group._id,
            name: group.name,
            image: group.image,
            searchField: nameMatch > 0 ? "name" : "",
            matchScore: nameMatch,
            lastMessage: group.lastMessage,
            members: group.members,
        };
    });

    /*
     ===============================
     4️⃣ Combine & Sort
     ===============================
    */

    const priorityMap: Record<string, number> = {
        phone: 3,
        name: 2,
        "": 1,
    };

    return [
        ...formattedPrivateChats,
        ...formattedUsers,
        ...formattedGroups,
    ]
        .filter(item => item.matchScore > 0) // only matched items
        .sort((a, b) => {
            if (priorityMap[b.searchField] !== priorityMap[a.searchField]) {
                return priorityMap[b.searchField] - priorityMap[a.searchField];
            }
            if (b.matchScore !== a.matchScore) {
                return b.matchScore - a.matchScore;
            }
            return (a.name || "").localeCompare(b.name || "");
        })
        .map(({ searchField, matchScore, ...rest }) => rest);
};

const createMessage = async (payload: TChat) => {
    return await Chat.create(payload);
};

/**
 * Get conversation
 */
const getConversation = async (
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
const markAsRead = async (messageId: string) => {
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
const deleteMessage = async (messageId: string) => {
    return await Chat.findByIdAndUpdate(
        messageId,
        { isDeleted: true },
        { new: true }
    );
};

// chat services
const chatService = {
    getSearchChats,
    createMessage,
    getConversation,
    markAsRead,
    deleteMessage,
};

export default chatService;
