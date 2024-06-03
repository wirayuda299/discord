'use client';

import { useMemo } from 'react';
import { Cog, X } from 'lucide-react';
import dynamic from 'next/dynamic';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from '../../ui/dialog';
import { getServerSettings } from '@/constants/servers-settings';
import { Servers } from '@/types/server';
const ServerOverview = dynamic(() => import('./overview/server-overview'));
const RolesDesktop = dynamic(() => import('./roles/roles-desktop'));
import { cn } from '@/lib/utils';
import { useServerContext, useUpdateServerState } from '@/providers/servers';

export default function ServerSettingsDesktop({ server }: { server: Servers }) {
  const settings = useMemo(() => getServerSettings(server.name), [server.name]);
  const selectedSetting = useServerContext('selectedSetting');
  const updateState = useUpdateServerState();

  return (
    <Dialog>
      <DialogTrigger className='flex w-full items-center justify-between rounded px-2 py-2 !text-gray-2 hover:!bg-primary hover:!text-white'>
        <span className='text-sm'>Server settings</span>
        <Cog size={20} />
      </DialogTrigger>
      <DialogContent className='flex max-h-screen min-w-full items-center justify-center border-none p-0'>
        <div className='flex h-full max-h-screen w-full'>
          <aside className='flex h-screen min-w-96 grow flex-col items-end overflow-y-auto bg-[#2b2d31] p-5 max-lg:min-w-64'>
            <ul className='flex flex-col'>
              {settings?.map((setting) => (
                <li key={setting.label}>
                  <h4 className='border-t border-t-background/30 py-2 text-sm capitalize text-gray-2/65'>
                    {setting.label}
                  </h4>
                  <ul className='flex flex-col gap-1'>
                    {setting.items.map((item) => (
                      <li
                        onClick={() =>
                          updateState({
                            selectedSetting: item,
                          })
                        }
                        className={cn(
                          'cursor-pointer rounded-md p-1 text-sm capitalize text-[#b5b8b8] hover:bg-foreground hover:text-white hover:brightness-110',
                          selectedSetting === item &&
                            'bg-foreground brightness-110',
                        )}
                        key={item}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </aside>
          <section className='col-span-3 w-full bg-[#313338]'>
            {selectedSetting === 'overview' && (
              <ServerOverview server={server} />
            )}
            {selectedSetting === 'roles' && <RolesDesktop />}
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
