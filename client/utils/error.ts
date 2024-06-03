import { toast } from 'sonner';

export function createError(error: unknown) {
  if (error instanceof Error) {
    toast.error(error.message, { className: 'text-white' });
  } else {
    toast.error('Unknown error occured', { className: 'text-white' });
  }
  console.error(error);
}
