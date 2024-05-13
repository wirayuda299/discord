'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { toast } from 'sonner';

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		toast.error(error.message);
	}, [error]);

	return <div></div>;
}
