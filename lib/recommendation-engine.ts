import {
  WINE_DNA_DIMENSIONS,
  buildWineDna,
  type WineDnaDimension,
  type WineDnaSource,
  type WineColor,
} from "./wine-dna";

import type {
  TasteDna,
  TasteDnaDimension,
} from "./taste-dna";

export type RecommendationWine = WineDnaSource & {
  _id: string;
  name?: string;
  color?: WineColor | string | null;
};

export type RecommendationFood = {
  _id?: string;
  name?: string;

  recommendedColors?: string[];

  bodyTarget?: number;
  bodyTolerance?: number;

  sweetnessTarget?: number;
  sweetnessTolerance?: number;

  roundnessTarget?: number;
  roundnessTolerance?: number;

  acidityTarget?: number;
  acidityTolerance?: number;

  tanninsMax?: number;

  fruitIntensityTarget?: number;
  fruitIntensityTolerance?: number;

  mineralityTarget?: number;
  mineralityTolerance?: number;

  intensityTarget?: number;
  intensityTolerance?: number;

  complexityTarget?: number;
  complexityTolerance?: number;

  oakInfluenceMax?: number;

  savoryTarget?: number;
  savoryTolerance?: number;

  editorialWineIds?: string[];
};

export type FoodDimensionScore = {
  dimension: WineDnaDimension;
  score: number | null;
  confidence: number;
  weight: number;
  target?: number;
  tolerance?: number;
  max?: number;
  value?: number;
};

export type FoodCompatibilityResult = {
  score: number;
  confidence: number;
  adjustedScore: number;

  colorMatch: boolean | null;

  knownWeight: number;
  requiredWeight: number;

  dimensions: FoodDimensionScore[];

  editorialSelected: boolean;
};

const FOOD_WEIGHTS: Record<
  WineDnaDimension,
  number
> = {
  body: 1,
  sweetness: 0.9,
  roundness: 0.85,
  acidity: 1.15,
  tannins: 0.9,
  fruitIntensity: 0.75,
  minerality: 0.7,
  intensity: 0.9,
  complexity: 0.55,
  oakInfluence: 0.7,
  savory: 0.7,
};

const COLOR_WEIGHT = 1.35;

/*
 * Valeur vers laquelle un résultat insuffisamment
 * documenté est ramené.
 *
 * On ne punit pas un vin parce qu'une donnée manque,
 * mais on refuse également de lui attribuer un score
 * exceptionnel avec une faible quantité d'information.
 */
const UNCERTAIN_BASELINE = 0.58;

function clamp(
  value: number,
  min = 0,
  max = 1
): number {
  return Math.max(min, Math.min(max, value));
}

function round(
  value: number,
  decimals = 3
): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function targetScore(
  value: number,
  target: number,
  tolerance = 1
): number {
  const distance = Math.abs(value - target);

  if (distance === 0) return 1;

  if (distance <= tolerance) {
    if (tolerance === 0) return 1;

    /*
     * À l'intérieur de la tolérance, la baisse
     * est progressive plutôt qu'en marches fixes.
     */
    return 1 - (distance / tolerance) * 0.18;
  }

  const beyondTolerance =
    distance - tolerance;

  if (beyondTolerance <= 1) return 0.48;
  if (beyondTolerance <= 2) return 0.16;

  return 0;
}

function maximumScore(
  value: number,
  max: number
): number {
  if (value < max) return 1;
  if (value === max) return 0.88;
  if (value === max + 1) return 0.28;

  return 0;
}

function targetForDimension(
  food: RecommendationFood,
  dimension: WineDnaDimension
): {
  target?: number;
  tolerance?: number;
  max?: number;
} {
  switch (dimension) {
    case "body":
      return {
        target: food.bodyTarget,
        tolerance: food.bodyTolerance,
      };

    case "sweetness":
      return {
        target: food.sweetnessTarget,
        tolerance: food.sweetnessTolerance,
      };

    case "roundness":
      return {
        target: food.roundnessTarget,
        tolerance: food.roundnessTolerance,
      };

    case "acidity":
      return {
        target: food.acidityTarget,
        tolerance: food.acidityTolerance,
      };

    case "tannins":
      return {
        max: food.tanninsMax,
      };

    case "fruitIntensity":
      return {
        target: food.fruitIntensityTarget,
        tolerance:
          food.fruitIntensityTolerance,
      };

    case "minerality":
      return {
        target: food.mineralityTarget,
        tolerance: food.mineralityTolerance,
      };

    case "intensity":
      return {
        target: food.intensityTarget,
        tolerance: food.intensityTolerance,
      };

    case "complexity":
      return {
        target: food.complexityTarget,
        tolerance: food.complexityTolerance,
      };

    case "oakInfluence":
      return {
        max: food.oakInfluenceMax,
      };

    case "savory":
      return {
        target: food.savoryTarget,
        tolerance: food.savoryTolerance,
      };
  }
}

function ruleExists(
  rule: {
    target?: number;
    max?: number;
  }
): boolean {
  return (
    typeof rule.target === "number" ||
    typeof rule.max === "number"
  );
}

