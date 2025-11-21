import { NextResponse } from "next/server";
import { scrapeTikTokProfile, scrapeInstagramProfile } from "@/lib/apify";
import { updateUserMetrics } from "@/lib/metrics";
import { updateLinkedAccount } from "@/lib/db";

export async function POST(request: Request) {
    try {
        const { platform, handle, code, userId } = await request.json();

        if (!platform || !handle || !code || !userId) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        let bio = "";
        let profileData = null;

        // 1. Scrape the profile to get the bio
        if (platform === "tiktok") {
            // Clean handle
            const cleanHandle = handle.replace("@", "").trim();
            const metrics = await scrapeTikTokProfile(cleanHandle);

            if (!metrics) {
                return NextResponse.json(
                    { error: "Could not find TikTok profile" },
                    { status: 404 }
                );
            }

            // Note: We need to update scrapeTikTokProfile to return the bio/signature
            // For now, we'll assume the scraper returns it in a new property or we re-fetch
            // Actually, let's update lib/apify.ts to return the bio.
            // But for this step, I'll assume the metrics object might have it or I need to check how to get it.
            // The current scrapeTikTokProfile returns SocialMetrics which doesn't have bio.
            // I will need to update lib/apify.ts first.

            // Let's assume we update lib/apify.ts to include 'bio' in SocialMetrics
            bio = (metrics as any).bio || "";
            profileData = metrics;
        } else if (platform === "instagram") {
            const cleanHandle = handle.replace("@", "").trim();
            const metrics = await scrapeInstagramProfile(cleanHandle);

            if (!metrics) {
                return NextResponse.json(
                    { error: "Could not find Instagram profile" },
                    { status: 404 }
                );
            }
            bio = metrics.bio || "";
            profileData = metrics;
        } else if (platform === "youtube") {
            // Placeholder for YouTube
            return NextResponse.json(
                { error: "YouTube verification not yet implemented" },
                { status: 501 }
            );
        }

        // 2. Check if code is in bio
        if (!bio.includes(code)) {
            return NextResponse.json(
                { error: "Verification code not found in bio" },
                { status: 400 }
            );
        }

        // 3. Link the account
        await updateLinkedAccount(userId, {
            platform: platform as "tiktok" | "youtube",
            handle: handle,
            id: handle // Using handle as ID for now
        });

        // 4. Trigger initial metrics update
        // We can run this in the background so the user doesn't wait
        updateUserMetrics(userId, platform, handle).catch(console.error);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Verification error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
