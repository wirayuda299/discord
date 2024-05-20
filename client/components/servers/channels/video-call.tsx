"use client";

import "@livekit/components-styles";
import {
  LiveKitRoom,
  GridLayout,
  ParticipantTile,
  useTracks,
  RoomAudioRenderer,
  ControlBar,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { createError } from "@/utils/error";

export default function VideoCall({ room, serverId }: { room: string; serverId:string }) {
	const { user } = useUser();
	const [token, setToken] = useState('');
	const router = useRouter();

	useEffect(() => {
		if (!user) return;

		(async () => {
			try {
				const resp = await fetch(
					`/api/get-participant-token?room=${room}&username=${user.username}`
				);
				const data = await resp.json();
				setToken(data.token);
			} catch (e) {
				createError(e);
			}
		})();
	}, [room, user]);

	if (token === '') {
		return <div>Getting token...</div>;
	}

	return (
		<LiveKitRoom
			onDisconnected={() => {
				router.push(`/server/${serverId}`);
			}}
			video={true}
			audio={true}
			token={token}
			serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
			data-lk-theme='default'
			className='!fixed inset-x-0 top-0 z-50 md:!static md:z-0'
		>
			<MyVideoConference />
			<RoomAudioRenderer />
			<ControlBar />
		</LiveKitRoom>
	);
}

function MyVideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );
  return (
    <GridLayout
      tracks={tracks}
      style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}
    >
      <ParticipantTile />
    </GridLayout>
  );
}
