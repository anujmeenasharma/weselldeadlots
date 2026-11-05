import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * Sanity webhook → on-demand revalidation.
 * Configure in sanity.io/manage → API → Webhooks:
 *   URL:        https://<your-domain>/api/revalidate
 *   Trigger on: Create, Update, Delete
 *   Projection: {_type, "slug": slug.current}
 *   Secret:     same value as SANITY_REVALIDATE_SECRET
 */
export async function POST(req) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ message: "SANITY_REVALIDATE_SECRET is not set" }, { status: 500 });
  }

  try {
    const { isValidSignature, body } = await parseBody(req, secret, true);
    if (!isValidSignature) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
    }
    if (!body?._type || typeof body._type !== "string") {
      return NextResponse.json({ message: "Missing _type" }, { status: 400 });
    }

    // Expire immediately so the next visitor gets fresh content (handles publish, unpublish,
    // delete and slug changes — list queries are tagged by type, single docs by type:slug).
    const tags = [body._type];
    if (typeof body.slug === "string" && body.slug) tags.push(`${body._type}:${body.slug}`);
    tags.forEach((tag) => revalidateTag(tag, { expire: 0 }));

    // Sitemap lists pages and posts.
    if (body._type === "page" || body._type === "blogPost") revalidatePath("/sitemap.xml");

    return NextResponse.json({ revalidated: true, tags, now: Date.now() });
  } catch (error) {
    console.error("[sanity] revalidate webhook failed:", error);
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
  }
}
