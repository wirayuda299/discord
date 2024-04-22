"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Suspense, useState, useEffect, Dispatch, SetStateAction } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { X, Plus, SendHorizontal } from "lucide-react";
import Link from "next/link";
import { useSWRConfig } from "swr";
import { toast } from "sonner";

import useUploadFile from "@/hooks/useFileUpload";
import EmojiPickerButton from "./emoji-picker";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Textarea } from "../ui/textarea";
import { useSocketContext } from "@/providers/socket-io";
import { uploadFile } from "@/helper/file";
import { ServerStates } from "@/providers/server";
import { ChatSchema, chatSchema } from "@/validations";
import { createError } from "@/utils/error";
import { createThread } from "@/actions/threads";

type Props = {
	value: string;
	styles?: string;
	serverStates: ServerStates;
	setServerStates: Dispatch<SetStateAction<ServerStates>>;
};

export default function ChatForm({
  styles,
  serverStates,
  setServerStates,
  value,
}: Props) {
  const params = useParams();
  const { mutate } = useSWRConfig();
  const { selectedServer, selectedChannel, selectedMessage } = serverStates;

  const form = useForm<ChatSchema>({
    defaultValues: {
      author_id: selectedServer ? selectedServer?.serverProfile.user_id : "",
      channel_id: selectedChannel ? selectedChannel.channel_id : "",
      message: "",
      image: "",
    },
    resolver: zodResolver(chatSchema),
  });
  const { socket } = useSocketContext();
  const searchParams = useSearchParams();
  const { handleChange, preview, files } = useUploadFile(form);

  const [selectedTenor, setSelectedTenor] = useState<{
    id: string;
    url: string;
  } | null>(null);

  async function onSubmit(data: ChatSchema) {
    const type = searchParams.get("type");

    const messageData = {
      content: data.message.trim(),
      is_read: false,
      user_id: selectedServer?.serverProfile.user_id,
      username: selectedServer?.serverProfile.username,
      channel_id: params.channel_id as string,
      server_id: params.id as string,
      avatar: selectedServer?.serverProfile.avatar,
      type: "channel",
      imageAssetId: "",
      imageUrl: "",
      messageId: "",
      parentMessageId: "",
    };

    try {
      let image: { publicId: string; url: string } | null = null;

      if (files && files.image) {
        image = await uploadFile(files.image);
      }

      switch (type) {
        case "thread":
          if (!value || value === "") {
            return toast.error("Name is required");
          } else {
            await createThread({
              channelId: data.channel_id,
              message: data.message,
              msgId: selectedMessage?.message_id || "",
              threadName: value,
              userId: data.author_id,
              imageAssetId: image?.publicId || "",
              imageUrl: image?.url || "",
            }).then(() => {
              toast.success("Thread has been created");
              socket?.emit("get-channel-message", {
                channelId: params.channel_id,
                serverId: params.id,
              });
              mutate("all-threads");
            });
          }
          break;

        case "reply":
          messageData.imageAssetId = image?.publicId || "";
          messageData.imageUrl = image?.url || "";
          messageData.type = "reply";
          messageData.messageId = selectedMessage?.message_id!!;
          messageData.parentMessageId = selectedMessage?.message_id!!;

          socket?.emit("message", messageData);

          break;
        default:
          messageData.imageAssetId = image?.publicId || "";
          messageData.imageUrl = image?.url || "";
          messageData.type = "channel";
          socket?.emit("message", messageData);
          socket?.emit("get-channel-message", {
            channelId: params.channel_id,
            serverId: params.id,
          });
          break;
      }

      resetForm();
    } catch (error) {
      createError(error);
    }
  }

  useEffect(() => {
    if (selectedChannel) {
      form.setValue("channel_id", params.channel_id as string);
    }
  }, [form, params.channel_id, selectedChannel]);

  const appendEmojiToMessage = (e: any) => {
    const current = form.getValues("message");
    form.setValue("message", current + e.emoji);
  };

  const resetForm = () => {
    form.resetField("message");
    form.setValue("image", "");
    setSelectedTenor(null);
    setServerStates((prev) => ({
      ...prev,
      selectedMessage: null,
    }));
  };

  const deleteImage = () => {
    setSelectedTenor(null);
    form.setValue("image", "");
  };

  const image = form.watch("image");
  const isSubmitting = form.formState.isSubmitting;
  const isValid = form.formState.isValid;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="relative w-full">
        {selectedMessage && searchParams.get("type") === "reply" && (
          <div className="absolute -top-9 left-0 flex w-full items-center justify-between rounded-t-xl bg-[#2b2d31] p-2">
            <p className="bottom-16 text-sm text-gray-2">
              Replying to{" "}
              <span className="font-semibold text-gray-2 brightness-150">
                {selectedMessage.username}
              </span>
            </p>
            <Link
              href={`/server/${serverStates.selectedServer?.id}/${selectedChannel?.channel_id}?channel_type=${selectedChannel?.channel_type}`}
              className="flex size-5 items-center justify-center rounded-full bg-gray-2"
              onClick={() => {
                setServerStates((prev) => ({
                  ...prev,
                  selectedMessage: null,
                }));
              }}
            >
              <X size={15} className="mx-auto text-gray-1" />
            </Link>
          </div>
        )}
        <div
          className={cn(
            "flex items-center gap-2 border-t border-t-background rounded-sm bg-black py-[13.5px] w-full px-3 md:bg-[#383a40] ",
            styles,
          )}
        >
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className=" ">
                <FormControl className="w-full px-2 ">
                  <div className="relative">
                    {(selectedTenor || (image && preview && preview.image)) && (
                      <Suspense fallback={"loading..."}>
                        <div className="absolute -top-32 w-max">
                          <Image
                            className="aspect-square rounded-md object-cover "
                            priority
                            src={
                              selectedTenor?.url || (preview && preview?.image)!
                            }
                            width={100}
                            height={100}
                            alt="image"
                          />
                          {!isSubmitting && (
                            <button
                              type="button"
                              onClick={deleteImage}
                              className="absolute -right-4 -top-3 min-h-5 min-w-5 rounded-full border bg-white p-1"
                            >
                              <X className="text-sm text-red-600" size={18} />
                            </button>
                          )}
                        </div>
                      </Suspense>
                    )}
                    <label
                      aria-disabled={isSubmitting}
                      title="Upload image"
                      htmlFor="image-upload"
                      className="flex min-h-6 min-w-6 cursor-pointer items-center justify-center rounded-full bg-background disabled:cursor-not-allowed md:h-7 md:min-h-7 md:min-w-7 md:bg-gray-2 md:p-1"
                    >
                      <Plus className="text-base text-gray-2 md:text-lg md:text-foreground" />
                    </label>
                    <input
                      disabled={isSubmitting}
                      onChange={(e) => handleChange(e, "image")}
                      type="file"
                      name="file"
                      id="image-upload"
                      className="hidden disabled:cursor-not-allowed"
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="message"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="w-full">
                  <Textarea
                    {...field}
                    rows={1}
                    disabled={isSubmitting}
                    placeholder={`Message #${selectedChannel?.channel_name}`}
                    autoComplete="off"
                    className="flex min-h-[30px] w-full max-w-full  break-before-auto  items-center whitespace-pre-wrap break-all rounded-full !border-none bg-background/20 px-3 pt-2 text-sm font-light text-white caret-white outline-none brightness-110 focus-visible:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:animate-pulse md:bg-transparent"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <EmojiPickerButton handleClick={appendEmojiToMessage} />
          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="disabled:cursor-not-allowed"
          >
            <SendHorizontal className="text-gray-2" />
          </button>
        </div>
      </form>
    </Form>
  );
}
