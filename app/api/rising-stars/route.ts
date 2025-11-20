import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Fetch all users and their snapshots
        const { data: users, error } = await supabase
            .from('users')
            .select(`
                id,
                whop_id,
                avatar,
                linked_accounts (handle),
                metric_snapshots (
                    views,
                    followers,
                    timestamp
                )
            `);

        if (error) throw error;

        const risingStars = users.map(user => {
            const snapshots = user.metric_snapshots || [];
            if (snapshots.length < 2) return null;

            // Sort snapshots by time desc
            snapshots.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

            const current = snapshots[0];
            // Find snapshot ~7 days ago
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const old = snapshots.find((s: any) => new Date(s.timestamp) <= sevenDaysAgo) || snapshots[snapshots.length - 1];

            if (!old || old.followers === 0) return null;

            const growth = ((current.followers - old.followers) / old.followers) * 100;
            const newFollowers = current.followers - old.followers;

            return {
                id: user.id,
                username: user.linked_accounts?.[0]?.handle || 'unknown',
                avatar: user.avatar,
                growthPercent: Math.round(growth),
                newFollowers: newFollowers
            };
        })
            .filter(Boolean)
            .sort((a: any, b: any) => b.growthPercent - a.growthPercent)
            .slice(0, 5); // Top 5

        return NextResponse.json(risingStars);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
