import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "czq6bjyu",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  useCdn: false,
});

const docs = await client.fetch(`
  *[
    _type == "wine" &&
    beverageType == "cider" &&
    published == true
  ] | order(name asc) [0...10] {
    ...,
    "producerName": producer->name,
    "grapeNames": grapes[]->name,
    "foodPairingNames": foodPairings[]->name,
    "countryName": country->name,
    "regionName": region->name
  }
`);

console.log("\n===== CIDRES PUBLIÉS — MODÈLES =====");

for (const doc of docs) {
  console.log("\n-----------------------------------");
  console.log("PRODUCTEUR :", doc.producerName);
  console.log("NOM        :", doc.name);
  console.log("ID         :", doc._id);
  console.log("CHAMPS     :", Object.keys(doc).sort().join(", "));
  console.dir(doc, { depth: null });
}

console.log("\n===== FIN =====");
