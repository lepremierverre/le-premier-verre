import { createClient } from "@sanity/client";

const WRITE = process.argv.includes("--write");

const client = createClient({
  projectId: "czq6bjyu",
  dataset: "production",
  apiVersion: "2025-08-15",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
});

const IDS = [
  "wine-domaine-du-ridge-le-litre-du-ridge-rose",
  "wine-domaine-du-ridge-le-batonnier",
  "wine-domaine-du-ridge-les-petites-cuvees-pet-nat-orange",
  "wine-domaine-du-ridge-seyval-vidal",
  "wine-domaine-du-ridge-les-petites-cuvees-vidal-brut",
];

const wines = await client.fetch(`
  *[_id in $ids]{
    _id,
    name,
    published,
    bottleImage,
    editorialImage,
    "bottleFilename": bottleImage.asset->originalFilename,
    "editorialFilename": editorialImage.asset->originalFilename
  }
`, {ids: IDS});

console.log("\n===== RIDGE — NOUVEAU DISPLAY =====");

for (const wine of wines) {
  console.log(`\n${wine.name}`);
  console.log("Image actuelle :", wine.bottleFilename || "ABSENTE");
  console.log("Editorial avant :", wine.editorialFilename || "ABSENTE");

  if (!wine.bottleImage?.asset?._ref) {
    throw new Error(`Image absente pour ${wine.name}`);
  }
}

if (wines.length !== 5) {
  throw new Error(`On attend 5 vins Ridge, trouvé : ${wines.length}`);
}

if (!WRITE) {
  console.log("\n✓ SIMULATION OK");
  console.log("Les 5 images seront installées comme editorialImage.");
  console.log("Aucune modification effectuée.");
  process.exit(0);
}

if (!client.config().token) {
  throw new Error("Token Sanity absent.");
}

for (const wine of wines) {
  await client
    .patch(wine._id)
    .set({
      editorialImage: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: wine.bottleImage.asset._ref,
        },
        alt: `${wine.name} · Domaine du Ridge`,
        credit: "Domaine du Ridge",
      },
    })
    .commit();

  console.log("✓", wine.name);
}

const check = await client.fetch(`
  *[_id in $ids]{
    name,
    published,
    "editorial": editorialImage.asset->originalFilename
  }
`, {ids: IDS});

console.log("\n===== VÉRIFICATION =====");

for (const wine of check) {
  console.log(
    wine.editorial ? "✓" : "✗",
    wine.name,
    "| editorialImage:",
    wine.editorial || "ABSENTE"
  );
}

if (
  check.length !== 5 ||
  check.some(w => !w.editorial)
) {
  throw new Error("Vérification finale échouée.");
}

console.log("\n✓ LES 5 FICHES RIDGE ONT MAINTENANT UNE EDITORIAL IMAGE");
console.log("✓ ELLES DÉCLENCHENT LE NOUVEAU DISPLAY");
