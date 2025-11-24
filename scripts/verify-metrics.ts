
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.development.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function verify() {
    console.log("Verifying metrics...");

    const { data: metrics, error } = await supabase
        .from('metrics')
        .select('*');

    if (error) {
        console.error("Error fetching metrics:", error);
        return;
    }

    console.log("Metrics found:", metrics);

    const { count, error: clipsError } = await supabase
        .from('clips')
        .select('*', { count: 'exact', head: true });

    if (clipsError) {
        console.error("Error fetching clips count:", clipsError);
    } else {
        console.log("Total clips in DB:", count);
    }

    const { data: accounts } = await supabase
        .from('linked_accounts')
        .select('*');
    console.log("Linked Accounts:", accounts);
}

verify();
