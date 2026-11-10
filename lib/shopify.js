
const shopifyConfig = {
    storeUrl: process.env.NEXT_PUBLIC_SHOPIFY_STORE_URL,
    accessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    apiVersion: process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION,
};

function isNextInternalError(error) {
    const digest = error?.digest;
    return typeof digest === "string" && (digest === "DYNAMIC_SERVER_USAGE" || digest.startsWith("NEXT_"));
}

export async function fetchShopifyData(query) {
    try {
        const response = await fetch(
            `https://${shopifyConfig.storeUrl}/api/${shopifyConfig.apiVersion}/graphql.json`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Shopify-Storefront-Access-Token": shopifyConfig.accessToken,
                    Accept: "application/json",
                },
                body: JSON.stringify({ query }),
                // Cache on the server for 5 minutes so pages can be pre-rendered and refreshed
                // in the background (ISR). Ignored in the browser. Live stock comes from
                // /api/inventory, so a short cache here is fine.
                next: { revalidate: 300 },
            }
        );

        if (!response.ok) {
            const text = await response.text();
            console.error("Shopify API Error:", text);
            throw new Error(`Failed to fetch from Shopify: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        if (data.errors) {
            console.error("Shopify GraphQL Errors:", JSON.stringify(data.errors, null, 2));
            throw new Error("Shopify GraphQL Errors");
        }

        return data.data;
    } catch (error) {
        // Let Next.js's internal build/render signals (e.g. DYNAMIC_SERVER_USAGE) pass through;
        // they are not real errors and must not be swallowed or logged.
        if (isNextInternalError(error)) throw error;
        console.error("Error fetching Shopify data:", error);
        return null;
    }
}

export async function fetchTodaysDeals(collectionHandle = "today-deal", count = 10) {
    // The handle and count can come from the CMS — sanitise before interpolating into GraphQL.
    const handle = /^[a-z0-9_-]+$/i.test(collectionHandle || "") ? collectionHandle : "today-deal";
    const first = Math.min(Math.max(parseInt(count, 10) || 10, 1), 50);
    const query = `
    query {
        collectionByHandle(handle: "${handle}") {
            products(first: ${first}) {
                edges {
                    node {
                        id
                        title
                        handle
                        vendor
                        productType
                        availableForSale
                        images(first: 5) {
                            edges {
                                node {
                                    url
                                    altText
                                }
                            }
                        }
                        variants(first: 1) {
                            edges {
                                node {
                                    id
                                    price {
                                        amount
                                        currencyCode
                                    }
                                }
                            }
                        }
                        metafields(identifiers: [
                            {namespace: "custom", key: "model_no"},
                            {namespace: "custom", key: "mini_quantity"},
                            {namespace: "custom", key: "is_unit_kg"}
                        ]) {
                            key
                            value
                        }
                    }
                }
            }
        }
    }
  `;

    const data = await fetchShopifyData(query);
    return data?.collectionByHandle?.products?.edges || [];
}

export async function fetchExploreLots(count = 25, cursor = null) {
    const first = Math.min(Math.max(parseInt(count, 10) || 25, 1), 250);
    const after = cursor ? `, after: "${cursor}"` : "";
    const query = `
    query {
        products(first: ${first}, sortKey: CREATED_AT, reverse: true${after}) {
            pageInfo {
                hasNextPage
                endCursor
            }
            edges {
                node {
                    id
                    title
                    handle
                    vendor
                    description
                    productType
                    availableForSale
                    images(first: 5) {
                        edges {
                            node {
                                url
                                altText
                            }
                        }
                    }
                    variants(first: 1) {
                        edges {
                            node {
                                id
                                price {
                                    amount
                                    currencyCode
                                }
                            }
                        }
                    }
                    metafields(identifiers: [
                        { namespace: "custom", key: "model_no" },
                        { namespace: "custom", key: "mini_quantity" },
                        { namespace: "custom", key: "is_unit_kg" }
                    ]) {
                        key
                        value
                    }
                }
            }
        }
    }
    `;

    const data = await fetchShopifyData(query);
    return {
        edges: data?.products?.edges || [],
        pageInfo: data?.products?.pageInfo || { hasNextPage: false, endCursor: null }
    };
}

export async function fetchBlogData(cursor = null) {
    const paginationParams = cursor ? `after: "${cursor}", first: 20` : `first: 20`;
    const query = `
    {
        blogByHandle(handle: "testing") {
            id
            title
            handle
            articles(${paginationParams}, sortKey: PUBLISHED_AT, reverse: true) {
                pageInfo {
                    hasNextPage
                    endCursor
                }
                edges {
                    node {
                        id
                        title
                        handle
                        publishedAt
                        contentHtml
                        onlineStoreUrl
                        image {
                            url
                            altText
                        }
                        excerpt
                    }
                }
            }
        }
    }
  `;

    const data = await fetchShopifyData(query);
    return {
        edges: data?.blogByHandle?.articles?.edges || [],
        pageInfo: data?.blogByHandle?.articles?.pageInfo || { hasNextPage: false, endCursor: null }
    };
}

export async function fetchArticle(handle) {
    const query = `
    {
        blogByHandle(handle: "testing") {
            articleByHandle(handle: "${handle}") {
                id
                title
                publishedAt
                contentHtml
                image {
                    url
                    altText
                }
                seo {
                    title
                    description
                }
            }
        }
    }
  `;

    const data = await fetchShopifyData(query);
    return data?.blogByHandle?.articleByHandle || null;
}

export async function fetchProductByHandle(handle) {
    console.log("Fetching product with handle:", handle);
    const query = `
    {
        productByHandle(handle: "${handle}") {
            id
            title
            handle
            vendor
            descriptionHtml
            productType
            availableForSale
            images(first: 20) {
                edges {
                    node {
                        url
                        altText
                    }
                }
            }
            variants(first: 1) {
                edges {
                    node {
                        id
                        price {
                            amount
                            currencyCode
                        }
                    }
                }
            }
            metafields(identifiers: [
                {namespace: "custom", key: "model_no"},
                {namespace: "custom", key: "mini_quantity"},
                {namespace: "custom", key: "is_unit_kg"},
                {namespace: "custom", key: "product_reviews"}
            ]) {
                key
                value
            }
            metafield(namespace: "custom", key: "csv_data") {
                value
                reference {
                    ... on GenericFile {
                        url
                    }
                }
            }
            collections(first: 1) {
                edges {
                    node {
                        id
                        title
                        handle
                    }
                }
            }
        }
    }
  `;

    const data = await fetchShopifyData(query);
    return data?.productByHandle || null;
}

export async function fetchProductRecommendations(productId) {
    const query = `
    {
        productRecommendations(productId: "${productId}") {
            id
            title
            handle
            vendor
            availableForSale
            images(first: 1) {
                edges {
                    node {
                        url
                        altText
                    }
                }
            }
            variants(first: 1) {
                edges {
                    node {
                        id
                        price {
                            amount
                            currencyCode
                        }
                    }
                }
            }
            metafields(identifiers: [
                {namespace: "custom", key: "model_no"},
                {namespace: "custom", key: "mini_quantity"},
                {namespace: "custom", key: "is_unit_kg"}
            ]) {
                key
                value
            }
        }
    }
    `;

    const data = await fetchShopifyData(query);
    return data?.productRecommendations || [];
}

export async function searchProducts(searchQuery) {
    const query = `
    query {
        products(first: 20, query: "${searchQuery}") {
            edges {
                node {
                    id
                    title
                    handle
                    vendor
                    description
                    productType
                    availableForSale
                    images(first: 5) {
                        edges {
                            node {
                                url
                                altText
                            }
                        }
                    }
                    variants(first: 1) {
                        edges {
                            node {
                                id
                                price {
                                    amount
                                    currencyCode
                                }
                            }
                        }
                    }
                    metafields(identifiers: [
                        { namespace: "custom", key: "model_no" },
                        { namespace: "custom", key: "mini_quantity" },
                        { namespace: "custom", key: "is_unit_kg" }
                    ]) {
                        key
                        value
                    }
                }
            }
        }
    }
    `;

    const data = await fetchShopifyData(query);
    return data?.products?.edges || [];
}
