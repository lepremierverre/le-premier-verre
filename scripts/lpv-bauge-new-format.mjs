import { createClient } from "@sanity/client";

const WRITE = process.argv.includes("--write");

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "czq6bjyu",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-08-15",
  useCdn: false,
  token: WRITE ? process.env.SANITY_API_WRITE_TOKEN : undefined,
});

const ids = [
  "wine-bauge-la-renversante",
  "wine-bauge-trois-frontenacs",
  "wine-bauge-les-beaux-jus-le-blanc",
  "wine-bauge-les-beaux-jus-le-rouge",
  "wine-bauge-vidal-sassume",
];

const wines = await client.fetch(`
  *[_type == "wine" && _id in $ids] | order(name asc) {
    _id,
    name,
    "bottleRef": bottleImage.asset._ref,
    "editorialRef": editorialImage.asset._ref
  }
`, { ids });

console.log("\n===== VIGNOBLE DE LA BAUGE — NOUVEAU FORMAT =====");
console.log("Mode :", WRITE ? "ÉCRITURE" : "SIMULATION");

let tx = client.transaction();

for (const wine of wines) {
  console.log(`\n${wine.name}`);

  if (!wine.bottleRef) {
    console.log("✗ Aucune bottleImage — ignoré");
    continue;
  }

  console.log("✓ image live trouvée");
  console.log("  ", wine.bottleRef);

  if (wine.editorialRef === wine.bottleRef) {
    console.log("✓ déjà au nouveau format");
    continue;
  }

  console.log("→ réutilisation de bottleImage comme editorialImage");

  if (WRITE) {
    tx = tx.patch(wine._id, {
      set: {
        editorialImage: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: wine.bottleRef,
          },
        },
      },
    });
  }
}

if (WRITE) {
  await tx.commit();
  console.log("\n✓ MODIFICATIONS APPLIQUÉES");
} else {
  console.log("\n✓ SIMULATION TERMINÉE");
  console.log("Aucune modification effectuée.");
  console.log("\nPour appliquer :");
  console.log("node scripts/lpv-bauge-new-format.mjs --write");
}
