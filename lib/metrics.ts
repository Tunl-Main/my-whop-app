import { supabase } from './supabase';
import { scrapeInstagramProfile, scrapeTikTokProfile } from './apify';

export async function updateUserMetrics(userId: string, platform: string, handle: string, limit: number = 12) {
    let metrics = null;

    if (platform === 'instagram') {
        metrics = await scrapeInstagramProfile(handle, limit);
    } else if (platform === 'tiktok') {
        metrics = await scrapeTikTokProfile(handle, limit);
    }

    if (!metrics) return null;

    // Calculate total views from recent posts (as a proxy for recent activity)
    const recentViews = metrics.recentPosts.reduce((acc, post) => acc + post.views, 0);
    const recentLikes = metrics.recentPosts.reduce((acc, post) => acc + post.likes, 0);
    const postCount = metrics.recentPosts.length;

    const avgViews = postCount > 0 ? Math.round(recentViews / postCount) : 0;
    const avgLikes = postCount > 0 ? Math.round(recentLikes / postCount) : 0;

    // 1. Update Metrics Table
    const { data: existingMetrics } = await supabase
        .from('metrics')
        .select('*')
        .eq('user_id', userId)
        .single();

    const { error: metricsError } = await supabase
        .from('metrics')
        .upsert({
            user_id: userId,
            views: recentViews,
            likes: recentLikes,
            shares: existingMetrics?.shares || 0,
            earnings: existingMetrics?.earnings || 0,
            avg_views: avgViews,
            avg_likes: avgLikes,
            total_posts: metrics.postsCount || metrics.recentPosts.length, // Fallback to fetched count
            updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

    if (metricsError) console.error(`Error updating metrics for ${userId}:`, metricsError);

    // 2. Insert Metric Snapshot (for Rising Stars)
    if (metrics.followers !== undefined) {
        const { error: snapshotError } = await supabase
            .from('metric_snapshots')
            .insert({
                user_id: userId,
                views: recentViews,
                followers: metrics.followers,
                timestamp: new Date().toISOString()
            });

        if (snapshotError) console.error(`Error inserting snapshot for ${userId}:`, snapshotError);
    }

    // 3. Upsert Clips
    for (const post of metrics.recentPosts) {
        const { error: clipError } = await supabase
            .from('clips')
            .upsert({
                user_id: userId,
                platform: platform,
                url: post.url,
                thumbnail: post.thumbnail,
                views: post.views,
                likes: post.likes,
                posted_at: post.postedAt
            }, { onConflict: 'user_id, url' });

        if (clipError) console.error(`Error upserting clip ${post.url}:`, clipError);
    }

    return {
        followers: metrics.followers,
        recentViews,
        avgViews,
        avgLikes,
        totalPosts: metrics.postsCount
    };
}
