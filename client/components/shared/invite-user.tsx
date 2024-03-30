import { Check, Copy, RefreshCcw, UserPlus } from 'lucide-react';
import { useState } from 'react';

import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { generateNewInviteCode } from '@/actions/server';
import { cn } from '@/lib/utils';

export default function InviteUser({
	channelName,
	inviteCode,
	serverId,
	channelId,
}: {
	channelName: string;
	inviteCode: string;
	serverId: string;
	channelId: string;
}) {
	const [loading, setLoading] = useState<boolean>(false);
	const [copied, setCopied] = useState<boolean>(false);

	const inviteUrl =
		typeof window !== 'undefined' && window.location.origin
			? window.location.origin +
				'/server/' +
				serverId +
				'/invite/' +
				inviteCode +
				`?channelId=${channelId}`
			: '';

	const handleCopy = () => {
		navigator.clipboard.writeText(inviteUrl);
		setCopied(true);

		setTimeout(() => {
			setCopied(false);
		}, 1500);
	};

	const handleGenerateNewInviteCode = async () => {
		try {
			setLoading(true);
			await generateNewInviteCode(serverId, window.location.pathname);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};
	return (
		<Dialog modal>
			<DialogTrigger>
				<UserPlus stroke='#949ba4' fill='#949ba4' size={18} />
			</DialogTrigger>
			<DialogContent className='bg-main-foreground border-none'>
				<div>
					<h3 className='gap-2 text-lg font-semibold leading-snug text-white'>
						Invite user
					</h3>
					<p className='text-gray-1 text-sm font-normal leading-snug'>
						#{channelName.split(' ').join('-')}
					</p>
				</div>
				<div className=''>
					<div className='flex w-full items-center gap-1'>
						<Input
							value={inviteUrl}
							autoFocus={false}
							disabled={loading}
							aria-disabled={loading}
							placeholder='invite user'
							className='bg-[var(--primary)] ring-offset-[[var(--primary)]]  focus:border-none focus:shadow-none focus-visible:border-none focus-visible:ring-0 focus-visible:ring-transparent'
						/>
						<Button
							disabled={loading}
							aria-disabled={loading}
							onClick={handleCopy}
							size='icon'
						>
							{copied ? (
								<Check className='text-secondary-purple size-5' />
							) : (
								<Copy className='text-secondary-purple size-5' />
							)}
						</Button>
					</div>
					<button
						disabled={loading}
						aria-disabled={loading}
						onClick={handleGenerateNewInviteCode}
						className='flex items-center gap-2 pt-3 text-sm'
					>
						Generate new invite code
						<RefreshCcw
							size={20}
							className={cn(
								'ease text-secondary-purple transition-all duration-500',
								loading && 'animate-spin'
							)}
						/>
					</button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
