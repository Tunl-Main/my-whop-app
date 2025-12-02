import { headers } from "next/headers";
import { whopsdk } from "@/lib/whop-sdk";
import { getExperienceDetails } from "@/lib/whop-experience";
import ExperiencePageClient from "./ExperiencePageClient";

// Force dynamic rendering - no caching at build time or CDN edge
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ExperiencePage({
	params,
}: {
	params: Promise<{ experienceId: string }>;
}) {
	const { experienceId } = await params;
	// Ensure the user is logged in on whop.
	const { userId } = await whopsdk.verifyUserToken(await headers());

	// Fetch the necessary data we want from whop.
	const [user, experienceDetails] = await Promise.all([
		whopsdk.users.retrieve(userId),
		getExperienceDetails(experienceId).catch((err) => {
			console.error("[ExperiencePage] Failed to fetch experience details:", err);
			return { id: experienceId, name: "Clipper Leaderboard", iconUrl: null, companyId: null };
		}),
	]);

	const displayName = user.name || user.username || `User ${userId}`;
	const avatar = typeof user.profile_picture === 'string' ? user.profile_picture : user.profile_picture?.url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`;

	return (
		<ExperiencePageClient 
			userId={userId} 
			username={displayName} 
			avatar={avatar}
			experienceId={experienceId}
			experienceName={experienceDetails.name}
			experienceIcon={experienceDetails.iconUrl}
		/>
	);
}
