import { createClient } from "@sanity/client";
import fs from "node:fs";
import path from "node:path";

const WRITE = process.argv.includes("--write");

const client = createClient({
  projectId: "czq6bjyu",
  dataset: "production",
  apiVersion: "2025-08-15",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
});

const PRODUCER = "bb61af16-e4c6-42ad-968c-edd0752d054c";
const PETNAT = "wine-domaine-du-ridge-les-petites-cuvees-pet-nat-orange";

const photos = {
  "wine-domaine-du-ridge-le-litre-du-ridge-rose": "IMG_3696.jpg",
  "wine-domaine-du-ridge-le-batonnier": "IMG_3698.jpg",
  [PETNAT]: "IMG_3700.jpg",
  "wine-domaine-du-ridge-seyval-vidal": "IMG_3701.jpg",
  "wine-domaine-du-ridge-les-petites-cuvees-vidal-brut": "IMG_3702.jpg",
};

const KEEP = new Set(Object.keys(photos));

const folder = "public/images/lpv/photos bouteilles";

const existing = await client.fetch(`
  *[_type == "wine" && producer._ref == $producer]{
    _id,name,published
  }
`, {producer: PRODUCER});

const existingIds = new Set(existing.map(w => w._id));

const missing = [...KEEP].filter(id => id !== PETNAT && !existingIds.has(id));
if (missing.length) throw new Error("Fiches manquantes : " + missing.join(", "));

const existingPetnat = await client.fetch(
  `*[_id == $id][0]{_id,_type,producer}`,
  {id: PETNAT}
);

if (existingPetnat && (
  existingPetnat._type !== "wine" ||
  existingPetnat.producer?._ref !== PRODUCER
)) {
  throw new Error("Conflit d'identifiant Pet Nat.");
}

for (const file of Object.values(photos)) {
  const full = path.join(folder, file);
  if (!fs.existsSync(full)) throw new Error("Photo absente : " + full);
}

const cayuga = await client.fetch(
  `*[_type == "grape" && (
    lower(name) == "cayuga" ||
    _id == "grape-cayuga"
  )][0]{_id,name}`
);

const petnatFields = {
  name: "Les Petites Cuvées – Pet Nat Orange",
  slug: {
    _type: "slug",
    current: "domaine-du-ridge-les-petites-cuvees-pet-nat-orange"
  },
  producer: {_type:"reference",_ref:PRODUCER},
  beverageType: "wine",
  alcoholFree: false,
  color: "orange",

  bottleSize: "750 ml",
  vintage: 2022,
  alcohol: 10.5,

  purchaseChannel: "producer",
  purchaseChannelDetails:
    "Cuvée 2022 épuisée selon le Domaine du Ridge. Disponibilité actuelle à vérifier.",
  purchaseChannelDetailsEn:
    "The 2022 release is sold out according to Domaine du Ridge. Check current availability.",
  purchaseUrl: "https://domaineduridge.com/les-petites-cuvees/",
  purchaseLastChecked: "2026-10-14",

  oneLiner:
    "Un pétillant naturel orange de Cayuga, non filtré, né d’une microcuvée travaillée à la main.",
  oneLinerEn:
    "An unfiltered orange pét-nat made from Cayuga, born from a tiny, hands-on production.",

  tastingKeywords:
    ["orange", "effervescent", "non filtré", "pelliculaire"],
  tastingKeywordsEn:
    ["orange wine", "sparkling", "unfiltered", "skin contact"],

  perfectFor:
    ["Apéro curieux", "Découverte des vins orange", "Soirée entre amis"],
  perfectForEn:
    ["Adventurous aperitif", "Discovering orange wine", "Evening with friends"],

  whyWeRecommend:
    "Parce que cette microcuvée raconte une autre facette du vin québécois : un cépage rare au domaine, une fermentation pelliculaire et un pressurage réalisé à la main. Une bouteille qui met le travail humain au premier plan.",
  whyWeRecommendEn:
    "We recommend it for the story behind the bottle: a scarce grape at the estate, skin-contact fermentation and hand pressing. A tiny Québec production that puts craftsmanship front and centre.",

  tastingNotes:
    "Pétillant naturel orange non filtré élaboré à partir de Cayuga. Le producteur ne publie pas de description aromatique détaillée pour cette cuvée.",
  tastingNotesEn:
    "An unfiltered orange pét-nat made from Cayuga. The producer does not publish detailed tasting aromas for this release.",

  editorialNote:
    "164 bouteilles, pas une de plus. Pour cette cuvée, l’équipe a même pressé les raisins à la main. C’est exactement ce qui rend les petites productions intéressantes : derrière le vin, il y a une histoire qu’aucune fiche technique ne peut raconter à elle seule.",
  editorialNoteEn:
    "Just 164 bottles were produced. The team even pressed the grapes by hand. That is what makes tiny releases compelling: behind the wine is a story that technical specifications alone cannot tell.",

  style: "Pétillant naturel orange non filtré",
  vinification:
    "Fermentation pelliculaire du Cayuga, interrompue par le froid; pressurage manuel avant la mise en bouteille.",

  aromas: [],
  flavors: [],
  texture: "Non documentée par le producteur.",
  finish: "Non documentée par le producteur.",

  seoTitle:
    "Pet Nat Orange | Domaine du Ridge | Le Premier Verre",
  seoTitleEn:
    "Pet Nat Orange | Domaine du Ridge | Le Premier Verre",

  seoDescription:
    "Découvrez le Pet Nat Orange du Domaine du Ridge : un pétillant naturel québécois de Cayuga, non filtré, produit à seulement 164 bouteilles en 2022.",
  seoDescriptionEn:
    "Discover Domaine du Ridge Pet Nat Orange: an unfiltered Québec Cayuga pét-nat, with only 164 bottles produced in 2022.",

  experienceLevel: "intermediate",
  published: true,
};

