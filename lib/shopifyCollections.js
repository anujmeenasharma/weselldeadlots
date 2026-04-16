/**
 * Shared server-side Shopify collections fetcher.
 * Used by the categories pages to pre-fetch all collections + products server-side,
 * eliminating the expensive client-side fetch loop that was causing slow page loads.
 */

const SHOPIFY_STORE_URL = process.env.NEXT_PUBLIC_SHOPIFY_STORE_URL;
const SHOPIFY_STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const SHOPIFY_API_VERSION = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || '2024-04';

async function shopifyFetch(query, variables = {}) {
    const response = await fetch(
        `https://${SHOPIFY_STORE_URL}/api/${SHOPIFY_API_VERSION}/graphql.json`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
                Accept: 'application/json',
            },
            body: JSON.stringify({ query, variables }),
            // ISR revalidation is controlled by the page's `export const revalidate`
            next: { revalidate: 600 },
        }
    );

    if (!response.ok) {
        throw new Error(`Shopify fetch failed: ${response.status}`);
    }

    const data = await response.json();
    if (data.errors) {
        throw new Error(data.errors[0]?.message || 'GraphQL error');
    }
    return data;
}

export async function fetchAllShopifyCollections() {
    const COLLECTION_QUERY = `
        query($cursor: String) {
            collections(first: 50, after: $cursor) {
                pageInfo { hasNextPage, endCursor }
                edges {
                    node {
                        id
                        title
                        handle
                        products(first: 250) {
                            edges {
                                node {
                                    id
                                    title
                                    handle
                                    vendor
                                    productType
                                    description
                                    images(first: 5) {
                                        edges { node { url, altText } }
                                    }
                                    variants(first: 1) {
                                        edges {
                                            node {
                                                id
                                                price { amount, currencyCode }
                                            }
                                        }
                                    }
                                    tags
                                    metafields(identifiers: [
                                        {namespace: "custom", key: "model_no"},
                                        {namespace: "custom", key: "mini_quantity"},
                                        {namespace: "custom", key: "is_unit_kg"},
                                        {namespace: "custom", key: "material"}
                                    ]) { key, value }
                                }
                            }
                        }
                    }
                }
            }
        }
    `;

    try {
        let allCollections = [];
        let hasNextPage = true;
        let cursor = null;

        while (hasNextPage) {
            const data = await shopifyFetch(COLLECTION_QUERY, cursor ? { cursor } : {});
            allCollections = [...allCollections, ...data.data.collections.edges];
            hasNextPage = data.data.collections.pageInfo.hasNextPage;
            cursor = data.data.collections.pageInfo.endCursor;
        }

        return allCollections;
    } catch (err) {
        console.error('fetchAllShopifyCollections error:', err);
        return [];
    }
}
