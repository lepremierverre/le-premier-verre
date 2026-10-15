import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "czq6bjyu",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  useCdn: false,
});

const docs = await client.fetch(`
  *[_type == "wine" && published == true] | order(producer->name asc, name asc) {
    ...,
    "producerName": producer->name,
    "producerPublished": producer->published,
    "producerSlug": producer->slug.current,
    "countryName": country->name,
    "regionName": region->name,
    "grapeNames": grapes[]->name,
    "foodPairingNames": foodPairings[]->name,
    "categoryNames": categories[]->name,
    "bottleAsset": bottleImage.asset._ref,
    "editorialAsset": editorialImage.asset._ref
  }
`);

const producers = await client.fetch(`
  *[_type == "producer" && published == true] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    website,
    instagram,
    "publishedProducts": count(*[
      _type == "wine" &&
      published == true &&
      producer._ref == ^._id
    ])
  }
`);

const issues = [];
const warnings = [];

function empty(v) {
  return (
    v === undefined ||
    v === null ||
    v === "" ||
    (Array.isArray(v) && v.length === 0)
  );
}

function add(arr, doc, field, message) {
  arr.push({
    producer: doc.producerName || "—",
    wine: doc.name || doc._id,
    id: doc._id,
    field,
    message,
  });
}

function requireField(doc, field, label = field) {
  if (empty(doc[field])) {
    add(issues, doc, field, `MANQUANT — ${label}`);
  }
}

function warnField(doc, field, label = field) {
  if (empty(doc[field])) {
    add(warnings, doc, field, `À VÉRIFIER — ${label}`);
  }
}

console.log("\n====================================================");
console.log(" LPV — AUDIT FINAL DE TOUTES LES FICHES PUBLIÉES");
console.log("====================================================");
console.log(`Produits publiés : ${docs.length}`);
console.log(`Producteurs publiés : ${producers.length}`);

for (const d of docs) {
  const cider = d.beverageType === "cider";

  // IDENTITÉ / STRUCTURE
  requireField(d, "name");
  requireField(d, "slug");
  requireField(d, "producer", "producteur");
  requireField(d, "beverageType", "type de boisson");
  requireField(d, "country", "pays");
  requireField(d, "region", "région");
  requireField(d, "style");

  if (!d.slug?.current) {
    add(issues, d, "slug.current", "MANQUANT — slug.current");
  }

  // IMAGES / NOUVEAU FORMAT
  if (!d.editorialAsset) {
    add(issues, d, "editorialImage", "MANQUANT — image éditoriale / nouveau format");
  }

  if (!d.bottleAsset) {
    add(warnings, d, "bottleImage", "À VÉRIFIER — aucune image bouteille");
  }

  // VIN VS CIDRE
  if (cider) {
    if (empty(d.appleVarieties)) {
      add(warnings, d, "appleVarieties", "À VÉRIFIER — variétés de pommes absentes");
    }

    if (!empty(d.grapes)) {
      add(warnings, d, "grapes", "INCOHÉRENCE — cidre avec cépages");
    }
  } else {
    if (empty(d.grapes)) {
      add(issues, d, "grapes", "MANQUANT — cépage(s)");
    }

    if (!empty(d.appleVarieties)) {
      add(warnings, d, "appleVarieties", "INCOHÉRENCE — vin avec variétés de pommes");
    }

    warnField(d, "color", "couleur");
  }

  // DONNÉES TECHNIQUES
  requireField(d, "alcoholFree", "indicateur sans alcool");
  warnField(d, "alcohol", "alcool");
  warnField(d, "bottleSize", "format bouteille");
  warnField(d, "sugar", "sucre");
  warnField(d, "servingTemperature", "température de service");

  if (empty(d.decant)) {
    // false est une vraie valeur, donc empty(false) = false
    if (d.decant !== false) {
      add(warnings, d, "decant", "À VÉRIFIER — carafage");
    }
  }

  // CONTENU ÉDITORIAL FR/EN
  requireField(d, "oneLiner", "one-liner FR");
  requireField(d, "oneLinerEn", "one-liner EN");
  requireField(d, "tastingKeywords", "mots-clés dégustation FR");
  requireField(d, "tastingKeywordsEn", "mots-clés dégustation EN");
  requireField(d, "perfectFor", "parfait pour FR");
  requireField(d, "perfectForEn", "parfait pour EN");
  requireField(d, "whyWeRecommend", "pourquoi on recommande FR");
  requireField(d, "whyWeRecommendEn", "pourquoi on recommande EN");

  warnField(d, "tastingNotes", "notes de dégustation FR");
  warnField(d, "tastingNotesEn", "notes de dégustation EN");
  warnField(d, "vinification", "vinification");

  // PROFIL SENSORIEL
  for (const field of [
    "body",
    "sweetness",
    "roundness",
    "acidity",
    "intensity",
    "complexity",
    "fruitIntensity",
    "minerality",
    "savory",
    "tannins",
    "oakInfluence",
  ]) {
    warnField(d, field, `profil sensoriel : ${field}`);

    if (
      !empty(d[field]) &&
      (typeof d[field] !== "number" || d[field] < 1 || d[field] > 5)
    ) {
      add(
        issues,
        d,
        field,
        `TYPE/VALEUR INVALIDE — attendu nombre 1–5, reçu ${JSON.stringify(d[field])}`
      );
    }
  }

  // ACCORDS
  // Ignorés dans l'audit final : non affichés sur la fiche LPV.

  // ACHAT
  warnField(d, "purchaseChannel", "canal d'achat");
  warnField(d, "purchaseUrl", "lien d'achat");

  if (
    !empty(d.purchaseChannel) &&
    !["saq", "SAQ", "private-import", "Importation privée", "producer", "Producteur", "other", "Autre"]
      .includes(d.purchaseChannel)
  ) {
    add(
      warnings,
      d,
      "purchaseChannel",
      `VALEUR NON STANDARD — ${d.purchaseChannel}`
    );
  }

  // SEO
  warnField(d, "seoTitle", "SEO title FR");
  warnField(d, "seoTitleEn", "SEO title EN");
  warnField(d, "seoDescription", "SEO description FR");
  warnField(d, "seoDescriptionEn", "SEO description EN");

  // TYPES À UNIFORMISER
  if (!empty(d.bottleSize) && typeof d.bottleSize !== "string") {
    add(
      issues,
      d,
      "bottleSize",
      `TYPE NON UNIFORME — attendu string, reçu ${typeof d.bottleSize}: ${d.bottleSize}`
    );
  }

  if (
    d.decant !== undefined &&
    d.decant !== null &&
    typeof d.decant !== "boolean"
  ) {
    add(
      issues,
      d,
      "decant",
      `TYPE NON UNIFORME — attendu boolean, reçu ${typeof d.decant}: ${JSON.stringify(d.decant)}`
    );
  }
}

