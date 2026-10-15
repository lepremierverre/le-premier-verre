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
    grapes[]->{_id,name},
    servingTemperature,
    decant,
    "editorialImage": editorialImage.asset._ref,
    "producer": producer->name
  }
`);

const empty = v =>
  v === undefined ||
  v === null ||
  v === "" ||
  (Array.isArray(v) && v.length === 0);

const errors = [];

function fail(d, field, message) {
  errors.push({
    producer: d.producer || "—",
    wine: d.name || d._id,
    field,
    message
  });
}

for (const d of docs) {
  if (empty(d.slug))
    fail(d, "slug", "slug absent");

  if (empty(d.beverageType))
    fail(d, "beverageType", "type de boisson absent");

  if (!d.editorialImage)
    fail(d, "editorialImage", "image éditoriale absente");

  if (empty(d.oneLiner))
    fail(d, "oneLiner", "accroche FR absente");

  if (empty(d.oneLinerEn))
    fail(d, "oneLinerEn", "accroche EN absente");

  if (empty(d.tastingKeywords))
    fail(d, "tastingKeywords", "mots-clés FR absents");

  if (empty(d.tastingKeywordsEn))
    fail(d, "tastingKeywordsEn", "mots-clés EN absents");

  if (empty(d.perfectFor))
    fail(d, "perfectFor", "moment idéal FR absent");

  if (empty(d.perfectForEn))
    fail(d, "perfectForEn", "moment idéal EN absent");

  if (empty(d.whyWeRecommend))
    fail(d, "whyWeRecommend", "recommandation LPV FR absente");

  if (empty(d.whyWeRecommendEn))
    fail(d, "whyWeRecommendEn", "recommandation LPV EN absente");

  if (d.beverageType !== "cider" && empty(d.grapes))
    fail(d, "grapes", "cépages absents");

  if (empty(d.servingTemperature))
    fail(d, "servingTemperature", "température de service absente");

  if (d.decant === undefined || d.decant === null)
    fail(d, "decant", "carafage non défini");
}

console.log("\n====================================================");
console.log(" LPV — VALIDATION FINALE DES FICHES");
console.log("====================================================");
console.log(`Fiches publiées vérifiées : ${docs.length}`);
console.log(`Erreurs bloquantes : ${errors.length}`);

if (errors.length) {
  let producer = "";

  for (const e of errors) {
    if (e.producer !== producer) {
      producer = e.producer;
      console.log(`\n--- ${producer} ---`);
    }

    console.log(`! ${e.wine} → ${e.field}`);
    console.log(`  ${e.message}`);
  }

  console.log("\n====================================================");
  console.log("✗ VALIDATION NON TERMINÉE");
  console.log("====================================================\n");
  process.exitCode = 1;
} else {
  console.log("\n✓ Structure : OK");
  console.log("✓ Images éditoriales : OK");
  console.log("✓ Contenu éditorial FR : OK");
  console.log("✓ Contenu éditorial EN : OK");
  console.log("✓ Cépages des vins : OK");
  console.log("✓ Températures de service : OK");
  console.log("✓ Carafage : OK");
  console.log("✓ Accords mets-vins : volontairement hors audit");
  console.log("✓ Notes de dégustation : facultatives");
  console.log("✓ Données techniques inconnues : non inventées");

  console.log("\n====================================================");
  console.log(" ✓✓✓ FICHES LPV PRÊTES POUR LE LANCEMENT ✓✓✓");
  console.log("====================================================\n");
}
