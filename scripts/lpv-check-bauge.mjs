import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "czq6bjyu",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-08-15",
  useCdn: false,
});

const wines = await client.fetch(`
  *[
    _type == "wine" &&
    producer->slug.current == "vignoble-de-la-bauge"
  ] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    published,
    "bottleImage": bottleImage.asset._ref,
    "editorialImage": editorialImage.asset._ref,
    "bottleFilename": bottleImage.asset->originalFilename,
    "editorialFilename": editorialImage.asset->originalFilename,
    color,
    beverageType,
    vintage,
    alcohol,
    approxPrice,
    oneLiner,
    style,
    tasting,
    profile,
    serving,
    purchaseUrl
  }
`);

console.dir(wines, { depth: null });
