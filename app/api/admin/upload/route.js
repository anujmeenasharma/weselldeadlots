import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin/auth";
import { getWriteClient } from "@/lib/admin/sanityWrite";

const LIMITS = {
  image: { types: /^image\/(jpeg|png|webp|gif|svg\+xml|avif|x-icon|vnd\.microsoft\.icon)$/, maxBytes: 15 * 1024 * 1024 },
  file: { types: /^video\/(mp4|webm|quicktime)$/, maxBytes: 100 * 1024 * 1024 },
};

/** Uploads an image or video to Sanity's asset library. Admin session required. */
export async function POST(request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });

  try {
    const form = await request.formData();
    const file = form.get("file");
    const kind = form.get("kind") === "file" ? "file" : "image";
    const limit = LIMITS[kind];

    if (!file || typeof file === "string") return NextResponse.json({ error: "No file received." }, { status: 400 });
    if (!limit.types.test(file.type)) {
      return NextResponse.json({ error: kind === "image" ? "Please choose a picture (JPG, PNG, WebP, SVG or GIF)." : "Please choose an MP4 or WebM video." }, { status: 400 });
    }
    if (file.size > limit.maxBytes) {
      return NextResponse.json({ error: `That file is too big (max ${Math.round(limit.maxBytes / 1024 / 1024)} MB).` }, { status: 400 });
    }

    const asset = await getWriteClient().assets.upload(kind, Buffer.from(await file.arrayBuffer()), {
      filename: file.name,
      contentType: file.type,
    });
    return NextResponse.json({ _id: asset._id, url: asset.url, originalFilename: asset.originalFilename });
  } catch (error) {
    console.error("[admin] upload failed:", error);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}
