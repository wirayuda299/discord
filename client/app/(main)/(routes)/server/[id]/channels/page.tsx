import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { getServerById } from '@/actions/server';
import { ServerSheet } from '../../_components/index';

type Props = {
	params: { id: string };
};

export default async function Channels({ params }: Props) {
	const selectedChannel = cookies().get(params.id);
	if (selectedChannel) {
		redirect(
			`/server/${params.id}/channels/${selectedChannel.value}?type=text`
		);
	}
	const { server, channels } = await getServerById(params.id);
	return (
		<div className='w-full'>
			<div className='flex justify-end p-5 sm:hidden'>
				<ServerSheet channels={channels} server={server} />
			</div>
			<div className='mx-auto flex h-screen w-full max-w-xl items-center justify-center p-5'>
				<div>
					<h1 className='py-4 text-center text-lg font-bold capitalize md:text-3xl'>
						Welcome to{' '}
						<span className='inline-block bg-gradient-to-tr from-blue-600  to-blue-100 bg-clip-text text-transparent'>
							{server.name}
						</span>
					</h1>
					<p className='text-center text-sm font-light text-[#949ba4]'>
						We&apos;re thrilled to have you here. Feel free to introduce
						yourself, join the conversation, and make new friends. If you have
						any questions or need assistance, don&apos;t hesitate to ask. Enjoy
						your stay!
					</p>
				</div>
			</div>
		</div>
	);
}
