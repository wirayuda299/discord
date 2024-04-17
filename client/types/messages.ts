export interface Message {
	message_id: string;
	message: string;
	author_id: string;
	is_read: boolean;
	media_image: string;
	media_image_id: string;
	msg_created_at: string;
	msg_updated_at: string;
	author_name: string;
	author_image: string;
	reactions: {
		emoji: string;
		unified_emoji: string;
		count: number;
	}[];
	reply_id?: string;
}

export interface MessageData {
	content: string;
	is_read: boolean;
	user_id: string | undefined;
	username: string | undefined;
	channel_id: string;
	server_id: string;
	image_url: string;
	image_asset_id: string;
	avatar: string | undefined;
	type: string;
	messageId?: string;
}
