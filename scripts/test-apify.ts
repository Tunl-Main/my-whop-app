import { scrapeInstagramProfile, scrapeTikTokProfile } from '../lib/apify';
import dotenv from 'dotenv';

// Load env vars (optional if using dotenv-cli, but good for safety)
dotenv.config({ path: '.env.development.local' });

async function test() {
    console.log('Testing Instagram Scraper...');
    const ig = await scrapeInstagramProfile('whop');
    console.log('Instagram Result:', ig ? 'Success' : 'Failed');
    if (ig) {
        console.log(`Followers: ${ig.followers}`);
        console.log(`Recent Posts: ${ig.recentPosts.length}`);
    }

    console.log('\nTesting TikTok Scraper...');
    const tt = await scrapeTikTokProfile('whop');
    console.log('TikTok Result:', tt ? 'Success' : 'Failed');
    if (tt) {
        console.log(`Followers: ${tt.followers}`);
        console.log(`Recent Posts: ${tt.recentPosts.length}`);
    }
}

test();
