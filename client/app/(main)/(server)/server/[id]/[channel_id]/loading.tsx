import PulseLoader from "@/components/shared/pulse-loader";

export default function Loader() {
	return (
		<div className="fixed min-h-dvh z-50 w-full max-h-dvh md:static md:min-h-screen md:max-h-screen">
			<PulseLoader />
		</div>
	)
}
