
import { fetchProductByHandle, fetchProductRecommendations } from '@/lib/shopify';

async function fetchAdminInventory(variantId) {
    const adminToken = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
    const storeUrl = process.env.NEXT_PUBLIC_SHOPIFY_STORE_URL;
    if (!adminToken || !storeUrl || !variantId) return null;

    try {
        const response = await fetch(`https://${storeUrl}/admin/api/2024-01/variants/${variantId}.json`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': adminToken,
            },
            cache: 'no-store'
        });
        if (!response.ok) return null;
        const data = await response.json();
        console.log(data)
        return data?.variant?.inventory_quantity ?? null;
    } catch {
        return null;
    }
}
import Image from 'next/image';
import Link from "@/components/AppLink";
import ProductCard from '@/components/UiComponents/ProductCard';
import ProductGallery from './ProductGallery';
import ProductReviews from '@/components/UiComponents/ProductReviews';
import { cookies } from "next/headers";

export async function generateMetadata({ params }) {
    const { handle } = await params;
    const product = await fetchProductByHandle(handle);
    if (!product) return { title: 'Product Not Found' };

    return {
        title: product.title,
        description: product.descriptionHtml?.replace(/<[^>]*>?/gm, '').substring(0, 160) || `Buy ${product.title} at We Sell Dead Lots`,
        alternates: {
            canonical: `/product/${handle}`,
        },
    };
}

export default async function ProductPage({ params }) {
    const { handle } = await params;
    const cookieStore = await cookies();
    const locale = cookieStore.get("NEXT_LOCALE")?.value || "en";
    
    const product = await fetchProductByHandle(handle);

    if (!product) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Product not found</h1>
                    <Link href="/" className="text-blue-600 hover:underline">
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    const recommendations = await fetchProductRecommendations(product.id);

    const modelNo = product.metafields?.find(m => m?.key === "model_no")?.value || "N/A";
    const miniQuantity = product.metafields?.find(m => m?.key === "mini_quantity")?.value || "N/A";
    const isUnitKg = product.metafields?.find(m => m?.key === "is_unit_kg")?.value === "True";
    const unit = isUnitKg ? "KG" : "Pcs";
    const csvData = product.metafield?.reference;

    const price = product.variants?.edges[0]?.node?.price;
    const variantGid = product.variants?.edges[0]?.node?.id;
    const variantId = variantGid ? variantGid.split("/").pop() : null;
    const exactQuantity = await fetchAdminInventory(variantId);
    
    const rawProductId = product.id.split("/").pop();
    const reviewsMetafield = product.metafields?.find(m => m?.key === "product_reviews")?.value;
    let initialReviews = [];
    if (reviewsMetafield) {
        try {
            initialReviews = JSON.parse(reviewsMetafield);
            if (!Array.isArray(initialReviews)) initialReviews = [];
        } catch (e) {
            console.error("Failed to parse reviews", e);
        }
    }

    const isAvailable = product.availableForSale;
    const productUrl = `https://www.weselldeadlots.com/product/${handle}`;
    const whatsappMessage = `Hello, I want to buy ${product.title} with model number ${modelNo}. Here is the link of the product: ${productUrl}`;
    const whatsappLink = `https://wa.me/+971552748974?text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <div className="bg-white min-h-screen pb-20 pt-32">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                    <div className="w-full">
                        <ProductGallery images={product.images?.edges?.map(e => e.node) || []} title={product.title} />
                    </div>

                    <div className="flex flex-col space-y-3">
                        <h1 className="text-4xl sm:text-4xl font-bold text-gray-900 leading-tight">
                            {product.title}
                        </h1>

                        <div className="space-y-2">
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Price:</p>
                            <h2 className="text-2xl font-bold text-gray-900">
                                {price ? `${price.amount} ${price.currencyCode}` : 'Price on Request'}
                            </h2>
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Availability:</p>
                            <h2 className="text-2xl font-bold text-gray-900">
                                {isAvailable ? (exactQuantity !== null ? `${exactQuantity} Available` : "In Stock") : "Out of Stock"} (Min: {miniQuantity} {unit})
                            </h2>
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Condition:</p>
                            <h2 className="text-2xl font-bold text-gray-900">Used</h2>
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Model No:</p>
                            <h2 className="text-2xl font-bold text-gray-900">{modelNo}</h2>
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Product Origin:</p>
                            <h2 className="text-2xl font-bold text-gray-900">{product.vendor || "N/A"}</h2>
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Product Description:</p>
                            <div
                                className="prose text-gray-600 max-w-none text-sm leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                            />
                        </div>

                        {csvData && (
                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Product Similar Type List</p>
                                <a
                                    href={csvData.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline hover:text-blue-800"
                                >
                                    Download CSV
                                </a>
                            </div>
                        )}

                        <div>
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full sm:w-auto text-center border-1 rounded-lg border-black text-lg font-bold py-4 px-12"
                            >
                                Chat With Us
                            </a>
                        </div>
                    </div>
                </div>

            </div>
            
            {/* Reviews Section */}
            <div className="border-t border-gray-200 mt-10">
                <ProductReviews productId={rawProductId} handle={handle} initialReviews={initialReviews} />
            </div>

            {recommendations.length > 0 && (
                <div className="border-t border-gray-200 pt-16">
                    <h2 className="text-3xl font-bold mb-10 text-center">Similar Products</h2>
                    <div className='flex flex-wrap gap-10 justify-center px-5 lg:px-0'>
                        {recommendations.map((rec) => (
                            <ProductCard key={rec.id} product={rec} />
                        ))}
                    </div>
                </div>
            )}
        </div>

    );
}
