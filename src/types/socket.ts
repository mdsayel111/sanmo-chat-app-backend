import { TUser } from "../app/modules/user/user-interfaces";

export type TSocketData = {
    user: Pick<TUser, "_id" | "phone" | "role">;
}