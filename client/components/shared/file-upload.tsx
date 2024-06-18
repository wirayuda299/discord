import Image from 'next/image';
import { type ChangeEvent, memo } from 'react';
import { Plus, X } from 'lucide-react';

type Props = {
  image: string;
  isSubmitting: boolean;
  deleteImage: () => void;
  preview: Record<string, string> | null;
  handleChange: (
    e: ChangeEvent<HTMLInputElement>,
    field: 'message' | 'image',
  ) => Promise<void>;
};

function FileUpload({
  image,
  isSubmitting,
  deleteImage,
  preview,
  handleChange,
}: Props) {
  return (
    <div className='relative'>
      {(image) && (preview && preview?.image) && (
        <div className='absolute z-50 -top-32 w-max'>
          <>
            <Image
              className='aspect-square rounded-md object-cover'
              src={preview?.image}
              width={100}
              height={100}
              alt='image'
            />
            {!isSubmitting && (
              <button
                aria-label='delete attachment'
                name='delete attachment'
                title='delete attachment'
                type='button'
                onClick={deleteImage}
                className='absolute -right-4 -top-3 min-h-5 min-w-5 rounded-full border bg-white p-1'
              >
                <X className='text-sm text-red-600' size={18} />
              </button>
            )}
          </>

        </div>
      )}
      <label
        onClick={(e) => {
          e.stopPropagation();
        }}
        aria-disabled={isSubmitting}
        title='Upload image'
        htmlFor='image-upload'
        className='flex size-7 min-h-7 min-w-7 cursor-pointer items-center justify-center rounded-full bg-background/50 disabled:cursor-not-allowed md:h-7 md:min-h-7 md:min-w-7 md:bg-gray-2 md:p-1'
      >
        <Plus className='text-base text-gray-2 md:text-lg md:text-foreground' />
      </label>
      <input
        onChange={(e) => {
          handleChange(e, 'image');
        }}
        aria-disabled={isSubmitting}
        disabled={isSubmitting}
        type='file'
        name='file'
        id='image-upload'
        className='hidden disabled:cursor-not-allowed'
      />
    </div>
  );
}

export default memo(FileUpload);
