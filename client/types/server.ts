type Settings = {
  server_id: string;
  show_progress_bar: boolean;
  show_banner_background: boolean;
};
export interface ServerProfile {
  server_id: string;
  user_id: string;
  username: string;
  avatar_asset_id: string;
  bio: string;
  avatar: string;
}

export type Servers = {
  id: string;
  name: string;
  logo: string;
  owner_id: string;
  level_progress: number;
  level: number;
  boost_count: number;
  created_at: string;
  updated_at: string;
  banner: string | null;
  banner_asset_id: string | null;
  logo_asset_id: string;
  invite_code: string;
  serverProfile: ServerProfile;
  settings: Settings;
};

interface UserRole {
  role_id: string;
  permission_id: string;
  id: string;
  name: string;
  server_id: string;
  role_color: string;
  icon: string;
  icon_asset_id: string;
  manage_channel: boolean;
  manage_role: boolean;
  kick_member: boolean;
  ban_member: boolean;
  attach_file: boolean;
  manage_thread: boolean;
  manage_message: boolean;
  user_id: string;
}
export type Member = {
	id: string;
	server_id: string;
	user_id: string;
	role: UserRole;
	username: string;
	avatar_asset_id: string | null;
	bio: string | null;
	avatar: string;
};

export interface MemberWithRole extends Member {
	role_id: string;
	permission_id: string;
	name: string;
	role_color: string;
	icon: string;
	icon_asset_id: string;
}


export type Permission = {
	role_id: string;
	permission_id: string;
	id: string;
	manage_channel: boolean;
	manage_role: boolean;
	kick_member: boolean;
	ban_member: boolean;
	attach_file: boolean;
	manage_thread: boolean;
	manage_message: boolean;
};