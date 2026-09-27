import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";

type UserPreferences = {
  _id: string;
  mainWineType: string;
  budget: string;
  bodyPreference: number;
  stylePreference: string;
  mainOccasion: string;
  communicationLanguage?: "fr" | "en";
};

const allowedWineTypes = [
  "white",
  "red",
  "sparkling",
  "rose",
  "orange",
  "everything",
];

const allowedBudgets = [
  "under-20",
  "20-30",
  "30-50",
  "50-plus",
];

const allowedStyles = [
  "classic",
  "adventurous",
  "both",
];

const allowedOccasions = [
  "weeknight",
  "hosting",
  "discovering",
  "gifting",
  "special-occasions",
];


async function syncBrevoLanguageIfSubscribed(
  email: string,
  language: "fr" | "en"
) {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    console.warn("BREVO_API_KEY absente — synchronisation de langue ignorée.");
    return;
  }

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

    if (contactResponse.status === 404) {
      console.log(
        "Brevo : contact non abonné, aucune modification.",
        normalizedEmail
      );
      return;
    }

    if (!contactResponse.ok) {
      const errorText = await contactResponse.text();
      console.error(
        "Brevo contact lookup error:",
        contactResponse.status,
        errorText
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
      const errorText = await updateResponse.text();
      console.error(
        "Brevo language update error:",
        updateResponse.status,
        errorText
      );
      return;
    }

    console.log(
      `Brevo : LANGUAGE mis à jour → ${language.toUpperCase()}`
    );
  } catch (error) {
    console.error("Brevo language sync error:", error);
  }
}

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Connexion requise." },
      { status: 401 }
    );
  }

  const preferences = await client.fetch<UserPreferences | null>(
    `*[
      _type == "userPreferences" &&
      userId == $userId
    ][0]{
      _id,
      mainWineType,
      budget,
      bodyPreference,
      stylePreference,
      mainOccasion,
      communicationLanguage
    }`,
    { userId }
  );

  return NextResponse.json({ preferences });
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

  const mainWineType = String(body.mainWineType || "").trim();
  const budget = String(body.budget || "").trim();
  const bodyPreference = Number(body.bodyPreference);
  const stylePreference = String(body.stylePreference || "").trim();
  const mainOccasion = String(body.mainOccasion || "").trim();
  const communicationLanguage = String(
    body.communicationLanguage || ""
  ).trim();

  if (!allowedWineTypes.includes(mainWineType)) {
    return NextResponse.json(
      { error: "Le type de vin sélectionné est invalide." },
      { status: 400 }
    );
  }

  if (!allowedBudgets.includes(budget)) {
    return NextResponse.json(
      { error: "Le budget sélectionné est invalide." },
      { status: 400 }
    );
  }

  if (
    !Number.isInteger(bodyPreference) ||
    bodyPreference < 1 ||
    bodyPreference > 5
  ) {
    return NextResponse.json(
      { error: "La préférence léger/généreux est invalide." },
      { status: 400 }
    );
  }

  if (!allowedStyles.includes(stylePreference)) {
    return NextResponse.json(
      { error: "Le style sélectionné est invalide." },
      { status: 400 }
    );
  }

  if (!allowedOccasions.includes(mainOccasion)) {
    return NextResponse.json(
      { error: "L'occasion sélectionnée est invalide." },
      { status: 400 }
    );
  }

  if (!["fr", "en"].includes(communicationLanguage)) {
    return NextResponse.json(
      { error: "La langue de communication sélectionnée est invalide." },
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
          mainWineType,
          budget,
          bodyPreference,
          stylePreference,
          mainOccasion,
          communicationLanguage,
          updatedAt: now,
        })
        .commit()
    : await writeClient.create({
        _type: "userPreferences",
        userId,
        mainWineType,
        budget,
        bodyPreference,
        stylePreference,
        mainOccasion,
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
      communicationLanguage as "fr" | "en"
    );
  }

  return NextResponse.json({ preferences });
}
