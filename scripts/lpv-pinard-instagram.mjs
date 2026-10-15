import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

const id = "producer-pinard-et-filles";
const instagram = "https://www.instagram.com/pinard_et_filles/";

async function main() {
  const before = await client.getDocument(id);

  if (!before || before.name !== "Pinard et Filles") {
    throw new Error("Producteur introuvable.");
  }

  await client.patch(id).set({ instagram }).commit();

  const after = await client.getDocument(id);

  if (after.instagram !== instagram) {
    throw new Error("Instagram non enregistré.");
  }

  console.log("✓ Instagram Pinard et Filles ajouté");
  console.log("✓ Aucun autre champ modifié");
  console.log(after.instagram);
}

main().catch(error => {
  console.error("❌", error.message);
  process.exit(1);
});
