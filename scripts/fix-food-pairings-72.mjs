import fs from "node:fs";
import {createClient} from "@sanity/client";

const client = createClient({
  projectId: "czq6bjyu",
  dataset: "production",
  apiVersion: "2025-08-15",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN
});

const FOOD = new Set([
  "food-agneau","food-bbq-cotes-levees","food-brunch-oeufs-benedictine",
  "food-burger","food-canard","food-champignons","food-chocolat","food-crabe",
  "food-crevettes","food-creme-brulee","food-cuisine-asiatique-sucree-salee",
  "food-cuisine-vegetarienne","food-cuisine-epicee","food-curry",
  "food-fondue-fromage","food-fromages","food-fruits-dessert-leger",
  "food-dessert-vanille","food-homard","food-huitres","food-lasagne",
  "food-legumes-grilles","food-moules","food-pesto","food-pizza",
  "food-planche-charcuteries","food-poisson-fruits-de-mer","food-poisson-grille",
  "food-porc","food-poulet-frit","food-poulet-roti","food-poutine",
  "food-pates-cremeuses","food-pates-sauce-tomate","food-petoncles",
  "food-raclette","food-ramen","food-risotto","food-salade-chevre",
  "food-saucisses","food-saumon","food-steak-grillades","food-sushis",
  "food-tacos","food-tartare-boeuf","food-tartare-saumon",
  "food-tarte-aux-fruits","food-thon","food-tourtiere","food-veau"
]);

