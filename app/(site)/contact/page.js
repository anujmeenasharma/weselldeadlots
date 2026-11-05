import ContactClient from "@/components/Pages/Contact/ContactClient";
import { getContactPage } from "@/sanity/lib/content";
import { buildPageMetadata } from "@/sanity/lib/metadata";

export async function generateMetadata() {
  const content = await getContactPage();
  return buildPageMetadata(content?.seo, { path: "/contact" });
}

export default async function ContactPage() {
  const content = await getContactPage();
  return <ContactClient content={content} />;
}
