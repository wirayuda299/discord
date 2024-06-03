import type { ReactNode } from 'react';

export default function Auth({ children }: { children: ReactNode }) {
  return (
    <div className='flex h-full max-h-screen min-h-screen w-full place-content-center bg-background'>
      {children}
    </div>
  );
}
