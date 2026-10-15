import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-08-15",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

const id = "producer-vignoble-pigeon-hill";

const producer = await client.getDocument(id);

if (!producer) {
  throw new Error("Pigeon Hill introuvable");
}

const approach = [...(producer.approach || [])];
const approachEn = [...(producer.approachEn || [])];

const frIndex = approach.findIndex(
  item => item._key === "approach-regenerative"
);

const enIndex = approachEn.findIndex(
  item => item._key === "approach-regenerative"
);

if (frIndex === -1 || enIndex === -1) {
  throw new Error("Bloc biodiversité introuvable");
}

approach[frIndex] = {
  ...approach[frIndex],
  text:
    "Cultures de couverture, compost, animaux et biodiversité font partie du quotidien. Pigeon Hill cherche ainsi à prendre soin du vignoble comme d’un écosystème complet.",
};

approachEn[enIndex] = {
  ...approachEn[enIndex],
  text:
    "Cover crops, compost, animals and biodiversity are part of everyday life at the vineyard. Together, they help Pigeon Hill care for the vineyard as a complete ecosystem.",
};

await client
  .patch(id)
  .set({
    approach,
    approachEn,
  })
  .commit();

console.log("✓ Phrase FR corrigée");
console.log("✓ Phrase EN corrigée");
console.log("✓ Titres inchangés");
