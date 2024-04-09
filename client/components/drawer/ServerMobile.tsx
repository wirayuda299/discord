import { Bell, ChevronRight, Cog } from "lucide-react";
import Image from "next/image";
import { KeyedMutator } from "swr";
import { toast } from "sonner";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Servers } from "@/types/server";
import CreateChannelDrawerMobile from "./create-channel";
import CreateCategoryMobile from "./create-category";
import AddUserDrawer from "./add-user";
import DeleteServer from "../modals/delete-server";
import UpdateServerDrawer from "./update-server";

export default function ServerDrawerMobile<T>({
  server,
  mutate,
}: {
  server: Servers;
  mutate: KeyedMutator<T>;
}) {
  const { userId } = useAuth();
  const [isCopied, setIsCopied] = useState<boolean>(false);
  if (!server) return null;

  function copyText(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Server id copied");
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 4000);
    });
  }

  return (
    <Drawer>
      <DrawerTrigger>
        <ChevronRight className="text-gray-2" size={18} />
      </DrawerTrigger>
      <DrawerContent className="top-0 !h-full  border-none bg-black p-3">
        <div className="min-h-full overflow-y-auto pb-28">
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
            <div className="bg-green-1 size-2 rounded-full"></div>
            <span>0 Online</span>
            <div className="bg-gray-2 size-2 rounded-full"></div>
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
              <p className="text-gray-2 text-xs font-semibold capitalize">
                boost
              </p>
            </li>
            <li className="flex flex-col items-center">
              <AddUserDrawer size={25} />
              <p className="text-gray-2 text-xs font-semibold capitalize">
                invite
              </p>
            </li>
            <li className="flex flex-col items-center">
              <Bell />
              <p className="text-gray-2 text-xs font-semibold capitalize">
                notifications
              </p>
            </li>
            <li className="flex flex-col items-center">
              <Cog />
              <p className="text-gray-2 text-xs font-semibold capitalize">
                settings
              </p>
            </li>
          </ul>

          <ul className="bg-background/25 divide-background mt-8  gap-3 divide-y rounded-md p-3 text-white">
            <CreateChannelDrawerMobile serverId={server?.id} mutate={mutate} />
            <CreateCategoryMobile />
            <li className="py-3 text-sm font-semibold capitalize">
              create event
            </li>
          </ul>

          <ul className="bg-background/25 mt-8  divide-y divide-gray-700 rounded-md p-3 text-white">
            {userId === server.owner_id && (
              <UpdateServerDrawer
                logo={server.logo}
                name={server.name}
                logoAssetId={server.logo_asset_id}
                serverId={server.id}
              />
            )}
            <li className="py-3 text-sm font-semibold capitalize">
              Report raid
            </li>
            <li className="py-3 text-sm font-semibold capitalize">
              Report server
            </li>
          </ul>
          <div className="h-max">
            <h3 className="mt-3 text-base font-semibold text-white">
              Developer mode
            </h3>
            <button
              disabled={isCopied}
              aria-disabled={isCopied}
              onClick={() => copyText(server.id)}
              className="bg-background/25 mt-3 w-full p-2 text-left font-semibold capitalize text-white disabled:cursor-not-allowed"
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
