export type PairingWine = {
  _id: string;
  name?: string;
  color?: string;
  body?: number;
  sweetness?: number;
  roundness?: number;
  acidity?: number;
  tannins?: number;
  intensity?: number;
  oakInfluence?: number;
};

export type PairingFood = {
  _id?: string;
  name?: string;
  recommendedColors?: string[];
  bodyTarget?: number;
  bodyTolerance?: number;
  acidityTarget?: number;
  acidityTolerance?: number;
  sweetnessTarget?: number;
  sweetnessTolerance?: number;
  roundnessTarget?: number;
  roundnessTolerance?: number;
  tanninsMax?: number;
  intensityTarget?: number;
  intensityTolerance?: number;
  oakInfluenceMax?: number;
  editorialWineIds?: string[];
};

export type PairingScoreResult = {
  pairingScore: number;
  editorialBonus: number;
  completenessBonus: number;
  completeness: number;
  colorMatch: boolean;
  baseScore: number;
  finalScore: number;
};

const weights = {
  color: 22,
  body: 13,
  acidity: 18,
  sweetness: 10,
  roundness: 10,
  tannins: 10,
  intensity: 9,
  oak: 8,
};

const TOTAL_WEIGHT = Object.values(weights).reduce(
  (sum, value) => sum + value,
  0
);

function targetRatio(
  value: number | undefined,
  target: number | undefined,
  tolerance = 1
): number | null {
  if (value == null || target == null) return null;

  const distance = Math.abs(value - target);

  if (distance === 0) return 1;
  if (distance <= tolerance) return 0.78;
  if (distance === tolerance + 1) return 0.42;
  if (distance === tolerance + 2) return 0.15;

  return 0;
}

function maxRatio(
  value: number | undefined,
  max: number | undefined
): number | null {
  if (value == null || max == null) return null;

  if (value < max) return 1;
  if (value === max) return 0.85;
  if (value === max + 1) return 0.25;

  return 0;
}

export function scoreWineForPairing(
  wine: PairingWine,
  food: PairingFood
): PairingScoreResult {
  const colorRuleExists =
    Array.isArray(food.recommendedColors) &&
    food.recommendedColors.length > 0;

  const colorMatch =
    !colorRuleExists ||
    food.recommendedColors!.includes(wine.color ?? "");

  const criteria = [
    {
      weight: weights.color,
      ratio:
        !colorRuleExists || !wine.color
          ? null
          : colorMatch
            ? 1
            : 0.05,
    },
    {
      weight: weights.body,
      ratio: targetRatio(
        wine.body,
        food.bodyTarget,
        food.bodyTolerance
      ),
    },
    {
      weight: weights.acidity,
      ratio: targetRatio(
        wine.acidity,
        food.acidityTarget,
        food.acidityTolerance
      ),
    },
    {
      weight: weights.sweetness,
      ratio: targetRatio(
        wine.sweetness,
        food.sweetnessTarget,
        food.sweetnessTolerance
      ),
    },
    {
      weight: weights.roundness,
      ratio: targetRatio(
        wine.roundness,
        food.roundnessTarget,
        food.roundnessTolerance
      ),
    },
    {
      weight: weights.tannins,
      ratio: maxRatio(
        wine.tannins,
        food.tanninsMax
      ),
    },
    {
      weight: weights.intensity,
      ratio: targetRatio(
        wine.intensity,
        food.intensityTarget,
        food.intensityTolerance
      ),
    },
    {
      weight: weights.oak,
      ratio: maxRatio(
        wine.oakInfluence,
        food.oakInfluenceMax
      ),
    },
  ];

  const applicable = criteria.filter(
    (
      criterion
    ): criterion is { weight: number; ratio: number } =>
      criterion.ratio !== null
  );

  const knownWeight = applicable.reduce(
    (sum, criterion) => sum + criterion.weight,
    0
  );

  const earnedWeight = applicable.reduce(
    (sum, criterion) =>
      sum + criterion.weight * criterion.ratio,
    0
  );

  const rawProfile =
    knownWeight > 0 ? earnedWeight / knownWeight : 0;

  // Compatibilité objective : maximum 95.
  const pairingScore = rawProfile * 95;

  // Mesure de la fiabilité des données disponibles.
  const completeness = knownWeight / TOTAL_WEIGHT;

  // Petit bonus de complétude : maximum 2.
  const completenessBonus = completeness * 2;

  // Signal éditorial LPV : maximum 3.
  const editorial =
    food.editorialWineIds?.includes(wine._id) ?? false;

  const editorialBonus = editorial ? 3 : 0;

  const baseScore =
    pairingScore +
    completenessBonus +
    editorialBonus;

  return {
    pairingScore: Math.round(pairingScore),
    editorialBonus,
    completenessBonus:
      Math.round(completenessBonus * 10) / 10,
    completeness: Math.round(completeness * 100),
    colorMatch,
    baseScore: Math.min(
      100,
      Math.round(baseScore)
    ),

    // Pour l'instant identique au baseScore.
    // La personnalisation modifiera ce classement plus tard.
    finalScore: Math.min(
      100,
      Math.round(baseScore)
    ),
  };
}

export function rankWinesForPairing<
  T extends PairingWine
>(
  wines: T[],
  food: PairingFood,
  limit?: number
) {
  const ranked = wines
    .map((wine) => ({
      wine,
      ...scoreWineForPairing(wine, food),
    }))
    .sort((a, b) => {
      if (b.finalScore !== a.finalScore) {
        return b.finalScore - a.finalScore;
      }

      if (b.completeness !== a.completeness) {
        return b.completeness - a.completeness;
      }

      return (a.wine.name ?? "").localeCompare(
        b.wine.name ?? "",
        "fr"
      );
    });

  return typeof limit === "number"
    ? ranked.slice(0, limit)
    : ranked;
}
