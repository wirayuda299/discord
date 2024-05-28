import { Socket } from "socket.io-client";
import { Message } from "./messages";

export type BannedMembers = {
  member_id: string;
  server_id: string;
  banned_by: string;
  id: string;
  username: string;
  email: string;
  created_at: string;  
  updated_at: string; 
  bio: string | null;
  image_asset_id: string | null;
  image: string;

}
export type SocketStates = {
	channel_messages: Message[];
	active_users: string[];
	personal_messages: Message[];
	thread_messages: Message[];
	socket: Socket | null;
	isConnected: boolean;
};
