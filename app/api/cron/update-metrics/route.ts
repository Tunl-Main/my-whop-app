import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { updateUserMetrics } from '@/lib/metrics';

export const dynamic = 'force-dynamic'; // Ensure this route is not cached

export async function GET() {
    try {
        // 1. Fetch all users with linked accounts
        const { data: users, error } = await supabase
            .from('users')
            .select(`
                *,
                linked_accounts (*)
            `);

        if (error) {
            console.error('Error fetching users:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (!users || users.length === 0) {
            return NextResponse.json({ message: 'No users found' });
        }

        const results = [];

        // 2. Iterate through users and scrape data
        for (const user of users) {
            if (!user.linked_accounts || user.linked_accounts.length === 0) continue;

            for (const account of user.linked_accounts) {
                // Add delay to avoid hitting rate limits if processing many users
                // await new Promise(resolve => setTimeout(resolve, 1000));

                const result = await updateUserMetrics(user.id, account.platform, account.handle);

                if (result) {
                    results.push({
                        user: user.whop_id,
                        platform: account.platform,
                        status: 'success',
                        followers: result.followers,
                        recentViews: result.recentViews
                    });
                } else {
                    results.push({ user: user.whop_id, platform: account.platform, status: 'failed_scrape' });
                }
            }
        }

        return NextResponse.json({
            success: true,
            processed: results.length,
            details: results
        });

    } catch (error: any) {
        console.error('Cron job error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
