import SellWithUsClient from "@/components/Pages/SellWithUs/SellWithUsClient";
import { getSellPage } from "@/sanity/lib/content";
import { buildPageMetadata } from "@/sanity/lib/metadata";

export async function generateMetadata() {
  const content = await getSellPage();
  return buildPageMetadata(content?.seo, { path: "/sell-with-us" });
}

export default async function SellWithUsPage() {
  const content = await getSellPage();
  return <SellWithUsClient content={content} />;
}
