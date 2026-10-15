import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "czq6bjyu",
  dataset: "production",
  apiVersion: "2025-08-15",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
});

const REGION = "55a9fe9a-b3fe-41d6-8145-6adca1a818a8";

const ref = (_ref) => ({ _type: "reference", _ref });

const suggestions = {
  saintPepin: [
    {
      _key: "sp-seyval",
      _type: "grapeSuggestion",
      grape: ref("grape-seyval-blanc"),
      reason: "Pour rester dans les blancs nordiques frais et faciles à boire.",
      reasonEn: "For another fresh, easy-drinking northern white."
    },
    {
      _key: "sp-frontenacgris",
      _type: "grapeSuggestion",
      grape: ref("grape-frontenac-gris"),
      reason: "Pour une expression plus aromatique et plus ample du climat québécois.",
      reasonEn: "For a more aromatic and generous expression of Quebec's climate."
    },
    {
      _key: "sp-vidal",
      _type: "grapeSuggestion",
      grape: ref("grape-vidal"),
      reason: "Pour découvrir un autre blanc hybride polyvalent cultivé au Québec.",
      reasonEn: "To discover another versatile white hybrid grown in Quebec."
    }
  ],

  louise: [
    {
      _key: "ls-saintpepin",
      _type: "grapeSuggestion",
      grape: ref("grape-saint-pepin"),
      reason: "Pour un autre blanc nordique souple, frais et délicatement fruité.",
      reasonEn: "For another supple, fresh and delicately fruity northern white."
    },
    {
      _key: "ls-frontenacgris",
      _type: "grapeSuggestion",
      grape: ref("grape-frontenac-gris"),
      reason: "Pour davantage d'intensité aromatique tout en conservant la fraîcheur.",
      reasonEn: "For greater aromatic intensity while keeping plenty of freshness."
    },
    {
      _key: "ls-seyval",
      _type: "grapeSuggestion",
      grape: ref("grape-seyval-blanc"),
      reason: "Pour un blanc vif et léger particulièrement à l'aise sous climat froid.",
      reasonEn: "For a lively, light white particularly well suited to cold climates."
    }
  ],

  lacrescent: [
    {
      _key: "lc-frontenacgris",
      _type: "grapeSuggestion",
      grape: ref("grape-frontenac-gris"),
      reason: "Pour rester dans un registre nordique expressif, fruité et très aromatique.",
      reasonEn: "For another expressive, fruity and highly aromatic northern variety."
    },
    {
      _key: "lc-gewurz",
      _type: "grapeSuggestion",
      grape: ref("grape-gewurztraminer"),
      reason: "Pour retrouver un profil floral et intensément aromatique.",
      reasonEn: "For another intensely aromatic and floral profile."
    },
    {
      _key: "lc-saintpepin",
      _type: "grapeSuggestion",
      grape: ref("grape-saint-pepin"),
      reason: "Pour une expression plus délicate et souple des blancs de climat froid.",
      reasonEn: "For a softer, more delicate expression of cold-climate whites."
    }
  ]
};

const definitions = [
  {
    canonicalName: "Saint-Pépin",
    preferredId: "grape-saint-pepin",
    aliases: ["Saint-Pépin", "Saint Pepin", "St. Pepin", "St Pepin"],
    doc: {
      _type: "grape",
      name: "Saint-Pépin",
      slug: { _type: "slug", current: "saint-pepin" },
      color: "white",
      oneLiner: "Un blanc nordique délicat et frais, apprécié pour son fruit tendre, ses notes florales et sa capacité à conserver de la vivacité sous climat froid.",
      oneLinerEn: "A delicate, fresh northern white valued for its gentle fruit, floral notes and ability to retain lively acidity in cold climates.",
      aromas: ["Poire", "Pomme", "Agrumes", "Fleurs blanches"],
      aromasEn: ["Pear", "Apple", "Citrus", "White flowers"],
      body: 2,
      acidity: 4,
      tannins: 1,
      servingTemperature: "8–10 °C",
      simplePairings: ["Poisson blanc", "Salades", "Fromage de chèvre", "Poulet grillé"],
      simplePairingsEn: ["White fish", "Salads", "Goat cheese", "Grilled chicken"],
      mainRegions: [ref(REGION)],
      tryNext: suggestions.saintPepin,
      published: true
    }
  },
  {
    canonicalName: "Louise Swenson",
    preferredId: "grape-louise-swenson",
    aliases: ["Louise Swenson", "Louise Swensen"],
    doc: {
      _type: "grape",
      name: "Louise Swenson",
      slug: { _type: "slug", current: "louise-swenson" },
      color: "white",
      oneLiner: "Un cépage blanc de climat froid au profil délicat, porté par les fruits blancs, les agrumes et une fraîcheur nette.",
      oneLinerEn: "A cold-climate white variety with a delicate profile of white fruit, citrus and clean freshness.",
      aromas: ["Poire", "Pomme", "Agrumes", "Fleurs blanches"],
      aromasEn: ["Pear", "Apple", "Citrus", "White flowers"],
      body: 2,
      acidity: 4,
      tannins: 1,
      servingTemperature: "8–10 °C",
      simplePairings: ["Poisson", "Salades", "Fromages doux", "Apéro"],
      simplePairingsEn: ["Fish", "Salads", "Mild cheeses", "Aperitif"],
      mainRegions: [ref(REGION)],
      tryNext: suggestions.louise,
      published: true
    }
  },
  {
    canonicalName: "La Crescent",
    preferredId: "grape-la-crescent",
    aliases: ["La Crescent", "LaCrescent"],
    doc: {
      _type: "grape",
      name: "La Crescent",
      slug: { _type: "slug", current: "la-crescent" },
      color: "white",
      oneLiner: "Un blanc nordique très aromatique, souvent marqué par les agrumes, les fruits à noyau et les fleurs, avec une acidité naturellement vive.",
      oneLinerEn: "A highly aromatic northern white often showing citrus, stone fruit and floral notes, with naturally lively acidity.",
      aromas: ["Abricot", "Pêche", "Agrumes", "Fleurs"],
      aromasEn: ["Apricot", "Peach", "Citrus", "Flowers"],
      body: 2,
      acidity: 5,
      tannins: 1,
      servingTemperature: "8–10 °C",
      simplePairings: ["Cuisine asiatique", "Poisson", "Fromage de chèvre", "Apéro"],
      simplePairingsEn: ["Asian dishes", "Fish", "Goat cheese", "Aperitif"],
      mainRegions: [ref(REGION)],
      tryNext: suggestions.lacrescent,
      published: true
    }
  }
];

