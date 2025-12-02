import { NextResponse } from "next/server";
import { pledgeToCommunity, getUserPledgedCommunity, getUser, getCommunity } from "@/lib/db";

/**
 * GET /api/pledge
 * 
 * Query params:
 * - whopId: string (required) - User's Whop ID
 * 
 * Returns the user's current pledged community
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const whopId = searchParams.get("whopId");

    if (!whopId) {
      return NextResponse.json(
        { error: "whopId is required" },
        { status: 400 }
      );
    }

    // Get user first to get their internal ID
    const user = await getUser(whopId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get pledged community
    const community = await getUserPledgedCommunity(user.id);

    return NextResponse.json({
      pledgedCommunity: community,
      pledgedAt: user.pledgedAt || null,
    });
  } catch (error: any) {
    console.error("[api/pledge] GET failed:", {
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
 * POST /api/pledge
 * 
 * Body:
 * - whopId: string (required) - User's Whop ID
 * - communityId: string (required) - Community ID to pledge to
 * 
 * Sets the user's pledged community
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { whopId, communityId } = body;

    if (!whopId) {
      return NextResponse.json(
        { error: "whopId is required" },
        { status: 400 }
      );
    }

    if (!communityId) {
      return NextResponse.json(
        { error: "communityId is required" },
        { status: 400 }
      );
    }

    // Get user first to get their internal ID
    const user = await getUser(whopId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Verify community exists
    const community = await getCommunity(communityId);
    if (!community) {
      return NextResponse.json(
        { error: "Community not found" },
        { status: 404 }
      );
    }

    // Pledge to community
    await pledgeToCommunity(user.id, communityId);

    return NextResponse.json({
      success: true,
      pledgedCommunity: community,
      pledgedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[api/pledge] POST failed:", {
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

