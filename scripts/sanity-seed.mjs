/**
 * Migrates the website's existing content into Sanity.
 *
 *   npm run sanity:seed              # create documents that don't exist yet (safe to re-run)
 *   npm run sanity:seed -- --replace # overwrite existing documents with the original content
 *
 * Requires in .env.local: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET and
 * SANITY_API_WRITE_TOKEN (an "Editor" token from sanity.io/manage → API → Tokens).
 * You can delete the write token afterwards — the website never needs it.
 *
 * Images and videos referenced from /public are uploaded to Sanity's asset library
 * (each file once; Sanity de-duplicates identical uploads).
 */
import { createReadStream, existsSync } from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";

for (const file of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(file);
  } catch {
    // file missing — fine
  }
}

const { seedDocuments } = await import("../sanity/seed/content.js");

const replace = process.argv.includes("--replace");
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN in .env.local.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-10-01",
  token,
  useCdn: false,
});

const publicDir = path.resolve(process.cwd(), "public");
const uploads = new Map();
const missing = [];

async function upload(kind, localPath) {
  if (uploads.has(localPath)) return uploads.get(localPath);
  const filePath = path.join(publicDir, decodeURIComponent(localPath));
  if (!existsSync(filePath)) {
    missing.push(localPath);
    uploads.set(localPath, null);
    return null;
  }
  // Upload one file at a time and back off on HTTP 429 (Sanity allows ~25 requests/second).
  for (let attempt = 1; ; attempt++) {
    try {
      const asset = await client.assets.upload(kind, createReadStream(filePath), {
        filename: path.basename(filePath),
      });
      console.log(`  ↑ ${kind}: ${localPath}`);
      uploads.set(localPath, asset._id);
      return asset._id;
    } catch (error) {
      if (error?.statusCode !== 429 || attempt >= 6) throw error;
      await new Promise((r) => setTimeout(r, 1000 * attempt));
    }
  }
}

/** Replace every { _localPath } image/file with an uploaded Sanity asset reference. */
async function prepare(value) {
  if (Array.isArray(value)) {
    const out = [];
    for (const item of value) {
      const prepared = await prepare(item);
      if (prepared !== undefined) out.push(prepared);
    }
    return out;
  }
  if (!value || typeof value !== "object") return value;

  if (value._localPath) {
    const { _localPath, ...rest } = value;
    const kind = value._type === "file" ? "file" : "image";
    const assetId = await upload(kind, _localPath);
    if (!assetId) return undefined;
    return { ...rest, _type: kind, asset: { _type: "reference", _ref: assetId } };
  }

  const out = {};
  for (const [k, v] of Object.entries(value)) {
    const prepared = await prepare(v);
    if (prepared !== undefined && prepared !== null) out[k] = prepared;
  }
  return out;
}

async function run() {
  const { projectId, dataset } = client.config();
  console.log(`Seeding ${projectId}/${dataset} (${replace ? "replace existing" : "create missing only"})`);

  const existing = new Set(await client.fetch(`*[_id in $ids]._id`, { ids: seedDocuments.map((d) => d._id) }));
  const tx = client.transaction();
  let count = 0;

  for (const doc of seedDocuments) {
    if (existing.has(doc._id) && !replace) {
      console.log(`- skip ${doc._id} (already exists)`);
      continue;
    }
    console.log(`- ${existing.has(doc._id) ? "replace" : "create"} ${doc._id}`);
    const prepared = await prepare(doc);
    tx.createOrReplace(prepared);
    count++;
  }

  if (count) await tx.commit({ autoGenerateArrayKeys: true });
  if (missing.length) console.warn(`\n⚠ Files not found in /public (skipped):\n  ${missing.join("\n  ")}`);
  console.log(`\nDone — ${count} document(s) written.`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
