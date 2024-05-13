import Friends from "@/components/friends/friends";
import { redirect } from "next/navigation";

type AllowedSearchParamsType = "friends" | "shop" | "nitro";

type Props = {
  searchParams: {
    menu: AllowedSearchParamsType;
  };
};

function isAllowedSearchParams(params: Readonly<AllowedSearchParamsType>) {
  const allowedSearchParams = ["friends", "shop", "nitro"] as const;
  return allowedSearchParams.includes(params);
}

export default function DirectMessages({ searchParams }: Props) {
  if (searchParams.menu && !isAllowedSearchParams(searchParams.menu)) {
    return redirect("/direct-messages");
  }

  if (searchParams.menu === "friends") return <Friends />;
}
