import SelectedChannel from "@/components/channels/selected-channel";

type Props = {
  params: {
    slug: string[];
  };
};

export default function Server({ params }: Props) {
  if (params.slug.includes("server")) {
    return <SelectedChannel />;
  }

  if (params.slug.includes("shop")) {
    return <p>Shop</p>;
  }
  if (params.slug.includes("nitro")) {
    return <p>nitro</p>;
  }
}
