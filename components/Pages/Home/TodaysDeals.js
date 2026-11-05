"use client";
import ProductCarousel from "../../UiComponents/ProductCarousel";

// Products are fetched server-side from Shopify; the heading comes from Sanity.
const TodaysDeals = ({ products = [], heading }) => {
  return (
    <div className="min-h-screen w-full relative pt-24 md:pt-[20vh] px-4 md:px-[5vw] lg:px-[5vw]">
      {heading && (
        <h1 className="text-3xl md:text-[5vw] lg:text-4xl xl:text-5xl text-center pb-8 md:pb-[6vw] text-gray-800">{heading}</h1>
      )}
      <ProductCarousel products={products} />
    </div>
  )
}

export default TodaysDeals
