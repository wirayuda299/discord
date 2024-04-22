import Image from "next/image";
import { X } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "../ui/dialog";

export default function ImagePreview({ image }: { image: string }) {
  return (
    <Dialog>
      <DialogTrigger>
        <Image
          src={image}
          width={200}
          height={100}
          placeholder="blur"
          blurDataURL={image}
          alt="media"
          className="ml-9 mt-3 aspect-auto rounded-md object-cover"
          loading="lazy"
        />
      </DialogTrigger>
      <DialogContent className=" flex h-full  min-w-full items-center justify-center border-none bg-transparent ">
        <Image
          width={700}
          height={400}
          src={image}
          alt="media"
          priority
          fetchPriority="high"
          sizes="100%"
          className=" aspect-auto max-h-[400px] w-full max-w-[600px] rounded-md object-cover backdrop:blur-sm"
        />
        <div className=" absolute right-1 top-3">
          <DialogClose className="flex size-10 flex-col items-center justify-center rounded-full border border-gray-2">
            <X className="text-gray-2" />
          </DialogClose>
          <p className="pl-1 font-light text-gray-2">ESC</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
