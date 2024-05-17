"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";

import { useServerContext } from "@/providers/server";
import { Servers } from "@/types/server";

export default function ServerList({ servers }: { servers: Servers[] }) {
  const params = useParams();
  const { setServerStates } = useServerContext();

  const handleClick = (server: Servers) => {
    localStorage.setItem(server.id, server.id);
    setServerStates((prev) => ({
      ...prev,
      selectedServer: server,
    }));
  };

  const serverList = useMemo(() => servers, [servers]);

  useEffect(() => {
    const server = servers.find((server) => server.id === params.id);
    if (server) {
      setServerStates((prev) => ({
        ...prev,
        selectedServer: server,
      }));
    }
  }, [params.id, servers, setServerStates]);

  return (
    <ul className=" mt-3 flex flex-col gap-3 ">
      {serverList?.map((server) => (
        <li
          onClick={() => handleClick(server)}
          key={server.id}
          className="flex size-14 items-center justify-center rounded-full"
        >
          <Link href={"/server/" + encodeURIComponent(server.id)}>
            <Image
              src={server.logo}
              width={45}
              height={45}
              alt="discord"
              className="aspect-auto size-12 rounded-full object-cover"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}
