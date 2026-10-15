import { createClient } from "@sanity/client";
import { VIBE_PROFILES } from "../lib/vibes/profiles";
import {
  buildVibeCandidatePool,
  type VibeRecommendationWine,
} from "../lib/vibe-engine";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01",
  useCdn: false,
});

const query = `*[
  _type == "wine" &&
  !(_id in path("drafts.**"))
]{
  _id, name, color, beverageType, alcoholFree, alcohol,
  body, sweetness, roundness, acidity, tannins,
  fruitIntensity, minerality, intensity, complexity,
  oakInfluence, savory, dnaMetadata
}`;

function percentile(rank: number, count: number) {
  return count <= 1 ? 1 : 1 - (rank - 1) / (count - 1);
}

function primaryScore(
  adjustedScore: number,
  relative: number,
  confidence: number
) {
  return adjustedScore * 0.8 + relative * 0.15 + confidence * 0.05;
}

async function main() {
  const wines = await client.fetch<VibeRecommendationWine[]>(query);

  const byWine = new Map<string, any[]>();
  const byVibe = new Map<string, any[]>();

  for (const vibe of VIBE_PROFILES) {
    const pool = buildVibeCandidatePool(wines, vibe);
    const count = pool.eligible.length;
    const entries = pool.eligible.map((candidate, index) => ({
      wineId: candidate.wine._id,
      wine: candidate.wine.name ?? candidate.wine._id,
      vibeId: vibe.id,
      vibe: vibe.title,
      adjustedScore: candidate.adjustedScore,
      confidence: candidate.confidence,
      rank: index + 1,
      eligibleCount: count,
      percentile: percentile(index + 1, count),
      primaryScore: primaryScore(
        candidate.adjustedScore,
        percentile(index + 1, count),
        candidate.confidence
      ),
    }));

    byVibe.set(vibe.id, entries);

    for (const entry of entries) {
      const list = byWine.get(entry.wineId) ?? [];
      list.push(entry);
      byWine.set(entry.wineId, list);
    }
  }

  const winners = new Map<string, any>();

  for (const [wineId, candidates] of byWine) {
    candidates.sort((a, b) =>
      b.primaryScore - a.primaryScore ||
      b.adjustedScore - a.adjustedScore ||
      b.percentile - a.percentile ||
      b.confidence - a.confidence ||
      a.vibeId.localeCompare(b.vibeId)
    );
    winners.set(wineId, candidates[0]);
  }

  const wins = new Map<string, number>();
  for (const winner of winners.values()) {
    wins.set(winner.vibeId, (wins.get(winner.vibeId) ?? 0) + 1);
  }

  const losers = VIBE_PROFILES.filter(
    vibe => !wins.get(vibe.id)
  );

  console.log("\nPROFILS SANS PRIMARY — MEILLEURS CANDIDATS");
  console.log("Vins:", wines.length, "| Profils:", VIBE_PROFILES.length);
  console.log("Profils sans victoire:", losers.length);

  for (const vibe of losers) {
    const entries = [...(byVibe.get(vibe.id) ?? [])]
      .sort((a, b) => b.primaryScore - a.primaryScore)
      .slice(0, 5);

    console.log(`\n--- ${vibe.title} (${vibe.id}) ---`);
    console.table(entries.map(entry => {
      const winner = winners.get(entry.wineId);
      return {
        wine: entry.wine,
        compatibility: Number(entry.adjustedScore.toFixed(4)),
        percentile: Number(entry.percentile.toFixed(3)),
        primaryScore: Number(entry.primaryScore.toFixed(4)),
        assignedPrimary: winner?.vibe ?? "Aucun",
        winnerScore: winner
          ? Number(winner.primaryScore.toFixed(4))
          : null,
        gap: winner
          ? Number((winner.primaryScore - entry.primaryScore).toFixed(4))
          : null,
      };
    }));
  }

  console.log("\nRÉSUMÉ");
  console.table(VIBE_PROFILES.map(vibe => ({
    vibe: vibe.title,
    eligible: byVibe.get(vibe.id)?.length ?? 0,
    primaryWins: wins.get(vibe.id) ?? 0,
  })).filter(row => row.primaryWins === 0));
}

main().catch(error => {
  console.error("PRIMARY LOSERS AUDIT FAILED", error);
  process.exit(1);
});
