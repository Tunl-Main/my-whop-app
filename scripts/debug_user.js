require('dotenv').config({ path: '.env.development.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUser() {
    console.log('Fetching users...');
    const { data: users, error } = await supabase
        .from('users')
        .select(`
      id,
      whop_id,
      linked_accounts (
        platform,
        handle
      )
    `);

    if (error) {
        console.error('Error fetching users:', error);
        return;
    }

    console.log('Found', users.length, 'users');

    // Find user with handle @myaesthetic.ai
    const targetUser = users.find(u =>
        u.linked_accounts && u.linked_accounts.some(acc => acc.handle === '@myaesthetic.ai' || acc.handle === 'myaesthetic.ai')
    );

    if (targetUser) {
        console.log('Target User Found:', JSON.stringify(targetUser, null, 2));
    } else {
        console.log('User with handle @myaesthetic.ai NOT found in linked_accounts');
        // Log all users to see what we have
        users.forEach(u => {
            console.log(`User ${u.id}: whop_id=${u.whop_id}, accounts=${JSON.stringify(u.linked_accounts)}`);
        });
    }
}

checkUser();
