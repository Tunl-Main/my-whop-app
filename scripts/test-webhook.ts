import crypto from 'crypto';

const APP_SECRET = process.env.META_APP_SECRET || '6bc1abbfe0e513fc3cc38f7ef8a80c5a';
const WEBHOOK_URL = 'http://localhost:3000/api/webhook/instagram';

// 1. Define the payload
const payload = {
    object: 'instagram',
    entry: [
        {
            id: '17841405793187218',
            time: Date.now(),
            messaging: [
                {
                    sender: { id: '123456789' },
                    recipient: { id: '987654321' },
                    timestamp: Date.now(),
                    message: {
                        mid: 'm_mid.$123456789',
                        text: '123456' // <--- The OTP to test
                    }
                }
            ]
        }
    ]
};

const body = JSON.stringify(payload);

// 2. Sign the payload
const signature = 'sha256=' + crypto
    .createHmac('sha256', APP_SECRET)
    .update(body)
    .digest('hex');

// 3. Send the request
async function sendWebhook() {
    console.log('Sending webhook to:', WEBHOOK_URL);
    console.log('Payload:', JSON.stringify(payload, null, 2));
    console.log('Signature:', signature);

    try {
        const res = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-hub-signature-256': signature
            },
            body: body
        });

        console.log('Response status:', res.status);
        const text = await res.text();
        console.log('Response body:', text);
    } catch (err) {
        console.error('Error sending webhook:', err);
    }
}

sendWebhook();
