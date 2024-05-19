import Image from "next/image";

import { cn } from "@/lib/utils/mergeStyle";

export default function ImagePreview({
  image,
  styles,
}: {
  image: string;
  styles?: string;
}) {
  return (
    <Image
      src={image}
      width={200}
      height={100}
      placeholder="blur"
      blurDataURL={image}
      alt="media"
      className={cn("ml-9 mt-3 aspect-auto rounded-md object-cover", styles)}
      loading="lazy"
    />
  );
}
