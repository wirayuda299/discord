'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import Image from 'next/image';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { usePathname } from 'next/navigation';

import useUploadFile from '@/hooks/useFileUpload';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CreateServerSchemaType, createServerSchema } from '@/validations';
import { createError } from '@/utils/error';
import { DialogClose } from '@/components/ui/dialog';


export default function CreateServerForm() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [status, setStatus] = useState<string>('Create');
  const pathname = usePathname();
  const form = useForm<CreateServerSchemaType>({
    defaultValues: {
      name: isLoaded && isSignedIn ? `${user?.username}'s server` : '',
      logo: '',
    },
    resolver: zodResolver(createServerSchema),
  });

  const { handleChange, preview, files } = useUploadFile(form);

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(data: CreateServerSchemaType) {
    if (files === null || !user) return;

    let file: { publicId: string; url: string } | null = null;

    const { revalidate } = await import('@/utils/cache');
    const { createServer } = await import('@/actions/server');
    const { deleteImage, uploadFile } = await import('@/helper/file');

    setStatus('Uploading image...');
    try {
      file = await uploadFile(files.logo);
      setStatus('Image uploaded');

      if (!file.url || !file.publicId) {
        throw new Error('Please add server logo', {
          cause: 'file is not defined',
        })
      }


      setStatus('Creating server...');

      await createServer(data.name, file.url, file.publicId, user?.id).then(
        () => {
          toast.success('Server has been created 🥳', {
            className: 'text-white',
          });
          setStatus('Done');
          revalidate(pathname);
        },
      );
    } catch (error) {
      setStatus('Create Server')
      createError(error);
      if (file) {
        await deleteImage(file?.publicId);
      }
    }
  }

  return (
    <Form {...form}>
      <form className='space-y-5' onSubmit={form.handleSubmit(onSubmit)}>
        <div className='flex justify-center'>
          {preview && preview.logo ? (
            <Image
              src={preview.logo}
              width={100}
              height={100}
              alt='cover'
              className='aspect-auto size-28 rounded-full object-cover'
            />
          ) : (
            <FormField
              control={form.control}
              name='logo'
              render={() => (
                <FormItem>
                  <FormLabel
                    htmlFor='logo'
                    className='relative mx-auto mt-3 flex size-24 cursor-pointer flex-col items-center justify-center rounded-full border border-dashed'
                  >
                    <Camera size={30} />
                    <p className='py-2 text-xs font-semibold uppercase'>
                      Upload
                    </p>
                    <div className='absolute right-0 top-0 flex size-7 items-center justify-center rounded-full bg-primary'>
                      <Plus size={20} stroke='#fff' fill='#fff' />
                    </div>
                  </FormLabel>
                  <FormControl>
                    <>
                      <Input
                        onChange={(e) => handleChange(e, 'logo')}
                        id='logo'
                        name='file'
                        accept='.jpg,.png,.jpeg'
                        className='hidden'
                        placeholder='Server logo'
                        type='file'
                      />
                      <FormMessage className='text-xs text-red-600' />
                    </>
                  </FormControl>
                </FormItem>
              )}
            />
          )}
        </div>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Server name</FormLabel>
              <FormControl>
                <>
                  <Input
                    autoComplete='off'
                    placeholder='Server name'
                    className='border-none bg-background ring-offset-transparent focus:shadow-none focus-visible:border-none focus-visible:ring-0 focus-visible:ring-transparent'
                    required
                    max={25}
                    maxLength={25}
                    aria-disabled={isSubmitting}
                    disabled={isSubmitting}
                    {...field}
                  />

                  <FormMessage className='text-xs text-red-600' />
                </>
              </FormControl>
            </FormItem>
          )}
        />

        <div className='flex items-center justify-between'>
          <DialogClose
            aria-label='cancel'
            name='cancel'
            title='cancel'
            type='button'
            className='!bg-transparent text-gray-2'
          >
            Back
          </DialogClose>

          {status === 'Done' ? (

            <DialogClose
              aria-label='close'
              name='close'
              title='close'
              aria-disabled={isSubmitting}
              disabled={isSubmitting}
              type='button'
              className=' w-20 text-center px-2 py-1 rounded-sm gap-2 bg-primary text-white disabled:cursor-not-allowed disabled:opacity-80'
            >
              Close
            </DialogClose>

          ) : (
            <Button
              aria-label='create'
              name='create'
              title='create'
              aria-disabled={isSubmitting}
              disabled={isSubmitting}
              type='submit'
              className='flex items-center gap-2 bg-primary text-white disabled:cursor-not-allowed disabled:opacity-80'
            >
              {isSubmitting && (
                <div className='ease size-5 animate-spin rounded-full border-t-2 border-t-white transition-all duration-500'></div>
              )}
              {status}
            </Button>


          )}
        </div>
      </form>
    </Form>
  );
}
