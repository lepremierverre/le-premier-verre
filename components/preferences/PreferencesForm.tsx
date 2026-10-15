"use client";

import { useEffect, useState } from "react";

type Preferences = {
  mainWineType: string;
  budget: string;
  bodyPreference: number;
  stylePreference: string;
  mainOccasion: string;
  communicationLanguage: "fr" | "en";
};

const initialPreferences: Preferences = {
  mainWineType: "",
  budget: "",
  bodyPreference: 3,
  stylePreference: "",
  mainOccasion: "",
  communicationLanguage: "fr",
};

const wineTypes = {
  fr: [
    { label: "Blanc", value: "white" },
    { label: "Rouge", value: "red" },
    { label: "Bulles", value: "sparkling" },
    { label: "Rosé", value: "rose" },
    { label: "Orange", value: "orange" },
    { label: "Je touche à tout", value: "everything" },
  ],
  en: [
    { label: "White", value: "white" },
    { label: "Red", value: "red" },
    { label: "Sparkling", value: "sparkling" },
    { label: "Rosé", value: "rose" },
    { label: "Orange", value: "orange" },
    { label: "A bit of everything", value: "everything" },
  ],
};

const budgets = {
  fr: [
    { label: "Moins de 20 $", value: "under-20" },
    { label: "20 à 30 $", value: "20-30" },
    { label: "30 à 50 $", value: "30-50" },
    { label: "50 $ et plus", value: "50-plus" },
  ],
  en: [
    { label: "Under $20", value: "under-20" },
    { label: "$20 to $30", value: "20-30" },
    { label: "$30 to $50", value: "30-50" },
    { label: "$50 and up", value: "50-plus" },
  ],
};

const styles = {
  fr: [
    { label: "Classique", value: "classic" },
    { label: "Aventureux", value: "adventurous" },
    { label: "Les deux", value: "both" },
  ],
  en: [
    { label: "Classic", value: "classic" },
    { label: "Adventurous", value: "adventurous" },
    { label: "Both", value: "both" },
  ],
};

const occasions = {
  fr: [
    { label: "Souper de semaine", value: "weeknight" },
    { label: "Recevoir", value: "hosting" },
    { label: "Découvrir", value: "discovering" },
    { label: "Offrir", value: "gifting" },
    { label: "Occasions spéciales", value: "special-occasions" },
  ],
  en: [
    { label: "Weeknight dinner", value: "weeknight" },
    { label: "Hosting", value: "hosting" },
    { label: "Discovering", value: "discovering" },
    { label: "Giving a bottle", value: "gifting" },
    { label: "Special occasions", value: "special-occasions" },
  ],
};

