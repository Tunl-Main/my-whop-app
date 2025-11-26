import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { randomUUID } from 'crypto';

// Load env files
dotenv.config({ path: resolve(process.cwd(), '.env.development.local') });
dotenv.config({ path: resolve(process.cwd(), '.env.development') });
dotenv.config({ path: resolve(process.cwd(), '.env.local') });
dotenv.config({ path: resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing environment variables:');
    console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
    console.error('SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? '✓' : '✗');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Fake celebrity users with their social handles
// Using reliable avatar sources (ui-avatars.com generates text avatars, or use Wikimedia Commons)
const fakeUsers = [
    {
        id: 'fake_elon_musk',
        whopId: 'user_elonmusk',
        username: 'Elon Musk',
        avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/220px-Elon_Musk_Royal_Society_%28crop2%29.jpg',
        platforms: [
            { platform: 'twitter', handle: 'elonmusk' },
            { platform: 'instagram', handle: 'elonmusk' },
        ],
        clips: [
            { platform: 'twitter', views: 45000000, likes: 2500000, daysAgo: 1 },
            { platform: 'twitter', views: 32000000, likes: 1800000, daysAgo: 3 },
            { platform: 'instagram', views: 28000000, likes: 1500000, daysAgo: 2 },
            { platform: 'instagram', views: 18000000, likes: 950000, daysAgo: 5 },
            // Previous period clips (for Rising Stars comparison)
            { platform: 'twitter', views: 25000000, likes: 1200000, daysAgo: 10 },
            { platform: 'instagram', views: 15000000, likes: 750000, daysAgo: 12 },
        ],
        earnings: 125000,
    },
    {
        id: 'fake_sam_altman',
        whopId: 'user_samaltman',
        username: 'Sam Altman',
        avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Sam_Altman_2024.jpg/220px-Sam_Altman_2024.jpg',
        platforms: [
            { platform: 'twitter', handle: 'sama' },
            { platform: 'youtube', handle: 'samaltman' },
        ],
        clips: [
            { platform: 'twitter', views: 12000000, likes: 650000, daysAgo: 1 },
            { platform: 'twitter', views: 8500000, likes: 420000, daysAgo: 4 },
            { platform: 'youtube', views: 5200000, likes: 280000, daysAgo: 2 },
            { platform: 'youtube', views: 3800000, likes: 195000, daysAgo: 6 },
            // Previous period clips
            { platform: 'twitter', views: 6000000, likes: 300000, daysAgo: 10 },
            { platform: 'youtube', views: 4000000, likes: 200000, daysAgo: 14 },
        ],
        earnings: 85000,
    },
    {
        id: 'fake_jensen_huang',
        whopId: 'user_jensenhuang',
        username: 'Jensen Huang',
        avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Jensen_Huang_at_The_Artificial_Intelligence_Forum_of_the_World_Economic_Forum_2024_%28cropped%29.jpg/220px-Jensen_Huang_at_The_Artificial_Intelligence_Forum_of_the_World_Economic_Forum_2024_%28cropped%29.jpg',
        platforms: [
            { platform: 'youtube', handle: 'nvidia' },
            { platform: 'tiktok', handle: 'nvidiaai' },
        ],
        clips: [
            { platform: 'youtube', views: 18500000, likes: 920000, daysAgo: 2 },
            { platform: 'youtube', views: 14200000, likes: 710000, daysAgo: 5 },
            { platform: 'tiktok', views: 9800000, likes: 580000, daysAgo: 1 },
            { platform: 'tiktok', views: 7200000, likes: 390000, daysAgo: 3 },
            // Previous period clips
            { platform: 'youtube', views: 8000000, likes: 400000, daysAgo: 12 },
            { platform: 'tiktok', views: 5000000, likes: 250000, daysAgo: 15 },
        ],
        earnings: 95000,
    },
    {
        id: 'fake_mark_zuckerberg',
        whopId: 'user_zuck',
        username: 'Mark Zuckerberg',
        avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg/220px-Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg',
        platforms: [
            { platform: 'instagram', handle: 'zuck' },
            { platform: 'tiktok', handle: 'zuck' },
        ],
        clips: [
            { platform: 'instagram', views: 22000000, likes: 1200000, daysAgo: 1 },
            { platform: 'instagram', views: 16500000, likes: 890000, daysAgo: 4 },
            { platform: 'tiktok', views: 31000000, likes: 2100000, daysAgo: 2 },
            { platform: 'tiktok', views: 19000000, likes: 1350000, daysAgo: 6 },
            // Previous period clips
            { platform: 'instagram', views: 12000000, likes: 600000, daysAgo: 10 },
            { platform: 'tiktok', views: 18000000, likes: 900000, daysAgo: 14 },
        ],
        earnings: 110000,
    },
    {
        id: 'fake_sundar_pichai',
        whopId: 'user_sundarpichai',
        username: 'Sundar Pichai',
        avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Sundar_Pichai_%282023%29_%28cropped%29.jpg/220px-Sundar_Pichai_%282023%29_%28cropped%29.jpg',
        platforms: [
            { platform: 'twitter', handle: 'sundarpichai' },
            { platform: 'youtube', handle: 'google' },
        ],
        clips: [
            { platform: 'twitter', views: 6800000, likes: 340000, daysAgo: 2 },
            { platform: 'twitter', views: 4200000, likes: 215000, daysAgo: 5 },
            { platform: 'youtube', views: 9500000, likes: 485000, daysAgo: 1 },
            { platform: 'youtube', views: 7100000, likes: 360000, daysAgo: 4 },
            // Previous period clips
            { platform: 'twitter', views: 3500000, likes: 175000, daysAgo: 11 },
            { platform: 'youtube', views: 5000000, likes: 250000, daysAgo: 13 },
        ],
        earnings: 72000,
    },
    {
        id: 'fake_satya_nadella',
        whopId: 'user_satyanadella',
        username: 'Satya Nadella',
        avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/MS-Exec-Nadella-Satya-2017-08-31-22_%28cropped%29.jpg/220px-MS-Exec-Nadella-Satya-2017-08-31-22_%28cropped%29.jpg',
        platforms: [
            { platform: 'twitter', handle: 'sataborella' },
            { platform: 'instagram', handle: 'satyanadella' },
        ],
        clips: [
            { platform: 'twitter', views: 5200000, likes: 265000, daysAgo: 1 },
            { platform: 'twitter', views: 3800000, likes: 195000, daysAgo: 3 },
            { platform: 'instagram', views: 4100000, likes: 210000, daysAgo: 2 },
            { platform: 'instagram', views: 2900000, likes: 148000, daysAgo: 5 },
            // Previous period clips
            { platform: 'twitter', views: 2800000, likes: 140000, daysAgo: 12 },
            { platform: 'instagram', views: 2000000, likes: 100000, daysAgo: 15 },
        ],
        earnings: 58000,
    },
    {
        id: 'fake_mr_beast',
        whopId: 'user_mrbeast',
        username: 'MrBeast',
        avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/MrBeast_2023_%28cropped%29.jpg/220px-MrBeast_2023_%28cropped%29.jpg',
        platforms: [
            { platform: 'youtube', handle: 'MrBeast' },
            { platform: 'tiktok', handle: 'mrbeast' },
            { platform: 'instagram', handle: 'mrbeast' },
        ],
        clips: [
            { platform: 'youtube', views: 85000000, likes: 4500000, daysAgo: 1 },
            { platform: 'youtube', views: 62000000, likes: 3200000, daysAgo: 3 },
            { platform: 'tiktok', views: 48000000, likes: 2800000, daysAgo: 2 },
            { platform: 'tiktok', views: 35000000, likes: 2100000, daysAgo: 4 },
            { platform: 'instagram', views: 25000000, likes: 1600000, daysAgo: 1 },
            // Previous period clips - MrBeast is INSANELY growing
            { platform: 'youtube', views: 40000000, likes: 2000000, daysAgo: 10 },
            { platform: 'tiktok', views: 20000000, likes: 1000000, daysAgo: 12 },
            { platform: 'instagram', views: 10000000, likes: 500000, daysAgo: 14 },
        ],
        earnings: 350000,
    },
    {
        id: 'fake_lex_fridman',
        whopId: 'user_lexfridman',
        username: 'Lex Fridman',
        avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Lex_Fridman_Teaching%2C_Fall_2018.png/220px-Lex_Fridman_Teaching%2C_Fall_2018.png',
        platforms: [
            { platform: 'youtube', handle: 'lexfridman' },
            { platform: 'twitter', handle: 'lexfridman' },
        ],
        clips: [
            { platform: 'youtube', views: 8200000, likes: 420000, daysAgo: 2 },
            { platform: 'youtube', views: 6500000, likes: 335000, daysAgo: 5 },
            { platform: 'twitter', views: 3100000, likes: 158000, daysAgo: 1 },
            { platform: 'twitter', views: 2400000, likes: 122000, daysAgo: 4 },
            // Previous period clips
            { platform: 'youtube', views: 4500000, likes: 230000, daysAgo: 11 },
            { platform: 'twitter', views: 1800000, likes: 90000, daysAgo: 14 },
        ],
        earnings: 65000,
    },
];

async function seedDatabase() {
    console.log('🌱 Starting database seed...\n');

    for (const user of fakeUsers) {
        console.log(`Creating user: ${user.username}`);

        // 1. Create user
        const { error: userError } = await supabase
            .from('users')
            .upsert({
                id: user.id,
                whop_id: user.whopId,
                username: user.username,
                avatar: user.avatar,
            }, { onConflict: 'id' });

        if (userError) {
            console.error(`  ❌ Error creating user: ${userError.message}`);
            continue;
        }
        console.log(`  ✅ User created`);

        // 2. Create linked accounts
        for (const platform of user.platforms) {
            const { error: accountError } = await supabase
                .from('linked_accounts')
                .upsert({
                    user_id: user.id,
                    platform: platform.platform,
                    handle: platform.handle,
                    platform_user_id: `${platform.platform}_${platform.handle}`,
                }, { onConflict: 'user_id,platform' });

            if (accountError) {
                console.error(`  ❌ Error creating ${platform.platform} account: ${accountError.message}`);
            } else {
                console.log(`  ✅ Linked ${platform.platform} @${platform.handle}`);
            }
        }

        // 3. Create clips
        for (let i = 0; i < user.clips.length; i++) {
            const clip = user.clips[i];
            const postedAt = new Date();
            postedAt.setDate(postedAt.getDate() - clip.daysAgo);

            // Generate a UUID for the clip - we'll use insert with onConflict handling by url
            const clipId = randomUUID();
            const clipUrl = `https://${clip.platform}.com/${user.platforms.find(p => p.platform === clip.platform)?.handle}/video/${i}`;
            
            // First try to delete existing clip with same url if any
            await supabase
                .from('clips')
                .delete()
                .eq('user_id', user.id)
                .eq('url', clipUrl);
            
            const { error: clipError } = await supabase
                .from('clips')
                .insert({
                    id: clipId,
                    user_id: user.id,
                    platform: clip.platform,
                    url: clipUrl,
                    thumbnail: `https://picsum.photos/seed/${clipId}/400/700`,
                    views: clip.views,
                    likes: clip.likes,
                    posted_at: postedAt.toISOString(),
                }, { onConflict: 'id' });

            if (clipError) {
                console.error(`  ❌ Error creating clip: ${clipError.message}`);
            }
        }
        console.log(`  ✅ Created ${user.clips.length} clips`);

        // 4. Create/update metrics (earnings)
        const { error: metricsError } = await supabase
            .from('metrics')
            .upsert({
                user_id: user.id,
                earnings: user.earnings,
                views: 0, // These are aggregated from clips
                likes: 0,
            }, { onConflict: 'user_id' });

        if (metricsError) {
            console.error(`  ❌ Error creating metrics: ${metricsError.message}`);
        } else {
            console.log(`  ✅ Set earnings: $${user.earnings.toLocaleString()}`);
        }

        // 5. Create some achievements
        const achievements = [
            { id: '10k_views', name: '10k Views', icon: '🔥' },
            { id: '100k_views', name: '100k Views', icon: '🚀' },
            { id: '1m_views', name: '1M Views', icon: '👑' },
        ];

        for (const ach of achievements) {
            const { error: achError } = await supabase
                .from('achievements')
                .upsert({
                    user_id: user.id,
                    achievement_id: ach.id,
                    name: ach.name,
                    icon: ach.icon,
                    date: Date.now(),
                }, { onConflict: 'user_id,achievement_id' });

            if (achError && !achError.message.includes('duplicate')) {
                // Ignore duplicate errors
            }
        }
        console.log(`  ✅ Added achievements`);

        // 6. Create metric snapshots for Rising Stars
        // Calculate total views from clips
        const totalViews = user.clips.reduce((sum, clip) => sum + clip.views, 0);
        
        // Create snapshots for different time periods
        const snapshotDates = [
            { daysAgo: 0, viewsMultiplier: 1.0 },    // Current
            { daysAgo: 7, viewsMultiplier: 0.7 },    // Week ago (30% growth)
            { daysAgo: 30, viewsMultiplier: 0.5 },   // Month ago (50% growth)
        ];

        // First delete existing snapshots for this user
        await supabase
            .from('metric_snapshots')
            .delete()
            .eq('user_id', user.id);

        for (const snapshot of snapshotDates) {
            const snapshotDate = new Date();
            snapshotDate.setDate(snapshotDate.getDate() - snapshot.daysAgo);
            
            const { error: snapshotError } = await supabase
                .from('metric_snapshots')
                .insert({
                    user_id: user.id,
                    views: Math.floor(totalViews * snapshot.viewsMultiplier),
                    followers: Math.floor(1000000 * snapshot.viewsMultiplier), // Fake followers
                    timestamp: snapshotDate.toISOString(),
                });

            if (snapshotError) {
                console.error(`  ❌ Error creating snapshot: ${snapshotError.message}`);
            }
        }
        console.log(`  ✅ Added metric snapshots for Rising Stars\n`);
    }

    console.log('✨ Database seeding complete!');
}

seedDatabase().catch(console.error);

