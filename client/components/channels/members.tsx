import Image from "next/image";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Servers } from "@/types/server";
import { useSocketContext } from "@/providers/socket-io";

export default function MemberSheet({
  selectedServer,
}: {
  selectedServer: Servers | null;
}) {
  const { activeUsers } = useSocketContext();
  if (!selectedServer) return null;

  return (
    <Sheet>
      <SheetTrigger>
        <Image
          src={"/icons/member.svg"}
          width={24}
          height={24}
          alt={"member"}
          key={"member"}
        />
      </SheetTrigger>
      <SheetContent className="flex min-h-screen w-60 flex-col gap-4 overflow-y-auto border-none bg-[#2b2d31] p-5">
        <div className="border-b border-gray-1 pb-5">
          <h3 className="text-base font-semibold text-gray-2">Author</h3>
          <div className="flex items-center gap-3 pt-2 text-white">
            <Image
              className="min-h-14 min-w-14 rounded-full object-cover"
              src={selectedServer.serverProfile.avatar}
              width={50}
              height={50}
              alt="user"
            />
            <div>
              <h3 className="text-sm font-medium capitalize leading-relaxed">
                {selectedServer.serverProfile.username}
              </h3>
              <p className="text-xs text-gray-2">
                {activeUsers.includes(selectedServer.serverProfile.user_id) ? (
                  <span className="text-green-600">online</span>
                ) : (
                  "offline"
                )}
              </p>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-2">Members</h3>
        </div>
      </SheetContent>
    </Sheet>
  );
}