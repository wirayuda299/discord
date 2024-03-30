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

export type ServerMember = {
	server_id: string;
	user_id: string;
	id: string;
	username: string;
	email: string;
	image: string;
	created_at: string;
	updated_at: string;
	channel_id: string;
	role_id: string;
	name: string;
};
