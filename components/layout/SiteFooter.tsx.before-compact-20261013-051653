"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const informationFr = [
  ["À propos", "/a-propos"],
  ["Contact", "/contact"],
  ["Infolettre", "/newsletter"],
  ["Confidentialité", "/politique-confidentialite"],
];

const informationEn = [
  ["About", "/en/about"],
  ["Contact", "/en/contact"],
  ["Newsletter", "/en/newsletter"],
  ["Privacy", "/en/privacy-policy"],
];

export function SiteFooter() {
  const pathname = usePathname();
  const isEnglish = pathname?.startsWith("/en");
  const information = isEnglish ? informationEn : informationFr;

  return (
    <footer className="bg-[var(--lpv-cocoa)] text-[var(--lpv-paper-light)]">
      <div className="lpv-container py-16 md:py-24">
        <div className="grid gap-16 lg:grid-cols-[1.6fr_0.4fr]">
          <div>
            <p className="lpv-kicker text-white/55">
              Le Premier Verre
            </p>

            <h2 className="lpv-display mt-8 max-w-4xl text-[clamp(3.8rem,8vw,8.5rem)] leading-[0.86]">
              {isEnglish ? "Wine made simpler." : "Boire moins compliqué."}
            </h2>

            <p className="mt-8 max-w-lg text-sm leading-7 text-white/62">
              {isEnglish
                ? "Bottles, people and places worth taking the time to discover."
                : "Des bouteilles, des personnes et des endroits qui méritent qu’on s’y attarde."}
            </p>
          </div>

          <div>
            <p className="lpv-kicker text-white/40">
              {isEnglish ? "The project" : "Le projet"}
            </p>

            <nav
              className="mt-7 flex flex-col gap-3"
              aria-label={isEnglish ? "Project information" : "Informations sur le projet"}
            >
              {information.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="w-fit text-sm text-white/68 transition-opacity hover:opacity-50"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-5 border-t border-white/20 pt-6 text-[0.62rem] uppercase tracking-[0.17em] text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Le Premier Verre</p>

          <p>
            {isEnglish
              ? "Québec · Bottles, places, stories"
              : "Québec · Des bouteilles, des lieux, des histoires"}
          </p>
        </div>
      </div>
    </footer>
  );
}
