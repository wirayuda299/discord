import { Button } from '../ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '../ui/drawer';

export default function CreateCategoryMobile() {
	return (
		<Drawer>
			<DrawerTrigger className='block w-full py-3 text-left text-sm font-semibold capitalize'>
				create category
			</DrawerTrigger>

			<DrawerContent className='border-none bg-black p-3'>
				<form className='mt-5'>
					<h3 className='py-3 text-base font-semibold text-white'>
						Create category
					</h3>
					<input
						className='bg-background/20 flex min-h-[30px] w-full items-center rounded-md border-none p-3 text-sm font-light text-white caret-white brightness-110 focus:outline-none md:bg-transparent'
						type='text'
						placeholder='create category'
					/>
					<Button className='mt-5 w-full py-1'>Create</Button>
				</form>
			</DrawerContent>
		</Drawer>
	);
}
