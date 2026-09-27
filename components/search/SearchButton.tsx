"use client";

type SearchButtonProps = {
  locale?: "fr" | "en";
};

export function SearchButton({ locale = "fr" }: SearchButtonProps) {
  const isEnglish = locale === "en";

  return (
    <button
      type="button"
      onClick={() =>
        window.dispatchEvent(new CustomEvent("open-search"))
      }
      aria-label={isEnglish ? "Open search" : "Ouvrir la recherche"}
      className="flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-50"
    >

      <span
        aria-hidden="true"
        className="relative block h-4 w-4 rounded-full border border-current after:absolute after:-bottom-[3px] after:-right-[3px] after:h-[6px] after:w-px after:rotate-[-45deg] after:bg-current"
      />

      <kbd className="hidden border-b border-current pb-0.5 text-[0.58rem] font-normal tracking-normal opacity-45 lg:inline">
        ⌘K
      </kbd>
    </button>
  );
}
