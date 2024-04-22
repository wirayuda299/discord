import { UserPlus, ChevronRightIcon } from "lucide-react";
import Image from "next/image";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function AddFriendSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="bg-foreground flex w-full items-center justify-between gap-2 rounded-full p-2">
          <div className="flex items-center gap-2">
            <div className="bg-primary flex size-8 items-center justify-center rounded-full ">
              <UserPlus size={18} fill="#fff" className="text-center" />
            </div>
            <span className="text-base font-semibold capitalize">
              Invite members
            </span>
          </div>
          <ChevronRightIcon />
        </button>
      </SheetTrigger>
      <SheetContent side={"bottom"} className="border-none bg-black text-white">
        <SheetHeader>
          <SheetTitle className="text-white">Invite a friend</SheetTitle>
          <div className="pt-3">
            <div className="bg-foreground flex w-full items-center justify-between rounded-full px-3 py-1">
              <div className="flex items-center gap-2">
                <Image
                  src={"/icons/discord.svg"}
                  width={30}
                  height={30}
                  alt="user"
                />
                <h3 className="text-sm font-semibold">Username</h3>
              </div>
              <button className="bg-background rounded-full px-3 py-1 text-xs">
                Invite
              </button>
            </div>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
