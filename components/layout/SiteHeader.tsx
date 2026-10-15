"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  SignOutButton,
  useUser,
} from "@clerk/nextjs";

import { SearchButton } from "@/components/search/SearchButton";

const navItemsFr = [
  ["Ce soir", "/ce-soir"],
  ["Bouteilles", "/vins"],
  ["Producteurs", "/producteurs"],
  ["Régions", "/regions"],
  ["Cépages", "/cepages"],
  ["Accords", "/accords"],
  ["Bonnes adresses", "/bonnes-adresses"],
  ["À lire", "/guides"],
];

const navItemsEn = [
  ["Tonight", "/en/tonight"],
  ["Bottles", "/en/wines"],
  ["Producers", "/en/producers"],
  ["Regions", "/en/regions"],
  ["Grapes", "/en/grapes"],
  ["Pairings", "/en/pairings"],
  ["Places", "/en/places"],
  ["Read", "/en/guides"],
];

const bilingualRoutes = [
  ["/ce-soir", "/en/tonight"],
  ["/vins", "/en/wines"],
  ["/sans-alcool", "/en/alcohol-free"],
  ["/producteurs", "/en/producers"],
  ["/regions", "/en/regions"],
  ["/cepages", "/en/grapes"],
  ["/accords", "/en/pairings"],
  ["/bonnes-adresses", "/en/places"],
  ["/guides", "/en/guides"],
  ["/blog", "/en/journal"],
  ["/recherche", "/en/search"],
  ["/a-propos", "/en/about"],
  ["/contact", "/en/contact"],
  ["/newsletter", "/en/newsletter"],
  ["/politique-confidentialite", "/en/privacy-policy"],
  ["/connexion", "/en/sign-in"],
  ["/inscription", "/en/sign-up"],
  ["/ma-cave", "/en/cellar"],
  ["/favoris", "/en/favorites"],
  ["/mon-carnet", "/en/notebook"],
  ["/mes-listes", "/en/lists"],
  ["/mes-preferences", "/en/preferences"],
] as const;

function getLocalizedPath(pathname: string, target: "fr" | "en") {
  if (pathname === "/" || pathname === "/en") {
    return target === "en" ? "/en" : "/";
  }

  for (const [frBase, enBase] of bilingualRoutes) {
    if (pathname === frBase || pathname.startsWith(`${frBase}/`)) {
      const suffix = pathname.slice(frBase.length);
      return target === "en" ? `${enBase}${suffix}` : `${frBase}${suffix}`;
    }

    if (pathname === enBase || pathname.startsWith(`${enBase}/`)) {
      const suffix = pathname.slice(enBase.length);
      return target === "fr" ? `${frBase}${suffix}` : `${enBase}${suffix}`;
    }
  }

  return target === "en" ? "/en" : "/";
}

function getInitials(
  firstName?: string | null,
  lastName?: string | null,
  email?: string | null
) {
  const initials = [firstName, lastName]
    .filter(Boolean)
    .map((value) => value?.trim().charAt(0).toUpperCase())
    .join("");

  if (initials) return initials.slice(0, 2);

  return email?.trim().charAt(0).toUpperCase() || "M";
}

