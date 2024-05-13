import type { ReactNode } from "react";

import Sidebar from "@/components/shared/sidebar/sidebar";
import SidebarMobile from "@/components/shared/sidebar/mobile";

export default async function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="size-full">
      <div className="flex h-screen w-full overflow-hidden">
        <Sidebar />
        <div className="w-full">{children}</div>
        <SidebarMobile />
      </div>
    </div>
  );
}
