import { getPendingInvitation } from "@/helper/user";
import useSWR from "swr";

export default function useFriends(userId: string) {
  const { data, isLoading, error } = useSWR("pending-invitation", () =>
    getPendingInvitation(userId),
  );

  return { data, isLoading, error };
}
