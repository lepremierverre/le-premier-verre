import { createClient } from "@sanity/client";
import crypto from "node:crypto";

const WRITE = process.argv.includes("--write");

const client = createClient({
  projectId: "czq6bjyu",
  dataset: "production",
  apiVersion: "2025-08-15",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
});

const wines = [
{
sku:"11768795",
patch:{
name:"Piccini Chianti Classico Riserva",
style:"Rouge italien structuré et classique",
approxPrice:21.40, alcohol:14, sugar:2.4,
organic:true,
body:3,sweetness:1,roundness:3,acidity:4,tannins:3,
servingTemperature:"15–17 °C",
cellaringPotential:"À boire maintenant ou à garder jusqu’à environ 7 ans suivant le millésime.",
aromas:["prune","fruits cuits","épices","cèdre","notes boisées"],
flavors:["prune mûre","noyau de cerise","épices","bois"],
texture:"Souple et généreuse, avec des tanins affinés et une fraîcheur marquée.",
finish:"Persistante, épicée et légèrement boisée.",
vinification:"Raisins égrappés puis pressurés doucement; vinification traditionnelle sur les peaux.",
aging:"Élevage prolongé correspondant au style Riserva; la SAQ indique 24 mois en fût.",
oneLiner:"Le Chianti Classico dans un registre rassurant : sangiovese, fraîcheur, prune, épices et juste assez de bois.",
oneLinerEn:"Chianti Classico in a reassuringly classic register: Sangiovese, freshness, plum, spice and just enough oak.",
tastingKeywords:["prune","épices","cerise","boisé"],
tastingKeywordsEn:["plum","spice","cherry","oak"],
perfectFor:["comprendre le sangiovese","soirée pâtes ou grillades","amateurs de rouges italiens classiques"],
perfectForEn:["discovering Sangiovese","pasta or grilled-meat night","fans of classic Italian reds"],
whyWeRecommend:"Parce qu’il donne un repère très lisible du Chianti Classico sans demander un gros budget. Le sangiovese garde sa fraîcheur et son caractère épicé, tandis que l’élevage apporte de la profondeur sans faire disparaître le fruit.",
whyWeRecommendEn:"Because it offers a clear reference point for Chianti Classico without a large budget. Sangiovese keeps its freshness and spicy character while ageing adds depth without burying the fruit.",
experienceLevel:"beginner"
}},

{
sku:"12057004",
patch:{
name:"Alois Lageder Pinot Bianco Südtirol Alto Adige 2024",
vintage:2024,
style:"Blanc alpin sec, frais et minéral",
alcohol:12,sugar:1.6,organic:true,
body:2,sweetness:1,roundness:2,acidity:4,
servingTemperature:"6–8 °C",
cellaringPotential:"À privilégier jeune; le domaine indique un potentiel optimal d’environ 1 à 2 ans.",
aromas:["pomme","poire","agrumes","fleurs blanches","notes minérales"],
flavors:["fruits du verger","agrumes","minéralité"],
texture:"Fine, droite et délicate, portée par une fraîcheur nette.",
finish:"Fraîche, sèche et précise.",
soil:"Sols graveleux, sableux et très calcaires.",
vinification:"Fermentation à température contrôlée en cuve inox.",
aging:"Environ 4 mois sur lies fines en cuve inox.",
harvestMethod:"Raisins issus de vignobles sélectionnés de l’Alto Adige, situés approximativement entre 300 et 500 mètres d’altitude.",
oneLiner:"Un blanc alpin qui mise sur la précision plutôt que la puissance : pomme, poire, fleurs et finale nette.",
oneLinerEn:"An Alpine white built on precision rather than power: apple, pear, flowers and a clean finish.",
tastingKeywords:["pomme","poire","fleurs blanches","minéral"],
tastingKeywordsEn:["apple","pear","white flowers","mineral"],
perfectFor:["découvrir le pinot blanc","apéritif élégant","poissons et crustacés"],
perfectForEn:["discovering Pinot Blanc","an elegant aperitif","fish and shellfish"],
whyWeRecommend:"Parce qu’il montre à quel point un blanc léger peut avoir de la personnalité. L’altitude, les sols calcaires et l’élevage sur lies donnent ici un vin précis, texturé juste ce qu’il faut et très facile à placer à table.",
whyWeRecommendEn:"Because it shows how much personality a light white can have. Altitude, calcareous soils and lees ageing create a precise wine with just enough texture and excellent versatility at the table.",
experienceLevel:"beginner"
}},

{
sku:"15526996",
patch:{
name:"Boland Cellar Chenin Blanc 2025",
vintage:2025,
style:"Chenin sud-africain fruité et vif",
alcohol:13,sugar:4,
body:3,sweetness:1,roundness:3,acidity:4,
servingTemperature:"8–10 °C",
aromas:["poire","melon miel","citronnelle"],
flavors:["poire","melon","agrumes"],
texture:"Délicate mais suffisamment ample grâce au travail sur lies.",
finish:"Fraîche, fruitée et vive.",
vinification:"Vin conservé en cuve inox afin de préserver sa fraîcheur.",
aging:"Élevage sur lies pendant environ trois mois pour apporter texture et complexité aromatique, puis conservation en inox jusqu’à la mise en bouteille.",
oneLiner:"Du chenin sud-africain sans complication : poire, melon, fraîcheur et beaucoup de plaisir pour le prix.",
oneLinerEn:"Straightforward South African Chenin: pear, melon, freshness and a lot of pleasure for the price.",
tastingKeywords:["poire","melon miel","citronnelle","frais"],
tastingKeywordsEn:["pear","honeydew melon","lemongrass","fresh"],
perfectFor:["découvrir le chenin","cuisine asiatique","blanc de semaine"],
perfectForEn:["discovering Chenin Blanc","Asian cuisine","an everyday white"],
whyWeRecommend:"Parce qu’à ce prix, il permet de comprendre facilement pourquoi le chenin est si important en Afrique du Sud. Il combine fruit mûr, acidité et texture sans devenir lourd ni compliqué.",
whyWeRecommendEn:"Because at this price it makes it easy to understand why Chenin Blanc matters so much in South Africa. It combines ripe fruit, acidity and texture without becoming heavy or complicated.",
experienceLevel:"beginner"
}},

{
sku:"11293970",
patch:{
name:"Château Mont-Redon Lirac",
style:"Rouge du Rhône méridional ample et épicé",
alcohol:15,sugar:2.4,
body:5,sweetness:1,roundness:4,acidity:3,tannins:4,
servingTemperature:"15–17 °C",
aromas:["cerise","fruits noirs","réglisse","violette","chocolat noir"],
flavors:["fruits noirs","cerise","réglisse","épices"],
texture:"Corsée, généreuse et étoffée.",
finish:"Longue, chaleureuse et épicée.",
vinification:"Assemblage dominé par le grenache, complété de syrah et de mourvèdre; tri sélectif des raisins.",
aging:"Environ un tiers de l’assemblage est élevé en fûts, le reste en cuves.",
oneLiner:"Le Rhône sud dans toute sa générosité : grenache mûr, fruits noirs, violette, réglisse et structure.",
oneLinerEn:"Southern Rhône generosity in full: ripe Grenache, dark fruit, violet, licorice and structure.",
tastingKeywords:["fruits noirs","violette","réglisse","épices"],
tastingKeywordsEn:["dark fruit","violet","licorice","spice"],
perfectFor:["découvrir Lirac","grillades et agneau","amateurs de rouges généreux"],
perfectForEn:["discovering Lirac","grilled meats and lamb","fans of generous reds"],
whyWeRecommend:"Parce que Lirac est exactement le genre d’appellation que Le Premier Verre veut faire découvrir : voisine de Châteauneuf-du-Pape, moins célèbre, mais capable d’offrir un rouge profond et typiquement rhodanien sans payer uniquement pour le nom.",
whyWeRecommendEn:"Because Lirac is exactly the kind of appellation Le Premier Verre wants readers to discover: next door to Châteauneuf-du-Pape, less famous, yet capable of delivering a deep and distinctly Rhône-style red without paying mainly for the name.",
experienceLevel:"intermediate"
}},

{
sku:"212993",
patch:{
name:"Cousiño-Macul Antiguas Reservas Cabernet Sauvignon",
style:"Cabernet chilien classique, structuré et élégant",
alcohol:14,sugar:2.6,
body:5,sweetness:1,roundness:4,acidity:3,tannins:4,
servingTemperature:"15–17 °C",
cellaringPotential:"À boire maintenant ou à garder environ 6 ans suivant le millésime selon la SAQ.",
aromas:["cassis","cerise","poivre noir","menthe","réglisse"],
flavors:["fruits noirs","fruits rouges","épices","notes grillées"],
texture:"Généreuse, structurée, avec des tanins fermes et mûrs.",
finish:"Longue, savoureuse et légèrement mentholée.",
oneLiner:"Un cabernet du Maipo qui garde un pied dans le classicisme : fruit mûr, structure, fraîcheur et tanins sérieux.",
oneLinerEn:"A Maipo Cabernet with a classic streak: ripe fruit, structure, freshness and serious tannins.",
tastingKeywords:["cassis","poivre noir","menthe","boisé"],
tastingKeywordsEn:["blackcurrant","black pepper","mint","oak"],
perfectFor:["comprendre le cabernet chilien","viandes rouges","cave abordable"],
perfectForEn:["understanding Chilean Cabernet","red meats","an affordable cellar pick"],
whyWeRecommend:"Parce qu’Antiguas Reservas est une cuvée historique de Cousiño-Macul et un bon contre-exemple à l’idée que le cabernet chilien doit forcément être très mûr ou démonstratif. Ici, la structure et la fraîcheur comptent autant que le fruit.",
whyWeRecommendEn:"Because Antiguas Reservas is a historic Cousiño-Macul wine and a useful counterexample to the idea that Chilean Cabernet must always be very ripe or showy. Here, structure and freshness matter as much as fruit.",
experienceLevel:"beginner"
}},

{
sku:"15460261",
patch:{
name:"111 Tempranillo Sélection Spécial Rioja 2023",
vintage:2023,
style:"Rioja bio souple et épicé",
alcohol:13,sugar:3,organic:true,
body:3,sweetness:1,roundness:3,acidity:3,tannins:3,
servingTemperature:"16–18 °C",
aromas:["prune","fruits noirs","violette","épices douces"],
flavors:["prune","fruits noirs","épices","bois discret"],
texture:"Souple et généreuse, avec une structure modérée.",
finish:"Épicée, fruitée et harmonieuse.",
aging:"Environ six mois en fûts de chêne français et américain.",
oneLiner:"Un Rioja bio à moins de quinze dollars qui va droit au but : prune, épices, fruit noir et bois discret.",
oneLinerEn:"An organic Rioja around fifteen dollars that gets straight to the point: plum, spice, dark fruit and discreet oak.",
tastingKeywords:["prune","fruits noirs","violette","épices douces"],
tastingKeywordsEn:["plum","dark fruit","violet","sweet spice"],
perfectFor:["premier Rioja","repas de semaine","plats mijotés"],
perfectForEn:["a first Rioja","weeknight dinners","slow-cooked dishes"],
whyWeRecommend:"Parce qu’il remplit parfaitement le rôle d’un vin d’apprentissage : prix accessible, tempranillo majoritaire, passage sous bois perceptible mais pas envahissant et profil immédiatement compréhensible.",
whyWeRecommendEn:"Because it works perfectly as a learning wine: accessible price, Tempranillo-led blend, noticeable but restrained oak and an immediately understandable profile.",
experienceLevel:"beginner"
}},

{
sku:"884379",
patch:{
name:"Louis Bouillot Perle Rare Crémant de Bourgogne 2022",
vintage:2022,
style:"Crémant de Bourgogne millésimé, vineux et gastronomique",
alcohol:12,sugar:7,
body:3,sweetness:2,roundness:3,acidity:4,
servingTemperature:"8–10 °C",
aromas:["agrumes","pomme","pain grillé","notes minérales"],
flavors:["agrumes","fruits du verger","toast"],
texture:"Bulles fines, matière ample et équilibre porté par la fraîcheur.",
finish:"Persistante, fraîche et légèrement toastée.",
aging:"Perle Rare est élevée au minimum deux ans; le long vieillissement apporte progressivement des notes toastées et minérales.",
vinification:"Cuvée millésimée issue d’une sélection des meilleurs vins de l’année. Pour 2022, Louis Bouillot indique un assemblage des quatre cépages bourguignons : chardonnay, pinot noir, aligoté et gamay.",
oneLiner:"Un crémant qui veut jouer à table, pas seulement à l’apéro : plus de matière, de temps et de complexité.",
oneLinerEn:"A Crémant built for the table, not just the aperitif: more texture, time and complexity.",
tastingKeywords:["agrumes","pomme","toast","minéral"],
tastingKeywordsEn:["citrus","apple","toast","mineral"],
perfectFor:["découvrir le crémant","apéritif chic","poissons et huîtres"],
perfectForEn:["discovering Crémant","an elegant aperitif","fish and oysters"],
whyWeRecommend:"Parce qu’il montre clairement que les bulles françaises ne se résument pas au champagne. Le millésime, la sélection des vins et l’élevage prolongé donnent ici un crémant avec assez de matière pour accompagner tout un repas.",
whyWeRecommendEn:"Because it clearly shows that French sparkling wine is not limited to Champagne. Vintage selection and extended ageing give this Crémant enough substance to accompany an entire meal.",
experienceLevel:"intermediate"
}},

{
sku:"15224277",
patch:{
name:"Gérard Bertrand Naturae Chardonnay Pays d'Oc",
style:"Chardonnay bio sans sulfites ajoutés, rond et fruité",
alcohol:13.5,sugar:1.4,
organic:true,natural:true,vegan:true,
certifications:["Agriculture biologique","Vegan","Sans sulfites ajoutés"],
body:3,sweetness:1,roundness:4,acidity:3,
servingTemperature:"8–10 °C",
aromas:["agrumes","fleurs blanches","poire","vanille","pain d’épices"],
flavors:["poire","agrumes","vanille","épices douces"],
texture:"Ronde, harmonieuse et souple.",
finish:"Fruitée, douce de texture mais sèche.",
vinification:"Raisins refroidis rapidement après réception puis pressurés. Fermentation menée sous atmosphère protégée avec température contrôlée autour de 18 °C; fermentation malolactique avant conservation au froid.",
aging:"Mise en bouteille relativement tôt afin de préserver l’expression aromatique; élevage principalement en bouteille.",
oneLiner:"Un chardonnay nature sans le côté déroutant : rond, fruité, sec et très facile à comprendre.",
oneLinerEn:"A natural Chardonnay without the challenging side: round, fruity, dry and easy to understand.",
tastingKeywords:["poire","agrumes","fleurs blanches","vanille"],
tastingKeywordsEn:["pear","citrus","white flowers","vanilla"],
perfectFor:["premier vin nature","chardonnay sans bois marqué","apéritif ou poisson"],
perfectForEn:["a first natural wine","Chardonnay without heavy oak","aperitif or fish"],
whyWeRecommend:"Parce qu’il permet d’aborder le vin sans sulfites ajoutés par une porte familière : le chardonnay. Le profil reste propre, rond et lisible, ce qui en fait une bonne bouteille pour comprendre qu’un vin « nature » n’a pas besoin d’être étrange.",
whyWeRecommendEn:"Because it approaches no-added-sulphur wine through a familiar grape: Chardonnay. The profile remains clean, round and easy to read, showing that a natural wine does not need to taste unconventional.",
experienceLevel:"beginner"
}},

{
sku:"13990592",
patch:{
name:"Kir-Yianni Assyrtiko",
style:"Blanc grec sec, minéral et salin",
alcohol:13.5,
body:2,sweetness:1,roundness:3,acidity:4,
servingTemperature:"6–8 °C",
aromas:["pêche","fruits blancs","fleurs","notes minérales"],
flavors:["agrumes","fruits blancs","minéralité"],
texture:"Fraîche mais avec du volume apporté par l’élevage sur lies.",
finish:"Persistante, saline et fraîche.",
vinification:"Raisins refroidis pendant la nuit puis macération à froid afin de favoriser l’extraction aromatique.",
aging:"Environ 4 à 5 mois sur lies après fermentation pour apporter volume et complexité.",
oneLiner:"L’assyrtiko loin de Santorin : toujours sec et minéral, mais avec une texture plus ronde et un vrai côté salin.",
oneLinerEn:"Assyrtiko away from Santorini: still dry and mineral, but with a rounder texture and a distinctly saline finish.",
tastingKeywords:["pêche","agrumes","minéral","salin"],
tastingKeywordsEn:["peach","citrus","mineral","saline"],
perfectFor:["découvrir un cépage grec","poissons et fruits de mer","sortir du sauvignon blanc"],
perfectForEn:["discovering a Greek grape","fish and seafood","moving beyond Sauvignon Blanc"],
whyWeRecommend:"Parce que l’assyrtiko est l’un des grands cépages blancs grecs et qu’il mérite d’être connu au-delà de Santorin. Cette version de Macédoine conserve la fraîcheur et la minéralité attendues tout en gagnant du volume grâce au travail sur lies.",
whyWeRecommendEn:"Because Assyrtiko is one of Greece's important white grapes and deserves to be known beyond Santorini. This Macedonian version keeps the expected freshness and minerality while gaining volume from lees ageing.",
experienceLevel:"intermediate"
}},

{
sku:"15045130",
patch:{
name:"Domaine des Nugues Beaujolais-Villages 2024",
vintage:2024,
style:"Gamay nature léger, floral et gourmand",
alcohol:13,sugar:1.9,natural:true,
body:2,sweetness:1,roundness:2,acidity:4,tannins:2,
servingTemperature:"14–16 °C",
cellaringPotential:"À privilégier dans sa jeunesse pour son fruit et sa fraîcheur.",
aromas:["petits fruits rouges","fleurs","notes minérales","épices"],
flavors:["fruits rouges","épices","minéralité"],
texture:"Légère et délicate, avec une fraîcheur franche.",
finish:"Juteuse, fraîche et fruitée.",
soil:"Sols sableux à sablo-granitiques sur le secteur de Lancié.",
harvestMethod:"Vendanges manuelles.",
vinification:"Fermentation semi-carbonique de type beaujolais avec régulation de température; la cuvée sans soufre est élaborée sans ajout de sulfites à la vinification ni à la mise en bouteille.",
aging:"Élevage en cuve avant mise en bouteille; la fiche technique du domaine indique quatre mois pour la cuvée sans soufre.",
oneLiner:"Du gamay comme on aime le présenter : léger sans être vide, fruité sans être sucré, et fait pour être bu légèrement frais.",
oneLinerEn:"Gamay the way we like to introduce it: light without being thin, fruity without being sweet, and made to be served slightly cool.",
tastingKeywords:["fruits rouges","floral","minéral","frais"],
tastingKeywordsEn:["red berries","floral","mineral","fresh"],
perfectFor:["découvrir le gamay","charcuteries et grillades","rouge légèrement frais"],
perfectForEn:["discovering Gamay","charcuterie and grilled food","a lightly chilled red"],
whyWeRecommend:"Parce qu’il explique le Beaujolais en une bouteille : gamay, fruit, fraîcheur, macération semi-carbonique et plaisir immédiat. C’est aussi un excellent exemple de rouge qu’on peut servir plus frais sans perdre son caractère.",
whyWeRecommendEn:"Because it explains Beaujolais in one bottle: Gamay, fruit, freshness, semi-carbonic maceration and immediate pleasure. It is also an excellent example of a red that can be served cooler without losing its character.",
experienceLevel:"beginner"
}}
];

