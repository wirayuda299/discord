import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { SquarePen } from "lucide-react";

import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "../../ui/form";
import useUploadFile from "@/hooks/useFileUpload";
import { Button } from "../../ui/button";
import { deleteImage, uploadFile } from "@/helper/file";
import { updateServer } from "@/helper/server";
import { UpdateServerSchemaType, updateServerSchema } from "@/validations";
import { createError } from "@/utils/error";
import { Switch } from "@/components/ui/switch";
import { Servers } from "@/types/server";
import { memo } from "react";

 function ServerOverview({
server
}: {
  server:Servers
}) {
  const { userId } = useAuth();
  const form = useForm<UpdateServerSchemaType>({
    resolver: zodResolver(updateServerSchema),
    defaultValues: {
      logo: server.logo ||'',
      name: server.name,
      showBanner:server.settings.show_banner_background,
      showProgressBar: server.settings.show_progress_bar,
      banner:server.banner,
    },
  });
  const { handleChange, preview, files } = useUploadFile(form);

  const localLogo = form.watch("logo");
  const localBanner = form.watch("banner");
  const isValid = form.formState.isValid;
  const isSubmitting = form.formState.isSubmitting;
  const isEdited = form.formState.isDirty;
  const editedFields = form.formState.dirtyFields;

  async function onSubmit(data: UpdateServerSchemaType) {
    try {
      if (!userId) return;

      const updateServerData = async (
        logo: { url: string; id: string },
        banner: { url: string; id: string },
      ) => {
        await updateServer(
          server.id,
          data.name,
          logo.url!,
          logo.id!,
          banner.url,
          banner.id,
          userId,
          data.showBanner,
          data.showProgressBar,
        );
        toast.success("Server has been updated");
      };

      const handleFileUpload = async (fileKey: string, assetId?: string) => {
        if (files && files[fileKey]) {
          const [, uploadedFile] = await Promise.all([
            assetId ? deleteImage(assetId) : Promise.resolve(),
            uploadFile(files[fileKey]),
          ]);
          return uploadedFile;
        }
      };

      if (editedFields.logo) {
        const logo = await handleFileUpload("logo", server.logo_asset_id);
        await updateServerData(
          {
            url: logo?.url,
            id: logo?.publicId,
          },
          { id: server.banner_asset_id!, url: data?.banner!! },
        );
      } else if (editedFields.banner) {
        const banner = await handleFileUpload("banner", server.banner_asset_id!!);
        await updateServerData(
          { id: server.logo_asset_id, url: data.logo },
          {
            url: banner?.url,
            id: banner?.publicId,
          },
        );
      } else if (editedFields.logo && editedFields.banner) {
        const [logo, banner] = await Promise.all([
          editedFields.logo
            ? handleFileUpload("logo", server.logo_asset_id)
            : Promise.resolve(null),
          editedFields.banner
            ? handleFileUpload("banner", server.banner_asset_id ||'')
            : Promise.resolve(null),
        ]);
        await updateServerData(
          { id: logo?.publicId, url: logo?.url },
          { id: banner?.publicId, url: banner?.url },
        );
      } else {
        await updateServerData(
					{ id: server.logo_asset_id, url: data.logo },
					{ id: server.banner_asset_id!, url: data?.banner!! }
				);
      }
    } catch (error) {
      createError(error);
    }
  }

  return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='relative flex h-full max-h-screen flex-col gap-8'
			>
				<div className='grid grid-cols-2 justify-between gap-5 border-b border-gray-500 pb-5 max-lg:grid-cols-1'>
					<div className='min-w-90 flex w-full max-w-sm gap-5'>
						<input
							onChange={(e) => handleChange(e, 'logo')}
							type='file'
							name='file'
							id='logo'
							className='hidden'
						/>

						<div className='relative w-min'>
							<Label
								htmlFor='logo'
								className='!relative my-2 w-min cursor-pointer '
							>
								{(localLogo || (preview && preview.logo)) && (
									<Image
										className='aspect-auto size-24 min-h-24 min-w-24 rounded-full object-cover'
										src={form.getValues('logo') || preview?.logo || ''}
										width={100}
										priority
										height={100}
										alt='logo'
									/>
								)}
								<div className='absolute right-0 top-0 flex size-7 items-center justify-center rounded-full bg-gray-2'>
									<SquarePen size={16} className='text-gray-1' />
								</div>
							</Label>
						</div>

						<div className='flex flex-col gap-2 '>
							<p className=' text-sm font-light text-gray-2'>
								We recommend an image of at least 512x512 for the server.
							</p>
							<Label
								htmlFor='logo'
								className=' w-max cursor-pointer whitespace-nowrap rounded border border-gray-2 p-3 text-xs font-light'
							>
								Upload image
							</Label>
						</div>
					</div>

					<FormField
						control={form.control}
						name='name'
						render={({ field }) => (
							<FormItem className=''>
								<FormControl className=''>
									<>
										<Label
											htmlFor='server-name'
											className='my-1 block text-sm uppercase text-gray-2'
										>
											Server name
										</Label>
										<Input
											id='server-name'
											autoComplete='off'
											placeholder='server name'
											className='rounded border-none bg-foreground text-white caret-white  outline-none ring-offset-background focus:border-none focus-visible:border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0'
											required
											{...field}
										/>
									</>
								</FormControl>
							</FormItem>
						)}
					/>
				</div>
				<h3 className='text-lg font-semibold '>Display</h3>
				<ul className='flex flex-col gap-5 space-y-5 divide-y divide-gray-500'>
					<FormField
						name='showProgressBar'
						control={form.control}
						render={({ field }) => (
							<FormItem className='flex w-full gap-5'>
								<div className='grid w-full grid-cols-1  justify-between  gap-5 min-[1000px]:grid-cols-2'>
									<div className='flex w-full max-w-[450px] justify-between '>
										<div className='w-full'>
											<FormLabel className='text-base font-medium'>
												Show progress bar
											</FormLabel>
											<FormDescription className='text-sm font-light leading-normal text-[#b5b8bc]'>
												This progress bar will display in your channel list,
												attached to your server name (or server banner if you
												have one set).
											</FormDescription>
										</div>
										<FormControl>
											<Switch
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
									</div>
									<Image
										className='w-full rounded-md object-cover'
										src={'/images/server-boost.png'}
										width={300}
										height={300}
										alt='server boost'
									/>
								</div>
							</FormItem>
						)}
					/>
					<FormField
						name='showBanner'
						control={form.control}
						render={({ field }) => (
							<FormItem className='flex w-full gap-5 pt-5'>
								<div className='grid w-full grid-cols-1  justify-between  gap-5 min-[1000px]:grid-cols-2'>
									<div className='flex w-full max-w-[450px] justify-between '>
										<div className='flex w-full flex-col gap-3'>
											<FormLabel className='text-base font-medium'>
												Show banner background
											</FormLabel>
											<FormDescription className='text-sm font-light leading-normal text-[#b5b8bc]'>
												This image will display at the top of your channels
												list.
											</FormDescription>
											<FormDescription className='text-sm font-light leading-normal text-[#b5b8bc]'>
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

											<Label
												htmlFor='banner'
												className=' w-max cursor-pointer whitespace-nowrap rounded border border-gray-2 p-3 text-xs font-light'
											>
												Upload image
											</Label>
										</div>
										<FormControl>
											<Switch
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
									</div>
									{localBanner || (preview && preview.banner) ? (
										<Image
											className='max-h-52 w-full rounded-md object-cover'
											src={form.getValues('banner') || preview?.banner || ''}
											width={300}
											height={300}
											alt='banner'
										/>
									) : (
										<div className='aspect-video min-h-52 w-[300px] rounded-md bg-[#4e5058] max-[1000px]:w-full'></div>
									)}
								</div>
							</FormItem>
						)}
					/>
				</ul>
				<Button
					type='submit'
					aria-disabled={!isValid || isSubmitting || !isEdited}
					disabled={!isValid || isSubmitting || !isEdited}
					className='ease  w-full transition-all animate-in hover:bg-blue-600 disabled:cursor-not-allowed'
				>
					Update server
				</Button>
			</form>
		</Form>
	);
 }

 export default memo(ServerOverview)
