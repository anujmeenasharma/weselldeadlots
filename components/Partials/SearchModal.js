'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Search } from 'lucide-react';
import Link from "@/components/AppLink";
import { searchProducts } from '@/lib/shopify';

const SearchModal = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Focus input when modal opens
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            document.body.style.overflow = 'unset';
            setQuery('');
            setResults([]);
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Debounced Search Effect
    useEffect(() => {
        const fetchResults = async () => {
            if (!query.trim()) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                const data = await searchProducts(query);
                setResults(data);
            } catch (error) {
                console.error("Search failed:", error);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(() => {
            fetchResults();
        }, 400); // 400ms debounce

        return () => clearTimeout(timer);
    }, [query]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
            {/* Backdrop overlay */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Search Modal Content */}
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">

                {/* Header section */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">Search Products</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-700 transition-colors p-1"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Input section */}
                <div className="p-4 md:p-6 pb-2">
                    <div className="relative">
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search by name, category, or vendor..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full pl-4 pr-12 py-3 rounded-xl border-2 border-primary focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all text-gray-800 text-lg"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                            {loading ? (
                                <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
                            ) : (
                                <Search size={22} />
                            )}
                        </div>
                    </div>
                </div>

                {/* Results / Navigation section */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 pt-2">

                    {query.trim() === '' ? (
                        <div className="mt-4">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                Categories
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {['Electrical', 'Tools & Equipments', 'Industrial Equipments', 'Construction'].map(cat => (
                                    <span key={cat} onClick={() => setQuery(cat)} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-sm cursor-pointer transition-colors">
                                        {cat}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="mt-2">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                                Products {results.length > 0 && `(${results.length})`}
                            </h3>

                            <div className="space-y-2">
                                {results.length > 0 ? (
                                    results.map((item) => {
                                        const product = item.node;
                                        const priceNode = product.variants?.edges?.[0]?.node?.price;
                                        const imageUrl = product.images?.edges?.[0]?.node?.url;
                                        const modelNo = product.metafields?.find(m => m?.key === 'model_no')?.value;

                                        return (
                                            <Link
                                                href={`/product/${product.handle}`}
                                                key={product.id}
                                                onClick={onClose}
                                                className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                                            >
                                                {/* Img Box */}
                                                <div className="h-16 w-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center border border-gray-200">
                                                    {imageUrl ? (
                                                        <img src={imageUrl} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                                    ) : (
                                                        <span className="text-xs text-gray-400">No Img</span>
                                                    )}
                                                </div>

                                                {/* Details */}
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-semibold text-gray-800 truncate">{product.title}</h4>
                                                    <p className="text-xs text-gray-500 mt-0.5 truncate">{product.vendor}</p>
                                                    <div className="flex items-center gap-1.5 mt-1 text-[11px] text-gray-400">
                                                        {modelNo && <span>Model: {modelNo}</span>}
                                                        {modelNo && priceNode && <span>•</span>}
                                                        {priceNode && (
                                                            <span className="font-medium text-gray-600">
                                                                {priceNode.currencyCode} {priceNode.amount}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </Link>
                                        )
                                    })
                                ) : !loading ? (
                                    <div className="py-8 text-center text-gray-500">
                                        <p className="mb-2">No products found for "{query}"</p>
                                        <p className="text-sm text-gray-400">Try searching for generic terms or checking spelling.</p>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer info (optional matching design style) */}
                {query.trim() !== '' && results.length > 0 && (
                    <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                        <Link
                            href={`/search?q=${encodeURIComponent(query)}`}
                            onClick={onClose}
                            className="text-sm font-medium text-primary hover:text-blue-700 transition-colors"
                        >
                            View all results
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchModal;
