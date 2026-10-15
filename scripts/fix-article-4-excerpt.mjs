import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "czq6bjyu",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-08-15",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
});

await client
  .patch("article-recevoir-sans-se-compliquer-la-vie")
  .set({
    excerptEn:
      "A few bottles, a good meal and far fewer rules. How to choose versatile wines for hosting without turning dinner into a sommelier exercise.",
  })
  .commit();

console.log("excerptEn corrigé.");
