import { SmilePlus } from 'lucide-react';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { useRef, useState } from 'react';
import type {
	FieldValues,
	Path,
	PathValue,
	UseFormReturn,
} from 'react-hook-form';

import { useClickOutside } from '@/hooks/useClickOutside';

export default function EmojiPickerButton<T extends FieldValues>({
	form,
}: {
	form: UseFormReturn<T>;
}) {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const ref = useRef<HTMLDivElement>(null);

	useClickOutside(ref, () => setIsOpen(false));

	const handleClick = (emoji: any) => {
		const current = form.getValues('message' as Path<T>);
		form.setValue(
			'message' as Path<T>,
			(current + emoji) as PathValue<T, Path<T>>
		);
	};

	return (
		<div className=' flex flex-col items-center'>
			<button
				type='button'
				onClick={(e) => {
					e.stopPropagation();
					setIsOpen((prev) => !prev);
				}}
			>
				<SmilePlus color='rgb(156 163 175)' />
			</button>
			<div className='absolute bottom-16 right-0' ref={ref}>
				<EmojiPicker
					className='!bg-main-foreground'
					theme={Theme.DARK}
					onEmojiClick={(e) => handleClick(e.emoji)}
					open={isOpen}
					skinTonesDisabled
				/>
			</div>
		</div>
	);
}
