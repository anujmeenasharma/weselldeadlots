import { createImageUrlBuilder } from "@sanity/image-url";
import { dataset, projectId } from "../env";

let builder;
function getBuilder() {
  if (!builder) builder = createImageUrlBuilder({ projectId: projectId || "missing-project-id", dataset });
  return builder;
}

/** Raw Sanity image URL builder (use for advanced transforms). */
export function urlFor(source) {
  return getBuilder().image(source);
}

/**
 * Resolve any CMS image value to a URL string.
 * - Sanity image ({ asset: { _ref } }) -> optimised CDN URL (respects crop + hotspot)
 * - Seed/fallback image ({ _localPath }) -> local /public path
 * - Plain string -> returned as-is
 * Returns null when no image is set, so callers can skip rendering.
 */
export function imageUrl(image, { width, height, quality = 80 } = {}) {
  if (!image) return null;
  if (typeof image === "string") return image;
  if (image.asset?._ref || image.asset?._id) {
    let b = urlFor(image).auto("format").quality(quality).fit("max");
    if (width) b = b.width(width);
    if (height) b = b.height(height).fit("crop");
    return b.url();
  }
  return image._localPath || null;
}

/** Resolve a Sanity file field (e.g. an uploaded video) or seed fallback to a URL. */
export function fileUrl(file) {
  if (!file) return null;
  if (typeof file === "string") return file;
  if (file.url) return file.url;
  const ref = file.asset?._ref;
  if (ref) {
    // file-<id>-<ext>
    const [, id, ext] = ref.split("-");
    return `https://cdn.sanity.io/files/${projectId}/${dataset}/${id}.${ext}`;
  }
  return file._localPath || null;
}

export function imageAlt(image, fallback = "") {
  return (image && typeof image === "object" && image.alt) || fallback;
}