const fixes = {
"wine-alain-lorieux-chinon-expression-2023":
["food-agneau","food-champignons","food-saucisses","food-tourtiere"],

"wine-albert-bichot-bourgogne-aligote":
["food-huitres","food-poulet-frit","food-salade-chevre","food-pesto"],

"wine-alto-moncayo-garnacha-2023":
["food-steak-grillades","food-agneau","food-bbq-cotes-levees","food-saucisses"],

"wine-domaine-bergeville-amourette-2025":
["food-planche-charcuteries","food-poulet-frit","food-tartare-saumon","food-pizza"],

"wine-domaine-du-ridge-bise-d-automne":
["food-creme-brulee","food-fromages","food-fruits-dessert-leger","food-tarte-aux-fruits"],

"wine-domaine-du-ridge-blanc-domaine-du-ridge":
["food-sushis","food-huitres","food-poisson-fruits-de-mer","food-salade-chevre"],

"wine-campo-viejo-tempranillo-rioja":
["food-burger","food-tacos","food-saucisses","food-bbq-cotes-levees"],

"wine-domaine-bergeville-canonique-2024":
["food-huitres","food-crabe","food-tartare-saumon","food-poulet-frit"],

"wine-casa-ferreirinha-papa-figos-douro-2024":
["food-burger","food-bbq-cotes-levees","food-agneau","food-saucisses"],

"wine-casillero-del-diablo-cabernet-sauvignon":
["food-steak-grillades","food-burger","food-bbq-cotes-levees","food-agneau"],

"wine-domaine-du-ridge-champs-de-florence":
["food-tartare-saumon","food-saumon","food-salade-chevre","food-crevettes"],

"wine-christophe-pacalet-beaujolais-les-marcellins-2024":
["food-pizza","food-poulet-roti","food-tartare-boeuf","food-planche-charcuteries"],

"wine-domaine-bergeville-colfo-2025":
["food-huitres","food-crabe","food-poulet-frit","food-planche-charcuteries"],

"wine-delinquente-tuff-nutt-bianco-pet-nat-2024":
["food-crabe","food-crevettes","food-poulet-frit","food-sushis"],

"wine-devils-corner-pinot-noir-2024":
["food-saumon","food-canard","food-porc","food-champignons"],

"wine-domaine-saint-basile-frontenac-2023":
["food-planche-charcuteries","food-pates-sauce-tomate","food-saucisses","food-tourtiere"],

"wine-domaine-du-nival-ces-petits-imprevus-2025":
["food-curry","food-cuisine-asiatique-sucree-salee","food-poulet-frit","food-tarte-aux-fruits"],

"wine-domaine-du-nival-matiere-a-discussion-2025":
["food-cuisine-asiatique-sucree-salee","food-sushis","food-salade-chevre","food-poisson-grille"],

"wine-domaine-du-ridge-le-litre-du-ridge-rose":
["food-cuisine-epicee","food-planche-charcuteries","food-tacos","food-saumon"],

"wine-domaine-du-ridge-lucy-k":
["food-cuisine-vegetarienne","food-tartare-boeuf","food-legumes-grilles","food-pizza"],

"wine-domane-wachau-gruner-veltliner-selection":
["food-sushis","food-crevettes","food-salade-chevre","food-pesto"],

"wine-dr-loosen-riesling-mosel-2025":
["food-cuisine-epicee","food-curry","food-cuisine-asiatique-sucree-salee","food-tarte-aux-fruits"],

"wine-domaine-du-ridge-fado":
["food-chocolat","food-fromages","food-creme-brulee","food-dessert-vanille"],

"wine-famille-perrin-cotes-du-rhone-signature-2023":
["food-burger","food-pates-sauce-tomate","food-saucisses","food-pizza"],

"wine-ferraton-pere-et-fils-syrah":
["food-steak-grillades","food-agneau","food-saucisses","food-tourtiere"],

"wine-georges-duboeuf-brouilly":
["food-planche-charcuteries","food-burger","food-tartare-boeuf","food-poulet-roti"],

"wine-john-doe-2025":
["food-planche-charcuteries","food-pizza","food-tartare-boeuf","food-poulet-roti"],

"wine-kendall-jackson-vintners-reserve-chardonnay":
["food-poulet-roti","food-pates-cremeuses","food-homard","food-saumon"],

"wine-lorpailleur-blanc-2025":
["food-poisson-fruits-de-mer","food-sushis","food-crevettes","food-salade-chevre"],

"wine-l-orpailleur-brut":
["food-crabe","food-huitres","food-poulet-frit","food-planche-charcuteries"],

"wine-la-chablisienne-chablis-la-sereine":
["food-huitres","food-petoncles","food-moules","food-tartare-saumon"],

"wine-la-sablette-muscadet-sevre-et-maine-sur-lie":
["food-huitres","food-moules","food-crevettes","food-poisson-fruits-de-mer"],

"wine-domaine-bergeville-le-blanc-2024":
["food-huitres","food-crabe","food-petoncles","food-poulet-frit"],

"wine-domaine-du-ridge-le-batonnier":
["food-steak-grillades","food-agneau","food-tourtiere","food-bbq-cotes-levees"],

"wine-domaine-bergeville-le-rose-2024":
["food-tartare-saumon","food-crevettes","food-crabe","food-poulet-frit"],

"wine-domaine-du-ridge-le-stanbridge":
["food-thon","food-poulet-roti","food-poisson-grille","food-pates-cremeuses"],

"wine-domaine-bergeville-le-soleil-s-en-est-mele-2025":
["food-pizza","food-planche-charcuteries","food-poulet-roti","food-tartare-boeuf"],

"wine-domaine-du-ridge-seyval-vidal":
["food-sushis","food-salade-chevre","food-cuisine-asiatique-sucree-salee","food-crevettes"],

"wine-domaine-du-ridge-les-petites-cuvees-vidal-brut":
["food-crabe","food-huitres","food-poisson-fruits-de-mer","food-poulet-frit"],

"wine-les-pervenches-les-rosiers-2024":
["food-poulet-roti","food-fromages","food-pates-cremeuses","food-homard"],

"wine-loimer-lois-gruner-veltliner-2023":
["food-cuisine-vegetarienne","food-petoncles","food-poisson-grille","food-salade-chevre"],

"wine-louis-jadot-bourgogne-couvent-des-jacobins-2023":
["food-canard","food-porc","food-veau","food-champignons"],

"wine-les-pervenches-lesperance-2025":
["food-cuisine-asiatique-sucree-salee","food-curry","food-fromages","food-cuisine-epicee"],

"wine-domaine-du-ridge-l-honorable-1-litre":
["food-steak-grillades","food-canard","food-agneau","food-bbq-cotes-levees"],

"wine-domaine-bergeville-l-integrale":
["food-huitres","food-petoncles","food-crabe","food-poulet-frit"],

"wine-les-pervenches-macpel-pgg-2024":
["food-cuisine-epicee","food-fromages","food-cuisine-vegetarienne","food-curry"],

"wine-mapu-cabernet-sauvignon-carmenere":
["food-steak-grillades","food-burger","food-bbq-cotes-levees","food-saucisses"],

"wine-martin-codax-albarino-rias-baixas-2025":
["food-sushis","food-poisson-fruits-de-mer","food-homard","food-crevettes"],

"wine-masi-campofiorin-verona":
["food-agneau","food-bbq-cotes-levees","food-lasagne","food-pates-sauce-tomate"],

"wine-mazzei-fonterutoli-chianti-classico-2023":
["food-agneau","food-steak-grillades","food-lasagne","food-pates-sauce-tomate"],

"wine-meinklang-kontakt-2024":
["food-cuisine-vegetarienne","food-risotto","food-champignons","food-legumes-grilles"],

"wine-marcel-lapierre-morgon-2025":
["food-planche-charcuteries","food-poulet-roti","food-saucisses","food-champignons"],

"wine-mouton-cadet-bordeaux-rouge":
["food-steak-grillades","food-burger","food-agneau","food-tourtiere"],

"wine-pares-balta-cava-brut":
["food-huitres","food-poulet-frit","food-crabe","food-planche-charcuteries"],

"wine-pieropan-soave-classico":
["food-cuisine-vegetarienne","food-homard","food-petoncles","food-poisson-grille"],

"wine-les-pervenches-pinot-zweigelt-2025":
["food-canard","food-champignons","food-planche-charcuteries","food-tartare-boeuf"],

"wine-domaine-bergeville-plus-petit-que-2025":
["food-huitres","food-crabe","food-poulet-frit","food-planche-charcuteries"],

"wine-les-pervenches-pur-pinot-2025":
["food-canard","food-champignons","food-saumon","food-porc"],

"wine-trimbach-riesling-2023":
["food-sushis","food-cuisine-asiatique-sucree-salee","food-poulet-frit","food-salade-chevre"],

"wine-domaine-du-ridge-rose-domaine-du-ridge":
["food-saumon","food-salade-chevre","food-poulet-roti","food-tartare-saumon"],

"wine-domaine-du-ridge-rouge-domaine-du-ridge":
["food-tartare-boeuf","food-lasagne","food-raclette","food-saucisses"],

"wine-ruffino-chianti":
["food-pizza","food-pates-sauce-tomate","food-lasagne","food-saucisses"],

"wine-domaine-du-ridge-saint-martin":
["food-fromages","food-fruits-dessert-leger","food-creme-brulee","food-dessert-vanille"],

"wine-schieferkopf-riesling-trocken-sec-2023":
["food-sushis","food-poulet-frit","food-tartare-saumon","food-salade-chevre"],

"wine-segura-viudas-brut-organic":
["food-huitres","food-crevettes","food-poulet-frit","food-crabe"],

"wine-les-pervenches-seyval-chardo-2025":
["food-poisson-grille","food-sushis","food-poulet-roti","food-pates-cremeuses"],

"wine-torres-las-pisadas-rioja":
["food-steak-grillades","food-bbq-cotes-levees","food-agneau","food-saucisses"],

"wine-trop-content-chenin-blanc-2025":
["food-fromages","food-saumon","food-pates-cremeuses","food-poisson-grille"],

"wine-vidal-fleury-cotes-du-rhone":
["food-bbq-cotes-levees","food-agneau","food-saucisses","food-steak-grillades"],

"wine-whispering-angel-cotes-de-provence-2025":
["food-saumon","food-poisson-grille","food-thon","food-tartare-saumon"],

"wine-william-fevre-chablis-les-champs-royaux-2023":
["food-huitres","food-crevettes","food-moules","food-sushis"],

"wine-zenato-valpolicella-superiore":
["food-pizza","food-pates-sauce-tomate","food-canard","food-lasagne"]
};

