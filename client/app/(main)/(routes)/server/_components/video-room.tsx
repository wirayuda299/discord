'use client';

import { Track, RoomEvent } from 'livekit-client';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import {
	LiveKitRoom,
	GridLayout,
	useTracks,
	ControlBar,
	RoomAudioRenderer,
	VideoTrack,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { useRouter } from 'next/navigation';

export default function VideoRoom({ chatId }: { chatId: string }) {
	const room = chatId;
	const { user, isLoaded, isSignedIn } = useUser();
	const [token, setToken] = useState('');
	const router = useRouter();
	console.log(room);

	useEffect(() => {
		if (!isLoaded || !isSignedIn) return;

		(async () => {
			try {
				const resp = await fetch(
					`/api/get-participant-token?room=${room}&username=${user.username}`
				);
				const data = await resp.json();

				setToken(data.token);
			} catch (e) {
				console.error(e);
			}
		})();
	}, [isLoaded, isSignedIn, room, user]);

	if (token === '') {
		return (
			<div className='flex h-screen w-full items-center justify-center'>
				<div>
					<Image src={'/icons/logo.svg'} width={50} height={50} alt='logo' />
					<p className='pt-1 text-xs'>Loading...</p>
				</div>
			</div>
		);
	}

	return (
		<LiveKitRoom
			video={true}
			onDisconnected={() => router.push(`/me`)}
			audio={true}
			token={token}
			serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
			data-lk-theme='default'
			style={{ overflowY: 'auto', width: '100%' }}
		>
			<MyVideoConference />
			<RoomAudioRenderer volume={1.0} />
			<div className='overflow-x-auto'>
				<ControlBar />
			</div>
		</LiveKitRoom>
	);
}

function MyVideoConference() {
	const trackRefs = useTracks([Track.Source.Camera]);
	const tracks = useTracks(
		[
			{ source: Track.Source.Camera, withPlaceholder: true },
			{ source: Track.Source.ScreenShare, withPlaceholder: false },
		],

		{
			onlySubscribed: false,
			updateOnlyOn: [
				RoomEvent.Connected,
				RoomEvent.Disconnected,
				RoomEvent.Disconnected,
				RoomEvent.Reconnected,
				RoomEvent.Reconnecting,
			],
		}
	);
	return (
		<GridLayout tracks={trackRefs} id='grid-layout'>
			<>
				{tracks.map((track) => (
					<VideoTrack id='video-track' key={track.participant.sid} />
				))}
			</>
		</GridLayout>
	);
}
