'use client'

import Image from "next/image";
import { useSWRConfig } from "swr";

import { getPendingInvitation } from "@/helper/user";
import useFetch from "@/hooks/useFetch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCreatedDate } from "@/utils/createdDate";
import { cancelInvitation } from "@/actions/invitation";
import { createError } from "@/utils/error";

export default function PendingInvitation({ userId }: { userId: string }) {
  const { mutate } = useSWRConfig();
  const { data, isLoading } = useFetch("pending-invitation", () =>
    getPendingInvitation(userId!!),
  );
  const handleCancleInvitation = async () => {
    try {
      await cancelInvitation(userId!!).then(() => {
        mutate("pending-invitation");
      });
    } catch (error) {
      createError(error);
    }
  };

  return (
    <div className="flex flex-col gap-3 divide-y divide-gray-800 p-3">
      {isLoading
        ? [1, 2, 3, 4].map((c) => (
            <div
              key={c}
              className="h-10 w-full animate-pulse rounded-md bg-background brightness-125"
            ></div>
          ))
        : data?.map((pendingInvitation, i) => (
            <div
              key={pendingInvitation?.user_to_invite}
              className={cn(
                "flex items-center hover:bg-background hover:brightness-125 justify-between gap-2 p-2 rounded-md",
                i > 0 && "pt-5",
              )}
            >
              <div className="flex items-center gap-2">
                <Image
                  src={pendingInvitation.image}
                  width={50}
                  height={50}
                  loading="lazy"
                  alt="user"
                  className="size-14 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-base font-semibold capitalize text-gray-2">
                    {pendingInvitation?.username}
                  </h4>
                  <p className="text-xs text-gray-2">
                    Invited{" "}
                    {getCreatedDate(new Date(pendingInvitation.created_at))}
                  </p>
                </div>
              </div>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancleInvitation();
                }}
                size="sm"
                variant="destructive"
              >
                Cancel
              </Button>
            </div>
          ))}
    </div>
  );
}
