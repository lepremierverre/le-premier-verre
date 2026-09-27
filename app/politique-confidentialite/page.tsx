import Link from "next/link";

export const metadata = {
  title: "Politique de confidentialité | Le Premier Verre",
  description: "Politique de confidentialité du Premier Verre.",
  alternates: {
    canonical: "/politique-confidentialite",
    languages: {
      "fr-CA": "/politique-confidentialite",
      "en-CA": "/en/privacy-policy",
      "x-default": "/politique-confidentialite",
    },
  },
};

export default function PolitiqueConfidentialitePage() {
  return (
    <main className="min-h-screen bg-[#f3efe6] px-6 py-16 text-[#211d19] sm:px-10 md:py-24">
      <article className="mx-auto max-w-[820px]">
        <Link
          href="/"
          className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-[#776e65] transition-opacity hover:opacity-50"
        >
          ← Le Premier Verre
        </Link>

        <header className="mt-20 md:mt-28">
          <p className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-[#85786d]">
            Le Premier Verre
          </p>

          <h1 className="mt-7 max-w-[760px] text-[clamp(2.8rem,7vw,5.7rem)] font-medium leading-[0.96] tracking-[-0.055em]">
            Politique de confidentialité
          </h1>

          <p className="mt-7 text-[0.78rem] text-[#81786f]">
            Dernière mise à jour : 9 septembre 2026
          </p>
        </header>

        <div className="mt-20 space-y-14 border-t border-[#cbc3ba] pt-14 text-[0.95rem] leading-8 text-[#625a52]">
          <section>
            <h2 className="text-[1.15rem] font-medium text-[#211d19]">
              1. Notre engagement
            </h2>
            <p className="mt-5">
              Le Premier Verre accorde de l’importance à la protection des
              renseignements personnels qui lui sont confiés. La présente
              politique explique quels renseignements peuvent être recueillis,
              pourquoi ils le sont et comment ils sont utilisés et protégés.
            </p>
          </section>

          <section>
            <h2 className="text-[1.15rem] font-medium text-[#211d19]">
              2. Renseignements que nous pouvons recueillir
            </h2>
            <p className="mt-5">
              Selon la manière dont vous utilisez le site, nous pouvons recueillir
              notamment votre prénom, votre adresse courriel, les renseignements
              que vous nous transmettez volontairement ainsi que certaines
              données techniques liées à la consultation et au fonctionnement du
              site.
            </p>
          </section>

          <section>
            <h2 className="text-[1.15rem] font-medium text-[#211d19]">
              3. Pourquoi nous les utilisons
            </h2>
            <p className="mt-5">
              Les renseignements recueillis peuvent servir à gérer les
              inscriptions à l’infolettre, répondre aux messages reçus, fournir
              et améliorer les fonctionnalités du site, assurer la sécurité de la
              plateforme et mieux comprendre son utilisation.
            </p>
          </section>

          <section>
            <h2 className="text-[1.15rem] font-medium text-[#211d19]">
              4. Infolettre et communications
            </h2>
            <p className="mt-5">
              Lorsque vous vous inscrivez à l’infolettre, nous utilisons les
              renseignements fournis afin de vous transmettre les communications
              auxquelles vous avez consenti. Vous pouvez vous désabonner en tout
              temps au moyen du lien prévu à cette fin dans les courriels.
            </p>
          </section>

          <section>
            <h2 className="text-[1.15rem] font-medium text-[#211d19]">
              5. Témoins et technologies similaires
            </h2>
            <p className="mt-5">
              Le site peut utiliser des témoins ou des technologies similaires
              nécessaires à son fonctionnement, à la sécurité, à la connexion à
              certaines fonctionnalités et, lorsque pertinent, à la mesure de
              l’utilisation du site.
            </p>
          </section>

          <section>
            <h2 className="text-[1.15rem] font-medium text-[#211d19]">
              6. Fournisseurs de services
            </h2>
            <p className="mt-5">
              Certains renseignements peuvent être traités par des fournisseurs
              technologiques utilisés pour exploiter Le Premier Verre, notamment
              pour l’hébergement, l’authentification, les bases de données,
              l’envoi de communications ou d’autres fonctions nécessaires à la
              plateforme. Ces fournisseurs ne doivent recevoir que les
              renseignements nécessaires à la prestation de leurs services.
            </p>
          </section>

          <section>
            <h2 className="text-[1.15rem] font-medium text-[#211d19]">
              7. Conservation et sécurité
            </h2>
            <p className="mt-5">
              Les renseignements personnels sont conservés pendant la durée
              nécessaire aux fins pour lesquelles ils ont été recueillis et
              conformément aux obligations applicables. Des mesures de sécurité
              raisonnables sont mises en place afin de limiter les risques
              d’accès, d’utilisation, de modification ou de divulgation non
              autorisés.
            </p>
          </section>

          <section>
            <h2 className="text-[1.15rem] font-medium text-[#211d19]">
              8. Vos droits
            </h2>
            <p className="mt-5">
              Sous réserve des règles applicables, vous pouvez demander l’accès
              aux renseignements personnels que nous détenons à votre sujet,
              demander leur rectification ou retirer votre consentement lorsque
              celui-ci constitue la base de leur utilisation.
            </p>
          </section>

          <section>
            <h2 className="text-[1.15rem] font-medium text-[#211d19]">
              9. Responsable de la protection des renseignements personnels
            </h2>
            <p className="mt-5">
              Toute question ou demande concernant la présente politique ou la
              protection de vos renseignements personnels peut être adressée à la
              personne responsable de la protection des renseignements personnels
              du Premier Verre.
            </p>

            <a
              href="mailto:contact@lepremierverre.com"
              className="mt-5 inline-block border-b border-[#8f857b] pb-1 text-[#3f372f] transition-opacity hover:opacity-50"
            >
              contact@lepremierverre.com
            </a>
          </section>

          <section>
            <h2 className="text-[1.15rem] font-medium text-[#211d19]">
              10. Modifications
            </h2>
            <p className="mt-5">
              La présente politique peut être mise à jour afin de refléter
              l’évolution du Premier Verre, de ses outils technologiques ou de ses
              obligations. La date de la dernière mise à jour apparaît au haut de
              cette page.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
