import useSWR from "swr";

export default function useFetch<T>(key: string, cb: () => Promise<T>) {
  const { data, isLoading, error, mutate } = useSWR(key, () => cb(), {
    revalidateOnFocus:false
  });

  return { data, isLoading, error, mutate };
}
