import { NextResponse } from "next/server";
import { getUser } from "@/lib/db";
import { supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const whopId = searchParams.get("whopId");

    if (!whopId) {
        return NextResponse.json({ error: "Missing whopId" }, { status: 400 });
    }

    const user = await getUser(whopId);

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Aggregate views/likes from clips across all platforms
    const { data: clips } = await supabase
        .from('clips')
        .select('views, likes')
        .eq('user_id', user.id);

    if (clips && clips.length > 0) {
        const totalViews = clips.reduce((sum, clip) => sum + (clip.views || 0), 0);
        const totalLikes = clips.reduce((sum, clip) => sum + (clip.likes || 0), 0);
        const viralClips = clips.filter(clip => (clip.views || 0) >= 100000).length;
        
        // Update metrics with aggregated clip data
        user.metrics.views = totalViews;
        user.metrics.likes = totalLikes;
        user.metrics.viral_clips = viralClips;
        user.metrics.total_posts = clips.length;
        
        // Calculate averages
        user.metrics.avg_views = Math.round(totalViews / clips.length);
        user.metrics.avg_likes = Math.round(totalLikes / clips.length);
    }

    return NextResponse.json(user);
}
