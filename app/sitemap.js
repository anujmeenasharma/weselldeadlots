import { fetchBlogData, fetchExploreLots } from '@/lib/shopify';

const BASE_URL = 'https://weselldeadlots.com';

export default async function sitemap() {
    const staticRoutes = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/categories`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/blogs`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/search`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/sell-with-us`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${BASE_URL}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${BASE_URL}/terms`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ];

    let productRoutes = [];
    try {
        let allProducts = [];
        let cursor = null;
        let hasNextPage = true;

        while (hasNextPage) {
            const { edges, pageInfo } = await fetchExploreLots(250, cursor);
            allProducts = allProducts.concat(edges);
            hasNextPage = pageInfo.hasNextPage;
            cursor = pageInfo.endCursor;
        }

        productRoutes = allProducts.map(({ node }) => ({
            url: `${BASE_URL}/product/${node.handle}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        }));
    } catch {
        productRoutes = [];
    }

    let blogRoutes = [];
    try {
        let allArticles = [];
        let cursor = null;
        let hasNextPage = true;

        while (hasNextPage) {
            const { edges, pageInfo } = await fetchBlogData(cursor);
            allArticles = allArticles.concat(edges);
            hasNextPage = pageInfo.hasNextPage;
            cursor = pageInfo.endCursor;
        }

        blogRoutes = allArticles.map(({ node }) => ({
            url: `${BASE_URL}/blogs/${node.handle}`,
            lastModified: new Date(node.publishedAt),
            changeFrequency: 'monthly',
            priority: 0.6,
        }));
    } catch {
        blogRoutes = [];
    }

    return [...staticRoutes, ...productRoutes, ...blogRoutes];
}
