import type { ReactNode } from "react";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CreateChannelForm from "../channels/create-channel/form";

export default function CreateChannelModals({
  serverId,
  type,
  children,
}: {
  serverId: string;
  type: string;
  children: ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="border-none bg-black shadow-2xl md:bg-background">
        <CreateChannelForm serverId={serverId} type={type} />
      </DialogContent>
    </Dialog>
  );
}
