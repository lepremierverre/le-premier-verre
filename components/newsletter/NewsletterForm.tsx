"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          email: email.trim(),
          language: isEn ? "en" : "fr",
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
    <div className="mt-14 max-w-[720px]">
      <form onSubmit={submit}>
        <div className="grid gap-7 md:grid-cols-[0.8fr_1.2fr]">
          <label className="block">
            <span className="mb-2 block text-[0.62rem] font-medium uppercase tracking-[0.18em] text-[#85786d]">
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
              className="h-14 w-full border-0 border-b border-[#a49a90] bg-transparent px-0 text-[0.95rem] text-[#211d19] outline-none placeholder:text-[#aaa097] focus:border-[#211d19]"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-[0.62rem] font-medium uppercase tracking-[0.18em] text-[#85786d]">
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
              className="h-14 w-full border-0 border-b border-[#a49a90] bg-transparent px-0 text-[0.95rem] text-[#211d19] outline-none placeholder:text-[#aaa097] focus:border-[#211d19]"
            />
          </label>
        </div>

        <div className="mt-9">
          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex min-h-12 items-center justify-center bg-[#4a372b] px-7 text-[0.68rem] font-medium uppercase tracking-[0.17em] text-[#f7f1e8] transition-opacity hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {status === "loading"
              ? isEn
                ? "Signing up…"
                : "Inscription…"
              : isEn
                ? "Sign up"
                : "S’inscrire"}
          </button>
        </div>

        <p className="mt-6 max-w-[620px] text-[0.68rem] leading-5 text-[#857d75]">
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