// DOUBLONS
const slugMap = new Map();

for (const d of docs) {
  const slug = d.slug?.current;
  if (!slug) continue;

  if (!slugMap.has(slug)) slugMap.set(slug, []);
  slugMap.get(slug).push(d);
}

for (const [slug, matches] of slugMap) {
  if (matches.length > 1) {
    for (const d of matches) {
      add(
        issues,
        d,
        "slug",
        `DOUBLON — slug "${slug}" utilisé ${matches.length} fois`
      );
    }
  }
}

// PRODUCTEURS
const producerIssues = [];

for (const p of producers) {
  if (p.publishedProducts < 5) {
    producerIssues.push(
      `${p.name} — seulement ${p.publishedProducts}/5 produits publiés`
    );
  }

  if (!p.website) {
    producerIssues.push(`${p.name} — site web manquant`);
  }

  if (!p.instagram) {
    producerIssues.push(`${p.name} — Instagram manquant`);
  }
}

// RÉSUMÉ PAR PRODUCTEUR
console.log("\n===== COUVERTURE PAR PRODUCTEUR =====");

for (const p of producers) {
  const symbol = p.publishedProducts >= 5 ? "✓" : "✗";
  console.log(`${symbol} ${p.name}: ${p.publishedProducts} produit(s) publié(s)`);
}

// FICHES PAR PRODUCTEUR
console.log("\n===== ÉTAT DES FICHES =====");

let currentProducer = null;

for (const d of docs) {
  if (d.producerName !== currentProducer) {
    currentProducer = d.producerName;
    console.log(`\n--- ${currentProducer || "PRODUCTEUR INCONNU"} ---`);
  }

  const hard = issues.filter(x => x.id === d._id).length;
  const soft = warnings.filter(x => x.id === d._id).length;

  const icon = hard === 0 && soft === 0 ? "✓" : hard ? "✗" : "!";
  console.log(
    `${icon} ${d.name} | erreurs=${hard} | à vérifier=${soft} | ${d.beverageType || "?"}`
  );
}

// ERREURS
console.log("\n====================================================");
console.log(` ERREURS / INCOHÉRENCES : ${issues.length}`);
console.log("====================================================");

if (!issues.length) {
  console.log("✓ Aucune erreur structurelle détectée.");
} else {
  for (const i of issues) {
    console.log(
      `✗ ${i.producer} → ${i.wine} → ${i.field}\n  ${i.message}`
    );
  }
}

// WARNINGS
console.log("\n====================================================");
console.log(` INFORMATIONS À COMPLÉTER / VÉRIFIER : ${warnings.length}`);
console.log("====================================================");

if (!warnings.length) {
  console.log("✓ Aucun champ éditorial/technique manquant détecté.");
} else {
  for (const i of warnings) {
    console.log(
      `! ${i.producer} → ${i.wine} → ${i.field}\n  ${i.message}`
    );
  }
}

// PRODUCTEURS
console.log("\n====================================================");
console.log(` PRODUCTEURS À VÉRIFIER : ${producerIssues.length}`);
console.log("====================================================");

if (!producerIssues.length) {
  console.log("✓ Tous les producteurs publiés ont au moins 5 produits + leurs liens.");
} else {
  for (const i of producerIssues) console.log(`! ${i}`);
}

// TYPE SUMMARY
const typeSummary = {};

for (const d of docs) {
  for (const field of ["bottleSize", "decant", "foodPairings"]) {
    if (d[field] === undefined || d[field] === null) continue;

    let type = Array.isArray(d[field]) ? "array" : typeof d[field];

    typeSummary[field] ??= {};
    typeSummary[field][type] = (typeSummary[field][type] || 0) + 1;
  }
}

console.log("\n===== TYPES DE CHAMPS =====");
console.dir(typeSummary, { depth: null });

console.log("\n====================================================");

if (
  issues.length === 0 &&
  warnings.length === 0 &&
  producerIssues.length === 0
) {
  console.log("✓✓✓ LPV — AUDIT FINAL PARFAIT ✓✓✓");
  console.log("Toutes les fiches publiées sont complètes et uniformes.");
} else {
  console.log(
    `AUDIT TERMINÉ — ${issues.length} erreur(s), ` +
    `${warnings.length} vérification(s), ` +
    `${producerIssues.length} problème(s) producteur.`
  );
}

console.log("====================================================\n");
