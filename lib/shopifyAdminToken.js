// Server-only: returns a Shopify Admin API access token.
//
// Apps created in Shopify's Dev Dashboard don't hand out a permanent token.
// Instead we exchange the app's client ID + secret for a short-lived token
// (client credentials grant, valid ~24h) and cache it in memory until shortly
// before it expires. Falls back to a static SHOPIFY_ADMIN_API_ACCESS_TOKEN if
// no client credentials are configured.

let cached = null; // { token, expiresAt }
let inflight = null;

const REFRESH_MARGIN_MS = 5 * 60 * 1000;

async function requestToken() {
    const storeUrl = process.env.NEXT_PUBLIC_SHOPIFY_STORE_URL;
    const clientId = process.env.SHOPIFY_CLIENT_ID;
    const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;

    const response = await fetch(`https://${storeUrl}/admin/oauth/access_token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: clientId,
            client_secret: clientSecret,
        }),
        cache: 'no-store',
    });

    if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(`Shopify token exchange failed (${response.status}): ${text.slice(0, 200)}`);
    }

    const data = await response.json();
    const expiresInMs = (Number(data.expires_in) || 86399) * 1000;
    cached = { token: data.access_token, expiresAt: Date.now() + expiresInMs };
    return cached.token;
}

export async function getShopifyAdminToken() {
    const hasClientCreds =
        process.env.SHOPIFY_CLIENT_ID &&
        process.env.SHOPIFY_CLIENT_SECRET &&
        process.env.NEXT_PUBLIC_SHOPIFY_STORE_URL;

    if (!hasClientCreds) {
        return process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN || null;
    }

    if (cached && cached.expiresAt - REFRESH_MARGIN_MS > Date.now()) {
        return cached.token;
    }

    if (!inflight) {
        inflight = requestToken().finally(() => {
            inflight = null;
        });
    }

    try {
        return await inflight;
    } catch (err) {
        console.error('[shopify] could not get Admin API token:', err.message);
        return process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN || null;
    }
}
