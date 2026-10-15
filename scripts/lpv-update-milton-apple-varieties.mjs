import dotenv from "dotenv";
import { createClient } from "@sanity/client";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  process.env.SANITY_STUDIO_PROJECT_ID;

const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  process.env.SANITY_STUDIO_DATASET ||
  "production";

const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  throw new Error("STOP — projectId ou SANITY_API_WRITE_TOKEN manquant.");
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  useCdn: false,
  token,
});

const id = "wine-cidrerie-milton-coccinelle-pomme";

const wine = await client.fetch(
  `*[_type == "wine" && _id == $id][0]{
    _id, name, beverageType, alcoholFree, published
  }`,
  { id }
);

if (
  !wine ||
  wine.beverageType !== "cider" ||
  wine.alcoholFree !== true
) {
  throw new Error(
    "STOP — fiche introuvable ou type/statut sans alcool inattendu."
  );
}

await client.patch(id).set({
  appleVarieties: ["Empire", "Cortland", "Spartan", "McIntosh"],
}).commit();

const result = await client.fetch(
  `*[_type == "wine" && _id == $id][0]{
    name, beverageType, alcoholFree, appleVarieties
  }`,
  { id }
);

console.log("\n===== VÉRIFICATION =====");
console.log(JSON.stringify(result, null, 2));
console.log("\n✓ Coccinelle Pomme mise à jour.");
console.log("✓ Aucun autre champ modifié.");
