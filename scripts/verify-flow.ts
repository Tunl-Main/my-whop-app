import crypto from 'crypto';

const APP_SECRET = process.env.META_APP_SECRET || '6bc1abbfe0e513fc3cc38f7ef8a80c5a';
const BASE_URL = 'http://localhost:3000';

async function runTest() {
    console.log('Starting End-to-End Verification...');

    // 1. Register a new user
    const userId = `test_user_${Date.now()}`;
    console.log(`\n1. Registering user: ${userId}`);

    const regRes = await fetch(`${BASE_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, username: 'Test User', avatar: 'https://example.com/avatar.png' })
    });

    if (!regRes.ok) throw new Error(`Registration failed: ${regRes.status}`);
    const { otp } = await regRes.json();
    console.log(`   -> Got OTP: ${otp}`);

    // 2. Simulate Instagram Webhook with this OTP
    console.log(`\n2. Simulating Webhook with OTP: ${otp}`);
    const payload = {
        object: 'instagram',
        entry: [{
            id: '17841405793187218',
            time: Date.now(),
            messaging: [{
                sender: { id: 'ig_test_user_123' },
                recipient: { id: '987654321' },
                timestamp: Date.now(),
                message: {
                    mid: 'm_mid.$123456789',
                    text: otp // Use the real OTP
                }
            }]
        }]
    };

    const body = JSON.stringify(payload);
    const signature = 'sha256=' + crypto
        .createHmac('sha256', APP_SECRET)
        .update(body)
        .digest('hex');

    const webhookRes = await fetch(`${BASE_URL}/api/webhook/instagram`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-hub-signature-256': signature
        },
        body: body
    });

    if (!webhookRes.ok) throw new Error(`Webhook failed: ${webhookRes.status}`);
    console.log('   -> Webhook delivered successfully');

    // 3. Verify User is Linked (via Leaderboard)
    console.log('\n3. Verifying Link via Leaderboard...');
    // Give it a moment for DB propagation if needed (though it should be immediate)
    await new Promise(r => setTimeout(r, 1000));

    const lbRes = await fetch(`${BASE_URL}/api/leaderboard`);
    const leaderboard = await lbRes.json();

    const userInLeaderboard = leaderboard.find((u: any) => u.whopId === userId);

    if (userInLeaderboard) {
        console.log('   -> SUCCESS: User found in leaderboard!');
        console.log('   -> Linked Accounts:', userInLeaderboard.linkedAccounts);

        const linked = userInLeaderboard.linkedAccounts.find((a: any) => a.platform === 'instagram' && a.id === 'ig_test_user_123');
        if (linked) {
            console.log('   -> VERIFIED: Instagram account correctly linked.');
        } else {
            console.error('   -> FAILED: Instagram account not found or ID mismatch.');
        }
    } else {
        console.error('   -> FAILED: User not found in leaderboard (maybe filtering logic excluded them?)');
    }
}

runTest().catch(console.error);
