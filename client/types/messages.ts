export type Message = {
	channel_id: string;
	message_id: string;
	id: string;
	content: string;
	is_read: boolean;
	user_id: string;
	image_url: string | null;
	image_asset_id: string | null;
	created_at: string;
	updated_at: string;
	username: string;
	email: string;
	image: string;
};
