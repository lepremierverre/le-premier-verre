import { createClient } from "@sanity/client";
import fs from "node:fs";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

function block(key, text) {
  return {
    _key: key,
    _type: "block",
    style: "normal",
    markDefs: [],
    children: [
      {
        _key: `${key}-span`,
        _type: "span",
        marks: [],
        text,
      },
    ],
  };
}

async function main() {
  const producerId = "producer-vineterra";

  const producer = await client.getDocument(producerId);

  if (!producer || producer.slug?.current !== "vineterra") {
    throw new Error("Vineterra introuvable.");
  }

  const secondaryPath =
    "public/images/lpv/producteurs/Screenshot 2025-11-01 at 1.23.07 PM.PNG";

  if (!fs.existsSync(secondaryPath)) {
    const candidates = fs
      .readdirSync("public/images/lpv/producteurs")
      .filter((name) => name.includes("Screenshot 2025-11-01"));

    console.log("Candidats trouvés :", candidates);

    throw new Error(
      "La deuxième photo n'a pas été trouvée avec son nom exact."
    );
  }

  console.log("Upload de la deuxième photo...");

  const secondaryAsset = await client.assets.upload(
    "image",
    fs.createReadStream(secondaryPath),
    {
      filename: "vineterra-domaine.png",
      title: "Domaine Vineterra au domaine",
    }
  );

  console.log("✓ Deuxième photo uploadée :", secondaryAsset._id);

  const data = {
    name: "Domaine Vineterra",

    oneLiner:
      "Un vignoble familial de Mont-Saint-Hilaire où le vin se pense d’abord autour du plaisir, du partage et de ce que le terroir québécois peut donner.",

    oneLinerEn:
      "A family vineyard in Mont-Saint-Hilaire where wine begins with pleasure, sharing and what Quebec terroir can offer.",

    shortBio:
      "Domaine Vineterra est un vignoble familial de Mont-Saint-Hilaire dont les premières vignes ont été plantées en 2016. Le domaine élabore des vins québécois accessibles et mise autant sur la qualité en bouteille que sur l’expérience au vignoble.",

    shortBioEn:
      "Domaine Vineterra is a family vineyard in Mont-Saint-Hilaire where the first vines were planted in 2016. The estate produces approachable Quebec wines with equal attention to what is in the bottle and the experience of visiting the vineyard.",

    bio: [
      block(
        "bio1",
        "L’histoire de Domaine Vineterra commence à Mont-Saint-Hilaire, sur une terre agricole familiale où poussaient auparavant le blé et le maïs. En 2016, René-Carl et Isabelle y plantent les premières vignes avec l’envie de diversifier l’exploitation et de donner une nouvelle place à leur passion pour le vin."
      ),
      block(
        "bio2",
        "Aujourd’hui, le domaine poursuit son évolution avec la relève familiale. Dans les vignes comme au chai, l’objectif demeure simple. Faire des vins soignés, accessibles et pensés pour le plaisir de les ouvrir, tout en invitant les gens à venir découvrir le vignoble et son territoire."
      ),
    ],

    bioEn: [
      block(
        "bio1en",
        "The story of Domaine Vineterra began in Mont-Saint-Hilaire on family farmland previously planted with wheat and corn. In 2016, René-Carl and Isabelle planted the first vines, looking to diversify the farm while giving their passion for wine a new place to grow."
      ),
      block(
        "bio2en",
        "Today, the estate continues to evolve with the next generation of the family. In the vineyard and in the cellar, the idea remains simple. Make thoughtful, approachable wines meant to be enjoyed, while inviting people to discover the vineyard and its surroundings."
      ),
    ],

    approach: [
      {
        _key: "family",
        _type: "producerApproachItem",
        title: "Une histoire agricole et familiale",
        text:
          "Avant les vignes, la terre était consacrée aux grandes cultures. Les premières plantations arrivent en 2016 et ouvrent un nouveau chapitre pour l’exploitation familiale.",
      },
      {
        _key: "terroir",
        _type: "producerApproachItem",
        title: "Un terroir montérégien",
        text:
          "À Mont-Saint-Hilaire, les vignes profitent d’un secteur chaud de la Montérégie, de sols marqués par l’ancienne mer de Champlain et d’un territoire où le vent joue aussi son rôle.",
      },
      {
        _key: "cellar",
        _type: "producerApproachItem",
        title: "Intervenir avec mesure",
        text:
          "Au chai, le domaine cherche à accompagner le vin sans le dénaturer. Cuves inox, barriques françaises et œuf de béton font partie des outils utilisés selon les cuvées.",
      },
      {
        _key: "pleasure",
        _type: "producerApproachItem",
        title: "Des vins faits pour être ouverts",
        text:
          "Vineterra revendique une approche accessible du vin. Des bouteilles faites avec sérieux, mais pensées avant tout pour être bues, partagées et appréciées.",
      },
    ],

    approachEn: [
      {
        _key: "family",
        _type: "producerApproachItem",
        title: "A family farming story",
        text:
          "Before the vines, the land was devoted to field crops. The first vines were planted in 2016, opening a new chapter for the family farm.",
      },
      {
        _key: "terroir",
        _type: "producerApproachItem",
        title: "Montérégie terroir",
        text:
          "In Mont-Saint-Hilaire, the vines grow in one of Montérégie’s warmer areas, on soils shaped by the ancient Champlain Sea and in a landscape where wind also plays an important role.",
      },
      {
        _key: "cellar",
        _type: "producerApproachItem",
        title: "A measured hand in the cellar",
        text:
          "The estate aims to guide the wine without taking away its character. Stainless steel, French oak barrels and a concrete egg are used depending on the cuvée.",
      },
      {
        _key: "pleasure",
        _type: "producerApproachItem",
        title: "Wines meant to be opened",
        text:
          "Vineterra takes an approachable view of wine. Bottles made with care, but above all meant to be enjoyed and shared.",
      },
    ],

    whyWeFollow:
      "Parce qu’on aime les domaines qui prennent le vin au sérieux sans le rendre compliqué. Vineterra travaille avec cette idée de plaisir et d’accessibilité, tout en poursuivant un vrai travail sur le vignoble, les cépages et la façon de faire du vin ici.",

    whyWeFollowEn:
      "Because we appreciate estates that take wine seriously without making it complicated. Vineterra combines that sense of pleasure and accessibility with thoughtful work in the vineyard, with grape varieties and with what it means to make wine here.",

    visitDetails:
      "Le domaine accueille les visiteurs à Mont-Saint-Hilaire pour découvrir les vins et le vignoble. Certaines expériences peuvent nécessiter une réservation. Vérifier les horaires et les activités directement auprès du domaine avant de se déplacer.",

    visitDetailsEn:
      "The estate welcomes visitors in Mont-Saint-Hilaire to discover its wines and vineyard. Some experiences may require a reservation. Check current hours and activities directly with the estate before visiting.",

    foundedYear: 2016,

    secondaryImage: {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: secondaryAsset._id,
      },
    },

    secondaryImageCredit: "Domaine Vineterra",

    mediaPermissionStatus: "provided_by_producer",
    mediaCredit: "Domaine Vineterra",

    lpvPartner: true,
    published: true,
    openToVisitors: true,
  };

  await client.patch(producerId).set(data).commit();

  const check = await client.fetch(
    `*[_id == $id][0]{
      _id,
      name,
      "slug": slug.current,
      published,
      lpvPartner,
      oneLiner,
      oneLinerEn,
      bio,
      bioEn,
      approach,
      approachEn,
      whyWeFollow,
      whyWeFollowEn,
      heroImage,
      mediaCredit,
      secondaryImage,
      secondaryImageCredit,
      country->{name, "slug": slug.current},
      region->{name, "slug": slug.current}
    }`,
    { id: producerId }
  );

  console.log("\n===== VINETERRA CONTENU =====");
  console.log(JSON.stringify(check, null, 2));

  console.log("\n✓ Contenu FR");
  console.log("✓ Contenu EN");
  console.log("✓ Hero créditée Domaine Vineterra");
  console.log("✓ Deuxième photo créditée Domaine Vineterra");
}

main().catch((error) => {
  console.error("\nERREUR :", error.message);
  process.exit(1);
});
