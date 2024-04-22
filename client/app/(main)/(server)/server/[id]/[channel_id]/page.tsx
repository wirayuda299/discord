import SelectedChannel from "@/components/channels/selected-channel";

type Props = {
  searchParams: { channel_type: string };
};

export default function ChannelId({ searchParams }: Props) {
  if (searchParams.channel_type === "text") {
    return <SelectedChannel />;
  }
}
