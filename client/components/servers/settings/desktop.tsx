'use client';

import { useMemo, useState } from 'react';
import { Cog, Trash, X } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import { usePathname, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useShallow } from 'zustand/react/shallow';
import Image from 'next/image';

import {
  Dialog,
  DialogTitle,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from '../../ui/dialog';
import { getServerSettings } from '@/constants/servers-settings';
import { Servers } from '@/types/server';
const ServerOverview = dynamic(() => import('./overview/server-overview'));
const Roles = dynamic(() => import('./roles/roles'));
const EmojiUpload = dynamic(() => import('./emoji-upload'));
const StickerUpload = dynamic(() => import('./sticker-upload'));
const ServerBanList = dynamic(() => import('./bans'));

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useServerStates } from '@/providers';
import { deleteServer } from '@/helper/server';

export default function ServerSettingsDesktop({ server }: { server: Servers }) {
  const { selectedSetting, setSelectedSetting } = useServerStates(
    useShallow((state) => ({
      selectedSetting: state.selectedSetting,
      setSelectedSetting: state.setSelectedSetting,
    })),
  )
  const { userId } = useAuth(),
    pathname = usePathname(),
    router = useRouter(),
    [isSubmitting, setIsSubmitting] = useState(false),
    settings = useMemo(() => getServerSettings(server.name), [server.name]);
  return (
    <Dialog>
      <DialogTrigger
        onClick={() => setSelectedSetting('overview')}
        className='flex w-full items-center justify-between rounded px-2 py-2 !text-gray-2 hover:!bg-primary hover:!text-white text-sm'
      >
        <span className='text-sm'>Server settings</span>
        <Cog size={20} />
      </DialogTrigger>
      <DialogContent className='flex max-h-screen min-w-full items-center justify-center border-none p-0'>
        <div className='flex h-full max-h-screen w-full'>
          <aside className='flex h-screen min-w-96 grow flex-col items-end overflow-y-auto bg-[#2b2d31] p-3 max-lg:min-w-72'>
            <ul className='flex flex-col'>
              {settings?.map((setting) => (
                <li key={setting.label}>
                  <ul className='flex flex-col gap-1'>
                    <h4 className='py-2 text-sm font-semibold uppercase text-[#949ba4]'>
                      {setting.label}
                    </h4>

                    {setting.items.map((item) => (
                      <li
                        onClick={() => setSelectedSetting(item)}
                        className={cn(
                          'cursor-pointer rounded-md p-1 text-base capitalize text-[#a9b0bb] hover:bg-foreground hover:text-white hover:brightness-110',
                          selectedSetting === item &&
                          'bg-foreground text-white brightness-110',
                        )}
                        key={item}
                      >
                        {item}
                      </li>
                    ))}
                    <div className='h-px rounded-full bg-foreground brightness-110'></div>
                  </ul>
                </li>
              ))}

              <Dialog>
                <DialogTrigger className='flex-center text-red-600 gap-2 font-medium p-1'>
                  Delete server
                  <Trash size={18} className='text-red-600' />
                </DialogTrigger>
                <DialogContent className='border-none bg-black'>
                  <DialogHeader>
                    <DialogTitle className='text-center block text-white pb-3'>
                      Are you sure to delete this server?
                    </DialogTitle>

                    <DialogDescription className='text-center text-gray-2 text-balance text-xs'>
                      Deleting a server is a permanent action that cannot be undone. This will delete all messages (including files and media), Server settings, roles, members (including roles and permissions) and all channels in this server.
                    </DialogDescription>

                  </DialogHeader>
                  <div className='flex-center'>
                    <DialogClose className='w-full'>
                      Back
                    </DialogClose>
                    <Button
                      disabled={isSubmitting}
                      onClick={() => {
                        setIsSubmitting(true)
                        deleteServer(server.id, userId!!, pathname)
                          .then(() => {
                            setIsSubmitting(false)
                            router.push('/direct-messages')
                          }).catch(() => setIsSubmitting(false))
                      }}
                      className='w-full !bg-red-600 text-white'>
                      {isSubmitting ? 'Deleting server...' : 'Delete'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

            </ul>
          </aside>
          <section className='col-span-3 w-full bg-[#313338]'>
            {selectedSetting === 'overview' && (
              <ServerOverview server={server} />
            )}
            {selectedSetting === 'roles' && (
              <Roles serverAuthor={server.owner_id} serverId={server.id} uiSize='lg' />
            )}
            {selectedSetting === 'emoji' && <EmojiUpload />}
            {selectedSetting === 'stickers' && <StickerUpload />}
            {selectedSetting === 'soundboard' && (
              <div className='flex flex-col gap-5 p-7'>
                <h2 className='text-base font-semibold text-white'>
                  Soundboard
                </h2>
                <p className='text-balance text-sm text-gray-2'>
                  Upload custom sound reactions that anyone in this server can
                  use. ChatFusion Pro members will be able to access these sounds in any
                  server on ChatFusion.
                </p>
                <div className='flex flex-col items-center justify-center py-6'>
                  <Image
                    src='/server/icons/emojis.svg'
                    alt='Emoji Illustration'
                    width={300}
                    height={300}
                  />
                  <div className='mt-5 flex flex-col items-center justify-center gap-3'>
                    <p className='font-semibold'>NO SOUNDS</p>
                    <p>Get started by uploading a sound</p>
                    <Button>Upload sound</Button>
                  </div>
                </div>
              </div>
            )}
            {selectedSetting === 'bans' && (
              <ServerBanList
                serverAuthor={server.owner_id}
                serverId={server.id}
              />
            )}
          </section>

          <section className='min-w-40 bg-[#313338] p-5 max-lg:min-w-28'>
            <DialogClose>
              <div className='flex size-10 flex-col items-center justify-center rounded-full border'>
                <X className='text-base' />
              </div>
              <p className='text-sm font-semibold'>ESC</p>
            </DialogClose>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
