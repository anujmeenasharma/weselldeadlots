'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { searchProducts } from '@/lib/shopify';
import Link from 'next/link';

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
        <>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Search Results</h1>
            <p className="text-gray-600 mb-8">
                {query ? `Showing results for "${query}"` : "Enter a search query"}
            </p>

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
                                <div className="p-4 flex flex-col flex-grow">
                                    <span className="text-xs text-gray-500 mb-1">{product.vendor}</span>
                                    <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2 flex-grow">{product.title}</h3>
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
        </>
    );
}

export default function SearchPage() {
    return (
        <div className="min-h-screen pt-32 px-6 md:px-12 lg:px-20 bg-gray-50 pb-20">
            <div className="max-w-7xl mx-auto">
                <Suspense fallback={<div className="flex justify-center items-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>}>
                    <SearchContent />
                </Suspense>
            </div>
        </div>
    );
}
