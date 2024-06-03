import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { ImagePlus } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';

import { Switch } from '@/components/ui/switch';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '../../../ui/form';
import { Input } from '@/components/ui/input';
import { updateServerSchema, UpdateServerSchemaType } from '@/validations';
import { Button } from '@/components/ui/button';
import { Servers } from '@/types/server';
import { cn } from '@/lib/utils';
import useUploadFile from '@/hooks/useFileUpload';
import { updateServer } from '@/helper/server';
import { createError } from '@/utils/error';
import { revalidate } from '@/utils/cache';
import { deleteImage, uploadFile } from '@/helper/file';

type ImageResType = { url: string; publicId: string };

export default function ServerOverview({ server }: { server: Servers }) {
  const [status, setStatus] = useState<string>('');

  const form = useForm({
    resolver: zodResolver(updateServerSchema),
    defaultValues: {
      name: server.name,
      logo: server.logo,
      showProgressBar: server.settings.show_progress_bar,
      showBanner: server.settings.show_banner_background,
      banner: server.banner,
    },
  });

  const { userId } = useAuth();

  const isChanged = form.formState.isDirty;
  const isValid = form.formState.isValid;
  const isSubmitting = form.formState.isSubmitting;
  const editedFields = form.formState.dirtyFields;
  const logo = form.watch('logo');
  const banner = form.watch('banner');

  const { handleChange, files } = useUploadFile(form);

  const resetForm = () =>
    form.reset({
      banner: server.banner,
      logo: server.logo,
      name: server.name,
      showBanner: server.settings.show_banner_background,
      showProgressBar: server.settings.show_progress_bar,
    });

  const handleFileUpload = async (fileKey: string, assetId?: string) => {
    try {
      if (files && files[fileKey]) {
        if (assetId) {
          setStatus(`Deleting ${fileKey}...`);
          await deleteImage(assetId);
        }
        setStatus(`Uploading new ${fileKey}...`);
        const uploadedFile = await uploadFile(files[fileKey]);
        return uploadedFile;
      }
    } catch (error) {
      createError(error);
      throw new Error('File upload failed');
    }
  };

  const updateServerData = async (
    logo: ImageResType,
    banner: ImageResType,
    name: string,
    showBanner: boolean,
    showProgressBar: boolean,
  ) => {
    try {
      setStatus('Updating server...');
      await updateServer(
        server.id,
        name,
        logo?.url!,
        logo?.publicId!,
        banner?.url,
        banner?.publicId,
        userId!!,
        showBanner,
        showProgressBar,
      );
    } catch (error) {
      createError(error);
      throw new Error('Server update failed');
    }
  };

  const handleUpdateServer = async (data: UpdateServerSchemaType) => {
    try {
      let logo, banner;

      if (editedFields.logo) {
        logo = await handleFileUpload('logo', server.logo_asset_id);
        if (!logo) {
          throw new Error('Logo upload failed');
        }
      }

      if (editedFields.banner) {
        banner = await handleFileUpload(
          'banner',
          server?.banner_asset_id || '',
        );
        if (!banner) {
          throw new Error('Banner upload failed');
        }
      }

      await updateServerData(
        logo || {
          publicId: server.logo_asset_id || '',
          url: server.logo || '',
        },
        banner || {
          publicId: server.banner_asset_id || '',
          url: server.banner || '',
        },
        data.name,
        data.showBanner,
        data.showProgressBar,
      );

      revalidate(`/server/${server.id}`);
      toast.success('Server has been updated');
    } catch (error) {
      createError(error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleUpdateServer)}
        className='h-full max-h-screen overflow-y-auto p-7'
      >
        <h2 className='pb-5 text-lg font-semibold text-white'>
          Server overview
        </h2>
        <div className='grid grid-cols-2 gap-5 border-b border-background pb-6 max-xl:grid-cols-1'>
          <FormField
            control={form.control}
            name='logo'
            render={() => (
              <FormItem className='flex gap-10'>
                <FormLabel
                  htmlFor='icon'
                  className='group relative flex size-32 min-w-32 cursor-pointer place-content-center place-items-center rounded-full shadow-2xl'
                >
                  <Image
                    className='mx-auto aspect-auto h-full w-full rounded-full object-cover'
                    src={logo || '/general/icons/discord.svg'}
                    width={200}
                    height={200}
                    alt='icon'
                  />
                  <div className='absolute flex size-32 items-center justify-center text-balance rounded-full bg-background/50 text-center text-sm font-semibold uppercase leading-tight text-gray-2 opacity-0 group-hover:opacity-100'>
                    Change <br /> icon
                  </div>
                  <div className='absolute right-0 top-0 flex size-6 items-center justify-center rounded-full bg-white'>
                    <ImagePlus size={15} className='stroke-gray-1' />
                  </div>
                </FormLabel>
                <div className='flex flex-col gap-2'>
                  <p className='text-balance text-sm text-gray-2'>
                    We recommend an image of at least 512x512 for the server.
                  </p>
                  <input
                    onChange={(e) => handleChange(e, 'logo')}
                    type='file'
                    name='file'
                    id='icon'
                    className='hidden'
                  />

                  <FormLabel
                    htmlFor='icon'
                    className='inline-block w-36 cursor-pointer rounded border border-gray-2 p-2 text-center text-white'
                  >
                    Upload image
                  </FormLabel>
                </div>
                <FormMessage className='text-red-600' />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Server name</FormLabel>
                <FormItem>
                  <Input
                    {...field}
                    autoComplete='off'
                    className='focus-visible:border-none focus-visible:ring-0 focus-visible:ring-offset-0'
                    placeholder='Server name'
                  />
                  <FormMessage className='text-red-600' />
                </FormItem>
              </FormItem>
            )}
          />
        </div>

        <div className='py-6'>
          <h2 className='text-lg font-semibold text-white'>Display</h2>
          <div className='flex flex-col gap-10'>
            <div className='mt-5 grid grid-cols-2 gap-5 max-lg:grid-cols-1'>
              <FormField
                control={form.control}
                name='showProgressBar'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex-center justify-between'>
                      <FormLabel className='text-white'>
                        Show progress bar
                      </FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            form.setValue('showProgressBar', checked, {
                              shouldDirty: true,
                              shouldTouch: true,
                            });
                          }}
                        />
                      </FormControl>
                    </div>

                    <FormDescription className='text-balance text-sm font-normal leading-normal text-[#b5b8bc]'>
                      This progress bar will display in your channel list,
                      attached to your server name (or server banner if you have
                      one set).
                    </FormDescription>
                  </FormItem>
                )}
              />
              <Image
                src={'/server/images/server-boost.png'}
                width={500}
                height={500}
                alt='server boost'
              />
            </div>
            <div className='mt-5 grid grid-cols-2 gap-5 max-lg:grid-cols-1'>
              <FormField
                control={form.control}
                name='showBanner'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex-center justify-between'>
                      <FormLabel className='text-white'>
                        Show banner background
                      </FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            form.setValue('showBanner', checked, {
                              shouldDirty: true,
                              shouldTouch: true,
                            });
                          }}
                        />
                      </FormControl>
                    </div>

                    <FormDescription className='text-balance text-sm font-normal leading-normal text-[#b5b8bc]'>
                      This image will display at the top of your channels list.
                    </FormDescription>
                    <FormDescription className='text-balance text-sm font-normal leading-normal text-[#b5b8bc]'>
                      The recommended minimum size is 960x540 and recommended
                      aspect ratio is 16:9.
                    </FormDescription>

                    <input
                      onChange={(e) => handleChange(e, 'banner')}
                      type='file'
                      name='file'
                      id='banner'
                      className='hidden'
                    />
                    <FormLabel
                      htmlFor='banner'
                      className='inline-block w-36 cursor-pointer rounded border border-gray-2 p-2 text-center text-white'
                    >
                      Upload image
                    </FormLabel>
                  </FormItem>
                )}
              />
              {banner ? (
                <Image
                  src={banner}
                  width={500}
                  height={500}
                  className='max-h-56 w-full rounded-md object-cover'
                  alt='server boost'
                />
              ) : (
                <div className='relative min-h-52 rounded bg-foreground brightness-125'>
                  <ImagePlus className='absolute right-3 top-3 text-gray-1' />
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          className={cn(
            'sticky -bottom-full left-0 right-0 mt-10 flex w-full items-center justify-between rounded-sm bg-black p-2 transition-all duration-300 ease-in-out',
            isChanged
              ? 'bottom-0 mt-0 opacity-100'
              : '-bottom-full mt-10 opacity-0',
          )}
        >
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
              disabled={!isChanged || !isValid || isSubmitting}
              className='rounded bg-green-700 text-sm hover:bg-green-800'
            >
              {isSubmitting ? status : 'Save changes'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
