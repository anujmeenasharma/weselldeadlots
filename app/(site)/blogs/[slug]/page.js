import { fetchArticle } from '@/lib/shopify';
import Image from 'next/image';
import Link from "@/components/AppLink";
import RichText from '@/components/sanity/RichText';
import JsonLd from '@/components/sanity/JsonLd';
import { getBlogPost, getBlogSettings } from '@/sanity/lib/content';
import { buildPageMetadata, parseStructuredData } from '@/sanity/lib/metadata';
import { imageAlt, imageUrl } from '@/sanity/lib/image';
import { siteUrl } from '@/sanity/env';

const ARTICLE_CLASSES = `max-w-none
                        [&_h1]:text-gray-900 [&_h1]:font-bold [&_h1]:text-3xl [&_h1]:mb-6 [&_h1]:mt-12
                        [&_h2]:text-4xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mb-4 [&_h2]:mt-10
                        [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:mb-4 [&_h3]:mt-8
                        [&_h4]:text-xl [&_h4]:font-bold [&_h4]:text-gray-900 [&_h4]:mb-3 [&_h4]:mt-6
                        [&_p]:text-gray-700 [&_p]:text-lg [&_p]:leading-relaxed [&_p]:mb-6
                        [&_a]:text-blue-600 [&_a]:underline hover:[&_a]:text-blue-800 [&_a]:cursor-pointer [&_a]:pointer-events-auto [&_a]:relative [&_a]:z-10
                        [&_strong]:text-gray-900 [&_strong]:font-semibold
                        [&_ul]:text-gray-700 [&_ul]:text-lg [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6
                        [&_ol]:text-gray-700 [&_ol]:text-lg [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6
                        [&_li]:text-gray-700 [&_li]:text-lg [&_li]:mb-2 [&_li]:leading-relaxed
                        [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:mb-6`;

/** Posts written in Sanity take priority; otherwise fall back to the Shopify blog article. */
async function loadArticle(slug) {
    const post = await getBlogPost(slug);
    if (post) {
        return {
            source: 'sanity',
            post,
            title: post.title,
            publishedAt: post.publishedAt,
            image: post.mainImage ? { url: imageUrl(post.mainImage, { width: 1920 }), altText: imageAlt(post.mainImage, post.title) } : null,
        };
    }
    let article = await fetchArticle(slug);
    if (!article) article = await fetchArticle(`blogs-${slug}`);
    if (!article) return null;
    return { source: 'shopify', article, title: article.title, publishedAt: article.publishedAt, image: article.image };
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const data = await loadArticle(slug);
    if (!data) return { title: 'Article Not Found' };

    if (data.source === 'sanity') {
        const meta = buildPageMetadata(data.post.seo, {
            path: `/blogs/${slug}`,
            title: data.post.title,
            description: data.post.excerpt,
        });
        if (!data.post.seo?.ogImage && data.image?.url) {
            meta.openGraph = { ...meta.openGraph, type: 'article', images: [{ url: data.image.url }] };
        }
        return meta;
    }

    const { article } = data;
    return {
        title: article.seo?.title || article.title,
        description: article.seo?.description || article.excerpt,
        alternates: {
            canonical: `/blogs/${slug}`,
        },
    };
}

export default async function BlogPostPage({ params }) {
    const { slug } = await params;
    const [data, settings] = await Promise.all([loadArticle(slug), getBlogSettings()]);

    if (!data) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Article not found</h1>
                    <Link href="/blogs" className="text-blue-600 hover:underline">
                        Back to blogs
                    </Link>
                </div>
            </div>
        );
    }

    const formattedDate = new Date(data.publishedAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    const jsonLd = {
        "@context": "https://schema.org/",
        "@type": "BreadcrumbList",
        "itemListElement": [{
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.weselldeadlots.com/"
        },{
            "@type": "ListItem",
            "position": 2,
            "name": "Blogs",
            "item": "https://www.weselldeadlots.com/blogs"
        },{
            "@type": "ListItem",
            "position": 3,
            "name": data.title,
            "item": `https://www.weselldeadlots.com/blogs/${slug}`
        }]
    };

    const post = data.post;
    const articleLd = post && {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        image: data.image?.url,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt || post._updatedAt,
        author: post.author?.name ? { "@type": "Person", name: post.author.name } : undefined,
        keywords: post.tags?.join(", "),
        mainEntityOfPage: `${siteUrl}/blogs/${slug}`,
    };
    const related = (post?.relatedPosts || []).filter((p) => p?.slug);

    return (
        <div className="min-h-screen">
            <JsonLd data={jsonLd} />
            <JsonLd data={articleLd} />
            <JsonLd data={parseStructuredData(post?.seo?.structuredData)} />
            {/* Hero Section with Background Image */}
            <div className="relative h-[50vh] w-full">
                {data.image?.url && (
                    <Image
                        src={data.image.url}
                        alt={data.image.altText || data.title}
                        fill
                        className="object-cover"
                        priority
                    />
                )}
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/60" />

                {/* Content overlay */}
                <div className="relative h-full w-full px-6 sm:px-8 lg:px-12 flex flex-col justify-center">
                    <Link
                        href="/blogs"
                        className="inline-flex items-center text-white hover:text-gray-200 mb-6 transition-colors text-lg"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        {settings?.backLabel}
                    </Link>

                    <div className="text-white text-lg mb-3 tracking-wide">
                        {post?.category || settings?.postLabel}
                    </div>

                    <h1 className="text-white text-4xl sm:text-4xl lg:text-4xl font-bold leading-tight max-w-5xl">
                        {data.title}
                    </h1>
                </div>
            </div>

            {/* White Content Section */}
            <div className="bg-white">
                <div className="lg:w-[70%] px-6 sm:px-8 lg:px-12 py-16">
                    {/* Published Date */}
                    <div className="text-gray-600 text-base mb-12">
                        {settings?.publishedLabel} : {formattedDate}
                    </div>

                    {/* Article Content */}
                    {data.source === 'sanity' ? (
                        <RichText value={post.body} variant="plain" className={ARTICLE_CLASSES} />
                    ) : (
                        <div
                            className={ARTICLE_CLASSES}
                            dangerouslySetInnerHTML={{ __html: data.article.contentHtml }}
                        />
                    )}

                    {post?.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-10">
                            {post.tags.map((tag) => (
                                <span key={tag} className="text-xs font-semibold uppercase tracking-wider bg-gray-100 text-gray-700 rounded-full px-3 py-1">{tag}</span>
                            ))}
                        </div>
                    )}
                </div>

                {related.length > 0 && (
                    <div className="px-6 sm:px-8 lg:px-12 pb-20">
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            {related.map((rp) => {
                                const src = imageUrl(rp.mainImage, { width: 800 });
                                return (
                                    <Link key={rp._id} href={`/blogs/${rp.slug}`} className="group flex flex-col overflow-hidden rounded-xl cursor-pointer">
                                        <div className="relative h-60 w-full overflow-hidden rounded-xl bg-gray-200">
                                            {src && <Image src={src} alt={imageAlt(rp.mainImage, rp.title)} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />}
                                        </div>
                                        <h3 className="pt-6 text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{rp.title}</h3>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
