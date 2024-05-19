import type { ReactNode } from "react";
import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";

import GeneralLoader from "@/components/shared/loader/general";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen items-center justify-center">
      <ClerkLoading>
        <GeneralLoader/>
      </ClerkLoading>
      <ClerkLoaded>{children}</ClerkLoaded>
    </div>
  );
}
