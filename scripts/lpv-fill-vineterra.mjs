import { createClient } from "@sanity/client";
import fs from "node:fs";
import path from "node:path";

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
  const id = "producer-vineterra";

  const before = await client.getDocument(id);

  if (!before || before.slug?.current !== "vineterra") {
    throw new Error("Vineterra introuvable. Arrêt.");
  }

  console.log("✓ Vineterra trouvé");

  // --------------------------------------------------
  // 1. CONTENU
  // --------------------------------------------------

  await client.patch(id).set({
    oneLiner:
      "Un vignoble familial de Mont-Saint-Hilaire où le vin se pense autour du plaisir, du partage et de ce que le terroir québécois peut donner.",

    oneLinerEn:
      "A family vineyard in Mont-Saint-Hilaire where wine is shaped by pleasure, sharing and what Quebec terroir can offer.",

    shortBio:
      "Domaine Vineterra est un vignoble familial de Mont-Saint-Hilaire dont les premières vignes ont été plantées en 2016.",

    shortBioEn:
      "Domaine Vineterra is a family vineyard in Mont-Saint-Hilaire where the first vines were planted in 2016.",

    bio: [
      block(
        "vineterra-bio-1",
        "L’histoire de Domaine Vineterra commence à Mont-Saint-Hilaire, sur une terre agricole familiale où poussaient auparavant le blé et le maïs. En 2016, René-Carl et Isabelle y plantent les premières vignes avec l’envie de diversifier l’exploitation et de donner une nouvelle place à leur passion pour le vin."
      ),
      block(
        "vineterra-bio-2",
        "Aujourd’hui, le domaine poursuit son évolution avec la relève familiale. Dans les vignes comme au chai, l’objectif demeure simple. Faire des vins soignés, accessibles et pensés pour le plaisir de les ouvrir, tout en invitant les gens à venir découvrir le vignoble et son territoire."
      ),
    ],

    bioEn: [
      block(
        "vineterra-bio-en-1",
        "The story of Domaine Vineterra began in Mont-Saint-Hilaire on family farmland previously planted with wheat and corn. In 2016, René-Carl and Isabelle planted the first vines, looking to diversify the farm while giving their passion for wine a new place to grow."
      ),
      block(
        "vineterra-bio-en-2",
        "Today, the estate continues to evolve with the next generation of the family. In the vineyard and in the cellar, the idea remains simple. Make thoughtful, approachable wines meant to be enjoyed, while inviting people to discover the vineyard and its surroundings."
      ),
    ],

    approach: [
      {
        _key: "vineterra-family",
        _type: "object",
        title: "Une histoire agricole et familiale",
        text:
          "Avant les vignes, la terre était consacrée aux grandes cultures. Les premières plantations arrivent en 2016 et ouvrent un nouveau chapitre pour l’exploitation familiale.",
      },
      {
        _key: "vineterra-terroir",
        _type: "object",
        title: "Un terroir montérégien",
        text:
          "À Mont-Saint-Hilaire, les vignes profitent d’un secteur chaud de la Montérégie, de sols marqués par l’ancienne mer de Champlain et d’un territoire où le vent joue aussi son rôle.",
      },
      {
        _key: "vineterra-cellar",
        _type: "object",
        title: "Intervenir avec mesure",
        text:
          "Au chai, le domaine cherche à accompagner le vin sans le dénaturer. Cuves inox, barriques françaises et œuf de béton font partie des outils utilisés selon les cuvées.",
      },
    ],

    approachEn: [
      {
        _key: "vineterra-family",
        _type: "object",
        title: "A family farming story",
        text:
          "Before the vines, the land was devoted to field crops. The first vines were planted in 2016, opening a new chapter for the family farm.",
      },
      {
        _key: "vineterra-terroir",
        _type: "object",
        title: "Montérégie terroir",
        text:
          "In Mont-Saint-Hilaire, the vines grow in one of Montérégie’s warmer areas, on soils shaped by the ancient Champlain Sea and in a landscape where wind also plays an important role.",
      },
      {
        _key: "vineterra-cellar",
        _type: "object",
        title: "A measured hand in the cellar",
        text:
          "The estate aims to guide the wine without taking away its character. Stainless steel, French oak barrels and a concrete egg are used depending on the cuvée.",
      },
    ],

    whyWeFollow:
      "Parce qu’on aime les domaines qui prennent le vin au sérieux sans le rendre compliqué. Vineterra travaille avec cette idée de plaisir et d’accessibilité, tout en poursuivant un vrai travail sur le vignoble, les cépages et la façon de faire du vin ici.",

    whyWeFollowEn:
      "Because we appreciate estates that take wine seriously without making it complicated. Vineterra combines that sense of pleasure and accessibility with thoughtful work in the vineyard, with grape varieties and with what it means to make wine here.",

    visitDetails:
      "Le domaine accueille les visiteurs à Mont-Saint-Hilaire pour découvrir les vins et le vignoble. Vérifier les horaires et les activités directement auprès du domaine avant de se déplacer.",

    visitDetailsEn:
      "The estate welcomes visitors in Mont-Saint-Hilaire to discover its wines and vineyard. Check current hours and activities directly with the estate before visiting.",

    foundedYear: 2016,
    mediaCredit: "Domaine Vineterra",
    lpvPartner: true,
    published: true,
  }).commit();

  console.log("✓ Contenu FR écrit");
  console.log("✓ Contenu EN écrit");

  // --------------------------------------------------
  // 2. TROUVER LA DEUXIÈME PHOTO
  // --------------------------------------------------

  const folder = "public/images/lpv/producteurs";

  const files = fs.readdirSync(folder);

  const candidates = files.filter((file) => {
    const f = file.toLowerCase();

    return (
      f.includes("screenshot 2025-11-01") ||
      f.includes("1.23.07") ||
      f.includes("vineterra")
    );
  });

  console.log("\nPhotos candidates :");
  candidates.forEach((f) => console.log(" •", f));

  const secondaryFile = candidates.find((file) => {
    const f = file.toLowerCase();

    return (
      f.includes("screenshot 2025-11-01") ||
      f.includes("1.23.07")
    );
  });

  if (secondaryFile) {
    const secondaryPath = path.join(folder, secondaryFile);

    console.log("\nPhoto secondaire retenue :", secondaryFile);

    const asset = await client.assets.upload(
      "image",
      fs.createReadStream(secondaryPath),
      {
        filename: "vineterra-domaine.png",
        title: "Domaine Vineterra",
      }
    );

    await client.patch(id).set({
      secondaryImage: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: asset._id,
        },
      },
      secondaryImageCredit: "Domaine Vineterra",
    }).commit();

    console.log("✓ Photo secondaire uploadée");
    console.log("✓ Crédit © Domaine Vineterra");
  } else {
    console.log(
      "\n⚠ Photo secondaire non trouvée. Le CONTENU a quand même été enregistré."
    );
  }

  // --------------------------------------------------
  // 3. VALIDATION
  // --------------------------------------------------

  const check = await client.fetch(`
    *[_id == $id][0]{
      name,
      "slug": slug.current,
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
      visitDetails,
      visitDetailsEn,
      published,
      lpvPartner
    }
  `, { id });

  console.log("\n===== VALIDATION VINETERRA =====");
  console.log("oneLiner FR :", !!check.oneLiner);
  console.log("oneLiner EN :", !!check.oneLinerEn);
  console.log("bio FR :", check.bio?.length || 0, "blocs");
  console.log("bio EN :", check.bioEn?.length || 0, "blocs");
  console.log("approach FR :", check.approach?.length || 0, "cartes");
  console.log("approach EN :", check.approachEn?.length || 0, "cartes");
  console.log("Pourquoi FR :", !!check.whyWeFollow);
  console.log("Pourquoi EN :", !!check.whyWeFollowEn);
  console.log("Hero :", !!check.heroImage);
  console.log("Photo 2 :", !!check.secondaryImage);
  console.log("Crédit photo 2 :", check.secondaryImageCredit);
  console.log("Publié :", check.published);
  console.log("Partenaire :", check.lpvPartner);

  if (
    !check.oneLiner ||
    !check.oneLinerEn ||
    !check.bio?.length ||
    !check.bioEn?.length ||
    !check.approach?.length ||
    !check.approachEn?.length ||
    !check.whyWeFollow ||
    !check.whyWeFollowEn
  ) {
    throw new Error("Validation du contenu incomplète.");
  }

  console.log("\n✓ FICHE VINETERRA REMPLIE");
}

main().catch((error) => {
  console.error("\nERREUR :", error);
  process.exit(1);
});
