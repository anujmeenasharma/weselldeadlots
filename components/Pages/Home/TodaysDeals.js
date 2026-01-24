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
    <div className="min-h-screen w-full relative pt-[20vh] px-4 md:px-20">
      <h1 className="text-4xl md:text-6xl text-center pb-10 md:pb-28">Today's Deals</h1>
      <ProductCarousel products={products} />
    </div>
  )
}

export default TodaysDeals