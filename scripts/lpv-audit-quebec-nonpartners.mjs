import { createClient } from "@sanity/client";
import fs from "node:fs";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-08-15",
  useCdn: false,
});

async function main() {
  const producers = await client.fetch(`
    *[
      _type == "producer" &&
      !(_id in path("drafts.**"))
    ]{
      _id,
      name,
      "slug": slug.current,
      published,
      lpvPartner,
      producerType,
      municipality,
      address,
      website,
      instagram,
      "country": country->name,
      "countrySlug": country->slug.current,
      "region": region->name,
      "regionSlug": region->slug.current,
      "wineCount": count(*[
        _type == "wine" &&
        producer._ref == ^._id
      ]),
      "publishedWineCount": count(*[
        _type == "wine" &&
        producer._ref == ^._id &&
        published == true
      ]),
      "hasBio": defined(bio),
      "hasShortBio": defined(shortBio),
      "hasHero": defined(heroImage),
      "hasPhoto": defined(photo)
    }
  `);

  const quebecRegions = [
    "cantons-de-lest",
    "monteregie",
    "lanaudiere",
    "laurentides",
    "outaouais",
    "charlevoix",
    "capitale-nationale",
    "centre-du-quebec",
    "chaudiere-appalaches",
    "bas-saint-laurent",
    "gaspesie",
    "ile-dorleans",
    "mauricie",
    "estrie",
    "montreal",
    "laval",
    "saguenay",
  ];

  const normalize = value =>
    String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const isQuebec = p => {
    const country = normalize(p.country);
    const region = normalize(p.region);
    const regionSlug = normalize(p.regionSlug);
    const address = normalize(p.address);

    return (
      country.includes("canada") &&
      (
        quebecRegions.some(r =>
          regionSlug.includes(r)
        ) ||
        region.includes("quebec") ||
        address.includes("quebec") ||
        address.includes("qc")
      )
    );
  };

  const nonPartners = producers
    .filter(p => p.lpvPartner !== true)
    .filter(isQuebec)
    .sort((a, b) =>
      a.name.localeCompare(b.name, "fr")
    );

  const visible = nonPartners.filter(
    p => p.published === true && p.slug
  );

  const withWines = visible.filter(
    p => p.publishedWineCount > 0
  );

  const withoutWines = visible.filter(
    p => p.publishedWineCount === 0
  );

  const report = {
    generatedAt: new Date().toISOString(),
    totalProducers: producers.length,
    quebecNonPartners: nonPartners.length,
    visibleNonPartners: visible.length,
    visibleWithWines: withWines.length,
    visibleWithoutWines: withoutWines.length,
    producers: nonPartners,
  };

  fs.writeFileSync(
    "scripts/lpv-quebec-nonpartners-audit.json",
    JSON.stringify(report, null, 2)
  );

  console.log("\n===== INVENTAIRE LPV =====");
  console.log("Tous les producteurs :", producers.length);
  console.log("Québec non partenaires :", nonPartners.length);
  console.log("Fiches publiées :", visible.length);
  console.log("Avec vins publiés :", withWines.length);
  console.log("Sans vins publiés :", withoutWines.length);

  console.log("\n===== PRODUCTEURS VISIBLES =====");

  for (const p of visible) {
    console.log(
      `${p.name} | ${p.municipality || "Ville inconnue"} | ` +
      `${p.region || "Région inconnue"} | ` +
      `${p.publishedWineCount} vins | ${p.slug}`
    );
  }

  console.log("\n===== FICHES À VÉRIFIER =====");

  for (const p of nonPartners.filter(
    p => p.published !== true || !p.slug
  )) {
    console.log(
      `${p.name} | publié=${p.published} | slug=${p.slug}`
    );
  }

  console.log(
    "\n✓ Rapport sauvegardé dans scripts/lpv-quebec-nonpartners-audit.json"
  );
  console.log("✓ Aucune donnée modifiée");
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
