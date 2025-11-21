import { ApifyClient } from 'apify-client';

const client = new ApifyClient({
    token: process.env.APIFY_API_TOKEN,
});

// Actor IDs
const INSTAGRAM_SCRAPER_ID = 'apify/instagram-scraper';
const TIKTOK_SCRAPER_ID = 'clockworks/tiktok-scraper';

export interface SocialMetrics {
    followers: number;
    following: number;
    postsCount: number;
    bio?: string;
    recentPosts: {
        url: string;
        thumbnail: string;
        views: number;
        likes: number;
        comments: number;
        postedAt: string;
    }[];
}

export async function scrapeInstagramProfile(username: string): Promise<SocialMetrics | null> {
    try {
        const run = await client.actor(INSTAGRAM_SCRAPER_ID).call({
            directUrls: [`https://www.instagram.com/${username}/`],
            resultsLimit: 12, // Get a few posts + profile
        });

        const { items } = await client.dataset(run.defaultDatasetId).listItems();
        if (!items || items.length === 0) return null;

        // Find profile info (must have biography or followersCount)
        const profile = items.find((item: any) => item.biography !== undefined || item.followersCount !== undefined);

        if (!profile) return null;

        const posts = items.filter((item: any) => (item.type === 'Post' || item.shortCode) && item.id !== profile.id).map((post: any) => ({
            url: `https://www.instagram.com/p/${post.shortCode || post.code}/`,
            thumbnail: post.displayUrl || post.thumbnailSrc,
            views: post.videoViewCount || 0,
            likes: post.likesCount || 0,
            comments: post.commentsCount || 0,
            postedAt: post.timestamp || new Date().toISOString(),
        }));

        return {
            followers: Number(profile.followersCount) || 0,
            following: Number(profile.followsCount) || 0,
            postsCount: Number(profile.postsCount) || 0,
            bio: String(profile.biography || ""),
            recentPosts: posts.slice(0, 10),
        };
    } catch (error) {
        console.error(`Error scraping Instagram for ${username}:`, error);
        return null;
    }
}

export async function scrapeTikTokProfile(username: string): Promise<SocialMetrics | null> {
    try {
        const run = await client.actor(TIKTOK_SCRAPER_ID).call({
            profiles: [username],
            resultsPerPage: 10,
        });

        const { items } = await client.dataset(run.defaultDatasetId).listItems();
        if (!items || items.length === 0) return null;

        // TikTok scraper usually returns one item per video, with author stats included in each
        const firstItem = items[0] as any;
        const authorMeta = firstItem.authorMeta;

        const posts = items.map((video: any) => ({
            url: video.webVideoUrl,
            thumbnail: video.videoMeta?.coverUrl,
            views: video.playCount || 0,
            likes: video.diggCount || 0,
            comments: video.commentCount || 0,
            postedAt: video.createTimeISO || new Date().toISOString(),
        }));

        return {
            followers: authorMeta?.fans || 0,
            following: authorMeta?.following || 0,
            postsCount: authorMeta?.video || 0,
            bio: authorMeta?.signature || "",
            recentPosts: posts.slice(0, 10),
        };
    } catch (error) {
        console.error(`Error scraping TikTok for ${username}:`, error);
        return null;
    }
}
