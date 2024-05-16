import { ReactNode } from 'react';
import { notFound } from 'next/navigation';

import ServerSidebar from '@/components/shared/sidebar/server';
import { getServerById } from '@/helper/server';

export default async function ServerDetailLayout({
	children,
	params,
}: {
	params: {
		id: string;
	};
	children: ReactNode;
}) {

  
	const data = await getServerById(params.id as string);
	
  if(!data) return notFound()

	return (
		<div className='flex w-full'>
			<ServerSidebar
				data={{
					channels: data.channels,
					server: data.server[0],
				}}
			/>
			{children}
		</div>
	);
}
