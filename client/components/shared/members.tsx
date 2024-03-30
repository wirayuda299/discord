'use client';

import { useSheetContext } from '@/providers/sheet';
import Image from 'next/image';

export default function MemberButton() {
	const { handleMemberOpen, memberSidebar } = useSheetContext();
	return (
		<button title='member' onClick={() => handleMemberOpen(!memberSidebar)}>
			<Image
				className='text-gray-1'
				src={'/icons/member.svg'}
				width={25}
				height={25}
				alt='member icon'
			/>
		</button>
	);
}
