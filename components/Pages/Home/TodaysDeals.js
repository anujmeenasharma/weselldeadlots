"use client";
import ProductCarousel from "../../UiComponents/ProductCarousel";

// Products are now fetched server-side and passed as props — no useEffect needed
const TodaysDeals = ({ products = [] }) => {
  return (
    <div className="min-h-screen w-full relative pt-24 md:pt-[20vh] px-4 md:px-[5vw] lg:px-[5vw]">
      <h1 className="text-3xl md:text-[5vw] lg:text-4xl xl:text-5xl text-center pb-8 md:pb-[6vw] text-gray-800">Today's Deals</h1>
      <ProductCarousel products={products} />
    </div>
  )
}

export default TodaysDeals