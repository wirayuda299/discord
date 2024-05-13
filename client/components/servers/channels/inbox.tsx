import { ReactNode, useState } from "react";
import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const items = ["for you", "unreads", "mentions"] as const;

export default function Inbox({ children }: { children: ReactNode }) {
  const [selectedFilter, setSelectedFilter] = useState<string>("for you");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Image
          className="min-w-6"
          src={"/icons/inbox.svg"}
          width={24}
          height={24}
          alt={"inbox"}
          key={"inbox"}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-3 min-w-96 border-none bg-background p-0 text-white">
        <header className="min-h-10 bg-foreground p-2">
          <div className=" flex w-full items-center justify-between gap-3  text-white">
            <div className="flex items-center gap-2 border-r border-r-background pr-5">
              <Image
                src={"/icons/inbox.svg"}
                width={24}
                height={24}
                alt={"inbox"}
                key={"inbox"}
              />
              <h3 className="text-base font-semibold">Inbox</h3>
            </div>
            <div className="inline-flex gap-1 rounded-full bg-background px-3">
              <Image
                src={"/icons/user-1.svg"}
                width={15}
                height={15}
                alt={"user-1"}
                key={"user-1"}
              />
              <span className="text-xs">0</span>
            </div>
          </div>
          <div className="flex gap-3 pt-5 text-white">
            {items.map((item) => (
              <button
                onClick={() => setSelectedFilter(item)}
                key={item}
                className={cn(
                  "transition-colors ease-in-out duration-300 rounded px-2 py-1 text-sm font-medium hover:bg-background capitalize",
                  selectedFilter === item &&
                    "bg-background hover:bg-opacity-65",
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </header>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
