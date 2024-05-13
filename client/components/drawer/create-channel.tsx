
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";
import CreateChannelForm from "../channels/create-channel/form";

export default function CreateChannelDrawerMobile({
  serverId,
}: {
  serverId: string;
}) {
  return (
    <Drawer>
      <DrawerTrigger className="text-sm font-semibold capitalize">
        create channel
      </DrawerTrigger>
      <DrawerContent className="border-none bg-black p-3">
        <CreateChannelForm serverId={serverId} type="text"  />
      </DrawerContent>
    </Drawer>
  );
}
