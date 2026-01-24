"use client";
import { useEffect, useState } from "react";
import ProductCarousel from "../../UiComponents/ProductCarousel";
import { fetchExploreLots } from "@/lib/shopify";

const ExploreAllLots = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const lots = await fetchExploreLots();
        setProducts(lots);
      } catch (err) {
        console.error(err);
      }
    };
    getData();
  }, []);

  return (
    <div className="min-h-screen w-full relative pt-[15vh] px-4 md:px-20">
      <h1 className="text-4xl md:text-6xl text-center pb-10 md:pb-28">Explore All Lots</h1>
      <ProductCarousel products={products} />
    </div>
  )
}

export default ExploreAllLots