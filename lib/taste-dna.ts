import {
  WINE_DNA_DIMENSIONS,
  buildWineDna,
  type WineDnaDimension,
  type WineDnaSource,
  type WineColor,
} from "./wine-dna";

export type TasteDnaDimension = {
  value: number | null;
  confidence: number;
  observations: number;
  uniqueWines: number;
  dispersion: number | null;

  avoidedValue: number | null;
  avoidanceStrength: number;
  negativeObservations: number;
};

export type TasteDnaDimensions = Record<
  WineDnaDimension,
  TasteDnaDimension
>;

export type DeclaredPreferences = {
  mainWineType?: string | null;
  bodyPreference?: number | null;
  stylePreference?: string | null;
};

export type TasteWine = WineDnaSource & {
  _id?: string;
  color?: WineColor | string | null;
};

export type FavoriteSignal = {
  wine: TasteWine;
};

export type JournalSignal = {
  wine: TasteWine;
  appreciation: "liked" | "average" | "disliked";
  buyAgain: boolean;
  tastedAt?: string | null;
};

export type TasteDnaInput = {
  preferences?: DeclaredPreferences | null;
  favorites?: FavoriteSignal[];
  journal?: JournalSignal[];
};

export type TasteDna = {
  dimensions: TasteDnaDimensions;

  colorAffinity: Partial<Record<WineColor, number>>;
  colorAvoidance: Partial<Record<WineColor, number>>;

  exploration: number;

  evidence: {
    favorites: number;
    journalEntries: number;
    likedJournalEntries: number;
    averageJournalEntries: number;
    dislikedJournalEntries: number;
    buyAgainEntries: number;
    uniqueWines: number;
  };

  overallConfidence: number;
};

type ObservationSource =
  | "declared"
  | "favorite"
  | "journal-liked"
  | "journal-average"
  | "journal-disliked";

type Observation = {
  value: number;
  weight: number;
  wineKey: string;
  source: ObservationSource;
};

type DimensionObservations = {
  positive: Observation[];
  negative: Observation[];
  neutral: Observation[];
};

const EMPTY_DIMENSION = (): TasteDnaDimension => ({
  value: null,
  confidence: 0,
  observations: 0,
  uniqueWines: 0,
  dispersion: null,
  avoidedValue: null,
  avoidanceStrength: 0,
  negativeObservations: 0,
});

function clamp(
  value: number,
  min: number,
  max: number
): number {
  return Math.max(min, Math.min(max, value));
}

function round(
  value: number,
  decimals = 2
): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function isScaleValue(
  value: unknown
): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 1 &&
    value <= 5
  );
}

function normalizeWineColor(
  value?: string | null
): WineColor | null {
  const colors: WineColor[] = [
    "red",
    "white",
    "rose",
    "orange",
    "sparkling",
    "fortified",
  ];

  return colors.includes(value as WineColor)
    ? (value as WineColor)
    : null;
}

function wineKey(
  wine: TasteWine,
  fallback: string
): string {
  return wine._id || fallback;
}

function weightedMean(
  observations: Observation[]
): number | null {
  const totalWeight = observations.reduce(
    (sum, observation) => sum + observation.weight,
    0
  );

  if (totalWeight <= 0) {
    return null;
  }

  return (
    observations.reduce(
      (sum, observation) =>
        sum + observation.value * observation.weight,
      0
    ) / totalWeight
  );
}

function weightedDispersion(
  observations: Observation[],
  center: number
): number {
  const totalWeight = observations.reduce(
    (sum, observation) => sum + observation.weight,
    0
  );

  if (totalWeight <= 0) {
    return 0;
  }

  const variance =
    observations.reduce(
      (sum, observation) =>
        sum +
        observation.weight *
          Math.pow(observation.value - center, 2),
      0
    ) / totalWeight;

  return Math.sqrt(variance);
}

function uniqueWineCount(
  observations: Observation[]
): number {
  return new Set(
    observations
      .map((observation) => observation.wineKey)
      .filter((key) => !key.startsWith("declared:"))
  ).size;
}

/*
 * Plusieurs signaux concernant exactement le même vin
 * ne doivent pas être considérés comme autant de preuves
 * indépendantes.
 *
 * On conserve toutes les observations pour le calcul
 * du centre, mais la confiance utilise surtout la diversité
 * des vins observés.
 */