function ChoiceButtons({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-3 md:gap-x-7">
      {options.map((option) => {
        const selected = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={[
              "border-b px-0 py-1.5 text-sm transition-opacity md:py-2",
              selected
                ? "border-[var(--lpv-ink)] font-medium text-[var(--lpv-ink)]"
                : "border-transparent text-[var(--lpv-muted)] hover:border-[var(--lpv-line)] hover:text-[var(--lpv-ink)]",
            ].join(" ")}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export default function PreferencesForm({
  locale = "fr",
}: {
  locale?: "fr" | "en";
}) {
  const isEn = locale === "en";
  const [preferences, setPreferences] =
    useState<Preferences>({
      ...initialPreferences,
      communicationLanguage: locale,
    });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadPreferences() {
      try {
        const response = await fetch("/api/preferences");

        if (!response.ok) {
          throw new Error(
            isEn
              ? "Unable to load preferences."
              : "Impossible de charger les préférences."
          );
        }

        const data = await response.json();

        if (data.preferences) {
          setPreferences({
            mainWineType: data.preferences.mainWineType || "",
            budget: data.preferences.budget || "",
            bodyPreference: data.preferences.bodyPreference || 3,
            stylePreference: data.preferences.stylePreference || "",
            mainOccasion: data.preferences.mainOccasion || "",
            communicationLanguage:
              data.preferences.communicationLanguage === "en"
                ? "en"
                : data.preferences.communicationLanguage === "fr"
                  ? "fr"
                  : locale,
          });
        }
      } catch (error) {
        console.error(error);
        setMessage(
          isEn
            ? "Unable to load your preferences."
            : "Impossible de charger tes préférences."
        );
      } finally {
        setLoading(false);
      }
    }

    loadPreferences();
  }, []);

  function updatePreference<K extends keyof Preferences>(
    key: K,
    value: Preferences[K]
  ) {
    setPreferences((current) => ({
      ...current,
      [key]: value,
    }));

    setMessage("");
  }

  async function savePreferences() {
    if (
      !preferences.mainWineType ||
      !preferences.budget ||
      !preferences.stylePreference ||
      !preferences.mainOccasion
    ) {
      setMessage(
        isEn
          ? "Answer the five wine questions before saving."
          : "Réponds aux cinq questions sur le vin avant d’enregistrer."
      );
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferences),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            (isEn ? "Unable to save." : "Impossible d’enregistrer.")
        );
      }

      setMessage(
        isEn
          ? "Your preferences have been saved."
          : "Tes préférences sont enregistrées."
      );
    } catch (error) {
      console.error(error);
      setMessage(
        isEn
          ? "An error occurred while saving."
          : "Une erreur est survenue pendant l’enregistrement."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="lpv-container py-10 md:py-24">
        <p className="text-sm text-[var(--lpv-muted)]">
          {isEn ? "Loading your preferences…" : "Chargement de tes préférences…"}
        </p>
      </section>
    );
  }

  const questions = [
    {
      number: "01",
      title: isEn ? "I mostly drink" : "Je bois surtout",
      content: (
        <ChoiceButtons
          options={wineTypes[locale]}
          value={preferences.mainWineType}
          onChange={(value) => updatePreference("mainWineType", value)}
        />
      ),
    },
    {
      number: "02",
      title: isEn ? "My usual budget" : "Mon budget habituel",
      content: (
        <ChoiceButtons
          options={budgets[locale]}
          value={preferences.budget}
          onChange={(value) => updatePreference("budget", value)}
        />
      ),
    },
    {
      number: "03",
      title: isEn ? "I generally prefer" : "Je préfère généralement",
      content: (
        <div className="max-w-2xl">
          <div className="mb-3 flex justify-between text-sm text-[var(--lpv-muted)] md:mb-4">
            <span>{isEn ? "Light" : "Léger"}</span>
            <span>{isEn ? "Full-bodied" : "Généreux"}</span>
          </div>

          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={preferences.bodyPreference}
            onChange={(event) =>
              updatePreference(
                "bodyPreference",
                Number(event.target.value)
              )
            }
            className="w-full accent-[var(--lpv-ink)]"
          />

          <div className="mt-2 flex justify-between text-xs text-[var(--lpv-muted)] md:mt-3">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
          </div>
        </div>
      ),
    },
    {
      number: "04",
      title: isEn ? "I like" : "J’aime",
      content: (
        <ChoiceButtons
          options={styles[locale]}
          value={preferences.stylePreference}
          onChange={(value) =>
            updatePreference("stylePreference", value)
          }
        />
      ),
    },
    {
      number: "05",
      title: isEn
        ? "I mostly look for wine for"
        : "Je cherche surtout du vin pour",
      content: (
        <ChoiceButtons
          options={occasions[locale]}
          value={preferences.mainOccasion}
          onChange={(value) =>
            updatePreference("mainOccasion", value)
          }
        />
      ),
    },
    {
      number: "06",
      title: isEn
        ? "Communication language"
        : "Langue des communications",
      content: (
        <div>
          <ChoiceButtons
            options={[
              { label: "Français", value: "fr" },
              { label: "English", value: "en" },
            ]}
            value={preferences.communicationLanguage}
            onChange={(value) =>
              updatePreference(
                "communicationLanguage",
                value as "fr" | "en"
              )
            }
          />
          <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--lpv-muted)] md:mt-4">
            {isEn
              ? "This language will be used for newsletters and other communications from Le Premier Verre."
              : "Cette langue sera utilisée pour l’infolettre et les autres communications du Premier Verre."}
          </p>
        </div>
      ),
    },
  ];

  return (
    <section className="lpv-container py-8 md:py-14">
      <div>
        {questions.map((question) => (
          <div
            key={question.number}
            className="border-b border-[var(--lpv-line)] py-7 md:py-8"
          >
            <p className="mb-6 text-[1.2rem] font-medium leading-tight text-[var(--lpv-ink)] md:mb-7 md:text-[1.35rem]">
              {question.title}
            </p>

            <div className="max-w-4xl">
              {question.content}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 py-7 md:flex-row md:items-center md:justify-between md:py-9">
        <button
          type="button"
          onClick={savePreferences}
          disabled={saving}
          className="inline-flex w-fit items-center border-b border-[var(--lpv-ink)] pb-1 text-[13px] font-medium transition-opacity hover:opacity-50 disabled:opacity-35"
        >
          {saving
            ? isEn
              ? "Saving…"
              : "Enregistrement…"
            : isEn
              ? "Save my preferences"
              : "Enregistrer mes préférences"}
        </button>

        {message ? (
          <p className="text-[13px] text-[var(--lpv-muted)]">
            {message}
          </p>
        ) : null}
      </div>
    </section>
  );
}
