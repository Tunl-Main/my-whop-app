"use client";

import { useState, useEffect, useRef } from "react";
import Registration from "@/components/Registration";
import Leaderboard from "@/components/Leaderboard";

interface ExperiencePageClientProps {
	userId: string;
	username: string;
	avatar: string;
}

export default function ExperiencePageClient({ userId, username, avatar }: ExperiencePageClientProps) {
	const [isUserConnected, setIsUserConnected] = useState(false);
	const registrationRef = useRef<{ triggerConnect: () => void } | null>(null);

	// Check if user has connected accounts
	useEffect(() => {
		if (userId) {
			fetch(`/api/user?whopId=${userId}`)
				.then(res => res.json())
				.then(data => {
					// User is "connected" if they have at least one linked account
					const hasLinkedAccounts = data.linkedAccounts && data.linkedAccounts.length > 0;
					setIsUserConnected(hasLinkedAccounts);
				})
				.catch(() => {
					setIsUserConnected(false);
				});
		}
	}, [userId]);

	const handleConnectClick = () => {
		// Scroll to registration section and trigger connect modal
		const registrationElement = document.getElementById('registration-section');
		if (registrationElement) {
			registrationElement.scrollIntoView({ behavior: 'smooth' });
		}
		// Trigger the registration connect flow
		if (registrationRef.current?.triggerConnect) {
			registrationRef.current.triggerConnect();
		}
	};

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
						<div className="flex items-center gap-3 sm:gap-6">
							{/* Logo Image */}
							<div className="relative flex-shrink-0">
								<div className="absolute -inset-2 bg-orange-500/20 rounded-2xl blur-xl" />
								<img 
									src="/crown-logo.png" 
									alt="Clipper Leaderboard" 
									className="relative w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 object-contain drop-shadow-[0_0_20px_rgba(249,115,22,0.4)]"
								/>
							</div>
							<div>
								<h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 4.5rem)' }} className="font-black italic tracking-tighter text-white uppercase transform -skew-x-6 leading-[0.85]">
									Clipper
									<span className="block text-orange-500">Leaderboard</span>
								</h1>
								<p className="text-xs sm:text-sm text-gray-400 mt-2 sm:mt-3 ml-1 font-semibold italic hidden sm:block">
									The #1 Clipping Leaderboard on the Internet
								</p>
							</div>
						</div>

						{/* Profile/Registration Area (Top Right) */}
						<div id="registration-section" className="w-full md:w-auto md:min-w-[380px]">
							<Registration 
								userId={userId} 
								username={username} 
								avatar={avatar}
								onConnectionChange={(connected) => setIsUserConnected(connected)}
							/>
						</div>
					</div>

					<div className="mt-4">
						<Leaderboard 
							isUserConnected={isUserConnected} 
							onConnectClick={handleConnectClick}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

