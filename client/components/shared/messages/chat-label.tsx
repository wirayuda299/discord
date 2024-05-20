import { formatMessageTimestamp } from "@/utils/createdDate";

export default function ChatLabel({ createdAt }: { createdAt: string }) {
  return (
    <div className="flex w-full items-center gap-2 pb-5">
      <div className="h-px w-full bg-gray-1"></div>
      <p className="min-w-min text-nowrap text-sm text-gray-2">
        {formatMessageTimestamp(createdAt)}
      </p>
      <div className="h-px w-full bg-gray-1"></div>
    </div>
  );
}
