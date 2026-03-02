import { RequestHandler } from "express";
import catchAsync from "../../middlewares/HOF-middlewares/catch-async-middleware";
import { Chat } from "./chat-mode";
import { User } from "../user/user-model";
import AppError from "../../custom-error/app-error";
import sendResponse from "../../utils/send-response";

// update user profile middleware
// wrap the middleware by catch async for async error handling
const getChats: RequestHandler = catchAsync(async (req, res) => {
    const searchQuery = (req.query.searchQuery as string)?.trim() || "";

    if (!searchQuery) {
        return sendResponse(res, {
            success: true,
            message: "No search query provided",
            data: [],
        });
    }

    const currentUser = await User.findOne({ phone: req.user?.phone }).select("_id");

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
        .populate({
            path: "members",
            select: "name phone image",
        })
        .select("members");

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
            id: chat._id, // conversation id
            name: otherUser?.name,
            phone: otherUser?.phone,
            image: otherUser?.image,
            searchField,
            matchScore,
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
            id: user._id, // user id (new private chat)
            name: user.name,
            phone: user.phone,
            image: user.image,
            searchField,
            matchScore,
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
        .select("name image")
        .limit(30);

    const formattedGroups = groups.map(group => {
        const name = group.name?.toLowerCase() || "";
        const nameMatch = getMatchType(name);

        return {
            type: "group",
            id: group._id,
            name: group.name,
            image: group.image,
            searchField: nameMatch > 0 ? "name" : "",
            matchScore: nameMatch,
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

    const combinedResults = [
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
    console.log(combinedResults)
    sendResponse(res, {
        success: true,
        message: "Chats retrieved successfully",
        data: combinedResults,
    });
});

// auth controllers
const chatControllers = {
    getChats,
};

export default chatControllers;
