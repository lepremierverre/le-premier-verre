import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-08-15",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

const id = "producer-ferme-cidricole-equinoxe";

const producer = await client.getDocument(id);

if (!producer) {
  throw new Error("Fiche Équinoxe introuvable");
}

const block = (text, key) => ({
  _key: key,
  _type: "block",
  style: "normal",
  markDefs: [],
  children: [{
    _key: `${key}-span`,
    _type: "span",
    marks: [],
    text,
  }],
});

const item = (key, title, text) => ({
  _key: key,
  _type: "producerApproachItem",
  title,
  text,
});

const grapes = [
  "Saint-Pépin",
  "Frontenac blanc",
  "Petite Pearl",
  "Frontenac noir",
  "Marquette",
];

const allGrapes = await client.fetch(`
  *[_type == "grape"]{
    _id,
    name
  }
`);

const normalize = value =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const grapeRefs = [];
const missing = [];

for (const name of grapes) {
  const match = allGrapes.find(
    grape => normalize(grape.name) === normalize(name)
  );

  if (match) {
    grapeRefs.push({
      _key: `equinoxe-${normalize(name)}`,
      _type: "reference",
      _ref: match._id,
    });
  } else {
    missing.push(name);
  }
}

const updates = {
  instagram:
    "https://www.instagram.com/equinoxefermecidricole/",

  openToVisitors: true,

  reservationRequired: false,

  bio: [
    block(
      "À Farnham, Audrey-Anne et Marc-Antoine ont développé une ferme biologique où poussent des pommes, des raisins, des poires, des prunes et plusieurs autres fruits. Les récoltes servent à produire des cidres, des vins et des spiritueux directement à la ferme.",
      "bio-1"
    ),
    block(
      "Le verger compte notamment des pommes McIntosh, Cortland, Golden Russet et Red Atlas. Dans le vignoble, on retrouve des cépages comme le Saint-Pépin, le Frontenac blanc, la Petite Pearl et le Marquette. Équinoxe accueille aussi les visiteurs dans sa boutique et son bistro champêtre, où les produits de la ferme occupent une place importante.",
      "bio-2"
    ),
  ],

  bioEn: [
    block(
      "In Farnham, Audrey-Anne and Marc-Antoine have developed an organic farm growing apples, grapes, pears, plums and several other fruits. Their harvests are transformed into cider, wine and spirits right on the farm.",
      "bio-1"
    ),
    block(
      "The orchard includes McIntosh, Cortland, Golden Russet and Red Atlas apples. In the vineyard, varieties include Saint-Pépin, Frontenac Blanc, Petite Pearl and Marquette. Visitors can also stop by the farm shop and country bistro, where ingredients grown on the property play an important role.",
      "bio-2"
    ),
  ],

  approach: [
    item(
      "approach-farm",
      "Une ferme qui produit bien plus que des pommes",
      "Équinoxe cultive aussi des raisins, des poires, des prunes et plusieurs autres fruits. Cette diversité permet à l’équipe de créer des cidres, des vins et des spiritueux à partir de ses propres récoltes."
    ),
    item(
      "approach-wine-cider",
      "Des cidres qui rencontrent le vin",
      "Certaines cuvées réunissent pommes et raisins. Équinoxe utilise notamment les peaux de raisins après le pressurage pour apporter de nouvelles saveurs et textures à ses cidres."
    ),
    item(
      "approach-organic",
      "Une agriculture biologique",
      "La ferme privilégie des pratiques qui favorisent la santé des sols et la biodiversité. Cette approche guide autant le travail dans les vergers que dans le vignoble."
    ),
  ],

  approachEn: [
    item(
      "approach-farm",
      "A farm growing much more than apples",
      "Équinoxe also grows grapes, pears, plums and several other fruits. This diversity allows the team to create cider, wine and spirits from its own harvests."
    ),
    item(
      "approach-wine-cider",
      "Where cider meets wine",
      "Some cuvées bring apples and grapes together. Équinoxe uses grape skins left after pressing to add new flavours and textures to its ciders."
    ),
    item(
      "approach-organic",
      "Organic farming",
      "The farm favours practices that support healthy soils and biodiversity. This approach guides the work in both the orchards and the vineyard."
    ),
  ],

  visitDetails:
    "Équinoxe accueille les visiteurs à la ferme pendant sa saison d’ouverture. On peut y déguster les produits, faire des achats à la boutique, profiter du bistro champêtre et participer aux activités proposées, notamment l’autocueillette des pommes en saison. Il est préférable de vérifier les heures d’ouverture avant de se déplacer et de réserver pour le bistro.",

  visitDetailsEn:
    "Équinoxe welcomes visitors during its seasonal opening period. Guests can taste the farm’s products, shop for bottles, enjoy the country bistro and take part in seasonal activities, including apple picking. Check opening hours before visiting and reserve ahead for the bistro.",
};

if (grapeRefs.length) {
  updates.signatureGrapes = grapeRefs;
}

await client.patch(id).set(updates).commit();

const check = await client.fetch(`
  *[_id == $id][0]{
    name,
    instagram,
    openToVisitors,
    visitDetails,
    "grapes": signatureGrapes[]->name,
    "approachTitles": approach[].title
  }
`, { id });

console.log("\n===== ÉQUINOXE MIS À JOUR =====");
console.dir(check, { depth: 5 });

if (missing.length) {
  console.log("\nCÉPAGES ABSENTS DU RÉFÉRENTIEL SANITY");
  console.log(missing.join(", "));
  console.log("Ils sont mentionnés dans les textes, mais pas encore rattachés à la quatrième colonne.");
}

console.log("\n✓ Textes FR et EN corrigés");
console.log("✓ Variétés de pommes ajoutées");
console.log("✓ Instagram ajouté");
console.log("✓ Visites et activités ajoutées");
console.log("✓ Aucun vin ni cidre créé");
