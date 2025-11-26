import { NextRequest, NextResponse } from 'next/server';
import { getLeaderboardData, User } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const range = (searchParams.get('range') as 'week' | 'month' | 'all') || 'week';
    const sortBy = (searchParams.get('sortBy') as 'views' | 'earnings' | 'likes') || 'views';
    const platform = searchParams.get('platform') as 'instagram' | 'tiktok' | 'youtube' | 'twitter' | null;

    const users = await getLeaderboardData(range, platform || undefined);

    const sortedUsers = users
        .filter((u: User) => u.linkedAccounts && u.linkedAccounts.length > 0) // Only show linked users
        .filter((u: User) => {
            // If platform filter is set, only show users with that platform
            if (platform) {
                return u.linkedAccounts?.some(acc => acc.platform === platform);
            }
            return true;
        })
        .sort((a: User, b: User) => {
            switch (sortBy) {
                case 'earnings':
                    return (b.metrics.earnings || 0) - (a.metrics.earnings || 0);
                case 'likes':
                    return b.metrics.likes - a.metrics.likes;
                case 'views':
                default:
                    return b.metrics.views - a.metrics.views;
            }
        });

    return NextResponse.json(sortedUsers);
}
