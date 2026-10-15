"use client";

type Props = {
  value: string;
  onChange: (value: string) => void;
  locale?: "fr" | "en";
};

export function SearchInput({
  value,
  onChange,
  locale = "fr",
}: Props) {
  const isEn = locale === "en";

  return (
    <div className="px-6 py-9 md:px-8 md:py-11">
      <label htmlFor="global-search" className="sr-only">
        {isEn ? "Search" : "Rechercher"}
      </label>

      <input
        id="global-search"
        autoFocus
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={isEn ? "A wine, producer, region…" : "Un vin, un producteur, une région…"}
        className="lpv-display w-full border-0 bg-transparent p-0 text-[clamp(1.9rem,4vw,3.4rem)] font-normal leading-[1.05] tracking-[-0.02em] text-[var(--lpv-ink)] outline-none placeholder:text-[var(--lpv-muted)]/40"
      />
    </div>
  );
}
