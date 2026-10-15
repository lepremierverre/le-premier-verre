import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-08-15",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

const id = "producer-vignoble-pigeon-hill";
const instagram = "https://www.instagram.com/vignoblepigeonhill/";

await client.patch(id).set({ instagram }).commit();

const check = await client.getDocument(id);

console.log("✓ Instagram ajouté à", check.name);
console.log("✓", check.instagram);