if (cayuga) {
  petnatFields.grapes = [{
    _type: "reference",
    _key: "cayuga",
    _ref: cayuga._id
  }];
}

console.log("\n════════ RIDGE — PLAN FINAL ════════");
console.log("Mode :", WRITE ? "ÉCRITURE SANITY" : "SIMULATION");
console.log("Pet Nat :", existingPetnat ? "mise à jour" : "création");
console.log("Cayuga :", cayuga?._id || "Référence absente — à compléter");

for (const w of existing) {
  console.log(KEEP.has(w._id) ? "✓ GARDER " : "○ MASQUER", w.name);
}

console.log("✓ CRÉER Pet Nat Orange");

for (const [id,file] of Object.entries(photos)) {
  console.log("PHOTO",file,"→",id);
}

if (!WRITE) {
  console.log("\n✓ SIMULATION TERMINÉE — aucune modification.");
  console.log("Pour appliquer : node scripts/lpv-ridge-petnat-final.mjs --write");
  process.exit(0);
}

if (!client.config().token) throw new Error("Token Sanity absent.");

if (existingPetnat) {
  await client.patch(PETNAT).set(petnatFields).commit();
} else {
  await client.create({
    _id: PETNAT,
    _type: "wine",
    ...petnatFields
  });
}

for (const [id,file] of Object.entries(photos)) {
  const full = path.join(folder,file);

  const asset = await client.assets.upload(
    "image",
    fs.createReadStream(full),
    {
      filename: `lpv-ridge-${file}`,
      contentType: "image/jpeg"
    }
  );

  await client.patch(id).set({
    bottleImage: {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: asset._id
      }
    },
    published: true
  }).commit();

  console.log("✓ PHOTO INSTALLÉE :",file);
}

for (const w of existing) {
  if (!KEEP.has(w._id)) {
    await client.patch(w._id)
      .set({published:false})
      .commit();
  }
}

const final = await client.fetch(`
  *[_type == "wine" && producer._ref == $producer && published == true]{
    _id,name,"photo":bottleImage.asset._ref
  }
`,{producer:PRODUCER});

console.log("\n════════ RÉSULTAT ════════");
console.log("VINS VISIBLES :",final.length);

for (const w of final) {
  console.log("✓",w.name,"| PHOTO :",w.photo ? "OK" : "ABSENTE");
}

if (
  final.length !== 5 ||
  final.some(w => !KEEP.has(w._id) || !w.photo)
) {
  throw new Error("Vérification finale échouée.");
}

console.log("\n✓ EXACTEMENT 5 VINS RIDGE PUBLIÉS");
console.log("✓ PET NAT ORANGE CRÉÉ");
console.log("✓ BLANC MASQUÉ");
console.log("✓ CINQ PHOTOS INSTALLÉES");
