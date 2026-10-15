import type { VibeProfile } from "../vibe-engine";
import { VIBE_CATALOG_BY_ID } from "./catalog";

function getVibeIdentity(id: string) {
  const vibe = VIBE_CATALOG_BY_ID.get(id);

  if (!vibe) {
    throw new Error(`Unknown canonical vibe: ${id}`);
  }

  return vibe;
}

export function validateVibeProfiles(
  profiles: readonly VibeProfile[]
) {
  const seenIds = new Set<string>();

  for (const profile of profiles) {
    const canonical = VIBE_CATALOG_BY_ID.get(profile.id);

    if (!canonical) {
      throw new Error(
        `Vibe profile "${profile.id}" does not exist in canonical catalog`
      );
    }

    if (seenIds.has(profile.id)) {
      throw new Error(
        `Duplicate vibe profile id: "${profile.id}"`
      );
    }

    if (profile.slug !== canonical.slug) {
      throw new Error(
        `Vibe profile "${profile.id}" has slug "${profile.slug}" but canonical slug is "${canonical.slug}"`
      );
    }

    seenIds.add(profile.id);
  }

  return {
    profileCount: profiles.length,
    uniqueProfileIds: seenIds.size,
  };
}

export const VIBE_PROFILES: VibeProfile[] = [
  {
    ...getVibeIdentity("vibe_pool_15h"),

    allowedColors: [
      "white",
      "rose",
      "sparkling",
    ],

    dimensions: {
      body: {
        target: 1,
        tolerance: 1,
        weight: 1.3,
        required: true,
      },

      sweetness: {
        target: 1,
        tolerance: 1,
        weight: 0.7,
      },

      roundness: {
        target: 1,
        tolerance: 1,
        weight: 0.9,
      },

      acidity: {
        target: 5,
        tolerance: 1,
        weight: 1.5,
        required: true,
      },

      tannins: {
        max: 2,
        weight: 0.25,
      },

      fruitIntensity: {
        target: 2,
        tolerance: 1,
        weight: 0.75,
      },

      minerality: {
        target: 3,
        tolerance: 2,
        weight: 0.45,
      },

      intensity: {
        target: 2,
        tolerance: 1,
        weight: 1,
      },

      complexity: {
        max: 2,
        weight: 0.55,
      },

      oakInfluence: {
        max: 2,
        weight: 0.8,
      },
    },

    specificity: 0.95,
  },
];

export const PISCINE_15H =
  VIBE_PROFILES[0];

export const IL_PLEUT_ROUGE: VibeProfile = {
  ...getVibeIdentity("vibe_rain_red"),
  allowedColors: ["red"],
  dimensions: {
    body: {
      target: 3,
      tolerance: 1,
      weight: 1.1,
      required: true,
    },
    sweetness: {
      target: 1,
      tolerance: 1,
      weight: 0.35,
    },
    roundness: {
      target: 4,
      tolerance: 1,
      weight: 1.4,
      required: true,
    },
    acidity: {
      target: 3,
      tolerance: 1,
      weight: 0.65,
    },
    tannins: {
      target: 2,
      tolerance: 1,
      weight: 1.15,
    },
    fruitIntensity: {
      target: 4,
      tolerance: 1,
      weight: 0.9,
    },
    minerality: {
      target: 2,
      tolerance: 2,
      weight: 0.25,
    },
    intensity: {
      target: 3,
      tolerance: 1,
      weight: 0.9,
    },
    complexity: {
      target: 3,
      tolerance: 1,
      weight: 0.45,
    },
    oakInfluence: {
      max: 3,
      weight: 0.6,
    },
    savory: {
      target: 3,
      tolerance: 2,
      weight: 0.35,
    },
  },
  specificity: 0.9,
};

VIBE_PROFILES.push(IL_PLEUT_ROUGE);

export const BELLE_BOUTEILLE: VibeProfile = {
  ...getVibeIdentity("vibe_belle_bouteille"),
  dimensions: {
    body: {
      target: 4,
      tolerance: 2,
      weight: 0.7,
    },
    sweetness: {
      target: 1,
      tolerance: 1,
      weight: 0.3,
    },
    roundness: {
      target: 3,
      tolerance: 2,
      weight: 0.55,
    },
    acidity: {
      target: 4,
      tolerance: 2,
      weight: 0.75,
    },
    tannins: {
      target: 3,
      tolerance: 2,
      weight: 0.45,
    },
    fruitIntensity: {
      target: 4,
      tolerance: 2,
      weight: 0.55,
    },
    minerality: {
      target: 4,
      tolerance: 2,
      weight: 0.6,
    },
    intensity: {
      target: 4,
      tolerance: 1,
      weight: 1.05,
      required: true,
    },
    complexity: {
      target: 5,
      tolerance: 1,
      weight: 1.6,
      required: true,
    },
    oakInfluence: {
      target: 3,
      tolerance: 2,
      weight: 0.35,
    },
    savory: {
      target: 3,
      tolerance: 2,
      weight: 0.45,
    },
  },
  specificity: 0.92,
};

VIBE_PROFILES.push(BELLE_BOUTEILLE);

export const AVANT_TOUT_LE_MONDE: VibeProfile = {
  ...getVibeIdentity("vibe_before_everyone_arrives"),
  dimensions: {
    body: {
      target: 2,
      tolerance: 1,
      weight: 0.9,
    },
    sweetness: {
      target: 1,
      tolerance: 1,
      weight: 0.65,
    },
    roundness: {
      target: 2,
      tolerance: 1,
      weight: 0.55,
    },
    acidity: {
      target: 5,
      tolerance: 1,
      weight: 1.45,
      required: true,
    },
    tannins: {
      max: 2,
      weight: 0.45,
    },
    fruitIntensity: {
      target: 3,
      tolerance: 1,
      weight: 0.65,
    },
    minerality: {
      target: 3,
      tolerance: 2,
      weight: 0.4,
    },
    intensity: {
      target: 3,
      tolerance: 1,
      weight: 0.8,
      required: true,
    },
    complexity: {
      target: 3,
      tolerance: 2,
      weight: 0.3,
    },
    oakInfluence: {
      max: 2,
      weight: 0.7,
    },
    savory: {
      target: 2,
      tolerance: 2,
      weight: 0.25,
    },
  },
  specificity: 0.9,
};

VIBE_PROFILES.push(AVANT_TOUT_LE_MONDE);

// -----------------------------------------------------------------------------
// BATCH 2 — profils Vibe Gate
// -----------------------------------------------------------------------------

