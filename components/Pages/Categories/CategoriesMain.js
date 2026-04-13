'use client';

import React, { useState, useEffect, Suspense, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from "@/components/AppLink";
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { ChevronDown, ChevronRight, ChevronLeft, Search, Filter, X } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';


const SHOPIFY_CONFIG = {
    storeUrl: process.env.NEXT_PUBLIC_SHOPIFY_STORE_URL,
    accessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    apiVersion: process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || "2024-04",
};

const PRODUCTS_PER_PAGE = 25;

const CATEGORY_MAPPING = {
    "Building Material": {
        "HVAC System": [
            "Air Conditioning Unit",
            "Ducting & Duct Accessories",
            "Ventilation Fans",
            "HVAC Accessories"
        ],
        "Fire & Safety": [
            "Fire Extinguishers",
            "Fire Alarm Systems",
            "Smoke & Heat Detectors",
            "Fire Sprinkler System",
            "Personal Protective Equipment",
            "Other Fire Safety"
        ],
        "Sanitary / Plumbing System": [
            "PVC Pipes & Fittings",
            "Valves",
            "Water Pumps",
            "Miscellaneous"
        ],
        "Hardware": [
            "Abrasives"
        ]
    },
    "Electrical": {
        "Switchgear": [
            "Low Voltage",
            "High Voltage"
        ],
        "Automation & PLC": [
            "PLC",
            "HMI",
            "Sensors",
            "Drives",
            "Control Components"
        ],
        "Cables & Wires": [
            "Power Cable",
            "Cables",
            "Wires",
            "Communication Cables",
            "Accessories"
        ],
        "Switches & Sockets": [
            "Switches",
            "Sockets & Outlets",
            "Accessories"
        ],
        "Lighting": [
            "Indoor Lighting",
            "Outdoor Lighting",
            "Emergency & Safety",
            "Specialty Lighting"
        ],
        "Electronics": [
            "Kitchen Appliances",
            "Laundry Appliances",
            "Heating / Cooling Appliances",
            "Entertainment Appliances",
            "Personal Care Appliances",
            "Other Appliances"
        ]
    },
    "Tools": {
        "Power Tools": [
            "Drills",
            "Saw",
            "Other Power Tools"
        ],
        "Hand Tools": [
            "Cutting Tools",
            "Measuring Tools",
            "Miscellaneous Tools"
        ],
        "Power Tools Accessories": [
            "Accessories"
        ],
        "Other Tools": [
            "Safety & Utility"
        ]
    },
    "Industrial Equipment": {
        "Machinery": [
            "Manufacturing Machines",
            "Processing Machinery",
            "Packaging Machines",
            "Other Machinery"
        ],
        "Bearings": [
            "Ball Bearing",
            "Roller Bearing",
            "Mounted Bearing",
            "Specialty Bearings"
        ],
        "Hydraulic Components": [
            "Hydraulic Pump",
            "Hydraulic Valves",
            "Hydraulic Cylinders",
            "Hydraulic Accessories"
        ],
        "Motors": [
            "Electric Motors",
            "Precision Motors",
            "Specialized Motors"
        ],
        "Generators": [
            "Fuel Generators",
            "Portable Generators",
            "Industrial Generators",
            "Generator Components"
        ]
    },
    "Oil & Gas": {
        "Drilling Equipment": [
            "Drilling Tools",
            "Pipelines"
        ],
        "Valves & Flow Control": [
            "Industrial Valves"
        ],
        "Pumps & Compressors": [
            "Pumps",
            "Compressors"
        ],
        "Measurement & Instrumentation": [
            "Instrumentation"
        ]
    },
    "Aerospace & Aircraft Material": {
        "Aircraft Structural Material": [
            "Metals",
            "Composites"
        ],
        "Aircraft Fasteners": [
            "Fasteners"
        ],
        "Aircraft Electrical Components": [
            "Electrical Parts"
        ],
        "Aircraft Hydraulic System": [
            "Hydraulic Components"
        ],
        "Aircraft Maintenance Material": [
            "Maintenance Supplies"
        ]
    },
    "Marine": {
        "Marine Engine System": [
            "Main Engine",
            "Engine Components",
            "Cooling System",
            "Fuel System"
        ],
        "Marine Electrical System": [
            "Marine Batteries",
            "Navigational Lights",
            "Electrical Panels",
            "Marine Wiring"
        ],
        "Marine Navigation & Communication": [
            "GPS System",
            "Marine Radar",
            "Communication System",
            "Fish Finder"
        ],
        "Marine Safety Equipment": [
            "Life Saving Equipment",
            "Fire Safety",
            "Emergency Equipment",
            "Safety Gear"
        ],
        "Deck & Mooring Equipment": [
            "Anchoring Equipment",
            "Mooring Equipment",
            "Deck Hardware",
            "Marine Ropes & Cable"
        ]
    },
    "Computers & IT": {
        "Computers & Laptops": [
            "Desktop Computers",
            "Laptop Computers",
            "Workstations",
            "Mini Computers"
        ],
        "PC / Laptop Accessories": [
            "Input Devices",
            "Display Accessories",
            "External Devices",
            "Laptop Accessories"
        ],
        "Battery": [
            "Laptop Batteries",
            "UPS Battery",
            "CMOS Batteries",
            "Power Banks"
        ],
        "Networking Devices": [
            "Routers",
            "Network Switches",
            "Wireless Devices",
            "Network Accessories"
        ],
        "Data Storage": [
            "Internal Storage",
            "External Storage",
            "Flash Storage",
            "Backup Systems"
        ]
    },
    "Consumer Goods": {
        "Garments": [
            "Men's Clothing",
            "Women's Clothing",
            "Kids Clothing",
            "Seasonal Wear"
        ],
        "Cosmetics & Personal Care": [
            "Skin Care",
            "Hair Care",
            "Makeup Products",
            "Personal Hygiene"
        ],
        "Toys & Games": [
            "Educational Toys",
            "Action Toys",
            "Outdoor Toys",
            "Board Games"
        ],
        "Kids Essentials": [
            "Baby Care Products",
            "Feeding Products",
            "Baby Gear",
            "Baby Bedding"
        ],
        "Footwear": [
            "Men's Footwear",
            "Women's Footwear",
            "Kids Footwear",
            "Sports Footwear"
        ]
    }
};

const COLLECTION_ALIASES = {
    "electrical": "electronic",
    "switchgear": "switch-gear",
    "automation-and-plc": "automation-and-control-equipments",
    "cables-and-wires": "wires-and-cables",
    "switches-and-sockets": "switch-and-sockets",
    "lighting": "electronics-and-lighting",
    
    "industrial-equipment": "industrial",
    
    "building-material": "construction",
    "hvac-system": "hvac-systems",
    "sanitary-plumbing-system": "plumbing-system",
    "hardware": "construction-tools-and-equipments",
    
    "computers-and-it": "technology",
    "battery": "batteries",
    "data-storage": "data-storages",
    "pc-laptop-accessories": "it-equipments",
    
    "oil-and-gas": "oil-and-gas-equipments",
    "marine": "marine-supplies",
    "aerospace-and-aircraft-material": "aerospace-and-aircraft-materials",
    
    "consumer-goods": "consumer"
};

const lookupAlias = (slug) => COLLECTION_ALIASES[slug] || slug;

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

const ProductCard = ({ product: { node }, exactQuantity }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const router = useRouter();

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

    const productUrl = node.handle ? `/product/${node.handle}` : '#';

    const nextImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (images.length > 0) {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }
    };

    const prevImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (images.length > 0) {
            setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
        }
    };

    const getConditionStyle = (type) => {
        const t = type?.trim()?.toLowerCase() || "";
        if (t === "new" || t === "both used & new") return "bg-green-600 text-white";
        if (t === "new-open box" || t === "new - open box") return "bg-yellow-400 text-black";
        if (t === "new-without box" || t === "new - without box") return "bg-sky-500 text-white";
        if (t === "used" || t === "old" || t === "pre-owned") return "bg-red-600 text-white";
        return "bg-gray-800 text-white";
    };

    const getDisplayCondition = (type) => {
        if (type?.trim()?.toLowerCase() === "old") return "Pre-Owned";
        return type;
    };

    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex flex-col h-full group/card">
            <div className="relative h-48 sm:h-56 w-full bg-gray-50 rounded-xl overflow-hidden mb-4 group/image">
                <Link href={productUrl} className="block w-full h-full relative">
                    <Image
                        src={images[currentImageIndex] || '/images/placeholder.jpg'}
                        alt={imageAlt}
                        fill
                        className="object-contain p-2 transition-transform duration-500 group-hover/image:scale-105"
                    />
                </Link>
                {(node.productType && node.productType !== "N/A") && (
                    <div className={`absolute top-3 left-3 z-10 text-xs font-bold px-3 py-1 rounded shadow-md ${getConditionStyle(node.productType)}`}>
                        {getDisplayCondition(node.productType)}
                    </div>
                )}

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

            <div className="flex flex-col grow">
                <Link href={productUrl}>
                    <h3 className="font-bold text-gray-800 text-sm mb-3 line-clamp-2 min-h-[40px] hover:text-[#1392f9] transition-colors">
                        {node.title}
                    </h3>
                </Link>

                <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-blue-50 text-blue-500 text-[10px] px-2 py-1 rounded-md font-medium whitespace-nowrap">
                        Qty: {exactQuantity !== null ? exactQuantity : "Checking..."} {isUnitKg ? 'KG' : 'Pcs'}
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
    const [expandedGroups, setExpandedGroups] = useState({});
    const [error, setError] = useState(null);

    // Filter states
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedConditions, setSelectedConditions] = useState([]);
    const [selectedMaterials, setSelectedMaterials] = useState([]);
    
    // Store price range bounds. Use null initially to signify picking the dynamic max.
    const [priceRange, setPriceRange] = useState({ min: 0, max: null });

    const getCategoryUrl = (slug) => {
        if (!slug) return '/categories';
        
        for (const [majorGroup, mainObj] of Object.entries(CATEGORY_MAPPING)) {
            const cleanMajor = createCleanURL(majorGroup);
            if (cleanMajor === slug) return `/categories/${cleanMajor}`;
            
            for (const [mainGroup, subs] of Object.entries(mainObj)) {
                const cleanMain = createCleanURL(mainGroup);
                if (cleanMain === slug) return `/categories/${cleanMajor}/${cleanMain}`;
                
                if (subs.some(sub => createCleanURL(sub) === slug)) {
                    return `/categories/${cleanMajor}/${cleanMain}/${slug}`;
                }
            }
        }
        return `/categories/${slug}`;
    };

    const slugArray = params?.slug;
    let categorySlug = searchParams.get('category');
    let currentPage = parseInt(params?.page || '1', 10);

    if (Array.isArray(slugArray)) {
        if (slugArray.length >= 2 && slugArray[slugArray.length - 2] === 'page') {
            currentPage = parseInt(slugArray[slugArray.length - 1], 10) || 1;
            const catIndex = slugArray.length - 3;
            if (catIndex >= 0) {
                categorySlug = decodeURIComponent(slugArray[catIndex]);
            }
        } else {
            categorySlug = decodeURIComponent(slugArray[slugArray.length - 1]);
        }
    } else if (typeof slugArray === 'string') {
        categorySlug = decodeURIComponent(slugArray);
    }

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
                        id, title, handle, vendor, productType, description
                        images(first: 5) { edges { node { url, altText } } }
                        variants(first: 1) { edges { node { id, price { amount, currencyCode } } } }
                        tags
                        metafields(identifiers: [
                          {namespace: "custom", key: "model_no"},
                          {namespace: "custom", key: "mini_quantity"},
                          {namespace: "custom", key: "is_unit_kg"},
                          {namespace: "custom", key: "material"}
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

            if (categorySlug) {
                // Expanding the groups regardless of whether product collection exists so it matches route
                let foundGroup = false;
                let activeMainCategory = null;
                let activeMajorCategory = null;
                
                for (const [majorGroup, mainObj] of Object.entries(CATEGORY_MAPPING)) {
                    const cleanMajor = createCleanURL(majorGroup);
                    if (cleanMajor === categorySlug) {
                        setExpandedGroups(prev => ({ ...prev, [majorGroup]: true }));
                        activeMajorCategory = majorGroup;
                        foundGroup = true;
                        break;
                    }
                    
                    for (const [mainGroup, subs] of Object.entries(mainObj)) {
                        const cleanMain = createCleanURL(mainGroup);
                        if (cleanMain === categorySlug) {
                            setExpandedGroups(prev => ({ ...prev, [majorGroup]: true, [`${majorGroup}-${mainGroup}`]: true }));
                            activeMainCategory = mainGroup;
                            activeMajorCategory = majorGroup;
                            foundGroup = true;
                            break;
                        }
                        if (subs.some(sub => createCleanURL(sub) === categorySlug)) {
                            setExpandedGroups(prev => ({ ...prev, [majorGroup]: true, [`${majorGroup}-${mainGroup}`]: true }));
                            activeMainCategory = mainGroup;
                            activeMajorCategory = majorGroup;
                            foundGroup = true;
                            break;
                        }
                    }
                    if (foundGroup) break;
                }

                const actualSearchSlug = lookupAlias(categorySlug);
                let targetCollection = allShopifyCollections.find(c => createCleanURL(c.node.title) === actualSearchSlug);
                let aggregatedProducts = [];

                if (targetCollection && targetCollection.node.products.edges.length > 0) {
                    aggregatedProducts = targetCollection.node.products.edges;
                } else if (activeMainCategory) {
                    // If 3rd layer is empty or not found, fallback to the Main Category (2nd layer)
                    const mainSearchSlug = lookupAlias(createCleanURL(activeMainCategory));
                    const mainCollection = allShopifyCollections.find(c => createCleanURL(c.node.title) === mainSearchSlug);
                    if (mainCollection && mainCollection.node.products.edges.length > 0) {
                        aggregatedProducts = mainCollection.node.products.edges;
                    }
                } else if (activeMajorCategory) {
                    // If 1st layer is empty or not found, aggregate products from ALL its 2nd and 3rd layer subcategories
                    const subNames = [];
                    const mainObj = CATEGORY_MAPPING[activeMajorCategory];
                    if (mainObj) {
                        for (const [mainGroup, subs] of Object.entries(mainObj)) {
                            subNames.push(createCleanURL(mainGroup));
                            subs.forEach(s => subNames.push(createCleanURL(s)));
                        }
                    }
                    
                    const mappedSubNames = subNames.map(lookupAlias);
                    const matchingCollections = allShopifyCollections.filter(c => mappedSubNames.includes(createCleanURL(c.node.title)));
                    const allProducts = matchingCollections.flatMap(c => c.node.products.edges);
                    
                    // Remove duplicates
                    const uniqueProductsMap = new Map();
                    for (const p of allProducts) {
                        uniqueProductsMap.set(p.node.id, p);
                    }
                    aggregatedProducts = Array.from(uniqueProductsMap.values());
                }

                if (aggregatedProducts.length > 0) {
                    setCurrentProducts(aggregatedProducts);
                    
                    const maxP = Math.max(...aggregatedProducts.map(p => parseFloat(p.node.variants?.edges?.[0]?.node?.price?.amount || 0)), 100);
                    setPriceRange({ min: 0, max: maxP });
                } else {
                    console.warn("Collection not found in Shopify or is empty:", categorySlug);
                    setCurrentProducts([]);
                }
            } else if (!loading) {
                const all = allShopifyCollections.flatMap(c => c.node.products.edges);
                const unique = Array.from(new Map(all.map(item => [item.node.id, item])).values());
                setCurrentProducts(unique);

                const maxP = Math.max(...unique.map(p => parseFloat(p.node.variants?.edges?.[0]?.node?.price?.amount || 0)), 100);
                setPriceRange({ min: 0, max: maxP });
            }
            setLoading(false);
        };

        applyFilters();

    }, [categorySlug, allShopifyCollections]);

    // Handle filter UI changes
    const toggleFilter = (setState, value) => {
        setState(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
        // Reset to page 1 on filter
        if (currentPage !== 1) {
            router.push(getCategoryUrl(categorySlug));
        }
    };

    // Derived unique filter options based on current category products
    const availableBrands = Array.from(new Set(currentProducts.map(p => p.node.vendor).filter(Boolean)));
    const availableConditions = Array.from(new Set(currentProducts.map(p => p.node.productType).filter(Boolean)));
    
    // Extract materials from metafields and valid tags (those not starting with #)
    const availableMaterials = Array.from(new Set(currentProducts.flatMap(p => {
        const materialMeta = p.node.metafields?.find(m => m?.key === 'material')?.value;
        const validTags = (p.node.tags || []).filter(tag => !tag.startsWith('#'));
        
        if (materialMeta) {
            return [materialMeta, ...validTags];
        }
        return validTags;
    }).filter(Boolean)));

    // Calculate max price from available products
    const maxAvailablePrice = Math.max(...currentProducts.map(p => parseFloat(p.node.variants?.edges?.[0]?.node?.price?.amount || 0)), 100);
    const safeMax = priceRange.max === null ? maxAvailablePrice : priceRange.max;

    // Apply active filters on top of category products
    const filteredProducts = currentProducts.filter(item => {
        const node = item.node;
        const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(node.vendor);
        const conditionMatch = selectedConditions.length === 0 || selectedConditions.includes(node.productType);
        
        let materialMatch = true;
        if (selectedMaterials.length > 0) {
            const materialMeta = node.metafields?.find(m => m?.key === 'material')?.value;
            const validTags = (node.tags || []).filter(tag => !tag.startsWith('#'));
            
            const itemMaterials = materialMeta ? [materialMeta, ...validTags] : validTags;
            materialMatch = selectedMaterials.some(m => itemMaterials.includes(m));
        }

        let priceMatch = true;
        const price = parseFloat(node.variants?.edges?.[0]?.node?.price?.amount || 0);

        // Filter by the selected range bounds
        if (price < priceRange.min || price > safeMax) {
            priceMatch = false;
        }

        return brandMatch && conditionMatch && materialMatch && priceMatch;
    });


    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [categorySlug]);

    const handleGroupToggle = (group) => {
        setExpandedGroups(prev => ({
            ...prev,
            [group]: !prev[group]
        }));
    };

    const handleCategoryClick = (categoryName) => {
        const clean = createCleanURL(categoryName);
        router.push(getCategoryUrl(clean));
    };

    const handleAllClick = () => {
        router.push('/categories');
        setExpandedGroups({});
    };

    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    const displayedProducts = filteredProducts.slice(startIndex, endIndex);
    const [inventoryMap, setInventoryMap] = useState({});

    // Force scroll libraries like Lenis to re-calculate document height after DOM changes
    useEffect(() => {
        if (!loading) {
            const timer = setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            }, 150);
            return () => clearTimeout(timer);
        }
    }, [loading, displayedProducts.length]);

    // Use variant IDs string as dependency to avoid infinite rendering loop
    const variantIdsString = useMemo(() => {
        return displayedProducts
            .map(p => p.node.variants?.edges?.[0]?.node?.id?.split('/').pop())
            .filter(Boolean)
            .join(',');
    }, [displayedProducts]);

    useEffect(() => {
        if (!variantIdsString) return;
        
        const variantIds = variantIdsString.split(',');
        
        fetch('/api/inventory/batch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ variantIds }),
        })
            .then(r => r.json())
            .then(data => setInventoryMap(prev => ({ ...prev, ...data.quantities })))
            .catch(() => {});
    }, [variantIdsString]);
    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;

        const baseUrl = getCategoryUrl(categorySlug);
        let pathname = newPage === 1 ? baseUrl : (baseUrl === '/categories' ? `/categories/page/${newPage}` : `${baseUrl}/page/${newPage}`);

        router.push(pathname);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getPageNumbers = () => {
        const pages = [];
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);

        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 pt-28 lg:pt-[15vh] px-4 sm:px-6 lg:px-8 font-sans">
            <div className="w-full max-w-[1920px] mx-auto">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Mobile Category Toggle */}
                    <button
                        className="lg:hidden w-full bg-white p-4 rounded-xl shadow-sm text-left font-bold text-gray-800 flex justify-between items-center"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        <span>{categorySlug ? 'Filtered Categories' : 'Browse Categories'}</span>
                        <ChevronDown className={`transition-transform ${isSidebarOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <aside className={`w-full lg:w-80 xl:w-96 shrink-0 lg:sticky lg:top-32 h-fit transition-all duration-300 ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>
                        <div className="lg:hidden mb-4"></div> {/* Spacer for mobile expansion */}

                        <div className="hidden lg:flex justify-between items-center mb-6 px-1">
                            <h2 className="text-xl font-bold text-gray-800">Categories</h2>
                            {categorySlug && (
                                <button onClick={handleAllClick} className="text-xs text-blue-500 hover:text-blue-700 font-normal">
                                    Reset
                                </button>
                            )}
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-2 space-y-1">
                            <button
                                onClick={handleAllClick}
                                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${!categorySlug
                                    ? 'bg-[#1392f9] text-white'
                                    : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                All Products
                            </button>

                            {Object.entries(CATEGORY_MAPPING).map(([majorGroup, mainObj]) => {
                                const isMajorExpanded = expandedGroups[majorGroup];
                                const isMajorActive = createCleanURL(majorGroup) === categorySlug;
                                
                                let hasActiveChild = false;
                                for (const [mainGroup, subs] of Object.entries(mainObj)) {
                                    if (createCleanURL(mainGroup) === categorySlug || subs.some(sub => createCleanURL(sub) === categorySlug)) {
                                        hasActiveChild = true;
                                        break;
                                    }
                                }

                                return (
                                    <div key={majorGroup} className="flex flex-col">
                                        <div
                                            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-bold transition-colors cursor-pointer ${isMajorActive || hasActiveChild ? 'text-blue-600 bg-blue-50/50' : 'text-gray-800 hover:bg-gray-50'}`}
                                            onClick={() => handleGroupToggle(majorGroup)}
                                        >
                                            <span onClick={(e) => { e.stopPropagation(); handleCategoryClick(majorGroup); }} className="hover:underline flex-grow text-left">{majorGroup}</span>
                                            <ChevronDown
                                                size={16}
                                                className={`transition-transform duration-200 ${isMajorExpanded ? 'rotate-180' : ''}`}
                                            />
                                        </div>

                                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isMajorExpanded ? 'max-h-[1500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                            <div className="pl-4 pr-2 pb-2 space-y-1 bg-gray-50/30 rounded-b-lg">
                                                {Object.entries(mainObj).map(([mainGroup, subs]) => {
                                                    const mainKey = `${majorGroup}-${mainGroup}`;
                                                    const isMainExpanded = expandedGroups[mainKey];
                                                    const isMainActive = createCleanURL(mainGroup) === categorySlug;
                                                    const hasActiveSub = subs.some(sub => createCleanURL(sub) === categorySlug);

                                                    return (
                                                        <div key={mainKey} className="flex flex-col mt-1">
                                                            <div
                                                                className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${isMainActive || hasActiveSub ? 'text-blue-600 bg-blue-100/50' : 'text-gray-600 hover:bg-white'}`}
                                                                onClick={() => handleGroupToggle(mainKey)}
                                                            >
                                                                <span onClick={(e) => { e.stopPropagation(); handleCategoryClick(mainGroup); }} className="hover:underline flex-grow text-left">{mainGroup}</span>
                                                                {subs.length > 0 && (
                                                                    <ChevronDown
                                                                        size={14}
                                                                        className={`transition-transform duration-200 ${isMainExpanded ? 'rotate-180' : ''}`}
                                                                    />
                                                                )}
                                                            </div>

                                                            {subs.length > 0 && (
                                                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isMainExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                                                    <div className="pl-6 pr-2 py-1 space-y-1">
                                                                        {subs.map((sub) => {
                                                                            const isSubActive = createCleanURL(sub) === categorySlug;
                                                                            return (
                                                                                <button
                                                                                    key={sub}
                                                                                    onClick={() => handleCategoryClick(sub)}
                                                                                    className={`w-full text-left px-4 py-1.5 rounded-md text-xs transition-colors ${isSubActive
                                                                                        ? 'bg-blue-100 text-blue-700 font-bold'
                                                                                        : 'text-gray-500 hover:text-[#1392f9] hover:bg-gray-100'
                                                                                        }`}
                                                                                >
                                                                                    {sub}
                                                                                </button>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
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
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                                {categorySlug ? categorySlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'All Products'}
                            </h1>
                            {currentProducts.length > 0 && (
                                <button
                                    onClick={() => setIsFilterSidebarOpen(true)}
                                    className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"
                                >
                                    <Filter size={18} />
                                    Filters
                                </button>
                            )}
                        </div>
                        
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
                                        displayedProducts.map((product) => {
                                            const variantId = product.node.variants?.edges?.[0]?.node?.id?.split('/').pop();
                                            const qty = variantId != null ? inventoryMap[variantId] : undefined;
                                            return <ProductCard key={product.node.id} product={product} exactQuantity={qty ?? null} />;
                                        })
                                    ) : (
                                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
                                            <Search size={48} className="text-gray-300 mb-4" />
                                            <p className="text-lg">No products found for this category.</p>
                                            <p className="text-sm text-gray-400 mt-2">Try selecting another category or view all.</p>
                                        </div>
                                    )}
                                </div>

                                {totalPages > 1 && (
                                    <div className="mt-12 flex justify-center items-center space-x-2">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="p-2 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>

                                        {getPageNumbers().map(page => (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`w-10 h-10 rounded-full font-semibold transition-all ${currentPage === page
                                                    ? 'bg-blue-600 text-white shadow-md'
                                                    : 'text-gray-600 hover:bg-gray-100'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="p-2 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>

            {/* Right side filter sidebar overlay */}
            <div 
                className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ${isFilterSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
                onClick={() => setIsFilterSidebarOpen(false)} 
            />

            {/* Right side filter sidebar */}
            <div className={`fixed top-0 right-0 h-full w-[85%] sm:w-96 bg-white z-50 shadow-2xl transition-transform duration-300 transform overflow-y-auto ${isFilterSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <h3 className="font-bold text-gray-800 text-xl">Filters</h3>
                        <button onClick={() => setIsFilterSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-8">
                        {/* Price Filter */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="text-sm font-semibold text-gray-700">Price Range (AED)</h4>
                                <span className="text-sm font-bold text-[#1392f9]">{priceRange.min} - {safeMax}</span>
                            </div>
                            
                            <div className="relative pt-1 pb-2 h-6">
                                {/* Track Background */}
                                <div className="absolute top-1/2 -translate-y-1/2 w-full h-1.5 bg-gray-200 rounded-lg" />
                                
                                {/* Active Track */}
                                <div 
                                    className="absolute top-1/2 -translate-y-1/2 h-1.5 bg-[#1392f9] rounded-lg pointer-events-none"
                                    style={{
                                        left: `${(priceRange.min / maxAvailablePrice) * 100}%`,
                                        right: `${100 - (safeMax / maxAvailablePrice) * 100}%`
                                    }}
                                />

                                {/* Min Thumb */}
                                <input
                                    type="range"
                                    min="0"
                                    max={maxAvailablePrice}
                                    value={priceRange.min}
                                    onChange={(e) => {
                                        const val = Math.min(Number(e.target.value), safeMax - 1);
                                        setPriceRange(prev => ({ ...prev, min: val }));
                                        if (currentPage !== 1) router.push(getCategoryUrl(categorySlug));
                                    }}
                                    className="absolute top-1/2 -translate-y-1/2 w-full h-1.5 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-[#1392f9] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-[#1392f9] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer z-10"
                                />

                                {/* Max Thumb */}
                                <input
                                    type="range"
                                    min="0"
                                    max={maxAvailablePrice}
                                    value={safeMax}
                                    onChange={(e) => {
                                        const val = Math.max(Number(e.target.value), priceRange.min + 1);
                                        setPriceRange(prev => ({ ...prev, max: val }));
                                        if (currentPage !== 1) router.push(getCategoryUrl(categorySlug));
                                    }}
                                    className="absolute top-1/2 -translate-y-1/2 w-full h-1.5 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-[#1392f9] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-[#1392f9] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer z-20"
                                />
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-4 font-medium">
                                <span>0 AED</span>
                                <span>{maxAvailablePrice} AED</span>
                            </div>
                        </div>

                        {/* Condition Filter */}
                        {availableConditions.length > 0 && (
                            <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-3">Condition</h4>
                                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                                    {availableConditions.map(cond => (
                                        <label key={cond} className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={selectedConditions.includes(cond)}
                                                onChange={() => toggleFilter(setSelectedConditions, cond)}
                                                className="rounded text-[#1392f9] focus:ring-[#1392f9] w-4 h-4 cursor-pointer"
                                            />
                                            <span className="text-sm text-gray-600 group-hover:text-gray-900">{cond}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Brand / Vendor Filter */}
                        {availableBrands.length > 0 && (
                            <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-3">Brand</h4>
                                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                                    {availableBrands.map(brand => (
                                        <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={selectedBrands.includes(brand)}
                                                onChange={() => toggleFilter(setSelectedBrands, brand)}
                                                className="rounded text-[#1392f9] focus:ring-[#1392f9] w-4 h-4 cursor-pointer"
                                            />
                                            <span className="text-sm text-gray-600 group-hover:text-gray-900">{brand}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Material Filter */}
                        {availableMaterials.length > 0 && (
                            <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-3">Material</h4>
                                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                                    {availableMaterials.map(mat => (
                                        <label key={mat} className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={selectedMaterials.includes(mat)}
                                                onChange={() => toggleFilter(setSelectedMaterials, mat)}
                                                className="rounded text-[#1392f9] focus:ring-[#1392f9] w-4 h-4 cursor-pointer"
                                            />
                                            <span className="text-sm text-gray-600 group-hover:text-gray-900">{mat}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Custom scrollbar styles if not available, can rely on default but adding class as indicator */}
        </div>
    );
}
