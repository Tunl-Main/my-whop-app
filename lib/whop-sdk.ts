import { Whop } from "@whop/sdk";

export const whopsdk = new Whop({
	appID: process.env.NEXT_PUBLIC_WHOP_APP_ID || "dummy-app-id",
	apiKey: process.env.WHOP_API_KEY || "dummy-api-key",
	webhookKey: btoa(process.env.WHOP_WEBHOOK_SECRET || "dummy-secret"),
});
