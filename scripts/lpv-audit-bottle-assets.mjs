import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: false,
});

async function main() {
  const wines = await client.fetch(`
    *[
      _type == "wine" &&
      published == true &&
      (
        producer->slug.current == "domaine-du-ridge" ||
        producer->slug.current == "vineterra"
      )
    ]{
      name,
      "producer": producer->name,
      "producerSlug": producer->slug.current,
      "assetRef": bottleImage.asset._ref,
      "assetUrl": bottleImage.asset->url,
      "dimensions": bottleImage.asset->metadata.dimensions,
      "hasAlpha": bottleImage.asset->metadata.hasAlpha,
      "palette": bottleImage.asset->metadata.palette
    } | order(producerSlug asc, name asc)
  `);

  for (const wine of wines) {
    console.log("\n--------------------------------");
    console.log(wine.producer);
    console.log(wine.name);
    console.log("asset :", wine.assetRef);
    console.log("dimensions :", wine.dimensions);
    console.log("alpha :", wine.hasAlpha);
    console.log("url :", wine.assetUrl);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
