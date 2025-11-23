import { NextResponse } from "next/server";
import { scrapeTikTokProfile, scrapeInstagramProfile } from "@/lib/apify";
import { updateUserMetrics } from "@/lib/metrics";
import { updateLinkedAccount, getUser, createUser } from "@/lib/db";

export async function POST(request: Request) {
    try {
        const { platform, handle, code, userId, username, avatar } = await request.json();

        if (!platform || !handle || !code || !userId) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        let dbUserId = userId;

        // Ensure user exists
        const existingUser = await getUser(userId);
        if (!existingUser) {
            // If creating new, we try to use userId as ID, but if that fails or we want to be safe
            // we should probably just use userId as ID as intended.
            await createUser({
                id: userId,
                whopId: userId,
                avatar: avatar || "",
                metrics: { views: 0, shares: 0, earnings: 0 },
                achievements: [],
                linkedAccounts: []
            });
            dbUserId = userId;
        } else {
            dbUserId = existingUser.id;
        }

        let bio = "";
        let profileData = null;

        // ... (scraping logic) ...

        // 3. Link account in DB
        await updateLinkedAccount(dbUserId, {
            platform: platform as "tiktok" | "youtube",
            handle: handle,
            id: handle // Use handle as ID since we don't scrape platform ID yet
        });

        // 4. Trigger initial metrics update
        updateUserMetrics(dbUserId, platform, handle).catch(console.error);

        // Fetch updated user to return
        const updatedUser = await getUser(userId); // getUser uses whopId, so userId is correct here

        return NextResponse.json({ success: true, user: updatedUser });

    } catch (error) {
        console.error("Verification error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
