import { ReactNode } from 'react';

import ServerSidebarLinksItem from '@/components/sidebar/server-sidebar-links';
import { serverSidebarLinks } from '@/constants/sidebarLinks';

export default function DirectMessagesLayout({children}:{children:ReactNode}) {
	return (
		<div className='flex items-start'>
			<aside className='no-scrollbar size-full min-h-screen min-w-[255px] max-w-[255px] gap-3  overflow-y-auto border-r-2 border-r-foreground md:h-full md:bg-[#2b2d31]'>
				<div className='flex w-full flex-col '>
					<form className='w-full border-b border-b-foreground p-3'>
						<input
							className='w-full rounded bg-foreground px-2 py-1 text-gray-2 placeholder:text-xs focus-visible:outline-none'
							type='search'
							placeholder='Search or start conversation'
						/>
					</form>
					<ul className='mt-5 space-y-5'>
						{serverSidebarLinks.map((item) => (
							<ServerSidebarLinksItem
								icons={item.icons}
								label={item.label}
								path={item.path}
								key={item.label}
							/>
						))}
					
					</ul>
				</div>
      </aside>
      {children}
		</div>
	);
}
