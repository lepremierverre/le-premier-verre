import { createClient } from "@sanity/client";

const token =
  process.env.SANITY_API_WRITE_TOKEN ||
  process.env.SANITY_API_TOKEN;

if (!token) {
  throw new Error("SANITY_API_WRITE_TOKEN ou SANITY_API_TOKEN est requis.");
}

const client = createClient({
  projectId: "czq6bjyu",
  dataset: "production",
  apiVersion: "2025-08-15",
  useCdn: false,
  token,
});

const slugify = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const ref = (id) => ({
  _type: "reference",
  _ref: id,
  _key: id.replace(/[^a-zA-Z0-9]/g, "").slice(-24),
});

const C = {
  aperitif: "aperitif",
  fish: "fish",
  seafood: "seafood",
  poultry: "poultry",
  meat: "red-meat",
  charcuterie: "charcuterie",
  cheese: "cheese",
  vegetarian: "vegetarian",
  dessert: "dessert",
  other: "other",
};

const food = (
  name,
  category,
  {
    oneLiner,
    colors,
    body,
    bodyTol = 1,
    acidity,
    acidityTol = 1,
    sweetness,
    sweetnessTol = 1,
    roundness,
    roundnessTol = 1,
    tanninsMax,
    intensity,
    intensityTol = 1,
    oakMax,
    fruit,
    fruitTol = 1,
    minerality,
    mineralityTol = 1,
    complexity,
    complexityTol = 1,
    savory,
    savoryTol = 1,
    wineStyles = [],
    avoid = [],
    keywords = [],
  }
) => ({
  name,
  category,
  oneLiner,
  colors,
  body,
  bodyTol,
  acidity,
  acidityTol,
  sweetness,
  sweetnessTol,
  roundness,
  roundnessTol,
  tanninsMax,
  intensity,
  intensityTol,
  oakMax,
  fruit,
  fruitTol,
  minerality,
  mineralityTol,
  complexity,
  complexityTol,
  savory,
  savoryTol,
  wineStyles,
  avoid,
  keywords,
});

