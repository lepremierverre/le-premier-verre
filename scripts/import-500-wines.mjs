import { createClient } from "@sanity/client";
import crypto from "node:crypto";
import pigeonHillBatch from "./batch-pigeon-hill.mjs";
import bergevilleBatch from "./batch-bergeville.mjs";
import saqBatch01 from "./batch-saq-01.mjs";
import { normalizeBottleImage } from "./lib/normalize-bottle-image.mjs";

const client = createClient({
  projectId: "czq6bjyu",
  dataset: "production",
  apiVersion: "2025-08-15",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
});

const DRY_RUN = !process.argv.includes("--write");

const slugify = (value = "") =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const ref = (id, key) => ({
  _type: "reference",
  _ref: id,
  ...(key ? { _key: key } : {}),
});

const hash = (value) =>
  crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");

const existing = await client.fetch(`{
  "wines": *[_type == "wine"]{
    _id,name,vintage,sku,purchaseUrl,
    "slug":slug.current,
    "producer":producer->_id,
    "producerName":producer->name,
    published
  },
  "producers": *[_type == "producer"]{
    _id,name,"slug":slug.current,published
  },
  "grapes": *[_type == "grape"]{
    _id,name,"slug":slug.current,published
  },
  "countries": *[_type == "country"]{
    _id,name,"slug":slug.current,published
  },
  "regions": *[_type == "region"]{
    _id,name,"slug":slug.current,published
  },
  "appellations": *[_type == "appellation"]{
    _id,name,"slug":slug.current,published
  }
}`);

const index = (docs) =>
  new Map(
    docs.flatMap((doc) => [
      [doc._id, doc],
      [slugify(doc.name), doc],
      ...(doc.slug ? [[doc.slug, doc]] : []),
    ])
  );

const db = {
  wines: index(existing.wines),
  producers: index(existing.producers),
  grapes: index(existing.grapes),
  countries: index(existing.countries),
  regions: index(existing.regions),
  appellations: index(existing.appellations),
};

const resolve = (type, value) => {
  if (!value) return null;

  const found = db[type]?.get(value) || db[type]?.get(slugify(value));

  if (!found) {
    throw new Error(`Référence introuvable: ${type} → ${value}`);
  }

  return found;
};

const required = (value, label, wine) => {
  if (
    value === undefined ||
    value === null ||
    value === "" ||
    (Array.isArray(value) && !value.length)
  ) {
    throw new Error(`${wine}: champ obligatoire manquant → ${label}`);
  }
};

function validateWine(wine) {
  const label = wine.name || "(sans nom)";

  [
    ["name", wine.name],
    ["producer", wine.producer],
    ["country", wine.country],
    ["region", wine.region],
    ["approxPrice", wine.approxPrice],
    ["purchaseChannel", wine.purchaseChannel],
    ["purchaseUrl", wine.purchaseUrl],
    ["purchaseLastChecked", wine.purchaseLastChecked],
    ["oneLiner", wine.oneLiner],
    ["oneLinerEn", wine.oneLinerEn],
    ["tastingKeywords", wine.tastingKeywords],
    ["tastingKeywordsEn", wine.tastingKeywordsEn],
    ["perfectFor", wine.perfectFor],
    ["perfectForEn", wine.perfectForEn],
    ["whyWeRecommend", wine.whyWeRecommend],
    ["whyWeRecommendEn", wine.whyWeRecommendEn],
    ["body", wine.body],
    ["sweetness", wine.sweetness],
    ["roundness", wine.roundness],
    ["servingTemperature", wine.servingTemperature],
  ].forEach(([field, value]) => required(value, field, label));

  if ((wine.beverageType || "wine") === "wine") {
    required(wine.color, "color", label);
    required(wine.appellation, "appellation", label);
    required(wine.grapes, "grapes", label);
  }

  if (wine.tastingKeywords.length < 3 || wine.tastingKeywords.length > 5)
    throw new Error(`${label}: tastingKeywords doit contenir 3 à 5 éléments`);

  if (wine.tastingKeywordsEn.length < 3 || wine.tastingKeywordsEn.length > 5)
    throw new Error(`${label}: tastingKeywordsEn doit contenir 3 à 5 éléments`);

  if (wine.perfectFor.length < 2 || wine.perfectFor.length > 3)
    throw new Error(`${label}: perfectFor doit contenir 2 à 3 éléments`);

  if (wine.perfectForEn.length < 2 || wine.perfectForEn.length > 3)
    throw new Error(`${label}: perfectForEn doit contenir 2 à 3 éléments`);

  for (const field of ["body", "sweetness", "roundness"]) {
    if (wine[field] < 1 || wine[field] > 5)
      throw new Error(`${label}: ${field} doit être entre 1 et 5`);
  }
}