export const PREMIER_SOIR_TERRASSE: VibeProfile = {
  ...getVibeIdentity("vibe_first_terrace_night"),
  allowedColors: ["white", "rose", "sparkling", "orange"],
  dimensions: {
    body: { target: 2, tolerance: 1, weight: 0.9 },
    sweetness: { target: 1, tolerance: 1, weight: 0.55 },
    roundness: { target: 2, tolerance: 1, weight: 0.65 },
    acidity: { target: 4, tolerance: 1, weight: 1.25, required: true },
    tannins: { max: 2, weight: 0.35 },
    fruitIntensity: { target: 3, tolerance: 1, weight: 0.7 },
    minerality: { target: 3, tolerance: 2, weight: 0.45 },
    intensity: { target: 3, tolerance: 1, weight: 0.6 },
    complexity: { target: 3, tolerance: 2, weight: 0.25 },
    oakInfluence: { max: 2, weight: 0.55 },
  },
  specificity: 0.88,
};

VIBE_PROFILES.push(PREMIER_SOIR_TERRASSE);

export const APERO_ENTRE_FILLES: VibeProfile = {
  ...getVibeIdentity("vibe_girls_aperitif"),
  dimensions: {
    body: { target: 2, tolerance: 1, weight: 0.75 },
    sweetness: { target: 1, tolerance: 2, weight: 0.35 },
    roundness: { target: 2, tolerance: 1, weight: 0.5 },
    acidity: { target: 4, tolerance: 1, weight: 1.05, required: true },
    tannins: { max: 3, weight: 0.35 },
    fruitIntensity: { target: 4, tolerance: 1, weight: 1.0 },
    minerality: { target: 3, tolerance: 2, weight: 0.25 },
    intensity: { target: 4, tolerance: 1, weight: 0.85 },
    complexity: { target: 3, tolerance: 2, weight: 0.2 },
    oakInfluence: { max: 3, weight: 0.35 },
  },
  specificity: 0.76,
};

VIBE_PROFILES.push(APERO_ENTRE_FILLES);

export const MERCREDI_RAISON: VibeProfile = {
  ...getVibeIdentity("vibe_wednesday_reason_enough"),
  dimensions: {
    body: { target: 3, tolerance: 2, weight: 0.65 },
    sweetness: { target: 1, tolerance: 2, weight: 0.35 },
    roundness: { target: 3, tolerance: 2, weight: 0.55 },
    acidity: { target: 3, tolerance: 2, weight: 0.7 },
    tannins: { target: 2, tolerance: 2, weight: 0.3 },
    fruitIntensity: { target: 3, tolerance: 2, weight: 0.65 },
    minerality: { target: 3, tolerance: 2, weight: 0.2 },
    intensity: { target: 3, tolerance: 1, weight: 0.7 },
    complexity: { target: 3, tolerance: 2, weight: 0.25 },
    oakInfluence: { max: 3, weight: 0.35 },
    savory: { target: 2, tolerance: 2, weight: 0.2 },
  },
  specificity: 0.52,
};

VIBE_PROFILES.push(MERCREDI_RAISON);

export const PREMIER_FEU_FOYER: VibeProfile = {
  ...getVibeIdentity("vibe_first_fire"),
  dimensions: {
    body: { target: 4, tolerance: 1, weight: 1.15, required: true },
    sweetness: { target: 1, tolerance: 2, weight: 0.3 },
    roundness: { target: 4, tolerance: 1, weight: 0.9, required: true },
    acidity: { target: 3, tolerance: 2, weight: 0.4 },
    tannins: { target: 4, tolerance: 1, weight: 0.7 },
    fruitIntensity: { target: 3, tolerance: 2, weight: 0.35 },
    minerality: { target: 2, tolerance: 2, weight: 0.2 },
    intensity: { target: 4, tolerance: 1, weight: 0.9 },
    complexity: { target: 5, tolerance: 1, weight: 1.15 },
    oakInfluence: { target: 3, tolerance: 2, weight: 0.55 },
    savory: { target: 4, tolerance: 1, weight: 0.85 },
  },
  specificity: 0.91,
};

VIBE_PROFILES.push(PREMIER_FEU_FOYER);

export const FIN_AOUT_DEHORS: VibeProfile = {
  ...getVibeIdentity("vibe_late_august_outside"),
  dimensions: {
    body: { target: 3, tolerance: 1, weight: 0.85 },
    sweetness: { target: 1, tolerance: 1, weight: 0.45 },
    roundness: { target: 3, tolerance: 1, weight: 0.75 },
    acidity: { target: 4, tolerance: 1, weight: 1.0, required: true },
    tannins: { target: 2, tolerance: 2, weight: 0.35 },
    fruitIntensity: { target: 3, tolerance: 1, weight: 0.6 },
    minerality: { target: 3, tolerance: 2, weight: 0.35 },
    intensity: { target: 3, tolerance: 1, weight: 0.65 },
    complexity: { target: 3, tolerance: 1, weight: 0.45 },
    oakInfluence: { max: 3, weight: 0.4 },
    savory: { target: 3, tolerance: 2, weight: 0.3 },
  },
  specificity: 0.9,
};

VIBE_PROFILES.push(FIN_AOUT_DEHORS);

export const VENDREDI_1703: VibeProfile = {
  ...getVibeIdentity("vibe_friday_1703"),
  dimensions: {
    body: { target: 2, tolerance: 2, weight: 0.55 },
    sweetness: { target: 1, tolerance: 2, weight: 0.3 },
    roundness: { target: 2, tolerance: 2, weight: 0.4 },
    acidity: { target: 4, tolerance: 1, weight: 1.15, required: true },
    tannins: { max: 3, weight: 0.3 },
    fruitIntensity: { target: 4, tolerance: 1, weight: 0.9 },
    minerality: { target: 3, tolerance: 2, weight: 0.2 },
    intensity: { target: 4, tolerance: 1, weight: 0.85 },
    complexity: { target: 3, tolerance: 2, weight: 0.2 },
    oakInfluence: { max: 3, weight: 0.3 },
  },
  specificity: 0.68,
};

VIBE_PROFILES.push(VENDREDI_1703);

// -----------------------------------------------------------------------------
// BATCH 3 — moments 9 à 16
// -----------------------------------------------------------------------------

export const BOUTEILLE_EN_CUISINANT: VibeProfile = {
  ...getVibeIdentity("vibe_cooking_bottle"),
  dimensions: {
    body: { target: 3, tolerance: 2, weight: 0.65 },
    sweetness: { target: 1, tolerance: 2, weight: 0.35 },
    roundness: { target: 3, tolerance: 2, weight: 0.55 },
    acidity: { target: 4, tolerance: 2, weight: 0.9 },
    tannins: { target: 2, tolerance: 2, weight: 0.35 },
    fruitIntensity: { target: 3, tolerance: 2, weight: 0.7 },
    minerality: { target: 3, tolerance: 2, weight: 0.25 },
    intensity: { target: 3, tolerance: 1, weight: 0.7 },
    complexity: { target: 3, tolerance: 2, weight: 0.4 },
    oakInfluence: { max: 3, weight: 0.35 },
    savory: { target: 3, tolerance: 2, weight: 0.45 },
  },
  specificity: 0.62,
};

VIBE_PROFILES.push(BOUTEILLE_EN_CUISINANT);

