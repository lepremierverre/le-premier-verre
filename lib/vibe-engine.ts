import {
  WINE_DNA_DIMENSIONS,
  buildWineDna,
  type WineColor,
  type WineDnaDimension,
  type WineDnaSource,
} from "./wine-dna";

export type VibeDimensionRule = {
  /**
   * Valeur idéale sur l'échelle Wine DNA 1–5.
   */
  target?: number;

  /**
   * Zone acceptable autour de la cible.
   */
  tolerance?: number;

  /**
   * Maximum souhaité lorsqu'une dimension agit
   * principalement comme garde-fou.
   */
  max?: number;

  /**
   * Minimum souhaité lorsqu'une dimension agit
   * principalement comme garde-fou.
   */
  min?: number;

  /**
   * Importance propre de cette dimension pour CE moment.
   *
   * 0 = ignorée
   * 1 = normale
   * > 1 = particulièrement importante
   */
  weight: number;

  /**
   * Si true, l'absence de cette donnée empêche
   * l'admissibilité plutôt que de simplement réduire
   * la confiance.
   */
  required?: boolean;
};

export type VibeProfile = {
  /**
   * Identifiant stable et indépendant du titre affiché.
   * Il ne doit pas changer si le wording éditorial évolue.
   */
  id: string;

  slug: string;

  title: string;
  titleEn?: string;

  description: string;
  descriptionEn?: string;

  /**
   * Couleurs admissibles lorsqu'un moment impose
   * réellement une contrainte de style.
   *
   * Absence = aucune restriction de couleur.
   */
  allowedColors?: WineColor[];

  /**
   * Contraintes contextuelles qui ne font pas partie
   * du Wine DNA sensoriel 1–5.
   *
   * Elles servent de garde-fous d'admissibilité
   * lorsqu'un moment le justifie réellement.
   */
  context?: {
    minAlcohol?: number;
    maxAlcohol?: number;

    allowedBeverageTypes?: Array<"wine" | "cider">;

    /**
     * undefined = avec ou sans alcool permis
     * true = seulement sans alcool
     * false = seulement avec alcool
     */
    alcoholFree?: boolean;
  };

  /**
   * Règles propres à ce moment.
   *
   * Une dimension absente n'entre ni dans le score
   * ni dans la confiance du Vibe Gate.
   */
  dimensions: Partial<
    Record<WineDnaDimension, VibeDimensionRule>
  >;

  /**
   * Niveau de spécificité éditoriale du moment.
   *
   * Utilisé plus tard pour choisir le seul Primary Vibe
   * d'un vin sans laisser les moments génériques
   * monopoliser le catalogue.
   *
   * 0 = très générique
   * 1 = très spécifique
   */
  specificity: number;

  /**
   * Seuils d'admissibilité propres à ce moment.
   *
   * Chaque valeur est facultative. En son absence,
   * le Vibe Gate utilise sa valeur globale par défaut.
   *
   * Ces seuils contrôlent l'admissibilité seulement.
   * Ils ne participent pas au choix du Primary Vibe.
   */
  gate?: {
    minScore?: number;
    minConfidence?: number;
    maxDistanceFromBest?: number;
  };

  /**
   * Sélections éditoriales facultatives.
   *
   * Elles ne pourront jamais créer l'admissibilité.
   */
  editorialWineIds?: string[];
};

export type VibeRecommendationWine =
  WineDnaSource & {
    _id: string;
    name?: string;
    slug?: string;

    /**
     * Données contextuelles qui ne font pas partie
     * des dimensions Wine DNA 1–5.
     */
    alcohol?: number | null;
    beverageType?: "wine" | "cider" | null;
    alcoholFree?: boolean | null;
  };

export type VibeDimensionScore = {
  dimension: WineDnaDimension;
  value?: number;
  score: number | null;
  confidence: number;
  weight: number;
  target?: number;
  tolerance?: number;
  min?: number;
  max?: number;
  required: boolean;
};

export type VibeCompatibilityResult = {
  score: number;
  confidence: number;
  adjustedScore: number;

  colorMatch: boolean | null;
  contextMatch: boolean;

  knownWeight: number;
  requiredWeight: number;

  missingRequiredDimensions: WineDnaDimension[];
  dimensions: VibeDimensionScore[];
};

const VIBE_UNCERTAIN_BASELINE = 0.58;

function vibeClamp(
  value: number,
  min = 0,
  max = 1
): number {
  return Math.max(min, Math.min(max, value));
}

function vibeRound(
  value: number,
  decimals = 3
): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function vibeTargetScore(
  value: number,
  target: number,
  tolerance = 1
): number {
  const distance = Math.abs(value - target);

  if (distance === 0) return 1;

  if (distance <= tolerance) {
    if (tolerance === 0) return 1;
    return 1 - (distance / tolerance) * 0.18;
  }

  const beyondTolerance =
    distance - tolerance;

  if (beyondTolerance <= 1) return 0.48;
  if (beyondTolerance <= 2) return 0.16;

  return 0;
}

