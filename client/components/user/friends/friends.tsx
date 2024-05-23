"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useSWRConfig } from "swr";
import dynamic from "next/dynamic";

import { friendtabs } from "@/constants/friends-tab";
import { formUrlQuery } from "@/lib/utils/form-url-query";
import { cn } from "@/lib/utils/mergeStyle";
import InviteUser from "@/components/user/invite-user";
import useFetch from "@/hooks/useFetch";
import { getMyInvitation } from "@/helper/user";
import { Button } from "@/components/ui/button";
import { createError } from "@/utils/error";
import { acceptinvitation } from "@/actions/invitation";
import Inbox from "@/components/shared/inbox";

import { useUserContext } from "@/providers/users";
const PendingInvitation = dynamic(
  () => import("@/components/user/friends/pending"),
  { ssr: false },
);
const AllFriends = dynamic(
  () => import("@/components/user/friends/all-friends"),
  { ssr: false },
);

type User = {
  user_id: string;
  username: string;
  image: string;
  created_at: string;
};

export default function Friends() {
  const { userId } = useAuth();
  const { data: myInvitations, isLoading: myInvitationsLoading } = useFetch(
    "my-invitations",
    () => getMyInvitation(userId!!),
  );
  const { mutate } = useSWRConfig();
  const searchParams = useSearchParams();
  const { handleSelectUser } = useUserContext();

  const setActiveTab = (tab: string): string => {
    const activeTab = formUrlQuery(searchParams.toString(), "tab", tab);
    return activeTab as string;
  };

  const setSelectedUser = (user: User) => handleSelectUser(user);

  const handleAcceptInvitation = async (friendId: string) => {
    try {
      if (!userId || !friendId) return 
      
      await acceptinvitation(friendId, userId).then(() => {
        const mutateKeys = [
          "pending-invitation",
          "my-invitations",
          "friend-list",
        ];
        mutateKeys.forEach((key) => {
          mutate(key);
        });
      });
    } catch (error) {
      createError(error);
    }
  };

  return (
    <div className="no-scrollbar hidden w-full overflow-x-auto md:block">
      <div className="flex w-full items-center justify-between gap-5  border-b border-b-foreground px-3 py-[13.2px]">
        <div className=" flex items-center lg:gap-5">
          <div className="flex w-full items-center gap-2">
            <Image
              src={"/icons/friend.svg"}
              width={30}
              height={30}
              alt="friend"
              className="min-w-6"
              loading="lazy"
            />
            <h3 className="hidden text-xl font-semibold text-gray-2 brightness-150 lg:block">
              Friends
            </h3>
          </div>
          <ul className="flex w-full items-center gap-1 lg:gap-2">
            {friendtabs.map((tab) => (
              <Link
                href={setActiveTab(tab)}
                className={cn(
                  "cursor-pointer rounded px-3 text-base font-normal capitalize text-gray-2 bg-background min-w-max hover:brightness-125",
                  searchParams.get("tab") === tab &&
                    "bg-background brightness-125",
                )}
                key={tab}
              >
                {tab}
              </Link>
            ))}
            <InviteUser />
          </ul>
        </div>
        <div className="flex items-center gap-3">
          <Inbox>
            {myInvitationsLoading ? (
              <p>Loading...</p>
            ) : (
              myInvitations?.map((invitation) => (
                <div
                  className="flex w-full items-center justify-between p-3"
                  key={invitation.id}
                >
                  <div className="flex items-center gap-2">
                    <Image
                      src={invitation.image}
                      width={50}
                      height={50}
                      loading="lazy"
                      alt="user"
                      className="size-14 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="text-base font-semibold capitalize text-gray-2">
                        {invitation?.username}
                      </h4>
                      <p className="text-xs text-gray-2">
                        send you friend request
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAcceptInvitation(invitation.id)}
                  >
                    Accept
                  </Button>
                </div>
              ))
            )}
          </Inbox>
          <Image
            src={"/icons/ask.svg"}
            width={24}
            height={24}
            alt={"ask"}
            key={"ask"}
          />
        </div>
      </div>
      {searchParams.get("tab") === "pending" && (
        <PendingInvitation userId={userId!!} />
      )}

      {searchParams.get("tab") === "all" && (
        <AllFriends handleSelectUser={setSelectedUser} userId={userId!!} />
      )}
    </div>
  );
}
