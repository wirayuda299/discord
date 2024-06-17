import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUser } from '@clerk/nextjs';
import { useCallback, useEffect, useState } from 'react';
import { useSWRConfig } from 'swr';
import { toast } from 'sonner';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { updateUser } from '@/helper/user';
import useUploadFile from '@/hooks/useFileUpload';
import { deleteImage, uploadFile } from '@/helper/file';
import { User } from '@/types/user';
import { ServerProfile } from '@/types/server';
import { updateServerProfile } from '@/helper/server';
import UserInfo from './user-info';
import { createError } from '@/utils/error';
import { cn } from '@/lib/utils';

const schema = z.object({
  username: z.string().min(4),
  bio: z.string().default('').nullable(),
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
  // use this to track submitting, since there's bug in react-hook-form
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      avatar: selectedOption === 'user' ? user.image : serverProfile.avatar,
      bio: selectedOption === 'user' ? user.bio : serverProfile.bio ?? '',
      username:
        selectedOption === 'user' ? user.username : serverProfile.username,
    },
  });
  const { user: currentUser, isLoaded, isSignedIn } = useUser();

  const { handleChange, preview, files, setFiles, setPreview } =
    useUploadFile(form);

  const formValues = form.watch();
  const isChanged = form.formState.isDirty;

  const resetForm = useCallback(() => {
    if (selectedOption === 'user') {
      form.reset(
        {
          username: user.username,
          bio: user.bio,
          avatar: user.image,
        },
        { keepDirty: false },
      );
    } else {
      form.reset(
        {
          username: serverProfile.username,
          bio: serverProfile.bio ?? '',
          avatar: serverProfile.avatar,
        },
        { keepDirty: false },
      );
    }
  }, [form, selectedOption, user, serverProfile]);

  useEffect(() => {
    if (!user || !serverProfile) return;

    if (!isSubmitting) {
      setFiles(null);
      setPreview(null);
    }

    resetForm();
  }, [
    form,
    selectedOption,
    user,
    serverProfile,
    isSubmitting,
    resetForm,
    setFiles,
    setPreview,
  ]);

  if (!isLoaded || !isSignedIn) return null;

  async function onSubmit(data: z.infer<typeof schema>) {
    if (!currentUser) return;
    setIsSubmitting(true);
    try {
      if (selectedOption === 'user') {
        if (files && files.avatar) {
          const [, , file] = await Promise.all([
            user.image_asset_id
              ? deleteImage(user?.image_asset_id)
              : Promise.resolve(),
            currentUser?.setProfileImage({ file: files.avatar }),
            uploadFile(files?.avatar),
          ]);
          await updateUser(
            data.username,
            data.bio ?? '',
            currentUser.id ?? '',
            file?.url,
            file?.publicId,
          );
        } else {
          await currentUser?.update({ username: data.username });
          await updateUser(
            data.username,
            data.bio ?? '',
            currentUser?.id,
            data.avatar,
            user.image_asset_id ?? '',
          );
        }

        toast.success('User updated');
        mutate('user');
        await currentUser?.reload();
      }

      if (selectedOption === 'server') {
        if (
          form.formState.dirtyFields.avatar &&
          serverProfile &&
          files &&
          files.avatar
        ) {
          const [, file] = await Promise.all([
           serverProfile.avatar_asset_id
              ? deleteImage(serverProfile?.avatar_asset_id!!)
              : Promise.resolve(),
            uploadFile(files.avatar),
          ]);

          await updateServerProfile(
            serverProfile.server_id,
            serverProfile.user_id,
            data.username,
            file?.url,
            file?.publicId,
            data.bio ?? '',
          );
        } else {
          await updateServerProfile(
            serverProfile.server_id,
            serverProfile.user_id,
            data.username,
            data.avatar,
            user.image_asset_id ?? '',
            data.bio ?? '',
          );
        }
        toast.success('Server profile updated');
        mutate('server-profile');
      }
    } catch (error) {
      createError(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='grid w-full h-full gap-5 space-y-3 py-5 md:grid-cols-1 lg:grid-cols-2'>
          <div>
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <>
                      <Input
                        {...field}
                        autoComplete='off'
                        className='w-full rounded border-none bg-background/50 md:bg-background p-3 text-gray-2 shadow-none placeholder:text-sm placeholder:capitalize placeholder:text-gray-2 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
                      />
                      <div className='mt-7 h-px w-full rounded-full bg-gray-1'></div>
                    </>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='bio'
              render={({ field }) => (
                <FormItem className='border-b border-b-foreground'>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <>
                      {/* @ts-ignore */}
                      <Input
                        // @ts-ignore
                        {...field}
                        placeholder='Add bio'
                        autoComplete='off'
                        className='w-full rounded border-none bg-background/50 md:bg-background p-3 text-gray-2 shadow-none placeholder:text-sm placeholder:capitalize placeholder:text-gray-2 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
                      />
                      <div className='mt-7 h-px w-full rounded-full bg-gray-1'></div>
                    </>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='avatar'
              render={() => (
                <FormItem className='border-b border-b-foreground'>
                  <>
                    <FormLabel className='py-2 block'>Avatar</FormLabel>
                    <div>
                      <Label
                        htmlFor='avatar'
                        className='mt-1 cursor-pointer rounded-md bg-primary p-3 text-white'
                      >
                        Change avatar
                      </Label>
                      <Input
                        onChange={(e) => handleChange(e, 'avatar')}
                        name='file'
                        id='avatar'
                        type='file'
                        className='hidden w-full rounded border-none bg-foreground p-3 text-gray-2 shadow-none placeholder:text-sm placeholder:capitalize placeholder:text-gray-2 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
                      />
                      <div className='mt-7 h-px w-full rounded-full bg-gray-1'></div>
                    </div>
                  </>
                </FormItem>
              )}
            />
          </div>
          <UserInfo
            selectedOption={selectedOption}
            avatar={
              preview && preview.avatar ? preview?.avatar : formValues.avatar
            }
            bio={formValues.bio ?? ''}
            username={formValues.username}
          />
        </div>

        <div
          className={cn(
            'sticky w-full rounded-sm bg-black p-2 transition-all duration-300 ease-in-out',
            isChanged || isSubmitting
              ? 'bottom-10 opacity-100 md:bottom-0'
              : '-bottom-full opacity-0',
          )}
        >
          <div className='flex w-full flex-col items-center justify-between gap-2 md:flex-row'>
            <p className='text-sm font-medium text-gray-2'>
              Careful - <span>you have unsave changes!</span>
            </p>
            <div className='flex-center gap-4'>
              <Button
                disabled={!isChanged}
                type='button'
                onClick={resetForm}
                className='!bg-transparent'
              >
                Reset
              </Button>
              <Button
                disabled={!isChanged || isSubmitting}
                className='rounded bg-green-700 text-sm hover:bg-green-800'
              >
                {isSubmitting ? 'Updating...' : 'Save changes'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
