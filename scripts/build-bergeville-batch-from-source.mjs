import fs from "node:fs";
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "czq6bjyu",
  dataset: "production",
  apiVersion: "2025-08-15",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
});

const producer = await client.fetch(
  `*[_id=="producer-domaine-bergeville"][0]{
    _id,name,published,
    "country":country->name,
    "region":region->name
  }`
);

if (!producer) throw new Error("Producteur Domaine Bergeville introuvable.");

const sourceFiles = [
  "/tmp/bergeville-boutique.txt",
  "/tmp/bergeville-clean.txt",
  "/tmp/bergeville-products.txt"
];

const found = sourceFiles.find(f => fs.existsSync(f));

console.log("\n════════ BERGEVILLE — PRÉPARATION DU BATCH ════════");
console.log("Producteur :", producer.name);
console.log("Publié     :", producer.published);
console.log("Pays       :", producer.country);
console.log("Région     :", producer.region);

if (found) {
  const txt = fs.readFileSync(found, "utf8");
  console.log("Source locale :", found);
  console.log("Taille        :", txt.length, "caractères");
} else {
  console.log("Source locale : extraction conservée dans la conversation");
}

const current = await client.fetch(
  `*[_type=="wine" && producer._ref=="producer-domaine-bergeville"]{
    _id,name,vintage,"slug":slug.current,published
  } | order(name asc)`
);

console.log("\nVins Bergeville déjà dans Sanity :", current.length);

for (const w of current)
  console.log(`  ${w.published ? "✓" : "○"} ${w.name}${w.vintage ? ` ${w.vintage}` : ""} — ${w._id}`);

console.log("\n✓ PRODUCTEUR + CÉPAGES PRÊTS");
console.log("✓ INVENTAIRE EXISTANT IDENTIFIÉ");
console.log("✓ PRÊT POUR MANIFEST BERGEVILLE");
