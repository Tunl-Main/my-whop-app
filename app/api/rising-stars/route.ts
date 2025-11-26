import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const range = searchParams.get('range') || 'week';

        // Calculate days based on range
        let daysAgo = 7;
        if (range === 'month') daysAgo = 30;
        if (range === 'all') daysAgo = 365; // Use 1 year for "all time"

        // Fetch all users with their clips for the time period
        const { data: users, error } = await supabase
            .from('users')
            .select(`
                id,
                whop_id,
                username,
                avatar,
                linked_accounts (handle)
            `);

        if (error) throw error;

        // Calculate date thresholds
        const now = new Date();
        const periodStart = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
        const previousPeriodStart = new Date(periodStart.getTime() - daysAgo * 24 * 60 * 60 * 1000);

        // Fetch clips for current period
        const { data: currentClips } = await supabase
            .from('clips')
            .select('user_id, views, likes')
            .gte('posted_at', periodStart.toISOString());

        // Fetch clips for previous period (for comparison)
        const { data: previousClips } = await supabase
            .from('clips')
            .select('user_id, views, likes')
            .gte('posted_at', previousPeriodStart.toISOString())
            .lt('posted_at', periodStart.toISOString());

        // Aggregate views by user for each period
        const currentViewsByUser = new Map<string, number>();
        const previousViewsByUser = new Map<string, number>();

        currentClips?.forEach((clip: any) => {
            const current = currentViewsByUser.get(clip.user_id) || 0;
            currentViewsByUser.set(clip.user_id, current + (clip.views || 0));
        });

        previousClips?.forEach((clip: any) => {
            const current = previousViewsByUser.get(clip.user_id) || 0;
            previousViewsByUser.set(clip.user_id, current + (clip.views || 0));
        });

        const risingStars = users.map(user => {
            const currentViews = currentViewsByUser.get(user.id) || 0;
            const previousViews = previousViewsByUser.get(user.id) || 0;

            // Calculate growth percentage based on views
            let growthPercent = 0;
            if (previousViews > 0) {
                growthPercent = Math.round(((currentViews - previousViews) / previousViews) * 100);
            } else if (currentViews > 0) {
                growthPercent = 100; // New user with views = 100% growth
            }

            // Only include users with positive growth
            if (growthPercent <= 0) return null;

            // Get username - prefer stored username, then linked account handle
            const handle = user.linked_accounts?.[0]?.handle || '';
            const displayName = user.username || handle.replace(/^@/, '') || user.whop_id;

            return {
                id: user.id,
                username: displayName,
                avatar: user.avatar,
                growthPercent: growthPercent,
                views: currentViews,
                previousViews: previousViews
            };
        })
            .filter(Boolean)
            .sort((a: any, b: any) => b.growthPercent - a.growthPercent)
            .slice(0, 10); // Top 10

        return NextResponse.json(risingStars);
    } catch (error: any) {
        console.error("Rising stars error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
