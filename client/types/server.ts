type Settings = {
  server_id: string;
  show_progress_bar: boolean;
  show_banner_background:boolean
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
	boost_count:number;
	created_at: string;
	updated_at: string;
	banner: string | null;
	banner_asset_id: string | null;
	logo_asset_id: string;
	invite_code: string;
	serverProfile: ServerProfile;
	settings: Settings;
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
