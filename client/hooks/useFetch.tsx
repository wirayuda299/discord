import useSWR from "swr";

export default function useFetch<T>(key: string, cb: () => Promise<T>) {
	const { data, isLoading, error, mutate } = useSWR(key, () => cb(), {
		revalidateOnMount: true,
		revalidateOnFocus: true,
	
	});

	return { data, isLoading, error, mutate };
};