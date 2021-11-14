import { User } from "./user.interface";

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