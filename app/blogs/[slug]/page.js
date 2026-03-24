import { fetchArticle } from '@/lib/shopify';
import Image from 'next/image';
import Link from 'next/link';

export async function generateMetadata({ params }) {
    const { slug } = await params;
    let article = await fetchArticle(slug);
    if (!article) article = await fetchArticle(`blogs-${slug}`);
    if (!article) return { title: 'Article Not Found' };

    return {
        title: article.seo?.title || article.title,
        description: article.seo?.description || article.excerpt,
    };
}

export default async function BlogPostPage({ params }) {
    const { slug } = await params;
    let article = await fetchArticle(slug);
    if (!article) article = await fetchArticle(`blogs-${slug}`);

    if (!article) {
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

    const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <div className="min-h-screen">
            {/* Hero Section with Background Image */}
            <div className="relative h-[50vh] w-full">
                {article.image && (
                    <Image
                        src={article.image.url}
                        alt={article.image.altText || article.title}
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
                        Back
                    </Link>
                    
                    <div className="text-white text-lg mb-3 tracking-wide">
                        Dead Stock Blog
                    </div>
                    
                    <h1 className="text-white text-4xl sm:text-4xl lg:text-4xl font-bold leading-tight max-w-5xl">
                        {article.title}
                    </h1>
                </div>
            </div>

            {/* White Content Section */}
            <div className="bg-white">
                <div className="lg:w-[70%] px-6 sm:px-8 lg:px-12 py-16">
                    {/* Published Date */}
                    <div className="text-gray-600 text-base mb-12">
                        Published on : {formattedDate}
                    </div>

                    {/* Article Content */}
                    <div
                        className="prose prose-lg max-w-none 
                        prose-headings:text-gray-900 prose-headings:font-bold prose-headings:text-3xl prose-headings:mb-6 prose-headings:mt-12
                        prose-p:text-gray-700 prose-p:text-lg prose-p:leading-relaxed prose-p:mb-6
                        [&_a]:text-blue-600 [&_a]:underline hover:[&_a]:text-blue-800 [&_a]:cursor-pointer [&_a]:pointer-events-auto [&_a]:relative [&_a]:z-10
                        prose-strong:text-gray-900 prose-strong:font-semibold
                        prose-ul:text-gray-700 prose-ul:text-lg
                        prose-ol:text-gray-700 prose-ol:text-lg
                        [&>h2]:text-4xl [&>h2]:font-bold [&>h2]:text-gray-900 [&>h2]:mb-4 [&>h2]:mt-10
                        [&>h3]:text-2xl [&>h3]:font-bold [&>h3]:text-gray-900 [&>h3]:mb-4 [&>h3]:mt-8"
                        dangerouslySetInnerHTML={{ __html: article.contentHtml }}
                    />
                </div>
            </div>
        </div>
    );
}