import { fetchBlogData, fetchExploreLots } from '@/lib/shopify';
import { getSitemapPages, getSitemapPosts } from '@/sanity/lib/content';
import { siteUrl } from '@/sanity/env';

const BASE_URL = siteUrl;

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

    // CMS pages (e.g. /privacy, /terms and any page created in Sanity).
    const yearly = new Set(['privacy', 'terms']);
    const cmsPageRoutes = (await getSitemapPages()).map((page) => ({
        url: `${BASE_URL}/${page.slug}`,
        lastModified: page._updatedAt ? new Date(page._updatedAt) : new Date(),
        changeFrequency: yearly.has(page.slug) ? 'yearly' : 'monthly',
        priority: yearly.has(page.slug) ? 0.3 : 0.6,
    }));

    // Blog posts written in Sanity (Shopify articles are listed above).
    const seen = new Set(blogRoutes.map((r) => r.url));
    const cmsBlogRoutes = (await getSitemapPosts())
        .map((post) => ({
            url: `${BASE_URL}/blogs/${post.slug}`,
            lastModified: new Date(post.updatedAt || post.publishedAt || post._updatedAt),
            changeFrequency: 'monthly',
            priority: 0.6,
        }))
        .filter((r) => !seen.has(r.url));

    return [...staticRoutes, ...cmsPageRoutes, ...productRoutes, ...blogRoutes, ...cmsBlogRoutes];
}