function evidenceConfidence(
  observations: DimensionObservations
): number {
  const behavioral = [
    ...observations.positive,
    ...observations.negative,
    ...observations.neutral,
  ].filter(
    (observation) =>
      !observation.wineKey.startsWith("declared:")
  );

  const declared = observations.positive.filter(
    (observation) =>
      observation.wineKey.startsWith("declared:")
  );

  const uniqueBehavioralWines =
    uniqueWineCount(behavioral);

  const behavioralWeightByWine = new Map<
    string,
    number
  >();

  for (const observation of behavioral) {
    const current =
      behavioralWeightByWine.get(
        observation.wineKey
      ) || 0;

    /*
     * Cap par vin :
     * une même bouteille ne peut pas fournir
     * une quantité infinie de certitude.
     */
    behavioralWeightByWine.set(
      observation.wineKey,
      Math.min(
        3,
        current + observation.weight
      )
    );
  }

  const diverseEvidence = Array.from(
    behavioralWeightByWine.values()
  ).reduce((sum, weight) => sum + weight, 0);

  const declaredEvidence = Math.min(
    1.5,
    declared.reduce(
      (sum, observation) =>
        sum + observation.weight,
      0
    )
  );

  /*
   * Bonus modéré de diversité.
   * Il récompense plusieurs vins distincts,
   * sans faire exploser la confiance.
   */
  const diversityBonus =
    uniqueBehavioralWines <= 1
      ? 0
      : Math.log2(uniqueBehavioralWines) * 0.45;

  const effectiveEvidence =
    diverseEvidence +
    declaredEvidence +
    diversityBonus;

  const confidence =
    1 - Math.exp(-effectiveEvidence / 9);

  return clamp(confidence, 0, 0.95);
}

function calculateDimension(
  observations: DimensionObservations
): TasteDnaDimension {
  const positiveCenter = weightedMean(
    observations.positive
  );

  const negativeCenter = weightedMean(
    observations.negative
  );

  const behavioralObservations = [
    ...observations.positive,
    ...observations.negative,
    ...observations.neutral,
  ].filter(
    (observation) =>
      !observation.wineKey.startsWith("declared:")
  );

  const uniqueWines =
    uniqueWineCount(behavioralObservations);

  const totalObservations =
    observations.positive.length +
    observations.negative.length +
    observations.neutral.length;

  const confidence =
    evidenceConfidence(observations);

  const positiveDispersion =
    positiveCenter === null
      ? null
      : weightedDispersion(
          observations.positive,
          positiveCenter
        );

  const negativeWeight =
    observations.negative.reduce(
      (sum, observation) =>
        sum + observation.weight,
      0
    );

  /*
   * L'aversion est indépendante de la préférence.
   * Un rejet ne déplace donc plus artificiellement
   * le centre des vins aimés.
   */
  const avoidanceStrength =
    negativeWeight <= 0
      ? 0
      : clamp(
          1 -
            Math.exp(
              -(
                negativeWeight +
                Math.max(
                  0,
                  uniqueWineCount(
                    observations.negative
                  ) - 1
                ) *
                  0.5
              ) /
                7
            ),
          0,
          0.95
        );

  return {
    value:
      positiveCenter === null
        ? null
        : round(
            clamp(positiveCenter, 1, 5)
          ),

    confidence: round(confidence),

    observations: totalObservations,

    uniqueWines,

    dispersion:
      positiveDispersion === null
        ? null
        : round(positiveDispersion),

    avoidedValue:
      negativeCenter === null
        ? null
        : round(
            clamp(negativeCenter, 1, 5)
          ),

    avoidanceStrength:
      round(avoidanceStrength),

    negativeObservations:
      observations.negative.length,
  };
}

function addWineObservation(
  observations: Record<
    WineDnaDimension,
    DimensionObservations
  >,
  wine: TasteWine,
  wineId: string,
  kind: "positive" | "negative" | "neutral",
  source: ObservationSource,
  baseWeight: number
): void {
  const dna = buildWineDna(wine);

  for (const dimension of dna.knownDimensions) {
    const value = dna.values[dimension];

    if (value === undefined) {
      continue;
    }

    const dimensionConfidence =
      dna.dimensionConfidence[dimension];

    const weight =
      baseWeight * dimensionConfidence;

    if (weight <= 0) {
      continue;
    }

    observations[dimension][kind].push({
      value,
      weight,
      wineKey: wineId,
      source,
    });
  }
}