const existing = await client.fetch(
  `*[_type=="grape"]{
    _id,name,"slug":slug.current,published,
    color,oneLiner,aromas,body,acidity,tannins,
    servingTemperature,simplePairings,mainRegions,tryNext
  }`
);

function normalize(s = "") {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function findExisting(def) {
  const aliases = def.aliases.map(normalize);
  return existing.find(g =>
    aliases.includes(normalize(g.name)) ||
    aliases.includes(normalize(g.slug))
  );
}

const completeEnough = g =>
  g?.color &&
  g?.oneLiner &&
  Array.isArray(g?.aromas) && g.aromas.length >= 3 &&
  g?.body &&
  g?.acidity &&
  g?.tannins &&
  g?.servingTemperature &&
  Array.isArray(g?.simplePairings) && g.simplePairings.length === 4 &&
  Array.isArray(g?.mainRegions) && g.mainRegions.length >= 1 &&
  Array.isArray(g?.tryNext) && g.tryNext.length >= 2;

const operations = [];

for (const def of definitions) {
  const found = findExisting(def);

  if (found) {
    operations.push({
      action: "UPSERT_EXISTING",
      id: found._id,
      name: def.canonicalName,
      wasComplete: completeEnough(found),
      document: {
        ...def.doc,
        _id: found._id
      }
    });
  } else {
    operations.push({
      action: "CREATE",
      id: def.preferredId,
      name: def.canonicalName,
      wasComplete: false,
      document: {
        ...def.doc,
        _id: def.preferredId
      }
    });
  }
}

const publishExisting = [
  "grape-frontenac-gris",
  "grape-marquette",
  "grape-petite-perle"
];

console.log("\n════════ PIGEON HILL — GRAPE DRY RUN ════════\n");

for (const op of operations) {
  console.log(
    `${op.action.padEnd(16)} ${op.name.padEnd(20)} → ${op.id}` +
    (op.wasComplete ? " [déjà complet]" : "")
  );
}

console.log("\nÀ PUBLIER (déjà complets) :");
for (const id of publishExisting) console.log("  ✓", id);

console.log("\nAUCUNE ÉCRITURE EFFECTUÉE.");
console.log("Prochaine étape : validation des références puis --write.");

if (process.argv.includes("--write")) {
  if (!client.config().token) {
    throw new Error("SANITY_API_WRITE_TOKEN ou SANITY_API_TOKEN manquant.");
  }

  console.log("\n════════ ÉCRITURE SANITY ════════");

  let tx = client.transaction();

  for (const op of operations) {
    tx = tx.createOrReplace(op.document);
  }

  for (const id of publishExisting) {
    tx = tx.patch(id, p => p.set({ published: true }));
  }

  await tx.commit();

  const ids = [
    ...operations.map(op => op.id),
    ...publishExisting
  ];

  const qa = await client.fetch(
    `*[_id in $ids]{
      _id,name,published,
      "slug":slug.current,
      color,
      oneLiner,oneLinerEn,
      aromas,aromasEn,
      body,acidity,tannins,
      servingTemperature,
      simplePairings,simplePairingsEn,
      "mainRegions":mainRegions[]->_id,
      "tryNext":tryNext[]{_key,"grape":grape->_id,reason,reasonEn}
    } | order(name asc)`,
    { ids }
  );

  let errors = 0;

  for (const g of qa) {
    const checks = [
      g.published === true,
      !!g.slug,
      !!g.color,
      !!g.oneLiner,
      !!g.oneLinerEn,
      Array.isArray(g.aromas) && g.aromas.length >= 3,
      Array.isArray(g.aromasEn) && g.aromasEn.length >= 3,
      Number.isFinite(g.body),
      Number.isFinite(g.acidity),
      Number.isFinite(g.tannins),
      !!g.servingTemperature,
      Array.isArray(g.simplePairings) && g.simplePairings.length === 4,
      Array.isArray(g.simplePairingsEn) && g.simplePairingsEn.length === 4,
      Array.isArray(g.mainRegions) && g.mainRegions.length >= 1,
      Array.isArray(g.tryNext) && g.tryNext.length >= 2,
      (g.tryNext || []).every(x => x.grape)
    ];

    const ok = checks.every(Boolean);
    if (!ok) errors++;

    console.log(
      `${ok ? "✓" : "❌"} ${g.name} — ${g._id} — published=${g.published}`
    );
  }

  console.log(`\nQA : ${qa.length} cépages · ${errors} erreur(s)`);

  if (errors) {
    process.exitCode = 1;
  } else {
    console.log("✓ CÉPAGES PIGEON HILL PRÊTS");
  }
}
