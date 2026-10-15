import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

const ids = [
  "drafts.wine-vineterra-croix-sur-la-montagne-2024",
  "drafts.wine-vineterra-patte-de-loup-2024",
  "drafts.wine-vineterra-magie-des-semis-2023",
  "drafts.wine-vineterra-lac-sans-fond-classique-2023",
  "drafts.wine-vineterra-cheval-tout-blanc-classique-2024",
];

async function main() {
  console.log("\n===== APPELLATION VINETERRA =====");

  const appellation = await client.getDocument(
    "appellation-igp-vin-du-quebec"
  );

  if (!appellation) {
    throw new Error("IGP Vin du Québec introuvable.");
  }

  console.log("✓ Appellation :", appellation.name);

  const drafts = await client.fetch(
    `*[_id in $ids]{_id, name, "hasImage": defined(bottleImage.asset._ref)}`,
    { ids }
  );

  if (drafts.length !== 5) {
    throw new Error(
      `Seulement ${drafts.length}/5 brouillons trouvés. Aucune modification.`
    );
  }

  const missingImage = drafts.filter((d) => !d.hasImage);

  if (missingImage.length) {
    throw new Error(
      "Une ou plusieurs photos sont absentes. Aucune modification."
    );
  }

  const tx = client.transaction();

  for (const id of ids) {
    tx.patch(id, {
      set: {
        appellation: {
          _type: "reference",
          _ref: "appellation-igp-vin-du-quebec",
        },
      },
    });
  }

  await tx.commit();

  const result = await client.fetch(
    `*[_id in $ids] | order(name asc) {
      _id,
      name,
      "appellation": appellation->name,
      "appellationId": appellation._ref
    }`,
    { ids }
  );

  console.log(JSON.stringify(result, null, 2));

  if (
    result.length !== 5 ||
    result.some(
      (d) =>
        d.appellationId !== "appellation-igp-vin-du-quebec"
    )
  ) {
    throw new Error("Validation de l’appellation échouée.");
  }

  console.log("\n✓ 5/5 rattachés à IGP Vin du Québec");
}

main().catch((error) => {
  console.error("\nERREUR :", error.message);
  process.exit(1);
});
