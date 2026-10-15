const clamp = (v, min = 0, max = 1) =>
  Math.max(min, Math.min(max, v));

const num = (v) =>
  typeof v === "number" && Number.isFinite(v) ? v : null;

const arr = (v) => (Array.isArray(v) ? v : []);

function refId(value) {
  if (typeof value === "string") return value;
  return value?._ref || value?._id || null;
}

/*
 * Score d'adéquation à une cible 1–5.
 *
 * On ne donne plus automatiquement 100 % à toute valeur située
 * dans la tolérance. La cible exacte reste meilleure.
 */
function targetScore(value, target, tolerance = 1) {
  value = num(value);
  target = num(target);

  if (value === null || target === null) return null;

  const distance = Math.abs(value - target);
  const tol = Math.max(0, num(tolerance) ?? 1);

  if (distance === 0) return 1;

  if (distance <= tol) {
    return clamp(1 - distance * 0.12);
  }

  return clamp(
    0.78 - (distance - tol) * 0.28
  );
}

/*
 * Pour tanninsMax et oakInfluenceMax :
 * être sous le plafond est bon;
 * dépasser le plafond est rapidement pénalisé.
 */
function ceilingScore(value, maximum) {
  value = num(value);
  maximum = num(maximum);

  if (value === null || maximum === null) return null;

  if (value <= maximum) {
    const gap = maximum - value;

    // On évite de récompenser exagérément un vin très loin sous
    // le plafond : le plafond est surtout une contrainte.
    return clamp(0.94 + Math.min(gap, 2) * 0.03);
  }

  const excess = value - maximum;

  if (excess === 1) return 0.48;
  if (excess === 2) return 0.16;

  return 0;
}

function sweetnessValue(wine) {
  if (num(wine.sweetness) !== null) return wine.sweetness;
  return null;
}

function ids(values) {
  return arr(values).map(refId).filter(Boolean);
}

/*
 * Compatibilité de couleur/style.
 *
 * Lorsqu'un accord définit explicitement recommendedColors,
 * un vin d'une autre couleur n'est pas simplement "un peu moins bon" :
 * il reçoit une pénalité majeure.
 *
 * On ne l'élimine toutefois pas complètement, car certains accords
 * transversaux peuvent fonctionner avec plusieurs styles.
 */
function colorScore(wine, food) {
  const colors = arr(food.recommendedColors);

  if (!colors.length || !wine.color) return null;

  return colors.includes(wine.color) ? 1 : 0.08;
}

function add(parts, key, value, weight) {
  if (value === null || value === undefined) return;

  parts.push({
    key,
    value: clamp(value),
    weight,
  });
}

function culinaryCompatibility(wine, food) {
  const category = food.category;
  const sweetness = sweetnessValue(wine);
  const tannins = num(wine.tannins);
  const body = num(wine.body);
  const acidity = num(wine.acidity);
  const minerality = num(wine.minerality);

  /*
   * Ces règles ne cherchent pas à choisir le meilleur accord.
   * Elles empêchent seulement des incompatibilités culinaires
   * évidentes de gagner grâce aux autres critères numériques.
   */

  // DESSERT
  // Un vin sec ne doit pas dominer un dessert sucré.
  if (category === "dessert") {
    const target = num(food.sweetnessTarget);

    if (sweetness !== null && target !== null) {
      if (target >= 4 && sweetness <= 1) return 0.18;
      if (target >= 3 && sweetness <= 1) return 0.35;
      if (sweetness + 1 < target) return 0.48;
    }
  }

  // POISSON / FRUITS DE MER
  // Les rouges puissants et tanniques sont fortement défavorisés.
  if (category === "fish" || category === "seafood") {
    if (tannins !== null && tannins >= 4) return 0.32;
    if (body !== null && body >= 5) return 0.42;

    // Fraîcheur et minéralité sont particulièrement pertinentes.
    if (
      acidity !== null &&
      acidity >= 4 &&
      minerality !== null &&
      minerality >= 3
    ) {
      return 1.05;
    }
  }

  // VIANDE ROUGE
  // Les vins très doux ne doivent pas apparaître naturellement
  // parmi les meilleurs accords de grillades / agneau / steak.
  if (category === "red-meat") {
    if (sweetness !== null && sweetness >= 4) return 0.22;
    if (sweetness !== null && sweetness >= 3) return 0.48;

    if (
      body !== null &&
      body >= 4 &&
      tannins !== null &&
      tannins >= 3
    ) {
      return 1.04;
    }
  }

  // CHARCUTERIE
  if (category === "charcuterie") {
    if (sweetness !== null && sweetness >= 4) return 0.42;
  }

  // APÉRITIF
  // On évite qu'un vin massif et très tannique prenne le dessus.
  if (category === "aperitif") {
    if (
      body !== null &&
      body >= 5 &&
      tannins !== null &&
      tannins >= 4
    ) {
      return 0.55;
    }
  }

  return 1;
}

