'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export default function SidebarItem({
  icon,
  label,
}: {
  icon: string;
  label: string;
}) {
  const { push } = useRouter();

  const handleClick = useCallback((label: string) => {
    push(`?option=${label}`);
  }, []);

  return (
    <li
      onClick={() => handleClick(label)}
      className='flex-center group grow cursor-pointer gap-2 rounded py-1 transition-colors ease-in-out hover:bg-foreground'
    >
      <Image
        src={icon}
        width={30}
        height={30}
        alt={label}
        className='aspect-auto object-contain group-hover:brightness-0 group-hover:invert'
      />
      <Link
        aria-label={label}
        href={label}
        className='text-lg font-semibold capitalize group-hover:text-white'
      >
        {label}
      </Link>
    </li>
  );
}
