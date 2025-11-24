
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.development.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function debug() {
    console.log("Fetching users raw data...");

    const { data, error } = await supabase
        .from('users')
        .select(`
            *,
            linked_accounts (*),
            metrics (*),
            achievements (*)
        `);

    if (error) {
        console.error("Error:", error);
        return;
    }

    if (data && data.length > 0) {
        // Find the user with metrics
        const userWithMetrics = data.find(u => u.metrics && (Array.isArray(u.metrics) ? u.metrics.length > 0 : u.metrics.views));

        if (userWithMetrics) {
            console.log("User with metrics found:", JSON.stringify(userWithMetrics, null, 2));
            console.log("Metrics type:", Array.isArray(userWithMetrics.metrics) ? "Array" : "Object");
        } else {
            console.log("No user with metrics found in raw response.");
            console.log("First user sample:", JSON.stringify(data[0], null, 2));
        }
    } else {
        console.log("No users found.");
    }
}

debug();
