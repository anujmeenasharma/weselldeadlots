
const shopifyConfig = {
    storeUrl: "738eda.myshopify.com",
    accessToken: "f6558466e9d3ffd0edfeda79dedc938a",
    apiVersion: "2024-04",
};

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
                cache: "no-store", // Ensure fresh data for now
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
        console.error("Error fetching Shopify data:", error);
        return null;
    }
}

export async function fetchTodaysDeals() {
    const query = `
    query {
        collectionByHandle(handle: "today-deal") {
            products(first: 10) {
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

export async function fetchExploreLots() {
    const query = `
    query {
        products(first: 20, sortKey: CREATED_AT, reverse: true) {
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
    // Optional: Shuffle products here if needed, or just return
    return data?.products?.edges || [];
}

export async function fetchBlogData(cursor = null) {
    const paginationParams = cursor ? `after: "${cursor}", first: 20` : `first: 20`;
    const query = `
    {
        blogByHandle(handle: "testing") {
            id
            title
            handle
            articles(${paginationParams}) {
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
    // Spotify Storefront API has a productRecommendations query, but it requires the product ID.
    // Alternatively, we can fetch from the same collection.
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
