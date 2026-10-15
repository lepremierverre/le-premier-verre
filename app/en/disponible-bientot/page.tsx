"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { buildNewsletterAnalyticsContext } from "@/components/newsletter/trackNewsletterSubscription";

export default function ComingSoonPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) return;

    setStatus("loading");

    try {
      const analytics = buildNewsletterAnalyticsContext("coming_soon_en");

      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          language: "en",
          analytics,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Newsletter signup failed");
      }

      setEmail("");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="relative min-h-screen bg-[#f3efe6] text-[#211d19]">
      <nav
        aria-label="Language"
        className="absolute right-6 top-6 z-10 flex items-center gap-2 text-[0.62rem] font-medium uppercase tracking-[0.16em] sm:right-9 sm:top-8"
      >
        <Link
          href="/disponible-bientot"
          className="text-[#857d75] transition-opacity hover:opacity-50"
        >
          FR
        </Link>
        <span className="text-[#aaa097]">|</span>
        <span className="text-[#211d19]">EN</span>
      </nav>

      <div className="mx-auto flex min-h-screen w-full flex-col items-center justify-center px-7 py-16 text-center">
        <Image
          src="/images/lpv/logo-complet.png"
          alt="Le Premier Verre"
          width={520}
          height={220}
          priority
          className="h-auto w-[250px] sm:w-[310px]"
        />

        <div className="mt-16 sm:mt-20">
          <h1 className="text-[1.35rem] font-medium tracking-[-0.025em] sm:text-[1.55rem]">
            We open on October 15.
          </h1>

          <p className="mx-auto mt-5 max-w-[480px] text-[0.92rem] leading-7 text-[#686057] sm:text-[0.98rem]">
            Bottles, places and people worth getting to know.
          </p>
        </div>

        <div className="mt-20 w-full max-w-[360px] sm:mt-24">
          {status === "success" ? (
            <p className="text-[0.85rem] text-[#625a52]">
              Thank you. We&apos;ll meet again for the first glass.
            </p>
          ) : (
            <>
              <form
                onSubmit={handleSubmit}
                className="flex items-center border-b border-[#9b9288]"
              >
                <label htmlFor="email-en" className="sr-only">
                  Your email
                </label>

                <input
                  id="email-en"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  placeholder="Your email"
                  className="min-w-0 flex-1 bg-transparent py-3 pr-4 text-[0.82rem] outline-none placeholder:text-[#958c82]"
                />

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="shrink-0 py-3 text-[0.7rem] font-medium uppercase tracking-[0.14em] transition-opacity hover:opacity-50 disabled:cursor-wait disabled:opacity-40"
                >
                  {status === "loading" ? "..." : "Sign up"}
                </button>
              </form>

              <p className="mt-3 text-[0.68rem] text-[#948b81]">
                To receive the first glass.
              </p>

              {status === "error" && (
                <p className="mt-3 text-[0.72rem] text-[#7a3e32]">
                  Something went wrong. Please try again in a moment.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
