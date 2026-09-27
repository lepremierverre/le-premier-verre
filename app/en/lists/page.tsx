import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

import WineListsClient from "@/components/lists/WineListsClient";

export default async function ListsPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
        <div className="mx-auto max-w-[1500px] px-5 py-24 sm:px-8 md:px-12 lg:px-16">
          <p className="lpv-kicker text-[var(--lpv-cocoa)]">
            My space
          </p>

          <h1 className="lpv-display mt-5 max-w-5xl text-[clamp(4.5rem,10vw,10rem)] leading-[0.78] tracking-[-0.075em]">
            My lists.
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-[var(--lpv-muted)]">
            Sign in to create and find your wine lists.
          </p>

          <Link
            href="/en/sign-in"
            className="mt-10 inline-flex border-b border-[var(--lpv-ink)] pb-1 text-xs uppercase tracking-[0.22em]"
          >
            Sign in →
          </Link>
        </div>
      </main>
    );
  }


  return <WineListsClient locale="en" />;
}
