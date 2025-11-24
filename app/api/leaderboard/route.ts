import { NextRequest } from 'next/server';
import { getLeaderboardData } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const range = (searchParams.get('range') as 'week' | 'month' | 'all') || 'week';

    const users = await getLeaderboardData(range);

    const sortedUsers = users
        .filter(u => u.linkedAccounts && u.linkedAccounts.length > 0) // Only show linked users
        .sort((a, b) => b.metrics.views - a.metrics.views);

    return NextResponse.json(sortedUsers);
}
