import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "czq6bjyu",
  dataset: "production",
  apiVersion: "2025-08-15",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
});

const WRITE = process.argv.includes("--write");

const ref = (id, key) => ({
  _type: "reference",
  _ref: id,
  ...(key ? { _key: key } : {}),
});

const regions = await client.fetch(`*[_type=="region" && slug.current in [
  "quebec",
  "cantons-de-l-est",
  "monteregie"
]]{_id,name,"slug":slug.current}`);

const grapes = await client.fetch(`*[_type=="grape"]{
  _id,name,"slug":slug.current,published
}`);

const regionBySlug = new Map(regions.map(x => [x.slug, x]));
const grapeBySlug = new Map(grapes.map(x => [x.slug, x]));

function region(slug) {
  const x = regionBySlug.get(slug);
  if (!x) throw new Error("Région introuvable: " + slug);
  return ref(x._id, slug);
}

function grape(slug) {
  const x = grapeBySlug.get(slug);
  if (!x) throw new Error("Cépage introuvable: " + slug);
  return ref(x._id, slug);
}

const acadie = {
  _id: "grape-acadie-blanc",
  _type: "grape",
  name: "Acadie blanc",
  slug: {_type:"slug", current:"acadie-blanc"},
  color: "white",

  oneLiner:
    "Un cépage blanc hybride bien adapté aux climats frais, apprécié pour sa fraîcheur, son fruit délicat et sa polyvalence dans les vins tranquilles comme effervescents.",
  oneLinerEn:
    "A white hybrid grape well suited to cool climates, valued for its freshness, delicate fruit and versatility in both still and sparkling wines.",

  aromas: [
    "Pomme",
    "Poire",
    "Agrumes",
    "Fleurs blanches"
  ],
  aromasEn: [
    "Apple",
    "Pear",
    "Citrus",
    "White flowers"
  ],

  body: 2,
  acidity: 4,
  tannins: 1,
  servingTemperature: "8–10 °C",

  simplePairings: [
    "Fruits de mer",
    "Poisson blanc",
    "Fromage doux",
    "Apéro"
  ],
  simplePairingsEn: [
    "Seafood",
    "White fish",
    "Mild cheese",
    "Aperitif"
  ],

  mainRegions: [
    region("quebec"),
    region("cantons-de-l-est")
  ],

  tryNext: [
    {
      _key:"vidal",
      grape:grape("vidal"),
      reason:"Pour découvrir un autre hybride blanc polyvalent et bien adapté au climat québécois.",
      reasonEn:"To discover another versatile white hybrid well suited to Quebec's climate."
    },
    {
      _key:"seyval",
      grape:grape("seyval"),
      reason:"Pour rester dans un registre frais, léger et nordique.",
      reasonEn:"For another fresh, light northern expression."
    },
    {
      _key:"frontenac-blanc",
      grape:grape("frontenac-blanc"),
      reason:"Pour une expression plus vive et structurée des blancs hybrides de climat froid.",
      reasonEn:"For a livelier, more structured expression of cold-climate hybrid whites."
    }
  ],

  published: true
};

const geisenheim = {
  _id: "grape-geisenheim",
  _type: "grape",
  name: "Geisenheim",
  slug: {_type:"slug", current:"geisenheim"},
  color: "white",

  oneLiner:
    "Un cépage blanc de climat frais capable de conserver une belle vivacité tout en apportant un profil fruité et aromatique aux assemblages.",
  oneLinerEn:
    "A cool-climate white grape capable of retaining lively acidity while bringing a fruity, aromatic profile to blends.",

  aromas: [
    "Pomme",
    "Poire",
    "Agrumes",
    "Fleurs"
  ],
  aromasEn: [
    "Apple",
    "Pear",
    "Citrus",
    "Floral"
  ],

  body: 2,
  acidity: 4,
  tannins: 1,
  servingTemperature: "8–10 °C",

  simplePairings: [
    "Poisson",
    "Fruits de mer",
    "Salades",
    "Apéro"
  ],
  simplePairingsEn: [
    "Fish",
    "Seafood",
    "Salads",
    "Aperitif"
  ],

  mainRegions: [
    region("quebec"),
    region("cantons-de-l-est")
  ],

  tryNext: [
    {
      _key:"seyval",
      grape:grape("seyval"),
      reason:"Pour rester dans les blancs frais et adaptés aux climats nordiques.",
      reasonEn:"For another fresh white suited to northern climates."
    },
    {
      _key:"vidal",
      grape:grape("vidal"),
      reason:"Pour un autre blanc hybride polyvalent, fruité et vif.",
      reasonEn:"For another versatile hybrid white with fruit and freshness."
    },
    {
      _key:"la-crescent",
      grape:grape("la-crescent"),
      reason:"Pour aller vers un blanc nordique plus expressif et aromatique.",
      reasonEn:"For a more expressive and aromatic northern white."
    }
  ],

  published: true
};

const publishExisting = [
  "grape-frontenac-blanc",
  "grape-frontenac-noir",
  "grape-gamay",
  "grape-riesling",
  "grape-vidal"
];

console.log("\n════════ BERGEVILLE — GRAPE PLAN ════════\n");
console.log("UPSERT  Acadie blanc  → grape-acadie-blanc");
console.log("CREATE  Geisenheim     → grape-geisenheim");

for (const id of publishExisting)
  console.log("PUBLISH", id);

if (!WRITE) {
  console.log("\nDRY RUN — aucune écriture Sanity.");
  console.log("✓ plan prêt pour --write");
  process.exit(0);
}

if (!client.config().token)
  throw new Error("SANITY_API_WRITE_TOKEN ou SANITY_API_TOKEN manquant.");

let tx = client.transaction();

tx = tx.createOrReplace(acadie);

if (grapeBySlug.has("geisenheim")) {
  geisenheim._id = grapeBySlug.get("geisenheim")._id;
}

tx = tx.createOrReplace(geisenheim);

for (const id of publishExisting)
  tx = tx.patch(id, p => p.set({published:true}));

await tx.commit();

const ids = [
  "grape-acadie-blanc",
  geisenheim._id,
  ...publishExisting,
  "grape-frontenac-gris",
  "grape-marquette",
  "grape-saint-pepin",
  "grape-la-crescent",
  "grape-seyval"
];

const qa = await client.fetch(
  `*[_type=="grape" && _id in $ids]{
    _id,name,published,
    oneLiner,oneLinerEn,
    aromas,aromasEn,
    body,acidity,tannins,
    servingTemperature,
    simplePairings,simplePairingsEn,
    mainRegions,
    tryNext
  } | order(name asc)`,
  {ids}
);

let errors = 0;

for (const g of qa) {
  const checks = [
    g.published === true,
    !!g.oneLiner,
    !!g.oneLinerEn,
    (g.aromas || []).length >= 3,
    (g.aromasEn || []).length >= 3,
    !!g.body,
    !!g.acidity,
    !!g.tannins,
    !!g.servingTemperature,
    (g.simplePairings || []).length === 4,
    (g.simplePairingsEn || []).length === 4,
    (g.mainRegions || []).length >= 1,
    (g.tryNext || []).length >= 2
  ];

  const ok = checks.every(Boolean);
  if (!ok) errors++;

  console.log(`${ok ? "✓" : "❌"} ${g.name} — published=${g.published}`);
}

console.log(`\nQA : ${qa.length} cépages · ${errors} erreur(s)`);

if (errors) {
  process.exitCode = 1;
} else {
  console.log("✓ CÉPAGES BERGEVILLE PRÊTS");
}
