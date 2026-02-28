"use client";
import { useEffect, useState } from "react";
import ProductCard from "../../UiComponents/ProductCard";
import { fetchExploreLots } from "@/lib/shopify";

const ExploreAllLots = () => {
  const [products, setProducts] = useState([]);
  const [pageInfo, setPageInfo] = useState({ hasNextPage: false, endCursor: null });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchExploreLots(25);
        setProducts(data.edges);
        setPageInfo(data.pageInfo);
      } catch (err) {
        console.error(err);
      }
    };
    getData();
  }, []);

  const loadMore = async () => {
    if (!pageInfo.hasNextPage || loading) return;

    setLoading(true);
    try {
      const data = await fetchExploreLots(25, pageInfo.endCursor);
      setProducts(prev => [...prev, ...data.edges]);
      setPageInfo(data.pageInfo);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative pt-[15vh] pb-20 px-4 md:px-20">
      <h1 className="text-4xl md:text-6xl text-center pb-10 md:pb-28">Explore All Lots</h1>
      <div className="flex flex-wrap gap-10 justify-center">
        {products.map((product, index) => (
          <ProductCard key={product.node?.id || index} product={product.node} />
        ))}
      </div>
      {pageInfo.hasNextPage && (
        <div className="mt-16 flex justify-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="border-2 border-black rounded-lg text-lg font-bold py-3 px-10 hover:bg-black hover:text-white transition-colors disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  )
}

export default ExploreAllLots