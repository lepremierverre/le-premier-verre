import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "czq6bjyu",
  dataset: "production",
  apiVersion: "2025-08-15",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
});

const skus = [
  "11768795","12057004","15526996","11293970","212993",
  "15460261","884379","15224277","13990592","15045130"
];

const wines = await client.fetch(`
  *[_type == "wine" && sku in $skus]{
    _id,
    name,
    sku,
    vinification
  }
`, { skus });

console.log("\n════════ LPV — CORRECTION VINIFICATION LOT 01 ════════\n");

let tx = client.transaction();
let fixes = 0;
let alreadyGood = 0;
let empty = 0;

for (const wine of wines.sort((a,b) => a.name.localeCompare(b.name))) {
  const v = wine.vinification;

  if (typeof v === "string" && v.trim()) {
    const portableText = [{
      _key: `vinification-${wine.sku}`,
      _type: "block",
      style: "normal",
      markDefs: [],
      children: [{
        _key: `vinification-${wine.sku}-span`,
        _type: "span",
        marks: [],
        text: v.trim()
      }]
    }];

    tx = tx.patch(wine._id, p => p.set({ vinification: portableText }));
    fixes++;

    console.log(`🔧 ${wine.name}`);
    console.log(`   string → Portable Text`);
  }
  else if (Array.isArray(v)) {
    alreadyGood++;
    console.log(`✅ ${wine.name} — déjà Portable Text`);
  }
  else {
    empty++;
    console.log(`⚪ ${wine.name} — vinification vide`);
  }
}

if (wines.length !== 10) {
  throw new Error(`Seulement ${wines.length}/10 vins retrouvés.`);
}

console.log("\nRésumé avant écriture");
console.log(`  À convertir : ${fixes}`);
console.log(`  Déjà corrects : ${alreadyGood}`);
console.log(`  Vides : ${empty}`);

if (fixes > 0) {
  await tx.commit();
}

/* RELIRE SANITY APRÈS ÉCRITURE */

const check = await client.fetch(`
  *[_type == "wine" && sku in $skus]{
    name,
    sku,
    vinification
  } | order(name asc)
`, { skus });

console.log("\nCONTRÔLE POST-CORRECTION");

let errors = 0;

for (const wine of check) {
  const ok =
    wine.vinification == null ||
    Array.isArray(wine.vinification);

  if (!ok) errors++;

  console.log(
    `${ok ? "✅" : "❌"} ${wine.name} | vinification: ${
      wine.vinification == null
        ? "vide"
        : Array.isArray(wine.vinification)
          ? "Portable Text"
          : typeof wine.vinification
    }`
  );
}

if (errors) {
  console.log(`\n❌ ${errors} fiche(s) encore incompatibles.`);
  process.exit(1);
}

console.log("\n✅ 10/10 — type vinification compatible avec le schéma Sanity.");
console.log("🍷 Aucun texte de vinification n'a été supprimé.");