export const RETOUR_DU_SKI: VibeProfile = {
  ...getVibeIdentity("vibe_after_ski"),
  dimensions: {
    body: { target: 4, tolerance: 1, weight: 1.1, required: true },
    sweetness: { target: 2, tolerance: 2, weight: 0.35 },
    roundness: { target: 5, tolerance: 1, weight: 1.3, required: true },
    acidity: { target: 3, tolerance: 2, weight: 0.3 },
    tannins: { target: 2, tolerance: 2, weight: 0.35 },
    fruitIntensity: { target: 5, tolerance: 1, weight: 1.05 },
    minerality: { target: 2, tolerance: 2, weight: 0.1 },
    intensity: { target: 4, tolerance: 1, weight: 0.85 },
    complexity: { target: 3, tolerance: 2, weight: 0.3 },
    oakInfluence: { target: 3, tolerance: 2, weight: 0.4 },
    savory: { target: 2, tolerance: 2, weight: 0.25 },
  },
  specificity: 0.9,
};

VIBE_PROFILES.push(RETOUR_DU_SKI);

export const BLANC_AU_PARC: VibeProfile = {
  ...getVibeIdentity("vibe_park_white"),
  allowedColors: ["white"],
  dimensions: {
    body: { target: 2, tolerance: 1, weight: 1.0, required: true },
    sweetness: { target: 1, tolerance: 1, weight: 0.55 },
    roundness: { target: 2, tolerance: 1, weight: 0.55 },
    acidity: { target: 4, tolerance: 1, weight: 1.25, required: true },
    fruitIntensity: { target: 3, tolerance: 1, weight: 0.7 },
    minerality: { target: 3, tolerance: 2, weight: 0.35 },
    intensity: { target: 3, tolerance: 1, weight: 0.55 },
    complexity: { max: 4, weight: 0.2 },
    oakInfluence: { max: 2, weight: 0.6 },
    savory: { target: 2, tolerance: 2, weight: 0.2 },
  },
  specificity: 0.94,
};

VIBE_PROFILES.push(BLANC_AU_PARC);

export const SOUPER_IMPROVISE: VibeProfile = {
  ...getVibeIdentity("vibe_unplanned_dinner"),
  dimensions: {
    body: { target: 3, tolerance: 2, weight: 0.65 },
    sweetness: { target: 1, tolerance: 2, weight: 0.35 },
    roundness: { target: 3, tolerance: 2, weight: 0.55 },
    acidity: { target: 4, tolerance: 2, weight: 0.9 },
    tannins: { target: 2, tolerance: 2, weight: 0.35 },
    fruitIntensity: { target: 3, tolerance: 2, weight: 0.7 },
    minerality: { target: 3, tolerance: 2, weight: 0.25 },
    intensity: { target: 3, tolerance: 1, weight: 0.65 },
    complexity: { target: 3, tolerance: 2, weight: 0.35 },
    oakInfluence: { max: 3, weight: 0.35 },
    savory: { target: 3, tolerance: 2, weight: 0.4 },
  },
  specificity: 0.67,
};

VIBE_PROFILES.push(SOUPER_IMPROVISE);

export const DEHORS_ENCORE_FROID: VibeProfile = {
  ...getVibeIdentity("vibe_outside_still_cold"),
  allowedColors: ["white", "rose", "orange", "sparkling"],
  dimensions: {
    body: { target: 2, tolerance: 1, weight: 0.8 },
    sweetness: { target: 1, tolerance: 1, weight: 0.45 },
    roundness: { target: 2, tolerance: 1, weight: 0.5 },
    acidity: { target: 4, tolerance: 1, weight: 1.2, required: true },
    tannins: { max: 2, weight: 0.3 },
    fruitIntensity: { target: 3, tolerance: 1, weight: 0.55 },
    minerality: { target: 4, tolerance: 1, weight: 0.8 },
    intensity: { target: 3, tolerance: 1, weight: 0.55 },
    complexity: { target: 3, tolerance: 2, weight: 0.3 },
    oakInfluence: { max: 2, weight: 0.55 },
    savory: { target: 2, tolerance: 2, weight: 0.2 },
  },
  specificity: 0.91,
};

VIBE_PROFILES.push(DEHORS_ENCORE_FROID);

export const DIMANCHE_APRES_MIDI: VibeProfile = {
  ...getVibeIdentity("vibe_sunday_afternoon"),
  dimensions: {
    body: { target: 2, tolerance: 1, weight: 0.75 },
    sweetness: { target: 1, tolerance: 2, weight: 0.3 },
    roundness: { target: 3, tolerance: 1, weight: 0.65 },
    acidity: { target: 3, tolerance: 2, weight: 0.55 },
    tannins: { max: 3, weight: 0.3 },
    fruitIntensity: { target: 3, tolerance: 2, weight: 0.45 },
    minerality: { target: 3, tolerance: 2, weight: 0.4 },
    intensity: { target: 2, tolerance: 1, weight: 0.9, required: true },
    complexity: { target: 3, tolerance: 1, weight: 0.65 },
    oakInfluence: { max: 3, weight: 0.3 },
    savory: { target: 3, tolerance: 2, weight: 0.25 },
  },
  specificity: 0.78,
};

VIBE_PROFILES.push(DIMANCHE_APRES_MIDI);

export const BBQ_RELAX: VibeProfile = {
  ...getVibeIdentity("vibe_bbq_not_necessarily"),
  dimensions: {
    body: { target: 3, tolerance: 2, weight: 0.7 },
    sweetness: { target: 1, tolerance: 2, weight: 0.3 },
    roundness: { target: 3, tolerance: 2, weight: 0.5 },
    acidity: { target: 4, tolerance: 2, weight: 0.8 },
    tannins: { target: 3, tolerance: 2, weight: 0.35 },
    fruitIntensity: { target: 4, tolerance: 1, weight: 0.95 },
    minerality: { target: 2, tolerance: 2, weight: 0.2 },
    intensity: { target: 4, tolerance: 1, weight: 0.8 },
    complexity: { target: 3, tolerance: 2, weight: 0.25 },
    oakInfluence: { max: 4, weight: 0.25 },
    savory: { target: 3, tolerance: 2, weight: 0.35 },
  },
  specificity: 0.72,
};

VIBE_PROFILES.push(BBQ_RELAX);

export const CHALET_SIX_POUR_QUATRE: VibeProfile = {
  ...getVibeIdentity("vibe_overbooked_chalet"),
  dimensions: {
    body: { target: 4, tolerance: 1, weight: 0.95 },
    sweetness: { target: 1, tolerance: 2, weight: 0.3 },
    roundness: { target: 4, tolerance: 1, weight: 0.85 },
    acidity: { target: 3, tolerance: 2, weight: 0.45 },
    tannins: { target: 3, tolerance: 2, weight: 0.45 },
    fruitIntensity: { target: 4, tolerance: 1, weight: 0.75 },
    minerality: { target: 2, tolerance: 2, weight: 0.15 },
    intensity: { target: 4, tolerance: 1, weight: 0.8 },
    complexity: { target: 3, tolerance: 2, weight: 0.35 },
    oakInfluence: { target: 3, tolerance: 2, weight: 0.35 },
    savory: { target: 3, tolerance: 2, weight: 0.4 },
  },
  specificity: 0.83,
};

