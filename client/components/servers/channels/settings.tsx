import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Categories } from "@/types/channels";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { createError } from "@/utils/error";
import { updateChannel } from "@/helper/server";
import { useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { revalidate } from "@/utils/cache";


const schema = z.object({
  name: z.string().min(4).max(50),
  topic: z.string()

})

export default function ChannelSetting({ selectedChannel, serverId, serverAuthor, reset }: { selectedChannel: Categories | null, serverId: string, serverAuthor: string, reset: () => void }) {
  const { userId } = useAuth()
  const pathname = usePathname()
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: selectedChannel?.channel_name || '',
      topic: selectedChannel?.topic || ''
    }
  })

  const isSubmitting = form.formState.isSubmitting

  const handleUpdateChannel = async (data: z.infer<typeof schema>) => {
    if (!selectedChannel || !userId || !data.name) return

    try {
      const joinedName = data.name.split(' ').join('-').toLowerCase();


      await updateChannel(selectedChannel?.channel_id, userId, serverId, joinedName, serverAuthor, data.topic).then(() => {
        toast.success("Channel updated")
        revalidate(pathname)
        reset()
      })
    } catch (e) {
      createError(e)
    }


  }

  return (
    <Form {...form}>
      <form className="space-y-5" onSubmit={form.handleSubmit(handleUpdateChannel)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="uppercase text-xs font-semibold"> Channel name</FormLabel>
              <FormControl>
                <Input
                  autoFocus={false}
                  {...field}
                  maxLength={50}
                  placeholder="Channel name"
                  autoComplete='off'
                  className='flex min-h-[30px] w-full max-w-full break-before-auto items-center !border-none bg-background px-3 pt-2 text-sm text-white caret-white outline-none focus-visible:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:animate-pulse' />
              </FormControl>
            </FormItem>

          )}

        />
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="uppercase text-xs font-semibold"> Channel topic</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Channel topic"
                  autoComplete='off'
                  className='flex min-h-[30px] w-full max-w-full break-before-auto items-center !border-none bg-background px-3 pt-2 text-sm text-white caret-white outline-none focus-visible:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:animate-pulse' />
              </FormControl>
            </FormItem>

          )}
        />
        <Button disabled={isSubmitting} className="w-full rounded">{isSubmitting ? "Updating channel..." : "Save Changes"}</Button>
      </form>
    </Form>

  )
}
