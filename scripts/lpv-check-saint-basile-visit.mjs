import { createClient } from "@sanity/client";
import fs from "fs";

const env = fs.readFileSync(".env.local", "utf8");

for (const line of env.split("\n")) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: false,
});

const p = await client.fetch(`
  *[_type == "producer" && slug.current == "domaine-saint-basile"][0]{
    name,
    municipality,
    address,
    openToVisitors,
    reservationRequired,
    visitDetails,
    visitDetailsEn,
    website,
    instagram,
    facebook
  }
`);

console.log("\n===== DOMAINE SAINT-BASILE — VISITE =====");
console.log(JSON.stringify(p, null, 2));