function buildWine(source) {
  validateWine(source);

  const producer = resolve("producers", source.producer);
  const country = resolve("countries", source.country);
  const region = resolve("regions", source.region);
  const appellation = source.appellation
    ? resolve("appellations", source.appellation)
    : null;

  const grapes = (source.grapes || []).map((name) =>
    resolve("grapes", name)
  );

  const slug =
    source.slug ||
    slugify(
      `${producer.name}-${source.name}${source.vintage ? `-${source.vintage}` : ""}`
    );

  const id = source._id || `wine-${slug}`;

  return {
    ...source,
    _id: id,
    _type: "wine",

    beverageType: source.beverageType || "wine",
    alcoholFree: source.alcoholFree ?? false,

    slug: {
      _type: "slug",
      current: slug,
    },

    producer: ref(producer._id),
    country: ref(country._id),
    region: ref(region._id),

    ...(appellation
      ? { appellation: ref(appellation._id) }
      : {}),

    grapes: grapes.map((grape) =>
      ref(grape._id, slugify(grape.name))
    ),

    translationSourceHash: hash({
      name: source.name,
      oneLiner: source.oneLiner,
      tastingKeywords: source.tastingKeywords,
      perfectFor: source.perfectFor,
      whyWeRecommend: source.whyWeRecommend,
    }),

    published: source.published ?? true,
  };
}

/*
 * Les manifests seront ajoutés ici.
 * IMPORTANT:
 * - faits commerciaux/techniques = sources vérifiées
 * - FR + EN toujours ensemble
 * - aucune référence libre
 * - aucune photo obligatoire
 */
const batches = [saqBatch01];

const incoming = batches.flatMap((batch) => batch.wines || []);

const report = {
  existingWines: existing.wines.length,
  incoming: incoming.length,
  valid: 0,
  invalid: 0,
  duplicates: [],
  errors: [],
  documents: [],
};

const normalize = (value = "") =>
  slugify(String(value).replace(/\b(19|20)\d{2}\b/g, ""));

const existingSkus = new Set(
  existing.wines.map((wine) => String(wine.sku || "").trim()).filter(Boolean)
);

const existingUrls = new Set(
  existing.wines.map((wine) => wine.purchaseUrl).filter(Boolean)
);

const existingIdentities = new Set(
  existing.wines.map((wine) =>
    `${normalize(wine.producerName)}::${normalize(wine.name)}::${wine.vintage || ""}`
  )
);

const seen = new Set(existing.wines.map((wine) => wine.slug).filter(Boolean));

const uploadBottleImage = async (document, source) => {
  if (!source.imageUrl) return document;

  const response = await fetch(source.imageUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/136 Safari/537.36",
      Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      Referer: "https://www.saq.com/",
    },
  });

  if (!response.ok) {
    throw new Error(
      `${source.name}: image SAQ impossible à télécharger (${response.status})`
    );
  }

  const contentType = response.headers.get("content-type") || "";

  if (!contentType.startsWith("image/")) {
    throw new Error(`${source.name}: l’URL image ne retourne pas une image`);
  }

  const sourceBuffer = Buffer.from(await response.arrayBuffer());

  const normalized = await normalizeBottleImage(sourceBuffer);

  const asset = await client.assets.upload("image", normalized.buffer, {
    filename: `lpv-${source.sku || document.slug.current}.png`,
    contentType: "image/png",
  });

  return {
    ...document,
    bottleImage: {
      _type: "image",
      asset: ref(asset._id),
    },
  };
};

for (const source of incoming) {
  try {
    let document = buildWine(source);

    const sku = String(source.sku || "").trim();
    const identity =
      `${normalize(resolve("producers", source.producer).name)}::${normalize(source.name)}::${source.vintage || ""}`;

    if (
      (sku && existingSkus.has(sku)) ||
      (source.purchaseUrl && existingUrls.has(source.purchaseUrl)) ||
      existingIdentities.has(identity) ||
      (seen.has(document.slug.current) && !source._id)
    ) {
      report.duplicates.push(
        `${source.name}${sku ? ` [SAQ ${sku}]` : ""}`
      );
      continue;
    }

    if (sku) existingSkus.add(sku);
    if (source.purchaseUrl) existingUrls.add(source.purchaseUrl);
    existingIdentities.add(identity);
    seen.add(document.slug.current);

    if (!DRY_RUN && source.imageUrl) {
      document = await uploadBottleImage(document, source);
    }

    delete document.imageUrl;

    report.documents.push(document);
    report.valid++;
  } catch (error) {
    report.invalid++;
    report.errors.push(error.message);
  }
}

console.log("\n════════════════════════════════════════════");
console.log("   LE PREMIER VERRE — IMPORT 500");
console.log("════════════════════════════════════════════");
console.log(`Vins actuels       : ${report.existingWines}`);
console.log(`Vins entrants      : ${report.incoming}`);
console.log(`Valides            : ${report.valid}`);
console.log(`Invalides          : ${report.invalid}`);
console.log(`Doublons bloqués   : ${report.duplicates.length}`);
console.log(`Projection totale  : ${report.existingWines + report.valid}`);
console.log("════════════════════════════════════════════\n");

if (report.errors.length) {
  console.log("ERREURS:");
  report.errors.forEach((e) => console.log(`  ❌ ${e}`));
}

if (report.duplicates.length) {
  console.log("\nDOUBLONS:");
  report.duplicates.forEach((e) => console.log(`  ⚠️ ${e}`));
}

if (DRY_RUN) {
  console.log("\nDRY RUN — aucune écriture Sanity.");
  console.log("Utiliser --write uniquement après validation.\n");
  process.exit(report.invalid ? 1 : 0);
}

if (report.invalid) {
  throw new Error("Import annulé : des fiches sont invalides.");
}

const transaction = client.transaction();

for (const document of report.documents) {
  transaction.createOrReplace(document);
}

if (report.documents.length) {
  await transaction.commit();
}

console.log(`✓ ${report.documents.length} vins écrits dans Sanity.`);
