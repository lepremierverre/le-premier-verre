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
    (
      producer->name match "*Bergeville*" ||
      producer._ref == "bb61af16-e4c6-42ad-968c-edd0752d054c"
    )
  ]{
    _id,
    name,
    "producerName": producer->name,
    "fields": array::join(string::split(string(_id), " "), "")
  }
`);

const full = await Promise.all(
  wines.map(async (w) => ({
    ...w,
    doc: await client.getDocument(w._id)
  }))
);

const bergeville = full.filter(w =>
  w.producerName?.toLowerCase().includes("bergeville")
);

const ridge = full.filter(w =>
  w.producerName?.toLowerCase().includes("ridge")
);

console.log("\n===== EXEMPLES BERGEVILLE =====");
for (const w of bergeville.slice(0, 5)) {
  console.log(w.name, "|", w._id);
}

console.log("\n===== CHAMPS DU MODÈLE BERGEVILLE =====");

const model = bergeville
  .sort((a, b) =>
    Object.keys(b.doc || {}).length -
    Object.keys(a.doc || {}).length
  )[0];

if (!model) {
  throw new Error("Aucune fiche Bergeville trouvée.");
}

console.log("MODÈLE :", model.name);

const ignored = new Set([
  "_id", "_type", "_rev", "_createdAt", "_updatedAt"
]);

const modelKeys = Object.keys(model.doc)
  .filter(k => !ignored.has(k))
  .sort();

for (const key of modelKeys) {
  const value = model.doc[key];
  const type = Array.isArray(value)
    ? `array (${value.length})`
    : value === null
      ? "null"
      : typeof value;

  console.log(`${key} | ${type}`);
}

console.log("\n===== COMPARAISON RIDGE =====");

for (const w of ridge) {
  const missing = modelKeys.filter(
    key =>
      !(key in w.doc) ||
      w.doc[key] === null ||
      w.doc[key] === ""
  );

  console.log(`\n${w.name}`);
  console.log("Champs présents :", Object.keys(w.doc).length);
  console.log("Champs absents :", missing.join(", ") || "AUCUN");
}

console.log("\n✓ ANALYSE TERMINÉE — aucune modification.");
