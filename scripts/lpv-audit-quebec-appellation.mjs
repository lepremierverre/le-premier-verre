import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: false,
});

async function main() {
  console.log("\n===== LES DEUX APPELLATIONS =====");

  const appellations = await client.fetch(`
    *[
      _type == "appellation" &&
      _id in [
        "2acd9265-a02e-4b7c-a803-e702742f10cc",
        "appellation-igp-vin-du-quebec"
      ]
    ]{
      _id,
      name,
      "slug": slug.current,
      country->{name},
      region->{name}
    }
  `);

  console.log(JSON.stringify(appellations, null, 2));

  console.log("\n===== VINS QUI UTILISENT VIN DU QUÉBEC =====");

  const wines = await client.fetch(`
    *[
      _type == "wine" &&
      defined(appellation._ref) &&
      appellation._ref in [
        "2acd9265-a02e-4b7c-a803-e702742f10cc",
        "appellation-igp-vin-du-quebec"
      ]
    ] | order(producer->name asc, name asc) {
      _id,
      name,
      vintage,
      published,
      "producer": producer->name,
      "country": country->name,
      "region": region->name,
      "appellationId": appellation._ref,
      "appellation": appellation->name,
      "appellationSlug": appellation->slug.current
    }
  `);

  console.log(JSON.stringify(wines, null, 2));

  console.log("\n===== COMPTE PAR APPELLATION =====");

  for (const id of [
    "2acd9265-a02e-4b7c-a803-e702742f10cc",
    "appellation-igp-vin-du-quebec",
  ]) {
    const matching = wines.filter(
      (wine) => wine.appellationId === id
    );

    console.log(
      id,
      "=>",
      matching.length,
      "vin(s)"
    );
  }

  console.log("\n===== AUTRES VINS QUÉBÉCOIS PUBLIÉS =====");

  const quebecWines = await client.fetch(`
    *[
      _type == "wine" &&
      published == true &&
      country->name match "Canada" &&
      (
        region->name match "Montérégie" ||
        region->name match "Estrie" ||
        region->name match "Québec"
      )
    ] | order(producer->name asc, name asc) {
      name,
      vintage,
      "producer": producer->name,
      "region": region->name,
      "appellation": appellation->name,
      "appellationId": appellation._ref
    }
  `);

  console.log(JSON.stringify(quebecWines, null, 2));

  console.log("\n✓ AUDIT TERMINÉ");
  console.log("Aucune donnée modifiée.");
}

main().catch((error) => {
  console.error("\nERREUR :", error.message);
  process.exit(1);
});
