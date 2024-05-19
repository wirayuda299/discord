"use client";

import { useForm } from "react-hook-form";
import { SquarePen } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import useUploadFile from "@/hooks/useFileUpload";
import { Button } from "../ui/button";
import { deleteImage, uploadFile } from "@/helper/file";
import { updateServer } from "@/helper/server";
import { UpdateServerSchemaType, updateServerSchema } from "@/validations";
import { createError } from "@/utils/error";
import { Servers } from "@/types/server";

export default function UpdateServerDrawer({
  server
}: {
server:Servers
}) {
  const { userId } = useAuth();
  const form = useForm<UpdateServerSchemaType>({
    resolver: zodResolver(updateServerSchema),
    defaultValues: {
      logo:server.logo,
      name:server.name,
    },
  });
  const { handleChange, preview, files } = useUploadFile(form);

  const image = form.watch("logo");
  const isValid = form.formState.isValid;
  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(data: UpdateServerSchemaType) {
    try {
      if (!userId) return;
      
      if (files && files.logo) {
        const [, file] = await Promise.all([
          deleteImage(server.logo_asset_id),
          await uploadFile(files.logo),
        ]);
        await updateServer(
					server.id,
					data.name,
					file.url,
          file.publicId,
          server?.banner ||'',
          server?.banner_asset_id ||'',
					userId,
					server.settings.show_banner_background,
					server.settings.show_progress_bar
				).then(() => {
					toast.success('Server has been updated');
				});
      } else {
        await updateServer(
					server.id,
					data.name,
					server.logo,
					server.logo_asset_id,
					server?.banner ||'',
					server?.banner_asset_id || '',
					userId as string,
					server.settings.show_banner_background,
					server.settings.show_progress_bar
				).then(() => {
					toast.success('Server has been updated');
				});
      }
    } catch (error) {
      createError(error);
    }
  }

  return (
    <Drawer onOpenChange={() => form.reset()}>
      <DrawerTrigger className="py-3 text-sm font-semibold capitalize">
        update server
      </DrawerTrigger>
      <DrawerContent className="top-0 !h-full border-foreground bg-black p-3 text-white">
        <DrawerHeader>
          <DrawerTitle className="text-center text-xl font-semibold ">
            Update server
          </DrawerTitle>
        </DrawerHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <input
              onChange={(e) => handleChange(e, "logo")}
              type="file"
              name="file"
              id="logo"
              className="hidden"
            />

            <div className="relative">
              <Label
                htmlFor="logo"
                className="!relative my-2 flex cursor-pointer items-center justify-center"
              >
                {(image || (preview && preview.logo)) && (
                  <Image
                    className="aspect-auto min-h-24 min-w-24 rounded-full object-cover"
                    src={form.getValues("logo") || preview?.logo || ""}
                    width={100}
                    height={100}
                    alt="logo"
                  />
                )}
                <div className="absolute right-[260px] top-0 flex size-7 items-center justify-center rounded-full bg-foreground">
                  <SquarePen size={16} className="text-gray-1" />
                </div>
              </Label>
            </div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <>
                      <Label
                        htmlFor="server-name"
                        className="my-1 block text-sm uppercase text-gray-2"
                      >
                        Server name
                      </Label>
                      <Input
                        id="server-name"
                        autoComplete="off"
                        placeholder="server name"
                        className="border-none bg-foreground text-white caret-white outline-none  ring-offset-background focus:border-none focus-visible:border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                        required
                        {...field}
                      />
                    </>
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="mt-3 w-full"
            >
              Update server
            </Button>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}