export function buildTasteDna(
  input: TasteDnaInput
): TasteDna {
  const observations = Object.fromEntries(
    WINE_DNA_DIMENSIONS.map((dimension) => [
      dimension,
      {
        positive: [] as Observation[],
        negative: [] as Observation[],
        neutral: [] as Observation[],
      },
    ])
  ) as unknown as Record<
    WineDnaDimension,
    DimensionObservations
  >;

  /*
   * Préférence déclarée.
   * Elle initialise le profil, mais les comportements
   * pourront progressivement devenir plus informatifs.
   */
  const declaredBody =
    input.preferences?.bodyPreference;

  if (isScaleValue(declaredBody)) {
    observations.body.positive.push({
      value: declaredBody,
      weight: 1.5,
      wineKey: "declared:body",
      source: "declared",
    });
  }

  const positiveColorEvidence: Partial<
    Record<WineColor, number>
  > = {};

  const negativeColorEvidence: Partial<
    Record<WineColor, number>
  > = {};

  const negativeColorWines: Partial<
    Record<WineColor, Set<string>>
  > = {};

  const declaredColor =
    normalizeWineColor(
      input.preferences?.mainWineType
    );

  if (declaredColor) {
    positiveColorEvidence[declaredColor] =
      (positiveColorEvidence[declaredColor] ||
        0) + 1.5;
  }

  /*
   * Favoris :
   * signal positif réel, mais modéré.
   */
  for (const [
    index,
    favorite,
  ] of (input.favorites || []).entries()) {
    const key = wineKey(
      favorite.wine,
      `favorite:${index}`
    );

    addWineObservation(
      observations,
      favorite.wine,
      key,
      "positive",
      "favorite",
      0.75
    );

    const color = normalizeWineColor(
      favorite.wine.color
    );

    if (color) {
      positiveColorEvidence[color] =
        (positiveColorEvidence[color] || 0) +
        0.75;
    }
  }

  let likedJournalEntries = 0;
  let averageJournalEntries = 0;
  let dislikedJournalEntries = 0;
  let buyAgainEntries = 0;

  const allBehaviorWineKeys = new Set<string>();

  /*
   * Carnet :
   *
   * liked + buyAgain    = signal positif très fort
   * liked               = signal positif fort
   * average + buyAgain  = signal positif faible
   * average             = signal neutre
   * disliked            = signal négatif fort
   *
   * Un éventuel "disliked + buyAgain" est traité
   * comme négatif mais légèrement moins fortement,
   * puisqu'il contient une contradiction explicite.
   */
  for (const [
    index,
    entry,
  ] of (input.journal || []).entries()) {
    const key = wineKey(
      entry.wine,
      `journal:${index}`
    );

    allBehaviorWineKeys.add(key);

    if (entry.buyAgain) {
      buyAgainEntries++;
    }

    let kind:
      | "positive"
      | "negative"
      | "neutral";

    let weight: number;
    let source: ObservationSource;

    if (entry.appreciation === "liked") {
      likedJournalEntries++;

      kind = "positive";
      source = "journal-liked";
      weight = entry.buyAgain ? 3 : 2;
    } else if (
      entry.appreciation === "average"
    ) {
      averageJournalEntries++;
      source = "journal-average";

      if (entry.buyAgain) {
        kind = "positive";
        weight = 0.5;
      } else {
        kind = "neutral";
        weight = 0.35;
      }
    } else {
      dislikedJournalEntries++;

      kind = "negative";
      source = "journal-disliked";
      weight = entry.buyAgain ? 1.5 : 2.75;
    }

    addWineObservation(
      observations,
      entry.wine,
      key,
      kind,
      source,
      weight
    );

    const color = normalizeWineColor(
      entry.wine.color
    );

    if (color) {
      if (kind === "positive") {
        positiveColorEvidence[color] =
          (positiveColorEvidence[color] ||
            0) + weight;
      } else if (kind === "negative") {
        negativeColorEvidence[color] =
          (negativeColorEvidence[color] ||
            0) + weight;

        if (!negativeColorWines[color]) {
          negativeColorWines[color] =
            new Set<string>();
        }

        negativeColorWines[color]!.add(key);
      }
    }
  }

  const dimensions =
    {} as TasteDnaDimensions;

  for (const dimension of WINE_DNA_DIMENSIONS) {
    dimensions[dimension] =
      calculateDimension(
        observations[dimension]
      );
  }

  /*
   * Affinités couleur.
   * On conserve affinité et aversion séparément.
   */
  const colorAffinity: Partial<
    Record<WineColor, number>
  > = {};

  const maxPositiveColor =
    Math.max(
      0,
      ...Object.values(
        positiveColorEvidence
      )
    );

  if (maxPositiveColor > 0) {
    for (const [
      color,
      evidence,
    ] of Object.entries(
      positiveColorEvidence
    )) {
      colorAffinity[color as WineColor] =
        round(
          clamp(
            (evidence || 0) /
              maxPositiveColor,
            0,
            1
          )
        );
    }
  }

  const colorAvoidance: Partial<
    Record<WineColor, number>
  > = {};

  const maxNegativeColor =
    Math.max(
      0,
      ...Object.values(
        negativeColorEvidence
      )
    );

  if (maxNegativeColor > 0) {
    for (const [
      color,
      evidence,
    ] of Object.entries(
      negativeColorEvidence
    )) {
      const typedColor = color as WineColor;

      const distinctRejectedWines =
        negativeColorWines[
          typedColor
        ]?.size || 0;

      /*
       * Une bouteille rejetée nous renseigne d'abord
       * sur son style, pas sur toute sa couleur.
       *
       * 1 vin  -> aucune aversion couleur
       * 2 vins -> signal faible
       * 3 vins -> signal modéré
       * 4+     -> signal progressivement plus fort
       */
      const diversityFactor =
        distinctRejectedWines <= 1
          ? 0
          : distinctRejectedWines === 2
            ? 0.25
            : distinctRejectedWines === 3
              ? 0.55
              : Math.min(
                  1,
                  0.55 +
                    (distinctRejectedWines - 3) *
                      0.15
                );

      const normalizedEvidence =
        (evidence || 0) /
        maxNegativeColor;

      const avoidance =
        normalizedEvidence *
        diversityFactor;

      if (avoidance > 0) {
        colorAvoidance[typedColor] =
          round(
            clamp(avoidance, 0, 1)
          );
      }
    }
  }

  const exploration =
    input.preferences?.stylePreference ===
    "adventurous"
      ? 0.8
      : input.preferences?.stylePreference ===
          "classic"
        ? 0.25
        : 0.5;

  /*
   * Confiance globale :
   * moyenne des dimensions connues seulement.
   *
   * Ainsi, trois dimensions bien apprises ne sont
   * pas artificiellement diluées parce que huit autres
   * n'ont encore aucune observation.
   *
   * On applique ensuite une couverture pour éviter
   * qu'un profil très partiel paraisse complet.
   */
  const knownDimensionConfidences =
    WINE_DNA_DIMENSIONS
      .map(
        (dimension) =>
          dimensions[dimension].confidence
      )
      .filter(
        (confidence) => confidence > 0
      );

  const meanKnownConfidence =
    knownDimensionConfidences.length > 0
      ? knownDimensionConfidences.reduce(
          (sum, confidence) =>
            sum + confidence,
          0
        ) /
        knownDimensionConfidences.length
      : 0;

  const coverage =
    knownDimensionConfidences.length /
    WINE_DNA_DIMENSIONS.length;

  const overallConfidence =
    meanKnownConfidence *
    Math.sqrt(coverage);

  return {
    dimensions,
    colorAffinity,
    colorAvoidance,
    exploration,

    evidence: {
      favorites:
        input.favorites?.length || 0,

      journalEntries:
        input.journal?.length || 0,

      likedJournalEntries,
      averageJournalEntries,
      dislikedJournalEntries,
      buyAgainEntries,

      uniqueWines:
        allBehaviorWineKeys.size,
    },

    overallConfidence: round(
      clamp(overallConfidence, 0, 0.95)
    ),
  };
}
