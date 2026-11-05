import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { client } from "@/sanity/lib/client";

// Called by the Studio's Presentation tool. next-sanity validates the request against a
// secret stored in the dataset, so only signed-in Studio users can enable draft mode.
export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token: process.env.SANITY_API_READ_TOKEN }),
});
