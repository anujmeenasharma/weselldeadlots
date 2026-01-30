'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { ChevronDown, ChevronRight, ChevronLeft, Search } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';


const SHOPIFY_CONFIG = {
    storeUrl: "738eda.myshopify.com",
    accessToken: "f6558466e9d3ffd0edfeda79dedc938a",
    apiVersion: "2024-04",
};

const PRODUCTS_PER_PAGE = 25;

const CATEGORY_MAPPING = {
    "Electronic": [
        "Switch Gear",
        "Automation & Control Equipments",
        "Wires & Cables",
        "Switch & Sockets",
        "Electronics & Lighting"
    ],
    "Tools": [
        "Hand Tools",
        "Power Tools",
        "Cutting Tools",
        "Measuring Tools",
        "Fastening Tools"
    ],
    "Industrial": [
        "Machinery",
        "Bearings",
        "Hydraulic Components",
        "Motors",
        "Generators"
    ],
    "Construction": [
        "HVAC Systems",
        "Fire & Safety",
        "Building Materials",
        "Plumbing System",
        "Construction Tools & Equipments"
    ],
    "Technology": [
        "IT Equipments",
        "Batteries",
        "Networking Devices",
        "Data Storages"
    ],
    "Energy": [
        "Oil & Gas Equipments",
        "Marine Supplies",
        "Aerospace & Aircraft Materials"
    ],
    "Consumer": [
        "Garments",
        "Cosmetics & Personal Care",
        "Toys & Games",
        "Kids Essentials",
        "Footwear"
    ],
    "Scrap": []
};

function createCleanURL(text) {
    if (!text) return '';
    return text
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9\-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

async function shopifyFetch(query, variables = {}) {
    const response = await fetch(
        `https://${SHOPIFY_CONFIG.storeUrl}/api/${SHOPIFY_CONFIG.apiVersion}/graphql.json`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Storefront-Access-Token": SHOPIFY_CONFIG.accessToken,
                Accept: "application/json",
            },
            body: JSON.stringify({ query, variables }),
        }
    );

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.errors) {
        throw new Error(data.errors[0].message || "GraphQL Error");
    }
    return data;
}

