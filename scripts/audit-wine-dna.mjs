import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "czq6bjyu",
  dataset: "production",
  apiVersion: "2025-08-15",
  useCdn: false,
});

const wines = await client.fetch(`
  *[
    _type == "wine" &&
    published == true &&
    !(_id in path("drafts.**"))
  ] {
    _id,
    name,
    beverageType,
    color,
    body,
    acidity,
    tannins,
    sweetness,
    sugar,
    roundness,
    intensity,
    complexity,
    oakInfluence,
    fruitIntensity,
    minerality,
    savory
  }
`);

const fields = [
  "color",
  "body",
  "acidity",
  "tannins",
  "sweetness",
  "roundness",
  "intensity",
  "complexity",
  "oakInfluence",
  "fruitIntensity",
  "minerality",
  "savory",
];

console.log(`\nTOTAL : ${wines.length}\n`);

for (const field of fields) {
  const filled = wines.filter(
    (w) => w[field] !== undefined && w[field] !== null
  ).length;

  console.log(
    `${field.padEnd(16)} ${String(filled).padStart(3)}/${wines.length}  ${Math.round(
      (filled / wines.length) * 100
    )}%`
  );
}

const cider = wines.filter((w) => w.beverageType === "cider");
const wine = wines.filter((w) => w.beverageType !== "cider");

function completeness(items) {
  return items.map((item) => ({
    name: item.name,
    filled: fields.filter(
      (field) => item[field] !== undefined && item[field] !== null
    ).length,
  }));
}

console.log(`\nVINS : ${wine.length}`);
console.log(`CIDRES : ${cider.length}`);

console.log(`\nCIDRES — COMPLÉTUDE`);
for (const item of completeness(cider).sort((a, b) => a.filled - b.filled)) {
  console.log(`${String(item.filled).padStart(2)}/${fields.length}  ${item.name}`);
}

console.log(`\nBOUTEILLES LES MOINS COMPLÈTES`);
for (const item of completeness(wines)
  .sort((a, b) => a.filled - b.filled)
  .slice(0, 20)) {
  console.log(`${String(item.filled).padStart(2)}/${fields.length}  ${item.name}`);
}
