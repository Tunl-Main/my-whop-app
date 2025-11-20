import { NextResponse } from 'next/server';
import { getUsers } from '@/lib/db';

export async function GET() {
    const users = await getUsers();
    const sortedUsers = users
        .filter(u => u.linkedAccounts && u.linkedAccounts.length > 0) // Only show linked users
        .sort((a, b) => b.metrics.views - a.metrics.views);

    return NextResponse.json(sortedUsers);
}
