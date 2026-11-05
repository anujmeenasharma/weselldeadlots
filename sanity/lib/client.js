import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, studioUrl } from "../env";

// Public, read-only client. Never attach a token here — this module can be bundled
// into client components (e.g. via the image helper).
export const client = createClient({
  projectId: projectId || "missing-project-id",
  dataset,
  apiVersion,
  // Tag-based revalidation needs fresh data straight from the API after a publish.
  useCdn: false,
  perspective: "published",
  stega: { studioUrl },
});
