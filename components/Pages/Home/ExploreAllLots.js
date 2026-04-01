"use client";
import { useEffect, useState } from "react";
import ProductCard from "../../UiComponents/ProductCard";
import { fetchExploreLots } from "@/lib/shopify";

const ExploreAllLots = () => {
  const [products, setProducts] = useState([]);
  const [pageInfo, setPageInfo] = useState({ hasNextPage: false, endCursor: null });
  const [loading, setLoading] = useState(false);
  const [inventoryMap, setInventoryMap] = useState({});

  const batchFetchInventory = async (edges) => {
    const variantIds = edges
      .map(e => e.node?.variants?.edges?.[0]?.node?.id?.split('/').pop())
      .filter(Boolean);
    if (variantIds.length === 0) return;
    try {
      const res = await fetch('/api/inventory/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variantIds }),
      });
      const data = await res.json();
      setInventoryMap(prev => ({ ...prev, ...data.quantities }));
    } catch {}
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchExploreLots(25);
        setProducts(data.edges);
        setPageInfo(data.pageInfo);
        batchFetchInventory(data.edges);
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
      batchFetchInventory(data.edges);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative pt-[15vh] pb-20 px-4 md:px-[5vw] lg:px-[5vw]">
      <h1 className="text-4xl md:text-[5vw] lg:text-5xl xl:text-6xl text-center pb-10 md:pb-[6vw]">Explore All Lots</h1>
      <div className="flex flex-wrap gap-[4vw] lg:gap-[2vw] justify-center">
        {products.map((product, index) => {
          const variantId = product.node?.variants?.edges?.[0]?.node?.id?.split('/').pop();
          const qty = variantId ? inventoryMap[variantId] : undefined;
          return <ProductCard key={product.node?.id || index} product={product.node} exactQuantity={qty ?? null} />;
        })}
      </div>
      {pageInfo.hasNextPage && (
        <div className="mt-16 flex justify-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="border-2 border-black rounded-lg text-lg md:text-[1.8vw] lg:text-[1.2vw] font-bold py-3 px-10 md:py-[1.2vw] md:px-[4vw] hover:bg-black hover:text-white transition-colors disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  )
}

export default ExploreAllLots