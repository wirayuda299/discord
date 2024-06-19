import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Categories } from "@/types/channels";
import { Button } from "@/components/ui/button";
import { createError } from "@/utils/error";
import { deleteChannel, updateChannel } from "@/helper/server";
import { revalidate } from "@/utils/cache";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { usePermissionsContext } from "@/providers/permissions";



const schema = z.object({
  name: z.string().min(4).max(50),
  topic: z.string()
})

type Props = {
  selectedChannel: Categories | null,
  serverId: string,
  serverAuthor: string,
  reset: () => void
  handleClose: () => void
}

export default function ChannelSetting({ selectedChannel, serverId, serverAuthor, reset, handleClose }: Props) {
  const { userId } = useAuth()
  const [deleteLoading, setDeleteLoading] = useState(false)
  const pathname = usePathname()
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: selectedChannel?.channel_name || '',
      topic: selectedChannel?.topic || ''
    }
  })

  const { permission, loading, errors } = usePermissionsContext()

  const isSubmitting = form.formState.isSubmitting
  const isChanged = form.formState.isDirty
  const isValid = form.formState.isValid

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

  const handleDeleteChannel = async () => {
    try {
      setDeleteLoading(true)
      await deleteChannel(serverId, userId!, selectedChannel?.channel_id!, serverAuthor, pathname, selectedChannel?.channel_type!).then(() => {
        handleClose()
        toast.success("Channel has been deleted")
      })

    } catch (e) {
      createError(e)

    } finally {
      setDeleteLoading(false)
    }
  }

  if (loading || errors) return <span>...</span>
  const isAllowedToManageChannel = (userId === serverAuthor) || (permission && permission.manage_channel)

  if (!isAllowedToManageChannel) return null
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
        <Dialog>
          <DialogTrigger asChild>
            <Button disabled={deleteLoading} className="w-full rounded !bg-red-500" type="button">
              {deleteLoading ? 'deleting...' : 'Delete channel'}</Button>
          </DialogTrigger>
          <DialogContent className="border-gray-1 bg-black rounded-lg text-center text-white">
            <DialogHeader className="text-center items-center">
              Are you sure want to delete this channel?
            </DialogHeader>
            <DialogDescription className='text-center text-gray-2 text-sm text-pretty'>
              This action cannot be undone. Deleting the channel will permanently remove all its content, including messages and files. Please confirm if you wish to proceed.
            </DialogDescription>
            <div className="flex-center gap-2">
              <DialogClose className="w-full">
                Cancel
              </DialogClose>
              <Button disabled={deleteLoading} aria-disabled={deleteLoading} className="w-full !bg-red-600" onClick={handleDeleteChannel}>Delete</Button>
            </div>
          </DialogContent>
        </Dialog>
        <Button
          disabled={isSubmitting || !isValid || !isChanged}
          className="w-full rounded">
          {isSubmitting ? "Updating channel..." : "Save Changes"}
        </Button>
      </form>
    </Form>

  )
}
