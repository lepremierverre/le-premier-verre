import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "czq6bjyu",
  dataset: "production",
  apiVersion: "2025-08-15",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
});

if (!client.config().token) {
  throw new Error("SANITY_API_WRITE_TOKEN ou SANITY_API_TOKEN est requis.");
}

let n = 0;
const key = (prefix = "b") => `${prefix}${String(++n).padStart(3, "0")}`;

function block(text, style = "normal") {
  return {
    _type: "block",
    _key: key(),
    style,
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: key("s"),
        text,
        marks: [],
      },
    ],
  };
}

const p = (text) => block(text);
const h2 = (text) => block(text, "h2");

function wineCard(ref) {
  return {
    _type: "articleWineCard",
    _key: key("wine"),
    wine: {
      _type: "reference",
      _ref: ref,
    },
  };
}

const content = [
  h2("Recevoir devrait être simple"),

  p("Il y a un moment, avant presque chaque souper, où l’on regarde les bouteilles sur le comptoir en se demandant si l’on a vraiment choisi les bonnes. Le blanc est-il assez sec pour l’apéro? Est-ce qu’il faut ouvrir le rouge maintenant ou attendre le plat principal? Est-ce que quelqu’un va préférer le rosé? Et cette bouteille qu’on avait achetée pour le dessert, est-ce qu’elle va vraiment trouver sa place?"),

  p("On peut aussi décider de ne pas se poser toutes ces questions."),

  p("Recevoir des gens qu’on aime n’a jamais eu besoin d’être une épreuve de sommellerie. Le vin accompagne le repas, la conversation et le moment. Il n’a pas besoin d’être parfaitement assorti à chaque bouchée pour faire son travail. En fait, lorsqu’on reçoit, la bouteille la plus utile est souvent celle qui sait rester à sa place."),

  p("C’est particulièrement vrai lorsqu’on ne connaît pas exactement les goûts de tout le monde. Il y aura toujours quelqu’un qui préfère le blanc, quelqu’un qui ne boit presque jamais de rouge, quelqu’un qui aime les vins plus fruités et quelqu’un qui vous dira qu’il ne s’y connaît pas du tout. Ce n’est pas un problème à régler. C’est simplement une raison de choisir des vins souples, frais et faciles à partager."),

  p("L’idée n’est donc pas de constituer une cave miniature chaque fois que des amis viennent souper. Avec quelques styles bien choisis, on peut couvrir une soirée entière et garder son énergie pour ce qui compte vraiment, soit être avec ses invités."),

  h2("Commencer par l’apéro"),

  p("L’apéro est probablement le moment le plus facile de la soirée pour le vin. On n’a pas encore sorti les plats, les conversations commencent, quelqu’un grignote des olives pendant qu’une autre personne arrive avec une baguette sous le bras. Il faut une bouteille qui donne envie de prendre un premier verre, pas une bouteille qui demande une explication."),

  p("Les bulles sont évidemment très à l’aise ici. Elles donnent immédiatement une impression de fête et peuvent accompagner aussi bien quelques bouchées salées qu’une planche de charcuteries ou de fromages. Un blanc frais fonctionne tout aussi bien et a l’avantage de pouvoir continuer avec l’entrée si le repas est dans le même registre."),

  wineCard("wine-pares-balta-cava-brut"),
  wineCard("wine-l-orpailleur-brut"),

  p("Un rosé sec peut également être une excellente bouteille d’accueil, particulièrement lorsqu’on reçoit au printemps et en été. Il accompagne facilement les légumes grillés, les tartinades, les salades, les fruits de mer et les petites bouchées qui circulent avant le repas."),

  wineCard("wine-domaine-du-ridge-le-litre-du-ridge-rose"),

  p("Pour un apéro qui doit se prolonger, on peut simplement prévoir une bouteille pour quatre à cinq personnes qui boivent du vin. Cela permet de commencer tranquillement sans ouvrir toute la réserve avant même de passer à table."),

  h2("L’entrée n’a pas besoin de changer complètement le vin"),

  p("C’est ici que l’on complique parfois inutilement les choses. On imagine qu’il faut une bouteille pour l’apéro, une autre pour l’entrée et une troisième dès que le plat principal arrive. Pourtant, si le vin servi à l’arrivée fonctionne bien avec l’entrée, pourquoi le changer?"),

  p("Un blanc frais peut accompagner un ceviche, des crevettes, une salade, des légumes rôtis ou une entrée à base de fromage sans problème. Un rosé sec peut suivre la même logique. Si l’entrée est plus riche, avec une sauce crémeuse, des champignons ou une préparation gratinée, on peut simplement choisir un blanc un peu plus texturé."),

  wineCard("wine-domaine-du-ridge-seyval-vidal"),
  wineCard("wine-pieropan-soave-classico"),

  p("Le principe est beaucoup plus simple qu’un accord précis. On cherche un vin qui ne domine pas l’assiette et qui donne envie de continuer à boire. Si la première bouteille fonctionne avec deux services, c’est une bonne chose. Une réception n’a pas besoin de changer de vin au son de chaque plat."),

  h2("Pour le repas, penser au style avant de penser à la bouteille parfaite"),

  p("Lorsque le plat principal arrive, c’est souvent là que l’on commence à chercher le vin parfait. On peut plutôt commencer par une question beaucoup plus simple. Est-ce que le repas est léger, généreux, épicé, grillé ou mijoté?"),

  p("Avec un poisson, des fruits de mer, de la volaille ou un plat végétarien, un blanc frais reste une valeur très polyvalente. Avec un plat plus crémeux ou des légumes rôtis, un blanc plus ample peut être intéressant. Avec des grillades, un rôti, une sauce tomate ou un plat de pâtes plus riche, un rouge souple ou moyennement structuré prendra naturellement le relais."),

  wineCard("wine-la-chablisienne-chablis-la-sereine"),
  wineCard("wine-christophe-pacalet-beaujolais-les-marcellins-2024"),
  wineCard("wine-famille-perrin-cotes-du-rhone-signature-2023"),

  p("Cela ne signifie pas qu’il faut éliminer les rouges avec le poisson ou les blancs avec la viande. Au contraire. Si vos invités aiment le blanc, personne ne gagnera quoi que ce soit à leur servir un rouge simplement parce qu’un tableau d’accords le recommande. Le repas est là pour être mangé et le vin pour être bu."),

  p("Il faut aussi se méfier du réflexe qui consiste à choisir le vin le plus puissant pour un repas riche. Plus corsé ne veut pas automatiquement dire meilleur avec un plat généreux. Un vin très boisé, très tannique ou très concentré peut rapidement prendre toute la place. Pour une soirée qui dure, un vin équilibré et souple est souvent beaucoup plus agréable."),

  h2("Le fromage peut faire durer la bouteille"),

  p("Le fromage est l’un des meilleurs moments pour ne pas se compliquer la vie. Un même vin peut accompagner plusieurs fromages, particulièrement lorsqu’on choisit une sélection assez simple. Les blancs frais fonctionnent très bien avec plusieurs fromages à pâte molle ou chèvre, tandis qu’un rouge souple peut facilement suivre avec des fromages plus affinés."),

  p("Il n’est pas nécessaire de prévoir une bouteille différente pour chaque fromage de la planche. Si vous servez une petite sélection variée, choisissez plutôt un vin assez polyvalent et laissez les invités goûter. La combinaison qui fonctionne le mieux sera parfois celle que personne n’avait prévue."),

  p("C’est d’ailleurs une bonne façon de recevoir. On met les choses sur la table et on laisse un peu de place à la découverte."),

  h2("Et le dessert?"),

  p("Le dessert est probablement le service où l’on peut le plus facilement décider de ne pas servir de vin. Un café, un thé ou simplement un verre d’eau peuvent très bien marquer la fin du repas. Si vous souhaitez continuer avec le vin, il vaut mieux penser au niveau de sucre du dessert."),

  p("Un dessert très sucré peut rendre un vin sec mince et dur. Dans ce cas, un vin légèrement doux ou moelleux peut être beaucoup plus agréable. Avec un dessert chocolaté, on peut également se tourner vers des vins plus riches, selon le style du dessert."),

  p("Mais encore une fois, rien n’oblige à ajouter une bouteille uniquement parce qu’il reste un dernier service. Si tout le monde est heureux autour de la table, le repas peut très bien se terminer sans nouveau verre."),

  h2("Combien de bouteilles acheter?"),

  p("Pour prévoir les quantités, il faut surtout savoir combien de personnes boivent réellement du vin et combien de temps la soirée doit durer. Une bouteille de 750 millilitres donne généralement autour de cinq verres de service raisonnables. Ce chiffre n’est pas une règle absolue, mais il donne un bon point de départ pour faire ses achats."),

  p("Pour quatre personnes qui boivent du vin, deux bouteilles peuvent suffire pour un souper tranquille. Pour six personnes, trois bouteilles offrent davantage de marge. Pour huit personnes, quatre bouteilles permettent généralement de proposer deux styles ou de garder une bouteille de réserve. À dix ou douze personnes, on peut simplement augmenter les quantités en conservant la même logique."),

  p("Il est souvent plus agréable de prévoir un peu de variété plutôt que de multiplier les bouteilles. Pour huit personnes, par exemple, quatre bouteilles pourraient être réparties entre deux blancs et deux rouges si le repas s’y prête. On peut aussi remplacer l’une des bouteilles par des bulles pour l’arrivée."),

  p("Le plus important est de ne pas confondre quantité et obligation de consommation. Certaines personnes boiront un seul verre, d’autres aucun. L’eau doit toujours être facilement accessible et les options sans alcool peuvent parfaitement faire partie de la soirée. Prévoir généreusement ne veut pas dire qu’il faut tout ouvrir."),

  h2("Le budget peut rester raisonnable"),

  p("Recevoir plusieurs personnes peut rapidement devenir coûteux si chaque bouteille est choisie comme si elle devait être la vedette du repas. Ce n’est pourtant pas nécessaire."),

  p("Pour une soirée conviviale, il est souvent plus intéressant de répartir le budget entre quelques bouteilles cohérentes que de mettre presque toute la somme dans une seule bouteille prestigieuse. Un blanc polyvalent, un rouge souple et quelques bulles accessibles peuvent donner une soirée beaucoup plus agréable qu’une seule bouteille exceptionnelle qui doit ensuite être partagée avec tout le monde."),

  p("Le budget dépend évidemment de vos habitudes et de l’occasion. Pour une petite réception, quelques bouteilles dans une gamme abordable peuvent très bien faire l’affaire. Pour une fête ou un repas plus important, on peut ajouter une bouteille un peu spéciale sans avoir à transformer toute la sélection."),

  p("Et si vous avez déjà quelques bouteilles à la maison, commencez par celles-là. Recevoir est une excellente occasion de vider une bouteille que vous aimez plutôt que d’acheter systématiquement quelque chose de nouveau."),

  h2("Quand on ne connaît pas les goûts des invités"),

  p("C’est probablement la situation la plus simple à régler si on accepte de ne pas vouloir plaire parfaitement à tout le monde."),

  p("Lorsqu’on ne connaît pas les préférences des invités, il vaut mieux éviter les vins très polarisants. On peut privilégier un blanc frais, un rouge souple et, si le nombre de personnes le justifie, des bulles. Ces trois styles couvrent déjà une grande partie des situations."),

  p("On peut aussi poser une question très simple avant le souper. Est-ce que vous buvez plutôt blanc, rouge ou un peu des deux? Cela suffit largement. Il n’est pas nécessaire de demander le cépage préféré, la région de prédilection ou le niveau d’acidité recherché."),

  p("Et si personne ne sait quoi répondre, tant mieux. C’est précisément le moment de choisir des bouteilles polyvalentes et de laisser les invités découvrir ce qu’ils aiment."),

  h2("L’ordre de service est plus simple qu’il n’en a l’air"),

  p("Il n’existe pas une seule façon correcte de servir le vin à table, mais une logique assez naturelle fonctionne dans la plupart des soirées. On commence généralement par les vins les plus frais et légers, puis on avance vers les vins plus riches ou plus structurés."),

  p("Cela peut vouloir dire commencer avec des bulles, poursuivre avec un blanc, puis servir un rouge avec le plat principal. Mais si votre blanc accompagne tout le repas et que personne ne réclame de rouge, il n’y a aucune raison de changer de bouteille uniquement pour respecter un ordre théorique."),

  p("Il vaut également mieux ouvrir les bouteilles au fur et à mesure. Une bouteille qui attend au frais peut être ouverte lorsque la première est terminée ou lorsque le plat change. Cela permet de garder le vin à la bonne température et évite de se retrouver avec plusieurs bouteilles ouvertes en même temps."),

  h2("La température compte plus qu’un accessoire sophistiqué"),

  p("Le vin n’a pas besoin d’une mise en scène compliquée, mais la température peut vraiment changer l’expérience. Les bulles et les blancs sont généralement plus agréables lorsqu’ils sont bien frais. Un rouge léger ou souple peut aussi être légèrement rafraîchi, particulièrement si la pièce est chaude."),

  p("Il n’est pas nécessaire de sortir une panoplie complète. Une bouteille de blanc peut rester au réfrigérateur avant le repas et être déposée dans un seau à glace si elle doit rester longtemps sur la table. Pour un rouge, quelques minutes au frais peuvent parfois faire une grande différence."),

  p("La carafe, elle, est une possibilité et non une obligation. Certains vins en profitent, d’autres beaucoup moins. Pour une soirée où l’objectif est de recevoir simplement, ouvrir la bouteille, la servir à une température agréable et passer à table est souvent tout ce qu’il faut."),

  h2("Et si le menu change à la dernière minute?"),

  p("Il y a toujours quelqu’un qui annonce qu’il apporte finalement un plat, quelqu’un qui oublie de préciser qu’il ne mange pas de viande ou quelqu’un qui décide de commander une pizza parce que personne n’a envie de cuisiner. C’est exactement pour ce genre de situation que les vins polyvalents sont utiles."),

  p("Si le repas change, commencez par le vin qui s’adapte le mieux. Un blanc frais peut accompagner beaucoup plus de choses qu’on le pense. Un rouge souple peut également suivre une grande variété de plats. Les bulles peuvent même traverser une soirée entière lorsque le repas passe de l’apéro aux bouchées puis au plat principal."),

  p("Le meilleur plan B est donc souvent le même que le plan A. Garder quelques bouteilles équilibrées et faciles à partager."),

  h2("Quelques bouteilles peuvent suffire à toute la soirée"),

  p("Au fond, recevoir avec du vin revient surtout à faire quelques choix simples. Une bouteille pour commencer, une autre pour accompagner le repas, puis éventuellement une troisième si la soirée se poursuit. Le reste peut s’adapter en fonction des personnes, du menu et de l’humeur du moment."),

  p("On peut évidemment aller beaucoup plus loin. Chercher un accord précis, ouvrir une bouteille plus rare, comparer deux régions ou faire découvrir un cépage à ses invités peut être formidable. Mais ce sont des plaisirs supplémentaires, pas des conditions pour bien recevoir."),

  p("La meilleure bouteille de la soirée ne sera pas nécessairement la plus chère ni la plus complexe. Ce sera peut-être simplement celle qui était encore là lorsque tout le monde s’est resservi et que la conversation s’est prolongée une heure de plus que prévu."),

  h2("Recevoir, finalement"),

  p("Recevoir sans se compliquer la vie, c’est accepter qu’un repas n’a pas besoin d’être parfaitement orchestré pour être réussi. Le vin peut accompagner l’apéro, suivre à table, changer lorsque le repas l’exige ou rester le même pendant plusieurs heures. Il n’y a pas de cloche qui sonne entre chaque service."),

  p("Un blanc frais, un rouge souple et quelques bulles permettent déjà de faire beaucoup. Ajoutez un peu d’eau sur la table, quelque chose de bon à manger et suffisamment de place pour que les conversations s’installent."),

  p("Le reste peut attendre."),

  p("Parce qu’au fond, si vos invités repartent en parlant du souper plutôt que du vin qu’il aurait fallu choisir, vous avez probablement très bien reçu."),
];

