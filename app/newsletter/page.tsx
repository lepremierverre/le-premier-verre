import Link from "next/link";
import NewsletterForm from "@/components/newsletter/NewsletterForm";

export const metadata = {
  title: "Infolettre | Le Premier Verre",
  description:
    "Bouteilles, producteurs, bonnes adresses et découvertes du Premier Verre.",
  alternates: {
    canonical: "/newsletter",
    languages: {
      "fr-CA": "/newsletter",
      "en-CA": "/en/newsletter",
      "x-default": "/newsletter",
    },
  },
};

export default function NewsletterPage() {
  return (
    <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
      <div className="mx-auto max-w-[920px] px-6 pb-24 pt-16 sm:px-10 md:pb-32 md:pt-24">
        <Link
          href="/"
          className="text-[0.68rem] font-medium uppercase tracking-[0.16em] transition-opacity hover:opacity-50"
        >
          ← Le Premier Verre
        </Link>

        <div className="mt-28 md:mt-36">
          <h1 className="max-w-[760px] text-[clamp(3.5rem,8vw,6.4rem)] font-medium leading-[0.94] tracking-[-0.06em]">
            Le prochain verre commence ici.
          </h1>

          <div className="mt-12 max-w-[650px] space-y-5 text-[0.98rem] leading-8 md:mt-14 md:text-[1.02rem]">
            <p>
              De temps en temps, on rassemble dans votre boîte courriel les
              bouteilles qu’on a envie de faire découvrir, les producteurs
              qu’on suit, les bonnes adresses qu’on trouve et les histoires
              qui valent la peine d’être racontées.
            </p>

            <p>
              C’est aussi là qu’on partage les nouveaux guides, nos sélections,
              les événements du Premier Verre et quelques découvertes qu’on
              garde pour les abonnés.
            </p>
          </div>

          <NewsletterForm />
        </div>
      </div>
    </main>
  );
}
