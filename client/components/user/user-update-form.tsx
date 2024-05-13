import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useSWRConfig } from "swr";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { updateUser } from "@/helper/user";
import useUploadFile from "@/hooks/useFileUpload";
import { deleteImage, uploadFile } from "@/helper/file";
import { User } from "@/types/user";
import { ServerProfile } from "@/types/server";
import { getCookies } from "@/helper/cookies";
import { updateServerProfile } from "@/helper/server";
import UserInfo from "./user-info";

const schema = z.object({
  username: z.string().min(4),
  bio: z.string().optional(),
  avatar: z.string(),
});

export default function UserUpdateForm({
  selectedOption,
  user,
  serverProfile,
}: {
  user: User;
  serverProfile: ServerProfile;
  selectedOption: string;
}) {
  const { mutate } = useSWRConfig();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      username:
        selectedOption === "user" ? user.username : serverProfile.username,
      avatar: selectedOption === "user" ? user.image : serverProfile.avatar,
      bio: (selectedOption === "user" ? user.bio : serverProfile.bio) ?? "",
    },
  });
  const { user: currentUser, isLoaded, isSignedIn } = useUser();

  const { handleChange, preview, files, setFiles, setPreview } =
    useUploadFile(form);

  const data = form.watch();
  const isSubmitting = form.formState.isSubmitting;

  useEffect(() => {
    if (!user || !serverProfile) return;

    if (!isSubmitting) {
      setFiles(null);
      setPreview(null);
    }

    if (selectedOption === "user") {
      form.setValue("username", user.username);
      form.setValue("bio", user.bio);
      form.setValue("avatar", user?.image);
    } else {
      form.setValue("username", serverProfile.username);
      form.setValue("bio", serverProfile.bio ?? "");
      form.setValue("avatar", serverProfile.avatar);
    }
  }, [
    form,
    isSubmitting,
    selectedOption,
    serverProfile,
    setFiles,
    setPreview,
    user,
    user.bio,
    user?.image,
    user.username,
  ]);

  if (!isLoaded || !isSignedIn) return null;

  async function onSubmit(data: z.infer<typeof schema>) {
    if (!currentUser) return;

    try {
      const cookies = await getCookies();
      if (selectedOption === "user") {
        if (files && files.avatar) {
          await deleteImage(user?.image_asset_id);
          await currentUser?.setProfileImage({ file: files.avatar });
          const file = await uploadFile(files?.avatar);
          await updateUser(
            data.username,
            data.bio ?? "",
            currentUser.id ?? "",
            file?.url,
            file?.publicId,
          );
        } else {
          await currentUser?.update({ username: data.username });
          await updateUser(
            data.username,
            data.bio ?? "",
            currentUser?.id,
            cookies,
          );
        }

        toast.success("User updated");
        mutate("user");
        await currentUser?.reload();
      }

      if (selectedOption === "server") {
        if (files && files.avatar) {
          if (serverProfile) {
            await deleteImage(serverProfile?.avatar_asset_id!!);
          }
          const file = await uploadFile(files?.avatar);

          await updateServerProfile(
            serverProfile.server_id,
            serverProfile.user_id,
            data.username,
            file?.url,
            file?.publicId,
            data.bio ?? "",
          );
        } else {
          await updateServerProfile(
            serverProfile.server_id,
            serverProfile.user_id,
            data.username,
            data.avatar,
            "",
            data.bio ?? "",
          );
        }
        toast.success("Server profile updated");
        mutate("server-profile");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Unknown error");
      }
    }
  }

  return (
    <div className="grid w-full gap-5 py-5 md:grid-cols-1 lg:grid-cols-2">
      <Form {...form}>
        <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <div>
                    <Input
                      {...field}
                      placeholder="username"
                      className="w-full rounded border-none bg-foreground p-3 shadow-none placeholder:text-sm placeholder:capitalize placeholder:text-gray-2 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <div className="mt-7 h-px w-full rounded-full bg-gray-1"></div>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem className="border-b border-b-foreground">
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <div>
                    <Input
                      {...field}
                      placeholder="Add bio"
                      className="w-full rounded border-none bg-foreground p-3 shadow-none placeholder:text-sm placeholder:capitalize placeholder:text-gray-2 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <div className="mt-7 h-px w-full rounded-full bg-gray-1"></div>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="avatar"
            render={({ field }) => (
              <FormItem className="border-b border-b-foreground">
                <FormLabel className="pb-2">Avatar</FormLabel>
                <FormControl>
                  <div>
                    <Label
                      htmlFor="avatar"
                      className="mt-1 cursor-pointer rounded-md bg-primary p-3"
                    >
                      Change avatar
                    </Label>
                    <Input
                      onChange={(e) => handleChange(e, "avatar")}
                      name="file"
                      id="avatar"
                      type="file"
                      className="hidden w-full rounded border-none bg-foreground p-3 shadow-none placeholder:text-sm placeholder:capitalize placeholder:text-gray-2 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <div className="mt-7 h-px w-full rounded-full bg-gray-1"></div>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="avatar"
            render={({ field }) => (
              <FormItem className="border-b border-b-foreground">
                <FormLabel>Avatar Decoration</FormLabel>
                <FormControl>
                  <div>
                    <Label htmlFor="avatar">
                      <Button>Change decoration</Button>
                    </Label>
                    <Input
                      disabled
                      name="file"
                      id="avatar"
                      type="file"
                      className="hidden w-full rounded border-none bg-foreground p-3 shadow-none placeholder:text-sm placeholder:capitalize placeholder:text-gray-2 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <div className="mt-7 h-px w-full rounded-full bg-gray-1"></div>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="avatar"
            render={({ field }) => (
              <FormItem className="border-b border-b-foreground">
                <FormLabel>Profile effect</FormLabel>
                <FormControl>
                  <div>
                    <Label htmlFor="avatar">
                      <Button>Change effect</Button>
                    </Label>
                    <Input
                      disabled
                      name="file"
                      id="avatar"
                      type="file"
                      className="hidden w-full rounded border-none bg-foreground p-3 shadow-none placeholder:text-sm placeholder:capitalize placeholder:text-gray-2 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <div className="mt-7 h-px w-full rounded-full bg-gray-1"></div>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="avatar"
            render={({ field }) => (
              <FormItem className="border-b border-b-foreground">
                <FormLabel>Avatar Decoration</FormLabel>
                <FormControl>
                  <div>
                    <Label htmlFor="avatar">
                      <Button>Change decoration</Button>
                    </Label>
                    <Input
                      disabled
                      name="file"
                      id="avatar"
                      type="file"
                      className="hidden w-full rounded border-none bg-foreground p-3 shadow-none placeholder:text-sm placeholder:capitalize placeholder:text-gray-2 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <div className="mt-7 h-px w-full rounded-full bg-gray-1"></div>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <Button disabled={isSubmitting} type="submit">
            Update
          </Button>
        </form>
      </Form>
      <UserInfo
        selectedOption={selectedOption}
        avatar={preview && preview.avatar ? preview?.avatar : data.avatar}
        bio={data.bio ?? ""}
        username={data.username}
      />
    </div>
  );
}
