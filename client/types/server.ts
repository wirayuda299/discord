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
  created_at: string;
  updated_at: string;
  logo_asset_id: string;
  invite_code: string;
  serverProfile: ServerProfile;
};

export type Member = {
	id: string;
	server_id: string;
	user_id: string;
	role: string;
	username: string;
	avatar_asset_id: string | null;
	bio: string | null;
	avatar: string;
};
