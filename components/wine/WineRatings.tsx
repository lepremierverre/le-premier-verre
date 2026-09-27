type Props = {
  body?: number;
  sweetness?: number;
  roundness?: number;
  locale?: "fr" | "en";
};

function ProfileLine({
  left,
  right,
  value,
}: {
  left: string;
  right: string;
  value?: number;
}) {
  if (typeof value !== "number") return null;

  const score = Math.max(1, Math.min(5, value));

  return (
    <div className="border-t border-[var(--lpv-line)] py-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <span className="text-sm text-[var(--lpv-ink)]">{left}</span>
        <span className="text-sm text-[var(--lpv-ink)]">{right}</span>
      </div>

      <div className="relative h-[3px] bg-[var(--lpv-line)]">
        <span
          className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--lpv-ink)]"
          style={{ left: `${((score - 1) / 4) * 100}%` }}
        />
      </div>
    </div>
  );
}

export default function WineRatings({
  body,
  sweetness,
  roundness,
  locale = "fr",
}: Props) {
  const isEnglish = locale === "en";
  if (
    typeof body !== "number" &&
    typeof sweetness !== "number" &&
    typeof roundness !== "number"
  ) {
    return null;
  }

  return (
    <section className="border-b border-[var(--lpv-line)] py-16 md:py-20">
      <div className="grid gap-10 md:grid-cols-[0.38fr_0.62fr]">
        <div>
          <p className="lpv-kicker text-[var(--lpv-cocoa)]">
            {isEnglish ? "Profile" : "Profil"}
          </p>

          <h2 className="lpv-display mt-6 text-5xl leading-[0.9] md:text-6xl">
            {isEnglish ? "On the palate." : "En bouche."}
          </h2>
        </div>

        <div className="border-b border-[var(--lpv-line)]">
          <ProfileLine
            left={isEnglish ? "Light" : "Léger"}
            right={isEnglish ? "Full-bodied" : "Puissant"}
            value={body}
          />
          <ProfileLine
            left={isEnglish ? "Dry" : "Sec"}
            right={isEnglish ? "Sweet" : "Doux"}
            value={sweetness}
          />
          <ProfileLine
            left={isEnglish ? "Crisp" : "Vif"}
            right={isEnglish ? "Round" : "Rond"}
            value={roundness}
          />
        </div>
      </div>
    </section>
  );
}
