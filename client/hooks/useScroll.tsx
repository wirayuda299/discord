import { MutableRefObject, useEffect } from 'react';

export default function useScroll<T extends Element | null, K>(
	ref: MutableRefObject<T>,
	messages: K[]
) {
	const scrollToTop = () => {
		if (ref.current) {
			ref.current.scroll({
				behavior: 'smooth',
				left: 0,
				top: ref.current.scrollHeight,
			});
		}
	};
	useEffect(() => {
		scrollToTop();
	}, [messages.length]);
}
