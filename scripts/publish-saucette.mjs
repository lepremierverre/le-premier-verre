import { createClient } from "@sanity/client";
import crypto from "node:crypto";

const client = createClient({
  projectId: "czq6bjyu",
  dataset: "production",
  apiVersion: "2025-08-15",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
});

const block = (text, key) => ({
  _key: key,
  _type: "block",
  style: "normal",
  markDefs: [],
  children: [{
    _key: `${key}-span`,
    _type: "span",
    marks: [],
    text
  }]
});

const source = {
  name: "Saucette",
  type: "caviste",
  city: "Saint-Lambert",
  region: "Montérégie",
  address: "38 rue Green, Saint-Lambert, QC J4P 1R9",
  website: "https://www.saucette.ca/",
  highlights: [
    "Importations privées à l’unité",
    "Caviste + buvette",
    "Approche décomplexée du vin"
  ],
  highlightsEn: [
    "Private imports by the bottle",
    "Wine shop + wine bar",
    "An approachable take on wine"
  ],
  description: [
    block(
      "Saucette est à la fois un caviste et une buvette de quartier à Saint-Lambert. On y vient pour découvrir une sélection de vins d’importation privée choisis avec soin auprès de producteurs qui travaillent dans le respect de la nature et de leur terroir.",
      "fr-1"
    ),
    block(
      "Côté caviste, les bouteilles peuvent être achetées à l’unité et emportées, avec de nouveaux arrivages chaque semaine. Côté buvette, on peut s’installer au bar, découvrir plusieurs vins au verre et les accompagner de plats et de bouchées saisonnières.",
      "fr-2"
    ),
    block(
      "Derrière Saucette, Catherine Denault et Marie-Ève Collin réunissent le vin, la cuisine et l’envie de rendre la découverte plus humaine et moins intimidante. Une adresse qui correspond particulièrement bien à l’esprit du Premier Verre : découvrir de bonnes bouteilles sans flafla et pouvoir poser des questions sans avoir l’impression de devoir déjà tout connaître.",
      "fr-3"
    )
  ],
  descriptionEn: [
    block(
      "Saucette is both a neighbourhood wine shop and wine bar in Saint-Lambert. Its carefully chosen private-import selection focuses on producers who work with respect for nature and their terroir.",
      "en-1"
    ),
    block(
      "On the retail side, bottles are available individually to take home, with new arrivals every week. At the wine bar, guests can settle in at the central bar, explore wines by the glass and pair them with seasonal dishes and small plates.",
      "en-2"
    ),
    block(
      "Behind Saucette, Catherine Denault and Marie-Ève Collin bring together wine, food and a desire to make discovery more human and less intimidating. It is exactly the kind of address Le Premier Verre likes to highlight: somewhere to discover good bottles, ask questions and enjoy wine without unnecessary fuss.",
      "en-3"
    )
  ]
};

const translationSourceHash = crypto
  .createHash("sha256")
  .update(JSON.stringify({
    name: source.name,
    highlights: source.highlights,
    description: source.description.map(x => x.children[0].text)
  }))
  .digest("hex");

const doc = {
  _id: "place-saucette",
  _type: "place",
  name: source.name,
  slug: {_type:"slug", current:"saucette"},
  type: source.type,
  city: source.city,
  region: source.region,
  address: source.address,
  website: source.website,
  highlights: source.highlights,
  highlightsEn: source.highlightsEn,
  description: source.description,
  descriptionEn: source.descriptionEn,
  availableWines: [],
  translationSourceHash,
  published: true
};

await client.createOrReplace(doc);

const qa = await client.fetch(`
  *[_id=="place-saucette"][0]{
    _id,
    name,
    "slug":slug.current,
    type,
    city,
    region,
    address,
    website,
    highlights,
    highlightsEn,
    description,
    descriptionEn,
    published
  }
`);

const errors = [];

if (!qa) errors.push("document absent");
if (qa?.published !== true) errors.push("non publié");
if (!qa?.name) errors.push("nom absent");
if (!qa?.slug) errors.push("slug absent");
if (!qa?.type) errors.push("type absent");
if (!qa?.address) errors.push("adresse absente");
if (!qa?.website) errors.push("site absent");
if ((qa?.highlights || []).length !== 3) errors.push("highlights FR");
if ((qa?.highlightsEn || []).length !== 3) errors.push("highlights EN");
if (!(qa?.description || []).length) errors.push("description FR");
if (!(qa?.descriptionEn || []).length) errors.push("description EN");

console.log("\n════════ SAUCETTE — QA ════════");
console.log("Nom       :", qa?.name);
console.log("Slug      :", qa?.slug);
console.log("Type      :", qa?.type);
console.log("Ville     :", qa?.city);
console.log("Région    :", qa?.region);
console.log("Adresse   :", qa?.address);
console.log("FR        :", (qa?.description || []).length, "blocs");
console.log("EN        :", (qa?.descriptionEn || []).length, "blocs");
console.log("Publié    :", qa?.published);
console.log("Erreurs   :", errors.length);

if (errors.length) {
  errors.forEach(x => console.log("❌", x));
  process.exitCode = 1;
} else {
  console.log("✓ SAUCETTE PUBLIÉE ET VALIDÉE");
}