function vibeMaximumScore(
  value: number,
  max: number
): number {
  if (value < max) return 1;
  if (value === max) return 0.88;
  if (value === max + 1) return 0.28;
  return 0;
}

function vibeMinimumScore(
  value: number,
  min: number
): number {
  if (value > min) return 1;
  if (value === min) return 0.88;
  if (value === min - 1) return 0.28;
  return 0;
}

function contextMatches(
  wine: VibeRecommendationWine,
  vibe: VibeProfile
): boolean {
  const context = vibe.context;

  if (!context) return true;

  if (
    context.allowedBeverageTypes?.length &&
    wine.beverageType &&
    !context.allowedBeverageTypes.includes(
      wine.beverageType
    )
  ) {
    return false;
  }

  if (
    typeof context.alcoholFree === "boolean" &&
    typeof wine.alcoholFree === "boolean" &&
    wine.alcoholFree !== context.alcoholFree
  ) {
    return false;
  }

  if (
    typeof context.minAlcohol === "number" &&
    typeof wine.alcohol === "number" &&
    wine.alcohol < context.minAlcohol
  ) {
    return false;
  }

  if (
    typeof context.maxAlcohol === "number" &&
    typeof wine.alcohol === "number" &&
    wine.alcohol > context.maxAlcohol
  ) {
    return false;
  }

  return true;
}

export function scoreVibeCompatibility(
  wine: VibeRecommendationWine,
  vibe: VibeProfile
): VibeCompatibilityResult {
  const dna = buildWineDna(wine);

  const dimensions: VibeDimensionScore[] = [];
  const missingRequiredDimensions:
    WineDnaDimension[] = [];

  let earned = 0;
  let knownWeight = 0;
  let requiredWeight = 0;
  let confidenceWeight = 0;

  for (const dimension of WINE_DNA_DIMENSIONS) {
    const rule = vibe.dimensions[dimension];

    if (!rule || rule.weight <= 0) {
      continue;
    }

    const weight =
      rule.weight *
      dna.dimensionWeights[dimension];

    requiredWeight += weight;

    const value = dna.values[dimension];

    if (value === undefined) {
      if (rule.required) {
        missingRequiredDimensions.push(
          dimension
        );
      }

      dimensions.push({
        dimension,
        score: null,
        confidence: 0,
        weight: vibeRound(weight),
        target: rule.target,
        tolerance: rule.tolerance,
        min: rule.min,
        max: rule.max,
        required: rule.required ?? false,
      });

      continue;
    }

    let score = 1;

    if (typeof rule.target === "number") {
      score = vibeTargetScore(
        value,
        rule.target,
        rule.tolerance ?? 1
      );
    } else if (
      typeof rule.max === "number"
    ) {
      score = vibeMaximumScore(
        value,
        rule.max
      );
    } else if (
      typeof rule.min === "number"
    ) {
      score = vibeMinimumScore(
        value,
        rule.min
      );
    }

    const observationConfidence =
      dna.dimensionConfidence[dimension];

    earned +=
      score *
      weight *
      observationConfidence;

    knownWeight +=
      weight * observationConfidence;

    confidenceWeight += weight;

    dimensions.push({
      dimension,
      value,
      score: vibeRound(score),
      confidence: vibeRound(
        observationConfidence
      ),
      weight: vibeRound(weight),
      target: rule.target,
      tolerance: rule.tolerance,
      min: rule.min,
      max: rule.max,
      required: rule.required ?? false,
    });
  }

  const hasColorRule =
    Array.isArray(vibe.allowedColors) &&
    vibe.allowedColors.length > 0;

  const colorMatch =
    !hasColorRule
      ? true
      : dna.color
        ? vibe.allowedColors!.includes(dna.color)
        : null;

  const rawScore =
    knownWeight > 0
      ? earned / knownWeight
      : 0;

  const coverage =
    requiredWeight > 0
      ? knownWeight / requiredWeight
      : 0;

  const observationQuality =
    confidenceWeight > 0
      ? knownWeight / confidenceWeight
      : 0;

  const confidence = vibeClamp(
    coverage * observationQuality
  );

  const adjustedScore =
    rawScore * confidence +
    VIBE_UNCERTAIN_BASELINE *
      (1 - confidence);

  return {
    score: vibeRound(rawScore),
    confidence: vibeRound(confidence),
    adjustedScore: vibeRound(adjustedScore),

    colorMatch,
    contextMatch: contextMatches(wine, vibe),

    knownWeight: vibeRound(knownWeight),
    requiredWeight: vibeRound(requiredWeight),

    missingRequiredDimensions,
    dimensions,
  };
}

export type VibeCandidate<
  T extends VibeRecommendationWine =
    VibeRecommendationWine
> = VibeCompatibilityResult & {
  wine: T;
  rank: number;
  eligible: boolean;
  distanceFromBest: number;

  rejectionReason:
    | "color"
    | "context"
    | "required_data"
    | "confidence"
    | "absolute_score"
    | "relative_score"
    | null;
};

