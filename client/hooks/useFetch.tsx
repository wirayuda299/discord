import useSWR from 'swr';

export default function useFetch<T>(
  key: string,
  cb: () => Promise<T>,
  revalidateOnFocus = false,
) {
  const { data, isLoading, error, mutate } = useSWR(key, () => cb(), {
    revalidateOnFocus,
  });

  return { data, isLoading, error, mutate };
}
