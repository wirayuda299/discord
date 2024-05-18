import { Bell, ChevronRight, Cog, UserPlus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Servers } from "@/types/server";
import CreateChannelDrawerMobile from "@/components/servers/channels/create-channel";
import DeleteServer from "@/components/servers/delete-server";
import UpdateServerDrawer from "./update-server";
import { copyText } from "@/utils/copy";
import AddUser from "./add-user";

export default function ServerDrawerMobile({ server }: { server: Servers }) {
  const { userId } = useAuth();
  const [isCopied, setIsCopied] = useState<boolean>(false);
  if (!server) return null;

  return (
    <Drawer>
      <DrawerTrigger>
        <ChevronRight className="text-gray-2" size={18} />
      </DrawerTrigger>
      <DrawerContent className="top-0 !h-full border-none bg-black p-0">
        <div className="min-h-full overflow-y-auto px-3 pb-32">
          {server.logo && (
            <Image
              src={server?.logo}
              width={50}
              priority
              height={50}
              alt="server logo"
              className="size-14 rounded-full object-cover"
            />
          )}
          <h2 className="mt-3 text-xl font-semibold capitalize text-white">
            {server?.name}
          </h2>

          <div className="mt-1 flex items-center gap-3 text-xs text-white">
            <div className="size-2 rounded-full bg-green-1"></div>
            <span>0 Online</span>
            <div className="size-2 rounded-full bg-gray-2"></div>
            <span>0 Member</span>
          </div>

          <ul className="mt-5 flex justify-between text-white">
            <li className="flex flex-col items-center">
              <Image
                src={"/icons/boost.svg"}
                width={25}
                height={25}
                alt="boost"
                className="aspect-auto object-contain"
              />
              <p className="text-xs font-semibold capitalize text-gray-2">
                boost
              </p>
            </li>
            <li className="flex flex-col items-center">
              <AddUser>
                <UserPlus />
              </AddUser>
              <p className="text-xs font-semibold capitalize text-gray-2">
                invite
              </p>
            </li>
            <li className="flex flex-col items-center">
              <Bell />
              <p className="text-xs font-semibold capitalize text-gray-2">
                notifications
              </p>
            </li>
            <li className="flex flex-col items-center">
              <Cog />
              <p className="text-xs font-semibold capitalize text-gray-2">
                settings
              </p>
            </li>
          </ul>

          <ul className="mt-8 gap-3 divide-y  divide-background rounded-md bg-background/25 p-2 text-white">
            <CreateChannelDrawerMobile serverId={server?.id} />
          </ul>

          <ul className="mt-8 divide-y  divide-gray-700 rounded-md bg-background/25 p-2 text-white">
            {userId === server.owner_id && (
              <UpdateServerDrawer
                logo={server.logo}
                name={server.name}
                logoAssetId={server.logo_asset_id}
                serverId={server.id}
              />
            )}
            <li className="py-2 text-sm font-semibold capitalize">
              <button
                disabled
                className="disabled:cursor-not-allowed disabled:opacity-60"
              >
                Report raid
              </button>
            </li>
            <li className="py-2 text-sm font-semibold capitalize">
              <button
                disabled
                className="disabled:cursor-not-allowed disabled:opacity-60"
              >
                Report server
              </button>
            </li>
          </ul>
          <div className="h-max">
            <h3 className="mt-3 text-base font-semibold text-white">
              Developer mode
            </h3>
            <button
              disabled={isCopied}
              aria-disabled={isCopied}
              onClick={() =>
                copyText(server.id, "Server ID copied", () => {
                  setIsCopied(true);

                  setTimeout(() => {
                    setIsCopied(false);
                  }, 2000);
                })
              }
              className="mt-3 w-full bg-background/25 p-2 text-left text-sm font-semibold capitalize text-white disabled:cursor-not-allowed"
            >
              Copy server id
            </button>
          </div>
          {userId === server.owner_id && (
            <DeleteServer
              serverId={server.id}
              logoAssetId={server.logo_asset_id}
            />
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
