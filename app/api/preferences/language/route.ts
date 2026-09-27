import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";

async function syncBrevoLanguageIfSubscribed(
  email: string,
  language: "fr" | "en"
) {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) return;

  const normalizedEmail = email.trim().toLowerCase();

  const contactUrl =
    "https://api.brevo.com/v3/contacts/" +
    encodeURIComponent(normalizedEmail) +
    "?identifierType=email_id";

  try {
    const contactResponse = await fetch(contactUrl, {
      method: "GET",
      headers: {
        "api-key": apiKey,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    // Ne jamais créer un abonnement ici.
    if (contactResponse.status === 404) return;

    if (!contactResponse.ok) {
      console.error(
        "Brevo contact lookup error:",
        contactResponse.status,
        await contactResponse.text()
      );
      return;
    }

    const updateResponse = await fetch(contactUrl, {
      method: "PUT",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        attributes: {
          LANGUAGE: language.toUpperCase(),
        },
      }),
    });

    if (!updateResponse.ok) {
      console.error(
        "Brevo language update error:",
        updateResponse.status,
        await updateResponse.text()
      );
    }
  } catch (error) {
    console.error("Brevo language sync error:", error);
  }
}

export async function PUT(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Connexion requise." },
      { status: 401 }
    );
  }

  const body = await request.json();

  const communicationLanguage =
    body?.communicationLanguage === "en"
      ? "en"
      : body?.communicationLanguage === "fr"
        ? "fr"
        : null;

  if (!communicationLanguage) {
    return NextResponse.json(
      { error: "Langue invalide." },
      { status: 400 }
    );
  }

  const existing = await client.fetch<{ _id: string } | null>(
    `*[
      _type == "userPreferences" &&
      userId == $userId
    ][0]{
      _id
    }`,
    { userId }
  );

  const now = new Date().toISOString();

  const preferences = existing
    ? await writeClient
        .patch(existing._id)
        .set({
          communicationLanguage,
          updatedAt: now,
        })
        .commit()
    : await writeClient.create({
        _type: "userPreferences",
        userId,
        communicationLanguage,
        createdAt: now,
        updatedAt: now,
      });

  const clerkUser = await currentUser();

  const email =
    clerkUser?.primaryEmailAddress?.emailAddress ||
    clerkUser?.emailAddresses?.[0]?.emailAddress;

  if (email) {
    await syncBrevoLanguageIfSubscribed(
      email,
      communicationLanguage
    );
  }

  return NextResponse.json({
    success: true,
    preferences,
  });
}
