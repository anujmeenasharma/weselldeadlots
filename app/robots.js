export default function robots() {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/_next/'],
            },
        ],
        sitemap: 'https://weselldeadlots.com/sitemap.xml',
        host: 'https://weselldeadlots.com',
    };
}
