import Image from "next/image";

export default async function ServerDetail() {
  return (
    <div className="hidden size-full sm:block">
      <div className="flex flex-col items-center justify-center text-white">
        <Image
          src={"/icons/discord.svg"}
          width={200}
          height={200}
          alt="discord"
        />
        <h3 className="pt-2 text-sm font-semibold">
          Select a channel to view or send message
        </h3>
      </div>
    </div>
  );
}
