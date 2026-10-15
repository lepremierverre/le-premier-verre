import { createClient } from "@sanity/client";
import fs from "node:fs";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

const id = "producer-les-pervenches";
const instagram = "https://www.instagram.com/vignoblelespervenches/";

const bioFr = [
  "Fondé en 1991, le vignoble est repris en 2000 par Véronique Hupin et Michael Marler. À Farnham, ils travaillent un peu plus de quatre hectares de vignes et ont contribué à faire de la biodynamie une référence importante dans le paysage viticole québécois.",
  "Leur travail part du lieu. Les parcelles, l’âge des vignes et les sols guident les décisions, avec des vendanges manuelles, des fermentations spontanées et des élevages patients. Au chai, l’intervention demeure minimale pour laisser chaque cuvée conserver son identité.",
];

const bioEn = [
  "Founded in 1991, the vineyard was taken over in 2000 by Véronique Hupin and Michael Marler. In Farnham, they farm just over four hectares of vines and have helped establish biodynamics as an important reference in Quebec’s wine landscape.",
  "Their work begins with place. Parcels, vine age and soils guide their decisions, alongside hand harvesting, spontaneous fermentations and patient ageing. In the cellar, intervention remains minimal, allowing each wine to retain its own identity.",
];

const approachFr = [
  {
    title: "Parcelles et sols",
    text: "Chaque cuvée part d’une lecture attentive de la parcelle, de l’âge des vignes et des sols. Les vinifications cherchent à préserver ces différences plutôt qu’à les uniformiser.",
  },
  {
    title: "Bio et biodynamie",
    text: "Le domaine travaille en agriculture biologique et biodynamique, avec une attention particulière portée à la vie des sols et à l’équilibre de la vigne.",
  },
  {
    title: "Peu d’intervention",
    text: "Vendanges manuelles, fermentations spontanées, élevages sur lies et mises sans filtration ou sans sulfite ajouté sur plusieurs cuvées définissent une approche peu interventionniste.",
  },
];

const approachEn = [
  {
    title: "Parcels and soils",
    text: "Each cuvée begins with a careful reading of its parcel, vine age and soils. Winemaking aims to preserve those differences rather than smooth them away.",
  },
  {
    title: "Organic and biodynamic",
    text: "The estate farms organically and biodynamically, with particular attention to soil life and the balance of the vines.",
  },
  {
    title: "Minimal intervention",
    text: "Hand harvesting, spontaneous fermentations, ageing on the lees and several cuvées bottled without filtration or added sulphites define a low-intervention approach.",
  },
];

function blocks(paragraphs, lang) {
  return paragraphs.map((paragraph, i) => ({
    _type: "block",
    _key: `lpv-pervenches-${lang}-${i + 1}`,
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: `lpv-pervenches-${lang}-span-${i + 1}`,
        text: paragraph,
        marks: [],
      },
    ],
  }));
}

function updateApproach(existing, proposed, lang) {
  if (!Array.isArray(existing) || existing.length !== 3) {
    throw new Error(`Structure approach ${lang} inattendue. Aucune modification.`);
  }

  return existing.map((item, i) => ({
    ...item,
    title: proposed[i].title,
    text: proposed[i].text,
  }));
}

async function main() {
  const producer = await client.getDocument(id);

  if (!producer || producer.name !== "Les Pervenches") {
    throw new Error("Producteur publié introuvable.");
  }

  if (!producer.published || !producer.lpvPartner) {
    throw new Error("Statut publié/partenaire inattendu.");
  }

  const backupPath = "scripts/lpv-pervenches-before-editorial-20261013.json";

  if (!fs.existsSync(backupPath)) {
    fs.writeFileSync(
      backupPath,
      JSON.stringify(producer, null, 2)
    );
  }

  const fields = {
    instagram,

    bio: blocks(bioFr, "fr"),
    bioEn: blocks(bioEn, "en"),

    approach: updateApproach(
      producer.approach,
      approachFr,
      "FR"
    ),

    approachEn: updateApproach(
      producer.approachEn,
      approachEn,
      "EN"
    ),

    whyWeFollow:
      "Parce que Les Pervenches font partie de ces domaines qui ont changé notre façon de regarder le vin québécois. Leur travail parcellaire, leur viticulture exigeante et leurs vinifications précises donnent des vins avec une identité forte, qui ne cherchent pas à ressembler à ceux d’ailleurs.",

    whyWeFollowEn:
      "Because Les Pervenches are among the estates that changed how we see Quebec wine. Their parcel-by-parcel approach, demanding vineyard work and precise winemaking produce wines with a strong identity, without trying to resemble wines from elsewhere.",
  };

  await client.patch(id).set(fields).commit();

  const after = await client.getDocument(id);

  if (
    after.instagram !== instagram ||
    after.bio?.length !== 2 ||
    after.bioEn?.length !== 2 ||
    after.approach?.length !== 3 ||
    after.approachEn?.length !== 3
  ) {
    throw new Error("Vérification éditoriale échouée.");
  }

  console.log("\n✓ LES PERVENCHES");
  console.log("✓ Instagram ajouté");
  console.log("✓ Bio FR et EN installées");
  console.log("✓ Trois blocs éditoriaux FR et EN");
  console.log("✓ Pourquoi Les Pervenches FR et EN");
  console.log("✓ Hero et photos conservés");
  console.log("✓ Cépages conservés");
  console.log("✓ Statuts de publication conservés");
  console.log("✓ Aucun vin modifié");
  console.log("✓ Sauvegarde :", backupPath);

  console.log("\nInstagram :", after.instagram);
  console.log("\nOuvrir :");
  console.log("http://localhost:3000/producteurs/les-pervenches");
  console.log("http://localhost:3000/en/producers/les-pervenches");
}

main().catch((error) => {
  console.error("\n❌", error.message);
  process.exit(1);
});
