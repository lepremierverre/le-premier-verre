import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-08-15",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

const id = "producer-pinard-et-filles";

await client
  .patch(id)
  .set({
    oneLiner:
      "À Magog, Pinard et Filles travaille une grande diversité de cépages et signe des vins vivants, francs et profondément québécois.",
    oneLinerEn:
      "In Magog, Pinard et Filles works with a wide range of grape varieties, crafting lively, direct wines with a distinctly Quebec identity.",
  })
  .commit();

const check = await client.fetch(
  `*[_id == $id][0]{name, oneLiner, oneLinerEn}`,
  { id }
);

console.log("\n✓ Pinard et Filles mis à jour\n");
console.log("FR :", check.oneLiner);
console.log("EN :", check.oneLinerEn);
