import { toast } from "sonner";
import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { useSWRConfig } from "swr";
import { useAuth } from "@clerk/nextjs";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useDebounce } from "@/hooks/useDebounce";
import { searchUser } from "@/helper/user";
import { User } from "@/types/user";
import { getCreatedDate } from "@/utils/createdDate";
import { Button } from "../ui/button";
import { inviteUser } from "@/actions/user";
import { createError } from "@/utils/error";

export default function InviteUser() {
  const {mutate}=useSWRConfig()
  const { userId } = useAuth();
  const [value, setValue] = useState<string>("");
  const [result, setResult] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { debouncedValue } = useDebounce(value, 1000);

  const handleInviteUser = async (id: string) => {
    try {
      await inviteUser(id, userId!!).then((msg) => {
        toast.success(msg.messages);
        mutate('pending-invitations')
      });
    } catch (error) {
      createError(error);
    }
  };

  useEffect(() => {
    if (debouncedValue === "") return;

    (async () => {
      setLoading(true);
      const result = await searchUser(debouncedValue, userId!!);
      setResult(result);
      setLoading(false);
    })();

    return () => {
      setResult([]);
    };
  }, [debouncedValue, userId]);

  return (
    <Dialog onOpenChange={(isOpen) => !isOpen && setResult([])}>
      <DialogTrigger asChild>
        <li className="min-w-max cursor-pointer rounded bg-green-700 px-3 py-1 text-sm font-semibold text-white data-[state=open]:bg-transparent data-[state=open]:text-green-600">
          Add Friend
        </li>
      </DialogTrigger>
      <DialogContent className="border-none bg-black  md:bg-background">
        <DialogTitle className="uppercase text-white">add friend</DialogTitle>
        <input
          defaultValue={value}
          onChange={(e) => setValue(e.target.value)}
          value={value}
          className="w-full rounded bg-foreground p-3 text-gray-2 placeholder:text-sm focus-visible:outline-none"
          type="search"
          placeholder="Add user by their username"
        />
        <div>
          {loading && (
            <div className="h-10 w-full animate-pulse bg-background brightness-125"></div>
          )}
          {result.length >= 1 &&
            result?.map((result) => (
              <Suspense
                key={result.id}
                fallback={
                  <div className="h-10 w-full animate-pulse bg-background brightness-125"></div>
                }
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Image
                      src={result.image}
                      width={50}
                      height={50}
                      alt="user"
                      className="size-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-base font-semibold capitalize leading-tight text-gray-2">
                        {result.username}
                      </h3>
                      <p className="text-[10px] text-gray-2">
                        Joined {getCreatedDate(new Date(result.created_at))}
                      </p>
                    </div>
                  </div>
                  <DialogClose asChild>
                    <Button onClick={() => handleInviteUser(result.id)}>
                      Invite
                    </Button>
                  </DialogClose>
                </div>
              </Suspense>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
