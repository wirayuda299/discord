import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from './ui/form';

const schema = z.object({
	username: z.string().min(4),
	pronouns: z.string().optional(),
	avatar: z.string(),
});

export default function UserUpdateForm({
	username,
	avatar,
}: {
	avatar: string;
	username: string;
}) {
	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			username,
			avatar,
			pronouns: '',
		},
	});
	const data = form.watch();
	// bg-[#232428]
	return (
		<div className='grid w-full grid-cols-2 gap-5 py-5'>
			<Form {...form}>
				<form className='space-y-3'>
					<FormField
						control={form.control}
						name='username'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Username</FormLabel>
								<FormControl>
									<div>
										<Input
											{...field}
											placeholder='username'
											className='bg-foreground placeholder:text-gray-2 w-full rounded border-none p-3 shadow-none placeholder:text-sm placeholder:capitalize focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
										/>
										<div className='bg-gray-1 mt-7 h-px w-full rounded-full'></div>
									</div>
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='pronouns'
						render={({ field }) => (
							<FormItem className='border-b-foreground border-b'>
								<FormLabel>Pronouns</FormLabel>
								<FormControl>
									<div>
										<Input
											{...field}
											placeholder='Add a pronouns'
											className='bg-foreground placeholder:text-gray-2 w-full rounded border-none p-3 shadow-none placeholder:text-sm placeholder:capitalize focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
										/>
										<div className='bg-gray-1 mt-7 h-px w-full rounded-full'></div>
									</div>
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='avatar'
						render={({ field }) => (
							<FormItem className='border-b-foreground border-b'>
								<FormLabel>Avatar</FormLabel>
								<FormControl>
									<div>
										<Label htmlFor='avatar'>
											<Button>Change avatar</Button>
										</Label>
										<Input
											name='file'
											id='avatar'
											type='file'
											className='bg-foreground placeholder:text-gray-2 hidden w-full rounded border-none p-3 shadow-none placeholder:text-sm placeholder:capitalize focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
										/>
										<div className='bg-gray-1 mt-7 h-px w-full rounded-full'></div>
									</div>
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='avatar'
						render={({ field }) => (
							<FormItem className='border-b-foreground border-b'>
								<FormLabel>Avatar Decoration</FormLabel>
								<FormControl>
									<div>
										<Label htmlFor='avatar'>
											<Button>Change decoration</Button>
										</Label>
										<Input
											name='file'
											id='avatar'
											type='file'
											className='bg-foreground placeholder:text-gray-2 hidden w-full rounded border-none p-3 shadow-none placeholder:text-sm placeholder:capitalize focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
										/>
										<div className='bg-gray-1 mt-7 h-px w-full rounded-full'></div>
									</div>
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='avatar'
						render={({ field }) => (
							<FormItem className='border-b-foreground border-b'>
								<FormLabel>Profile effect</FormLabel>
								<FormControl>
									<div>
										<Label htmlFor='avatar'>
											<Button>Change effect</Button>
										</Label>
										<Input
											name='file'
											id='avatar'
											type='file'
											className='bg-foreground placeholder:text-gray-2 hidden w-full rounded border-none p-3 shadow-none placeholder:text-sm placeholder:capitalize focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
										/>
										<div className='bg-gray-1 mt-7 h-px w-full rounded-full'></div>
									</div>
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='avatar'
						render={({ field }) => (
							<FormItem className='border-b-foreground border-b'>
								<FormLabel>Avatar Decoration</FormLabel>
								<FormControl>
									<div>
										<Label htmlFor='avatar'>
											<Button>Change decoration</Button>
										</Label>
										<Input
											name='file'
											id='avatar'
											type='file'
											className='bg-foreground placeholder:text-gray-2 hidden w-full rounded border-none p-3 shadow-none placeholder:text-sm placeholder:capitalize focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
										/>
										<div className='bg-gray-1 mt-7 h-px w-full rounded-full'></div>
									</div>
								</FormControl>
							</FormItem>
						)}
					/>
				</form>
			</Form>
			<div className='h-max rounded-lg bg-[#1E1F22]'>
				<div className='h-20 w-full rounded-t-md bg-black'></div>
				<div className='flex items-center justify-between px-5'>
					<Image
						className='border-background  aspect-auto -translate-y-5 rounded-full border-4 object-contain'
						src={data.avatar}
						width={90}
						height={90}
						alt='user'
					/>
					<div className='aspect-square size-8 rounded-md bg-black p-1'>
						<div className='size-full rounded-md bg-green-600 text-center'>
							#
						</div>
					</div>
				</div>
				<div className='w-full p-3'>
					<div className='w-full rounded-md bg-black p-5 '>
						<div className='border-b-foreground border-b  pb-4'>
							<h3 className='text-wrap break-words text-sm font-semibold'>
								{data.username}
							</h3>
							<p className='text-wrap break-words text-sm'>{data.pronouns}</p>
						</div>
						<div className='pt-3'>
							<h4 className='text-xs font-semibold uppercase'>
								Customizing user profile
							</h4>
							<div className='flex items-center gap-3'>
								<div className='mt-2 w-max rounded-md bg-blue-600 p-2'>
									<Image
										src={'/images/pencil.png'}
										width={50}
										height={50}
										alt='pencil'
									/>
								</div>
								<div>
									<h5 className='text-sm font-semibold'>User profile</h5>
								</div>
							</div>
							<Button className='mt-3 w-full !bg-[#4e5058]'>
								Example button
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
