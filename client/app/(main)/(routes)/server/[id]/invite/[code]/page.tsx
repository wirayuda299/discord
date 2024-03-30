import { inviteUser } from '@/actions/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

type Props = {
	params: {
		id: string;
		code: string;
	};
	searchParams: {
		channelId: string;
	};
};
export default async function Code({ params, searchParams }: Props) {
	let res: any;

	await inviteUser(
		params.id,
		params.code,
		`/server/${params.id}`,
		searchParams.channelId
	)
		.then(() => {
			redirect(`/server/${params.id}/channels`);
		})
		.catch((e) => {
			if (e.message !== 'NEXT_REDIRECT') {
				res = e.message;
			}
		});
	return (
		<div className='flex h-screen w-full items-center justify-center'>
			<div>
				<h1 className='pb-5 text-2xl font-semibold capitalize'>{res}</h1>
				<Link
					href={'/server/' + params.id + '/channels'}
					className='bg-secondary-purple  w-full rounded-md px-5 py-2 '
				>
					Go back
				</Link>
			</div>
		</div>
	);
}
