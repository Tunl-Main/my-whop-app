import Registration from "@/components/Registration";
import Leaderboard from "@/components/Leaderboard";

export default function Page() {
	return (
		<div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
			{/* Background Gradient */}
			<div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black pointer-events-none" />

			<div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto">
					{/* Header Section */}
					<div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-8">
						{/* Logo Area (Top Left) */}
						<div className="flex-shrink-0 pt-2">
							<h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white uppercase transform -skew-x-6 leading-none">
								Clipper
								<span className="block text-orange-500">Leaderboard</span>
							</h1>
							<p className="text-sm text-gray-400 mt-2 max-w-xs font-medium">
								Compete, track performance, and earn rewards.
							</p>
						</div>

						{/* Profile/Registration Area (Top Right) */}
						<div className="w-full md:w-auto md:min-w-[400px]">
							<Registration />
						</div>
					</div>

					<div className="mt-4">
						<Leaderboard />
					</div>
				</div>
			</div>
		</div>
	);
}
