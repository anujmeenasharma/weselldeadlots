'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { searchProducts } from '@/lib/shopify';
import Link from 'next/link';
import CategorySidebar, { CATEGORY_MAPPING, createCleanURL } from '@/components/Partials/CategorySidebar';

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q');

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            if (query) {
                setLoading(true);
                try {
                    const results = await searchProducts(query);
                    setProducts(results);
                } catch (error) {
                    console.error("Error fetching search results:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setProducts([]);
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar (Left side) */}
            <div className="w-full lg:w-80 xl:w-96 shrink-0 order-1 lg:order-1">
                <CategorySidebar initialCategorySlug={query || ''} />
            </div>

            {/* Main Content (Right side) */}
            <main className="flex-1 order-2 lg:order-2">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Search Results</h1>
                <p className="text-gray-600 mb-8">
                    {query ? `Showing results for "${query}"` : "Enter a search query"}
                </p>

                {(() => {
                    if (!query) return null;
                    const cleanQuery = createCleanURL(query);
                    const matches = [];

                    for (const [groupName, items] of Object.entries(CATEGORY_MAPPING)) {
                        const cleanGroup = createCleanURL(groupName);
                        // Only match if the query is a substantial part of the category (> 2 chars), or just use normal includes
                        if (cleanQuery.length > 2 && (cleanGroup.includes(cleanQuery) || cleanQuery.includes(cleanGroup))) {
                            if (!matches.find(m => m.name === groupName)) {
                                matches.push({ name: groupName, slug: cleanGroup });
                            }
                        }
                        for (const item of items) {
                            const cleanItem = createCleanURL(item);
                            if (cleanQuery.length > 2 && (cleanItem.includes(cleanQuery) || cleanQuery.includes(cleanItem))) {
                                if (!matches.find(m => m.name === item)) {
                                    matches.push({ name: item, slug: cleanItem });
                                }
                            }
                        }
                    }

                    if (matches.length > 0) {
                        return (
                            <div className="mb-8 p-5 bg-white rounded-xl shadow-sm border border-gray-100">
                                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Matching Categories</h2>
                                <div className="flex flex-wrap gap-2">
                                    {matches.map(cat => (
                                        <Link
                                            key={cat.slug}
                                            href={`/categories/${cat.slug}`}
                                            className="px-4 py-2 bg-blue-50 text-[#1392f9] hover:bg-[#1392f9] hover:text-white rounded-lg text-sm font-semibold transition-colors border border-blue-100 hover:border-[#1392f9]"
                                        >
                                            {cat.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        );
                    }
                    return null;
                })()}

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((item) => {
                            const product = item.node;
                            const price = product.variants.edges[0]?.node?.price;
                            const imageUrl = product.images.edges[0]?.node?.url || ''; // default empty

                            return (
                                <Link
                                    href={`/product/${product.handle}`}
                                    key={product.id}
                                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
                                >
                                    <div className="h-64 relative bg-gray-100 overflow-hidden">
                                        {imageUrl ? (
                                            <img
                                                src={imageUrl}
                                                alt={product.title}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                No Image
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4 flex flex-col grow">
                                        <span className="text-xs text-gray-500 mb-1">{product.vendor}</span>
                                        <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2 grow">{product.title}</h3>
                                        {price && (
                                            <p className="text-primary font-bold mt-auto">
                                                {price.currencyCode} {price.amount}
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : query ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">No products found</h2>
                        <p className="text-gray-500">Try adjusting your search or browse our categories.</p>
                        <Link
                            href="/"
                            className="inline-block mt-6 px-6 py-2 bg-primary text-white rounded-full hover:bg-blue-600 transition-colors"
                        >
                            Back to Home
                        </Link>
                    </div>
                ) : null}
            </main>
        </div>
    );
}

export default function SearchPage() {
    return (
        <div className="min-h-screen pt-32 px-4 sm:px-6 lg:px-8 bg-gray-50 pb-20 font-sans">
            <div className="max-w-[1920px] mx-auto">
                <Suspense fallback={
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                }>
                    <SearchContent />
                </Suspense>
            </div>
        </div>
    );
}
