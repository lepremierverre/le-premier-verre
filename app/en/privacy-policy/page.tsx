import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Le Premier Verre",
  description: "Privacy Policy for Le Premier Verre.",
  alternates: {
    canonical: "/en/privacy-policy",
    languages: {
      "fr-CA": "/politique-confidentialite",
      "en-CA": "/en/privacy-policy",
      "x-default": "/politique-confidentialite",
    },
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#f3efe6] px-6 py-16 text-[#211d19] sm:px-10 md:py-24">
      <article className="mx-auto max-w-[820px]">
        <Link
          href="/en"
          className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-[#776e65] transition-opacity hover:opacity-50"
        >
          ← Le Premier Verre
        </Link>

        <header className="mt-20 md:mt-28">
          <p className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-[#85786d]">
            Le Premier Verre
          </p>

          <h1 className="mt-7 max-w-[760px] text-[clamp(2.8rem,7vw,5.7rem)] font-medium leading-[0.96] tracking-[-0.055em]">
            Privacy Policy
          </h1>

          <p className="mt-7 text-[0.78rem] text-[#81786f]">
            Last updated: September 9, 2026
          </p>
        </header>

        <div className="mt-20 space-y-14 border-t border-[#cbc3ba] pt-14 text-[0.95rem] leading-8 text-[#625a52]">
          <section>
            <h2 className="text-[1.15rem] font-medium text-[#211d19]">
              1. Our commitment
            </h2>
            <p className="mt-5">
              Le Premier Verre values the protection of the personal
              information entrusted to it. This policy explains what
              information may be collected, why it is collected, and how it is
              used and protected.
            </p>
          </section>

          <section>
            <h2 className="text-[1.15rem] font-medium text-[#211d19]">
              2. Information we may collect
            </h2>
            <p className="mt-5">
              Depending on how you use the site, we may collect information
              such as your first name, email address, information you
              voluntarily provide to us, and certain technical data related to
              accessing and operating the site.
            </p>
          </section>

          <section>
            <h2 className="text-[1.15rem] font-medium text-[#211d19]">
              3. Why we use it
            </h2>
            <p className="mt-5">
              The information collected may be used to manage newsletter
              subscriptions, respond to messages, provide and improve site
              features, maintain the security of the platform, and better
              understand how the site is used.
            </p>
          </section>

          <section>
            <h2 className="text-[1.15rem] font-medium text-[#211d19]">
              4. Newsletter and communications
            </h2>
            <p className="mt-5">
              When you subscribe to the newsletter, we use the information you
              provide to send you communications to which you have consented.
              You may unsubscribe at any time using the link provided for that
              purpose in our emails.
            </p>
          </section>

          <section>
            <h2 className="text-[1.15rem] font-medium text-[#211d19]">
              5. Cookies and similar technologies
            </h2>
            <p className="mt-5">
              The site may use cookies or similar technologies necessary for
              its operation, security, access to certain features and, where
              applicable, measurement of site usage.
            </p>
          </section>

          <section>
            <h2 className="text-[1.15rem] font-medium text-[#211d19]">
              6. Service providers
            </h2>
            <p className="mt-5">
              Certain information may be processed by technology providers
              used to operate Le Premier Verre, including for hosting,
              authentication, databases, communications and other functions
              necessary for the platform. These providers should receive only
              the information necessary to provide their services.
            </p>
          </section>

          <section>
            <h2 className="text-[1.15rem] font-medium text-[#211d19]">
              7. Retention and security
            </h2>
            <p className="mt-5">
              Personal information is retained for as long as necessary for
              the purposes for which it was collected and in accordance with
              applicable requirements. Reasonable security measures are
              implemented to limit the risks of unauthorized access, use,
              modification or disclosure.
            </p>
          </section>

          <section>
            <h2 className="text-[1.15rem] font-medium text-[#211d19]">
              8. Your rights
            </h2>
            <p className="mt-5">
              Subject to applicable rules, you may request access to the
              personal information we hold about you, request that it be
              corrected, or withdraw your consent where consent is the basis
              for its use.
            </p>
          </section>

          <section>
            <h2 className="text-[1.15rem] font-medium text-[#211d19]">
              9. Person responsible for the protection of personal information
            </h2>
            <p className="mt-5">
              Any question or request regarding this policy or the protection
              of your personal information may be directed to the person
              responsible for the protection of personal information at
              Le Premier Verre.
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
              10. Changes to this policy
            </h2>
            <p className="mt-5">
              This policy may be updated to reflect changes to Le Premier
              Verre, its technological tools or its obligations. The date of
              the most recent update appears at the top of this page.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
