import { useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useSWRConfig } from 'swr';
import Image from 'next/image';

import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from '@/components/ui/dialog';
import { searchUser } from '@/helper/user';
import { useDebounce } from '@/hooks/useDebounce';
import { User } from '@/types/user';
import { createError } from '@/utils/error';
import { getCreatedDate } from '@/utils/date';
import { inviteUser } from '@/actions/user';

export default function AddFriends() {
  const { mutate } = useSWRConfig();
  const [query, setQuery] = useState<string>('');
  const { userId } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<User[]>([]);
  const { debouncedValue } = useDebounce(query, 500);

  const handleInviteUser = async (id: string) => {
    try {
      await inviteUser(id, userId!!).then((msg) => {
        toast.success(msg.messages);
        mutate('pending-invitations');
        mutate('invitation-request');
      });
    } catch (error) {
      createError(error);
    }
  };
  useEffect(() => {
    if (debouncedValue === '') return;

    (async () => {
      try {
        setLoading(true);
        const result = await searchUser(debouncedValue, userId!!);
        console.log(result);

        setResult(result);
        setLoading(false);
      } catch (error) {
        createError(error);
      }
    })();

    return () => {
      setResult([]);
    };
  }, [debouncedValue, userId]);

  return (
    <Dialog>
      <DialogTrigger className='text-nowrap rounded bg-green-500 px-2 py-1 text-sm font-semibold text-white'>
        Add Friend
      </DialogTrigger>
      <DialogContent className='border-none'>
        <DialogHeader className='text-2xl font-semibold text-white'>
          Add a friend
        </DialogHeader>
        <input
          onChange={(e) => setQuery(e.target.value)}
          value={query}
          name='query'
          autoComplete='off'
          type='search'
          placeholder='Add user'
          className='w-full rounded-md border-none bg-black/30 p-3 text-white outline-none focus-visible:border-none'
        />

        <div>
          {loading ? (
            <div className='flex flex-col gap-3'>
              {[1, 2, 3].map((l) => (
                <div
                  key={l}
                  className='h-7 w-full rounded bg-foreground brightness-110'
                ></div>
              ))}
            </div>
          ) : (
            <div>
              {result?.map((user) => (
                <div
                  key={user.id}
                  className='flex items-center justify-between gap-2 text-secondary'
                >
                  <div className='flex items-center gap-2'>
                    <Image
                      src={user.image}
                      width={50}
                      height={50}
                      alt='user'
                      className='size-10 rounded-full object-cover'
                    />
                    <div>
                      <h3 className='text-base font-semibold capitalize leading-tight text-gray-2'>
                        {user.username}
                      </h3>
                      <p className='text-[10px] text-gray-2'>
                        Joined {getCreatedDate(new Date(user.created_at))}
                      </p>
                    </div>
                  </div>
                  <DialogClose asChild>
                    <button
                      className='rounded bg-primary px-3 py-1 text-white'
                      onClick={() => handleInviteUser(user.id)}
                    >
                      Invite
                    </button>
                  </DialogClose>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
