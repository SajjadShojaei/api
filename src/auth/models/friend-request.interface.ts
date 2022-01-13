import { User } from "./user.class";

export type FriendRequest_status = 'pending' | 'accepted ' | 'declined';

export interface FriendRequeststatus {
    status?: FriendRequest_status;
}

export interface FriendRequest {
    id?: number;
    creator?: User;
    reciver?: User;
    status?: FriendRequest_status;
}