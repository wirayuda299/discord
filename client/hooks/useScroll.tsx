import { MutableRefObject, useCallback, useEffect } from 'react';

export default function useScroll<T extends Element | null, K>(
  ref: MutableRefObject<T>,
  messages: K[],
) {
  const scrollToTop = useCallback(() => {
    if (ref.current) {
      ref.current.scroll({
        behavior: 'smooth',
        left: 0,
        top: ref.current.scrollHeight,
      });
    }
  }, [ref]);
  useEffect(() => {
    scrollToTop();
  }, [messages.length, scrollToTop]);
}
