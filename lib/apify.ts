import { ApifyClient } from 'apify-client';

const client = new ApifyClient({
    token: process.env.APIFY_API_TOKEN,
});

// Actor IDs
const INSTAGRAM_SCRAPER_ID = 'apify/instagram-scraper';
const TIKTOK_SCRAPER_ID = 'clockworks/tiktok-scraper';

export interface SocialMetrics {
    followers?: number;
    following?: number;
    postsCount?: number;
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

export async function scrapeInstagramProfile(username: string, limit: number = 12): Promise<SocialMetrics | null> {
    const cleanUsername = username.replace(/^@/, '');
    try {
        // 1. Scrape Posts
        console.log(`Scraping posts for ${cleanUsername} with limit ${limit}...`);
        const run = await client.actor(INSTAGRAM_SCRAPER_ID).call({
            directUrls: [`https://www.instagram.com/${cleanUsername}/`],
            resultsLimit: limit,
            resultsType: 'posts', // Explicitly request posts
        });

        const { items } = await client.dataset(run.defaultDatasetId).listItems();
        console.log(`Apify returned ${items?.length} items for ${username}`);

        if (!items || items.length === 0) {
            console.log("No items returned from posts scrape.");
            return null;
        }

        // 2. Try to find profile info in the posts scrape
        let profile = items.find((item: any) => item.biography !== undefined || item.followersCount !== undefined);

        // 3. If profile missing, do a dedicated profile scrape
        if (!profile) {
            console.log("Profile info not found in posts scrape. Fetching details separately...");
            try {
                const profileRun = await client.actor(INSTAGRAM_SCRAPER_ID).call({
                    directUrls: [`https://www.instagram.com/${cleanUsername}/`],
                    resultsLimit: 1,
                    resultsType: 'details', // Explicitly request details
                });
                const { items: profileItems } = await client.dataset(profileRun.defaultDatasetId).listItems();
                profile = profileItems?.find((item: any) => item.biography !== undefined || item.followersCount !== undefined);

                if (profile) console.log("✅ Fetched profile details successfully.");
                else console.log("❌ Failed to fetch profile details in fallback.");
            } catch (err) {
                console.error("Error fetching profile details fallback:", err);
            }
        }

        const posts = items.filter((item: any) => (item.type === 'Post' || item.shortCode) && (profile ? item.id !== profile.id : true)).map((post: any) => ({
            url: `https://www.instagram.com/p/${post.shortCode || post.code}/`,
            thumbnail: post.displayUrl || post.thumbnailSrc,
            views: post.videoViewCount || 0,
            likes: post.likesCount || 0,
            comments: post.commentsCount || 0,
            postedAt: post.timestamp || new Date().toISOString(),
        }));
        console.log(`Filtered ${posts.length} posts`);

        return {
            followers: profile ? (Number(profile.followersCount) || 0) : undefined,
            following: profile ? (Number(profile.followsCount) || 0) : undefined,
            postsCount: profile ? (Number(profile.postsCount) || 0) : undefined,
            bio: profile ? String(profile.biography || "") : undefined,
            recentPosts: posts, // Return all fetched posts
        };
    } catch (error) {
        console.error(`Error scraping Instagram for ${username}:`, error);
        return null;
    }
}

export async function scrapeTikTokProfile(username: string, limit: number = 10): Promise<SocialMetrics | null> {
    try {
        const run = await client.actor(TIKTOK_SCRAPER_ID).call({
            profiles: [username],
            resultsPerPage: limit,
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
            recentPosts: posts,
        };
    } catch (error) {
        console.error(`Error scraping TikTok for ${username}:`, error);
        return null;
    }
}
