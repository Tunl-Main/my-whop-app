
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { updateUserMetrics } from '../lib/metrics';

dotenv.config({ path: '.env.development.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function backfill() {
    console.log("Starting backfill...");

    // 1. Get all users with linked accounts
    const { data: users, error } = await supabase
        .from('users')
        .select(`
            id,
            linked_accounts (
                platform,
                handle
            )
        `);

    if (error) {
        console.error("Error fetching users:", error);
        return;
    }

    console.log(`Found ${users.length} users.`);

    for (const user of users) {
        if (user.linked_accounts && user.linked_accounts.length > 0) {
            const account = user.linked_accounts[0];
            console.log(`Updating metrics for user ${user.id} (${account.platform}: @${account.handle})...`);

            try {
                // Trigger deep scrape (limit 1000 for backfill to capture viral clips)
                await updateUserMetrics(user.id, account.platform, account.handle, 1000);
                console.log(`Success for ${user.id}`);
            } catch (e) {
                console.error(`Failed to update ${user.id}:`, e);
            }
        } else {
            console.log(`Skipping user ${user.id} (no linked accounts)`);
        }
    }

    console.log("Backfill complete!");
}

backfill();
