
import { NextResponse } from 'next/server';
import { getTopClips } from '@/lib/db';

export async function GET() {
    const clips = await getTopClips(20); // Fetch top 20 clips
    return NextResponse.json(clips);
}
