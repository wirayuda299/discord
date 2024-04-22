import ServerSidebar from "@/components/sidebar/server";
import { getServerById } from "@/helper/server";
import { ReactNode } from "react";
export function generateStaticParams() {
	return [
		{ id: 'a', value: '1' },
		{ channel_id: 'b', value: '2' },
	];
}
export default async function ServerDetailLayout({
  children,
  params,
}: {
  params: {
    id: string;
  };
  children: ReactNode;
}) {
  const data = await getServerById(params.id as string);

  return (
    <div className="flex">
      <ServerSidebar
        data={{
          channels: data.channels,
          server: data.server[0],
        }}
      />
      {children}
    </div>
  );
}
