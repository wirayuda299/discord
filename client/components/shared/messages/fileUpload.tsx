import { Plus, X } from "lucide-react";
import Image from "next/image";
import { ChangeEvent } from "react";

export default function FileUpload({
	image,
	preview,
	isSubmitting,
	handleChange,
	deleteImage,
}: {
	preview: Record<string, string> | null;
	handleChange: (
		e: ChangeEvent<HTMLInputElement>,
		field: 'message' | 'image'
	) => Promise<void>;
	isSubmitting: boolean;
	image: null;
	deleteImage: () => void;
}) {
	return (
		<div className='relative'>
			{image && preview && preview.image && (
				<div className='absolute -top-32 w-max'>
					<Image
						className='aspect-square rounded-md object-cover'
						priority
						fetchPriority='high'
						src={(preview && preview?.image)!}
						width={100}
						height={100}
						alt='image'
					/>
					{!isSubmitting && (
						<button
							type='button'
							onClick={deleteImage}
							className='absolute -right-4 -top-3 min-h-5 min-w-5 rounded-full border bg-white p-1'
						>
							<X className='text-sm text-red-600' size={18} />
						</button>
					)}
				</div>
			)}
			<label
				aria-disabled={isSubmitting}
				title='Upload image'
				htmlFor='image-upload'
				className='flex size-6 min-h-6 min-w-6 cursor-pointer items-center justify-center rounded-full bg-background disabled:cursor-not-allowed md:h-7 md:min-h-7 md:min-w-7 md:bg-gray-2 md:p-1'
			>
				<Plus className='text-base text-gray-2 md:text-lg md:text-foreground' />
			</label>
			<input
				onChange={(e) => handleChange(e, 'image')}
				aria-disabled={isSubmitting}
				disabled={isSubmitting}
				type='file'
				name='file'
				id='image-upload'
				className='hidden disabled:cursor-not-allowed'
			/>
		</div>
	);
};