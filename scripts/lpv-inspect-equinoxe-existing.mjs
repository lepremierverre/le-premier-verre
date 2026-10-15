import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "czq6bjyu",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  useCdn: false,
});

const docs = await client.fetch(`
  *[
    _type == "wine" &&
    (
      producer._ref == "producer-ferme-cidricole-equinoxe" ||
      lower(name) in [
        "lueur",
        "éclipse",
        "eclipse",
        "balade",
        "imposteur",
        "zéphyr",
        "zephyr"
      ]
    )
  ] | order(name asc) {
    ...,
    "producerName": producer->name,
    "countryName": country->name,
    "regionName": region->name,
    "foodPairingNames": foodPairings[]->name
  }
`);

console.log("\n===== ÉQUINOXE — DOCUMENTS EXISTANTS =====");

if (!docs.length) {
  console.log("✓ Aucun cidre Équinoxe existant — création propre possible.");
} else {
  console.log(`Trouvés : ${docs.length}`);
  for (const doc of docs) {
    console.log("\n-----------------------------------");
    console.log("NOM :", doc.name);
    console.log("ID  :", doc._id);
    console.dir(doc, { depth: null });
  }
}

console.log("\n===== FIN =====");
