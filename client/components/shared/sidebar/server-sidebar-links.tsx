import Link from "next/link";
import Image from "next/image";

export default function ServerSidebarLinksItem({
  label,
  path,
  icons,
}: {
  path: string;
  label: string;
  icons: string;
}) {
  return (
		<li
			key={label}
			className='ease hover:bg-background flex h-10 items-center rounded-md p-2 transition-colors duration-300'
		>
			<Link
				href={path}
				className='ease group flex items-center gap-2 transition-colors duration-300'
			>
				<Image
					className='group-hover:brightness-0 group-hover:invert'
					src={icons}
					width={30}
					height={30}
					loading='lazy'
					alt={label}
				/>
				<h3 className='text-gray-2 font-semibold group-hover:text-white'>
					{label}
				</h3>
			</Link>
		</li>
	);
}
