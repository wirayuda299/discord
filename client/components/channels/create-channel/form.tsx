import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { KeyedMutator } from "swr";

import { createChannel } from "@/actions/channel";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import ChannelTypeItem from "./channel-type";
import { Input } from "@/components/ui/input";

const schema = z.object({
  channelType: z.enum(["text", "audio"]),
  name: z.string().min(4),
});

export default function CreateChannelForm<T>({
  serverId,
  type,
  mutate,
}: {
  serverId: string;
  type: string;
  mutate: KeyedMutator<T>;
}) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      channelType: type as z.infer<typeof schema>["channelType"],
      name: "",
    },
  });
  async function onSubmit(data: z.infer<typeof schema>) {
    const { channelType, name } = data;
    const joinedName = name.split(" ").join("-");
    try {
      await createChannel(
        joinedName,
        serverId,
        channelType,
        "/server/" + serverId,
      );
      // @ts-ignore
      mutate("server/" + serverId);
      form.resetField("name");
      toast.success("New channel has been created");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Unknown error");
      }
    }
  }
  const isValid = form.formState.isValid;
  const isSubmitting = form.formState.isSubmitting;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="channelType"
          render={({ field }) => (
            <FormItem>
              <ChannelTypeItem value={field.value} form={form} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="mt-5">
              <FormLabel className="text-gray-2 uppercase">
                Channel name
              </FormLabel>
              <FormControl>
                <Input
                  onClick={(e) => e.stopPropagation()}
                  autoComplete="off"
                  placeholder="# new-channel"
                  className="bg-foreground ring-offset-background text-white caret-white focus:border-none  focus-visible:border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                  required
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="mt-3 flex items-center justify-end gap-3">
          <DialogClose
            className="text-white"
            type="button"
            onClick={(e) => e.stopPropagation()}
          >
            Cancel
          </DialogClose>

          <Button
            aria-disabled={!isValid || isSubmitting}
            disabled={!isValid || isSubmitting}
            className="bg-primary text-white"
          >
            Create Channel
          </Button>
        </div>
      </form>
    </Form>
  );
}
