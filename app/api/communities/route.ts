import { NextResponse } from "next/server";
import { getCommunities, upsertCommunity, getCommunityLeaderboard } from "@/lib/db";

/**
 * GET /api/communities
 * 
 * Query params:
 * - featured: boolean (optional) - Only return featured communities
 * - leaderboard: boolean (optional) - Return full leaderboard with stats
 * 
 * Returns list of communities
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featuredOnly = searchParams.get("featured") === "true";
    const leaderboard = searchParams.get("leaderboard") === "true";

    if (leaderboard) {
      // Return full community leaderboard with aggregated stats
      const communities = await getCommunityLeaderboard();
      return NextResponse.json({ communities });
    }

    // Return basic community list
    const communities = await getCommunities(featuredOnly);
    return NextResponse.json({ communities });
  } catch (error: any) {
    console.error("[api/communities] GET failed:", {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/communities
 * 
 * Body:
 * - id: string (required) - Whop experience ID
 * - name: string (required) - Community name
 * - iconUrl: string | null (optional) - Icon URL
 * 
 * Creates or updates a community record
 * Used for auto-detection when users visit an experience
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, iconUrl } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Community id (experience ID) is required" },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: "Community name is required" },
        { status: 400 }
      );
    }

    const community = await upsertCommunity(id, name, iconUrl || null);

    return NextResponse.json({ community });
  } catch (error: any) {
    console.error("[api/communities] POST failed:", {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

