export const WINE_DNA_DIMENSIONS = [
  "body",
  "sweetness",
  "roundness",
  "acidity",
  "tannins",
  "fruitIntensity",
  "minerality",
  "intensity",
  "complexity",
  "oakInfluence",
  "savory",
] as const;

export type WineDnaDimension =
  (typeof WINE_DNA_DIMENSIONS)[number];

export type WineColor =
  | "red"
  | "white"
  | "rose"
  | "orange"
  | "sparkling"
  | "fortified";

export type DnaMetadataEntry = {
  confidence?: number | null;
  source?:
    | "technical"
    | "tasting"
    | "editorial"
    | "inferred"
    | null;
};

export type WineDnaSource = {
  color?: WineColor | string | null;

  body?: number | null;
  sweetness?: number | null;
  roundness?: number | null;
  acidity?: number | null;
  tannins?: number | null;
  fruitIntensity?: number | null;
  minerality?: number | null;
  intensity?: number | null;
  complexity?: number | null;
  oakInfluence?: number | null;
  savory?: number | null;

  dnaMetadata?: Partial<
    Record<WineDnaDimension, DnaMetadataEntry>
  > | null;
};

export type WineDna = {
  color?: WineColor;

  values: Partial<
    Record<WineDnaDimension, number>
  >;

  dimensionConfidence: Record<
    WineDnaDimension,
    number
  >;

  dimensionWeights: Record<
    WineDnaDimension,
    number
  >;

  knownDimensions: WineDnaDimension[];
  missingDimensions: WineDnaDimension[];

  /**
   * Complétude brute :
   * nombre de dimensions connues / 11.
   */
  completeness: number;

  /**
   * Complétude pondérée selon la pertinence
   * des dimensions pour le type de vin.
   */
  effectiveCompleteness: number;

  /**
   * Fiabilité pondérée des données disponibles.
   */
  dataConfidence: number;

  confidence: "low" | "medium" | "high";
};

const BASE_DIMENSION_WEIGHTS: Record<
  WineDnaDimension,
  number
> = {
  body: 1,
  sweetness: 1,
  roundness: 0.9,
  acidity: 1,
  tannins: 0.8,
  fruitIntensity: 0.9,
  minerality: 0.7,
  intensity: 0.9,
  complexity: 0.6,
  oakInfluence: 0.6,
  savory: 0.7,
};

function getDimensionWeights(
  color?: WineColor
): Record<WineDnaDimension, number> {
  const weights = {
    ...BASE_DIMENSION_WEIGHTS,
  };

  switch (color) {
    case "white":
      weights.tannins = 0.1;
      weights.acidity = 1.15;
      break;

    case "rose":
      weights.tannins = 0.15;
      weights.acidity = 1.1;
      break;

    case "sparkling":
      weights.tannins = 0.05;
      weights.acidity = 1.2;
      weights.sweetness = 1.1;
      break;

    case "orange":
      weights.tannins = 0.65;
      weights.acidity = 1.05;
      break;

    case "red":
      weights.tannins = 1;
      break;

    case "fortified":
      weights.sweetness = 1.2;
      weights.body = 1.1;
      weights.tannins = 0.5;
      break;
  }

  return weights;
}

function validScaleValue(
  value: number | null | undefined
): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 1 &&
    value <= 5
  );
}

function normalizeConfidence(
  value: number | null | undefined
): number {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    return 1;
  }

  return Math.max(0, Math.min(1, value));
}

function normalizeColor(
  color?: string | null
): WineColor | undefined {
  const allowed: WineColor[] = [
    "red",
    "white",
    "rose",
    "orange",
    "sparkling",
    "fortified",
  ];

  return allowed.includes(color as WineColor)
    ? (color as WineColor)
    : undefined;
}

