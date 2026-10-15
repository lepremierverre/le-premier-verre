import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

async function main() {
  const id = "producer-les-bacchantes";

  console.log("\n===== LES BACCHANTES · PRODUCER TYPE =====");

  const before = await client.fetch(
    `*[_id == $id][0]{
      _id,
      name,
      producerType,
      published,
      lpvPartner,
      "country": country->name
    }`,
    { id }
  );

  console.log("AVANT");
  console.log(JSON.stringify(before, null, 2));

  if (!before) {
    throw new Error("Les Bacchantes introuvable.");
  }

  if (
    before.name !== "Les Bacchantes" ||
    before.published !== true ||
    before.country !== "Canada"
  ) {
    throw new Error(
      "Document inattendu. Aucune modification effectuée."
    );
  }

  await client
    .patch(id)
    .set({
      producerType: "winery",
    })
    .commit();

  const after = await client.fetch(
    `*[_id == $id][0]{
      _id,
      name,
      producerType,
      published,
      lpvPartner,
      "country": country->name,
      "region": region->name,
      "slug": slug.current
    }`,
    { id }
  );

  console.log("\nAPRÈS");
  console.log(JSON.stringify(after, null, 2));

  if (after?.producerType !== "winery") {
    throw new Error("producerType n'a pas été enregistré.");
  }

  console.log("\n✓ producerType = winery");
  console.log("✓ Les Bacchantes reste publié");
  console.log("✓ Partenaire LPV intact");
  console.log("✓ Aucun template modifié");
  console.log("✓ Aucun autre producteur modifié");
}

main().catch((error) => {
  console.error("\nERREUR :", error.message);
  process.exit(1);
});
