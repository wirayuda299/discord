import { formatMessageTimestamp } from "@/utils/createdDate";

export default function ChatLabel({ createdAt }: { createdAt: string }) {
  return (
    <div className="flex w-full items-center gap-2 pb-5">
      <div className="bg-gray-1 h-px w-full"></div>
      <p className="text-gray-2 text-nowrap text-sm">
        {formatMessageTimestamp(createdAt)}
      </p>
      <div className="bg-gray-1 h-px w-full"></div>
    </div>
  );
}
