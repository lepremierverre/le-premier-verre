import { client } from "@/sanity/lib/client";
import {
  buildTasteDna,
  type DeclaredPreferences,
  type FavoriteSignal,
  type JournalSignal,
  type TasteDna,
} from "@/lib/taste-dna";

const tasteWineProjection = `
  _id,
  color,
  body,
  sweetness,
  roundness,
  acidity,
  tannins,
  fruitIntensity,
  minerality,
  intensity,
  complexity,
  oakInfluence,
  savory,
  dnaMetadata
`;

type UserTasteData = {
  preferences: DeclaredPreferences | null;
  favorites: FavoriteSignal[];
  journal: JournalSignal[];
};

export async function getUserTasteData(
  userId: string
): Promise<UserTasteData> {
  const [preferences, favoriteDocuments, journalDocuments] =
    await Promise.all([
      client.fetch<DeclaredPreferences | null>(
        `*[
          _type == "userPreferences" &&
          userId == $userId
        ][0]{
          mainWineType,
          bodyPreference,
          stylePreference
        }`,
        { userId }
      ),

      client.fetch<Array<{ wine: FavoriteSignal["wine"] | null }>>(
        `*[
          _type == "wineFavorite" &&
          userId == $userId
        ]{
          wine->{
            ${tasteWineProjection}
          }
        }`,
        { userId }
      ),

      client.fetch<
        Array<{
          wine: JournalSignal["wine"] | null;
          appreciation: JournalSignal["appreciation"];
          buyAgain: boolean;
          tastedAt?: string | null;
        }>
      >(
        `*[
          _type == "wineJournalEntry" &&
          userId == $userId
        ]{
          appreciation,
          buyAgain,
          tastedAt,
          wine->{
            ${tasteWineProjection}
          }
        }`,
        { userId }
      ),
    ]);

  const favorites: FavoriteSignal[] =
    favoriteDocuments
      .filter(
        (
          item
        ): item is {
          wine: FavoriteSignal["wine"];
        } => Boolean(item.wine)
      )
      .map((item) => ({
        wine: item.wine,
      }));

  const journal: JournalSignal[] =
    journalDocuments
      .filter(
        (
          item
        ): item is typeof item & {
          wine: JournalSignal["wine"];
        } =>
          Boolean(item.wine) &&
          (
            item.appreciation === "liked" ||
            item.appreciation === "average" ||
            item.appreciation === "disliked"
          )
      )
      .map((item) => ({
        wine: item.wine,
        appreciation: item.appreciation,
        buyAgain: Boolean(item.buyAgain),
        tastedAt: item.tastedAt ?? null,
      }));

  return {
    preferences,
    favorites,
    journal,
  };
}

export async function getUserTasteDna(
  userId: string
): Promise<TasteDna> {
  const data = await getUserTasteData(userId);
  return buildTasteDna(data);
}