const NEW_FOODS = [
  // POISSONS & FRUITS DE MER — 30
  food("Fish & chips", C.fish, {
    oneLiner: "Le croustillant appelle un vin vif, frais et désaltérant.",
    colors: ["white", "sparkling"],
    body: 2, acidity: 5, sweetness: 1, roundness: 2,
    tanninsMax: 1, intensity: 3, oakMax: 1,
    fruit: 3, minerality: 4, complexity: 2, savory: 2,
    wineStyles: ["Blanc vif", "Mousseux brut", "Muscadet"],
    avoid: ["Rouges tanniques", "Blancs très boisés"],
    keywords: ["friture", "poisson", "citron", "croustillant"],
  }),

  food("Poisson blanc au beurre", C.fish, {
    oneLiner: "Un blanc frais mais légèrement ample accompagne le beurre sans écraser le poisson.",
    colors: ["white"],
    body: 3, acidity: 4, sweetness: 1, roundness: 3,
    tanninsMax: 1, intensity: 3, oakMax: 2,
    fruit: 3, minerality: 3, complexity: 3, savory: 2,
    wineStyles: ["Chardonnay peu boisé", "Chenin blanc", "Soave"],
    avoid: ["Rouges puissants"],
    keywords: ["poisson blanc", "beurre", "sauce"],
  }),

  food("Poisson en papillote", C.fish, {
    oneLiner: "La cuisson délicate préfère un blanc précis, frais et peu boisé.",
    colors: ["white"],
    body: 2, acidity: 4, sweetness: 1, roundness: 2,
    tanninsMax: 1, intensity: 2, oakMax: 1,
    fruit: 3, minerality: 4, complexity: 3, savory: 2,
    wineStyles: ["Sauvignon blanc", "Albariño", "Muscadet"],
    avoid: ["Vins très boisés", "Rouges tanniques"],
    keywords: ["poisson", "papillote", "herbes", "citron"],
  }),

  food("Morue", C.fish, {
    oneLiner: "La chair salée et ferme aime les blancs nerveux avec un vrai caractère minéral.",
    colors: ["white"],
    body: 3, acidity: 5, sweetness: 1, roundness: 2,
    tanninsMax: 1, intensity: 4, oakMax: 2,
    fruit: 2, minerality: 5, complexity: 3, savory: 4,
    wineStyles: ["Albariño", "Assyrtiko", "Muscadet"],
    avoid: ["Vins doux"],
    keywords: ["morue", "salin", "poisson"],
  }),

  food("Truite", C.fish, {
    oneLiner: "Un blanc frais et texturé respecte la finesse de la truite.",
    colors: ["white", "rose"],
    body: 3, acidity: 4, sweetness: 1, roundness: 3,
    tanninsMax: 2, intensity: 3, oakMax: 2,
    fruit: 3, minerality: 4, complexity: 3, savory: 2,
    wineStyles: ["Chardonnay", "Pinot gris", "Rosé sec"],
    avoid: ["Rouges corsés"],
    keywords: ["truite", "poisson", "herbes"],
  }),

  food("Truite fumée", C.fish, {
    oneLiner: "Fumée et salinité demandent fraîcheur, texture et acidité.",
    colors: ["white", "sparkling"],
    body: 3, acidity: 5, sweetness: 1, roundness: 3,
    tanninsMax: 1, intensity: 4, oakMax: 2,
    fruit: 2, minerality: 4, complexity: 4, savory: 4,
    wineStyles: ["Riesling sec", "Chenin blanc", "Mousseux brut"],
    avoid: ["Rouges tanniques"],
    keywords: ["truite", "fumé", "salin"],
  }),

  food("Saumon fumé", C.fish, {
    oneLiner: "Le gras et le fumé gagnent avec une acidité franche et une bulle fine.",
    colors: ["white", "sparkling", "rose"],
    body: 3, acidity: 5, sweetness: 1, roundness: 3,
    tanninsMax: 1, intensity: 4, oakMax: 2,
    fruit: 3, minerality: 4, complexity: 4, savory: 3,
    wineStyles: ["Champagne brut", "Crémant", "Riesling sec"],
    avoid: ["Rouges tanniques"],
    keywords: ["saumon", "fumé", "brunch"],
  }),

  food("Gravlax de saumon", C.fish, {
    oneLiner: "Fraîcheur, herbes et texture soyeuse appellent un blanc aromatique et tendu.",
    colors: ["white", "sparkling"],
    body: 3, acidity: 4, sweetness: 2, roundness: 3,
    tanninsMax: 1, intensity: 3, oakMax: 1,
    fruit: 4, minerality: 3, complexity: 3, savory: 2,
    wineStyles: ["Riesling", "Grüner Veltliner", "Crémant"],
    avoid: ["Rouges puissants"],
    keywords: ["saumon", "gravlax", "aneth"],
  }),

  food("Tartare de thon", C.fish, {
    oneLiner: "Un vin précis, frais et peu tannique accompagne la texture crue du thon.",
    colors: ["white", "rose"],
    body: 3, acidity: 4, sweetness: 1, roundness: 2,
    tanninsMax: 2, intensity: 3, oakMax: 1,
    fruit: 3, minerality: 4, complexity: 3, savory: 3,
    wineStyles: ["Albariño", "Sauvignon blanc", "Rosé sec"],
    avoid: ["Rouges tanniques", "Bois marqué"],
    keywords: ["thon", "tartare", "cru"],
  }),

  food("Ceviche", C.fish, {
    oneLiner: "L'acidité du ceviche réclame un blanc tranchant, citronné et très frais.",
    colors: ["white"],
    body: 2, acidity: 5, sweetness: 1, roundness: 1,
    tanninsMax: 1, intensity: 4, oakMax: 1,
    fruit: 4, minerality: 4, complexity: 2, savory: 2,
    wineStyles: ["Sauvignon blanc", "Albariño", "Vinho Verde"],
    avoid: ["Blancs boisés", "Rouges"],
    keywords: ["ceviche", "lime", "poisson cru", "acidité"],
  }),

  food("Poke au saumon", C.fish, {
    oneLiner: "Un blanc fruité et vif suit le saumon, les légumes et les assaisonnements du poke.",
    colors: ["white", "rose"],
    body: 3, acidity: 4, sweetness: 2, roundness: 2,
    tanninsMax: 1, intensity: 3, oakMax: 1,
    fruit: 4, minerality: 3, complexity: 2, savory: 2,
    wineStyles: ["Riesling", "Sauvignon blanc", "Rosé sec"],
    avoid: ["Rouges tanniques"],
    keywords: ["poke", "saumon", "soja", "sésame"],
  }),

  food("Accras de morue", C.fish, {
    oneLiner: "Le frit et le salé appellent une acidité vive et beaucoup de fraîcheur.",
    colors: ["white", "sparkling"],
    body: 2, acidity: 5, sweetness: 1, roundness: 2,
    tanninsMax: 1, intensity: 4, oakMax: 1,
    fruit: 3, minerality: 4, complexity: 2, savory: 3,
    wineStyles: ["Mousseux brut", "Vinho Verde", "Muscadet"],
    avoid: ["Vins lourds"],
    keywords: ["morue", "friture", "apéritif"],
  }),

  food("Calmars frits", C.seafood, {
    oneLiner: "Des bulles ou un blanc très vif nettoient parfaitement la friture.",
    colors: ["white", "sparkling"],
    body: 2, acidity: 5, sweetness: 1, roundness: 1,
    tanninsMax: 1, intensity: 3, oakMax: 1,
    fruit: 3, minerality: 4, complexity: 2, savory: 2,
    wineStyles: ["Crémant", "Cava brut", "Vermentino"],
    avoid: ["Rouges tanniques"],
    keywords: ["calmars", "friture", "citron"],
  }),

  food("Calmars grillés", C.seafood, {
    oneLiner: "Le grillé demande un blanc sec, minéral et un peu plus structuré.",
    colors: ["white"],
    body: 3, acidity: 4, sweetness: 1, roundness: 2,
    tanninsMax: 1, intensity: 4, oakMax: 2,
    fruit: 3, minerality: 5, complexity: 3, savory: 3,
    wineStyles: ["Assyrtiko", "Albariño", "Vermentino"],
    avoid: ["Vins doux"],
    keywords: ["calmars", "grillé", "fruits de mer"],
  }),

  food("Crevettes grillées", C.seafood, {
    oneLiner: "La douceur des crevettes et le grillé aiment un blanc vif mais généreux.",
    colors: ["white", "rose"],
    body: 3, acidity: 4, sweetness: 1, roundness: 3,
    tanninsMax: 1, intensity: 3, oakMax: 2,
    fruit: 4, minerality: 3, complexity: 3, savory: 2,
    wineStyles: ["Albariño", "Chardonnay", "Rosé sec"],
    avoid: ["Rouges tanniques"],
    keywords: ["crevettes", "grillé"],
  }),

  food("Crevettes à l'ail", C.seafood, {
    oneLiner: "L'ail et le beurre réclament fraîcheur, fruit et suffisamment de matière.",
    colors: ["white"],
    body: 3, acidity: 4, sweetness: 1, roundness: 3,
    tanninsMax: 1, intensity: 4, oakMax: 2,
    fruit: 3, minerality: 3, complexity: 3, savory: 3,
    wineStyles: ["Albariño", "Verdejo", "Chardonnay"],
    avoid: ["Rouges puissants"],
    keywords: ["crevettes", "ail", "beurre"],
  }),

  food("Crevettes épicées", C.seafood, {
    oneLiner: "Un peu de fruit et de douceur calme le piquant sans alourdir les crevettes.",
    colors: ["white", "rose"],
    body: 3, acidity: 4, sweetness: 2, roundness: 3,
    tanninsMax: 1, intensity: 4, oakMax: 1,
    fruit: 5, minerality: 2, complexity: 3, savory: 2,
    wineStyles: ["Riesling", "Gewurztraminer", "Rosé fruité"],
    avoid: ["Rouges tanniques", "Alcool élevé"],
    keywords: ["crevettes", "épicé", "piment"],
  }),

  food("Cocktail de crevettes", C.seafood, {
    oneLiner: "La fraîcheur du plat préfère un blanc vif, léger et citronné.",
    colors: ["white", "sparkling"],
    body: 2, acidity: 5, sweetness: 1, roundness: 1,
    tanninsMax: 1, intensity: 3, oakMax: 1,
    fruit: 3, minerality: 4, complexity: 2, savory: 2,
    wineStyles: ["Sauvignon blanc", "Muscadet", "Brut"],
    avoid: ["Vins boisés"],
    keywords: ["crevettes", "cocktail", "apéritif"],
  }),

  food("Guédille au homard", C.seafood, {
    oneLiner: "Le homard crémeux demande fraîcheur et rondeur dans un équilibre gourmand.",
    colors: ["white", "sparkling"],
    body: 3, acidity: 4, sweetness: 1, roundness: 4,
    tanninsMax: 1, intensity: 3, oakMax: 2,
    fruit: 3, minerality: 3, complexity: 3, savory: 2,
    wineStyles: ["Chardonnay", "Chenin blanc", "Crémant"],
    avoid: ["Rouges tanniques"],
    keywords: ["homard", "guédille", "mayonnaise"],
  }),

  food("Homard au beurre", C.seafood, {
    oneLiner: "La richesse du beurre et la douceur du homard appellent un blanc ample et frais.",
    colors: ["white"],
    body: 4, acidity: 4, sweetness: 1, roundness: 4,
    tanninsMax: 1, intensity: 4, oakMax: 3,
    fruit: 3, minerality: 3, complexity: 4, savory: 2,
    wineStyles: ["Chardonnay", "Chenin blanc"],
    avoid: ["Rouges tanniques"],
    keywords: ["homard", "beurre", "riche"],
  }),

  food("Bisque de homard", C.seafood, {
    oneLiner: "Une texture riche et iodée appelle un blanc ample, complexe et encore frais.",
    colors: ["white"],
    body: 4, acidity: 4, sweetness: 1, roundness: 5,
    tanninsMax: 1, intensity: 5, oakMax: 3,
    fruit: 3, minerality: 3, complexity: 5, savory: 4,
    wineStyles: ["Chardonnay", "Chenin blanc"],
    avoid: ["Blancs trop légers"],
    keywords: ["homard", "bisque", "crème"],
  }),

  food("Pétoncles poêlés", C.seafood, {
    oneLiner: "La douceur des pétoncles gagne avec un blanc minéral, texturé et précis.",
    colors: ["white"],
    body: 3, acidity: 4, sweetness: 1, roundness: 3,
    tanninsMax: 1, intensity: 3, oakMax: 2,
    fruit: 3, minerality: 5, complexity: 4, savory: 2,
    wineStyles: ["Chablis", "Chenin blanc", "Albariño"],
    avoid: ["Rouges tanniques"],
    keywords: ["pétoncles", "poêlé", "beurre"],
  }),

  food("Pétoncles sauce crémeuse", C.seafood, {
    oneLiner: "La crème demande davantage de rondeur tout en conservant une acidité nette.",
    colors: ["white"],
    body: 4, acidity: 4, sweetness: 1, roundness: 4,
    tanninsMax: 1, intensity: 4, oakMax: 3,
    fruit: 3, minerality: 3, complexity: 4, savory: 2,
    wineStyles: ["Chardonnay", "Chenin blanc"],
    avoid: ["Rouges"],
    keywords: ["pétoncles", "crème", "sauce"],
  }),

  food("Moules marinières", C.seafood, {
    oneLiner: "Iode, vin blanc et herbes appellent un blanc sec, vif et minéral.",
    colors: ["white"],
    body: 2, acidity: 5, sweetness: 1, roundness: 2,
    tanninsMax: 1, intensity: 3, oakMax: 1,
    fruit: 2, minerality: 5, complexity: 3, savory: 3,
    wineStyles: ["Muscadet", "Picpoul", "Albariño"],
    avoid: ["Vins doux", "Bois marqué"],
    keywords: ["moules", "marinière", "iode"],
  }),

  food("Moules à la crème", C.seafood, {
    oneLiner: "La crème arrondit l'accord, mais l'acidité doit rester suffisamment vive.",
    colors: ["white"],
    body: 3, acidity: 4, sweetness: 1, roundness: 4,
    tanninsMax: 1, intensity: 4, oakMax: 2,
    fruit: 3, minerality: 4, complexity: 3, savory: 3,
    wineStyles: ["Chenin blanc", "Chardonnay", "Muscadet sur lie"],
    avoid: ["Rouges tanniques"],
    keywords: ["moules", "crème"],
  }),

  food("Huîtres gratinées", C.seafood, {
    oneLiner: "Plus riches que des huîtres crues, elles aiment un blanc minéral avec un peu de texture.",
    colors: ["white", "sparkling"],
    body: 3, acidity: 5, sweetness: 1, roundness: 3,
    tanninsMax: 1, intensity: 4, oakMax: 2,
    fruit: 2, minerality: 5, complexity: 4, savory: 4,
    wineStyles: ["Chablis", "Champagne brut", "Muscadet"],
    avoid: ["Rouges tanniques"],
    keywords: ["huîtres", "gratiné", "iode"],
  }),

  food("Crabe des neiges", C.seafood, {
    oneLiner: "La chair douce et saline du crabe préfère finesse, acidité et minéralité.",
    colors: ["white", "sparkling"],
    body: 2, acidity: 4, sweetness: 1, roundness: 2,
    tanninsMax: 1, intensity: 3, oakMax: 1,
    fruit: 3, minerality: 5, complexity: 3, savory: 2,
    wineStyles: ["Chablis", "Albariño", "Crémant"],
    avoid: ["Rouges puissants"],
    keywords: ["crabe", "crabe des neiges", "iode"],
  }),

  food("Palourdes", C.seafood, {
    oneLiner: "Le caractère iodé appelle un blanc sec, salin et très frais.",
    colors: ["white"],
    body: 2, acidity: 5, sweetness: 1, roundness: 1,
    tanninsMax: 1, intensity: 3, oakMax: 1,
    fruit: 2, minerality: 5, complexity: 3, savory: 3,
    wineStyles: ["Muscadet", "Vermentino", "Albariño"],
    avoid: ["Vins doux", "Bois marqué"],
    keywords: ["palourdes", "coquillages", "iode"],
  }),

  food("Pieuvre grillée", C.seafood, {
    oneLiner: "La texture ferme et le grillé appellent minéralité, fraîcheur et structure.",
    colors: ["white", "rose"],
    body: 3, acidity: 4, sweetness: 1, roundness: 2,
    tanninsMax: 2, intensity: 4, oakMax: 2,
    fruit: 3, minerality: 4, complexity: 4, savory: 4,
    wineStyles: ["Assyrtiko", "Vermentino", "Rosé sec"],
    avoid: ["Rouges tanniques"],
    keywords: ["pieuvre", "grillé", "méditerranéen"],
  }),

  food("Paella aux fruits de mer", C.seafood, {
    oneLiner: "Un blanc méditerranéen structuré et frais suit le safran, l'iode et le riz.",
    colors: ["white", "rose"],
    body: 3, acidity: 4, sweetness: 1, roundness: 3,
    tanninsMax: 2, intensity: 4, oakMax: 2,
    fruit: 4, minerality: 4, complexity: 4, savory: 4,
    wineStyles: ["Albariño", "Verdejo", "Rosé sec"],
    avoid: ["Rouges très tanniques"],
    keywords: ["paella", "fruits de mer", "safran", "riz"],
  }),

  // VIANDES, VOLAILLES & CHARCUTERIES — 30

  food("Bœuf bourguignon", C.meat, {
    oneLiner: "La viande braisée et la sauce riche appellent un rouge structuré, savoureux et complexe.",
    colors: ["red"],
    body: 4, acidity: 3, sweetness: 1, roundness: 4,
    tanninsMax: 4, intensity: 5, oakMax: 4,
    fruit: 3, minerality: 2, complexity: 5, savory: 5,
    wineStyles: ["Pinot noir structuré", "Syrah", "Bordeaux"],
    avoid: ["Blancs légers"],
    keywords: ["bœuf", "braisé", "sauce", "mijoté"],
  }),

  food("Bœuf braisé", C.meat, {
    oneLiner: "Une cuisson longue demande profondeur, matière et tanins suffisamment présents.",
    colors: ["red"],
    body: 5, acidity: 3, sweetness: 1, roundness: 4,
    tanninsMax: 5, intensity: 5, oakMax: 4,
    fruit: 3, minerality: 2, complexity: 4, savory: 5,
    wineStyles: ["Syrah", "Cabernet Sauvignon", "Grenache"],
    avoid: ["Blancs délicats"],
    keywords: ["bœuf", "braisé", "mijoté"],
  }),

  food("Rôti de bœuf", C.meat, {
    oneLiner: "Le rôti aime un rouge structuré où fruit, tanins et fraîcheur restent en équilibre.",
    colors: ["red"],
    body: 4, acidity: 3, sweetness: 1, roundness: 3,
    tanninsMax: 5, intensity: 4, oakMax: 4,
    fruit: 4, minerality: 3, complexity: 4, savory: 4,
    wineStyles: ["Cabernet Sauvignon", "Bordeaux", "Syrah"],
    avoid: ["Vins doux"],
    keywords: ["bœuf", "rôti"],
  }),

  food("Filet mignon", C.meat, {
    oneLiner: "Une viande tendre préfère un rouge élégant plutôt qu'une masse de tanins.",
    colors: ["red"],
    body: 4, acidity: 3, sweetness: 1, roundness: 4,
    tanninsMax: 4, intensity: 4, oakMax: 3,
    fruit: 4, minerality: 3, complexity: 4, savory: 3,
    wineStyles: ["Merlot", "Pinot noir", "Bordeaux"],
    avoid: ["Rouges excessivement tanniques"],
    keywords: ["bœuf", "filet mignon", "grillé"],
  }),

  food("Carpaccio de bœuf", C.meat, {
    oneLiner: "La viande crue demande davantage de fraîcheur que de puissance.",
    colors: ["red", "rose"],
    body: 2, acidity: 4, sweetness: 1, roundness: 2,
    tanninsMax: 3, intensity: 3, oakMax: 2,
    fruit: 4, minerality: 3, complexity: 3, savory: 3,
    wineStyles: ["Gamay", "Pinot noir", "Rosé sec"],
    avoid: ["Cabernet très tannique"],
    keywords: ["bœuf", "carpaccio", "cru"],
  }),

  food("Boulettes de viande sauce tomate", C.meat, {
    oneLiner: "La tomate privilégie un rouge fruité avec une acidité bien présente.",
    colors: ["red"],
    body: 3, acidity: 4, sweetness: 1, roundness: 3,
    tanninsMax: 4, intensity: 4, oakMax: 3,
    fruit: 4, minerality: 2, complexity: 3, savory: 4,
    wineStyles: ["Sangiovese", "Barbera", "Montepulciano"],
    avoid: ["Rouges très boisés"],
    keywords: ["boulettes", "tomate", "italien"],
  }),

  food("Osso buco", C.meat, {
    oneLiner: "Le veau mijoté et sa sauce demandent fraîcheur, profondeur et caractère savoureux.",
    colors: ["red"],
    body: 4, acidity: 4, sweetness: 1, roundness: 4,
    tanninsMax: 4, intensity: 4, oakMax: 3,
    fruit: 3, minerality: 2, complexity: 4, savory: 5,
    wineStyles: ["Sangiovese", "Nebbiolo souple", "Barbera"],
    avoid: ["Rouges très lourds"],
    keywords: ["veau", "osso buco", "mijoté"],
  }),

  food("Côtelettes d'agneau", C.meat, {
    oneLiner: "L'agneau grillé aime les rouges épicés, structurés et généreux.",
    colors: ["red"],
    body: 4, acidity: 3, sweetness: 1, roundness: 3,
    tanninsMax: 5, intensity: 5, oakMax: 4,
    fruit: 4, minerality: 2, complexity: 4, savory: 4,
    wineStyles: ["Syrah", "Grenache", "Rioja"],
    avoid: ["Blancs légers"],
    keywords: ["agneau", "grillé", "herbes"],
  }),

  food("Gigot d'agneau", C.meat, {
    oneLiner: "Le gigot réclame un rouge ample, épicé et suffisamment structuré.",
    colors: ["red"],
    body: 5, acidity: 3, sweetness: 1, roundness: 4,
    tanninsMax: 5, intensity: 5, oakMax: 4,
    fruit: 4, minerality: 2, complexity: 4, savory: 4,
    wineStyles: ["Syrah", "Grenache", "Bordeaux"],
    avoid: ["Rouges trop légers"],
    keywords: ["agneau", "gigot", "rôti"],
  }),

  food("Porc effiloché", C.meat, {
    oneLiner: "Le fumé, le sucré et le salé préfèrent un rouge fruité, généreux et peu austère.",
    colors: ["red", "rose"],
    body: 4, acidity: 3, sweetness: 2, roundness: 4,
    tanninsMax: 3, intensity: 5, oakMax: 3,
    fruit: 5, minerality: 1, complexity: 3, savory: 4,
    wineStyles: ["Zinfandel", "Grenache", "Gamay généreux"],
    avoid: ["Rouges très tanniques"],
    keywords: ["porc", "effiloché", "BBQ", "fumé"],
  }),

  food("Côtes de porc grillées", C.meat, {
    oneLiner: "Le porc grillé aime un rouge fruité, frais et modérément tannique.",
    colors: ["red", "rose"],
    body: 3, acidity: 3, sweetness: 1, roundness: 3,
    tanninsMax: 3, intensity: 4, oakMax: 3,
    fruit: 4, minerality: 2, complexity: 3, savory: 3,
    wineStyles: ["Gamay", "Pinot noir", "Grenache"],
    avoid: ["Rouges massifs"],
    keywords: ["porc", "grillé"],
  }),

  food("Filet de porc", C.meat, {
    oneLiner: "La finesse du filet préfère un rouge souple ou un blanc suffisamment texturé.",
    colors: ["red", "white"],
    body: 3, acidity: 4, sweetness: 1, roundness: 3,
    tanninsMax: 3, intensity: 3, oakMax: 2,
    fruit: 4, minerality: 2, complexity: 3, savory: 2,
    wineStyles: ["Pinot noir", "Gamay", "Chenin blanc"],
    avoid: ["Rouges très tanniques"],
    keywords: ["porc", "filet", "rôti"],
  }),

  food("Jambon glacé à l'érable", C.meat, {
    oneLiner: "Le sucre de l'érable demande du fruit, de la fraîcheur et un soupçon de douceur.",
    colors: ["white", "rose", "red"],
    body: 3, acidity: 4, sweetness: 2, roundness: 3,
    tanninsMax: 2, intensity: 4, oakMax: 2,
    fruit: 5, minerality: 2, complexity: 3, savory: 3,
    wineStyles: ["Riesling", "Gamay", "Rosé fruité"],
    avoid: ["Rouges tanniques"],
    keywords: ["jambon", "érable", "sucré-salé"],
  }),

  food("Jambon braisé", C.meat, {
    oneLiner: "Le salé et le fondant du jambon aiment des vins fruités avec une bonne fraîcheur.",
    colors: ["white", "red", "rose"],
    body: 3, acidity: 4, sweetness: 1, roundness: 3,
    tanninsMax: 3, intensity: 3, oakMax: 2,
    fruit: 4, minerality: 2, complexity: 3, savory: 4,
    wineStyles: ["Gamay", "Pinot noir", "Chenin blanc"],
    avoid: ["Rouges très tanniques"],
    keywords: ["jambon", "braisé", "porc"],
  }),

  food("Poulet grillé", C.poultry, {
    oneLiner: "Simple et polyvalent, le poulet grillé aime les vins frais de corps moyen.",
    colors: ["white", "red", "rose"],
    body: 3, acidity: 4, sweetness: 1, roundness: 3,
    tanninsMax: 3, intensity: 3, oakMax: 2,
    fruit: 4, minerality: 2, complexity: 3, savory: 3,
    wineStyles: ["Chardonnay", "Pinot noir", "Rosé sec"],
    avoid: ["Rouges massifs"],
    keywords: ["poulet", "grillé"],
  }),

  food("Poulet BBQ", C.poultry, {
    oneLiner: "La sauce BBQ réclame du fruit et de la rondeur sans tanins agressifs.",
    colors: ["red", "rose"],
    body: 3, acidity: 3, sweetness: 2, roundness: 4,
    tanninsMax: 3, intensity: 4, oakMax: 3,
    fruit: 5, minerality: 1, complexity: 3, savory: 3,
    wineStyles: ["Grenache", "Gamay", "Zinfandel"],
    avoid: ["Rouges austères"],
    keywords: ["poulet", "BBQ", "fumé"],
  }),

  food("Poulet au beurre", C.poultry, {
    oneLiner: "La sauce crémeuse et épicée préfère un vin aromatique, fruité et légèrement tendre.",
    colors: ["white", "rose"],
    body: 3, acidity: 4, sweetness: 2, roundness: 4,
    tanninsMax: 1, intensity: 4, oakMax: 2,
    fruit: 5, minerality: 2, complexity: 3, savory: 2,
    wineStyles: ["Riesling", "Gewurztraminer", "Chenin blanc"],
    avoid: ["Rouges tanniques"],
    keywords: ["poulet", "indien", "crémeux", "épicé"],
  }),

  food("Poulet tikka masala", C.poultry, {
    oneLiner: "Épices et tomate aiment un blanc aromatique ou un rosé fruité avec une légère douceur.",
    colors: ["white", "rose"],
    body: 3, acidity: 4, sweetness: 2, roundness: 3,
    tanninsMax: 1, intensity: 5, oakMax: 1,
    fruit: 5, minerality: 2, complexity: 3, savory: 3,
    wineStyles: ["Riesling", "Gewurztraminer", "Rosé fruité"],
    avoid: ["Rouges tanniques", "Alcool élevé"],
    keywords: ["poulet", "tikka masala", "indien", "épices"],
  }),

  food("Poulet à la crème", C.poultry, {
    oneLiner: "La sauce crémeuse appelle un blanc ample dont l'acidité garde l'ensemble frais.",
    colors: ["white"],
    body: 4, acidity: 4, sweetness: 1, roundness: 4,
    tanninsMax: 1, intensity: 4, oakMax: 3,
    fruit: 3, minerality: 2, complexity: 4, savory: 3,
    wineStyles: ["Chardonnay", "Chenin blanc"],
    avoid: ["Blancs trop maigres"],
    keywords: ["poulet", "crème", "sauce"],
  }),

  food("Dinde rôtie", C.poultry, {
    oneLiner: "La dinde rôtie appelle un vin frais, fruité et suffisamment souple pour toute la tablée.",
    colors: ["red", "white"],
    body: 3, acidity: 4, sweetness: 1, roundness: 3,
    tanninsMax: 3, intensity: 3, oakMax: 2,
    fruit: 4, minerality: 2, complexity: 3, savory: 3,
    wineStyles: ["Pinot noir", "Gamay", "Chardonnay"],
    avoid: ["Rouges très tanniques"],
    keywords: ["dinde", "rôti", "fêtes"],
  }),

  food("Canard confit", C.poultry, {
    oneLiner: "Le gras du confit demande acidité, fruit et un rouge doté d'un peu de caractère.",
    colors: ["red"],
    body: 4, acidity: 4, sweetness: 1, roundness: 3,
    tanninsMax: 4, intensity: 4, oakMax: 3,
    fruit: 4, minerality: 2, complexity: 4, savory: 4,
    wineStyles: ["Pinot noir", "Syrah", "Gamay"],
    avoid: ["Rouges mous et très alcooleux"],
    keywords: ["canard", "confit"],
  }),

  food("Magret de canard", C.poultry, {
    oneLiner: "Le magret appelle un rouge élégant, fruité et structuré sans excès.",
    colors: ["red"],
    body: 4, acidity: 4, sweetness: 1, roundness: 4,
    tanninsMax: 4, intensity: 4, oakMax: 3,
    fruit: 4, minerality: 2, complexity: 4, savory: 3,
    wineStyles: ["Pinot noir", "Syrah", "Merlot"],
    avoid: ["Rouges excessivement tanniques"],
    keywords: ["canard", "magret"],
  }),

  food("Canard à l'orange", C.poultry, {
    oneLiner: "Le fruit de la sauce demande un rouge souple et fruité ou un blanc aromatique.",
    colors: ["red", "white"],
    body: 3, acidity: 4, sweetness: 2, roundness: 4,
    tanninsMax: 3, intensity: 4, oakMax: 2,
    fruit: 5, minerality: 2, complexity: 4, savory: 2,
    wineStyles: ["Pinot noir", "Riesling", "Gamay"],
    avoid: ["Rouges austères"],
    keywords: ["canard", "orange", "sucré-salé"],
  }),

  food("Prosciutto", C.charcuterie, {
    oneLiner: "Le salé et le gras du prosciutto aiment fraîcheur, fruit et tanins discrets.",
    colors: ["red", "white", "sparkling"],
    body: 2, acidity: 4, sweetness: 1, roundness: 2,
    tanninsMax: 2, intensity: 3, oakMax: 1,
    fruit: 4, minerality: 3, complexity: 3, savory: 4,
    wineStyles: ["Lambrusco sec", "Gamay", "Prosecco brut"],
    avoid: ["Rouges très tanniques"],
    keywords: ["prosciutto", "charcuterie", "salé"],
  }),

  food("Salami", C.charcuterie, {
    oneLiner: "Le gras et les épices du salami demandent fruit, fraîcheur et caractère.",
    colors: ["red", "rose"],
    body: 3, acidity: 4, sweetness: 1, roundness: 3,
    tanninsMax: 3, intensity: 4, oakMax: 2,
    fruit: 4, minerality: 2, complexity: 3, savory: 5,
    wineStyles: ["Barbera", "Gamay", "Sangiovese"],
    avoid: ["Rouges trop boisés"],
    keywords: ["salami", "charcuterie", "épicé"],
  }),

  food("Saucisson sec", C.charcuterie, {
    oneLiner: "Un rouge frais et fruité accompagne le gras et le sel sans alourdir l'accord.",
    colors: ["red"],
    body: 3, acidity: 4, sweetness: 1, roundness: 2,
    tanninsMax: 3, intensity: 3, oakMax: 2,
    fruit: 4, minerality: 2, complexity: 3, savory: 4,
    wineStyles: ["Gamay", "Pinot noir", "Barbera"],
    avoid: ["Rouges massifs"],
    keywords: ["saucisson", "charcuterie"],
  }),

  food("Terrine de campagne", C.charcuterie, {
    oneLiner: "La richesse rustique de la terrine aime les rouges frais, souples et savoureux.",
    colors: ["red", "white"],
    body: 3, acidity: 4, sweetness: 1, roundness: 3,
    tanninsMax: 3, intensity: 4, oakMax: 2,
    fruit: 3, minerality: 2, complexity: 4, savory: 5,
    wineStyles: ["Gamay", "Cabernet franc", "Chenin blanc"],
    avoid: ["Rouges très tanniques"],
    keywords: ["terrine", "charcuterie", "porc"],
  }),

  food("Pâté de foie", C.charcuterie, {
    oneLiner: "Le foie demande rondeur et fruit, avec assez d'acidité pour équilibrer sa richesse.",
    colors: ["white", "red"],
    body: 3, acidity: 4, sweetness: 2, roundness: 4,
    tanninsMax: 2, intensity: 4, oakMax: 2,
    fruit: 4, minerality: 2, complexity: 4, savory: 4,
    wineStyles: ["Chenin demi-sec", "Pinot noir", "Riesling"],
    avoid: ["Rouges tanniques"],
    keywords: ["pâté", "foie", "charcuterie"],
  }),

  food("Rillettes de porc", C.charcuterie, {
    oneLiner: "Le gras fondant des rillettes réclame une acidité vive et beaucoup de fraîcheur.",
    colors: ["white", "red", "sparkling"],
    body: 3, acidity: 5, sweetness: 1, roundness: 3,
    tanninsMax: 2, intensity: 3, oakMax: 1,
    fruit: 3, minerality: 3, complexity: 3, savory: 4,
    wineStyles: ["Chenin blanc", "Gamay", "Crémant brut"],
    avoid: ["Rouges lourds"],
    keywords: ["rillettes", "porc", "charcuterie"],
  }),

  food("Charcuteries fumées", C.charcuterie, {
    oneLiner: "Le fumé demande un vin fruité, frais et assez expressif pour tenir tête aux saveurs.",
    colors: ["red", "rose"],
    body: 3, acidity: 4, sweetness: 1, roundness: 3,
    tanninsMax: 3, intensity: 4, oakMax: 2,
    fruit: 4, minerality: 2, complexity: 3, savory: 5,
    wineStyles: ["Gamay", "Syrah légère", "Rosé sec"],
    avoid: ["Rouges très boisés"],
    keywords: ["charcuterie", "fumé"],
  }),

  // FROMAGES, VÉGÉTARIEN & APÉRO — 30

  food("Brie", C.cheese, {
    oneLiner: "Le crémeux du brie aime fraîcheur, fruit et texture souple.",
    colors: ["white", "sparkling"],
    body: 3, acidity: 4, sweetness: 1, roundness: 4,
    tanninsMax: 2, intensity: 3, oakMax: 2,
    fruit: 3, minerality: 3, complexity: 3, savory: 2,
    wineStyles: ["Chardonnay", "Chenin blanc", "Crémant"],
    avoid: ["Rouges tanniques"],
    keywords: ["brie", "fromage", "crémeux"],
  }),

  food("Camembert", C.cheese, {
    oneLiner: "Un vin frais et peu tannique équilibre la pâte crémeuse et les notes plus terriennes.",
    colors: ["white", "red", "sparkling"],
    body: 3, acidity: 4, sweetness: 1, roundness: 4,
    tanninsMax: 2, intensity: 3, oakMax: 2,
    fruit: 3, minerality: 2, complexity: 3, savory: 3,
    wineStyles: ["Chenin blanc", "Gamay", "Crémant"],
    avoid: ["Rouges puissants"],
    keywords: ["camembert", "fromage", "crémeux"],
  }),

  food("Chèvre frais", C.cheese, {
    oneLiner: "L'acidité naturelle du chèvre appelle un blanc vif, herbacé et minéral.",
    colors: ["white"],
    body: 2, acidity: 5, sweetness: 1, roundness: 2,
    tanninsMax: 1, intensity: 3, oakMax: 1,
    fruit: 3, minerality: 4, complexity: 2, savory: 2,
    wineStyles: ["Sauvignon blanc", "Chenin blanc"],
    avoid: ["Rouges tanniques", "Blancs très boisés"],
    keywords: ["chèvre", "fromage frais"],
  }),

  food("Cheddar vieilli", C.cheese, {
    oneLiner: "La puissance du cheddar vieilli demande du fruit, de la structure et de la profondeur.",
    colors: ["red", "white"],
    body: 4, acidity: 3, sweetness: 1, roundness: 4,
    tanninsMax: 4, intensity: 5, oakMax: 4,
    fruit: 4, minerality: 2, complexity: 4, savory: 4,
    wineStyles: ["Cabernet Sauvignon", "Syrah", "Chardonnay ample"],
    avoid: ["Vins trop délicats"],
    keywords: ["cheddar", "fromage", "vieilli"],
  }),

  food("Comté", C.cheese, {
    oneLiner: "Les notes de noix du comté brillent avec un blanc complexe, minéral et légèrement ample.",
    colors: ["white"],
    body: 4, acidity: 4, sweetness: 1, roundness: 4,
    tanninsMax: 1, intensity: 4, oakMax: 3,
    fruit: 3, minerality: 4, complexity: 5, savory: 4,
    wineStyles: ["Chardonnay", "Chenin blanc", "Savagnin"],
    avoid: ["Rouges très tanniques"],
    keywords: ["comté", "fromage", "noisette"],
  }),

  food("Gruyère", C.cheese, {
    oneLiner: "Un blanc texturé ou un rouge souple accompagne son caractère salé et noisetté.",
    colors: ["white", "red"],
    body: 3, acidity: 4, sweetness: 1, roundness: 3,
    tanninsMax: 3, intensity: 4, oakMax: 2,
    fruit: 3, minerality: 3, complexity: 4, savory: 4,
    wineStyles: ["Chardonnay", "Pinot noir", "Gamay"],
    avoid: ["Rouges massifs"],
    keywords: ["gruyère", "fromage"],
  }),

  food("Gouda vieilli", C.cheese, {
    oneLiner: "Le gouda affiné demande rondeur, intensité et fruit mûr.",
    colors: ["red", "white"],
    body: 4, acidity: 3, sweetness: 1, roundness: 4,
    tanninsMax: 4, intensity: 5, oakMax: 3,
    fruit: 4, minerality: 2, complexity: 4, savory: 4,
    wineStyles: ["Merlot", "Syrah", "Chardonnay ample"],
    avoid: ["Vins très légers"],
    keywords: ["gouda", "fromage", "vieilli"],
  }),

  food("Parmesan", C.cheese, {
    oneLiner: "Le sel et l'umami du parmesan aiment les vins secs, savoureux et dotés d'une bonne acidité.",
    colors: ["red", "white"],
    body: 4, acidity: 4, sweetness: 1, roundness: 3,
    tanninsMax: 4, intensity: 5, oakMax: 3,
    fruit: 3, minerality: 3, complexity: 4, savory: 5,
    wineStyles: ["Sangiovese", "Nebbiolo", "Chardonnay"],
    avoid: ["Vins doux"],
    keywords: ["parmesan", "fromage", "umami"],
  }),

  food("Bleu", C.cheese, {
    oneLiner: "Le caractère salé et puissant du bleu gagne avec un vin riche et légèrement doux.",
    colors: ["white", "fortified"],
    body: 4, acidity: 3, sweetness: 4, roundness: 5,
    tanninsMax: 2, intensity: 5, oakMax: 3,
    fruit: 5, minerality: 2, complexity: 5, savory: 4,
    wineStyles: ["Vin doux", "Porto", "Riesling moelleux"],
    avoid: ["Rouges secs très tanniques"],
    keywords: ["bleu", "fromage", "salé"],
  }),

  food("Fromage à pâte lavée", C.cheese, {
    oneLiner: "Un fromage puissant appelle un vin aromatique, expressif et suffisamment frais.",
    colors: ["white", "red"],
    body: 4, acidity: 4, sweetness: 2, roundness: 4,
    tanninsMax: 2, intensity: 5, oakMax: 2,
    fruit: 4, minerality: 2, complexity: 4, savory: 5,
    wineStyles: ["Gewurztraminer", "Pinot gris", "Gamay"],
    avoid: ["Rouges tanniques"],
    keywords: ["fromage", "pâte lavée", "corsé"],
  }),

  food("Aubergines grillées", C.vegetarian, {
    oneLiner: "Le grillé et la texture charnue de l'aubergine aiment un rouge souple et savoureux.",
    colors: ["red", "rose"],
    body: 3, acidity: 3, sweetness: 1, roundness: 3,
    tanninsMax: 3, intensity: 4, oakMax: 2,
    fruit: 4, minerality: 2, complexity: 3, savory: 4,
    wineStyles: ["Grenache", "Gamay", "Rosé structuré"],
    avoid: ["Rouges très tanniques"],
    keywords: ["aubergine", "grillé", "légumes"],
  }),

  food("Aubergines parmigiana", C.vegetarian, {
    oneLiner: "Tomate, fromage et aubergine appellent un rouge italien frais et fruité.",
    colors: ["red"],
    body: 3, acidity: 4, sweetness: 1, roundness: 3,
    tanninsMax: 3, intensity: 4, oakMax: 2,
    fruit: 4, minerality: 2, complexity: 3, savory: 4,
    wineStyles: ["Sangiovese", "Barbera", "Valpolicella"],
    avoid: ["Rouges très boisés"],
    keywords: ["aubergine", "tomate", "parmesan"],
  }),

  food("Asperges", C.vegetarian, {
    oneLiner: "Le végétal de l'asperge préfère des blancs vifs, herbacés et peu boisés.",
    colors: ["white"],
    body: 2, acidity: 5, sweetness: 1, roundness: 1,
    tanninsMax: 1, intensity: 3, oakMax: 1,
    fruit: 3, minerality: 4, complexity: 2, savory: 2,
    wineStyles: ["Sauvignon blanc", "Grüner Veltliner"],
    avoid: ["Blancs boisés", "Rouges tanniques"],
    keywords: ["asperges", "végétal"],
  }),

  food("Artichauts", C.vegetarian, {
    oneLiner: "L'artichaut demande un blanc très frais, sec et peu boisé.",
    colors: ["white"],
    body: 2, acidity: 5, sweetness: 1, roundness: 1,
    tanninsMax: 1, intensity: 3, oakMax: 1,
    fruit: 2, minerality: 4, complexity: 2, savory: 3,
    wineStyles: ["Vermentino", "Sauvignon blanc", "Grüner Veltliner"],
    avoid: ["Vins boisés", "Rouges tanniques"],
    keywords: ["artichaut", "végétal"],
  }),

  food("Ratatouille", C.vegetarian, {
    oneLiner: "Les légumes méditerranéens aiment un rouge souple ou un rosé sec et fruité.",
    colors: ["red", "rose"],
    body: 3, acidity: 4, sweetness: 1, roundness: 2,
    tanninsMax: 3, intensity: 4, oakMax: 2,
    fruit: 4, minerality: 2, complexity: 3, savory: 4,
    wineStyles: ["Grenache", "Cinsault", "Rosé sec"],
    avoid: ["Rouges lourds"],
    keywords: ["ratatouille", "tomate", "légumes"],
  }),

  food("Risotto aux champignons", C.vegetarian, {
    oneLiner: "Le crémeux et le caractère terreux demandent texture, fraîcheur et complexité.",
    colors: ["white", "red"],
    body: 4, acidity: 4, sweetness: 1, roundness: 4,
    tanninsMax: 3, intensity: 4, oakMax: 3,
    fruit: 3, minerality: 3, complexity: 4, savory: 5,
    wineStyles: ["Chardonnay", "Pinot noir", "Nebbiolo léger"],
    avoid: ["Vins très fruités et simples"],
    keywords: ["risotto", "champignons", "crémeux"],
  }),

  food("Risotto aux légumes", C.vegetarian, {
    oneLiner: "Un blanc frais et texturé accompagne le crémeux sans masquer les légumes.",
    colors: ["white"],
    body: 3, acidity: 4, sweetness: 1, roundness: 4,
    tanninsMax: 1, intensity: 3, oakMax: 2,
    fruit: 3, minerality: 3, complexity: 3, savory: 3,
    wineStyles: ["Pinot gris", "Chenin blanc", "Chardonnay"],
    avoid: ["Rouges tanniques"],
    keywords: ["risotto", "légumes"],
  }),

  food("Tofu grillé", C.vegetarian, {
    oneLiner: "Un vin frais et fruité accompagne le tofu et ses notes grillées sans l'écraser.",
    colors: ["white", "rose", "red"],
    body: 2, acidity: 4, sweetness: 1, roundness: 2,
    tanninsMax: 2, intensity: 3, oakMax: 1,
    fruit: 4, minerality: 2, complexity: 2, savory: 3,
    wineStyles: ["Riesling sec", "Gamay", "Rosé sec"],
    avoid: ["Rouges puissants"],
    keywords: ["tofu", "grillé", "végétarien"],
  }),

  food("Curry de légumes", C.vegetarian, {
    oneLiner: "Les épices aiment un blanc aromatique, fruité et légèrement tendre.",
    colors: ["white", "rose"],
    body: 3, acidity: 4, sweetness: 2, roundness: 3,
    tanninsMax: 1, intensity: 4, oakMax: 1,
    fruit: 5, minerality: 2, complexity: 3, savory: 3,
    wineStyles: ["Riesling", "Gewurztraminer", "Rosé fruité"],
    avoid: ["Rouges tanniques"],
    keywords: ["curry", "légumes", "épices"],
  }),

  food("Falafels", C.vegetarian, {
    oneLiner: "Herbes, pois chiches et friture appellent fraîcheur et fruit.",
    colors: ["white", "rose"],
    body: 2, acidity: 4, sweetness: 1, roundness: 2,
    tanninsMax: 1, intensity: 3, oakMax: 1,
    fruit: 4, minerality: 3, complexity: 2, savory: 3,
    wineStyles: ["Sauvignon blanc", "Vermentino", "Rosé sec"],
    avoid: ["Rouges tanniques"],
    keywords: ["falafel", "pois chiches", "herbes"],
  }),

  food("Houmous", C.aperitif, {
    oneLiner: "Le sésame et les pois chiches aiment un blanc frais, rond et peu boisé.",
    colors: ["white", "rose"],
    body: 2, acidity: 4, sweetness: 1, roundness: 3,
    tanninsMax: 1, intensity: 3, oakMax: 1,
    fruit: 3, minerality: 3, complexity: 2, savory: 3,
    wineStyles: ["Vermentino", "Grenache blanc", "Rosé sec"],
    avoid: ["Rouges tanniques"],
    keywords: ["houmous", "tahini", "apéritif"],
  }),

  food("Olives & antipasti", C.aperitif, {
    oneLiner: "Le sel et les saveurs méditerranéennes demandent fraîcheur et caractère savoureux.",
    colors: ["white", "rose", "sparkling"],
    body: 2, acidity: 4, sweetness: 1, roundness: 2,
    tanninsMax: 2, intensity: 4, oakMax: 1,
    fruit: 3, minerality: 4, complexity: 3, savory: 4,
    wineStyles: ["Vermentino", "Rosé sec", "Brut"],
    avoid: ["Vins lourds"],
    keywords: ["olives", "antipasti", "apéritif"],
  }),

  food("Bruschetta tomate & basilic", C.aperitif, {
    oneLiner: "La tomate appelle de l'acidité et un vin léger, frais et fruité.",
    colors: ["white", "rose", "red"],
    body: 2, acidity: 5, sweetness: 1, roundness: 2,
    tanninsMax: 2, intensity: 3, oakMax: 1,
    fruit: 4, minerality: 2, complexity: 2, savory: 3,
    wineStyles: ["Vermentino", "Rosé sec", "Gamay"],
    avoid: ["Rouges boisés"],
    keywords: ["bruschetta", "tomate", "basilic"],
  }),

  food("Tapenade", C.aperitif, {
    oneLiner: "L'olive concentrée aime un vin sec, méditerranéen et doté d'une belle fraîcheur.",
    colors: ["white", "rose", "red"],
    body: 3, acidity: 4, sweetness: 1, roundness: 2,
    tanninsMax: 3, intensity: 4, oakMax: 1,
    fruit: 3, minerality: 3, complexity: 3, savory: 5,
    wineStyles: ["Vermentino", "Rosé sec", "Grenache"],
    avoid: ["Vins doux"],
    keywords: ["tapenade", "olives", "apéritif"],
  }),

  food("Chips & trempette", C.aperitif, {
    oneLiner: "Le salé et le croustillant sont parfaits avec un vin vif, léger et désaltérant.",
    colors: ["white", "sparkling", "rose"],
    body: 2, acidity: 5, sweetness: 1, roundness: 2,
    tanninsMax: 1, intensity: 3, oakMax: 1,
    fruit: 3, minerality: 3, complexity: 2, savory: 2,
    wineStyles: ["Mousseux brut", "Sauvignon blanc", "Rosé sec"],
    avoid: ["Vins lourds"],
    keywords: ["chips", "trempette", "apéritif"],
  }),

  food("Nachos", C.aperitif, {
    oneLiner: "Fromage, sel et garnitures appellent un vin fruité, frais et sans tanins agressifs.",
    colors: ["white", "rose", "red"],
    body: 3, acidity: 4, sweetness: 2, roundness: 3,
    tanninsMax: 2, intensity: 4, oakMax: 1,
    fruit: 5, minerality: 2, complexity: 2, savory: 3,
    wineStyles: ["Riesling", "Gamay", "Rosé fruité"],
    avoid: ["Rouges tanniques"],
    keywords: ["nachos", "fromage", "apéritif"],
  }),

  food("Guacamole", C.aperitif, {
    oneLiner: "Le gras de l'avocat et la lime aiment un blanc vif, citronné et peu boisé.",
    colors: ["white", "rose"],
    body: 2, acidity: 5, sweetness: 1, roundness: 2,
    tanninsMax: 1, intensity: 3, oakMax: 1,
    fruit: 4, minerality: 3, complexity: 2, savory: 2,
    wineStyles: ["Sauvignon blanc", "Vinho Verde", "Rosé sec"],
    avoid: ["Rouges tanniques"],
    keywords: ["guacamole", "avocat", "lime"],
  }),

  food("Bouchées de chèvre & miel", C.aperitif, {
    oneLiner: "Le chèvre et le miel trouvent leur équilibre dans un blanc vif avec une touche de douceur.",
    colors: ["white", "sparkling"],
    body: 2, acidity: 5, sweetness: 2, roundness: 3,
    tanninsMax: 1, intensity: 3, oakMax: 1,
    fruit: 4, minerality: 3, complexity: 3, savory: 2,
    wineStyles: ["Chenin blanc", "Riesling", "Mousseux"],
    avoid: ["Rouges tanniques"],
    keywords: ["chèvre", "miel", "apéritif"],
  }),

  food("Croquettes de fromage", C.aperitif, {
    oneLiner: "Le fromage fondu et la friture demandent une acidité vive ou des bulles.",
    colors: ["white", "sparkling"],
    body: 3, acidity: 5, sweetness: 1, roundness: 3,
    tanninsMax: 1, intensity: 4, oakMax: 1,
    fruit: 3, minerality: 3, complexity: 2, savory: 3,
    wineStyles: ["Crémant", "Cava brut", "Chenin blanc"],
    avoid: ["Vins lourds"],
    keywords: ["croquettes", "fromage", "friture"],
  }),

  food("Mini quiches", C.aperitif, {
    oneLiner: "Œufs, crème et pâte aiment un blanc frais et légèrement rond.",
    colors: ["white", "sparkling"],
    body: 3, acidity: 4, sweetness: 1, roundness: 3,
    tanninsMax: 1, intensity: 3, oakMax: 2,
    fruit: 3, minerality: 2, complexity: 3, savory: 3,
    wineStyles: ["Chardonnay", "Chenin blanc", "Crémant"],
    avoid: ["Rouges tanniques"],
    keywords: ["quiche", "œufs", "apéritif"],
  }),

  // PLATS DU QUOTIDIEN & CUISINES DU MONDE — 30

  food("Spaghetti bolognaise", C.other, {
    oneLiner: "Tomate et viande demandent un rouge fruité, frais et suffisamment savoureux.",
    colors: ["red"],
    body: 3, acidity: 4, sweetness: 1, roundness: 3,
    tanninsMax: 4, intensity: 4, oakMax: 3,
    fruit: 4, minerality: 2, complexity: 3, savory: 4,
    wineStyles: ["Sangiovese", "Barbera", "Montepulciano"],
    avoid: ["Rouges très boisés"],
    keywords: ["pâtes", "bœuf", "tomate", "italien"],
  }),

  food("Carbonara", C.other, {
    oneLiner: "Le gras, l'œuf et le fromage appellent un blanc vif et texturé.",
    colors: ["white"],
    body: 3, acidity: 5, sweetness: 1, roundness: 4,
    tanninsMax: 1, intensity: 4, oakMax: 2,
    fruit: 3, minerality: 3, complexity: 3, savory: 4,
    wineStyles: ["Soave", "Chardonnay", "Verdicchio"],
    avoid: ["Rouges tanniques"],
    keywords: ["pâtes", "carbonara", "œuf", "pancetta"],
  }),

  food("Pâtes pesto", C.other, {
    oneLiner: "Basilic et huile d'olive aiment les blancs frais aux accents végétaux.",
    colors: ["white"],
    body: 2, acidity: 4, sweetness: 1, roundness: 2,
    tanninsMax: 1, intensity: 3, oakMax: 1,
    fruit: 3, minerality: 3, complexity: 2, savory: 3,
    wineStyles: ["Vermentino", "Sauvignon blanc", "Soave"],
    avoid: ["Rouges tanniques"],
    keywords: ["pâtes", "pesto", "basilic"],
  }),

  food("Pâtes aux fruits de mer", C.other, {
    oneLiner: "L'iode et les pâtes appellent un blanc sec, minéral et suffisamment texturé.",
    colors: ["white"],
    body: 3, acidity: 4, sweetness: 1, roundness: 3,
    tanninsMax: 1, intensity: 4, oakMax: 2,
    fruit: 3, minerality: 5, complexity: 3, savory: 4,
    wineStyles: ["Vermentino", "Albariño", "Muscadet"],
    avoid: ["Rouges tanniques"],
    keywords: ["pâtes", "fruits de mer", "iode"],
  }),

  food("Mac and cheese", C.other, {
    oneLiner: "Le fromage fondu demande fraîcheur et rondeur pour alléger chaque bouchée.",
    colors: ["white", "sparkling"],
    body: 3, acidity: 5, sweetness: 1, roundness: 4,
    tanninsMax: 1, intensity: 4, oakMax: 2,
    fruit: 3, minerality: 2, complexity: 3, savory: 3,
    wineStyles: ["Chardonnay", "Chenin blanc", "Crémant"],
    avoid: ["Rouges tanniques"],
    keywords: ["pâtes", "fromage", "crémeux"],
  }),

  food("Pizza margherita", C.other, {
    oneLiner: "Tomate, basilic et mozzarella aiment un rouge léger doté d'une belle acidité.",
    colors: ["red", "rose"],
    body: 2, acidity: 5, sweetness: 1, roundness: 2,
    tanninsMax: 3, intensity: 3, oakMax: 2,
    fruit: 4, minerality: 2, complexity: 2, savory: 3,
    wineStyles: ["Barbera", "Gamay", "Chianti"],
    avoid: ["Rouges lourds"],
    keywords: ["pizza", "tomate", "mozzarella"],
  }),

  food("Pizza pepperoni", C.other, {
    oneLiner: "Le gras, le sel et les épices demandent un rouge fruité et frais.",
    colors: ["red"],
    body: 3, acidity: 4, sweetness: 1, roundness: 3,
    tanninsMax: 3, intensity: 4, oakMax: 2,
    fruit: 5, minerality: 2, complexity: 3, savory: 4,
    wineStyles: ["Barbera", "Gamay", "Sangiovese"],
    avoid: ["Rouges très tanniques"],
    keywords: ["pizza", "pepperoni", "charcuterie"],
  }),

  food("Pizza aux champignons", C.other, {
    oneLiner: "Le caractère terreux des champignons appelle un rouge souple et savoureux.",
    colors: ["red", "white"],
    body: 3, acidity: 4, sweetness: 1, roundness: 3,
    tanninsMax: 3, intensity: 3, oakMax: 2,
    fruit: 3, minerality: 3, complexity: 4, savory: 5,
    wineStyles: ["Pinot noir", "Gamay", "Chardonnay"],
    avoid: ["Rouges massifs"],
    keywords: ["pizza", "champignons"],
  }),

  food("Tacos au poisson", C.other, {
    oneLiner: "Poisson, lime et garnitures fraîches aiment un blanc vif et fruité.",
    colors: ["white", "rose"],
    body: 2, acidity: 5, sweetness: 1, roundness: 2,
    tanninsMax: 1, intensity: 4, oakMax: 1,
    fruit: 4, minerality: 3, complexity: 2, savory: 2,
    wineStyles: ["Sauvignon blanc", "Albariño", "Rosé sec"],
    avoid: ["Rouges tanniques"],
    keywords: ["tacos", "poisson", "lime"],
  }),

  food("Tacos al pastor", C.other, {
    oneLiner: "Porc, épices et ananas aiment un vin fruité avec fraîcheur et peu de tanins.",
    colors: ["red", "rose", "white"],
    body: 3, acidity: 4, sweetness: 2, roundness: 3,
    tanninsMax: 2, intensity: 4, oakMax: 1,
    fruit: 5, minerality: 1, complexity: 3, savory: 3,
    wineStyles: ["Gamay", "Riesling", "Rosé fruité"],
    avoid: ["Rouges tanniques"],
    keywords: ["tacos", "porc", "ananas", "épicé"],
  }),

  food("Quesadillas", C.other, {
    oneLiner: "Fromage fondu et tortillas demandent un vin frais, fruité et souple.",
    colors: ["white", "rose", "red"],
    body: 3, acidity: 4, sweetness: 1, roundness: 3,
    tanninsMax: 2, intensity: 3, oakMax: 1,
    fruit: 4, minerality: 2, complexity: 2, savory: 3,
    wineStyles: ["Gamay", "Chenin blanc", "Rosé sec"],
    avoid: ["Rouges lourds"],
    keywords: ["quesadilla", "fromage", "mexicain"],
  }),

  food("Pad thaï", C.other, {
    oneLiner: "Sucré, salé et acidulé demandent un blanc aromatique et légèrement tendre.",
    colors: ["white", "rose"],
    body: 3, acidity: 4, sweetness: 2, roundness: 3,
    tanninsMax: 1, intensity: 4, oakMax: 1,
    fruit: 5, minerality: 2, complexity: 3, savory: 3,
    wineStyles: ["Riesling", "Chenin blanc", "Gewurztraminer"],
    avoid: ["Rouges tanniques"],
    keywords: ["pad thaï", "thaï", "nouilles", "sucré-salé"],
  }),

  food("Nouilles sautées", C.other, {
    oneLiner: "Sauce soja et légumes aiment un vin fruité, frais et peu tannique.",
    colors: ["white", "rose", "red"],
    body: 3, acidity: 4, sweetness: 2, roundness: 2,
    tanninsMax: 2, intensity: 4, oakMax: 1,
    fruit: 4, minerality: 2, complexity: 3, savory: 4,
    wineStyles: ["Riesling", "Gamay", "Rosé sec"],
    avoid: ["Rouges tanniques"],
    keywords: ["nouilles", "soja", "asiatique"],
  }),

  food("Dumplings", C.other, {
    oneLiner: "La pâte tendre et la farce savoureuse aiment fraîcheur, fruit et tanins discrets.",
    colors: ["white", "rose"],
    body: 2, acidity: 4, sweetness: 1, roundness: 2,
    tanninsMax: 1, intensity: 3, oakMax: 1,
    fruit: 4, minerality: 3, complexity: 2, savory: 4,
    wineStyles: ["Riesling sec", "Grüner Veltliner", "Rosé sec"],
    avoid: ["Rouges puissants"],
    keywords: ["dumplings", "raviolis", "asiatique"],
  }),

  food("Poulet général Tao", C.other, {
    oneLiner: "Le sucré, le piquant et la friture aiment un blanc fruité et légèrement doux.",
    colors: ["white", "rose"],
    body: 3, acidity: 4, sweetness: 3, roundness: 3,
    tanninsMax: 1, intensity: 5, oakMax: 1,
    fruit: 5, minerality: 1, complexity: 3, savory: 2,
    wineStyles: ["Riesling demi-sec", "Gewurztraminer", "Rosé fruité"],
    avoid: ["Rouges tanniques", "Alcool élevé"],
    keywords: ["poulet", "général tao", "sucré", "épicé"],
  }),

  food("Sushi tempura", C.other, {
    oneLiner: "La friture et le riz vinaigré appellent un vin vif et désaltérant.",
    colors: ["white", "sparkling"],
    body: 2, acidity: 5, sweetness: 1, roundness: 2,
    tanninsMax: 1, intensity: 3, oakMax: 1,
    fruit: 3, minerality: 4, complexity: 2, savory: 2,
    wineStyles: ["Riesling sec", "Crémant", "Sauvignon blanc"],
    avoid: ["Rouges tanniques"],
    keywords: ["sushi", "tempura", "friture"],
  }),

  food("Pho", C.other, {
    oneLiner: "Le bouillon parfumé demande un vin aromatique, frais et léger.",
    colors: ["white", "rose"],
    body: 2, acidity: 4, sweetness: 1, roundness: 2,
    tanninsMax: 1, intensity: 4, oakMax: 1,
    fruit: 4, minerality: 2, complexity: 3, savory: 4,
    wineStyles: ["Riesling", "Gewurztraminer", "Rosé sec"],
    avoid: ["Rouges tanniques"],
    keywords: ["pho", "bouillon", "vietnamien", "herbes"],
  }),

  food("Bibimbap", C.other, {
    oneLiner: "Légumes, viande, œuf et gochujang demandent fruit, fraîcheur et souplesse.",
    colors: ["red", "rose", "white"],
    body: 3, acidity: 4, sweetness: 2, roundness: 3,
    tanninsMax: 2, intensity: 4, oakMax: 1,
    fruit: 5, minerality: 2, complexity: 3, savory: 4,
    wineStyles: ["Gamay", "Riesling", "Rosé fruité"],
    avoid: ["Rouges tanniques"],
    keywords: ["bibimbap", "coréen", "gochujang"],
  }),

  food("Butter chicken", C.other, {
    oneLiner: "La sauce riche et épicée préfère un blanc aromatique, rond et légèrement tendre.",
    colors: ["white"],
    body: 3, acidity: 4, sweetness: 2, roundness: 4,
    tanninsMax: 1, intensity: 4, oakMax: 2,
    fruit: 5, minerality: 2, complexity: 3, savory: 3,
    wineStyles: ["Riesling", "Gewurztraminer", "Chenin blanc"],
    avoid: ["Rouges tanniques"],
    keywords: ["butter chicken", "indien", "crémeux", "épices"],
  }),

  food("Biryani", C.other, {
    oneLiner: "Les épices complexes du biryani aiment un vin aromatique et fruité.",
    colors: ["white", "rose"],
    body: 3, acidity: 4, sweetness: 2, roundness: 3,
    tanninsMax: 1, intensity: 5, oakMax: 1,
    fruit: 5, minerality: 2, complexity: 4, savory: 4,
    wineStyles: ["Riesling", "Gewurztraminer", "Rosé fruité"],
    avoid: ["Rouges tanniques"],
    keywords: ["biryani", "riz", "indien", "épices"],
  }),

  food("Couscous", C.other, {
    oneLiner: "Épices, légumes et viande trouvent leur équilibre avec un rouge souple et épicé.",
    colors: ["red", "rose"],
    body: 3, acidity: 3, sweetness: 1, roundness: 3,
    tanninsMax: 3, intensity: 4, oakMax: 2,
    fruit: 4, minerality: 2, complexity: 3, savory: 4,
    wineStyles: ["Grenache", "Cinsault", "Syrah légère"],
    avoid: ["Rouges massifs"],
    keywords: ["couscous", "épices", "maghrébin"],
  }),

  food("Shakshuka", C.other, {
    oneLiner: "Tomate, œufs et épices aiment un vin frais et fruité avec une acidité soutenue.",
    colors: ["red", "rose", "white"],
    body: 2, acidity: 5, sweetness: 1, roundness: 2,
    tanninsMax: 2, intensity: 4, oakMax: 1,
    fruit: 4, minerality: 2, complexity: 3, savory: 4,
    wineStyles: ["Gamay", "Rosé sec", "Sauvignon blanc"],
    avoid: ["Rouges tanniques"],
    keywords: ["shakshuka", "tomate", "œufs"],
  }),

  food("Œufs bénédictine", C.other, {
    oneLiner: "La sauce hollandaise demande acidité et texture pour équilibrer sa richesse.",
    colors: ["white", "sparkling"],
    body: 3, acidity: 5, sweetness: 1, roundness: 4,
    tanninsMax: 1, intensity: 3, oakMax: 2,
    fruit: 3, minerality: 3, complexity: 3, savory: 3,
    wineStyles: ["Chardonnay", "Chenin blanc", "Crémant"],
    avoid: ["Rouges tanniques"],
    keywords: ["brunch", "œufs", "hollandaise"],
  }),

  food("Omelette au fromage", C.other, {
    oneLiner: "Œufs et fromage préfèrent un blanc frais, souple et légèrement rond.",
    colors: ["white", "sparkling"],
    body: 3, acidity: 4, sweetness: 1, roundness: 3,
    tanninsMax: 1, intensity: 3, oakMax: 2,
    fruit: 3, minerality: 2, complexity: 2, savory: 3,
    wineStyles: ["Chardonnay", "Chenin blanc", "Crémant"],
    avoid: ["Rouges tanniques"],
    keywords: ["omelette", "œufs", "fromage", "brunch"],
  }),

  food("Croque-monsieur", C.other, {
    oneLiner: "Jambon, fromage et béchamel demandent fraîcheur et rondeur.",
    colors: ["white", "sparkling", "red"],
    body: 3, acidity: 4, sweetness: 1, roundness: 4,
    tanninsMax: 2, intensity: 4, oakMax: 2,
    fruit: 3, minerality: 2, complexity: 3, savory: 4,
    wineStyles: ["Chardonnay", "Crémant", "Gamay"],
    avoid: ["Rouges tanniques"],
    keywords: ["croque-monsieur", "jambon", "fromage"],
  }),

  food("Grilled cheese", C.other, {
    oneLiner: "Le fromage fondu et le pain grillé aiment une acidité franche et beaucoup de fraîcheur.",
    colors: ["white", "sparkling", "red"],
    body: 3, acidity: 5, sweetness: 1, roundness: 3,
    tanninsMax: 2, intensity: 3, oakMax: 1,
    fruit: 3, minerality: 2, complexity: 2, savory: 3,
    wineStyles: ["Chenin blanc", "Crémant", "Gamay"],
    avoid: ["Rouges lourds"],
    keywords: ["grilled cheese", "fromage", "pain grillé"],
  }),

  food("Pâté chinois", C.other, {
    oneLiner: "Bœuf, maïs et pomme de terre aiment un rouge fruité, rond et sans excès de tanins.",
    colors: ["red"],
    body: 3, acidity: 3, sweetness: 1, roundness: 4,
    tanninsMax: 3, intensity: 4, oakMax: 2,
    fruit: 4, minerality: 2, complexity: 3, savory: 4,
    wineStyles: ["Merlot", "Gamay", "Grenache"],
    avoid: ["Rouges austères"],
    keywords: ["pâté chinois", "québécois", "bœuf", "maïs"],
  }),

  food("Hot chicken", C.other, {
    oneLiner: "Sauce brune, poulet et petits pois aiment un rouge souple et fruité.",
    colors: ["red", "white"],
    body: 3, acidity: 3, sweetness: 1, roundness: 4,
    tanninsMax: 3, intensity: 4, oakMax: 2,
    fruit: 4, minerality: 2, complexity: 3, savory: 4,
    wineStyles: ["Gamay", "Pinot noir", "Chardonnay"],
    avoid: ["Rouges très tanniques"],
    keywords: ["hot chicken", "québécois", "poulet", "sauce"],
  }),

  food("Smoked meat", C.other, {
    oneLiner: "Le fumé, le gras et le sel réclament un rouge frais, fruité et savoureux.",
    colors: ["red"],
    body: 3, acidity: 4, sweetness: 1, roundness: 3,
    tanninsMax: 3, intensity: 5, oakMax: 2,
    fruit: 4, minerality: 2, complexity: 3, savory: 5,
    wineStyles: ["Gamay", "Cabernet franc", "Syrah légère"],
    avoid: ["Rouges très boisés"],
    keywords: ["smoked meat", "montréal", "fumé", "charcuterie"],
  }),

  food("Burger végétarien", C.other, {
    oneLiner: "Un burger végétal grillé aime un rouge souple, fruité et peu tannique.",
    colors: ["red", "rose"],
    body: 3, acidity: 3, sweetness: 1, roundness: 3,
    tanninsMax: 3, intensity: 4, oakMax: 2,
    fruit: 4, minerality: 2, complexity: 3, savory: 4,
    wineStyles: ["Gamay", "Grenache", "Pinot noir"],
    avoid: ["Rouges massifs"],
    keywords: ["burger", "végétarien", "grillé"],
  }),

  // DESSERTS & ACCORDS SUCRÉS — 30

  food("Tarte aux pommes", C.dessert, {
    oneLiner: "La pomme et les épices aiment un vin fruité, frais et franchement tendre.",
    colors: ["white", "sparkling"],
    body: 3, acidity: 4, sweetness: 4, roundness: 4,
    tanninsMax: 1, intensity: 4, oakMax: 2,
    fruit: 5, minerality: 2, complexity: 3, savory: 1,
    wineStyles: ["Cidre de glace", "Riesling moelleux", "Chenin doux"],
    avoid: ["Vins secs", "Rouges tanniques"],
    keywords: ["dessert", "pomme", "tarte", "cannelle"],
  }),

  food("Croustade aux pommes", C.dessert, {
    oneLiner: "Pomme cuite, cassonade et avoine appellent douceur, fruit et rondeur.",
    colors: ["white"],
    body: 3, acidity: 4, sweetness: 4, roundness: 4,
    tanninsMax: 1, intensity: 4, oakMax: 2,
    fruit: 5, minerality: 1, complexity: 3, savory: 1,
    wineStyles: ["Cidre de glace", "Chenin doux", "Riesling moelleux"],
    avoid: ["Vins secs"],
    keywords: ["dessert", "pomme", "croustade"],
  }),

  food("Tarte au sucre", C.dessert, {
    oneLiner: "Un dessert aussi riche exige un vin doux, ample et suffisamment intense.",
    colors: ["white", "fortified"],
    body: 4, acidity: 3, sweetness: 5, roundness: 5,
    tanninsMax: 2, intensity: 5, oakMax: 3,
    fruit: 4, minerality: 1, complexity: 4, savory: 1,
    wineStyles: ["Vin de glace", "Vin doux", "Porto"],
    avoid: ["Vins secs"],
    keywords: ["dessert", "tarte au sucre", "érable", "cassonade"],
  }),

  food("Pouding chômeur", C.dessert, {
    oneLiner: "La richesse du sirop demande un vin très doux, généreux et concentré.",
    colors: ["white", "fortified"],
    body: 4, acidity: 3, sweetness: 5, roundness: 5,
    tanninsMax: 2, intensity: 5, oakMax: 3,
    fruit: 4, minerality: 1, complexity: 4, savory: 1,
    wineStyles: ["Vin de glace", "Cidre de glace", "Vin doux"],
    avoid: ["Vins secs"],
    keywords: ["dessert", "québécois", "sirop", "érable"],
  }),

  food("Gâteau au chocolat", C.dessert, {
    oneLiner: "Le chocolat intense demande un vin doux, riche et au moins aussi puissant.",
    colors: ["red", "fortified"],
    body: 5, acidity: 2, sweetness: 5, roundness: 5,
    tanninsMax: 4, intensity: 5, oakMax: 4,
    fruit: 5, minerality: 1, complexity: 4, savory: 1,
    wineStyles: ["Porto", "Banyuls", "Vin doux rouge"],
    avoid: ["Vins secs", "Blancs légers"],
    keywords: ["dessert", "chocolat", "gâteau"],
  }),

  food("Brownies", C.dessert, {
    oneLiner: "Le chocolat dense appelle un vin doux, puissant et généreux.",
    colors: ["red", "fortified"],
    body: 5, acidity: 2, sweetness: 5, roundness: 5,
    tanninsMax: 4, intensity: 5, oakMax: 4,
    fruit: 5, minerality: 1, complexity: 4, savory: 1,
    wineStyles: ["Porto", "Banyuls", "Vin doux rouge"],
    avoid: ["Vins secs"],
    keywords: ["dessert", "brownie", "chocolat"],
  }),

  food("Mousse au chocolat", C.dessert, {
    oneLiner: "La texture aérienne n'enlève rien à l'intensité du chocolat : le vin doit rester doux.",
    colors: ["red", "fortified"],
    body: 4, acidity: 2, sweetness: 5, roundness: 5,
    tanninsMax: 3, intensity: 5, oakMax: 3,
    fruit: 5, minerality: 1, complexity: 4, savory: 1,
    wineStyles: ["Porto", "Banyuls", "Vin doux"],
    avoid: ["Vins secs"],
    keywords: ["dessert", "mousse", "chocolat"],
  }),

  food("Fondant au chocolat", C.dessert, {
    oneLiner: "Le cœur chocolaté très riche exige douceur, concentration et intensité.",
    colors: ["red", "fortified"],
    body: 5, acidity: 2, sweetness: 5, roundness: 5,
    tanninsMax: 4, intensity: 5, oakMax: 4,
    fruit: 5, minerality: 1, complexity: 5, savory: 1,
    wineStyles: ["Porto", "Banyuls", "Vin doux rouge"],
    avoid: ["Vins secs"],
    keywords: ["dessert", "fondant", "chocolat"],
  }),

  food("Chocolat noir", C.dessert, {
    oneLiner: "L'amertume du chocolat noir demande un vin doux, concentré et très intense.",
    colors: ["red", "fortified"],
    body: 5, acidity: 2, sweetness: 5, roundness: 4,
    tanninsMax: 4, intensity: 5, oakMax: 4,
    fruit: 4, minerality: 1, complexity: 5, savory: 2,
    wineStyles: ["Porto", "Banyuls", "Vin doux rouge"],
    avoid: ["Vins secs et légers"],
    keywords: ["dessert", "chocolat noir"],
  }),

  food("Cheesecake", C.dessert, {
    oneLiner: "Le crémeux du cheesecake demande douceur et acidité dans des proportions égales.",
    colors: ["white"],
    body: 4, acidity: 4, sweetness: 4, roundness: 5,
    tanninsMax: 1, intensity: 4, oakMax: 2,
    fruit: 4, minerality: 2, complexity: 4, savory: 1,
    wineStyles: ["Riesling moelleux", "Chenin doux", "Vin de glace"],
    avoid: ["Vins secs"],
    keywords: ["dessert", "cheesecake", "crémeux"],
  }),

  food("Tiramisu", C.dessert, {
    oneLiner: "Café, cacao et mascarpone appellent un vin doux, rond et complexe.",
    colors: ["fortified", "white"],
    body: 4, acidity: 2, sweetness: 4, roundness: 5,
    tanninsMax: 2, intensity: 5, oakMax: 3,
    fruit: 3, minerality: 1, complexity: 5, savory: 2,
    wineStyles: ["Vin doux", "Marsala", "Porto"],
    avoid: ["Vins secs"],
    keywords: ["dessert", "tiramisu", "café", "mascarpone"],
  }),

  food("Panna cotta", C.dessert, {
    oneLiner: "La douceur crémeuse préfère un vin tendre, parfumé et encore frais.",
    colors: ["white", "sparkling"],
    body: 3, acidity: 4, sweetness: 4, roundness: 5,
    tanninsMax: 1, intensity: 3, oakMax: 1,
    fruit: 4, minerality: 2, complexity: 3, savory: 1,
    wineStyles: ["Moscato", "Riesling moelleux", "Mousseux doux"],
    avoid: ["Vins secs"],
    keywords: ["dessert", "panna cotta", "crème"],
  }),

  food("Crème caramel", C.dessert, {
    oneLiner: "Caramel et crème appellent un vin doux, rond et suffisamment frais.",
    colors: ["white", "fortified"],
    body: 4, acidity: 3, sweetness: 4, roundness: 5,
    tanninsMax: 1, intensity: 4, oakMax: 2,
    fruit: 4, minerality: 1, complexity: 4, savory: 1,
    wineStyles: ["Vin doux", "Riesling moelleux", "Vin de glace"],
    avoid: ["Vins secs"],
    keywords: ["dessert", "caramel", "crème"],
  }),

  food("Crème brûlée à l'érable", C.dessert, {
    oneLiner: "L'érable intensifie la douceur : le vin doit être riche, tendre et concentré.",
    colors: ["white"],
    body: 4, acidity: 3, sweetness: 5, roundness: 5,
    tanninsMax: 1, intensity: 5, oakMax: 2,
    fruit: 4, minerality: 1, complexity: 4, savory: 1,
    wineStyles: ["Cidre de glace", "Vin de glace", "Chenin doux"],
    avoid: ["Vins secs"],
    keywords: ["dessert", "crème brûlée", "érable"],
  }),

  food("Tarte au citron", C.dessert, {
    oneLiner: "L'acidité du citron exige un vin à la fois doux et très vif.",
    colors: ["white", "sparkling"],
    body: 3, acidity: 5, sweetness: 4, roundness: 3,
    tanninsMax: 1, intensity: 4, oakMax: 1,
    fruit: 5, minerality: 3, complexity: 3, savory: 1,
    wineStyles: ["Riesling moelleux", "Moscato", "Chenin doux"],
    avoid: ["Vins secs", "Rouges"],
    keywords: ["dessert", "citron", "tarte"],
  }),

  food("Tarte aux fraises", C.dessert, {
    oneLiner: "Les petits fruits aiment un vin doux, frais et très fruité.",
    colors: ["rose", "red", "sparkling"],
    body: 2, acidity: 4, sweetness: 4, roundness: 3,
    tanninsMax: 2, intensity: 3, oakMax: 1,
    fruit: 5, minerality: 1, complexity: 2, savory: 1,
    wineStyles: ["Moscato rosé", "Mousseux doux", "Vin doux rouge léger"],
    avoid: ["Rouges tanniques", "Vins secs"],
    keywords: ["dessert", "fraise", "tarte"],
  }),

  food("Shortcake aux fraises", C.dessert, {
    oneLiner: "Fraises et crème demandent un vin tendre, parfumé et léger.",
    colors: ["rose", "white", "sparkling"],
    body: 2, acidity: 4, sweetness: 4, roundness: 4,
    tanninsMax: 1, intensity: 3, oakMax: 1,
    fruit: 5, minerality: 1, complexity: 2, savory: 1,
    wineStyles: ["Moscato", "Mousseux doux", "Riesling moelleux"],
    avoid: ["Vins secs"],
    keywords: ["dessert", "fraise", "crème"],
  }),

  food("Tarte aux bleuets", C.dessert, {
    oneLiner: "Le fruit noir et la pâte sucrée appellent douceur, fruit et fraîcheur.",
    colors: ["red", "rose", "white"],
    body: 3, acidity: 4, sweetness: 4, roundness: 3,
    tanninsMax: 2, intensity: 4, oakMax: 1,
    fruit: 5, minerality: 1, complexity: 3, savory: 1,
    wineStyles: ["Vin doux rouge", "Riesling moelleux", "Mousseux rosé doux"],
    avoid: ["Rouges secs tanniques"],
    keywords: ["dessert", "bleuets", "tarte"],
  }),

  food("Dessert aux framboises", C.dessert, {
    oneLiner: "L'acidité de la framboise aime un vin doux mais particulièrement frais.",
    colors: ["rose", "red", "white"],
    body: 2, acidity: 5, sweetness: 4, roundness: 3,
    tanninsMax: 2, intensity: 4, oakMax: 1,
    fruit: 5, minerality: 2, complexity: 3, savory: 1,
    wineStyles: ["Mousseux rosé doux", "Riesling moelleux", "Vin doux rouge"],
    avoid: ["Vins secs"],
    keywords: ["dessert", "framboise", "petits fruits"],
  }),

  food("Pêche Melba", C.dessert, {
    oneLiner: "Pêche, framboise et crème aiment un vin floral, doux et frais.",
    colors: ["white", "rose", "sparkling"],
    body: 2, acidity: 4, sweetness: 4, roundness: 4,
    tanninsMax: 1, intensity: 3, oakMax: 1,
    fruit: 5, minerality: 1, complexity: 3, savory: 1,
    wineStyles: ["Moscato", "Riesling moelleux", "Mousseux doux"],
    avoid: ["Vins secs"],
    keywords: ["dessert", "pêche", "framboise"],
  }),

  food("Poire pochée", C.dessert, {
    oneLiner: "La poire délicate préfère un vin doux, élégant et aromatique.",
    colors: ["white"],
    body: 3, acidity: 4, sweetness: 4, roundness: 4,
    tanninsMax: 1, intensity: 3, oakMax: 1,
    fruit: 5, minerality: 2, complexity: 4, savory: 1,
    wineStyles: ["Chenin doux", "Riesling moelleux", "Vin de glace"],
    avoid: ["Rouges tanniques", "Vins secs"],
    keywords: ["dessert", "poire", "fruit"],
  }),

  food("Pavlova", C.dessert, {
    oneLiner: "Meringue, crème et fruits demandent douceur, légèreté et acidité.",
    colors: ["white", "sparkling", "rose"],
    body: 2, acidity: 4, sweetness: 4, roundness: 3,
    tanninsMax: 1, intensity: 3, oakMax: 1,
    fruit: 5, minerality: 2, complexity: 2, savory: 1,
    wineStyles: ["Moscato", "Mousseux doux", "Riesling moelleux"],
    avoid: ["Vins secs"],
    keywords: ["dessert", "pavlova", "meringue", "fruits"],
  }),

  food("Macarons", C.dessert, {
    oneLiner: "La douceur délicate des macarons appelle un vin parfumé, tendre et élégant.",
    colors: ["white", "rose", "sparkling"],
    body: 2, acidity: 3, sweetness: 4, roundness: 4,
    tanninsMax: 1, intensity: 3, oakMax: 1,
    fruit: 5, minerality: 1, complexity: 3, savory: 1,
    wineStyles: ["Moscato", "Mousseux doux", "Riesling moelleux"],
    avoid: ["Vins secs"],
    keywords: ["dessert", "macarons"],
  }),

  food("Madeleines", C.dessert, {
    oneLiner: "Le beurre et la vanille aiment un vin doux, fin et légèrement rond.",
    colors: ["white", "sparkling"],
    body: 2, acidity: 3, sweetness: 3, roundness: 4,
    tanninsMax: 1, intensity: 2, oakMax: 1,
    fruit: 4, minerality: 1, complexity: 2, savory: 1,
    wineStyles: ["Moscato", "Chenin tendre", "Mousseux demi-sec"],
    avoid: ["Vins tanniques"],
    keywords: ["dessert", "madeleine", "vanille"],
  }),

  food("Gâteau aux carottes", C.dessert, {
    oneLiner: "Les épices et le glaçage demandent un vin doux, aromatique et généreux.",
    colors: ["white"],
    body: 3, acidity: 3, sweetness: 4, roundness: 5,
    tanninsMax: 1, intensity: 4, oakMax: 2,
    fruit: 5, minerality: 1, complexity: 4, savory: 1,
    wineStyles: ["Riesling moelleux", "Gewurztraminer doux", "Vin de glace"],
    avoid: ["Vins secs"],
    keywords: ["dessert", "carotte", "épices", "glaçage"],
  }),

  food("Gâteau au fromage et petits fruits", C.dessert, {
    oneLiner: "Crémeux et fruits rouges exigent un vin doux doté d'une acidité bien présente.",
    colors: ["white", "rose"],
    body: 4, acidity: 4, sweetness: 4, roundness: 5,
    tanninsMax: 1, intensity: 4, oakMax: 1,
    fruit: 5, minerality: 1, complexity: 3, savory: 1,
    wineStyles: ["Riesling moelleux", "Mousseux rosé doux", "Vin de glace"],
    avoid: ["Vins secs"],
    keywords: ["dessert", "cheesecake", "petits fruits"],
  }),

  food("Beignes", C.dessert, {
    oneLiner: "La friture et le sucre aiment des bulles tendres ou un blanc doux et frais.",
    colors: ["white", "sparkling"],
    body: 3, acidity: 4, sweetness: 4, roundness: 4,
    tanninsMax: 1, intensity: 3, oakMax: 1,
    fruit: 4, minerality: 1, complexity: 2, savory: 1,
    wineStyles: ["Moscato", "Mousseux demi-sec", "Riesling moelleux"],
    avoid: ["Vins secs"],
    keywords: ["dessert", "beigne", "friture"],
  }),

  food("Crêpes au sirop d'érable", C.dessert, {
    oneLiner: "Le sirop d'érable exige un vin riche et doux capable de suivre son intensité.",
    colors: ["white"],
    body: 4, acidity: 3, sweetness: 5, roundness: 5,
    tanninsMax: 1, intensity: 5, oakMax: 2,
    fruit: 4, minerality: 1, complexity: 4, savory: 1,
    wineStyles: ["Cidre de glace", "Vin de glace", "Chenin doux"],
    avoid: ["Vins secs"],
    keywords: ["dessert", "crêpes", "érable"],
  }),

  food("Pain doré à l'érable", C.dessert, {
    oneLiner: "Le pain doré nappé d'érable demande douceur, rondeur et une acidité suffisante.",
    colors: ["white"],
    body: 4, acidity: 3, sweetness: 5, roundness: 5,
    tanninsMax: 1, intensity: 4, oakMax: 2,
    fruit: 4, minerality: 1, complexity: 3, savory: 1,
    wineStyles: ["Cidre de glace", "Vin de glace", "Riesling doux"],
    avoid: ["Vins secs"],
    keywords: ["dessert", "brunch", "pain doré", "érable"],
  }),

  food("Dessert aux pommes et caramel", C.dessert, {
    oneLiner: "Pomme et caramel forment un terrain idéal pour les vins doux aux notes de fruits mûrs.",
    colors: ["white"],
    body: 4, acidity: 4, sweetness: 5, roundness: 5,
    tanninsMax: 1, intensity: 5, oakMax: 2,
    fruit: 5, minerality: 1, complexity: 4, savory: 1,
    wineStyles: ["Cidre de glace", "Vin de glace", "Chenin doux"],
    avoid: ["Vins secs"],
    keywords: ["dessert", "pomme", "caramel"],
  }),

  // Les 150 accords sont ajoutés dans les prochains blocs.
];

