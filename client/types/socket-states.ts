import type { Socket } from 'socket.io-client';

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
};
export type SocketStates = {
  active_users: string[];
  socket: Socket | null;
  isConnected: boolean;
};