const existing = await client.fetch(
  `*[_type=="wine" && sku in $skus]{_id,name,sku}`,
  {skus:wines.map(w=>w.sku)}
);

const bySku = new Map(existing.map(w=>[String(w.sku),w]));

console.log("\n════════ LPV — CORRECTION QUALITÉ LOT 01 ════════");
console.log(`Fiches attendues : ${wines.length}`);
console.log(`Fiches trouvées  : ${existing.length}`);

for (const w of wines) {
  const found=bySku.get(w.sku);
  console.log(`${found ? "✓" : "❌"} ${w.sku} — ${found?.name || "INTROUVABLE"}`);
}

if(existing.length!==wines.length){
  throw new Error("Arrêt : les 10 fiches ne sont pas toutes retrouvées dans Sanity.");
}

if(!WRITE){
  console.log("\nDRY RUN — aucune modification.");
  console.log("Les 10 fiches seront enrichies et leurs bottleImage actuelles seront retirées.");
  console.log("Commande d’écriture : node scripts/enrich-saq-batch-01.mjs --write\n");
  process.exit(0);
}

if(!process.env.SANITY_API_WRITE_TOKEN&&!process.env.SANITY_API_TOKEN){
  throw new Error("Token Sanity absent.");
}

const tx=client.transaction();

