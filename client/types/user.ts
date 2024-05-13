export type User = {
  bio: string;
  created_at: string;
  email: string;
  id: string;
  image: string;
  image_asset_id: string;
  updated_at: string;
  username: string;
  user_id: string;
};
export interface UserInvite {
  user_to_invite: string;
  invitator: string;
  status: string;
  id: string;
  username: string;
  email: string;
  image: string;
  created_at: string;
  updated_at: string;
}
