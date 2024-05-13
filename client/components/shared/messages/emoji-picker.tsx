import EmojiPicker, { Theme } from "emoji-picker-react";
import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

export default function EmojiPickerButton({
  handleClick,
}: {
  handleClick: (emoji: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Image
          src={"/icons/smile.svg"}
          className="min-w-6"
          width={24}
          height={24}
          alt="smile"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="border-none bg-transparent">
        <EmojiPicker
          className="!bg-foreground"
          theme={Theme.DARK}
          // @ts-ignore
          onEmojiClick={handleClick}
          lazyLoadEmojis
          skinTonesDisabled
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
