import Registration from "@/components/Registration";
import Leaderboard from "@/components/Leaderboard";

// Force dynamic rendering - no caching at build time or CDN edge
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Page() {
	return (
		<div className="min-h-screen bg-black text-white selection:bg-orange-500/30">
			{/* Background Effects */}
			<div className="fixed inset-0 pointer-events-none">
				{/* Main gradient */}
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900/20 via-black to-black" />
				{/* Blue accent from left */}
				<div className="absolute left-0 top-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
				{/* Subtle grid pattern */}
				<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
			</div>

			<div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto">
					{/* Header Section */}
					<div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-8">
						{/* Logo Area (Top Left) */}
						<div className="flex items-center gap-6">
							{/* Logo Image */}
							<div className="relative flex-shrink-0">
								<div className="absolute -inset-2 bg-orange-500/20 rounded-2xl blur-xl" />
								<img 
									src="/crown-logo.png" 
									alt="Clipper Leaderboard" 
									className="relative w-24 h-24 md:w-28 md:h-28 object-contain drop-shadow-[0_0_20px_rgba(249,115,22,0.4)]"
								/>
							</div>
							<div>
								<h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white uppercase transform -skew-x-6 leading-[0.85]">
									Clipper
									<span className="block text-orange-500">Leaderboard</span>
								</h1>
								<p className="text-sm text-gray-400 mt-3 max-w-sm font-medium">
									Compete, track performance, and earn rewards.
								</p>
							</div>
						</div>

						{/* Profile/Registration Area (Top Right) */}
						<div className="w-full md:w-auto md:min-w-[380px]">
							<Registration />
						</div>
					</div>

					<div className="mt-4">
						<Leaderboard />
					</div>
				</div>
			</div>

			{/* Floating sparkle decoration */}
			<div className="fixed bottom-8 right-8 pointer-events-none">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-600 opacity-50">
					<path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill="currentColor" />
				</svg>
			</div>
		</div>
	);
}
