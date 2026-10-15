import { createClient } from "@sanity/client";
import fs from "node:fs";

const env = fs.readFileSync(".env.local", "utf8");

for (const line of env.split("\n")) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, "");
  }
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: false,
});

const producer = await client.fetch(
  `*[_type == "producer" && slug.current == "domaine-du-nival"][0]{
    name,
    instagram,
    website
  }`
);

console.log("\n===== NIVAL =====");
console.log("Instagram :", producer?.instagram || "ABSENT");
console.log("Site :", producer?.website || "ABSENT");
