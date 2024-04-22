import type { ReactNode } from "react";
import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen items-center justify-center">
      <ClerkLoading>
        <div className="border-primary size-24 animate-spin rounded-full border-t"></div>
      </ClerkLoading>
      <ClerkLoaded>{children}</ClerkLoaded>
    </div>
  );
}
