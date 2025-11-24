
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.development.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function checkThumbnails() {
    console.log("Checking thumbnail URLs...");

    const { data: clips, error } = await supabase
        .from('clips')
        .select('id, platform, thumbnail, url')
        .limit(5);

    if (error) {
        console.error("Error fetching clips:", error);
        return;
    }

    if (!clips || clips.length === 0) {
        console.log("No clips found.");
        return;
    }

    clips.forEach(clip => {
        console.log(`\nClip ID: ${clip.id}`);
        console.log(`Platform: ${clip.platform}`);
        console.log(`Thumbnail URL: ${clip.thumbnail}`);
        console.log(`Video URL: ${clip.url}`);
    });
}

checkThumbnails();
