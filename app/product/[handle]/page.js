
import { fetchProductByHandle, fetchProductRecommendations } from '@/lib/shopify';
import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/components/UiComponents/ProductCard';
import ProductGallery from './ProductGallery'; // We'll create this sub-component for cleanness

export async function generateMetadata({ params }) {
    const { handle } = await params;
    const product = await fetchProductByHandle(handle);
    if (!product) return { title: 'Product Not Found' };

    return {
        title: product.title,
        description: product.descriptionHtml?.replace(/<[^>]*>?/gm, '').substring(0, 160) || `Buy ${product.title} at We Sell Dead Lots`,
    };
}

export default async function ProductPage({ params }) {
    const { handle } = await params;
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

    // Extract Metafields
    const modelNo = product.metafields?.find(m => m?.key === "model_no")?.value || "N/A";
    const miniQuantity = product.metafields?.find(m => m?.key === "mini_quantity")?.value || "N/A";
    const isUnitKg = product.metafields?.find(m => m?.key === "is_unit_kg")?.value === "True";
    const unit = isUnitKg ? "KG" : "Pcs";
    const csvData = product.metafield?.reference;

    const price = product.variants?.edges[0]?.node?.price;
    const isAvailable = product.availableForSale;

    // WhatsApp Link
    const productUrl = `https://www.weselldeadlots.com/product/${handle}`;
    const whatsappMessage = `Hello, I want to buy ${product.title} with model number ${modelNo}. Here is the link of the product: ${productUrl}`;
    const whatsappLink = `https://wa.me/+971552748974?text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <div className="bg-white min-h-screen pb-20 pt-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Product Details Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                    {/* Left: Image Gallery */}
                    <div className="w-full">
                        <ProductGallery images={product.images?.edges?.map(e => e.node) || []} title={product.title} />
                    </div>

                    {/* Right: Product Info */}
                    <div className="flex flex-col space-y-6">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                            {product.title}
                        </h1>

                        <div className="space-y-2">
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Price:</p>
                            <h2 className="text-3xl font-bold text-gray-900">
                                {price ? `${price.amount} ${price.currencyCode}` : 'Price on Request'}
                            </h2>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Model No:</p>
                            <p className="text-lg font-medium text-gray-800">{modelNo}</p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Condition:</p>
                            <p className="text-lg font-medium text-gray-800">Used</p>
                            {/* Assuming 'Used' is static based on site name, or fetch from meta if exists */}
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Product Origin:</p>
                            <p className="text-lg font-medium text-gray-800">{product.vendor || "N/A"}</p>
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Product Description:</p>
                            <div
                                className="prose text-gray-600 max-w-none text-sm leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                            />
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Availability:</p>
                            <p className="text-lg font-medium text-gray-800">
                                {isAvailable ? "In Stock" : "Out of Stock"} (Min: {miniQuantity} {unit})
                            </p>
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

                        <div className="pt-6">
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block w-full sm:w-auto text-center bg-black text-white text-lg font-bold py-4 px-12 rounded-full hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                Chat With Us
                            </a>
                        </div>
                    </div>
                </div>

                {/* Similar Products Section */}
                {recommendations.length > 0 && (
                    <div className="border-t border-gray-200 pt-16">
                        <h2 className="text-3xl font-bold mb-10 text-center">Similar Products</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {recommendations.map((rec) => (
                                <ProductCard key={rec.id} product={rec} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
