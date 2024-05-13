import ChatList from "@/components/messages/chat-list";
import { cn } from "@/lib/utils";

type Props = {
  searchParams: {
    chat: string;
    conversationId?: string;
    type: string;
  };
};

export default function Messages({ searchParams }: Props) {
  return (
    <div
      className={cn(
        "fixed left-0 z-50 w-full bg-black text-white md:static md:bg-inherit transition-all ease duration-500",
        searchParams.type === "mobile" && searchParams.chat
          ? "left-0"
          : "right-0",
      )}
    >
      <ChatList />
    </div>
  );
}
