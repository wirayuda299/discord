import { BannedMembers } from '@/types/socket-states';

export const findBannedMembers = (
  bannedMembers: BannedMembers[],
  userId: string,
) => {
  return (
    bannedMembers.length >= 1 &&
    bannedMembers.find((member) => member.member_id === userId)
  );
};
