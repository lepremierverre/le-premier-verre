import { createClient } from "@sanity/client";
import {
  TRANSLATABLE_TYPES,
  computeTranslationSourceHash,
  translateSanityDocument,
} from "../lib/translation/sanity-translator.ts";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

const dryRun = process.argv.includes("--dry-run");

const docs = await client.fetch(
  `*[
    _type in $types &&
    !(_id in path("drafts.**"))
  ] | order(_type asc, _id asc)`,
  { types: [...TRANSLATABLE_TYPES] }
);

let translated = 0;
let skipped = 0;
let errors = 0;

console.log(`\nDocuments trouvés : ${docs.length}`);
console.log(dryRun ? "MODE APERÇU — aucune écriture\n" : "MODE BACKFILL\n");

for (const [index, doc] of docs.entries()) {
  const label = `${doc._type} — ${doc.name || doc.title || doc._id}`;

  try {
    const hash = computeTranslationSourceHash(doc, doc._type);

    if (doc.translationSourceHash === hash) {
      skipped++;
      console.log(`[${index + 1}/${docs.length}] SKIP  ${label}`);
      continue;
    }

    if (dryRun) {
      translated++;
      console.log(`[${index + 1}/${docs.length}] À TRADUIRE  ${label}`);
      continue;
    }

    const patch = await translateSanityDocument(doc, doc._type);

    await client
      .patch(doc._id)
      .set({
        ...patch,
        translationSourceHash: hash,
      })
      .commit();

    translated++;
    console.log(`[${index + 1}/${docs.length}] OK    ${label}`);
  } catch (error) {
    errors++;
    console.error(`[${index + 1}/${docs.length}] ERREUR  ${label}`);
    console.error(error);
  }
}

console.log("\n===== RÉSULTAT =====");
console.log({
  total: docs.length,
  aTraduireOuTraduits: translated,
  dejaAJour: skipped,
  erreurs: errors,
  dryRun,
});
