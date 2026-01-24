
import { fetchArticle } from '@/lib/shopify';
import Image from 'next/image';
import Link from 'next/link';

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const article = await fetchArticle(slug);
    if (!article) return { title: 'Article Not Found' };

    return {
        title: article.seo?.title || article.title,
        description: article.seo?.description || article.excerpt,
    };
}

export default async function BlogPostPage({ params }) {
    const { slug } = await params;
    const article = await fetchArticle(slug);

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

    const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="bg-[#F3F3F3] min-h-screen pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
                <Link href="/blogs" className="inline-flex items-center text-gray-600 hover:text-black mb-8 transition-colors">
                    ← Back to all blogs
                </Link>

                <article className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm">
                    <header className="mb-8">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4 leading-tight">
                            {article.title}
                        </h1>
                        <div className="text-gray-500 text-sm">
                            Published on {formattedDate}
                        </div>
                    </header>

                    {article.image && (
                        <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] mb-10 rounded-2xl overflow-hidden">
                            <Image
                                src={article.image.url}
                                alt={article.image.altText || article.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}

                    <div
                        className="prose prose-lg max-w-none text-gray-800 prose-headings:font-bold prose-a:text-blue-600 prose-img:rounded-xl"
                        dangerouslySetInnerHTML={{ __html: article.contentHtml }}
                    />
                </article>
            </div>
        </div>
    );
}