VIBE_PROFILES.push(CHALET_SIX_POUR_QUATRE);

// -----------------------------------------------------------------------------
// BATCH 4 — moments 18 à 25
// -----------------------------------------------------------------------------

export const TOUT_LE_MONDE_RESTE_SOUPER: VibeProfile = {
  ...getVibeIdentity("vibe_everyone_stays_dinner"),
  dimensions: {
    body: { target: 3, tolerance: 1, weight: 0.8 },
    sweetness: { target: 1, tolerance: 2, weight: 0.3 },
    roundness: { target: 3, tolerance: 1, weight: 0.65 },
    acidity: { target: 4, tolerance: 1, weight: 1.0, required: true },
    tannins: { target: 2, tolerance: 2, weight: 0.35 },
    fruitIntensity: { target: 3, tolerance: 1, weight: 0.7 },
    minerality: { target: 3, tolerance: 2, weight: 0.25 },
    intensity: { target: 3, tolerance: 1, weight: 0.7 },
    complexity: { target: 3, tolerance: 2, weight: 0.35 },
    oakInfluence: { max: 3, weight: 0.35 },
    savory: { target: 3, tolerance: 1, weight: 0.55 },
  },
  specificity: 0.69,
};

VIBE_PROFILES.push(TOUT_LE_MONDE_RESTE_SOUPER);

export const BOUTEILLE_COMPTOIR_CUISINE: VibeProfile = {
  ...getVibeIdentity("vibe_kitchen_counter"),
  dimensions: {
    body: { target: 3, tolerance: 1, weight: 0.85 },
    sweetness: { target: 1, tolerance: 2, weight: 0.3 },
    roundness: { target: 3, tolerance: 1, weight: 0.75 },
    acidity: { target: 3, tolerance: 2, weight: 0.6 },
    tannins: { target: 2, tolerance: 2, weight: 0.35 },
    fruitIntensity: { target: 3, tolerance: 2, weight: 0.55 },
    minerality: { target: 3, tolerance: 2, weight: 0.25 },
    intensity: { target: 3, tolerance: 1, weight: 0.7 },
    complexity: { target: 3, tolerance: 1, weight: 0.6 },
    oakInfluence: { max: 3, weight: 0.35 },
    savory: { target: 3, tolerance: 1, weight: 0.65 },
  },
  specificity: 0.7,
};

VIBE_PROFILES.push(BOUTEILLE_COMPTOIR_CUISINE);

export const VERRE_AVANT_RESERVATION: VibeProfile = {
  ...getVibeIdentity("vibe_before_reservation"),
  dimensions: {
    body: { target: 2, tolerance: 1, weight: 0.8 },
    sweetness: { target: 1, tolerance: 1, weight: 0.55 },
    roundness: { target: 2, tolerance: 1, weight: 0.5 },
    acidity: { target: 5, tolerance: 1, weight: 1.35, required: true },
    tannins: { max: 2, weight: 0.4 },
    fruitIntensity: { target: 3, tolerance: 1, weight: 0.55 },
    minerality: { target: 4, tolerance: 1, weight: 0.75 },
    intensity: { target: 3, tolerance: 1, weight: 0.65 },
    complexity: { target: 4, tolerance: 1, weight: 0.6 },
    oakInfluence: { max: 2, weight: 0.55 },
    savory: { target: 2, tolerance: 2, weight: 0.2 },
  },
  specificity: 0.9,
};

VIBE_PROFILES.push(VERRE_AVANT_RESERVATION);

export const PIZZA: VibeProfile = {
  ...getVibeIdentity("vibe_pizza_order"),
  dimensions: {
    body: { target: 3, tolerance: 1, weight: 0.8 },
    sweetness: { target: 1, tolerance: 1, weight: 0.45 },
    roundness: { target: 3, tolerance: 2, weight: 0.35 },
    acidity: { target: 4, tolerance: 1, weight: 1.25, required: true },
    tannins: { target: 2, tolerance: 2, weight: 0.35 },
    fruitIntensity: { target: 4, tolerance: 1, weight: 0.75 },
    minerality: { target: 2, tolerance: 2, weight: 0.1 },
    intensity: { target: 4, tolerance: 1, weight: 0.7 },
    complexity: { target: 3, tolerance: 2, weight: 0.2 },
    oakInfluence: { max: 3, weight: 0.3 },
    savory: { target: 4, tolerance: 1, weight: 1.15, required: true },
  },
  specificity: 0.91,
};

VIBE_PROFILES.push(PIZZA);

export const JOURNEE_TROP_LONGUE: VibeProfile = {
  ...getVibeIdentity("vibe_long_day"),
  dimensions: {
    body: { target: 3, tolerance: 1, weight: 0.75 },
    sweetness: { target: 1, tolerance: 2, weight: 0.3 },
    roundness: { target: 4, tolerance: 1, weight: 1.1, required: true },
    acidity: { target: 3, tolerance: 2, weight: 0.45 },
    tannins: { max: 3, weight: 0.55 },
    fruitIntensity: { target: 4, tolerance: 1, weight: 0.8 },
    minerality: { target: 2, tolerance: 2, weight: 0.15 },
    intensity: { target: 3, tolerance: 1, weight: 0.65 },
    complexity: { target: 3, tolerance: 2, weight: 0.25 },
    oakInfluence: { max: 3, weight: 0.3 },
    savory: { target: 2, tolerance: 2, weight: 0.25 },
  },
  specificity: 0.75,
};

VIBE_PROFILES.push(JOURNEE_TROP_LONGUE);

export const PREMIERE_JOURNEE_CHAUDE: VibeProfile = {
  ...getVibeIdentity("vibe_first_hot_day"),
  allowedColors: ["white", "rose", "sparkling", "orange"],
  dimensions: {
    body: { target: 1, tolerance: 1, weight: 1.2, required: true },
    sweetness: { target: 1, tolerance: 1, weight: 0.55 },
    roundness: { target: 1, tolerance: 1, weight: 0.8 },
    acidity: { target: 5, tolerance: 1, weight: 1.45, required: true },
    tannins: { max: 2, weight: 0.4 },
    fruitIntensity: { target: 3, tolerance: 2, weight: 0.45 },
    minerality: { target: 3, tolerance: 2, weight: 0.35 },
    intensity: { target: 2, tolerance: 1, weight: 0.75 },
    complexity: { max: 4, weight: 0.2 },
    oakInfluence: { max: 2, weight: 0.65 },
    savory: { max: 3, weight: 0.2 },
  },
  specificity: 0.96,
};

VIBE_PROFILES.push(PREMIERE_JOURNEE_CHAUDE);

