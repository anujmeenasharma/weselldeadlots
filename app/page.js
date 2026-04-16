import HomeClient from "./HomeClient";
import { fetchTodaysDeals, fetchExploreLots } from "@/lib/shopify";

// Revalidate the homepage every 10 minutes (ISR)
export const revalidate = 600;

export const metadata = {
  alternates: {
    canonical: "/",
  },
};

export default async function Page() {
  // Fetch data server-side — users see content immediately, no loading flash
  const [todaysDeals, exploreData] = await Promise.all([
    fetchTodaysDeals(),
    fetchExploreLots(25),
  ]);

  return (
    <HomeClient
      todaysDeals={todaysDeals}
      initialExploreLots={exploreData.edges}
      initialExplorePageInfo={exploreData.pageInfo}
    />
  );
}
