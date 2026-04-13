import { fetchArticle } from '@/lib/shopify';
import Image from 'next/image';
import Link from "@/components/AppLink";

export async function generateMetadata({ params }) {
    const { slug } = await params;
    let article = await fetchArticle(slug);
    if (!article) article = await fetchArticle(`blogs-${slug}`);
    if (!article) return { title: 'Article Not Found' };

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
            "name": article.title,
            "item": `https://www.weselldeadlots.com/blogs/${slug}`  
        }]
    };

    return (
        <div className="min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
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
                        className="max-w-none 
                        [&_h1]:text-gray-900 [&_h1]:font-bold [&_h1]:text-3xl [&_h1]:mb-6 [&_h1]:mt-12
                        [&_h2]:text-4xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mb-4 [&_h2]:mt-10
                        [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:mb-4 [&_h3]:mt-8
                        [&_h4]:text-xl [&_h4]:font-bold [&_h4]:text-gray-900 [&_h4]:mb-3 [&_h4]:mt-6
                        [&_p]:text-gray-700 [&_p]:text-lg [&_p]:leading-relaxed [&_p]:mb-6
                        [&_a]:text-blue-600 [&_a]:underline hover:[&_a]:text-blue-800 [&_a]:cursor-pointer [&_a]:pointer-events-auto [&_a]:relative [&_a]:z-10
                        [&_strong]:text-gray-900 [&_strong]:font-semibold
                        [&_ul]:text-gray-700 [&_ul]:text-lg [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6
                        [&_ol]:text-gray-700 [&_ol]:text-lg [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6
                        [&_li]:text-gray-700 [&_li]:text-lg [&_li]:mb-2 [&_li]:leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: article.contentHtml }}
                    />
                </div>
            </div>
        </div>
    );
}