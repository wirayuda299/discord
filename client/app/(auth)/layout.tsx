import type { ReactNode } from "react";
import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
export function generateStaticParams() {
	return [
		{ 'sign-up': ['sign-up', '1'] },
		{ 'sign-up': ['sign-up', '2'] },
		{ 'sign-up': ['sign-up', '3'] },
	];
}
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen items-center justify-center">
      <ClerkLoading>
        <div className="size-24 animate-spin rounded-full border-t border-primary"></div>
      </ClerkLoading>
      <ClerkLoaded>{children}</ClerkLoaded>
    </div>
  );
}
