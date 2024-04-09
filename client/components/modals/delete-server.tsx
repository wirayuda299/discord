"use client";

import { toast } from "sonner";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { deleteImage } from "@/helper/file";
import { deleteServer } from "@/helper/server";

export default function DeleteServer({
  serverId,
  logoAssetId,
}: {
  serverId: string;
  logoAssetId: string;
}) {
  const { userId } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleDeleteServer = async (serverId: string, imageId: string) => {
    if (!userId) {
      toast.error("Unauthorized");
      return;
    }
    try {
      setIsLoading(true);
      await Promise.all([
        deleteServer(serverId, userId!!),
        deleteImage(imageId),
      ]).then(() => {
        toast.success("Server has been deleted");
        router.push("/server");
      });
    } catch (error) {
      toast.error("Error delete server");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-3 w-full bg-red-600 text-white hover:bg-red-600/60">
          Delete server
        </Button>
      </DialogTrigger>
      <DialogContent className="border-foreground bg-black text-white">
        <DialogHeader>
          <DialogTitle>Are you sure want to delete this server?</DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-between gap-2">
          <DialogClose asChild>
            <Button className="w-full !bg-transparent">Cancel</Button>
          </DialogClose>
          <Button
            disabled={isLoading}
            aria-disabled={isLoading}
            onClick={() => handleDeleteServer(serverId, logoAssetId)}
            className="w-full bg-red-600 hover:bg-red-600/60 disabled:bg-red-600/60"
          >
            Delete permanently
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
