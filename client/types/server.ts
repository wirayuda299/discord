export type Servers = {
  id: string;
  name: string;
  logo: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  logo_asset_id: string;
  invite_code: string;
};

export type Member = {
  id: string;
  name: string;
  logo: string;
  logo_asset_id: string;
  owner_id: string;
  invite_code: string;
  created_at: string;
  updated_at: string;
  server_id: string;
  user_id: string;
  member_id: string;
  role_id: string;
  username: string;
  email: string;
  image: string;
  permission_id: string;
  send_message: boolean;
  read_message: boolean;
  manage_message: boolean;
  manage_channel: boolean;
  manage_roles: boolean;
};

export interface ServerProfile {
  server_id: string;
  user_id: string;
  username: string;
  avatar: string;
  avatar_asset_id: null | string;
  bio: null | string;
}
