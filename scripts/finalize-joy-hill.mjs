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

  if (!producer.heroImage?.asset?._ref || !producer.secondaryImage?.asset?._ref) {
    throw new Error("Les deux photos Joy Hill ne sont pas présentes");
  }

  const oldHero = producer.heroImage;
  const oldSecondary = producer.secondaryImage;

  await client
    .patch(id)
    .set({
      heroImage: oldSecondary,
      secondaryImage: oldHero,

      mediaCredit: "Maison agricole Joy Hill",
      secondaryImageCredit: "Maison agricole Joy Hill",

      bio: [
        block(
          "Justine Therrien et Julien Niquet ont commencé à planter Joy Hill en 2017, tout en haut de la côte du même nom à Frelighsburg. Leur projet est né d’une envie assez simple, cultiver ici les cépages qu’ils aiment boire et voir ce qu’ils peuvent raconter une fois enracinés au Québec.",
          "joy-final-fr-1"
        ),
        block(
          "Aujourd’hui, gamay, chardonnay, riesling et plusieurs autres variétés poussent sur les hauteurs du domaine. Justine et Julien les accompagnent avec une approche naturelle et peu interventionniste, autant dans les vignes qu’au chai. Des vins libres, vivants et très Joy Hill.",
          "joy-final-fr-2"
        ),
      ],

      bioEn: [
        block(
          "Justine Therrien and Julien Niquet began planting Joy Hill in 2017, at the top of the hill of the same name in Frelighsburg. Their project grew from a simple idea, to grow the grape varieties they love to drink and see what they could become once rooted in Quebec.",
          "joy-final-en-1"
        ),
        block(
          "Today, Gamay, Chardonnay, Riesling and several other varieties grow on the estate’s hillside. Justine and Julien work with them through a natural, low intervention approach in both the vineyard and the cellar. The result is lively, distinctive wine with a character that feels unmistakably Joy Hill.",
          "joy-final-en-2"
        ),
      ],
    })
    .commit();

  const result = await client.getDocument(id);

  console.log("✓ Photos Joy Hill inversées");
  console.log("✓ Le domaine FR réécrit");
  console.log("✓ The estate EN réécrit");
  console.log("✓ Hero présent :", Boolean(result.heroImage));
  console.log("✓ Secondaire présente :", Boolean(result.secondaryImage));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
