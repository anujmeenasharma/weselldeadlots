import BlogListClient from "@/components/Pages/Blogs/BlogListClient";
import { getBlogPosts, getBlogSettings } from "@/sanity/lib/content";
import { buildPageMetadata } from "@/sanity/lib/metadata";
import { imageUrl } from "@/sanity/lib/image";

export async function generateMetadata() {
  const settings = await getBlogSettings();
  return buildPageMetadata(settings?.seo, { path: "/blogs" });
}

export default async function BlogsPage() {
  const [settings, posts] = await Promise.all([getBlogSettings(), getBlogPosts()]);

  // Normalise Sanity posts to the same shape as Shopify articles used by the list UI.
  const cmsPosts = posts.map((post) => ({
    node: {
      id: post._id,
      handle: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      category: post.category,
      publishedAt: post.publishedAt,
      image: post.mainImage ? { url: imageUrl(post.mainImage, { width: 800 }), altText: post.mainImage.alt } : null,
    },
  }));

  return <BlogListClient settings={settings} cmsPosts={cmsPosts} />;
}
