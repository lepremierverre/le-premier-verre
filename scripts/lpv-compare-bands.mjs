import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "czq6bjyu",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  useCdn: false,
});

const ids = [
  "wine-joyhill-la-butte-2024",
  "wine-bauge-les-beaux-jus-le-rouge"
];

for (const id of ids) {
  const w = await client.getDocument(id);

  console.log("\n======================================");
  console.log(w?.name, "—", id);
  console.log("======================================");

  console.dir(w, {
    depth: 6,
    colors: false,
    maxArrayLength: 50
  });
}