export function SiteHeader() {
  const pathname = usePathname();
  const locale = pathname?.startsWith("/en") ? "en" : "fr";
  const isEnglish = locale === "en";
  const frenchPath = getLocalizedPath(pathname ?? "/", "fr");
  const englishPath = getLocalizedPath(pathname ?? "/", "en");

  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const accountRef = useRef<HTMLDivElement>(null);
  const { isLoaded, isSignedIn, user } = useUser();

  const initials = getInitials(
    user?.firstName,
    user?.lastName,
    user?.primaryEmailAddress?.emailAddress
  );

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        setAccountOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setAccountOpen(false);
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const prelaunchPages = [
    "/disponible-bientot",
    "/en/disponible-bientot",
  ];

  if (prelaunchPages.includes(pathname ?? "")) {
    return null;
  }

  return (
    <>
      <header className="relative z-[9000] border-b border-[var(--lpv-line)] bg-[var(--lpv-paper)]">
        <div className="lpv-container flex h-[78px] items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-5">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={isEnglish ? "Open menu" : "Ouvrir le menu"}
              className="group flex h-10 w-10 items-center justify-center rounded-full border border-[var(--lpv-ink)] transition-colors hover:bg-[var(--lpv-ink)] hover:text-[var(--lpv-paper-light)]"
            >
              <span className="flex w-[17px] flex-col gap-[4px]">
                <span className="h-px w-full bg-current" />
                <span className="h-px w-[12px] bg-current transition-all group-hover:w-full" />
              </span>
            </button>

            <Link
              href={isEnglish ? "/en" : "/"}
              className="lpv-display text-[1.65rem] leading-none sm:text-[2rem]"
            >
              Le Premier Verre
            </Link>
          </div>

          <div className="flex items-center gap-3 sm:gap-5 md:gap-7">
            <div className="flex items-center gap-1.5 text-[0.56rem] font-semibold uppercase tracking-[0.12em] sm:gap-2 sm:text-[0.62rem] sm:tracking-[0.16em]">
              <Link
                href={frenchPath}
                className={
                  !isEnglish
                    ? "opacity-100"
                    : "opacity-35 transition-opacity hover:opacity-100"
                }
              >
                FR
              </Link>

              <span className="opacity-25">|</span>

              <Link
                href={englishPath}
                className={
                  isEnglish
                    ? "opacity-100"
                    : "opacity-35 transition-opacity hover:opacity-100"
                }
              >
                EN
              </Link>
            </div>

            <SearchButton locale={locale} />

            {!isLoaded ? (
              <span
                aria-hidden="true"
                className="h-9 w-9 animate-pulse rounded-full border border-[var(--lpv-line)]"
              />
            ) : isSignedIn ? (
              <div
                ref={accountRef}
                className="relative"
              >
                <button
                  type="button"
                  onClick={() => setAccountOpen((current) => !current)}
                  aria-label={isEnglish ? "Open account menu" : "Ouvrir le menu du compte"}
                  aria-expanded={accountOpen}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--lpv-ink)] text-[0.68rem] font-semibold uppercase tracking-[0.08em] transition-colors hover:bg-[var(--lpv-ink)] hover:text-[var(--lpv-paper-light)]"
                >
                  {initials}
                </button>

                {accountOpen ? (
                  <div className="absolute right-0 top-[calc(100%+12px)] w-[250px] border border-[var(--lpv-line)] bg-[var(--lpv-paper)] px-5 py-5">
                    <div className="pb-5">
                      <p className="truncate text-[15px] font-medium leading-5 text-[var(--lpv-ink)]">
                        {user.fullName ||
                          user.primaryEmailAddress?.emailAddress}
                      </p>

                      <p className="mt-1.5 text-[0.64rem] text-[var(--lpv-muted)]">
                        {isEnglish ? "My account" : "Mon compte"}
                      </p>
                    </div>

                    <nav className="border-t border-[var(--lpv-line)] py-2">
                      <Link
                        href={isEnglish ? "/en/cellar" : "/ma-cave"}
                        onClick={() => setAccountOpen(false)}
                        className="group flex items-center justify-between py-3 text-[15px] text-[var(--lpv-ink)] transition-opacity hover:opacity-50"
                      >
                        <span>{isEnglish ? "My cellar" : "Ma cave"}</span>
                        <span
                          aria-hidden="true"
                          className="text-sm transition-transform duration-300 group-hover:translate-x-0.5"
                        >
                          →
                        </span>
                      </Link>

                      <Link
                        href={isEnglish ? "/en/profile" : "/mon-profil"}
                        onClick={() => setAccountOpen(false)}
                        className="group flex items-center justify-between py-3 text-[15px] text-[var(--lpv-ink)] transition-opacity hover:opacity-50"
                      >
                        <span>{isEnglish ? "Profile" : "Profil"}</span>
                        <span
                          aria-hidden="true"
                          className="text-sm transition-transform duration-300 group-hover:translate-x-0.5"
                        >
                          →
                        </span>
                      </Link>
                    </nav>

                    <div className="border-t border-[var(--lpv-line)] pt-4">
                      <SignOutButton redirectUrl={isEnglish ? "/en" : "/"}>
                        <button
                          type="button"
                          className="text-left text-[13px] text-[var(--lpv-muted)] transition-colors hover:text-[var(--lpv-ink)]"
                        >
                          {isEnglish ? "Sign out" : "Se déconnecter"}
                        </button>
                      </SignOutButton>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <Link
                href={isEnglish ? "/en/sign-in" : "/connexion"}
                className="hidden text-[0.68rem] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-50 sm:inline"
              >
                {isEnglish ? "Sign in" : "Connexion"}
              </Link>
            )}
          </div>
        </div>
      </header>

      {menuOpen ? (
        <div className="fixed inset-0 z-[10000]">
          <button
            type="button"
            aria-label={isEnglish ? "Close menu" : "Fermer le menu"}
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-black/32"
          />

          {isEnglish ? (
            <aside className="lpv-fade-in absolute inset-y-0 left-0 flex w-full max-w-[680px] flex-col overflow-y-auto bg-[var(--lpv-cocoa)] px-6 py-6 text-[var(--lpv-paper-light)] sm:px-10 sm:py-9">
              {/* HEADER */}
              <div className="flex items-center justify-between border-b border-white/20 pb-6">
                <p className="lpv-display text-2xl">
                  Le Premier Verre
                </p>

                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setMenuOpen(false)}
                  className="flex h-10 w-10 items-center justify-center text-[2rem] font-light leading-none text-white/70 transition-opacity hover:text-white"
                >
                  ×
                </button>
              </div>

              {/* MAIN NAVIGATION */}
              <div className="flex flex-1 flex-col justify-center py-10 sm:py-12">

                <nav
                  aria-label="Main navigation"
                  className="flex flex-col"
                >
                  {[
                    ["Wines", "/en/wines"],
                    ["Producers", "/en/producers"],
                    ["Places", "/en/places"],
                    ["Pairings", "/en/pairings"],
                    ["Read", "/en/guides"],
                  ].map(([label, href], index) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      className={`group py-2.5 sm:py-3 ${
                        index === 3 ? "mt-5 sm:mt-7" : ""
                      }`}
                    >
                      <span className="lpv-display block text-[clamp(2.8rem,7vw,4.7rem)] leading-[0.94] tracking-[-0.045em] transition-opacity duration-300 group-hover:opacity-55">
                        {label}
                      </span>
                    </Link>
                  ))}
                </nav>

                {/* TONIGHT */}
                <div className="mt-9 pt-7 sm:mt-11 sm:pt-8">
                  <Link
                    href="/en/tonight"
                    onClick={() => setMenuOpen(false)}
                    className="group inline-flex items-center gap-5 border border-white/55 px-5 py-3.5 text-white transition-colors duration-300 hover:bg-white hover:text-[var(--lpv-cocoa)]"
                  >
                    <span className="text-[0.68rem] font-medium uppercase tracking-[0.16em]">
                      What are we drinking tonight?
                    </span>

                    <span className="text-xs transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </div>

              </div>

              {/* MENU FOOTER */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/20 pt-5 text-[0.6rem] font-medium uppercase tracking-[0.14em] text-white/50">

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setAccountOpen(true);
                  }}
                  className="transition-colors hover:text-white"
                >
                  My account
                </button>

                <span className="text-white/20">·</span>

                <div className="flex items-center gap-2">
                  <Link
                    href={frenchPath}
                    onClick={() => setMenuOpen(false)}
                    className="transition-colors hover:text-white"
                  >
                    FR
                  </Link>

                  <span className="text-white/25">/</span>

                  <Link
                    href={englishPath}
                    onClick={() => setMenuOpen(false)}
                    className="text-white"
                  >
                    EN
                  </Link>
                </div>

                <span className="text-white/20">·</span>

                <a
                  href="https://www.instagram.com/lepremierverre/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                >
                  Instagram
                </a>

              </div>
            </aside>
          ) : (
            <aside className="lpv-fade-in absolute inset-y-0 left-0 flex w-full max-w-[680px] flex-col overflow-y-auto bg-[var(--lpv-cocoa)] px-6 py-6 text-[var(--lpv-paper-light)] sm:px-10 sm:py-9">

              {/* ENTÊTE */}
              <div className="flex items-center justify-between border-b border-white/20 pb-6">
                <p className="lpv-display text-2xl">
                  Le Premier Verre
                </p>

                <button
                  type="button"
                  aria-label="Fermer le menu"
                  onClick={() => setMenuOpen(false)}
                  className="flex h-10 w-10 items-center justify-center text-[2rem] font-light leading-none text-white/70 transition-opacity hover:text-white"
                >
                  ×
                </button>
              </div>

              {/* NAVIGATION PRINCIPALE */}
              <div className="flex flex-1 flex-col justify-center py-10 sm:py-12">

                <nav
                  aria-label="Navigation principale"
                  className="flex flex-col"
                >
                  {[
                    ["Vins", "/vins"],
                    ["Producteurs", "/producteurs"],
                    ["Bonnes adresses", "/bonnes-adresses"],
                    ["Accords", "/accords"],
                    ["À lire", "/guides"],
                  ].map(([label, href], index) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      className={`group py-2.5 sm:py-3 ${
                        index === 3 ? "mt-5 sm:mt-7" : ""
                      }`}
                    >
                      <span className="lpv-display block text-[clamp(2.8rem,7vw,4.7rem)] leading-[0.94] tracking-[-0.045em] transition-opacity duration-300 group-hover:opacity-55">
                        {label}
                      </span>
                    </Link>
                  ))}
                </nav>

                {/* CE SOIR — fonctionnalité signature */}
                <div className="mt-9 pt-7 sm:mt-11 sm:pt-8">
                  <Link
                    href="/ce-soir"
                    onClick={() => setMenuOpen(false)}
                    className="group inline-flex items-center gap-5 border border-white/55 px-5 py-3.5 text-white transition-colors duration-300 hover:bg-white hover:text-[var(--lpv-cocoa)]"
                  >
                    <span className="text-[0.68rem] font-medium uppercase tracking-[0.16em]">
                      Ce soir, on boit quoi?
                    </span>

                    <span
                      aria-hidden="true"
                      className="text-xs transition-transform duration-300 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Link>
                </div>

              </div>

              {/* PIED DU MENU */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/20 pt-5 text-[0.6rem] font-medium uppercase tracking-[0.14em] text-white/50">

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setAccountOpen(true);
                  }}
                  className="transition-colors hover:text-white"
                >
                  Mon compte
                </button>

                <span className="text-white/20">·</span>

                <div className="flex items-center gap-2">
                  <Link
                    href={frenchPath}
                    onClick={() => setMenuOpen(false)}
                    className="text-white"
                  >
                    FR
                  </Link>

                  <span className="text-white/25">/</span>

                  <Link
                    href={englishPath}
                    onClick={() => setMenuOpen(false)}
                    className="transition-colors hover:text-white"
                  >
                    EN
                  </Link>
                </div>

                <span className="text-white/20">·</span>

                <a
                  href="https://www.instagram.com/lepremierverre/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                >
                  Instagram
                </a>

              </div>

            </aside>
          )}
        </div>
      ) : null}
    </>
  );
}
