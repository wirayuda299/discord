import useSWR from 'swr';

export default function useFetch<T>(key: string, cb: () => Promise<T>) {
  const { data, isLoading, error, mutate } = useSWR(key, () => cb(), {
    revalidateOnFocus: false,
    onLoadingSlow(key, config) {
      console.log('Loading slower than usual', key);
    },
  });

  return { data, isLoading, error, mutate };
}
