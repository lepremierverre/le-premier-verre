"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { buildNewsletterAnalyticsContext } from "@/components/newsletter/trackNewsletterSubscription";

type Status = "idle" | "loading" | "success" | "error";

export default function NewsletterForm() {
  const pathname = usePathname();
  const isEn = pathname?.startsWith("/en") ?? false;

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    try {
      const analytics = buildNewsletterAnalyticsContext(
        isEn ? "newsletter_page_en" : "newsletter_page_fr"
      );

      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          email: email.trim(),
          language: isEn ? "en" : "fr",
          analytics,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Erreur inscription");
      }

      setStatus("success");
      setFirstName("");
      setEmail("");
    } catch (error) {
      console.error("Newsletter error:", error);
      setStatus("error");
    }
  }

  function resetStatus() {
    if (status !== "idle") {
      setStatus("idle");
    }
  }

  return (
    <div className="mt-12 max-w-[720px] md:mt-14">
      <form onSubmit={submit}>
        <div className="grid gap-7 md:grid-cols-[0.8fr_1.2fr]">
          <label className="block">
            <span className="mb-2 block text-[0.78rem] font-normal text-[var(--lpv-ink)]">
              {isEn ? "First name" : "Prénom"}
            </span>

            <input
              type="text"
              value={firstName}
              onChange={(event) => {
                setFirstName(event.target.value);
                resetStatus();
              }}
              placeholder={isEn ? "Optional" : "Facultatif"}
              autoComplete="given-name"
              className="h-14 w-full border-0 border-b border-[var(--lpv-line)] bg-transparent px-0 text-[0.95rem] text-[var(--lpv-ink)] outline-none placeholder:text-[var(--lpv-muted)]/60 focus:border-[var(--lpv-ink)]"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-[0.78rem] font-normal text-[var(--lpv-ink)]">
              {isEn ? "Email" : "Courriel"}
            </span>

            <input
              type="email"
              required
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                resetStatus();
              }}
              placeholder={isEn ? "you@example.com" : "tonadresse@exemple.com"}
              autoComplete="email"
              className="h-14 w-full border-0 border-b border-[var(--lpv-line)] bg-transparent px-0 text-[0.95rem] text-[var(--lpv-ink)] outline-none placeholder:text-[var(--lpv-muted)]/60 focus:border-[var(--lpv-ink)]"
            />
          </label>
        </div>

        <div className="mt-9">
          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex items-center border-b border-[var(--lpv-ink)] pb-1 text-[0.78rem] font-medium transition-opacity hover:opacity-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {status === "loading"
              ? isEn
                ? "Signing up…"
                : "Inscription…"
              : isEn
                ? "Sign up →"
                : "S’inscrire →"}
          </button>
        </div>

        <p className="mt-6 max-w-[620px] text-[0.68rem] leading-5 text-[var(--lpv-muted)]">
          {isEn ? (
            <>
              By signing up, you agree to receive the Le Premier Verre
              newsletter. You can unsubscribe at any time.{" "}
              <Link
                href="/en/privacy-policy"
                className="underline underline-offset-4 transition-opacity hover:opacity-50"
              >
                Privacy Policy
              </Link>
              .
            </>
          ) : (
            <>
              En t’inscrivant, tu acceptes de recevoir l’infolettre du Premier Verre.
              Désinscription possible en tout temps.{" "}
              <Link
                href="/politique-confidentialite"
                className="underline underline-offset-4 transition-opacity hover:opacity-50"
              >
                Politique de confidentialité
              </Link>
              .
            </>
          )}
        </p>

        {status === "success" && (
          <p className="mt-7 border-t border-[#c8c0b7] pt-5 text-sm text-[#4a372b]">
            {isEn
              ? "Thank you — your subscription is confirmed."
              : "Merci — ton inscription est confirmée."}
          </p>
        )}

        {status === "error" && (
          <p className="mt-7 border-t border-[#b89287] pt-5 text-sm text-[#7a3e32]">
            {isEn
              ? "Something went wrong. Please try again in a moment."
              : "L’inscription n’a pas fonctionné. Réessaie dans un instant."}
          </p>
        )}
      </form>
    </div>
  );
}
