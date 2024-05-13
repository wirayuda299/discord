import Image from "next/image";

import { cn } from "@/lib/utils";

export default function SearchForm({ styles }: { styles?: string }) {
  return (
    <form className="w-full">
      <label
        htmlFor="search"
        className={cn(
          "flex max-w-40 items-center rounded bg-foreground px-2 py-0.5",
          styles,
        )}
      >
        <input
          type="search"
          id="search"
          autoComplete="off"
          className="w-full bg-transparent text-gray-2 placeholder:text-sm focus-visible:outline-none"
          placeholder="Search"
        />
        <Image
          src={"/icons/search.svg"}
          width={18}
          height={18}
          alt={"hashtag"}
          key={"hashtag"}
        />
      </label>
    </form>
  );
}