const audit = JSON.parse(
  fs.readFileSync("food-pairings-to-fix.json", "utf8")
);

const auditIds = new Set(audit.map(w => w._id));
const fixIds = Object.keys(fixes);

let errors = 0;

console.log("\n=== LPV — DRY RUN ACCORDS ===\n");

if (fixIds.length !== 72) {
  console.error(`❌ Le plan contient ${fixIds.length} fiches au lieu de 72.`);
  errors++;
}

for (const wine of audit) {
  const pairings = fixes[wine._id];

  if (!pairings) {
    console.error(`❌ MANQUANT : ${wine.name} (${wine._id})`);
    errors++;
    continue;
  }

  if (pairings.length !== 4) {
    console.error(`❌ ${wine.name}: ${pairings.length} accords`);
    errors++;
  }

  if (new Set(pairings).size !== 4) {
    console.error(`❌ ${wine.name}: accord en double`);
    errors++;
  }

  for (const ref of pairings) {
    if (!FOOD.has(ref)) {
      console.error(`❌ ${wine.name}: food ID inconnu → ${ref}`);
      errors++;
    }
  }

  console.log(`✓ ${wine.name}`);
  console.log(`  ${pairings.join(" | ")}`);
}

for (const id of fixIds) {
  if (!auditIds.has(id)) {
    console.error(`❌ ID du plan absent de l'audit : ${id}`);
    errors++;
  }
}

console.log("\n--------------------------------");
console.log(`Fiches audit : ${audit.length}`);
console.log(`Fiches planifiées : ${fixIds.length}`);
console.log(`Accords planifiés : ${fixIds.length * 4}`);

if (errors === 0) {
  console.log("\n✅ DRY RUN RÉUSSI");
  console.log("✅ 72/72 bouteilles");
  console.log("✅ 288 accords");
  console.log("✅ exactement 4 accords uniques par bouteille");
  console.log("✅ tous les food IDs appartiennent à la liste autorisée");
  console.log("🛑 AUCUNE ÉCRITURE SANITY EFFECTUÉE");
} else {
  console.log(`\n❌ ${errors} erreur(s) — aucune écriture effectuée`);
  process.exitCode = 1;
}

if (errors === 0 && process.argv.includes("--write")) {
  if (!client.config().token) {
    throw new Error("SANITY_API_WRITE_TOKEN manquant");
  }

  console.log("\n=== ÉCRITURE SANITY ===\n");

  for (const wine of audit) {
    const refs = fixes[wine._id].map((ref, i) => ({
      _key: `pairing-${i + 1}-${ref.replace(/^food-/, "")}`,
      _type: "reference",
      _ref: ref
    }));

    await client
      .patch(wine._id)
      .set({foodPairings: refs})
      .commit();

    console.log(`✓ ${wine.name}`);
  }

  console.log("\n✅ 72 fiches mises à jour dans Sanity");
  console.log("✅ 288 références foodPairings écrites");
} else if (errors === 0) {
  console.log("\nℹ️ Dry-run seulement. Utiliser --write pour écrire.");
}
