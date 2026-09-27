"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const itemsFr = [
  { label: "Aperçu", href: "/ma-cave" },
  { label: "Carnet", href: "/mon-carnet" },
  { label: "Favoris", href: "/favoris" },
  { label: "Listes", href: "/mes-listes" },
  { label: "Préférences", href: "/mes-preferences" },
];

const itemsEn = [
  { label: "Overview", href: "/en/cellar" },
  { label: "Notebook", href: "/en/notebook" },
  { label: "Favorites", href: "/en/favorites" },
  { label: "Lists", href: "/en/lists" },
  { label: "Preferences", href: "/en/preferences" },
];

export default function CaveNav() {
  const pathname = usePathname();
  const isEnglish = pathname?.startsWith("/en") ?? false;
  const items = isEnglish ? itemsEn : itemsFr;

  return (
    <nav
      aria-label={isEnglish ? "My cellar navigation" : "Navigation de Ma cave"}
      className="border-b border-[var(--lpv-line)]"
    >
      <div className="lpv-container overflow-x-auto">
        <div className="flex min-w-max items-center gap-7 md:gap-10">
          {items.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative py-5 text-[0.66rem] font-medium uppercase tracking-[0.16em] transition-opacity md:py-6 ${
                  active
                    ? "text-[var(--lpv-ink)]"
                    : "text-[var(--lpv-muted)] hover:opacity-60"
                }`}
              >
                {item.label}

                {active ? (
                  <span className="absolute inset-x-0 bottom-0 h-px bg-[var(--lpv-ink)]" />
                ) : null}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