console.log(`Accords préparés : ${NEW_FOODS.length}`);

if (NEW_FOODS.length !== 150) {
  throw new Error(
    `Le script doit contenir exactement 150 nouveaux accords; trouvé : ${NEW_FOODS.length}.`
  );
}

const existingFoods = await client.fetch(`
  *[_type == "food" && !(_id in path("drafts.**"))] {
    _id,
    name,
    "slug": slug.current
  }
`);

const existingNames = new Set(
  existingFoods.map((f) => f.name?.trim().toLowerCase()).filter(Boolean)
);

const existingSlugs = new Set(
  existingFoods.map((f) => f.slug).filter(Boolean)
);

const duplicateNames = NEW_FOODS.filter((f) =>
  existingNames.has(f.name.trim().toLowerCase())
);

const duplicateSlugs = NEW_FOODS.filter((f) =>
  existingSlugs.has(slugify(f.name))
);

const internalNames = new Set();
const internalSlugs = new Set();
const internalDuplicates = [];

for (const item of NEW_FOODS) {
  const normalizedName = item.name.trim().toLowerCase();
  const slug = slugify(item.name);

  if (internalNames.has(normalizedName) || internalSlugs.has(slug)) {
    internalDuplicates.push(item.name);
  }

  internalNames.add(normalizedName);
  internalSlugs.add(slug);
}

