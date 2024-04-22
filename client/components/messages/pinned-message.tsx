import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { getPinnedMessages } from "@/helper/message";

export default function PinnedMessage({ channelId }: { channelId: string }) {
  const { data, isLoading } = useSWR("pinned-messages", () =>
    getPinnedMessages(channelId),
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Image
          src={"/icons/pin.svg"}
          width={24}
          height={24}
          alt={"pin"}
          key={"pin"}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-4 min-w-64 border-none bg-background p-0">
        <header className="min-h-12 bg-foreground p-2 text-gray-2">
          <h3 className="text-base font-semibold">Pinned Message</h3>
        </header>
        {(data && data?.length < 1) || isLoading ? (
          <div className="flex min-h-60 w-full flex-col items-center justify-center">
            <Image
              src={"/icons/boom.svg"}
              width={100}
              height={100}
              alt={"boom"}
              key={"boom"}
            />
            <p className="max-w-[calc(100%-50px)] pt-2 text-center text-sm text-white">
              This channel doesn&apos;t have any pinned messages...yet.
            </p>
          </div>
        ) : (
          <div className="size-full max-h-48 max-w-96 space-y-3 overflow-y-auto">
            {data?.map((msg) => (
              <div
                key={msg.message_id}
                className="group relative flex gap-2 p-3 text-gray-2 hover:bg-background hover:brightness-110"
              >
                <Image
                  className="aspect-auto size-10 rounded-full object-cover"
                  src={msg.image}
                  width={30}
                  height={30}
                  alt="author"
                />
                <div>
                  <h4 className="text-sm font-semibold">{msg.username}</h4>
                  <p className=" break-before-auto whitespace-pre-wrap break-all text-sm font-light">
                    {msg.content}
                  </p>
                </div>
                <Link
                  href={`#${msg.message_id}`}
                  className="absolute right-2 top-2	 hidden rounded-md bg-background px-3 py-1 text-xs brightness-125 group-hover:block"
                >
                  jump
                </Link>
              </div>
            ))}
          </div>
        )}
        <footer className="min-h-16 bg-foreground p-2 text-white">
          <h4 className="text-center text-base font-semibold uppercase text-green-600">
            ProTip:
          </h4>
          <p className="pt-2  text-center text-sm text-gray-2">
            User with &apos;Manage messages&apos; can pin a message <br /> from
            it&apos;s context menu.
          </p>
        </footer>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