export const FENETRES_OUVERTES: VibeProfile = {
  ...getVibeIdentity("vibe_open_windows"),
  dimensions: {
    body: { target: 2, tolerance: 1, weight: 1.0 },
    sweetness: { target: 1, tolerance: 2, weight: 0.3 },
    roundness: { target: 1, tolerance: 1, weight: 0.75 },
    acidity: { target: 5, tolerance: 1, weight: 1.25, required: true },
    tannins: { max: 2, weight: 0.4 },
    fruitIntensity: { target: 3, tolerance: 1, weight: 0.65 },
    minerality: { target: 3, tolerance: 2, weight: 0.35 },
    intensity: { target: 3, tolerance: 1, weight: 0.55 },
    complexity: { target: 3, tolerance: 2, weight: 0.2 },
    oakInfluence: { max: 2, weight: 0.65 },
    savory: { max: 2, weight: 0.35 },
  },
  specificity: 0.84,
};

VIBE_PROFILES.push(FENETRES_OUVERTES);

export const AUTOMNE_OFFICIEL: VibeProfile = {
  ...getVibeIdentity("vibe_autumn_official"),
  dimensions: {
    body: { target: 3, tolerance: 1, weight: 0.95, required: true },
    sweetness: { target: 1, tolerance: 2, weight: 0.3 },
    roundness: { target: 3, tolerance: 1, weight: 0.75 },
    acidity: { target: 3, tolerance: 2, weight: 0.45 },
    tannins: { target: 3, tolerance: 2, weight: 0.4 },
    fruitIntensity: { target: 3, tolerance: 2, weight: 0.45 },
    minerality: { target: 2, tolerance: 2, weight: 0.2 },
    intensity: { target: 4, tolerance: 1, weight: 0.85 },
    complexity: { target: 4, tolerance: 1, weight: 0.7 },
    oakInfluence: { target: 3, tolerance: 2, weight: 0.4 },
    savory: { target: 4, tolerance: 1, weight: 1.0, required: true },
  },
  specificity: 0.93,
};

VIBE_PROFILES.push(AUTOMNE_OFFICIEL);

// -----------------------------------------------------------------------------
// BATCH 5 — moments 26 à 33
// -----------------------------------------------------------------------------

export const PREMIERE_NEIGE: VibeProfile = {
  ...getVibeIdentity("vibe_first_snow"),
  dimensions: {
    body: { target: 3, tolerance: 1, weight: 0.75 },
    sweetness: { target: 2, tolerance: 1, weight: 0.55 },
    roundness: { target: 4, tolerance: 1, weight: 1.0, required: true },
    acidity: { target: 3, tolerance: 2, weight: 0.4 },
    tannins: { max: 3, weight: 0.4 },
    fruitIntensity: { target: 3, tolerance: 1, weight: 0.55 },
    minerality: { target: 3, tolerance: 2, weight: 0.3 },
    intensity: { target: 3, tolerance: 1, weight: 0.65 },
    complexity: { target: 4, tolerance: 1, weight: 0.7 },
    oakInfluence: { max: 3, weight: 0.35 },
    savory: { target: 3, tolerance: 2, weight: 0.3 },
  },
  specificity: 0.86,
};

VIBE_PROFILES.push(PREMIERE_NEIGE);

export const TEMPETE_MAISON: VibeProfile = {
  ...getVibeIdentity("vibe_storm_stay_home"),
  dimensions: {
    body: { target: 5, tolerance: 1, weight: 1.25, required: true },
    sweetness: { target: 2, tolerance: 2, weight: 0.3 },
    roundness: { target: 5, tolerance: 1, weight: 1.15, required: true },
    acidity: { target: 3, tolerance: 2, weight: 0.35 },
    tannins: { target: 4, tolerance: 1, weight: 0.65 },
    fruitIntensity: { target: 4, tolerance: 1, weight: 0.6 },
    minerality: { target: 2, tolerance: 2, weight: 0.15 },
    intensity: { target: 5, tolerance: 1, weight: 1.0 },
    complexity: { target: 4, tolerance: 1, weight: 0.75 },
    oakInfluence: { target: 4, tolerance: 1, weight: 0.55 },
    savory: { target: 4, tolerance: 1, weight: 0.65 },
  },
  specificity: 0.97,
};

VIBE_PROFILES.push(TEMPETE_MAISON);

export const GROS_CHANDAIL: VibeProfile = {
  ...getVibeIdentity("vibe_big_sweater"),
  dimensions: {
    body: { target: 3, tolerance: 1, weight: 0.8 },
    sweetness: { target: 1, tolerance: 2, weight: 0.3 },
    roundness: { target: 4, tolerance: 1, weight: 1.05, required: true },
    acidity: { target: 3, tolerance: 2, weight: 0.4 },
    tannins: { target: 2, tolerance: 2, weight: 0.35 },
    fruitIntensity: { target: 4, tolerance: 1, weight: 0.7 },
    minerality: { target: 2, tolerance: 2, weight: 0.15 },
    intensity: { target: 3, tolerance: 1, weight: 0.65 },
    complexity: { target: 3, tolerance: 2, weight: 0.35 },
    oakInfluence: { max: 3, weight: 0.35 },
    savory: { target: 3, tolerance: 1, weight: 0.55 },
  },
  specificity: 0.82,
};

VIBE_PROFILES.push(GROS_CHANDAIL);

export const APRES_LA_PLAGE: VibeProfile = {
  ...getVibeIdentity("vibe_after_beach"),
  allowedColors: ["white", "rose", "sparkling", "orange"],
  dimensions: {
    body: { target: 1, tolerance: 1, weight: 1.0 },
    sweetness: { target: 1, tolerance: 1, weight: 0.55 },
    roundness: { target: 1, tolerance: 1, weight: 0.65 },
    acidity: { target: 5, tolerance: 1, weight: 1.4, required: true },
    tannins: { max: 2, weight: 0.35 },
    fruitIntensity: { target: 3, tolerance: 2, weight: 0.4 },
    minerality: { target: 5, tolerance: 1, weight: 1.2, required: true },
    intensity: { target: 3, tolerance: 1, weight: 0.55 },
    complexity: { target: 3, tolerance: 2, weight: 0.25 },
    oakInfluence: { max: 2, weight: 0.6 },
    savory: { target: 2, tolerance: 2, weight: 0.2 },
  },
  specificity: 0.98,
};

VIBE_PROFILES.push(APRES_LA_PLAGE);

export const QUAI_AVANT_SOUPER: VibeProfile = {
  ...getVibeIdentity("vibe_dock_before_dinner"),
  dimensions: {
    body: { target: 2, tolerance: 1, weight: 0.85 },
    sweetness: { target: 1, tolerance: 2, weight: 0.35 },
    roundness: { target: 2, tolerance: 1, weight: 0.55 },
    acidity: { target: 4, tolerance: 1, weight: 1.0, required: true },
    tannins: { max: 2, weight: 0.35 },
    fruitIntensity: { target: 3, tolerance: 1, weight: 0.55 },
    minerality: { target: 4, tolerance: 1, weight: 0.75 },
    intensity: { target: 2, tolerance: 1, weight: 0.8 },
    complexity: { target: 3, tolerance: 2, weight: 0.35 },
    oakInfluence: { max: 2, weight: 0.5 },
    savory: { target: 2, tolerance: 2, weight: 0.2 },
  },
  specificity: 0.9,
};

