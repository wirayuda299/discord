"use client";

import { Cross, Plus, SendHorizontal } from "lucide-react";
import z from "zod";
import { useForm } from "react-hook-form";
import { Suspense, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";

import { cn } from "@/lib/utils";
import useUploadFile from "@/hooks/useFileUpload";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import EmojiPickerButton from "./emoji-picker";
import { Textarea } from "./ui/textarea";

const schema = z.object({
  author_id: z.string(),
  channel_id: z.string(),
  message: z.string().min(1),
  image: z.string().optional(),
});

export default function ChatForm({
  channelName,
  channelId,
  styles,
}: {
  channelName: string;
  channelId: string;
  styles?: string;
}) {
  const { userId } = useAuth();
  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      author_id: userId!!,
      channel_id: channelId,
      message: "",
      image: "",
    },
    resolver: zodResolver(schema),
  });
  const { handleChange, preview } = useUploadFile(form);

  const [selectedTenor, setSelectedTenor] = useState<{
    id: string;
    url: string;
  } | null>(null);

  async function onSubmit(data: z.infer<typeof schema>) {
    console.log(data);
    form.resetField("message");
    form.setValue("image", "");
    setSelectedTenor(null);
  }

  const image = form.watch("image");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div
          className={cn(
            "flex items-center gap-2 border-t border-t-background rounded-sm bg-black py-[13.5px] px-3 md:bg-background/50 md:brightness-125",
            styles,
          )}
        >
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className=" ">
                <FormControl className="w-full px-2 sm:px-5">
                  <div className="relative">
                    {(selectedTenor || (image && preview && preview.image)) && (
                      <Suspense fallback={"loading..."}>
                        <div className="relative w-max">
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
                          <button
                            type="button"
                            onClick={(e) => {
                              setSelectedTenor(null);
                              form.resetField("image");
                            }}
                            className="bg-background absolute right-0 top-0 rounded-full p-1"
                          >
                            <Cross />
                          </button>
                        </div>
                      </Suspense>
                    )}
                    <label
                      title="Upload image"
                      htmlFor="image-upload"
                      className="bg-background md:bg-foreground flex h-6 min-w-6 cursor-pointer items-center justify-center rounded-full md:h-7 md:min-h-7 md:min-w-7 md:p-1"
                    >
                      <Plus className="text-gray-2 text-base md:text-lg" />
                    </label>
                    <input
                      onChange={(e) => handleChange(e, "image")}
                      type="file"
                      name="file"
                      id="image-upload"
                      className="hidden"
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
                    placeholder={`Message #${channelName}`}
                    autoComplete="off"
                    cols={10}
                    rows={1}
                    className="bg-background/20 md:bg-foreground flex min-h-[30px] w-full items-center rounded-full border-none px-3 pt-2 text-sm font-light text-white caret-white brightness-110 focus:outline-none focus-visible:shadow-none focus-visible:ring-offset-0"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <EmojiPickerButton form={form} />
          <button type="submit">
            <SendHorizontal className="text-gray-2" />
          </button>
        </div>
      </form>
    </Form>
  );
}
