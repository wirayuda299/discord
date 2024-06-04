import { Button } from '@/components/ui/button';
import { LockKeyhole } from 'lucide-react';
import Image from 'next/image';

export default function StickerUpload() {
  return (
    <div className='flex h-screen w-full flex-col overflow-y-auto p-6 text-white'>
      <div className='mb-6 rounded-lg bg-gradient-to-r from-blue-600 to-purple-700 p-4'>
        <h2 className='mb-2 text-center text-2xl font-bold'>Get Boosted</h2>
        <p className='mb-4 text-balance text-center text-sm font-light'>
          Enjoy more stickers and other perks by boosting your server to Level
          1. Each Level unlocks more sticker slots and new benefits for
          everyone.
        </p>
        <div className='flex justify-center space-x-4'>
          <Button variant={'ghost'} className='bg-white text-black'>
            Boost Server
          </Button>
          <Button variant={'ghost'} className='bg-white text-black'>
            Learn More
          </Button>
        </div>
      </div>
      <div className='flex-grow'>
        <h2 className='mb-4 text-lg font-semibold'>No Server Boost</h2>
        <p className='mb-4 text-balance text-sm'>
          No one has bestowed Boosts to this server yet. See if any members
          would kindly bless your server for server-wide Boost Perks!
        </p>
        <div className='mb-6'>
          <div className='h-max bg-foreground brightness-110'>
            <div className='flex-center w-full justify-between rounded-md bg-background p-3'>
              <div>
                <h3 className='text-lg font-bold'>Free Slots</h3>
                <p className='text-sm'>5 of 5 slots available</p>
              </div>
              <Button>Upload Sticker</Button>
            </div>
            <div className='mb-4 grid h-full grid-cols-5'>
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className='flex size-36 items-center justify-center rounded-lg border border-gray-1 border-opacity-50 p-4 shadow-lg'
                >
                  <Image
                    width={50}
                    height={50}
                    src='/server/icons/placeholder.svg'
                    alt='Sticker Placeholder'
                    className='h-12 w-12'
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className='mb-6'>
          <div className='h-max bg-foreground brightness-110'>
            <div className='flex-center w-full justify-between rounded-md bg-background p-3'>
              <h3 className='text-lg font-bold'>Level 1</h3>
              <LockKeyhole />
            </div>
            <div className='mb-4 flex flex-col items-center justify-center gap-4 p-5'>
              <div className='flex size-36 items-center justify-center rounded-lg border border-gray-1 border-opacity-50 p-4 shadow-lg'>
                <Image
                  width={50}
                  height={50}
                  src='/server/icons/placeholder.svg'
                  alt='Sticker Placeholder'
                  className='h-12 w-12'
                />
              </div>
              <p className='capitalize text-gray-2'>+10 stickers lots</p>
              <Button className='rounded-none !bg-green-600 text-white'>
                Buy level
              </Button>
            </div>
          </div>
        </div>
        <div className='mb-6'>
          <div className='h-max bg-foreground brightness-110'>
            <div className='flex-center w-full justify-between rounded-md bg-background p-3'>
              <h3 className='text-lg font-bold'>Level 2</h3>
              <LockKeyhole />
            </div>
            <div className='mb-4 flex flex-col items-center justify-center gap-4 p-5'>
              <div className='flex size-36 items-center justify-center rounded-lg border border-gray-1 border-opacity-50 p-4 shadow-lg'>
                <Image
                  width={50}
                  height={50}
                  src='/server/icons/placeholder.svg'
                  alt='Sticker Placeholder'
                  className='h-12 w-12'
                />
              </div>
              <p className='capitalize text-gray-2'>+15 stickers lots</p>
              <Button className='rounded-none !bg-green-600 text-white'>
                Buy level
              </Button>
            </div>
          </div>
        </div>
        <div className='mb-6'>
          <div className='h-max bg-foreground brightness-110'>
            <div className='flex-center w-full justify-between rounded-md bg-background p-3'>
              <h3 className='text-lg font-bold'>Level 3</h3>
              <LockKeyhole />
            </div>
            <div className='mb-4 flex flex-col items-center justify-center gap-4 p-5'>
              <div className='flex size-36 items-center justify-center rounded-lg border border-gray-1 border-opacity-50 p-4 shadow-lg'>
                <Image
                  width={50}
                  height={50}
                  src='/server/icons/placeholder.svg'
                  alt='Sticker Placeholder'
                  className='h-12 w-12'
                />
              </div>
              <p className='capitalize text-gray-2'>+20 stickers lots</p>
              <Button className='rounded-none !bg-green-600 text-white'>
                Buy level
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