const ProductCard = ({ product: { node } }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (!node) return null;

    const images = node.images?.edges?.map(e => e.node.url) || [];
    const imageAlt = node.images?.edges?.[0]?.node?.altText || node.title;
    const price = node.variants?.edges?.[0]?.node?.price?.amount || "0";
    const currency = node.variants?.edges?.[0]?.node?.price?.currencyCode || "AED";

    const getMetafield = (key) => {
        const field = node.metafields?.find(m => m && m.key === key);
        return field?.value;
    };

    const modelNo = getMetafield("model_no") || "N/A";
    const miniQuantity = getMetafield("mini_quantity") || "N/A";
    const isUnitKg = getMetafield("is_unit_kg") === "True";

    const productUrl = `/product.html?title=${createCleanURL(node.title)}`;

    const nextImage = (e) => {
        e.preventDefault();
        if (images.length > 0) {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }
    };

    const prevImage = (e) => {
        e.preventDefault();
        if (images.length > 0) {
            setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
        }
    };

    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex flex-col h-full group/card">
            <div className="relative h-48 sm:h-56 w-full bg-gray-50 rounded-xl overflow-hidden mb-4 group/image">
                <a href={productUrl} className="block w-full h-full relative">
                    <Image
                        src={images[currentImageIndex] || '/images/placeholder.jpg'}
                        alt={imageAlt}
                        fill
                        className="object-contain p-2 transition-transform duration-500 group-hover/image:scale-105"
                    />
                </a>

                {images.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1 rounded-full opacity-0 group-hover/image:opacity-100 transition-opacity z-10"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1 rounded-full opacity-0 group-hover/image:opacity-100 transition-opacity z-10"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </>
                )}
            </div>

            <div className="flex flex-col flex-grow">
                <a href={productUrl}>
                    <h3 className="font-bold text-gray-800 text-sm mb-3 line-clamp-2 min-h-[40px] hover:text-[#1392f9] transition-colors">
                        {node.title}
                    </h3>
                </a>

                <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-blue-50 text-blue-500 text-[10px] px-2 py-1 rounded-md font-medium whitespace-nowrap">
                        Qty: {miniQuantity} {isUnitKg ? 'KG' : 'Pcs'}
                    </span>
                    <span className="bg-blue-50 text-blue-500 text-[10px] px-2 py-1 rounded-md font-medium whitespace-nowrap">
                        Cond: {node.productType}
                    </span>
                    <span className="bg-blue-50 text-blue-500 text-[10px] px-2 py-1 rounded-md font-medium whitespace-nowrap">
                        Model: {modelNo}
                    </span>
                </div>

                <div className="mt-auto flex items-end justify-between gap-2">
                    <div className="text-gray-600 text-xs font-medium mb-1">
                        Dhs. <span className="text-xl font-bold text-black">{parseFloat(price).toFixed(0)}</span> {currency}
                    </div>
                    <a
                        href={`https://wa.me/+971552748974?text=Hello, I want to buy ${encodeURIComponent(node.title)} with model number ${encodeURIComponent(modelNo)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#1392f9] hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                        <FaWhatsapp size={14} />
                        WhatsApp Us
                    </a>
                </div>
            </div>
        </div>
    );
};

export default function CategoriesPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const params = useParams();

    const [allShopifyCollections, setAllShopifyCollections] = useState([]);
    const [currentProducts, setCurrentProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [displayLimit, setDisplayLimit] = useState(PRODUCTS_PER_PAGE);
    const [expandedGroups, setExpandedGroups] = useState({});
    const [error, setError] = useState(null);

    const categorySlug = params?.slug ? decodeURIComponent(params.slug) : searchParams.get('category');

    const fetchAllCollections = useCallback(async () => {
        try {
            let allCols = [];
            let hasNextPage = true;
            let cursor = null;

            while (hasNextPage) {
                const query = `
          query($cursor: String) {
            collections(first: 50, after: $cursor) {
              pageInfo { hasNextPage, endCursor }
              edges {
                node {
                  id, title, handle
                  products(first: 250) {
                    edges {
                      node {
                        id, title, vendor, productType, description
                        images(first: 5) { edges { node { url, altText } } }
                        variants(first: 1) { edges { node { price { amount, currencyCode } } } }
                        metafields(identifiers: [
                          {namespace: "custom", key: "model_no"},
                          {namespace: "custom", key: "mini_quantity"},
                          {namespace: "custom", key: "is_unit_kg"}
                        ]) { key, value }
                      }
                    }
                  }
                }
              }
            }
          }
        `;

                const data = await shopifyFetch(query, cursor ? { cursor } : {});
                allCols = [...allCols, ...data.data.collections.edges];
                hasNextPage = data.data.collections.pageInfo.hasNextPage;
                cursor = data.data.collections.pageInfo.endCursor;
            }
            return allCols;
        } catch (err) {
            console.error("Error fetching collections:", err);
            setError("Failed to load categories.");
            return [];
        }
    }, []);

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            const cols = await fetchAllCollections();
            setAllShopifyCollections(cols);

            if (!categorySlug) {
                const all = cols.flatMap(c => c.node.products.edges);
                const unique = Array.from(new Map(all.map(item => [item.node.id, item])).values());
                setCurrentProducts(unique);
            }
            setLoading(false);
        };
        init();
    }, [fetchAllCollections, categorySlug]);

    useEffect(() => {
        if (allShopifyCollections.length === 0) return;

        const applyFilters = async () => {
            setLoading(true);
            setDisplayLimit(PRODUCTS_PER_PAGE);

            if (categorySlug) {
                const targetCollection = allShopifyCollections.find(c => createCleanURL(c.node.title) === categorySlug);

                if (targetCollection) {
                    setCurrentProducts(targetCollection.node.products.edges);

                    for (const [group, items] of Object.entries(CATEGORY_MAPPING)) {
                        const match = items.some(item => createCleanURL(item) === categorySlug);
                        if (match) {
                            setExpandedGroups(prev => ({ ...prev, [group]: true }));
                            break;
                        }
                    }
                } else {
                    console.warn("Collection not found in Shopify:", categorySlug);
                    setCurrentProducts([]);
                }
            } else if (!loading) {
                const all = allShopifyCollections.flatMap(c => c.node.products.edges);
                const unique = Array.from(new Map(all.map(item => [item.node.id, item])).values());
                setCurrentProducts(unique);
            }
            setLoading(false);
        };

        applyFilters();

    }, [categorySlug, allShopifyCollections]);


    const handleGroupToggle = (group) => {
        setExpandedGroups(prev => ({
            ...prev,
            [group]: !prev[group]
        }));
    };

    const handleCategoryClick = (categoryName) => {
        const clean = createCleanURL(categoryName);
        router.push(`/categories/${clean}`);
    };

    const handleAllClick = () => {
        router.push('/categories');
        setExpandedGroups({});
    };

    const displayedProducts = currentProducts.slice(0, displayLimit);

    return (
        <div className="min-h-screen bg-gray-50 py-10 pt-[15vh] px-4 sm:px-6 lg:px-8 font-sans">
            <div className="w-full mx-auto">
                <div className="flex flex-col lg:flex-row gap-8">
                    <aside className="w-full lg:w-96 flex-shrink-0 sticky top-32 h-fit">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 px-1 flex justify-between items-center">
                            Categories
                            {categorySlug && (
                                <button onClick={handleAllClick} className="text-xs text-blue-500 hover:text-blue-700 font-normal">
                                    Reset
                                </button>
                            )}
                        </h2>

                        <div className="bg-white rounded-xl shadow-sm p-2 space-y-1">
                            <button
                                onClick={handleAllClick}
                                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${!categorySlug
                                    ? 'bg-[#1392f9] text-white'
                                    : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                All Products
                            </button>

                            {Object.entries(CATEGORY_MAPPING).map(([groupName, items]) => {
                                const isExpanded = expandedGroups[groupName];

                                const hasActiveChild = items.some(item => createCleanURL(item) === categorySlug);

                                return (
                                    <div key={groupName} className="flex flex-col">
                                        <button
                                            onClick={() => handleGroupToggle(groupName)}
                                            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${hasActiveChild ? 'text-blue-600 bg-blue-50/50' : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            <span>{groupName}</span>
                                            <ChevronDown
                                                size={14}
                                                className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                                            />
                                        </button>

                                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                            <div className="pl-4 pr-2 pb-2 space-y-1 bg-gray-50/50 rounded-b-lg">
                                                {items.map((item) => {
                                                    const isActive = createCleanURL(item) === categorySlug;
                                                    return (
                                                        <button
                                                            key={item}
                                                            onClick={() => handleCategoryClick(item)}
                                                            className={`w-full text-left px-4 py-2 rounded-md text-xs transition-colors ${isActive
                                                                ? 'bg-blue-100 text-blue-700 font-semibold'
                                                                : 'text-gray-500 hover:text-[#1392f9] hover:bg-white'
                                                                }`}
                                                        >
                                                            {item}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </aside>

                    <main className="flex-1">
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="bg-gray-200 h-96 rounded-2xl"></div>
                                ))}
                            </div>
                        ) : error ? (
                            <div className="text-center py-20">
                                <h3 className="text-lg text-red-500">{error}</h3>
                                <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Retry</button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {displayedProducts.length > 0 ? (
                                        displayedProducts.map((product) => (
                                            <ProductCard key={product.node.id} product={product} />
                                        ))
                                    ) : (
                                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
                                            <Search size={48} className="text-gray-300 mb-4" />
                                            <p className="text-lg">No products found for this category.</p>
                                            <p className="text-sm text-gray-400 mt-2">Try selecting another category or view all.</p>
                                        </div>
                                    )}
                                </div>

                                {displayedProducts.length < currentProducts.length && (
                                    <div className="mt-12 flex justify-center">
                                        <button
                                            onClick={() => setDisplayLimit(prev => prev + PRODUCTS_PER_PAGE)}
                                            className="bg-white border border-gray-200 text-gray-800 px-8 py-3 rounded-full text-sm font-bold tracking-wider hover:bg-gray-50 hover:shadow-lg transition-all"
                                        >
                                            LOAD MORE <span className="text-gray-400 font-normal ml-2">({displayedProducts.length} OF {currentProducts.length})</span>
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
