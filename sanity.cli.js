import { defineCliConfig } from "sanity/cli";

// The Sanity CLI doesn't read Next.js env files, so load .env.local here (Node 20.12+).
for (const file of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(file);
  } catch {
    // file missing — fine
  }
}

// Used by the `sanity` CLI (e.g. `npm run sanity:seed`, `npx sanity cors add`, dataset export).
export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  },
});