export function scoreFoodCompatibility(
  wine: RecommendationWine,
  food: RecommendationFood
): FoodCompatibilityResult {
  const dna = buildWineDna(wine);

  const dimensions: FoodDimensionScore[] =
    [];

  let earned = 0;
  let knownWeight = 0;
  let requiredWeight = 0;
  let confidenceWeight = 0;

  for (const dimension of WINE_DNA_DIMENSIONS) {
    const rule = targetForDimension(
      food,
      dimension
    );

    if (!ruleExists(rule)) {
      continue;
    }

    /*
     * Le poids Food DNA est combiné à la pertinence
     * de cette dimension pour le type de vin.
     */
    const weight =
      FOOD_WEIGHTS[dimension] *
      dna.dimensionWeights[dimension];

    requiredWeight += weight;

    const value = dna.values[dimension];

    if (value === undefined) {
      dimensions.push({
        dimension,
        score: null,
        confidence: 0,
        weight: round(weight),
        target: rule.target,
        tolerance: rule.tolerance,
        max: rule.max,
      });

      continue;
    }

    let score: number;

    if (typeof rule.max === "number") {
      score = maximumScore(
        value,
        rule.max
      );
    } else {
      score = targetScore(
        value,
        rule.target!,
        rule.tolerance ?? 1
      );
    }

    const observationConfidence =
      dna.dimensionConfidence[dimension];

    /*
     * Le score brut mesure la compatibilité.
     * La confiance mesure la qualité de la preuve.
     */
    earned +=
      score *
      weight *
      observationConfidence;

    knownWeight +=
      weight * observationConfidence;

    confidenceWeight += weight;

    dimensions.push({
      dimension,
      score: round(score),
      confidence: round(
        observationConfidence
      ),
      weight: round(weight),
      value,
      target: rule.target,
      tolerance: rule.tolerance,
      max: rule.max,
    });
  }

  /*
   * Couleur : règle Food DNA distincte des 11 dimensions.
   */
  const hasColorRule =
    Array.isArray(food.recommendedColors) &&
    food.recommendedColors.length > 0;

  let colorMatch: boolean | null = null;
  let colorScore: number | null = null;

  if (hasColorRule && dna.color) {
    requiredWeight += COLOR_WEIGHT;
    knownWeight += COLOR_WEIGHT;
    confidenceWeight += COLOR_WEIGHT;

    colorMatch =
      food.recommendedColors!.includes(
        dna.color
      );

    colorScore = colorMatch ? 1 : 0.05;

    earned += colorScore * COLOR_WEIGHT;
  } else if (hasColorRule) {
    requiredWeight += COLOR_WEIGHT;
  }

  const rawScore =
    knownWeight > 0
      ? earned / knownWeight
      : 0;

  /*
   * Couverture :
   * quelle proportion des critères utiles au plat
   * possède réellement des données fiables?
   */
  const coverage =
    requiredWeight > 0
      ? knownWeight / requiredWeight
      : 0;

  /*
   * Qualité moyenne des observations présentes.
   */
  const observationQuality =
    confidenceWeight > 0
      ? knownWeight / confidenceWeight
      : 0;

  const confidence = clamp(
    coverage * observationQuality
  );

  /*
   * Shrinkage vers une valeur neutre lorsque
   * la confiance est faible.
   *
   * Exemple :
   * score brut 0.95, confiance 0.40
   * ne devient PAS 95%.
   */
  const adjustedScore =
    rawScore * confidence +
    UNCERTAIN_BASELINE *
      (1 - confidence);

  /*
   * Garde-fou Food DNA.
   *
   * Pour être candidat à une recommandation
   * personnalisée :
   * - la compatibilité alimentaire doit être
   *   raisonnable;
   * - et nous devons avoir assez d'information.
   *
   * Ce seuil servira de porte d'entrée.
   * Taste DNA ne pourra pas le contourner.
   */  const editorialSelected =
    food.editorialWineIds?.includes(
      wine._id
    ) ?? false;

  return {
    score: round(rawScore),
    confidence: round(confidence),
    adjustedScore: round(adjustedScore),

    colorMatch,

    knownWeight: round(knownWeight),
    requiredWeight: round(requiredWeight),

    dimensions,

    editorialSelected,
  };
}

export type FoodCandidate<
  T extends RecommendationWine =
    RecommendationWine
> = FoodCompatibilityResult & {
  wine: T;
  rank: number;
  eligible: boolean;
  distanceFromBest: number;
};

export type FoodCandidatePool<
  T extends RecommendationWine =
    RecommendationWine
> = {
  candidates: FoodCandidate<T>[];
  eligible: FoodCandidate<T>[];
  rejected: FoodCandidate<T>[];

  bestAdjustedScore: number;

  diagnostics: {
    total: number;
    eligible: number;
    rejectedColor: number;
    rejectedConfidence: number;
    rejectedAbsoluteScore: number;
    rejectedRelativeScore: number;
  };
};

