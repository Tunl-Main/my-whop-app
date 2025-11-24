
import { NextResponse } from 'next/server';
import { getTopClips } from '@/lib/db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') as 'week' | 'month' | 'all' || 'all';

    const clips = await getTopClips(20, range); // Fetch top 20 clips with filter
    return NextResponse.json(clips);
}
