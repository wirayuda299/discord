
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ArrowLeft, Check, ImagePlus, Plus } from 'lucide-react';
import Image from 'next/image';
import { useSWRConfig } from 'swr';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Role } from '@/helper/roles';
import { cn } from '@/lib/utils';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { colors } from '@/constants/colors';
import useUploadFile from '@/hooks/useFileUpload';
import { Switch } from '@/components/ui/switch';
import { revalidate } from '@/utils/cache';
import { createError } from '@/utils/error';
import { updateRole } from '@/helper/roles';
import { deleteImage, uploadFile } from '@/helper/file';
import { createRole } from '@/actions/roles';

import MemberWithRole from './memberWithRole';

const tabs = ['display', 'permissions', 'manage members'] as const;

type Props = {
  selectedTab: string;
  selectedRole: Role | null;
  selectTab: (tab?: string) => void;
  type: 'create' | 'update' | null;
  serverAuthor: string;
  roles: Role[];
  selectRole: (role: Role | null) => void;
  uiSize: string
  selectType: (type: 'create' | 'update' | null) => void;
  styles?: string
};

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

export default function RolesSettings({
  selectedRole,
  selectTab,
  type,
  selectedTab,
  serverAuthor,
  roles,
  selectRole,
  selectType,
  uiSize,
  styles
}: Props) {
  const { userId } = useAuth();
  const { mutate } = useSWRConfig();
  const params = useParams();
  const windowWidth = window.innerWidth;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      color: selectedRole ? selectedRole.role_color : '#99aab5',
      name: selectedRole ? selectedRole.name : '',
      icon: selectedRole ? selectedRole.icon : '',
      attach_file: selectedRole ? selectedRole?.permissions?.attach_file : false,
      ban_member: selectedRole ? selectedRole?.permissions?.ban_member : false,
      kick_member: selectedRole ? selectedRole?.permissions?.kick_member : false,
      manage_channel: selectedRole
        ? selectedRole?.permissions?.manage_channel
        : false,
      manage_message: selectedRole
        ? selectedRole?.permissions?.manage_message
        : false,
      manage_role: selectedRole ? selectedRole?.permissions?.manage_role : false,
      manage_thread: selectedRole
        ? selectedRole?.permissions?.manage_thread
        : false,
    },
  });

  const icon = form.watch('icon');
  const isEdited = form.formState.isDirty;
  const editedFields = form.formState.dirtyFields;
  const isSubmitting = form.formState.isSubmitting;

  const { handleChange, preview, files } = useUploadFile(form);

  const handleCreateOrUpdateRole = async (data: z.infer<typeof schema>) => {
    let media = null;
    if (!userId || !data.name) return;

    const {
      color,
      name,
      attach_file,
      ban_member,
      icon,
      kick_member,
      manage_channel,
      manage_message,
      manage_role,
      manage_thread,
    } = data;
    try {
      if (type === 'create') {
        if (files && files.icon) {
          media = await uploadFile(files.icon);
        }
        await createRole(
          color,
          name,
          media?.url || '',
          media?.publicId || '',
          params.id as string,
          attach_file,
          ban_member,
          kick_member,
          manage_channel,
          manage_message,
          manage_role,
          manage_thread,
          userId,
          serverAuthor,
        );
        toast.success('Role has been created');
        if (windowWidth < 768) {
          selectType(null);
          selectRole(null);
        }
      }

      if (type === 'update' && selectedRole) {
        if (editedFields.icon && files && files.icon) {
          media = await uploadFile(files.icon);
        }

        if (selectedRole?.icon) {
          await deleteImage(selectedRole.icon_asset_id);
        }

        await updateRole(
          color,
          name,
          media?.url || icon || '',
          media?.publicId || '',
          params.id as string,
          selectedRole?.id,
          attach_file,
          ban_member,
          kick_member,
          manage_channel,
          manage_message,
          manage_role,
          manage_thread,
        );
        mutate('members');
        mutate('permissions');
        toast.success('Role has been updated');
      }
    } catch (error) {
      createError(error);
    } finally {
      mutate('roles');
      revalidate(`/server/${params.id}`);
      revalidate(`/server/${params.id}/${params.channel_id}`);
    }
  };

  return (
    <div className='flex h-full w-full md:py-7'>
      {uiSize === 'lg' && (
        <aside className={cn(' top-0 min-h-screen w-full min-w-48 max-w-48 overflow-y-auto border-r border-background md:block', styles)}>
          <header className='flex-center w-full justify-between'>
            <Button
              onClick={() => {
                selectRole(null);
                selectType(null);
              }}
              className='inline-flex gap-1 !bg-transparent uppercase text-gray-2'
            >
              <ArrowLeft size={20} /> Back
            </Button>
            <Button
              size='icon'
              className='inline-flex gap-3 !bg-transparent uppercase text-gray-2'
            >
              <Plus size={20} />
            </Button>
          </header>

          <ul className={cn('flex w-full flex-col gap-3 pl-9 pr-4', styles)}>
            {roles.map((role) => (
              <li
                onClick={() => selectRole(role)}
                key={role.id}
                className={cn(
                  'flex cursor-pointer items-center gap-2 rounded py-2 text-sm font-medium capitalize text-gray-2 hover:bg-foreground hover:brightness-110',
                  selectedRole?.name === role.name &&
                  'bg-foreground brightness-110',
                )}
              >
                <div
                  className='size-2 rounded-full'
                  style={{ background: role.role_color }}
                ></div>
                {role.name}
              </li>
            ))}
          </ul>
        </aside>
      )}
      <div className='w-full overflow-y-auto px-2 pt-1 md:px-4'>
        <div className='flex-center justify-between'>
          <h4 className='text-lg font-medium uppercase text-gray-2'>
            {type === 'create'
              ? 'Create role'
              : `Edit Role -- ${selectedRole?.name}`}
          </h4>
          <Button
            onClick={() => {
              selectRole(null);
              selectType(null);
            }}
            className='inline-flex gap-1 !bg-transparent uppercase text-gray-2 md:hidden'
          >
            Back
          </Button>
        </div>
        <ul className='flex-center w-full gap-5 border-b border-b-background py-5'>
          {tabs?.map((tab) => (
            <li
              key={tab}
              onClick={() => selectTab(tab)}
              className={cn(
                'ease cursor-pointer text-base font-normal capitalize text-gray-2 transition-colors duration-300 hover:text-primary',
                selectedTab === tab && 'text-primary',
                type === 'create' && tab === 'manage members' && 'hidden',
              )}
            >
              {tab}
            </li>
          ))}
        </ul>
        {selectedTab !== 'manage members' ? (
          <Form {...form}>
            <form
              className='mt-5 space-y-5'
              onSubmit={form.handleSubmit(handleCreateOrUpdateRole)}
            >
              {selectedTab === 'display' && (
                <>
                  <FormField
                    name='name'
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-gray-2'>
                          Role name <span className='text-red-700'>*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='Role name'
                            className='border-none text-gray-2 ring-offset-transparent focus:shadow-none focus-visible:border-none focus-visible:ring-0 focus-visible:ring-transparent'
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className='block h-px w-full bg-background/50'></div>
                  <FormField
                    name='color'
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-gray-2'>
                          Role color <span className='text-red-700'>*</span>
                        </FormLabel>
                        <FormDescription className='text-gray-2'>
                          Members use the color of the highest role they have on
                          their role list.
                        </FormDescription>
                        <FormControl>
                          <div className='flex flex-wrap items-center gap-2'>
                            <div className='flex size-[87px] min-w-[87px] max-w-[87px] items-center justify-center bg-gray-2 text-center text-sm text-foreground'>
                              <div className='text-gray-1'>
                                Default
                                <Check className='mx-auto text-center' />
                              </div>
                            </div>
                            <Input
                              {...field}
                              type='color'
                              className='size-28 min-w-28 cursor-auto !rounded-md border-none bg-transparent ring-offset-transparent focus:shadow-none focus-visible:border-none focus-visible:ring-0 focus-visible:ring-transparent'
                            />
                            <div className='flex max-w-64 flex-wrap gap-3'>
                              {colors.map((color) => (
                                <button
                                  type='button'
                                  title={color}
                                  onClick={() =>
                                    form.setValue('color', color, {
                                      shouldDirty: true,
                                    })
                                  }
                                  key={color}
                                  className={`size-7 rounded-md`}
                                  style={{ backgroundColor: color }}
                                ></button>
                              ))}
                            </div>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className='block h-px w-full bg-background/50'></div>

                  <FormField
                    name='icon'
                    control={form.control}
                    render={() => (
                      <FormItem className='flex flex-col gap-5'>
                        <FormLabel className='text-gray-2'>Role icon</FormLabel>
                        <FormDescription className='text-gray-2'>
                          Upload an image under 256 KB or pick a custom emoji
                          from this server. We recommend at least 64x64 pixels.
                          Members will see the icon for their highest role if
                          they have multiple roles.
                        </FormDescription>
                        <FormControl>
                          <>
                            <div className='flex gap-3'>
                              {icon || (preview && preview.icon) ? (
                                <Image
                                  className='aspect-square size-[100px] rounded-md object-cover'
                                  src={icon}
                                  width={100}
                                  height={100}
                                  alt='icon'
                                />
                              ) : (
                                <div className='flex size-20 items-center justify-center rounded-md bg-background'>
                                  <ImagePlus className='text-gray-2' />
                                </div>
                              )}
                              <FormLabel
                                htmlFor='icon'
                                className='block h-9 w-32 rounded border p-2 text-center text-gray-2'
                              >
                                {icon || (preview && preview.icon)
                                  ? 'Change Image'
                                  : 'Choose Image'}
                              </FormLabel>
                            </div>
                            <Input
                              onChange={(e) => handleChange(e, 'icon')}
                              id='icon'
                              name='file'
                              accept='.jpg,.png,.jpeg'
                              className='hidden'
                              placeholder='Server logo'
                              type='file'
                            />
                          </>
                        </FormControl>
                        <div className='flex w-full gap-3 rounded-md bg-background p-3'>
                          <Image
                            src={'/general/icons/logo.svg'}
                            width={30}
                            height={30}
                            alt='discord'
                          />
                          <div>
                            <div className='flex items-center gap-2'>
                              <h4
                                className='gap-2 text-sm font-medium'
                                style={{
                                  color: form.getValues('color'),
                                }}
                              >
                                Username
                              </h4>
                              {icon && (
                                <Image
                                  src={icon}
                                  width={20}
                                  height={20}
                                  className='size-5 rounded-full object-cover'
                                  alt='role icon'
                                />
                              )}
                              <span className='text-xs font-light text-gray-2'>
                                Today at 12.00 am
                              </span>
                            </div>
                            <p className='text-sm text-gray-2'>This is cool</p>
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                </>
              )}

              {selectedTab === 'permissions' && (
                <div className='flex flex-col gap-9'>
                  <FormField
                    control={form.control}
                    name='manage_channel'
                    render={({ field }) => (
                      <FormItem>
                        <div className='flex justify-between'>
                          <FormLabel className='text-gray-2'>
                            Manage channels
                          </FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </div>
                        <FormDescription className='text-gray-2'>
                          Allows members to create, edit, or delete channels.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='manage_role'
                    render={({ field }) => (
                      <FormItem>
                        <div className='flex justify-between'>
                          <FormLabel className='text-gray-2'>
                            Manage role
                          </FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </div>
                        <FormDescription className='text-gray-2'>
                          Allows members to create, edit, or delete roles.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='ban_member'
                    render={({ field }) => (
                      <FormItem>
                        <div className='flex justify-between'>
                          <FormLabel className='text-gray-2'>
                            Ban member
                          </FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </div>
                        <FormDescription className='text-gray-2'>
                          Allows members to permanently ban member.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='kick_member'
                    render={({ field }) => (
                      <FormItem>
                        <div className='flex justify-between'>
                          <FormLabel className='text-gray-2'>
                            Kick member
                          </FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </div>
                        <FormDescription className='text-gray-2'>
                          Allows members to kick member.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='attach_file'
                    render={({ field }) => (
                      <FormItem>
                        <div className='flex justify-between'>
                          <FormLabel className='text-gray-2'>
                            Attach file
                          </FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </div>
                        <FormDescription className='text-gray-2'>
                          Allows members to attach file.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='manage_thread'
                    render={({ field }) => (
                      <FormItem>
                        <div className='flex justify-between'>
                          <FormLabel className='text-gray-2'>
                            Manage thread
                          </FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </div>
                        <FormDescription className='text-gray-2'>
                          Allows members to create, edit, or delete threads.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='manage_message'
                    render={({ field }) => (
                      <FormItem>
                        <div className='flex justify-between'>
                          <FormLabel className='text-gray-2'>
                            Manage messages
                          </FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </div>
                        <FormDescription className='text-gray-2'>
                          Allows members to create, edit, or delete messages.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
              )}
              <div
                className={cn(
                  'sticky -bottom-full left-0 right-0 mt-10 flex w-full items-center justify-between rounded-sm bg-black p-2 transition-all duration-300 ease-in-out',
                  isEdited
                    ? 'bottom-10 mt-0 opacity-100 md:bottom-0'
                    : '-bottom-full mt-10 opacity-0',
                )}
              >
                <p className='text-sm font-medium text-gray-2'>
                  Careful - <span>you have unsave changes!</span>
                </p>
                <div className='flex-center gap-4'>
                  <Button
                    disabled={!isEdited}
                    type='button'
                    className='!bg-transparent'
                  >
                    Reset
                  </Button>
                  <Button
                    type='submit'
                    disabled={!isEdited || isSubmitting}
                    className='rounded bg-green-700 text-sm hover:bg-green-800'
                  >
                    Save changes
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        ) : (
          <MemberWithRole
            selectedRole={selectedRole}
            serverId={params.id as string}
          />
        )}
      </div>
    </div>
  );
}
