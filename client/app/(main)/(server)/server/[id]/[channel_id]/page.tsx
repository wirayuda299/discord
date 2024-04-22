import SelectedChannel from "@/components/channels/selected-channel";

export function generateStaticParams() {
	return [
		{ 'channel_id': '1' },
	];
}
type Props = {
  searchParams: { channel_type: string };
};


export default function ChannelId({ searchParams }: Props) {
  if (searchParams.channel_type === "text") {
    return <SelectedChannel />;
  }
}