VIBE_PROFILES.push(QUAI_AVANT_SOUPER);

export const LONGUE_SOIREE_JUILLET: VibeProfile = {
  ...getVibeIdentity("vibe_long_july_evening"),
  dimensions: {
    body: { target: 2, tolerance: 1, weight: 0.8 },
    sweetness: { target: 1, tolerance: 2, weight: 0.35 },
    roundness: { target: 2, tolerance: 1, weight: 0.5 },
    acidity: { target: 4, tolerance: 1, weight: 1.05, required: true },
    tannins: { max: 2, weight: 0.35 },
    fruitIntensity: { target: 3, tolerance: 1, weight: 0.65 },
    minerality: { target: 3, tolerance: 2, weight: 0.35 },
    intensity: { target: 2, tolerance: 1, weight: 0.75 },
    complexity: { target: 3, tolerance: 2, weight: 0.3 },
    oakInfluence: { max: 2, weight: 0.5 },
    savory: { target: 2, tolerance: 2, weight: 0.2 },
  },
  specificity: 0.84,
};

VIBE_PROFILES.push(LONGUE_SOIREE_JUILLET);

export const DERNIER_WEEKEND_ETE: VibeProfile = {
  ...getVibeIdentity("vibe_last_summer_weekend"),
  dimensions: {
    body: { target: 3, tolerance: 1, weight: 0.85 },
    sweetness: { target: 1, tolerance: 2, weight: 0.35 },
    roundness: { target: 3, tolerance: 1, weight: 0.75 },
    acidity: { target: 4, tolerance: 1, weight: 1.0, required: true },
    tannins: { target: 2, tolerance: 2, weight: 0.3 },
    fruitIntensity: { target: 3, tolerance: 1, weight: 0.6 },
    minerality: { target: 3, tolerance: 2, weight: 0.35 },
    intensity: { target: 3, tolerance: 1, weight: 0.7 },
    complexity: { target: 4, tolerance: 1, weight: 0.65 },
    oakInfluence: { max: 3, weight: 0.35 },
    savory: { target: 3, tolerance: 1, weight: 0.55 },
  },
  specificity: 0.92,
};

VIBE_PROFILES.push(DERNIER_WEEKEND_ETE);

export const BRUNCH_QUI_CONTINUE: VibeProfile = {
  ...getVibeIdentity("vibe_breakfast_to_brunch"),
  allowedColors: ["white", "rose", "sparkling"],
  dimensions: {
    body: { target: 2, tolerance: 1, weight: 0.8 },
    sweetness: { target: 2, tolerance: 1, weight: 0.45 },
    roundness: { target: 2, tolerance: 1, weight: 0.45 },
    acidity: { target: 5, tolerance: 1, weight: 1.35, required: true },
    tannins: { max: 1, weight: 0.45 },
    fruitIntensity: { target: 4, tolerance: 1, weight: 0.85 },
    minerality: { target: 3, tolerance: 2, weight: 0.25 },
    intensity: { target: 3, tolerance: 1, weight: 0.65 },
    complexity: { target: 3, tolerance: 2, weight: 0.25 },
    oakInfluence: { max: 2, weight: 0.55 },
    savory: { max: 3, weight: 0.2 },
  },
  specificity: 0.9,
};

VIBE_PROFILES.push(BRUNCH_QUI_CONTINUE);

// -----------------------------------------------------------------------------
// BATCH 6 — moments 34 à 41
// -----------------------------------------------------------------------------

export const MARDI_HUITRES: VibeProfile = {
  ...getVibeIdentity("vibe_tuesday_oysters"),
  allowedColors: ["white", "rose", "sparkling"],
  dimensions: {
    body: { target: 1, tolerance: 1, weight: 0.8 },
    sweetness: { target: 1, tolerance: 1, weight: 0.7 },
    roundness: { target: 1, tolerance: 1, weight: 0.7 },
    acidity: { target: 5, tolerance: 1, weight: 1.5, required: true },
    tannins: { max: 1, weight: 0.4 },
    fruitIntensity: { target: 2, tolerance: 2, weight: 0.35 },
    minerality: { target: 5, tolerance: 1, weight: 1.5, required: true },
    intensity: { target: 3, tolerance: 1, weight: 0.45 },
    complexity: { target: 3, tolerance: 2, weight: 0.3 },
    oakInfluence: { max: 1, weight: 0.7 },
    savory: { target: 2, tolerance: 2, weight: 0.25 },
  },
  specificity: 0.99,
};

VIBE_PROFILES.push(MARDI_HUITRES);

export const CHIPS: VibeProfile = {
  ...getVibeIdentity("vibe_chips"),
  dimensions: {
    body: { target: 2, tolerance: 1, weight: 0.65 },
    sweetness: { target: 1, tolerance: 2, weight: 0.35 },
    roundness: { target: 2, tolerance: 1, weight: 0.45 },
    acidity: { target: 5, tolerance: 1, weight: 1.35, required: true },
    tannins: { max: 2, weight: 0.4 },
    fruitIntensity: { target: 3, tolerance: 2, weight: 0.5 },
    minerality: { target: 4, tolerance: 1, weight: 0.75 },
    intensity: { target: 3, tolerance: 1, weight: 0.55 },
    complexity: { target: 2, tolerance: 2, weight: 0.25 },
    oakInfluence: { max: 2, weight: 0.55 },
    savory: { target: 3, tolerance: 2, weight: 0.35 },
  },
  specificity: 0.92,
};

VIBE_PROFILES.push(CHIPS);

export const TABLE_PETITES_AFFAIRES: VibeProfile = {
  ...getVibeIdentity("vibe_small_things_table"),
  dimensions: {
    body: { target: 3, tolerance: 2, weight: 0.55 },
    sweetness: { target: 1, tolerance: 2, weight: 0.3 },
    roundness: { target: 3, tolerance: 2, weight: 0.45 },
    acidity: { target: 4, tolerance: 1, weight: 1.0, required: true },
    tannins: { target: 2, tolerance: 2, weight: 0.3 },
    fruitIntensity: { target: 3, tolerance: 2, weight: 0.55 },
    minerality: { target: 3, tolerance: 2, weight: 0.3 },
    intensity: { target: 3, tolerance: 1, weight: 0.65 },
    complexity: { target: 4, tolerance: 1, weight: 0.65 },
    oakInfluence: { max: 3, weight: 0.3 },
    savory: { target: 4, tolerance: 1, weight: 0.8 },
  },
  specificity: 0.8,
};

VIBE_PROFILES.push(TABLE_PETITES_AFFAIRES);

