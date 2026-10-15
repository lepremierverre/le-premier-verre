import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-08-15",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const id = "producer-maison-agricole-joy-hill";

function block(text, key) {
  return {
    _type: "block",
    _key: key,
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: `${key}-span`,
        marks: [],
        text,
      },
    ],
  };
}

async function main() {
  const producer = await client.getDocument(id);

  if (!producer) {
    throw new Error("Joy Hill introuvable");
  }

  const bio = [
    block(
      "Tout en haut de la côte Joy Hill, Justine Therrien et Julien Niquet ont planté leurs premières vignes en 2017. Entre 2017 et 2019, ils ont mis en terre 37 000 ceps sur un terrain exposé plein sud, à environ 300 mètres d’altitude.",
      "joy-bio-fr-1"
    ),
    block(
      "Leur choix s’est porté sur des cépages européens comme le gamay, le chardonnay, le riesling et le blaufränkisch. Au chai, ils privilégient les fermentations naturelles et les interventions limitées pour laisser le raisin et le millésime s’exprimer.",
      "joy-bio-fr-2"
    ),
  ];

  const bioEn = [
    block(
      "At the top of Joy Hill, Justine Therrien and Julien Niquet planted their first vines in 2017. Between 2017 and 2019, they planted 37,000 vines on a south-facing site roughly 300 metres above sea level.",
      "joy-bio-en-1"
    ),
    block(
      "They chose European varieties such as Gamay, Chardonnay, Riesling and Blaufränkisch. In the cellar, they favour natural fermentations and minimal intervention, allowing the grapes and each vintage to speak for themselves.",
      "joy-bio-en-2"
    ),
  ];

  await client
    .patch(id)
    .set({
      bio,
      bioEn,
      instagram: "https://www.instagram.com/maisonagricolejoyhill/",
      mediaPermissionStatus: "authorized_by_producer",
      mediaCredit: "Maison agricole Joy Hill",
      secondaryImageCredit: "Maison agricole Joy Hill",
      mediaPermissionNote:
        "Le producteur a autorisé Le Premier Verre à utiliser des photos provenant de son site web.",
    })
    .commit();

  const result = await client.fetch(`
    *[_id == $id][0]{
      name,
      published,
      mediaPermissionStatus,
      instagram,
      heroImage,
      secondaryImage,
      bio,
      bioEn
    }
  `, { id });

  console.log("\n===== JOY HILL CORRIGÉ =====");
  console.log("Publié :", result.published);
  console.log("Autorisation :", result.mediaPermissionStatus);
  console.log("Instagram :", result.instagram);
  console.log("Hero :", Boolean(result.heroImage));
  console.log("Secondaire :", Boolean(result.secondaryImage));
  console.log("Bio FR :", result.bio?.length, "blocs");
  console.log("Bio EN :", result.bioEn?.length, "blocs");
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
