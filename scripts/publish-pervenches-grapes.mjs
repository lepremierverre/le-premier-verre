import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "czq6bjyu",
  dataset: "production",
  apiVersion: "2025-08-15",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
});

if (!client.config().token) throw new Error("Token Sanity absent.");

const ids = [
  "grape-chardonnay",
  "grape-gewurztraminer",
  "grape-pinot-gris",
  "grape-pinot-noir",
  "grape-seyval",
  "grape-zweigelt",
];

const docs = await client.fetch(
  `*[_id in $ids]{
    _id,name,published,
    oneLiner,oneLinerEn,
    aromas,aromasEn,
    body,acidity,tannins,
    servingTemperature,
    simplePairings,simplePairingsEn,
    mainRegions,
    tryNext
  }`,
  {ids}
);

const errors = [];

for (const id of ids) {
  const d = docs.find(x => x._id === id);

  if (!d) {
    errors.push(`${id}: document absent`);
    continue;
  }

  if (!d.oneLiner || !d.oneLinerEn)
    errors.push(`${d.name}: oneLiner FR/EN`);
  if (d.aromas?.length < 3 || d.aromasEn?.length < 3)
    errors.push(`${d.name}: arômes FR/EN`);
  if (d.simplePairings?.length !== 4 || d.simplePairingsEn?.length !== 4)
    errors.push(`${d.name}: accords FR/EN`);
  if (!d.mainRegions?.length)
    errors.push(`${d.name}: régions`);
  if (d.tryNext?.length < 2)
    errors.push(`${d.name}: tryNext`);
  if (![d.body,d.acidity,d.tannins].every(v => Number.isFinite(v)))
    errors.push(`${d.name}: profil technique`);
  if (!d.servingTemperature)
    errors.push(`${d.name}: température`);
}

if (errors.length) {
  console.log("❌ Publication annulée");
  errors.forEach(x => console.log(`❌ ${x}`));
  process.exit(1);
}

for (const id of ids) {
  await client.patch(id).set({published: true}).commit();
}

const check = await client.fetch(
  `*[_id in $ids] | order(name asc){name,published}`,
  {ids}
);

console.log("\n✓ CÉPAGES PERVENCHES");
for (const x of check) {
  console.log(`${x.published ? "✓" : "❌"} ${x.name}`);
}

if (
  check.length !== ids.length ||
  check.some(x => x.published !== true)
) {
  process.exit(1);
}

console.log("\n✓ 6/6 publiés");
console.log("✓ contenu FR + EN conservé");
console.log("✓ aucune fiche cépage à reprendre");
