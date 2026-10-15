import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "czq6bjyu",
  dataset: "production",
  apiVersion: "2025-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

if (!process.env.SANITY_API_WRITE_TOKEN) {
  throw new Error("SANITY_API_WRITE_TOKEN manquant.");
}

const replacements = {
  "text-001": `Quand on commence à s’intéresser au vin, on a vite l’impression qu’il faudrait apprendre une quantité assez impressionnante de choses. Les cépages, les régions, les appellations, les millésimes et les producteurs semblent former un monde à apprendre avant même de pouvoir en profiter. En réalité, on peut très bien commencer autrement. Goûter quelques vins bien choisis et assez différents les uns des autres permet déjà de se construire de très bons repères.`,

  "text-003": `C’est l’idée derrière cette sélection de 20 bouteilles. Ce n’est pas un classement des meilleurs vins, ni une liste de bouteilles qu’il faudrait absolument avoir bues. Nous avons plutôt choisi des vins qui permettent chacun de découvrir quelque chose. La fraîcheur d’un Sauvignon blanc, les deux visages complètement différents du Chardonnay, la légèreté du Gamay, les tannins du Cabernet Sauvignon, les bulles d’un Cava ou encore la texture particulière d’un vin orange.`,

  "text-007": `Pas besoin non plus de goûter les 20 dans l’ordre. Garde la liste, choisis une bouteille de temps en temps et prends simplement quelques secondes pour remarquer ce qui te plaît ou ce qui te plaît moins. Après quelques vins, les préférences commencent généralement à apparaître toutes seules.`,

  "text-017": `C’est une bonne bouteille pour comprendre ce qu’on veut dire lorsqu’on décrit un blanc comme étant « vif » ou « aromatique ». Tout est assez facile à percevoir et le vin ne demande pas beaucoup d’analyse pour se faire comprendre. S’il te plaît, retiens surtout l’association entre Sauvignon blanc et Marlborough. C’est un repère simple et très utile lorsqu’on cherche plus tard un blanc frais pour l’apéro, les fruits de mer ou un repas léger.`,

  "text-028": `On retrouve ici une acidité très présente, des agrumes, des fruits à chair blanche et une dimension minérale qui donne au vin beaucoup de tension. Il est particulièrement intéressant de le goûter après le Sauvignon blanc. Les deux sont frais et aromatiques, mais leur personnalité est très différente. Cette comparaison permet déjà de comprendre qu’un terme comme « frais » peut désigner plusieurs sensations et plusieurs styles de vin.`,

  "text-037": `Une chose toute simple à retenir. Chablis est fait avec du Chardonnay. C’est intéressant parce que beaucoup de gens qui pensent ne pas aimer ce cépage découvrent qu’ils aiment en réalité beaucoup Chablis. Ce qu’ils apprécient moins, bien souvent, ce sont les versions très riches ou très boisées du Chardonnay.`,

  "text-050": `L’intérêt de goûter ces deux vins n’est pas de décider lequel représente le « vrai » Chardonnay. Les deux en sont. C’est justement ce qui rend la comparaison intéressante. Le cépage reste le même, mais le climat, l’origine et la vinification changent complètement le résultat. Après les avoir goûtés, il devient beaucoup plus facile de dire qu’on préfère un Chardonnay frais et peu boisé, ou au contraire une version plus ronde et enveloppante.`,

  "text-059": `Impossible de construire une sélection pour Le Premier Verre sans intégrer les vins québécois au parcours normal, plutôt que de les traiter comme une catégorie à part. L’Orpailleur est particulièrement pertinent pour commencer. Le domaine fait partie des pionniers de la viticulture moderne au Québec et a contribué à démontrer qu’une véritable industrie viticole pouvait se développer ici.`,

  "text-074": `C’est aussi le moment d’essayer de servir un rouge légèrement plus frais. Une vingtaine de minutes au réfrigérateur avant de passer à table peut suffire à faire ressortir son fruit et sa fraîcheur. Si ce style te plaît, Gamay et Beaujolais sont deux repères à retenir. Ils permettent souvent de retrouver des rouges souples et digestes qui fonctionnent avec beaucoup plus de plats qu’on pourrait le penser.`,

  "text-107": `C’est donc une bouteille à ouvrir avec le repas plutôt qu’à analyser seule pendant une demi-heure. Pizza, pâtes à la tomate, charcuteries ou viande grillée lui conviennent très bien. Essaie simplement une gorgée avant de manger, puis une autre avec le plat. On comprend assez vite pourquoi certains vins semblent prendre tout leur sens à table.`,

  "text-116": `Avec la Syrah, le profil devient plus sombre et plus épicé. On peut y retrouver des fruits noirs, du poivre, de la violette et parfois des notes fumées ou d’olive. Le cépage possède une personnalité assez distinctive. La vallée du Rhône est l’un de ses grands territoires historiques, particulièrement dans sa partie nord, et Ferraton permet d’entrer dans cet univers sans commencer directement par les appellations les plus coûteuses.`,

  "text-162": `On associe tellement les bulles au Champagne qu’on oublie parfois que Champagne désigne d’abord une origine. Le Cava espagnol permet de comprendre la différence. Il est lui aussi élaboré selon la méthode traditionnelle, avec une seconde fermentation directement dans la bouteille, mais il vient d’un autre territoire et utilise notamment des cépages traditionnels espagnols.`,

  "text-175": `Le résultat est souvent moins sage qu’un Cava, plus fruité, parfois trouble et généralement plus spontané dans son expression. Tuff Nutt est une bonne bouteille pour découvrir le style sans chercher à le comparer directement à un Champagne. Le pét-nat appartient à un autre registre, et c’est justement ce contraste qui le rend intéressant dans cette sélection.`,

  "text-186": `Whispering Angel est devenu l’un des noms les plus reconnaissables du rosé de Provence et a largement participé à populariser ce style très pâle, sec et délicat. Sa présence ici n’a donc rien d’original pour le plaisir de l’être. C’est justement une bouteille intéressante pour comprendre le style auquel une grande partie des rosés contemporains cherchent à se comparer.`,

  "text-188": `Au-delà de la couleur et de l’image très estivale du produit, on retrouve un vin frais, délicat et facile à mettre à table. Cuisine méditerranéenne, poisson, légumes grillés ou salades lui conviennent particulièrement bien. C’est aussi l’occasion de remettre le rosé à sa juste place. Un style de vin à part entière, et pas seulement une bouteille réservée aux journées de juillet.`,

  "text-214": `Trop Content permet d’en découvrir une version accessible tout en ajoutant une nouvelle origine à notre parcours. On y retrouve de la fraîcheur, mais également une texture différente de celle des premiers blancs de la liste. C’est aussi un bon rappel qu’un cépage n’est jamais une recette fixe. L’endroit où il pousse et la façon dont il est travaillé comptent tout autant que son nom.`,

  "text-236": `Son profil est généralement plus direct et nerveux que celui du Chardonnay. Albert Bichot en offre une introduction facile à comprendre, mais l’intérêt de cette dernière bouteille est surtout ailleurs. Même dans une région aussi connue que la Bourgogne, il reste toujours des cépages, des appellations et des producteurs à découvrir. Vingt bouteilles donnent de bons repères. Elles ne sont évidemment qu’un début.`,

  "text-243": `Il n’y a aucun intérêt à acheter les vingt bouteilles en même temps. Garde plutôt la liste et reviens-y lorsque tu as envie d’essayer quelque chose de nouveau. Après chaque bouteille, quelques mots suffisent pour conserver une trace. Très frais, trop boisé, beaucoup aimé avec le repas, trop tannique ou à racheter. Pas besoin de transformer le plaisir de boire un verre en exercice scolaire.`,

  "text-247": `C’est là que connaître un peu le vin devient réellement pratique. La prochaine fois que tu cherches une bouteille, tu ne pars plus complètement de zéro. Tu as quelques noms, quelques styles et surtout quelques préférences auxquelles te raccrocher.`,
};