function round(
  value: number,
  decimals = 2
): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function buildWineDna(
  wine: WineDnaSource
): WineDna {
  const color = normalizeColor(wine.color);

  const values: Partial<
    Record<WineDnaDimension, number>
  > = {};

  const dimensionConfidence =
    {} as Record<WineDnaDimension, number>;

  const knownDimensions: WineDnaDimension[] = [];
  const missingDimensions: WineDnaDimension[] = [];

  const dimensionWeights =
    getDimensionWeights(color);

  for (const dimension of WINE_DNA_DIMENSIONS) {
    const value = wine[dimension];

    if (validScaleValue(value)) {
      values[dimension] = value;
      knownDimensions.push(dimension);

      dimensionConfidence[dimension] =
        normalizeConfidence(
          wine.dnaMetadata?.[dimension]
            ?.confidence
        );
    } else {
      missingDimensions.push(dimension);
      dimensionConfidence[dimension] = 0;
    }
  }

  const completeness =
    knownDimensions.length /
    WINE_DNA_DIMENSIONS.length;

  const totalRelevantWeight =
    WINE_DNA_DIMENSIONS.reduce(
      (sum, dimension) =>
        sum + dimensionWeights[dimension],
      0
    );

  const knownRelevantWeight =
    knownDimensions.reduce(
      (sum, dimension) =>
        sum + dimensionWeights[dimension],
      0
    );

  const effectiveCompleteness =
    totalRelevantWeight > 0
      ? knownRelevantWeight /
        totalRelevantWeight
      : 0;

  const confidenceWeight =
    knownDimensions.reduce(
      (sum, dimension) =>
        sum +
        dimensionWeights[dimension] *
          dimensionConfidence[dimension],
      0
    );

  const dataConfidence =
    totalRelevantWeight > 0
      ? confidenceWeight /
        totalRelevantWeight
      : 0;

  let confidence: WineDna["confidence"] =
    "low";

  if (
    effectiveCompleteness >= 0.9 &&
    dataConfidence >= 0.85
  ) {
    confidence = "high";
  } else if (
    effectiveCompleteness >= 0.7 &&
    dataConfidence >= 0.6
  ) {
    confidence = "medium";
  }

  return {
    color,
    values,
    dimensionConfidence,
    dimensionWeights,
    knownDimensions,
    missingDimensions,
    completeness: round(completeness),
    effectiveCompleteness: round(
      effectiveCompleteness
    ),
    dataConfidence: round(dataConfidence),
    confidence,
  };
}

export function wineDnaDistance(
  a: WineDna,
  b: WineDna
) {
  const shared = WINE_DNA_DIMENSIONS.filter(
    (dimension) =>
      a.values[dimension] !== undefined &&
      b.values[dimension] !== undefined
  );

  if (shared.length === 0) {
    return {
      distance: null,
      similarity: null,
      sharedDimensions: 0,
      sharedWeight: 0,
      confidence: 0,
    };
  }

  let weightedDistance = 0;
  let sharedWeight = 0;
  let confidenceWeight = 0;

  for (const dimension of shared) {
    /*
     * Pour comparer deux vins, on utilise
     * la moyenne de leurs poids contextuels.
     */
    const relevanceWeight =
      (a.dimensionWeights[dimension] +
        b.dimensionWeights[dimension]) /
      2;

    /*
     * Une dimension n'est jamais plus fiable
     * que la moins fiable des deux observations.
     */
    const observationConfidence = Math.min(
      a.dimensionConfidence[dimension],
      b.dimensionConfidence[dimension]
    );

    const effectiveWeight =
      relevanceWeight * observationConfidence;

    const difference = Math.abs(
      a.values[dimension]! -
        b.values[dimension]!
    );

    weightedDistance +=
      difference * effectiveWeight;

    sharedWeight += effectiveWeight;

    confidenceWeight += relevanceWeight;
  }

  if (sharedWeight === 0) {
    return {
      distance: null,
      similarity: null,
      sharedDimensions: shared.length,
      sharedWeight: 0,
      confidence: 0,
    };
  }

  /*
   * Chaque dimension varie de 1 à 5 :
   * distance maximale = 4.
   */
  const normalizedDistance =
    weightedDistance /
    (sharedWeight * 4);

  /*
   * La confiance de comparaison tient compte
   * à la fois :
   * - de la couverture des dimensions;
   * - de la confiance de leurs observations.
   */
  const allRelevantDimensions =
    WINE_DNA_DIMENSIONS.reduce(
      (sum, dimension) =>
        sum +
        (a.dimensionWeights[dimension] +
          b.dimensionWeights[dimension]) /
          2,
      0
    );

  const coverage =
    allRelevantDimensions > 0
      ? confidenceWeight /
        allRelevantDimensions
      : 0;

  const observationQuality =
    confidenceWeight > 0
      ? sharedWeight / confidenceWeight
      : 0;

  const comparisonConfidence =
    coverage * observationQuality;

  return {
    distance: round(
      normalizedDistance,
      3
    ),

    similarity: round(
      1 - normalizedDistance,
      3
    ),

    sharedDimensions: shared.length,

    sharedWeight: round(sharedWeight, 3),

    confidence: round(
      comparisonConfidence,
      2
    ),
  };
}
