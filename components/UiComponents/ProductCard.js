"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ProductCard = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!product) return null;

  const { title, vendor, productType, variants, images, metafields, id } = product;
  const price = variants?.edges[0]?.node?.price?.amount || "0";
  const allImages = images?.edges?.map(e => e.node.url) || [];
  const imageUrl = allImages[currentImageIndex] || "/images/placeholder.webp";
  const altText = images?.edges?.[0]?.node?.altText || title;

  const modelNo = metafields?.find(m => m?.key === "model_no")?.value || "N/A";
  const miniQuantity = metafields?.find(m => m?.key === "mini_quantity")?.value || "N/A";
  const isUnitKg = metafields?.find(m => m?.key === "is_unit_kg")?.value === "True";
  const unit = isUnitKg ? "KG" : "Pcs";

  const productId = id?.split("/").pop();
  const productUrl = typeof window !== 'undefined' ? `${window.location.origin}/product.html?id=${productId}` : "#";
  const whatsappMessage = `Hello, I want to buy ${title} with model number ${modelNo}. Here is the link of the product: ${productUrl}`;
  const whatsappLink = `https://wa.me/+971552748974?text=${encodeURIComponent(whatsappMessage)}`;

  const handle = product.handle;

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (allImages.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    }
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (allImages.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    }
  };

  return (
    <div className="h-fit w-full sm:w-[45vw] md:w-[27vw] lg:w-[20.5vw] drop-shadow-xl bg-white rounded-2xl overflow-hidden p-[3vw] md:p-[1.5vw] flex flex-col justify-between">
      <div className="block h-[25vh] w-full rounded-xl overflow-hidden relative group/image">
        <Link href={handle ? `/product/${handle}` : '#'} className="block w-full h-full relative">
          <Image
            src={imageUrl}
            fill
            alt={altText}
            className="object-cover transition-transform duration-500 group-hover/image:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>

        {allImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1 rounded-full opacity-0 group-hover/image:opacity-100 transition-opacity z-10 cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1 rounded-full opacity-0 group-hover/image:opacity-100 transition-opacity z-10 cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>
      <div className="space-y-3 pt-5 pb-3">
        <Link href={handle ? `/product/${handle}` : '#'} className="block">
          <h1 className="font-semibold line-clamp-2 min-h-[3rem] hover:text-blue-600 transition-colors" title={title}>{title}</h1>
        </Link>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="px-3 py-1 bg-blue-50 text-blue-500 rounded-full">Qty: {miniQuantity} {unit}</span>
          <span className="px-3 py-1 bg-gray-50 text-gray-500 rounded-full">{vendor}</span>
          {modelNo !== "N/A" && <span className="px-3 py-1 bg-purple-50 text-purple-500 rounded-full">Model: {modelNo}</span>}
        </div>
        <div className="flex justify-between items-center pt-2">
          <p className="text-sm font-medium">Dhs. <span className="text-lg font-bold">{price}</span> AED</p>
          <Link href={whatsappLink} target="_blank" className="bg-primary text-white px-4 py-2 font-medium text-sm rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity">
            <FaWhatsapp /> Whatsapp us
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ProductCard