const article = {
  _id: "article-recevoir-sans-se-compliquer-la-vie",
  _type: "article",
  title: "Recevoir sans se compliquer la vie",
  slug: {
    _type: "slug",
    current: "recevoir-sans-se-compliquer-la-vie",
  },
  excerpt:
    "Quelques bouteilles, un bon repas et beaucoup moins de règles. Comment choisir des vins polyvalents pour recevoir sans transformer le souper en exercice de sommellerie.",
  content,
  category: "Recevoir",
  author: "Le Premier Verre",
  tags: [
    "recevoir",
    "accords",
    "sélection",
    "apéro",
    "repas",
    "vin polyvalent",
  ],
  relatedWines: [
    "wine-pares-balta-cava-brut",
    "wine-l-orpailleur-brut",
    "wine-domaine-du-ridge-le-litre-du-ridge-rose",
    "wine-domaine-du-ridge-seyval-vidal",
    "wine-pieropan-soave-classico",
    "wine-la-chablisienne-chablis-la-sereine",
    "wine-christophe-pacalet-beaujolais-les-marcellins-2024",
    "wine-famille-perrin-cotes-du-rhone-signature-2023",
  ].map((_ref) => ({
    _type: "reference",
    _key: key("related"),
    _ref,
  })),
  featured: false,
  publishedAt: new Date().toISOString(),
  seoTitle: "Quel vin pour recevoir sans se compliquer la vie | Le Premier Verre",
  seoDescription:
    "Recevoir sans se compliquer la vie avec quelques bouteilles polyvalentes pour l’apéro, le repas et les invités, sans multiplier les règles ni les accords.",
};

const existing = await client.getDocument(article._id);

if (existing) {
  await client
    .patch(article._id)
    .set(article)
    .unset([
      "titleEn",
      "excerptEn",
      "contentEn",
      "categoryEn",
      "tagsEn",
      "seoTitleEn",
      "seoDescriptionEn",
      "translationSourceHash",
    ])
    .commit();

  console.log(`Article 4 mis à jour: ${article._id}`);
} else {
  await client.create(article);
  console.log(`Article 4 créé: ${article._id}`);
}

console.log(`Blocs Portable Text: ${content.length}`);
console.log("FR prêt. Les champs EN seront générés par le système de traduction LPV.");
