import { headers } from "next/headers";
import { whopsdk } from "@/lib/whop-sdk";
import Registration from "@/components/Registration";
import Leaderboard from "@/components/Leaderboard";

export default async function ExperiencePage({
	params,
}: {
	params: Promise<{ experienceId: string }>;
}) {
	const { experienceId } = await params;
	// Ensure the user is logged in on whop.
	const { userId } = await whopsdk.verifyUserToken(await headers());

	// Fetch the neccessary data we want from whop.
	const [user] = await Promise.all([
		whopsdk.users.retrieve(userId),
	]);

	const displayName = user.name || user.username || `User ${userId}`;
	const avatar = user.profile_picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`;

	return (
		<div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
			{/* Background Gradient */}
			<div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black pointer-events-none" />

			<div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-5xl mx-auto">
					<div className="text-center mb-16">
						<h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 mb-6 tracking-tight">
							Clipper Leaderboard
						</h1>
						<p className="text-xl text-gray-400 max-w-2xl mx-auto">
							Welcome back, <span className="text-white font-semibold">{displayName}</span>. Compete with other creators and track your performance.
						</p>
					</div>

					<Registration userId={userId} username={displayName} avatar={avatar} />

					<div className="mt-20">
						<Leaderboard />
					</div>
				</div>
			</div>
		</div>
	);
}
