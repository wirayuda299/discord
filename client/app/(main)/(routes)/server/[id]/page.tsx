import { redirect } from "next/navigation";

type Props = {
  params: { id: string };
};

export default async function ServerDetail({ params }: Props) {
  if (params.id) {
    redirect(`/server/${params.id}/channels`);
  }
}
