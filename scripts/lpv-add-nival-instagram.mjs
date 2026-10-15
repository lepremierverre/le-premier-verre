import { createClient } from "@sanity/client";
import fs from "node:fs";

const env = fs.readFileSync(".env.local", "utf8");

for (const line of env.split("\n")) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, "");
  }
}

const token =
  process.env.SANITY_API_WRITE_TOKEN ||
  process.env.SANITY_API_TOKEN ||
  process.env.SANITY_WRITE_TOKEN;

if (!token) {
  console.log("STOP — aucun token Sanity d'écriture trouvé");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: false,
  token,
});

const producer = await client.fetch(
  `*[_type == "producer" && slug.current == "domaine-du-nival"][0]{
    _id,
    name,
    instagram
  }`
);

if (!producer?._id) {
  console.log("STOP — Domaine du Nival introuvable");
  process.exit(1);
}

console.log("Producteur :", producer.name);
console.log("Instagram avant :", producer.instagram || "ABSENT");

await client
  .patch(producer._id)
  .set({
    instagram: "https://www.instagram.com/domainedunival/",
  })
  .commit();

console.log("OK — Instagram Nival ajouté");
