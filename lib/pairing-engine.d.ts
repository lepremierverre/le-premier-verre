export type PairingResult<T> = {
  score: number;
  rawScore: number;
  editorialBonus: number;
  grapeBonus: number;
  criteriaUsed: number;
} & T;

export function scorePairing(
  wine: Record<string, any>,
  food: Record<string, any>
): {
  score: number;
  rawScore: number;
  editorialBonus: number;
  grapeBonus: number;
  criteriaUsed: number;
};

export function rankFoodsForWine(
  wine: Record<string, any>,
  foods: Record<string, any>[],
  limit?: number
): Array<
  PairingResult<{
    food: Record<string, any>;
  }>
>;

export function rankWinesForFood(
  food: Record<string, any>,
  wines: Record<string, any>[],
  limit?: number
): Array<
  PairingResult<{
    wine: Record<string, any>;
  }>
>;
