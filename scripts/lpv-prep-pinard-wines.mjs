import { createClient } from "@sanity/client";
import fs from "node:fs";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

async function main() {
  console.log("\n===== 1. SCHÉMA WINE =====\n");

  const schema = "sanity/schemaTypes/wine.ts";

  if (fs.existsSync(schema)) {
    const lines = fs.readFileSync(schema, "utf8").split("\n");

    lines.forEach((line, index) => {
      if (
        /dna|recommend|confidence|source|purchase|price|grapes|appellation|color|published|oneLiner|tastingKeywords|perfectFor|beverageType/i.test(line)
      ) {
        const start = Math.max(0, index - 2);
        const end = Math.min(lines.length, index + 5);

        console.log(
          `\nL${index + 1}\n` +
          lines.slice(start, end).join("\n")
        );
      }
    });
  }

  console.log("\n===== 2. JOHN DOE =====\n");

  const john = await client.getDocument("wine-john-doe-2025");

  console.dir(john, { depth: null });

  console.log("\n===== 3. VINS AVEC DNA =====\n");

  const examples = await client.fetch(`
    *[
      _type == "wine" &&
      defined(dna)
    ][0...3]{
      _id,
      name,
      color,
      dna,
      dnaMetadata,
      purchaseChannel,
      purchaseLastChecked,
      published
    }
  `);

  console.dir(examples, { depth: null });

  console.log("\n===== 4. CÉPAGES EXISTANTS =====\n");

  const grapes = await client.fetch(`
    *[
      _type == "grape" &&
      (
        name match "*Crescent*" ||
        name match "*Itasca*" ||
        name match "*Frontenac*" ||
        name match "*Chardonnay*" ||
        name match "*Riesling*" ||
        name match "*Savagnin*" ||
        name match "*Hibernal*" ||
        name match "*Briana*" ||
        name match "*Pinot*" ||
        name match "*Meunier*"
      )
    ]{
      _id,
      name,
      "slug":slug.current
    } | order(name asc)
  `);

  console.dir(grapes, { depth: null });

  console.log("\n===== 5. VINS PINARD EXISTANTS =====\n");

  const pinard = await client.fetch(`
    *[
      _type == "wine" &&
      (
        producer._ref == "producer-pinard-et-filles" ||
        name match "*Jane Doe*" ||
        name match "*Frangine*" ||
        name match "*Piscine Blanche*" ||
        name match "*Supernova*"
      )
    ]{
      _id,
      name,
      "slug":slug.current,
      published,
      "producerId":producer._ref
    }
  `);

  console.dir(pinard, { depth: null });

  console.log("\n✓ Audit terminé");
  console.log("✓ Aucun document modifié");
}

main().catch(error => {
  console.error("\n❌", error);
  process.exit(1);
});