export function scorePairing(wine, food) {
  const parts = [];

  /*
   * Hiérarchie LPV :
   * acidité / structure / sucre / type dominent;
   * les dimensions aromatiques affinent ensuite.
   */

  add(parts, "color", colorScore(wine, food), 3.2);

  add(
    parts,
    "body",
    targetScore(
      wine.body,
      food.bodyTarget,
      food.bodyTolerance
    ),
    2.4
  );

  add(
    parts,
    "acidity",
    targetScore(
      wine.acidity,
      food.acidityTarget,
      food.acidityTolerance
    ),
    3
  );

  add(
    parts,
    "sweetness",
    targetScore(
      sweetnessValue(wine),
      food.sweetnessTarget,
      food.sweetnessTolerance
    ),
    2.8
  );

  add(
    parts,
    "roundness",
    targetScore(
      wine.roundness,
      food.roundnessTarget,
      food.roundnessTolerance
    ),
    1.5
  );

  add(
    parts,
    "tannins",
    ceilingScore(
      wine.tannins,
      food.tanninsMax
    ),
    2.6
  );

  add(
    parts,
    "intensity",
    targetScore(
      wine.intensity,
      food.intensityTarget,
      food.intensityTolerance
    ),
    2
  );

  add(
    parts,
    "oak",
    ceilingScore(
      wine.oakInfluence,
      food.oakInfluenceMax
    ),
    1.8
  );

  add(
    parts,
    "fruit",
    targetScore(
      wine.fruitIntensity,
      food.fruitIntensityTarget,
      food.fruitIntensityTolerance
    ),
    1.2
  );

  add(
    parts,
    "minerality",
    targetScore(
      wine.minerality,
      food.mineralityTarget,
      food.mineralityTolerance
    ),
    1.3
  );

  add(
    parts,
    "complexity",
    targetScore(
      wine.complexity,
      food.complexityTarget,
      food.complexityTolerance
    ),
    1
  );

  add(
    parts,
    "savory",
    targetScore(
      wine.savory,
      food.savoryTarget,
      food.savoryTolerance
    ),
    1.3
  );

  const totalWeight = parts.reduce(
    (sum, p) => sum + p.weight,
    0
  );

  if (!totalWeight) {
    return {
      score: 0,
      editorialBonus: false,
      grapeBonus: false,
      criteriaUsed: 0,
      breakdown: [],
    };
  }

  let raw =
    parts.reduce(
      (sum, p) => sum + p.value * p.weight,
      0
    ) / totalWeight;

  /*
   * Garde-fou couleur.
   *
   * Une incompatibilité explicite ne doit pas pouvoir être
   * compensée par six petits critères aromatiques.
   */
  const color = parts.find((p) => p.key === "color");

  if (color && color.value < 0.5) {
    raw *= 0.72;
  }

  /*
   * Dépassements critiques.
   */
  const tannins = parts.find((p) => p.key === "tannins");
  if (tannins && tannins.value <= 0.16) {
    raw *= 0.82;
  }

  const oak = parts.find((p) => p.key === "oak");
  if (oak && oak.value <= 0.16) {
    raw *= 0.88;
  }

  /*
   * Compatibilité culinaire.
   *
   * Appliquée après le score structurel afin qu'une incompatibilité
   * fondamentale ne puisse pas être compensée par des critères
   * aromatiques secondaires.
   */
  raw *= culinaryCompatibility(wine, food);

  /*
   * Cépages préférés = signal positif seulement.
   */
  const preferredGrapes = ids(food.preferredGrapes);
  const wineGrapes = ids(wine.grapes);

  const grapeBonus =
    preferredGrapes.length > 0 &&
    wineGrapes.some((id) => preferredGrapes.includes(id));

  if (grapeBonus) {
    raw += 0.025;
  }

  /*
   * Sélection éditoriale LPV = petit bonus.
   *
   * Elle départage de bons candidats mais ne doit jamais
   * transformer un accord médiocre en excellent accord.
   */
  const editorialBonus =
    ids(food.wines).includes(wine._id);

  if (editorialBonus && raw >= 0.72) {
    raw += 0.035;
  }

  /*
   * Courbe finale :
   * réduit les faux 100 tout en conservant une lecture intuitive.
   */
  const finalScore = clamp(raw) * 96;

  return {
    score: Math.round(finalScore * 10) / 10,
    editorialBonus,
    grapeBonus,
    criteriaUsed: parts.length,
    breakdown: parts.map((p) => ({
      label: p.key,
      score: Math.round(p.value * 1000) / 10,
      weight: p.weight,
    })),
  };
}

export function rankFoodsForWine(wine, foods, limit = 4) {
  return foods
    .map((food) => ({
      food,
      ...scorePairing(wine, food),
    }))
    .filter((r) => r.criteriaUsed >= 4)
    .sort(
      (a, b) =>
        b.score - a.score ||
        String(a.food.name).localeCompare(
          String(b.food.name),
          "fr"
        )
    )
    .slice(0, limit);
}

export function rankWinesForFood(food, wines, limit = 8) {
  return wines
    .map((wine) => ({
      wine,
      ...scorePairing(wine, food),
    }))
    .filter((r) => r.criteriaUsed >= 4)
    .sort(
      (a, b) =>
        b.score - a.score ||
        String(a.wine.name).localeCompare(
          String(b.wine.name),
          "fr"
        )
    )
    .slice(0, limit);
}
