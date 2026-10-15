import { createClient } from "@sanity/client";

const token =
  process.env.SANITY_API_WRITE_TOKEN ||
  process.env.SANITY_API_TOKEN;

if (!token) {
  throw new Error("Token Sanity manquant.");
}

const client = createClient({
  projectId: "czq6bjyu",
  dataset: "production",
  apiVersion: "2025-08-15",
  useCdn: false,
  token,
});

const fixes = [
  {
    id: "wine-bodegas-luis-gurpegui-muga-s-a-111-tempranillo-selection-special-rioja-2023",
    values: {
      intensity: 3,
      complexity: 3,
      oakInfluence: 2,
      fruitIntensity: 4,
      minerality: 2,
      savory: 3,
    },
  },
  {
    id: "wine-alois-lageder-spa-alois-lageder-pinot-bianco-sudtirol-alto-adige-2024-2024",
    values: {
      tannins: 1,
      intensity: 3,
      complexity: 3,
      oakInfluence: 1,
      fruitIntensity: 3,
      minerality: 4,
      savory: 2,
    },
  },
  {
    id: "wine-boland-cellar-boland-cellar-chenin-blanc-2025-2025",
    values: {
      tannins: 1,
      intensity: 3,
      complexity: 3,
      oakInfluence: 1,
      fruitIntensity: 4,
      minerality: 2,
      savory: 2,
    },
  },
  {
    id: "wine-abeille-fabre-sa-chateau-mont-redon-chateau-mont-redon-lirac",
    values: {
      intensity: 4,
      complexity: 4,
      oakInfluence: 3,
      fruitIntensity: 4,
      minerality: 2,
      savory: 4,
    },
  },
  {
    id: "wine-vina-cousino-macul-sa-cousino-macul-antiguas-reservas-valle-del-maipo",
    values: {
      intensity: 4,
      complexity: 4,
      oakInfluence: 3,
      fruitIntensity: 4,
      minerality: 2,
      savory: 4,
    },
  },
  {
    id: "wine-earl-gelin-domaine-des-nugues-beaujolais-villages-2024-2024",
    values: {
      intensity: 3,
      complexity: 3,
      oakInfluence: 1,
      fruitIntensity: 4,
      minerality: 3,
      savory: 2,
    },
  },
  {
    id: "wine-gerard-bertrand-gerard-bertrand-naturae-pays-d-oc",
    values: {
      tannins: 1,
      intensity: 3,
      complexity: 3,
      oakInfluence: 1,
      fruitIntensity: 4,
      minerality: 2,
      savory: 2,
    },
  },
  {
    id: "wine-kir-yianni-sa-kir-yianni-assyrtiko",
    values: {
      tannins: 1,
      intensity: 3,
      complexity: 4,
      oakInfluence: 1,
      fruitIntensity: 3,
      minerality: 5,
      savory: 3,
    },
  },
  {
    id: "wine-louis-bouillot-louis-bouillot-perle-rare-cremant-de-bourgogne-2022-2022",
    values: {
      tannins: 1,
      intensity: 4,
      complexity: 4,
      oakInfluence: 1,
      fruitIntensity: 3,
      minerality: 4,
      savory: 3,
    },
  },
  {
    id: "wine-gestioni-piccini-srl-piccini-chianti-classico-riserva",
    values: {
      intensity: 4,
      complexity: 4,
      oakInfluence: 4,
      fruitIntensity: 3,
      minerality: 2,
      savory: 4,
    },
  },
];

let tx = client.transaction();

for (const fix of fixes) {
  tx = tx.patch(fix.id, (patch) => patch.set(fix.values));
}

await tx.commit();

console.log(`✅ ${fixes.length} vins complétés.`);

const check = await client.fetch(`
  *[_id in $ids] | order(name asc) {
    name,
    tannins,
    intensity,
    complexity,
    oakInfluence,
    fruitIntensity,
    minerality,
    savory
  }
`, { ids: fixes.map((f) => f.id) });

for (const wine of check) {
  console.log(
    `${wine.name} → ` +
    `T${wine.tannins} I${wine.intensity} C${wine.complexity} ` +
    `B${wine.oakInfluence} F${wine.fruitIntensity} ` +
    `M${wine.minerality} S${wine.savory}`
  );
}
