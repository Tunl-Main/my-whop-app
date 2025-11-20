import { NextResponse } from "next/server";
import { getUserByOTP, updateLinkedAccount, addMetric } from "@/lib/db";
import crypto from "crypto";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("hub.mode");
    const token = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");

    // Verify the token from environment variable
    if (mode === "subscribe" && token === process.env.META_VERIFY_TOKEN) {
        console.log("WEBHOOK_VERIFIED");
        return new NextResponse(challenge, { status: 200 });
    }

    return new NextResponse("Forbidden", { status: 403 });
}

export async function POST(request: Request) {
    const body = await request.text();
    const signature = request.headers.get("x-hub-signature-256");

    // Verify signature if secret is present
    if (process.env.META_APP_SECRET) {
        const expectedSignature = "sha256=" + crypto
            .createHmac("sha256", process.env.META_APP_SECRET)
            .update(body)
            .digest("hex");

        if (signature !== expectedSignature) {
            console.error("Invalid signature");
            return new NextResponse("Unauthorized", { status: 401 });
        }
    } else {
        console.warn("META_APP_SECRET not set, skipping signature verification");
    }

    try {
        const data = JSON.parse(body);

        // 1. Handle Real Instagram Webhook Payload
        if (data.object === "instagram" && data.entry) {
            for (const entry of data.entry) {
                if (entry.messaging) {
                    for (const event of entry.messaging) {
                        if (event.message && event.message.text) {
                            const otp = event.message.text.trim();
                            const instagramId = event.sender.id;

                            // We don't get the handle directly in the webhook, only the ID.
                            // In a production app, you'd use the ID to fetch the profile.
                            // For now, we'll use the ID as the handle or a placeholder.
                            const instagramHandle = instagramId;

                            await linkAccount(otp, instagramId, instagramHandle);
                        }
                    }
                }
            }
            return NextResponse.json({ success: true });
        }

        // 2. Simulation/Fallback Payload (for testing without real Instagram)
        const { otp, instagramId, instagramHandle } = data;
        if (otp && instagramId && instagramHandle) {
            await linkAccount(otp, instagramId, instagramHandle);
            return NextResponse.json({ success: true });
        }

    } catch (e) {
        console.error("Error processing webhook:", e);
    }

    return NextResponse.json({ received: true });
}

import { updateUserMetrics } from "@/lib/metrics";

async function linkAccount(otp: string, instagramId: string, instagramHandle: string) {
    const user = await getUserByOTP(otp);

    if (user) {
        await updateLinkedAccount(user.id, {
            platform: 'instagram',
            handle: instagramHandle,
            id: instagramId
        });

        console.log(`Linked user ${user.id} to Instagram ID ${instagramId}`);

        // Trigger immediate scrape
        try {
            console.log(`Triggering immediate scrape for ${instagramHandle}...`);
            await updateUserMetrics(user.id, 'instagram', instagramHandle);
            console.log(`Immediate scrape completed for ${instagramHandle}`);
        } catch (error) {
            console.error(`Error during immediate scrape for ${instagramHandle}:`, error);
        }
    } else {
        console.log(`No user found for OTP: ${otp}`);
    }
}
