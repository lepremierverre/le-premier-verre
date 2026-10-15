import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const block = (key, text) => ({
  _key: key,
  _type: "block",
  style: "normal",
  markDefs: [],
  children: [
    {
      _key: `${key}span`,
      _type: "span",
      marks: [],
      text,
    },
  ],
});

const item = (key, title, text) => ({
  _key: key,
  _type: "producerApproachItem",
  title,
  text,
});

const id = "bb61af16-e4c6-42ad-968c-edd0752d054c";

await client
  .patch(id)
  .set({
    oneLiner:
      "Un vignoble familial de Saint-Armand qui fait partie de l’histoire du vin québécois depuis 1996.",

    oneLinerEn:
      "A family vineyard in Saint-Armand that has been part of Quebec wine history since 1996.",

    bio: [
      block(
        "bio1",
        "C’est à Saint-Armand que l’histoire du Domaine du Ridge commence en 1996. Denis Paradis plante alors les premières vignes avec sa famille et ses amis. Près de trente ans plus tard, le vignoble a grandi, la relève familiale est bien présente et le Ridge fait partie des domaines qui ont participé à construire l’histoire récente du vin québécois."
      ),
      block(
        "bio2",
        "Sur cette grande propriété des Cantons-de-l’Est, le vin se décline sous plusieurs formes. Blancs, rouges, rosés et bulles côtoient une programmation qui invite aussi les gens à venir vivre le vignoble. Une façon accessible et rassembleuse de faire découvrir ce qui pousse et se boit ici."
      ),
    ],

    bioEn: [
      block(
        "bio1",
        "The story of Domaine du Ridge began in Saint-Armand in 1996, when Denis Paradis planted the first vines with family and friends. Nearly thirty years later, the vineyard has grown, the next generation is actively involved and Ridge is among the estates that have helped shape the recent history of Quebec wine."
      ),
      block(
        "bio2",
        "On this large Eastern Townships property, wine takes many forms. Whites, reds, rosés and sparkling wines are joined by a program that invites people to experience the vineyard itself. It is an approachable and welcoming way to discover what grows and what is made here."
      ),
    ],

    approach: [
      item(
        "family",
        "Une histoire de famille",
        "Le Ridge naît en 1996 avec 2 000 premières vignes plantées par Denis Paradis, entouré de sa famille et de ses amis. Aujourd’hui, la relève poursuit l’aventure."
      ),
      item(
        "climate",
        "Des vins pour notre climat",
        "Le domaine travaille avec des cépages capables de s’adapter aux conditions québécoises. Seyval, Vidal, Maréchal Foch et Lucie Kuhlmann font notamment partie de son paysage."
      ),
      item(
        "experience",
        "Mettre les pieds dans le vignoble",
        "Ici, découvrir le vin passe aussi par l’expérience. Dégustations, visites, activités gourmandes et vendanges permettent de voir le domaine autrement que par la bouteille."
      ),
    ],

    approachEn: [
      item(
        "family",
        "A family story",
        "Ridge began in 1996 with 2,000 vines planted by Denis Paradis alongside family and friends. Today, the next generation is carrying the story forward."
      ),
      item(
        "climate",
        "Wines for our climate",
        "The estate works with grape varieties suited to Quebec conditions. Seyval, Vidal, Maréchal Foch and Lucie Kuhlmann are among the varieties found in its vineyards."
      ),
      item(
        "experience",
        "Step into the vineyard",
        "Here, discovering wine is also about the experience. Tastings, tours, food focused activities and harvest events offer another way to discover the estate beyond the bottle."
      ),
    ],

    whyWeFollow:
      "Parce que le Ridge raconte aussi une partie de l’histoire du vin d’ici. Celle de familles qui ont planté, essayé et continué à faire évoluer le vignoble québécois. On aime cette continuité, mais aussi leur façon de rendre le vin accessible et de faire du domaine un endroit où l’on vient autant pour découvrir que pour boire.",

    whyWeFollowEn:
      "Because Ridge tells part of the story of wine made here. It is the story of families who planted, experimented and kept pushing Quebec wine forward. We appreciate that continuity, along with the estate’s approachable way of making the vineyard a place to discover as much as a place to drink.",

    visitDetails:
      "Le domaine accueille les visiteurs en saison pour des dégustations, visites et différentes expériences au vignoble. Certaines activités nécessitent une réservation. Vérifier les expériences et les horaires directement auprès du domaine avant de se déplacer.",

    visitDetailsEn:
      "The estate welcomes visitors in season for tastings, tours and vineyard experiences. Some activities require a reservation. Check current experiences and opening hours directly with the estate before visiting.",
  })
  .commit();

console.log("✓ Domaine du Ridge FR + EN mis à jour");