if (duplicateNames.length || duplicateSlugs.length || internalDuplicates.length) {
  console.error("\n❌ IMPORT ANNULÉ — doublons détectés.");

  if (duplicateNames.length) {
    console.error(
      "Noms déjà dans Sanity:",
      duplicateNames.map((f) => f.name)
    );
  }

  if (duplicateSlugs.length) {
    console.error(
      "Slugs déjà dans Sanity:",
      duplicateSlugs.map((f) => f.name)
    );
  }

  if (internalDuplicates.length) {
    console.error("Doublons dans le nouveau lot:", internalDuplicates);
  }

  process.exit(1);
}

const docs = NEW_FOODS.map((item) => {
  const slug = slugify(item.name);

  return {
    _id: `food-${slug}`,
    _type: "food",

    name: item.name,
    slug: {
      _type: "slug",
      current: slug,
    },

    category: item.category,
    oneLiner: item.oneLiner,

    wineStyles: item.wineStyles,
    avoid: item.avoid,
    pairingKeywords: item.keywords,

    recommendedColors: item.colors,

    bodyTarget: item.body,
    bodyTolerance: item.bodyTol,

    acidityTarget: item.acidity,
    acidityTolerance: item.acidityTol,

    sweetnessTarget: item.sweetness,
    sweetnessTolerance: item.sweetnessTol,

    roundnessTarget: item.roundness,
    roundnessTolerance: item.roundnessTol,

    tanninsMax: item.tanninsMax,

    intensityTarget: item.intensity,
    intensityTolerance: item.intensityTol,

    oakInfluenceMax: item.oakMax,

    fruitIntensityTarget: item.fruit,
    fruitIntensityTolerance: item.fruitTol,

    mineralityTarget: item.minerality,
    mineralityTolerance: item.mineralityTol,

    complexityTarget: item.complexity,
    complexityTolerance: item.complexityTol,

    savoryTarget: item.savory,
    savoryTolerance: item.savoryTol,

    published: true,
  };
});

console.log("\nRépartition prévue:");

const counts = {};
for (const item of docs) {
  counts[item.category] = (counts[item.category] || 0) + 1;
}

console.table(counts);

console.log("\nAucun doublon avec Sanity.");
console.log("Préparation de la transaction…");

let transaction = client.transaction();

for (const doc of docs) {
  transaction = transaction.create(doc);
}

const result = await transaction.commit();

console.log(`\n✅ ${docs.length} nouveaux accords créés.`);
console.log(`Transaction : ${result.transactionId}`);
console.log(`Total théorique après import : ${existingFoods.length + docs.length}`);
