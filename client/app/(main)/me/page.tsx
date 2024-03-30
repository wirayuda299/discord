import SelectedChannelMobile from './_components/Selected-channel-mobile';
import UserManagement from './_components/userManagement';

type Props = {
	searchParams: {
		status: string;
		type: string;
	};
};

export default function Page({ searchParams }: Props) {
	const selectedStatus = searchParams.status ?? 'online';

	return (
		<>
			<UserManagement selectedStatus={selectedStatus} />
			<SelectedChannelMobile />
		</>
	);
}
