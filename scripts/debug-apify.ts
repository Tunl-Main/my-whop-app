
import { ApifyClient } from 'apify-client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.development.local' });

const client = new ApifyClient({
    token: process.env.APIFY_API_TOKEN,
});

async function testScrape(username: string) {
    console.log(`Testing scrape for ${username} with limit 100...`);

    try {
        // Instagram Scraper
        const run = await client.actor('apify/instagram-scraper').call({
            directUrls: [`https://www.instagram.com/${username}/`],
            resultsLimit: 100,
        });

        const { items } = await client.dataset(run.defaultDatasetId).listItems();
        console.log(`Total items returned: ${items.length}`);

        const profile = items.find((item: any) => item.biography !== undefined || item.followersCount !== undefined);

        if (profile) {
            console.log("✅ Profile object FOUND");
            console.log("Profile postsCount:", profile.postsCount);
            console.log("Profile followersCount:", profile.followersCount);
        } else {
            console.log("❌ Profile object NOT FOUND");
        }

        const posts = items.filter((item: any) => (item.type === 'Post' || item.shortCode) && (profile ? item.id !== profile.id : true));
        console.log(`Count of identified posts: ${posts.length}`);

    } catch (error) {
        console.error("Error:", error);
    }
}

// Test with a known public handle
testScrape('therock');
