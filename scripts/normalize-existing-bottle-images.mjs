import { createClient } from "@sanity/client";
import { normalizeBottleImage } from "./lib/normalize-bottle-image.mjs";

const WRITE = process.argv.includes("--write");

const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
const LIMIT = limitArg ? Number(limitArg.split("=")[1]) : Infinity;

if (!Number.isFinite(LIMIT) && LIMIT !== Infinity) {
  throw new Error("Valeur --limit invalide");
}

const client = createClient({
  projectId: "czq6bjyu",
  dataset: "production",
  apiVersion: "2025-08-15",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
});

const wines = await client.fetch(`
  *[_type == "wine" && defined(bottleImage.asset._ref)] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    "imageRef": bottleImage.asset._ref,
    "imageUrl": bottleImage.asset->url
  }
`);

function dimensionsFromRef(ref = "") {
  const match = ref.match(/-(\d+)x(\d+)-/);

  return match
    ? { width: Number(match[1]), height: Number(match[2]) }
    : null;
}

let alreadyStandard = 0;
let ready = 0;
let written = 0;
let errors = 0;

console.log(
  `\n=== NORMALISATION IMAGES LPV — ${WRITE ? "WRITE" : "DRY-RUN"} ===\n`
);

for (const wine of wines) {
  const dimensions = dimensionsFromRef(wine.imageRef);

  if (dimensions?.width === 900 && dimensions?.height === 1260) {
    alreadyStandard++;
    console.log(`⏭️ DÉJÀ STANDARD | ${wine.name}`);
    continue;
  }

  try {
    if (!wine.imageUrl) {
      throw new Error("URL asset Sanity absente");
    }

    const response = await fetch(wine.imageUrl);

    if (!response.ok) {
      throw new Error(`téléchargement HTTP ${response.status}`);
    }

    const sourceBuffer = Buffer.from(await response.arrayBuffer());
    const normalized = await normalizeBottleImage(sourceBuffer);

    ready++;

    console.log(
      `🔧 ${wine.name} | ${dimensions?.width ?? "?"}x${dimensions?.height ?? "?"} → ${normalized.width}x${normalized.height} | produit ${normalized.productWidth}x${normalized.productHeight}`
    );

    if (!WRITE) continue;

    if (written >= LIMIT) {
      console.log(`\n🛑 Limite de ${LIMIT} migrations atteinte.`);
      break;
    }

    const asset = await client.assets.upload("image", normalized.buffer, {
      filename: `lpv-${wine.slug || wine._id}.png`,
      contentType: "image/png",
    });

    await client
      .patch(wine._id)
      .set({
        bottleImage: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: asset._id,
          },
        },
      })
      .commit();

    written++;
    console.log(`   ✅ Sanity mis à jour | ${asset._id}`);
  } catch (error) {
    errors++;
    console.error(`❌ ${wine.name} | ${error.message}`);
  }
}

console.log("\n=== RÉSUMÉ ===");
console.log(`Total avec image : ${wines.length}`);
console.log(`Déjà standard    : ${alreadyStandard}`);
console.log(`Prêtes           : ${ready}`);
console.log(`Écrites          : ${written}`);
console.log(`Erreurs          : ${errors}`);

if (!WRITE) {
  console.log("\n🔒 DRY-RUN — aucun asset créé, aucun document modifié.");
  console.log("⚠️ Ne lance pas --write avant validation du dry-run.");
}

console.log("");
