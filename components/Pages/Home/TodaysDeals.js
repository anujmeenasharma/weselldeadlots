"use client";
import { useEffect, useState } from "react";
import ProductCarousel from "../../UiComponents/ProductCarousel";
import { fetchTodaysDeals } from "@/lib/shopify";

const TodaysDeals = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const deals = await fetchTodaysDeals();
        setProducts(deals);
      } catch (err) {
        console.error(err);
      }
    };
    getData();
  }, []);

  return (
    <div className="min-h-screen w-full relative pt-24 md:pt-[20vh] px-4 md:px-[5vw] lg:px-[5vw]">
      <h1 className="text-3xl md:text-[5vw] lg:text-4xl xl:text-5xl text-center pb-8 md:pb-[6vw] text-gray-800">Today's Deals</h1>
      <ProductCarousel products={products} />
    </div>
  )
}

export default TodaysDeals