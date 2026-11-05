// Server-only Sanity client with write access. Only import from server actions / route handlers.
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

let writeClient;
export function getWriteClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!projectId || !token) throw new Error("The admin panel needs NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN.");
  if (!writeClient) {
    writeClient = createClient({ projectId, dataset, apiVersion, token, useCdn: false, perspective: "published" });
  }
  return writeClient;
}
