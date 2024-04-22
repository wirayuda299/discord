import type { ReactNode } from "react";

import Sidebar from "@/components/sidebar/sidebar";
import FriendHeader from "@/components/friends-header";
import SidebarMobile from "@/components/sidebar/mobile";

export default async function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="size-full">
      <div className="flex h-screen w-full overflow-hidden">
        <Sidebar />
        <div className="w-full">
          <FriendHeader />
          {children}
        </div>
        <SidebarMobile />
      </div>
    </div>
  );
}