export const MANGE_TARD: VibeProfile = {
  ...getVibeIdentity("vibe_late_dinner"),
  dimensions: {
    body: { target: 2, tolerance: 1, weight: 0.85 },
    sweetness: { target: 1, tolerance: 1, weight: 0.45 },
    roundness: { target: 2, tolerance: 1, weight: 0.5 },
    acidity: { target: 4, tolerance: 1, weight: 1.1, required: true },
    tannins: { max: 2, weight: 0.45 },
    fruitIntensity: { target: 3, tolerance: 1, weight: 0.55 },
    minerality: { target: 3, tolerance: 2, weight: 0.3 },
    intensity: { target: 3, tolerance: 1, weight: 0.55 },
    complexity: { target: 3, tolerance: 2, weight: 0.3 },
    oakInfluence: { max: 2, weight: 0.55 },
    savory: { target: 3, tolerance: 2, weight: 0.35 },
  },
  specificity: 0.82,
};

VIBE_PROFILES.push(MANGE_TARD);

export const SOUPER_DIMANCHE: VibeProfile = {
  ...getVibeIdentity("vibe_sunday_dinner"),
  dimensions: {
    body: { target: 3, tolerance: 1, weight: 0.8 },
    sweetness: { target: 1, tolerance: 2, weight: 0.3 },
    roundness: { target: 3, tolerance: 1, weight: 0.7 },
    acidity: { target: 4, tolerance: 2, weight: 0.8 },
    tannins: { target: 3, tolerance: 2, weight: 0.4 },
    fruitIntensity: { target: 3, tolerance: 2, weight: 0.5 },
    minerality: { target: 3, tolerance: 2, weight: 0.25 },
    intensity: { target: 3, tolerance: 1, weight: 0.7 },
    complexity: { target: 4, tolerance: 1, weight: 0.75 },
    oakInfluence: { target: 2, tolerance: 2, weight: 0.3 },
    savory: { target: 4, tolerance: 1, weight: 0.75 },
  },
  specificity: 0.79,
};

VIBE_PROFILES.push(SOUPER_DIMANCHE);

export const PATES_PARmesan: VibeProfile = {
  ...getVibeIdentity("vibe_pasta_parmesan"),
  dimensions: {
    body: { target: 3, tolerance: 1, weight: 0.8 },
    sweetness: { target: 1, tolerance: 1, weight: 0.4 },
    roundness: { target: 4, tolerance: 1, weight: 1.0 },
    acidity: { target: 4, tolerance: 1, weight: 1.0 },
    tannins: { target: 2, tolerance: 2, weight: 0.25 },
    fruitIntensity: { target: 3, tolerance: 2, weight: 0.45 },
    minerality: { target: 2, tolerance: 2, weight: 0.15 },
    intensity: { target: 3, tolerance: 1, weight: 0.65 },
    complexity: { target: 3, tolerance: 2, weight: 0.35 },
    oakInfluence: { target: 2, tolerance: 2, weight: 0.3 },
    savory: { target: 5, tolerance: 1, weight: 1.35, required: true },
  },
  specificity: 0.91,
};

VIBE_PROFILES.push(PATES_PARmesan);

export const RECOIT_RELAX: VibeProfile = {
  ...getVibeIdentity("vibe_relaxed_hosting"),
  dimensions: {
    body: { target: 3, tolerance: 2, weight: 0.55 },
    sweetness: { target: 1, tolerance: 2, weight: 0.3 },
    roundness: { target: 3, tolerance: 2, weight: 0.5 },
    acidity: { target: 4, tolerance: 2, weight: 0.75 },
    tannins: { target: 2, tolerance: 2, weight: 0.3 },
    fruitIntensity: { target: 3, tolerance: 2, weight: 0.55 },
    minerality: { target: 3, tolerance: 2, weight: 0.25 },
    intensity: { target: 3, tolerance: 1, weight: 0.65 },
    complexity: { target: 4, tolerance: 1, weight: 0.8, required: true },
    oakInfluence: { max: 3, weight: 0.3 },
    savory: { target: 3, tolerance: 2, weight: 0.4 },
  },
  specificity: 0.68,
};

VIBE_PROFILES.push(RECOIT_RELAX);

export const APPORTE_CHEZ_AMIS: VibeProfile = {
  ...getVibeIdentity("vibe_bring_to_friends"),
  dimensions: {
    body: { target: 3, tolerance: 2, weight: 0.5 },
    sweetness: { target: 1, tolerance: 2, weight: 0.3 },
    roundness: { target: 3, tolerance: 2, weight: 0.5 },
    acidity: { target: 4, tolerance: 2, weight: 0.7 },
    tannins: { target: 2, tolerance: 2, weight: 0.3 },
    fruitIntensity: { target: 4, tolerance: 2, weight: 0.65 },
    minerality: { target: 3, tolerance: 2, weight: 0.2 },
    intensity: { target: 3, tolerance: 1, weight: 0.65 },
    complexity: { target: 4, tolerance: 1, weight: 0.85, required: true },
    oakInfluence: { max: 3, weight: 0.3 },
    savory: { target: 3, tolerance: 2, weight: 0.35 },
  },
  specificity: 0.66,
};

VIBE_PROFILES.push(APPORTE_CHEZ_AMIS);

// -----------------------------------------------------------------------------
// BATCH 7 — moments 42 à 50 (44 déjà renuméroté éditorialement)
// -----------------------------------------------------------------------------

export const DEBUTANT_VIN: VibeProfile = {
  ...getVibeIdentity("vibe_new_to_wine"),
  dimensions: {
    body: { target: 2, tolerance: 1, weight: 0.8 },
    sweetness: { target: 2, tolerance: 2, weight: 0.4 },
    roundness: { target: 4, tolerance: 1, weight: 1.0, required: true },
    acidity: { target: 3, tolerance: 2, weight: 0.4 },
    tannins: { max: 2, weight: 0.9 },
    fruitIntensity: { target: 5, tolerance: 1, weight: 1.2, required: true },
    minerality: { target: 2, tolerance: 2, weight: 0.2 },
    intensity: { target: 3, tolerance: 1, weight: 0.55 },
    complexity: { target: 2, tolerance: 2, weight: 0.25 },
    oakInfluence: { max: 2, weight: 0.5 },
    savory: { max: 3, weight: 0.4 },
  },
  specificity: 0.9,
};

VIBE_PROFILES.push(DEBUTANT_VIN);

export const POUR_WINE_PERSON: VibeProfile = {
  ...getVibeIdentity("vibe_wine_person"),
  dimensions: {
    body: { target: 3, tolerance: 2, weight: 0.35 },
    sweetness: { target: 1, tolerance: 2, weight: 0.25 },
    roundness: { target: 3, tolerance: 2, weight: 0.3 },
    acidity: { target: 4, tolerance: 2, weight: 0.45 },
    tannins: { target: 3, tolerance: 2, weight: 0.3 },
    fruitIntensity: { target: 3, tolerance: 2, weight: 0.35 },
    minerality: { target: 4, tolerance: 1, weight: 0.7 },
    intensity: { target: 4, tolerance: 1, weight: 0.75 },
    complexity: { target: 5, tolerance: 1, weight: 1.5, required: true },
    oakInfluence: { target: 2, tolerance: 2, weight: 0.25 },
    savory: { target: 4, tolerance: 1, weight: 0.75 },
  },
  specificity: 0.96,
};

