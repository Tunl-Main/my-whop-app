import { ApifyClient } from 'apify-client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.development.local' });

const client = new ApifyClient({
    token: process.env.APIFY_API_TOKEN,
});

async function testBio() {
    console.log('Testing Instagram Bio...');
    const igRun = await client.actor('apify/instagram-scraper').call({
        usernames: ['whop'],
        resultsLimit: 1,
    });
    const { items: igItems } = await client.dataset(igRun.defaultDatasetId).listItems();
    const igProfile = igItems.find((item: any) => item.username === 'whop');
    console.log('IG Bio:', igProfile?.biography || 'Not found');

    console.log('\nTesting TikTok Bio...');
    const ttRun = await client.actor('clockworks/tiktok-scraper').call({
        profiles: ['whop'],
        resultsPerPage: 1,
    });
    const { items: ttItems } = await client.dataset(ttRun.defaultDatasetId).listItems();
    const ttProfile = ttItems[0] as any;
    console.log('TikTok Bio:', ttProfile?.authorMeta?.signature || 'Not found');
}

testBio();
