import { type ReactNode } from "react";
import { X } from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "../ui/dialog";
import { cn } from "@/lib/utils";
import UserAccount from "../settings/user-account";
import EditProfile from "../settings/edit-profile";
import { settings } from "@/constants/settings";
import { useServerContext } from "@/providers/server";

export default function UserSettingsModals({
  children,
}: {
  children: ReactNode;
}) {
  const {
    serversState: { selectedSetting },
    setServerStates,
  } = useServerContext();
  const { signOut } = useClerk();
  const router = useRouter();

  return (
    <Dialog modal>
      <DialogTrigger asChild className="hidden md:block">
        {children}
      </DialogTrigger>
      <DialogContent className="hidden h-screen min-w-full border-none  bg-background p-0 text-white md:block">
        <div className="flex size-full justify-center gap-2 lg:gap-5">
          <div className=" bg-[#2b2d31]  py-10 md:min-w-[250px] xl:min-w-[410px]">
            <aside className="sticky top-0 flex h-screen  flex-col overflow-y-auto px-5 pb-16 pt-5 lg:items-end">
              <ul className="flex w-max flex-col gap-3">
                {settings.map((setting) => (
                  <li key={setting.label}>
                    <h2 className="mb-3 w-max border-b border-b-background text-sm font-semibold uppercase text-gray-2">
                      {setting.label}
                    </h2>
                    <ul className="flex flex-col gap-1">
                      {setting.items.map((item) => (
                        <li
                          onClick={() => {
                            setServerStates((prev) => {
                              return {
                                ...prev,
                                selectedSetting: item,
                              };
                            });
                          }}
                          className={cn(
                            "hover:bg-background min-w-[200px] cursor-pointer text-nowrap rounded p-2 text-sm font-medium capitalize text-[#b5b8bc] transition ease hover:text-[#ced0d3]",
                            selectedSetting === item &&
                              "bg-background text-white hover:bg-background/55",
                          )}
                          key={item}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
                <li
                  onClick={() => signOut().then(() => router.push("/sign-in"))}
                  className="ease min-w-[200px] cursor-pointer text-nowrap rounded p-2 text-sm font-medium capitalize text-[#b5b8bc] transition hover:bg-background hover:text-[#ced0d3]"
                >
                  Sign Out
                </li>
              </ul>
            </aside>
          </div>
          <div className="no-scrollbar h-screen w-full overflow-y-auto px-6 py-10">
            {selectedSetting === "my account" && <UserAccount />}
            {selectedSetting === "profiles" && <EditProfile />}
          </div>
          <div className=" min-w-24 pt-10">
            <DialogClose className="flex size-10 flex-col items-center justify-center rounded-full border border-gray-2">
              <X className="text-gray-2" />
            </DialogClose>
            <p className="pl-1 font-light text-gray-2">ESC</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