VIBE_PROFILES.push(POUR_WINE_PERSON);

export const HORS_SENTIERS_BATTUS: VibeProfile = {
  ...getVibeIdentity("vibe_off_the_beaten_path"),
  dimensions: {
    body: { target: 3, tolerance: 2, weight: 0.25 },
    sweetness: { target: 1, tolerance: 2, weight: 0.2 },
    roundness: { target: 3, tolerance: 2, weight: 0.25 },
    acidity: { target: 4, tolerance: 2, weight: 0.45 },
    tannins: { target: 3, tolerance: 2, weight: 0.25 },
    fruitIntensity: { target: 3, tolerance: 2, weight: 0.3 },
    minerality: { target: 4, tolerance: 1, weight: 0.65 },
    intensity: { target: 4, tolerance: 1, weight: 0.75 },
    complexity: { target: 5, tolerance: 1, weight: 1.35, required: true },
    oakInfluence: { target: 2, tolerance: 2, weight: 0.2 },
    savory: { target: 5, tolerance: 1, weight: 1.0 },
  },
  specificity: 0.98,
};

VIBE_PROFILES.push(HORS_SENTIERS_BATTUS);

export const AUCUNE_IDEE: VibeProfile = {
  ...getVibeIdentity("vibe_no_idea"),
  dimensions: {
    body: { target: 3, tolerance: 2, weight: 0.6 },
    sweetness: { target: 1, tolerance: 2, weight: 0.35 },
    roundness: { target: 3, tolerance: 2, weight: 0.55 },
    acidity: { target: 4, tolerance: 2, weight: 0.7 },
    tannins: { target: 2, tolerance: 2, weight: 0.35 },
    fruitIntensity: { target: 3, tolerance: 2, weight: 0.6 },
    minerality: { target: 3, tolerance: 2, weight: 0.3 },
    intensity: { target: 3, tolerance: 1, weight: 0.7 },
    complexity: { target: 3, tolerance: 2, weight: 0.45 },
    oakInfluence: { max: 3, weight: 0.3 },
    savory: { target: 3, tolerance: 2, weight: 0.35 },
  },
  specificity: 0.42,
};

VIBE_PROFILES.push(AUCUNE_IDEE);

export const LEGER_PAS_PLATE: VibeProfile = {
  ...getVibeIdentity("vibe_light_not_boring"),
  dimensions: {
    body: { target: 2, tolerance: 1, weight: 1.2, required: true },
    sweetness: { target: 1, tolerance: 2, weight: 0.3 },
    roundness: { target: 2, tolerance: 1, weight: 0.55 },
    acidity: { target: 5, tolerance: 1, weight: 1.2, required: true },
    tannins: { max: 2, weight: 0.75 },
    fruitIntensity: { target: 4, tolerance: 1, weight: 0.9 },
    minerality: { target: 3, tolerance: 2, weight: 0.3 },
    intensity: { target: 4, tolerance: 1, weight: 0.8 },
    complexity: { target: 3, tolerance: 1, weight: 0.55 },
    oakInfluence: { max: 2, weight: 0.55 },
    savory: { target: 2, tolerance: 2, weight: 0.25 },
  },
  specificity: 0.95,
};

VIBE_PROFILES.push(LEGER_PAS_PLATE);

export const PETIT_SOUPER_GROSSE_BOUTEILLE: VibeProfile = {
  ...getVibeIdentity("vibe_small_dinner_big_bottle"),
  dimensions: {
    body: { target: 4, tolerance: 1, weight: 0.8 },
    sweetness: { target: 1, tolerance: 2, weight: 0.25 },
    roundness: { target: 4, tolerance: 1, weight: 0.7 },
    acidity: { target: 4, tolerance: 2, weight: 0.55 },
    tannins: { target: 4, tolerance: 1, weight: 0.55 },
    fruitIntensity: { target: 4, tolerance: 2, weight: 0.45 },
    minerality: { target: 4, tolerance: 2, weight: 0.45 },
    intensity: { target: 5, tolerance: 1, weight: 1.0, required: true },
    complexity: { target: 5, tolerance: 1, weight: 1.5, required: true },
    oakInfluence: { target: 3, tolerance: 2, weight: 0.35 },
    savory: { target: 4, tolerance: 1, weight: 0.65 },
  },
  specificity: 1.0,
};

VIBE_PROFILES.push(PETIT_SOUPER_GROSSE_BOUTEILLE);

export const ENCORE_UN_VERRE: VibeProfile = {
  ...getVibeIdentity("vibe_another_glass"),
  dimensions: {
    body: { target: 2, tolerance: 1, weight: 0.9 },
    sweetness: { target: 1, tolerance: 2, weight: 0.3 },
    roundness: { target: 3, tolerance: 1, weight: 0.55 },
    acidity: { target: 4, tolerance: 1, weight: 1.0, required: true },
    tannins: { max: 2, weight: 0.65 },
    fruitIntensity: { target: 3, tolerance: 2, weight: 0.5 },
    minerality: { target: 3, tolerance: 2, weight: 0.25 },
    intensity: { target: 3, tolerance: 1, weight: 0.65 },
    complexity: { target: 3, tolerance: 2, weight: 0.3 },
    oakInfluence: { max: 2, weight: 0.5 },
    savory: { target: 2, tolerance: 2, weight: 0.25 },
  },
  specificity: 0.75,
};

VIBE_PROFILES.push(ENCORE_UN_VERRE);

export const ON_OUVRE_QUOI: VibeProfile = {
  ...getVibeIdentity("vibe_what_do_we_open"),
  dimensions: {
    body: { target: 3, tolerance: 2, weight: 0.55 },
    sweetness: { target: 1, tolerance: 2, weight: 0.35 },
    roundness: { target: 3, tolerance: 2, weight: 0.55 },
    acidity: { target: 4, tolerance: 2, weight: 0.7 },
    tannins: { target: 2, tolerance: 2, weight: 0.35 },
    fruitIntensity: { target: 4, tolerance: 2, weight: 0.6 },
    minerality: { target: 3, tolerance: 2, weight: 0.3 },
    intensity: { target: 3, tolerance: 1, weight: 0.65 },
    complexity: { target: 3, tolerance: 2, weight: 0.45 },
    oakInfluence: { max: 3, weight: 0.3 },
    savory: { target: 3, tolerance: 2, weight: 0.35 },
  },
  specificity: 0.4,
};

VIBE_PROFILES.push(ON_OUVRE_QUOI);
