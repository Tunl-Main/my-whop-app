import { NextResponse } from 'next/server';
import { getTopClips } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') as 'week' | 'month' | 'all' || 'all';
    const platform = searchParams.get('platform') as 'instagram' | 'tiktok' | 'youtube' | 'twitter' | null;

    const clips = await getTopClips(20, range, platform || undefined);
    return NextResponse.json(clips);
}
