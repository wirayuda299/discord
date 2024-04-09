import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";

export default function ServerSidebarLinksItem({
  label,
  path,
  icons,
}: {
  path: string;
  label: string;
  icons: string;
}) {
  return (
    <li
      key={label}
      className={cn(
        "p-2 transition-colors hover:bg-background/35 ease duration-300 rounded-md",
      )}
    >
      <Link
        href={path}
        className="ease group flex items-center gap-2 transition-colors duration-300"
      >
        <Image
          className="group-hover:brightness-0 group-hover:invert"
          src={icons}
          width={30}
          height={30}
          alt={label}
        />
        <h3 className="text-gray-2 font-semibold group-hover:text-white">
          {label}
        </h3>
      </Link>
    </li>
  );
}
