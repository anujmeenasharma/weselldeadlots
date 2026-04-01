import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const variantId = searchParams.get('variant_id');

    if (!variantId) {
        return NextResponse.json({ quantity: null }, { status: 400 });
    }

    const adminToken = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
    const storeUrl = process.env.NEXT_PUBLIC_SHOPIFY_STORE_URL;
    const apiVersion = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || '2024-04';

    if (!adminToken || !storeUrl) {
        return NextResponse.json({ quantity: null }, { status: 500 });
    }

    try {
        const gid = `gid://shopify/ProductVariant/${variantId}`;
        const query = `{ productVariant(id: "${gid}") { inventoryQuantity } }`;

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
            return NextResponse.json({ quantity: null });
        }

        const data = await response.json();
        if (data.errors) {
            return NextResponse.json({ quantity: null });
        }

        const quantity = data?.data?.productVariant?.inventoryQuantity ?? null;
        return NextResponse.json({ quantity });

    } catch {
        return NextResponse.json({ quantity: null });
    }
}