for(const w of wines){
  const current=bySku.get(w.sku);
  const translationSourceHash=crypto
    .createHash("sha256")
    .update(JSON.stringify({
      oneLiner:w.patch.oneLiner,
      tastingKeywords:w.patch.tastingKeywords,
      perfectFor:w.patch.perfectFor,
      whyWeRecommend:w.patch.whyWeRecommend
    }))
    .digest("hex");

  tx.patch(current._id,p=>p
    .unset(["bottleImage"])
    .set({
      ...w.patch,
      purchaseLastChecked:"2026-09-28",
      translationSourceHash,
      published:true
    })
  );
}

await tx.commit();

console.log("\n✅ 10 fiches enrichies.");
console.log("🖼️ 10 bottleImage retirées pour remplacement manuel.");

const check=await client.fetch(
 `*[_type=="wine" && sku in $skus] | order(sku asc){
   sku,name,
   "image":defined(bottleImage),
   style,vinification,aging,soil,harvestMethod,
   oneLiner,whyWeRecommend,
   aromas,flavors,texture,finish
 }`,
 {skus:wines.map(w=>w.sku)}
);

console.log("\nCONTRÔLE APRÈS ÉCRITURE");
for(const w of check){
 console.log(`🍷 ${w.sku} — ${w.name}`);
 console.log(`   image=${w.image ? "OUI":"NON"} | style=${w.style ? "OUI":"NON"} | vinification=${w.vinification ? "OUI":"—"} | élevage=${w.aging ? "OUI":"—"}`);
}
console.log("\n✓ Lot 01 corrigé au standard LPV.\n");
