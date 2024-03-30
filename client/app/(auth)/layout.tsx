import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex h-full min-h-screen items-center justify-center">
      {children}
    </main>
  );
}
