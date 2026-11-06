import { getShopifyAdminToken } from '@/lib/shopifyAdminToken';
import { NextResponse } from 'next/server';

const cache = new Map();
const CACHE_TTL_MS = 2 * 60 * 1000;

function getCached(key) {
    const entry = cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.ts > CACHE_TTL_MS) {
        cache.delete(key);
        return null;
    }
    return entry.value;
}

function setCache(key, value) {
    cache.set(key, { value, ts: Date.now() });
}

export async function POST(request) {
    const body = await request.json();
    const variantIds = body?.variantIds;

    if (!Array.isArray(variantIds) || variantIds.length === 0) {
        return NextResponse.json({ quantities: {} }, { status: 400 });
    }

    const adminToken = await getShopifyAdminToken();
    const storeUrl = process.env.NEXT_PUBLIC_SHOPIFY_STORE_URL;
    const apiVersion = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || '2024-04';

    // Unknown quantities are returned as null so the UI can stop showing "Checking..."
    const allUnknown = () => Object.fromEntries(variantIds.map((id) => [id, null]));

    if (!adminToken || !storeUrl) {
        return NextResponse.json({ quantities: allUnknown() });
    }

    const result = {};
    const toFetch = [];
    const markUnknown = () => {
        for (const id of toFetch) result[id] = null;
        return NextResponse.json({ quantities: result });
    };

    for (const id of variantIds) {
        const cached = getCached(id);
        if (cached !== null) {
            result[id] = cached;
        } else {
            toFetch.push(id);
        }
    }

    if (toFetch.length === 0) {
        return NextResponse.json({ quantities: result });
    }

    const aliases = toFetch
        .map((id) => {
            const gid = `gid://shopify/ProductVariant/${id}`;
            return `v${id}: productVariant(id: "${gid}") { inventoryQuantity }`;
        })
        .join('\n');

    const query = `{ ${aliases} }`;

    try {
        const response = await fetch(
            `https://${storeUrl}/admin/api/${apiVersion}/graphql.json`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Access-Token': adminToken,
                },
                body: JSON.stringify({ query }),
                cache: 'no-store',
            }
        );

        if (!response.ok) {
            console.error('[inventory] Shopify Admin API error', response.status);
            return markUnknown();
        }

        const data = await response.json();

        if (data.errors) {
            console.error('[inventory] Shopify Admin API error', JSON.stringify(data.errors));
            return markUnknown();
        }

        for (const id of toFetch) {
            const qty = data?.data?.[`v${id}`]?.inventoryQuantity ?? null;
            result[id] = qty;
            setCache(id, qty);
        }

        return NextResponse.json({ quantities: result }, {
            headers: {
                'Cache-Control': 'public, max-age=120, stale-while-revalidate=60',
            }
        });
    } catch (err) {
        console.error('[inventory] fetch failed', err);
        return markUnknown();
    }
}
