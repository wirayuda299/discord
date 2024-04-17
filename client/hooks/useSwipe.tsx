import { ServerStates } from '@/providers/server';
import { Dispatch, SetStateAction, useState, TouchEvent } from 'react';

export default function useSwipe(
	setServerStates: Dispatch<SetStateAction<ServerStates>>
) {
	const [startX, setStartX] = useState<number | null>(null);

	const onTouchStart = (e: TouchEvent) => setStartX(e.touches[0].clientX);

	const onTouchMove = (e: TouchEvent) => {
		if (!startX) return;
		const differences = e.touches[0].clientX - startX;
		if (differences > 50) {
			setServerStates((prev) => {
				return {
					...prev,
					selectedChannel: null,
				};
			});
		}
	};

	const onTouchEnd = () => setStartX(null);
	return { onTouchStart, onTouchMove, onTouchEnd };
}
