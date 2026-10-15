import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "czq6bjyu",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  useCdn: false,
});

const docs = await client.fetch(`
  *[_type == "wine" && published == true] | order(producer->name asc, name asc) {
    _id,
    name,
    "slug": slug.current,
    beverageType,
    alcoholFree,
    color,

    oneLiner,
    oneLinerEn,

    tastingKeywords,
    tastingKeywordsEn,

    perfectFor,
    perfectForEn,

    whyWeRecommend,
    whyWeRecommendEn,

    tastingNotes,
    tastingNotesEn,

    appleVarieties,
    grapes[]->{_id, name},

    servingTemperature,
    decant,

    body,
    sweetness,
    roundness,

    purchaseChannel,
    purchaseUrl,
    purchaseChannelDetails,
    purchaseChannelDetailsEn,

    "editorialImage": editorialImage.asset._ref,
    "bottleImage": bottleImage.asset._ref,

    "producer": producer->name
  }
`);

const empty = v =>
  v === undefined ||
  v === null ||
  v === "" ||
  (Array.isArray(v) && v.length === 0);

let critical = [];
let visible = [];
let optional = [];

function add(bucket, d, field, message) {
  bucket.push({
    producer: d.producer || "—",
    wine: d.name,
    field,
    message
  });
}

for (const d of docs) {

  // ==================================================
  // CRITIQUE : la fiche est réellement incomplète
  // ==================================================

  if (!d.editorialImage)
    add(critical, d, "editorialImage", "image éditoriale absente");

  if (empty(d.oneLiner))
    add(critical, d, "oneLiner", "accroche FR absente");

  if (empty(d.oneLinerEn))
    add(critical, d, "oneLinerEn", "accroche EN absente");

  if (empty(d.tastingKeywords))
    add(critical, d, "tastingKeywords", "mots-clés FR absents");

  if (empty(d.tastingKeywordsEn))
    add(critical, d, "tastingKeywordsEn", "mots-clés EN absents");

  if (empty(d.perfectFor))
    add(critical, d, "perfectFor", "moment idéal FR absent");

  if (empty(d.perfectForEn))
    add(critical, d, "perfectForEn", "moment idéal EN absent");

  if (empty(d.whyWeRecommend))
    add(critical, d, "whyWeRecommend", "recommandation LPV FR absente");

  if (empty(d.whyWeRecommendEn))
    add(critical, d, "whyWeRecommendEn", "recommandation LPV EN absente");

  if (d.beverageType === "cider") {
    if (empty(d.appleVarieties))
      add(visible, d, "appleVarieties", "variétés de pommes absentes");
  } else {
    if (empty(d.grapes))
      add(critical, d, "grapes", "cépages absents");
  }

  // ==================================================
  // VISIBLE : le site affiche un trou / À compléter
  // ==================================================

  if (empty(d.servingTemperature))
    add(visible, d, "servingTemperature", 'le site affiche "À compléter / To be added"');

  if (d.decant === undefined || d.decant === null)
    add(visible, d, "decant", "carafage non défini");

  // Notes : section simplement absente si vide
  if (empty(d.tastingNotes))
    add(visible, d, "tastingNotes", "section notes de dégustation FR absente");

  if (empty(d.tastingNotesEn))
    add(visible, d, "tastingNotesEn", "section notes de dégustation EN absente");

  // ==================================================
  // ACHAT : section facultative, mais utile
  // ==================================================

  if (empty(d.purchaseChannel) && empty(d.purchaseUrl))
    add(optional, d, "purchase", "aucune information d'achat");

  // ==================================================
  // IMAGE BOUTEILLE
  // Pas critique : le nouveau layout utilise surtout
  // l'image éditoriale. On la signale séparément.
  // ==================================================

  if (!d.bottleImage)
    add(optional, d, "bottleImage", "image bouteille absente");

  // ==================================================
  // PROFIL SENSORIEL
  // Le frontend utilise 3/5 par défaut.
  // On signale seulement; on n'invente rien.
  // ==================================================

  for (const field of ["body", "sweetness", "roundness"]) {
    if (empty(d[field]))
      add(optional, d, field, "fallback frontend = 3/5");
  }
}

function print(title, arr) {
  console.log("\n====================================================");
  console.log(` ${title} : ${arr.length}`);
  console.log("====================================================");

  if (!arr.length) {
    console.log("✓ Aucun.");
    return;
  }

  let producer = null;

  for (const x of arr) {
    if (x.producer !== producer) {
      producer = x.producer;
      console.log(`\n--- ${producer} ---`);
    }

    console.log(`! ${x.wine} → ${x.field}`);
    console.log(`  ${x.message}`);
  }
}

console.log("\n====================================================");
console.log(" LPV — AUDIT RÉEL DES FICHES AVANT LANCEMENT");
console.log("====================================================");
console.log(`Fiches publiées : ${docs.length}`);

print("À CORRIGER AVANT LANCEMENT", critical);
print("TROUS VISIBLES À COMPLÉTER", visible);
print("FACULTATIF / PEUT RESTER TEL QUEL", optional);

console.log("\n====================================================");

if (!critical.length && !visible.length) {
  console.log("✓✓✓ FICHES LPV PRÊTES POUR LE LANCEMENT ✓✓✓");
} else {
  console.log(
    `RESTE : ${critical.length} critique(s) + ${visible.length} trou(s) visible(s).`
  );
}

console.log("====================================================\n");
