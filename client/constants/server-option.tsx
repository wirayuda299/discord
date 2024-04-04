import { UserPlus, Bell, Cog } from 'lucide-react';
import Image from 'next/image';

export const serverOptions = [
	{
		icon: (
			<Image
				src={'/icons/boost.svg'}
				width={25}
				height={25}
				alt='boost'
				className='aspect-auto object-contain'
			/>
		),
		label: 'boost',
	},
	{
		icon: <UserPlus />,
		label: 'invite',
	},
	{
		icon: <Bell />,
		label: 'notification',
	},
	{
		icon: <Cog />,
		label: 'settings',
	},
] as const;
