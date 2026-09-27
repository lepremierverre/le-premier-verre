"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function NewsletterSignup() {
  const pathname = usePathname();
  const isEn = pathname?.startsWith("/en") ?? false;

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  return (
    <section className="mt-12 w-full max-w-2xl overflow-hidden rounded-[34px] bg-[linear-gradient(180deg,#f9f4ec_0%,#f3eadc_100%)] p-8 shadow-[0_28px_80px_rgba(0,0,0,0.18)] md:p-10">
      <p className="text-[10px] uppercase tracking-[0.34em] text-[#b88a55]">
        {isEn ? "Le Premier Verre Newsletter" : "Courrier Le Premier Verre"}
      </p>

      <h2 className="mt-4 font-serif text-[1.95rem] leading-[1.02] tracking-[-0.045em] text-[#241c17] md:text-[2.45rem]">
        {isEn ? "Receive the newsletter." : "Recevoir Le Courrier."}
      </h2>

      <p className="mx-auto mt-5 max-w-xl text-[14px] leading-[1.95] text-[#6e5d4c]">
        {isEn ? "A monthly editorial newsletter about wine, wineries, wine bars and discoveries worth sharing." : "Une chronique éditoriale mensuelle sur le vin, les vignobles, les bars à vin et les découvertes du moment."}
      </p>

      <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            type="text"
            value={firstName}
            onChange={(event) => {
              setFirstName(event.target.value);
              if (status !== "idle") setStatus("idle");
            }}
            placeholder={isEn ? "First name — optional" : "Prénom — facultatif"}
            className="min-h-[62px] rounded-full border border-[#c8a97a] bg-[#fffdfa] px-7 text-[15px] !text-[#102016] outline-none placeholder:!text-[#102016] placeholder:!opacity-100 focus:border-[#b88a55]"
          />

        <input
          type="email"
          required
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status !== "idle") setStatus("idle");
          }}
          placeholder={isEn ? "Your email address" : "Votre adresse courriel"}
          className="min-h-[62px] flex-1 rounded-full border border-[#c8a97a] bg-[#fffdfa] px-7 text-[15px] !text-[#102016] outline-none placeholder:!text-[#102016] placeholder:!opacity-100 focus:border-[#b88a55]"
        />

        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="min-h-[58px] rounded-full bg-[#0d2015] px-10 text-sm uppercase tracking-[0.22em] text-[#f7efe4] transition hover:bg-[#173223] disabled:opacity-60"
        >
          {status === "loading" ? (isEn ? "Signing up..." : "Inscription...") : (isEn ? "Sign up" : "S'inscrire")}
        </button>
      </form>

      <p className="mx-auto mt-7 max-w-lg text-xs leading-6 text-[#8b7967]">
        {isEn ? (
          <>
            By signing up, you agree to receive the
            <span className="italic"> Le Premier Verre Newsletter</span>.
            You can unsubscribe at any time.{" "}
          </>
        ) : (
          <>
            En vous inscrivant, vous acceptez de recevoir le
            <span className="italic"> Courrier Le Premier Verre</span>.
            Désinscription possible en tout temps.{" "}
          </>
        )}
        <Link
          href={isEn ? "/en/privacy-policy" : "/politique-confidentialite"}
          className="underline underline-offset-4 transition hover:text-[#102016]"
        >
          {isEn ? "Privacy Policy" : "Politique de confidentialité"}
        </Link>
        .
      </p>

      {status === "success" && (
        <p className="mt-4 text-sm text-[#102116]">
          {isEn ? "Thank you — your email has been added." : "Merci — votre adresse a bien été inscrite."}
        </p>
      )}

      {status === "error" && (
        <p className="mt-4 text-sm text-[#9a544a]">
          {isEn ? "Something went wrong. Please try again in a moment." : "L’inscription n’a pas fonctionné. Réessayez dans un instant."}
        </p>
      )}
    </section>
  );
}