import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: false,
});

const producers = await client.fetch(`
  *[
    _type == "producer" &&
    slug.current in [
      "domaine-du-ridge",
      "vineterra"
    ]
  ]{
    ...
  }
`);

for (const producer of producers) {
  console.log("\n========================================");
  console.log(producer.name);
  console.log("========================================");
  console.log(JSON.stringify(producer, null, 2));
}
