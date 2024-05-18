/* eslint-disable camelcase */
import { ArrowLeft, Check, ImagePlus, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useEffect } from "react";
import { useSWRConfig } from "swr";

import { cn } from "@/lib/utils";
import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useUploadFile from "@/hooks/useFileUpload";
import { colors } from "@/constants/colors";
import { Switch } from "@/components/ui/switch";
import { createRole } from "@/actions/roles";
import { deleteImage, uploadFile } from "@/helper/file";
import { Role, updateRole } from "@/helper/roles";
import { createError } from "@/utils/error";

const schema = z.object({
  name: z.string().min(4).max(20),
  color: z.string(),
  icon: z.string(),
  manage_channel: z.boolean(),
  manage_role: z.boolean(),
  kick_member: z.boolean(),
  ban_member: z.boolean(),
  attach_file: z.boolean(),
  manage_thread: z.boolean(),
  manage_message: z.boolean(),
});
const tabs = ["display", "permissions", "manage members"] as const;

type Props = {
  selectedRole: Role | null;
  selectRole: (role: Role | null) => void;
  selectTab: (tab: string) => void;
  selectType: (type: "create" | "update" | null) => void;
  roles: Role[];
  selectedTab: string;
  serverId: string;
  type: "create" | "update" | null;
};

export default function RolesSettings({
  selectedRole,
  selectRole,
  roles,
  type,
  selectTab,
  serverId,
  selectType,
  selectedTab,
}: Props) {
  const { mutate } = useSWRConfig();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      color: selectedRole ? selectedRole.role_color : "#99aab5",
      name: selectedRole ? selectedRole.name : "new role",
      icon: selectedRole ? selectedRole.icon : "",
      attach_file: selectedRole ? selectedRole.permissions.attach_file : false,
      ban_member: selectedRole ? selectedRole.permissions.ban_member : false,
      kick_member: selectedRole ? selectedRole.permissions.kick_member : false,
      manage_channel: selectedRole
        ? selectedRole.permissions.manage_channel
        : false,
      manage_message: selectedRole
        ? selectedRole.permissions.manage_message
        : false,
      manage_role: selectedRole ? selectedRole.permissions.manage_role : false,
      manage_thread: selectedRole
        ? selectedRole.permissions.manage_thread
        : false,
    },
  });
  const { handleChange, preview, files } = useUploadFile(form);

  const onSubmit = async (data: z.infer<typeof schema>) => {
    let media = null;
    try {
      if (files && files.icon) {
        const [, file] = await Promise.all([
          form.formState.dirtyFields.icon && selectedRole?.icon_asset_id
            ? deleteImage(selectedRole?.icon_asset_id)
            : Promise.resolve(),
          uploadFile(files.icon),
        ]);

        media = file;
      }

      const {
        color,
        name,
        attach_file,
        ban_member,
        kick_member,
        manage_channel,
        manage_message,
        manage_role,
        manage_thread,
      } = data;
      if (type === "create") {
        await createRole(
          color,
          name,
          media?.url || "",
          media?.publicId || "",
          serverId,
          attach_file,
          ban_member,
          kick_member,
          manage_channel,
          manage_message,
          manage_role,
          manage_thread,
        );
      }

      if (type === "update" && selectedRole) {
        await updateRole(
          color,
          name,
          media?.url || icon,
          media?.publicId || selectedRole.icon_asset_id,
          serverId,
          selectedRole?.id,
          attach_file,
          ban_member,
          kick_member,
          manage_channel,
          manage_message,
          manage_role,
          manage_thread,
        );
      }

      mutate("roles");
      toast.success(
        type === "create" ? "New role created" : "Role has been updated",
      );
    } catch (error) {
      createError(error);
      console.log(error);
    }
  };

  const icon = form.watch("icon");
  const isEdited = form.formState.isDirty;
  const isSubmitting = form.formState.isSubmitting;

  console.log({ type });

  useEffect(() => {
    form.reset({
      color: selectedRole ? selectedRole.role_color : "#99aab5",
      name: selectedRole ? selectedRole.name : "new role",
      icon: selectedRole ? selectedRole.icon : "",
      attach_file: selectedRole ? selectedRole.permissions.attach_file : false,
      ban_member: selectedRole ? selectedRole.permissions.ban_member : false,
      kick_member: selectedRole ? selectedRole.permissions.kick_member : false,
      manage_channel: selectedRole
        ? selectedRole.permissions.manage_channel
        : false,
      manage_message: selectedRole
        ? selectedRole.permissions.manage_message
        : false,
      manage_role: selectedRole ? selectedRole.permissions.manage_role : false,
      manage_thread: selectedRole
        ? selectedRole.permissions.manage_thread
        : false,
    });

    if (selectedRole) {
      selectType("update");
    } else {
      selectType("create");
      selectRole(null);
    }
  }, [selectedRole, type]);

  console.log(roles);

  return (
    <div className="flex w-full gap-3">
      <aside className="size-full min-h-screen max-w-52 border-r border-r-foreground">
        <header className="flex justify-between p-1">
          <button
            onClick={() => {
              selectRole(null);
              selectType(null);
            }}
            className="flex items-center gap-3"
          >
            <ArrowLeft /> <span className="text-base font-semibold">Back</span>
          </button>
          <button
            onClick={() => {
              selectRole(null);
              selectType("create");
            }}
          >
            <Plus size={18} />
          </button>
        </header>
        <ul className="flex flex-col gap-3 pl-9 pr-4">
          {roles.map((role) => (
            <li
              onClick={() => selectRole(role)}
              key={role.name}
              className={cn(
                "text-sm hover:bg-background hover:brightness-110 font-medium capitalize py-2 rounded flex items-center gap-2 cursor-pointer",
                selectedRole?.name === role.name &&
                  "bg-background brightness-110",
              )}
            >
              <div
                className="size-2 rounded-full"
                style={{ background: role.role_color }}
              ></div>
              {role.name}
            </li>
          ))}
        </ul>
      </aside>
      <div className="w-full">
        <h4 className="text-lg font-medium uppercase">
          Edit Role -- {selectedRole?.name}
        </h4>
        <ul className="flex w-full items-center gap-5 border-b border-b-foreground py-5">
          {tabs.map((tab) => (
            <li
              onClick={() => selectTab(tab)}
              className={cn(
                "cursor-pointer text-base transition-colors ease duration-300 font-normal capitalize hover:text-primary",
                selectedTab === tab && "text-primary",
              )}
              key={tab}
            >
              {tab}
            </li>
          ))}
        </ul>
        <Form {...form}>
          <form
            className=" mt-5 space-y-5 "
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {selectedTab === "display" && (
              <>
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Role name <span className="text-red-700">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Role name"
                          className="border-none bg-foreground  ring-offset-transparent focus:shadow-none focus-visible:border-none focus-visible:ring-0 focus-visible:ring-transparent"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <hr />
                <FormField
                  name="color"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Role color <span className="text-red-700">*</span>
                      </FormLabel>
                      <FormDescription className="text-gray-2">
                        Members use the color of the highest role they have on
                        their role list.
                      </FormDescription>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <div className="flex size-[87px] min-w-[87px] items-center justify-center bg-gray-2 text-center text-sm text-foreground">
                            <div className="text-gray-1">
                              Default
                              <Check className="mx-auto text-center" />
                            </div>
                          </div>
                          <Input
                            {...field}
                            type="color"
                            className="size-28 min-w-28 cursor-auto !rounded-md border-none bg-transparent ring-offset-transparent focus:shadow-none focus-visible:border-none focus-visible:ring-0 focus-visible:ring-transparent"
                          />
                          <div className="flex flex-wrap gap-3">
                            {colors.map((color) => (
                              <button
                                type="button"
                                title={color}
                                onClick={() => form.setValue("color", color)}
                                key={color}
                                className={`size-10 rounded-md`}
                                style={{ backgroundColor: color }}
                              ></button>
                            ))}
                          </div>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <hr />

                <FormField
                  name="icon"
                  control={form.control}
                  render={() => (
                    <FormItem>
                      <FormLabel>Role icon</FormLabel>
                      <FormDescription className="text-gray-2">
                        Upload an image under 256 KB or pick a custom emoji from
                        this server. We recommend at least 64x64 pixels. Members
                        will see the icon for their highest role if they have
                        multiple roles.
                      </FormDescription>
                      <FormControl>
                        <>
                          <div className="flex gap-3">
                            {icon || (preview && preview.icon) ? (
                              <Image
                                className="aspect-square size-[100px] rounded-md object-cover"
                                src={icon}
                                width={100}
                                height={100}
                                alt="icon"
                              />
                            ) : (
                              <div className="flex size-20 items-center justify-center rounded-md bg-foreground">
                                <ImagePlus className="text-gray-1" />
                              </div>
                            )}
                            <FormLabel
                              htmlFor="icon"
                              className="h-9 w-32 rounded border p-2 text-center"
                            >
                              {icon || (preview && preview.icon)
                                ? "Change Image"
                                : "Choose Image"}
                            </FormLabel>
                          </div>
                          <Input
                            onChange={(e) => handleChange(e, "icon")}
                            id="icon"
                            name="file"
                            accept=".jpg,.png,.jpeg"
                            className="hidden"
                            placeholder="Server logo"
                            type="file"
                          />
                        </>
                      </FormControl>
                      <div className="flex w-full gap-3 rounded-md bg-foreground p-3">
                        <Image
                          src={"/icons/discord.svg"}
                          width={30}
                          height={30}
                          alt="discord"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4
                              className=" gap-2 text-sm font-medium"
                              style={{
                                color: form.getValues("color"),
                              }}
                            >
                              Username
                            </h4>
                            {icon && (
                              <Image
                                src={icon}
                                width={20}
                                height={20}
                                className="size-5 rounded-full object-cover"
                                alt="role icon"
                              />
                            )}
                            <span className="text-xs font-light">
                              Today at 12.00 am
                            </span>
                          </div>
                          <p className="text-sm text-gray-2">This is cool</p>
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </>
            )}

            {selectedTab === "permissions" && (
              <div className="flex flex-col gap-9">
                <FormField
                  control={form.control}
                  name="manage_channel"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between">
                        <FormLabel>Manage channels</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </div>
                      <FormDescription className="text-gray-2">
                        Allows members to create, edit, or delete channels.
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="manage_role"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between">
                        <FormLabel>Manage role</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </div>
                      <FormDescription className="text-gray-2">
                        Allows members to create, edit, or delete roles.
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ban_member"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between">
                        <FormLabel>Ban member</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </div>
                      <FormDescription className="text-gray-2">
                        Allows members to permanently ban member.
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="kick_member"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between">
                        <FormLabel>Kick member</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </div>
                      <FormDescription className="text-gray-2">
                        Allows members to kick member.
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="attach_file"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between">
                        <FormLabel>Attach file</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </div>
                      <FormDescription className="text-gray-2">
                        Allows members to attach file.
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="manage_thread"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between">
                        <FormLabel>Manage thread</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </div>
                      <FormDescription className="text-gray-2">
                        Allows members to create, edit, or delete threads.
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="manage_message"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between">
                        <FormLabel>Manage messages</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </div>
                      <FormDescription className="text-gray-2">
                        Allows members to create, edit, or delete messages.
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
            )}

            <Button
              disabled={!isEdited || isSubmitting}
              type="submit"
              className="capitalize"
            >
              {type}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
