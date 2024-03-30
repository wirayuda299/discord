import Image from 'next/image';

export default function ChannelId() {
	return (
		<div className='bg-main-foreground flex h-screen w-full items-center justify-center'>
			<Image
				src={'/icons/logo.svg'}
				width={50}
				height={50}
				alt='discord logo'
			/>
		</div>
	);
}
