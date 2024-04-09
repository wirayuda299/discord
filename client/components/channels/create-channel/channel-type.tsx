import Image from "next/image";
import { FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form";

import { channelTypes } from "@/constants/channel-type";
import { cn } from "@/lib/utils";

export default function ChannelTypeItem<T extends FieldValues>({
  value,
  form,
}: {
  value: string;
  form: UseFormReturn<T>;
}) {
  return (
    <div className="w-full space-y-4">
      <h3 className="md:text-gray-2 pt-3 uppercase text-white md:pt-0">
        Channel type
      </h3>
      {channelTypes.map((type) => (
        <div
          key={type.label}
          onClick={(e) => {
            e.stopPropagation();
            form.setValue(
              "channelType" as Path<T>,
              type.label as PathValue<T, Path<T>>,
            );
          }}
          className={cn(
            "mt-3 flex cursor-pointer items-center justify-between gap-3 rounded-md md:bg-[#2b2d31] px-5 py-2 bg-black/25 md:hover:bg-[#43444b]",
            value === type.label && "bg-foreground/30 md:bg-[#43444b]",
          )}
        >
          <div className="flex items-center gap-3">
            <Image
              className={value === type.label ? "brightness-90" : ""}
              src={type.icon}
              width={30}
              height={30}
              alt="hashtag icon"
            />
            <div>
              <h4 className="text-gray-2 text-lg font-medium capitalize">
                {type.label}
              </h4>
              <p className="truncate text-wrap text-[10px] text-[#9fa6ae] sm:text-xs">
                {type.desc}
              </p>
            </div>
          </div>
          <div className="flex size-6 min-w-6 items-center justify-center rounded-full border ">
            {value === type.label && (
              <div className="size-3 min-h-3 min-w-3 rounded-full bg-white"></div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
