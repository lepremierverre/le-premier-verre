import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/write-client";
import { rankFoodsForWine } from "@/lib/pairing-engine.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SanityDoc = Record<string, any>;

export async function POST(req: Request) {
  try {
    const secret = process.env.SANITY_PAIRING_WEBHOOK_SECRET;

    if (!secret) {
      console.error("SANITY_PAIRING_WEBHOOK_SECRET est manquant.");
      return NextResponse.json(
        { ok: false, error: "Configuration serveur incomplète." },
        { status: 500 }
      );
    }

    const receivedSecret = req.headers.get("x-lpv-webhook-secret");

    if (receivedSecret !== secret) {
      return NextResponse.json(
        { ok: false, error: "Non autorisé." },
        { status: 401 }
      );
    }

    const wines = await writeClient.fetch<SanityDoc[]>(`
      *[
        _type == "wine" &&
        published == true &&
        !(_id in path("drafts.**"))
      ] | order(name asc) {
        _id,
        name,
        beverageType,
        color,
        body,
        acidity,
        tannins,
        sweetness,
        sugar,
        roundness,
        intensity,
        complexity,
        oakInfluence,
        fruitIntensity,
        minerality,
        savory,
        grapes[]->{_id},
        foodPairings[]->{_id, name}
      }
    `);

    const foods = await writeClient.fetch<SanityDoc[]>(`
      *[
        _type == "food" &&
        published == true &&
        !(_id in path("drafts.**"))
      ] {
        _id,
        name,
        category,
        recommendedColors,
        bodyTarget,
        bodyTolerance,
        acidityTarget,
        acidityTolerance,
        sweetnessTarget,
        sweetnessTolerance,
        roundnessTarget,
        roundnessTolerance,
        tanninsMax,
        intensityTarget,
        intensityTolerance,
        oakInfluenceMax,
        fruitIntensityTarget,
        fruitIntensityTolerance,
        mineralityTarget,
        mineralityTolerance,
        complexityTarget,
        complexityTolerance,
        savoryTarget,
        savoryTolerance,
        preferredGrapes[]->{_id},
        wines[]->{_id}
      }
    `);

    const updates: Array<{
      id: string;
      refs: Array<{
        _type: "reference";
        _ref: string;
        _key: string;
      }>;
    }> = [];

    const insufficient: Array<{
      id: string;
      name: string;
      count: number;
    }> = [];

    for (const wine of wines) {
      const ranked = rankFoodsForWine(wine, foods, 4);

      if (ranked.length < 4) {
        insufficient.push({
          id: wine._id,
          name: wine.name,
          count: ranked.length,
        });
        continue;
      }

      const proposedIds = ranked.map((result: { food: SanityDoc }) => result.food._id);
      const currentIds = (wine.foodPairings ?? []).map(
        (food: SanityDoc) => food._id
      );

      const same =
        currentIds.length === proposedIds.length &&
        currentIds.every(
          (id: string, index: number) => id === proposedIds[index]
        );

      if (same) continue;

      updates.push({
        id: wine._id,
        refs: proposedIds.map((id: string) => ({
          _type: "reference" as const,
          _ref: id,
          _key: id,
        })),
      });
    }

    if (insufficient.length > 0) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Synchronisation annulée : au moins un vin possède moins de 4 accords.",
          wines: wines.length,
          foods: foods.length,
          insufficient,
        },
        { status: 422 }
      );
    }

    if (updates.length === 0) {
      return NextResponse.json({
        ok: true,
        wines: wines.length,
        foods: foods.length,
        updated: 0,
        message: "Tous les accords sont déjà synchronisés.",
      });
    }

    let transaction = writeClient.transaction();

    for (const update of updates) {
      transaction = transaction.patch(update.id, {
        set: {
          foodPairings: update.refs,
        },
      });
    }

    const result = await transaction.commit();

    return NextResponse.json({
      ok: true,
      wines: wines.length,
      foods: foods.length,
      updated: updates.length,
      transactionId: result.transactionId,
    });
  } catch (error) {
    console.error("Erreur de synchronisation des accords :", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Erreur pendant la synchronisation des accords.",
      },
      { status: 500 }
    );
  }
}
