import { getBannedMembers } from "@/helper/members";
import { isMemberOrAdmin } from "@/helper/server";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

type Props = {
  params: {
    id: string
  }
}

export default async function ServerDetail({ params }: Props) {
  const { userId } = auth()
  if (!userId) {
    redirect('/sign-in')
  }
  const { isAuthor, isMember } = await isMemberOrAdmin(userId, params.id)
  const bannedMembers = await getBannedMembers(params.id)
  const userIds = bannedMembers.map(member => member.id)

  if (userIds.includes(userId)) {
    redirect('/direct-messages')
  }
  if (!isAuthor && !isMember) {
    redirect('/direct-messages')
  }
  return <div></div>
}