const MIN_FOOD_SCORE = 0.8;
const MIN_FOOD_CONFIDENCE = 0.7;
const MAX_DISTANCE_FROM_BEST = 0.1;

export function buildFoodCandidatePool<
  T extends RecommendationWine
>(
  wines: T[],
  food: RecommendationFood
): FoodCandidatePool<T> {
  const scored = wines
    .map((wine) => ({
      wine,
      ...scoreFoodCompatibility(
        wine,
        food
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

  const colorCompatible =
    scored.filter(
      (item) =>
        item.colorMatch !== false
    );

  /*
   * Le meilleur score de référence doit lui-même
   * provenir d'un candidat suffisamment fiable.
   *
   * Sinon un vin peu documenté pourrait fixer
   * artificiellement la barre pour tout le catalogue.
   */
  const reliableForBenchmark =
    colorCompatible.filter(
      (item) =>
        item.confidence >=
        MIN_FOOD_CONFIDENCE
    );

  const bestAdjustedScore =
    reliableForBenchmark[0]
      ?.adjustedScore ?? 0;

  const diagnostics = {
    total: scored.length,
    eligible: 0,
    rejectedColor: 0,
    rejectedConfidence: 0,
    rejectedAbsoluteScore: 0,
    rejectedRelativeScore: 0,
  };

  const candidates =
    scored.map(
      (item, index): FoodCandidate<T> => {
        const distanceFromBest =
          bestAdjustedScore > 0
            ? Math.max(
                0,
                bestAdjustedScore -
                  item.adjustedScore
              )
            : 1;

        let eligible = true;

        /*
         * Les raisons sont évaluées dans un ordre
         * volontaire : chaque vin est compté dans
         * une seule catégorie diagnostique.
         */
        if (item.colorMatch === false) {
          eligible = false;
          diagnostics.rejectedColor += 1;
        } else if (
          item.confidence <
          MIN_FOOD_CONFIDENCE
        ) {
          eligible = false;
          diagnostics.rejectedConfidence += 1;
        } else if (
          item.adjustedScore <
          MIN_FOOD_SCORE
        ) {
          eligible = false;
          diagnostics.rejectedAbsoluteScore += 1;
        } else if (
          Math.round(distanceFromBest * 100) >
          Math.round(MAX_DISTANCE_FROM_BEST * 100)
        ) {
          eligible = false;
          diagnostics.rejectedRelativeScore += 1;
        } else {
          diagnostics.eligible += 1;
        }

        return {
          ...item,
          rank: index + 1,
          eligible,
          distanceFromBest:
            round(distanceFromBest),
        };
      }
    );

  return {
    candidates,

    eligible: candidates.filter(
      (item) => item.eligible
    ),

    rejected: candidates.filter(
      (item) => !item.eligible
    ),

    bestAdjustedScore:
      round(bestAdjustedScore),

    diagnostics,
  };
}


export type TasteDimensionScore = {
  dimension: WineDnaDimension;

  wineValue: number;

  preferenceValue: number | null;
  preferenceConfidence: number;

  affinity: number | null;

  avoidedValue: number | null;
  avoidanceStrength: number;
  aversionPenalty: number;

  dispersion: number | null;

  weight: number;
};

export type TasteCompatibilityResult = {
  affinityScore: number;
  aversionPenalty: number;
  colorAffinity: number;
  colorAvoidance: number;

  score: number;
  confidence: number;

  dimensions: TasteDimensionScore[];

  evidenceDimensions: number;
};

/*
 * Poids de départ de Taste DNA.
 *
 * Ils ne cherchent pas à reproduire Food DNA :
 * ici on mesure ce que la personne aime,
 * pas ce qui convient au plat.
 */
const TASTE_WEIGHTS: Record<
  WineDnaDimension,
  number
> = {
  body: 1,
  sweetness: 0.9,
  roundness: 0.9,
  acidity: 1,
  tannins: 0.8,
  fruitIntensity: 0.9,
  minerality: 0.75,
  intensity: 0.9,
  complexity: 0.65,
  oakInfluence: 0.7,
  savory: 0.75,
};

function tasteAffinityForDimension(
  wineValue: number,
  taste: TasteDnaDimension
): number | null {
  if (taste.value === null) {
    return null;
  }

  const distance = Math.abs(
    wineValue - taste.value
  );

  /*
   * Une dispersion élevée signifie que la personne
   * apprécie naturellement une plage plus large.
   *
   * Minimum 0.75 :
   * même avec peu de dispersion, on ne transforme
   * jamais le goût appris en cible ultra-rigide.
   */
  const preferenceWidth = Math.max(
    0.75,
    0.75 + (taste.dispersion ?? 0)
  );

  /*
   * Courbe douce :
   * 1 au centre, puis décroissance progressive.
   *
   * Une personne aux goûts variés conserve donc
   * une bonne affinité sur une plage plus large.
   */
  const normalizedDistance =
    distance / preferenceWidth;

  return Math.exp(
    -0.5 *
      normalizedDistance *
      normalizedDistance
  );
}

function tasteAversionForDimension(
  wineValue: number,
  taste: TasteDnaDimension
): number {
  if (
    taste.avoidedValue === null ||
    taste.avoidanceStrength <= 0
  ) {
    return 0;
  }

  const distance = Math.abs(
    wineValue - taste.avoidedValue
  );

  /*
   * Une aversion doit être locale.
   *
   * Rejeter un rouge de corps 5 ne signifie pas
   * rejeter tous les rouges ni tous les vins
   * relativement structurés.
   */
  const proximity = Math.exp(
    -0.5 *
      Math.pow(distance / 0.9, 2)
  );

  return (
    proximity *
    taste.avoidanceStrength
  );
}

export function scoreTasteCompatibility(
  wine: RecommendationWine,
  taste: TasteDna
): TasteCompatibilityResult {
  const dna = buildWineDna(wine);

  const dimensions: TasteDimensionScore[] =
    [];

  let affinityEarned = 0;
  let affinityWeight = 0;

  let aversionEarned = 0;
  let aversionWeight = 0;

  let confidenceEarned = 0;
  let confidenceWeight = 0;

  let evidenceDimensions = 0;

  for (const dimension of WINE_DNA_DIMENSIONS) {
    const wineValue =
      dna.values[dimension];

    if (wineValue === undefined) {
      continue;
    }

    const tasteDimension =
      taste.dimensions[dimension];

    const baseWeight =
      TASTE_WEIGHTS[dimension] *
      dna.dimensionWeights[dimension];

    const wineConfidence =
      dna.dimensionConfidence[dimension];

    const preferenceConfidence =
      tasteDimension.confidence;

    const affinity =
      tasteAffinityForDimension(
        wineValue,
        tasteDimension
      );

    const aversionPenalty =
      tasteAversionForDimension(
        wineValue,
        tasteDimension
      );

    /*
     * Une préférence peu documentée ne doit pas
     * peser autant qu'une préférence bien apprise.
     */
    if (
      affinity !== null &&
      preferenceConfidence > 0
    ) {
      const effectiveWeight =
        baseWeight *
        wineConfidence *
        preferenceConfidence;

      affinityEarned +=
        affinity * effectiveWeight;

      affinityWeight += effectiveWeight;

      confidenceEarned +=
        preferenceConfidence *
        baseWeight *
        wineConfidence;

      confidenceWeight +=
        baseWeight * wineConfidence;

      evidenceDimensions += 1;
    }

    /*
     * L'aversion possède sa propre force.
     * Elle ne dépend pas de l'existence d'un centre
     * positif sur la même dimension.
     */
    if (aversionPenalty > 0) {
      const effectiveAversionWeight =
        baseWeight *
        wineConfidence;

      aversionEarned +=
        aversionPenalty *
        effectiveAversionWeight;

      aversionWeight +=
        effectiveAversionWeight;
    }

    dimensions.push({
      dimension,

      wineValue,

      preferenceValue:
        tasteDimension.value,

      preferenceConfidence:
        round(preferenceConfidence),

      affinity:
        affinity === null
          ? null
          : round(affinity),

      avoidedValue:
        tasteDimension.avoidedValue,

      avoidanceStrength:
        round(
          tasteDimension.avoidanceStrength
        ),

      aversionPenalty:
        round(aversionPenalty),

      dispersion:
        tasteDimension.dispersion,

      weight:
        round(baseWeight),
    });
  }

  const dimensionAffinity =
    affinityWeight > 0
      ? affinityEarned / affinityWeight
      : 0.5;

  const dimensionAversion =
    aversionWeight > 0
      ? aversionEarned / aversionWeight
      : 0;

  /*
   * Couleur :
   * signal distinct des dimensions sensorielles.
   */
  const wineColor = dna.color;

  const colorAffinity =
    wineColor
      ? taste.colorAffinity[wineColor] ?? 0
      : 0;

  const colorAvoidance =
    wineColor
      ? taste.colorAvoidance[wineColor] ?? 0
      : 0;

  /*
   * La couleur influence le goût, mais ne doit pas
   * écraser les dimensions sensorielles.
   */
  const hasPositiveColorEvidence =
    Object.values(
      taste.colorAffinity
    ).some(
      (value) =>
        typeof value === "number" &&
        value > 0
    );

  const hasNegativeColorEvidence =
    Object.values(
      taste.colorAvoidance
    ).some(
      (value) =>
        typeof value === "number" &&
        value > 0
    );

  /*
   * La présence d'une préférence couleur appartient
   * au profil utilisateur, pas au vin évalué.
   *
   * Exemple :
   * si l'utilisateur déclare préférer le blanc,
   * un rouge avec une excellente proximité de corps
   * ne doit pas recevoir exactement le même score
   * qu'un blanc équivalent.
   *
   * La couleur reste toutefois un signal secondaire :
   * elle réordonne, elle ne devient pas un filtre.
   */
  const combinedAffinity =
    hasPositiveColorEvidence
      ? dimensionAffinity * 0.85 +
        colorAffinity * 0.15
      : dimensionAffinity;

  const effectiveColorAvoidance =
    hasNegativeColorEvidence
      ? colorAvoidance
      : 0;

  /*
   * Aversion :
   * pénalité séparée et plafonnée.
   *
   * On évite qu'une seule observation négative
   * fasse disparaître complètement un candidat
   * pourtant excellent avec le plat.
   */
  const combinedAversion =
    clamp(
      dimensionAversion * 0.8 +
        effectiveColorAvoidance * 0.2,
      0,
      0.75
    );

  const score =
    clamp(
      combinedAffinity *
        (1 - combinedAversion),
      0,
      1
    );

  const dimensionConfidence =
    confidenceWeight > 0
      ? confidenceEarned /
        confidenceWeight
      : 0;

  /*
   * La confiance du scorer dépend à la fois :
   * - des dimensions réellement pertinentes
   *   pour ce vin;
   * - de la confiance globale du profil.
   */
  const confidence =
    clamp(
      dimensionConfidence * 0.7 +
        taste.overallConfidence * 0.3,
      0,
      0.95
    );

  return {
    affinityScore:
      round(combinedAffinity),

    aversionPenalty:
      round(combinedAversion),

    colorAffinity:
      round(colorAffinity),

    colorAvoidance:
      round(colorAvoidance),

    score:
      round(score),

    confidence:
      round(confidence),

    dimensions,

    evidenceDimensions,
  };
}

export type PersonalizedFoodCandidate<
  T extends RecommendationWine =
    RecommendationWine
> = FoodCandidate<T> & {
  taste: TasteCompatibilityResult;

  foodComponent: number;
  tasteComponent: number;

  personalizationStrength: number;

  finalScore: number;
  personalizedRank: number;
};

export type PersonalizedFoodPool<
  T extends RecommendationWine =
    RecommendationWine
> = {
  candidates: PersonalizedFoodCandidate<T>[];

  foodPool: FoodCandidatePool<T>;

  personalizationStrength: number;

  diagnostics: {
    eligibleFoodCandidates: number;
    tasteConfidence: number;
    personalizationStrength: number;
  };
};

/*
 * Taste DNA ne peut jamais remplacer Food DNA.
 *
 * Sa force augmente progressivement avec la
 * confiance réellement acquise sur l'utilisateur.
 *
 * Même avec un profil extrêmement documenté,
 * Food DNA conserve la majorité du score.
 */
function personalizationStrength(
  taste: TasteDna
): number {
  const confidence = clamp(
    taste.overallConfidence,
    0,
    0.95
  );

  /*
   * Courbe progressive :
   *
   * confiance faible  -> presque Food seul
   * confiance moyenne -> personnalisation visible
   * confiance forte   -> personnalisation importante
   *
   * Maximum : 35 % du classement.
   */
  return 0.35 * Math.pow(confidence, 0.85);
}

export function buildPersonalizedFoodPool<
  T extends RecommendationWine
>(
  wines: T[],
  food: RecommendationFood,
  taste: TasteDna
): PersonalizedFoodPool<T> {
  const foodPool =
    buildFoodCandidatePool(
      wines,
      food
    );

  const strength =
    personalizationStrength(taste);

  /*
   * RÈGLE CENTRALE :
   *
   * seuls les vins admis par Food Gate
   * peuvent entrer dans le classement
   * personnalisé.
   */
  const candidates =
    foodPool.eligible
      .map((candidate) => {
        const tasteResult =
          scoreTasteCompatibility(
            candidate.wine,
            taste
          );

        /*
         * On utilise le score Taste comme signal,
         * mais son influence réelle dépend de la
         * confiance globale du profil.
         */
        const foodComponent =
          candidate.adjustedScore *
          (1 - strength);

        const tasteComponent =
          tasteResult.score *
          strength;

        const finalScore =
          foodComponent +
          tasteComponent;

        return {
          ...candidate,

          taste: tasteResult,

          foodComponent:
            round(foodComponent),

          tasteComponent:
            round(tasteComponent),

          personalizationStrength:
            round(strength),

          finalScore:
            round(finalScore),

          personalizedRank: 0,
        };
      })
      .sort((a, b) => {
        if (
          b.finalScore !==
          a.finalScore
        ) {
          return (
            b.finalScore -
            a.finalScore
          );
        }

        /*
         * En cas d'égalité :
         * Food DNA reste prioritaire.
         */
        if (
          b.adjustedScore !==
          a.adjustedScore
        ) {
          return (
            b.adjustedScore -
            a.adjustedScore
          );
        }

        /*
         * Dernier départage :
         * conserver l'ordre original du Food Gate.
         *
         * Cela garantit notamment que lorsque
         * personalizationStrength === 0,
         * la personnalisation est une véritable
         * fonction identité.
         */
        return a.rank - b.rank;
      })
      .map((candidate, index) => ({
        ...candidate,
        personalizedRank:
          index + 1,
      }));

  return {
    candidates,

    foodPool,

    personalizationStrength:
      round(strength),

    diagnostics: {
      eligibleFoodCandidates:
        foodPool.eligible.length,

      tasteConfidence:
        round(
          taste.overallConfidence
        ),

      personalizationStrength:
        round(strength),
    },
  };
}

/*
 * ============================================================
 * EDITORIAL LPV — V1
 * ============================================================
 *
 * Le signal éditorial représente un choix humain de LPV.
 *
 * PRINCIPES :
 *
 * 1. Il ne crée jamais l'admissibilité.
 *    Food Gate reste l'unique porte d'entrée.
 *
 * 2. Il ne constitue jamais une liste fixe.
 *    Tous les vins du catalogue sont évalués dynamiquement.
 *
 * 3. Il agit comme signal d'expertise léger.
 *    Un nouveau vin mieux adapté peut donc automatiquement
 *    dépasser une ancienne sélection LPV.
 *
 * 4. Plus un vin est éloigné du meilleur accord Food,
 *    moins le signal éditorial peut l'aider.
 */

export type EditorialSignalResult = {
  selected: boolean;
  strength: number;
  bonus: number;
};

const MAX_EDITORIAL_BONUS = 0.005;

export function scoreEditorialSignal(
  candidate: FoodCandidate
): EditorialSignalResult {
  if (!candidate.editorialSelected) {
    return {
      selected: false,
      strength: 0,
      bonus: 0,
    };
  }

  /*
   * distanceFromBest est calculée par Food Gate.
   *
   * 0.00 → sélection éditoriale parmi les meilleurs accords
   * 0.10 → sélection éditoriale à la limite du pool
   *
   * Le signal décroît progressivement avec cette distance.
   */
  const foodProximity =
    clamp(
      1 -
        candidate.distanceFromBest /
          MAX_DISTANCE_FROM_BEST,
      0,
      1
    );

  /*
   * Même un choix éditorial situé plus bas dans le pool
   * conserve un petit signal, mais jamais assez important
   * pour transformer l'éditorial en verrou.
   */
  const strength =
    0.35 +
    0.65 * foodProximity;

  const bonus =
    MAX_EDITORIAL_BONUS *
    strength;

  return {
    selected: true,
    strength:
      round(strength),
    bonus:
      round(bonus),
  };
}

/*
 * ============================================================
 * FOOD × TASTE × EDITORIAL — V1 EXPÉRIMENTAL
 * ============================================================
 *
 * Ordre d'autorité :
 *
 * 1. Food Gate décide quels vins peuvent être recommandés.
 * 2. Taste DNA personnalise uniquement ces vins admissibles.
 * 3. Editorial LPV agit comme léger signal de départage.
 *
 * IMPORTANT :
 * food.wines n'est jamais une liste fermée.
 * Tous les vins reçus par le moteur sont évalués.
 */

export type EditorialPersonalizedFoodCandidate<
  T extends RecommendationWine =
    RecommendationWine
> = PersonalizedFoodCandidate<T> & {
  editorial: EditorialSignalResult;
  editorialComponent: number;
  editorialFinalScore: number;
  editorialPersonalizedRank: number;
};

export type EditorialPersonalizedFoodPool<
  T extends RecommendationWine =
    RecommendationWine
> = {
  candidates:
    EditorialPersonalizedFoodCandidate<T>[];

  personalizedPool:
    PersonalizedFoodPool<T>;

  diagnostics: {
    eligibleFoodCandidates: number;
    editorialCandidates: number;
    personalizationStrength: number;
  };
};

export function buildEditorialPersonalizedFoodPool<
  T extends RecommendationWine
>(
  wines: T[],
  food: RecommendationFood,
  taste: TasteDna
): EditorialPersonalizedFoodPool<T> {
  /*
   * Le moteur personnalisé construit d'abord son pool
   * à partir du catalogue COMPLET reçu dans `wines`.
   *
   * Editorial n'ajoute ni ne retire aucun candidat.
   */
  const personalizedPool =
    buildPersonalizedFoodPool(
      wines,
      food,
      taste
    );

  const candidates =
    personalizedPool.candidates
      .map((candidate) => {
        const editorial =
          scoreEditorialSignal(candidate);

        /*
         * Le bonus éditorial est ajouté APRÈS
         * Food + Taste.
         *
         * Il reste volontairement minuscule :
         * maximum 0,5 point.
         */
        const editorialComponent =
          editorial.bonus;

        const editorialFinalScore =
          candidate.finalScore +
          editorialComponent;

        return {
          ...candidate,

          editorial,

          editorialComponent:
            round(editorialComponent),

          editorialFinalScore:
            round(editorialFinalScore),

          editorialPersonalizedRank: 0,
        };
      })
      .sort((a, b) => {
        if (
          b.editorialFinalScore !==
          a.editorialFinalScore
        ) {
          return (
            b.editorialFinalScore -
            a.editorialFinalScore
          );
        }

        /*
         * Si Editorial ne départage pas réellement
         * les vins, conserver le classement Food × Taste.
         */
        return (
          a.personalizedRank -
          b.personalizedRank
        );
      })
      .map((candidate, index) => ({
        ...candidate,
        editorialPersonalizedRank:
          index + 1,
      }));

  return {
    candidates,

    personalizedPool,

    diagnostics: {
      eligibleFoodCandidates:
        personalizedPool.candidates.length,

      editorialCandidates:
        candidates.filter(
          (candidate) =>
            candidate.editorial.selected
        ).length,

      personalizationStrength:
        personalizedPool
          .personalizationStrength,
    },
  };
}

/*
 * ============================================================
 * EXPLORATION CONTRÔLÉE — V1
 * ============================================================
 *
 * L'exploration ne cherche jamais à recommander
 * un vin moins compatible avec le plat.
 *
 * Food Gate reste souverain.
 *
 * Elle agit uniquement comme léger signal de découverte
 * parmi les candidats déjà admissibles.
 *
 * PRINCIPES :
 *
 * 1. Aucun hasard.
 *    Même entrée = même résultat.
 *
 * 2. Aucun candidat rejeté par Food Gate
 *    ne peut être récupéré par Exploration.
 *
 * 3. Le niveau d'exploration vient du Taste DNA :
 *    classic      ≈ faible
 *    neutral      ≈ moyen
 *    adventurous  ≈ élevé
 *
 * 4. On ne récompense pas la différence maximale.
 *    On cherche une distance de découverte raisonnable.
 *
 * 5. Le bonus reste volontairement faible.
 *    Exploration départage; elle ne gouverne pas.
 */

export type ExplorationSignalResult = {
  enabled: boolean;

  /*
   * Distance moyenne entre le vin et les préférences
   * connues du Taste DNA.
   *
   * 0 = très familier
   * 1 = très éloigné
   */
  novelty: number;

  /*
   * Zone de découverte recherchée selon le profil.
   */
  targetNovelty: number;

  /*
   * Qualité de la découverte :
   * 1 lorsque novelty est proche de targetNovelty.
   */
  discoveryFit: number;

  /*
   * Force globale de l'exploration utilisateur.
   */
  explorationStrength: number;

  /*
   * Bonus final ajouté au classement.
   */
  bonus: number;

  evidenceDimensions: number;
};

const MAX_EXPLORATION_BONUS = 0.004;

function explorationTarget(
  exploration: number
): number {
  /*
   * Profil classique :
   * découverte près de ses goûts connus.
   *
   * Profil aventureux :
   * découverte plus éloignée, mais jamais
   * recherche de différence maximale.
   */
  return (
    0.18 +
    0.42 *
      clamp(exploration, 0, 1)
  );
}

export function scoreExplorationSignal(
  candidate: PersonalizedFoodCandidate,
  taste: TasteDna
): ExplorationSignalResult {
  /*
   * Sans véritable Taste DNA appris,
   * on ne prétend pas savoir ce qui constitue
   * une découverte pour cette personne.
   */
  if (
    taste.overallConfidence <= 0 ||
    candidate.taste.evidenceDimensions <= 0
  ) {
    return {
      enabled: false,
      novelty: 0,
      targetNovelty: 0,
      discoveryFit: 0,
      explorationStrength: 0,
      bonus: 0,
      evidenceDimensions: 0,
    };
  }

  let weightedDistance = 0;
  let totalWeight = 0;
  let evidenceDimensions = 0;

  for (const dimension of candidate.taste.dimensions) {
    if (
      dimension.preferenceValue === null ||
      dimension.preferenceConfidence <= 0
    ) {
      continue;
    }

    /*
     * Distance normalisée sur notre échelle 1–5.
     *
     * Écart de 4 points = distance maximale.
     */
    const distance =
      Math.abs(
        dimension.wineValue -
          dimension.preferenceValue
      ) / 4;

    /*
     * Une préférence peu certaine contribue moins
     * à notre définition de la familiarité.
     */
    const weight =
      dimension.weight *
      dimension.preferenceConfidence;

    weightedDistance +=
      distance * weight;

    totalWeight += weight;
    evidenceDimensions++;
  }

  if (
    totalWeight <= 0 ||
    evidenceDimensions === 0
  ) {
    return {
      enabled: false,
      novelty: 0,
      targetNovelty: 0,
      discoveryFit: 0,
      explorationStrength: 0,
      bonus: 0,
      evidenceDimensions: 0,
    };
  }

  const novelty =
    weightedDistance / totalWeight;

  const targetNovelty =
    explorationTarget(
      taste.exploration
    );

  /*
   * Courbe triangulaire douce.
   *
   * Un vin trop familier apporte peu de découverte.
   * Un vin excessivement éloigné n'est pas
   * automatiquement considéré intéressant.
   */
  const discoveryFit =
    clamp(
      1 -
        Math.abs(
          novelty -
            targetNovelty
        ) / 0.5,
      0,
      1
    );

  /*
   * L'exploration déclarée détermine la force
   * du signal.
   *
   * On tient aussi compte de notre confiance
   * dans le Taste DNA : avec peu de données,
   * on explore très prudemment.
   */
  const explorationStrength =
    clamp(taste.exploration, 0, 1) *
    Math.sqrt(
      clamp(
        taste.overallConfidence,
        0,
        0.95
      )
    );

  /*
   * Protection Food supplémentaire :
   * plus le candidat est loin du meilleur accord,
   * moins Exploration peut l'aider.
   */
  const foodProtection =
    clamp(
      1 -
        candidate.distanceFromBest /
          MAX_DISTANCE_FROM_BEST,
      0,
      1
    );

  const bonus =
    MAX_EXPLORATION_BONUS *
    discoveryFit *
    explorationStrength *
    foodProtection;

  return {
    enabled: true,

    novelty:
      round(novelty),

    targetNovelty:
      round(targetNovelty),

    discoveryFit:
      round(discoveryFit),

    explorationStrength:
      round(explorationStrength),

    bonus:
      round(bonus),

    evidenceDimensions,
  };
}

/*
 * ============================================================
 * RECOMMENDATION ENGINE — FINAL V1
 * ============================================================
 *
 * Pipeline officiel :
 *
 * Catalogue complet
 *      ↓
 * Food Gate
 *      ↓
 * Taste DNA
 *      ↓
 * Editorial LPV
 *      ↓
 * Exploration contrôlée
 *      ↓
 * Classement final
 *
 * INVARIANTS :
 *
 * - Food Gate reste l'unique autorité d'admissibilité.
 * - Taste ne peut jamais récupérer un vin rejeté.
 * - Editorial ne peut jamais récupérer un vin rejeté.
 * - Exploration ne peut jamais récupérer un vin rejeté.
 * - Editorial reste un signal léger.
 * - Exploration reste déterministe et légère.
 * - Un nouveau vin du catalogue est automatiquement évalué.
 */

export type FinalRecommendationCandidate<
  T extends RecommendationWine =
    RecommendationWine
> =
  EditorialPersonalizedFoodCandidate<T> & {
    exploration: ExplorationSignalResult;

    explorationComponent: number;

    recommendationScore: number;

    recommendationRank: number;
  };

export type FinalRecommendationPool<
  T extends RecommendationWine =
    RecommendationWine
> = {
  candidates:
    FinalRecommendationCandidate<T>[];

  editorialPool:
    EditorialPersonalizedFoodPool<T>;

  diagnostics: {
    catalogueWines: number;
    eligibleFoodCandidates: number;

    tasteConfidence: number;
    personalizationStrength: number;

    editorialCandidates: number;

    explorationEnabled: boolean;
    explorationPreference: number;
    explorationCandidates: number;
  };
};

export function buildRecommendationPool<
  T extends RecommendationWine
>(
  wines: T[],
  food: RecommendationFood,
  taste: TasteDna
): FinalRecommendationPool<T> {
  /*
   * Cette fonction ne recalcule aucune logique métier.
   *
   * Elle compose uniquement les couches déjà validées.
   */
  const editorialPool =
    buildEditorialPersonalizedFoodPool(
      wines,
      food,
      taste
    );

  const candidates =
    editorialPool.candidates
      .map((candidate) => {
        const exploration =
          scoreExplorationSignal(
            candidate,
            taste
          );

        const explorationComponent =
          exploration.bonus;

        /*
         * Score final V1.
         *
         * Food + Taste sont déjà contenus dans finalScore.
         * Editorial est déjà contenu dans
         * editorialFinalScore.
         *
         * Exploration vient donc seulement ajouter
         * son minuscule signal de découverte.
         */
        const recommendationScore =
          candidate.editorialFinalScore +
          explorationComponent;

        return {
          ...candidate,

          exploration,

          explorationComponent:
            round(
              explorationComponent
            ),

          recommendationScore:
            round(
              recommendationScore
            ),

          recommendationRank: 0,
        };
      })
      .sort((a, b) => {
        if (
          b.recommendationScore !==
          a.recommendationScore
        ) {
          return (
            b.recommendationScore -
            a.recommendationScore
          );
        }

        /*
         * Si Exploration ne crée pas de différence
         * réelle, préserver exactement l'ordre
         * Food × Taste × Editorial.
         */
        return (
          a.editorialPersonalizedRank -
          b.editorialPersonalizedRank
        );
      })
      .map((candidate, index) => ({
        ...candidate,
        recommendationRank:
          index + 1,
      }));

  const explorationCandidates =
    candidates.filter(
      (candidate) =>
        candidate.exploration.enabled &&
        candidate.exploration.bonus > 0
    ).length;

  return {
    candidates,

    editorialPool,

    diagnostics: {
      catalogueWines:
        wines.length,

      eligibleFoodCandidates:
        candidates.length,

      tasteConfidence:
        round(
          taste.overallConfidence
        ),

      personalizationStrength:
        editorialPool
          .personalizedPool
          .personalizationStrength,

      editorialCandidates:
        candidates.filter(
          (candidate) =>
            candidate.editorial.selected
        ).length,

      explorationEnabled:
        taste.overallConfidence > 0,

      explorationPreference:
        round(
          taste.exploration
        ),

      explorationCandidates,
    },
  };
}
