import type { ReactNode } from 'react';

export default function Auth({ children }: { children: ReactNode }) {
  return (
    <div className='flex flex-wrap mx-auto max-w-screen-2xl h-full max-h-screen min-h-screen w-full items-center justify-center bg-gradient-to-b from-blue-600 to-white gap-6 overflow-y-auto select-none'>
      <div className='max-w-[500px] space-y-2 sm:px-10 px-5'>
        <h2 className='text-3xl font-extrabold text-white lg:text-5xl'>Welcome to ChatFuzion</h2>
        <p className='text-white text-base pt-1'>
          This project was created solely for learning and practice purposes related to specific technologies. It is not intended for commercial use or to infringe upon any trademarks or copyrights.</p>
      </div>
      {children}
    </div>
  );
}
