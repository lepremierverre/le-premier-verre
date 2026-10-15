import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

async function main() {
  await client
    .patch("producer-vignoble-de-la-bauge")
    .set({
      whyWeFollow:
        "Parce que Simon Naud ne se contente pas de faire du vin depuis des décennies. Il continue de remettre ses méthodes en question et de chercher comment mieux cultiver. À La Bauge, les moutons ne sont pas là pour la photo. Ils font partie d’une façon bien réelle de repenser le vignoble.",

      whyWeFollowEn:
        "Because Simon Naud hasn’t just been making wine for decades. He keeps questioning his methods and looking for better ways to farm. At La Bauge, the sheep aren’t there just for show. They’re a real part of rethinking the vineyard.",
    })
    .commit();

  console.log("✓ Texte Pourquoi corrigé");
  console.log("✓ Aucun tiret long");
  console.log("✓ FR et EN corrigés");
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
