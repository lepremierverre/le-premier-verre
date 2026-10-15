import { createClient } from "@sanity/client";
import "dotenv/config";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const wines = await client.fetch(`
  *[_type == "wine" && producer->name == "Cidrerie Milton"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    published,
    beverageType,
    alcoholFree,
    appleVarieties,
    tastingKeywords,
    tastingKeywordsEn,
    body,
    sweetness,
    roundness,
    serviceTemperature,
    perfectFor,
    oneLiner,
    oneLinerEn,
    editorialImage{asset}
  }
`);

console.log(JSON.stringify(wines, null, 2));
