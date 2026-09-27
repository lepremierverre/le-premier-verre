import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = String(body?.email ?? "").trim().toLowerCase();
    const firstName = String(body?.firstName ?? "").trim();
    const language = body?.language === "en" ? "EN" : "FR";

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Courriel invalide." },
        { status: 400 }
      );
    }

    const apiKey = process.env.BREVO_API_KEY;
    const listId = Number(process.env.BREVO_LIST_ID);

    if (!apiKey || !Number.isInteger(listId)) {
      console.error("Configuration Brevo manquante.");

      return NextResponse.json(
        { success: false, error: "Service d’infolettre non configuré." },
        { status: 500 }
      );
    }

    const attributes: Record<string, string> = {
      LANGUAGE: language,
    };

    if (firstName) {
      attributes.FIRSTNAME = firstName;
    }

    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        attributes,
        listIds: [listId],
        updateEnabled: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Brevo newsletter error:", response.status, errorText);

      return NextResponse.json(
        { success: false, error: "Impossible de compléter l’inscription." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter API error:", error);

    return NextResponse.json(
      { success: false, error: "Une erreur est survenue." },
      { status: 500 }
    );
  }
}