const article = await client.fetch(`
  *[
    _type == "article" &&
    slug.current == "20-vins-a-connaitre-pour-commencer"
  ][0]{
    _id,
    content
  }
`);

if (!article?._id || !Array.isArray(article.content)) {
  throw new Error("Article introuvable.");
}

const found = new Set();

const content = article.content.map((block) => {
  if (!replacements[block?._key]) return block;

  found.add(block._key);

  if (
    block._type !== "block" ||
    block.style !== "normal" ||
    !Array.isArray(block.children) ||
    block.children.length !== 1
  ) {
    throw new Error(`STOP — structure inattendue pour ${block._key}.`);
  }

  return {
    ...block,
    children: block.children.map((child) => ({
      ...child,
      text: replacements[block._key],
    })),
  };
});

const missing = Object.keys(replacements).filter((key) => !found.has(key));

if (missing.length) {
  throw new Error(`STOP — blocs introuvables : ${missing.join(", ")}`);
}

await client
  .patch(article._id)
  .set({ content })
  .commit({ autoGenerateArrayKeys: false });

console.log("\n✓ CORPS DE L’ARTICLE RETRAVAILLÉ");
console.log(`✓ ${found.size} paragraphes modifiés`);
console.log("✓ Titres et intertitres intacts");
console.log("✓ Blocs À RETENIR intacts");
console.log("✓ Checklist des 20 vins intacte");
console.log("✓ Noms de vins intacts");
console.log("✓ Deux-points et tirets rédactionnels retirés des paragraphes visés");