export type VibeCandidatePool<
  T extends VibeRecommendationWine =
    VibeRecommendationWine
> = {
  candidates: VibeCandidate<T>[];
  eligible: VibeCandidate<T>[];
  rejected: VibeCandidate<T>[];

  bestAdjustedScore: number;

  diagnostics: {
    total: number;
    eligible: number;
    rejectedColor: number;
    rejectedContext: number;
    rejectedRequiredData: number;
    rejectedConfidence: number;
    rejectedAbsoluteScore: number;
    rejectedRelativeScore: number;
  };
};

/**
 * Seuils V1 provisoires.
 *
 * Ils servent à tester le comportement du Gate sur le
 * catalogue réel. Ils seront calibrés avant de devenir
 * des constantes de production.
 */
const MIN_VIBE_SCORE = 0.8;
const MIN_VIBE_CONFIDENCE = 0.7;
const MAX_VIBE_DISTANCE_FROM_BEST = 0.1;

export function buildVibeCandidatePool<
  T extends VibeRecommendationWine
>(
  wines: T[],
  vibe: VibeProfile
): VibeCandidatePool<T> {
  const minScore =
    vibe.gate?.minScore ??
    MIN_VIBE_SCORE;

  const minConfidence =
    vibe.gate?.minConfidence ??
    MIN_VIBE_CONFIDENCE;

  const maxDistanceFromBest =
    vibe.gate?.maxDistanceFromBest ??
    MAX_VIBE_DISTANCE_FROM_BEST;

  const scored = wines
    .map((wine) => ({
      wine,
      ...scoreVibeCompatibility(
        wine,
        vibe
      ),
    }))
    .sort((a, b) => {
      if (
        b.adjustedScore !==
        a.adjustedScore
      ) {
        return (
          b.adjustedScore -
          a.adjustedScore
        );
      }

      if (
        b.confidence !==
        a.confidence
      ) {
        return (
          b.confidence -
          a.confidence
        );
      }

      return (a.wine.name ?? "")
        .localeCompare(
          b.wine.name ?? "",
          "fr"
        );
    });

  /**
   * Seuls les candidats dont les garde-fous
   * fondamentaux sont confirmés peuvent fixer
   * le meilleur score de référence.
   */
  const reliableForBenchmark =
    scored.filter(
      (item) =>
        item.colorMatch !== false &&
        item.colorMatch !== null &&
        item.contextMatch &&
        item.missingRequiredDimensions
          .length === 0 &&
        item.confidence >=
          minConfidence
    );

  const bestAdjustedScore =
    reliableForBenchmark[0]
      ?.adjustedScore ?? 0;

  const diagnostics = {
    total: scored.length,
    eligible: 0,
    rejectedColor: 0,
    rejectedContext: 0,
    rejectedRequiredData: 0,
    rejectedConfidence: 0,
    rejectedAbsoluteScore: 0,
    rejectedRelativeScore: 0,
  };

  const candidates =
    scored.map(
      (item, index): VibeCandidate<T> => {
        const distanceFromBest =
          bestAdjustedScore > 0
            ? Math.max(
                0,
                bestAdjustedScore -
                  item.adjustedScore
              )
            : 1;

        let eligible = true;
        let rejectionReason:
          VibeCandidate<T>["rejectionReason"] =
          null;

        /**
         * Ordre volontaire :
         * un candidat rejeté appartient à une seule
         * catégorie diagnostique.
         */
        if (
          item.colorMatch === false ||
          item.colorMatch === null
        ) {
          eligible = false;
          rejectionReason = "color";
          diagnostics.rejectedColor += 1;
        } else if (!item.contextMatch) {
          eligible = false;
          rejectionReason = "context";
          diagnostics.rejectedContext += 1;
        } else if (
          item.missingRequiredDimensions
            .length > 0
        ) {
          eligible = false;
          rejectionReason = "required_data";
          diagnostics.rejectedRequiredData += 1;
        } else if (
          item.confidence <
          minConfidence
        ) {
          eligible = false;
          rejectionReason = "confidence";
          diagnostics.rejectedConfidence += 1;
        } else if (
          item.adjustedScore <
          minScore
        ) {
          eligible = false;
          rejectionReason = "absolute_score";
          diagnostics.rejectedAbsoluteScore += 1;
        } else if (
          distanceFromBest >
          maxDistanceFromBest
        ) {
          eligible = false;
          rejectionReason = "relative_score";
          diagnostics.rejectedRelativeScore += 1;
        } else {
          diagnostics.eligible += 1;
        }

        return {
          ...item,
          rank: index + 1,
          eligible,
          distanceFromBest:
            vibeRound(distanceFromBest),
          rejectionReason,
        };
      }
    );

  const eligible = candidates
    .filter((item) => item.eligible)
    .map((item, index) => ({
      ...item,
      rank: index + 1,
    }));

  return {
    candidates,

    eligible,

    rejected: candidates.filter(
      (item) => !item.eligible
    ),

    bestAdjustedScore:
      vibeRound(bestAdjustedScore),

    diagnostics,
  };
}
