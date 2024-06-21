import Image from 'next/image';

export default function EmojiUpload() {
  return (
    <div className='flex h-screen w-full flex-col overflow-y-auto text-white'>
      <div className='flex-grow p-6'>
        <h1 className='mb-4 text-lg font-semibold'>Emoji</h1>
        <p className='mb-4 text-balance text-sm text-gray-2'>
          Add up to 50 custom emoji that anyone can use in this server. Animated
          GIF emoji may be used by members with ChatFusion Pro.
        </p>
        <div>
          <h2 className='mb-2 text-lg font-semibold'>Upload Requirements</h2>
          <ul className='mb-4 flex list-inside list-disc flex-col gap-3 text-sm text-gray-2'>
            <li>File type: JPEG, PNG, GIF</li>
            <li>
              Recommended file size: 256 KB (We&apos;ll compress it for you)
            </li>
            <li>Recommended dimensions: 128x128</li>
            <li className='text-balance'>
              Naming: Emoji names must be at least 2 characters long and can
              only contain alphanumeric characters and underscores
            </li>
          </ul>
          <button className='rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'>
            Upload Emoji
          </button>
        </div>
      </div>
      <div className='flex items-center justify-center py-6'>
        <Image
          src='/server/icons/emojis.svg'
          alt='Emoji Illustration'
          width={300}
          height={300}
        />
      </div>
    </div>
  );
}
