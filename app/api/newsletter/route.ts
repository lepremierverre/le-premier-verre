import { auth } from "@clerk/nextjs/server";
import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type BrevoContact = {
  id?: number;
  email?: string;
  listIds?: number[];
};

type NewsletterSourceType =
  | "newsletter_page_fr"
  | "newsletter_page_en"
  | "coming_soon_fr"
  | "coming_soon_en";

type NewsletterAnalyticsContext = {
  clientEventId: string;
  sessionId: string | null;
  pagePath: string;
  referrer: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  sourceType: NewsletterSourceType;
};

const SOURCE_PATHS: Record<NewsletterSourceType, string> = {
  newsletter_page_fr: "/newsletter",
  newsletter_page_en: "/en/newsletter",
  coming_soon_fr: "/disponible-bientot",
  coming_soon_en: "/en/disponible-bientot",
};

function text(value: unknown, max = 255): string | null {
  if (typeof value !== "string") return null;

  const cleaned = value.trim();

  if (!cleaned) return null;

  return cleaned.slice(0, max);
}

function getAnalyticsEnvironment() {
  if (process.env.VERCEL_ENV === "production") return "production";
  if (process.env.VERCEL_ENV === "preview") return "preview";
  return "development";
}

function parseAnalyticsContext(
  value: unknown
): NewsletterAnalyticsContext | null {
  if (!value || typeof value !== "object") return null;

  const input = value as Record<string, unknown>;

  const clientEventId = text(input.clientEventId, 150);
  const sessionId = text(input.sessionId, 150);
  const pagePath = text(input.pagePath, 500);
  const sourceType = text(input.sourceType, 100);

  if (
    !clientEventId ||
    !pagePath ||
    !sourceType ||
    !Object.hasOwn(SOURCE_PATHS, sourceType)
  ) {
    return null;
  }

  const UUID_PATTERN =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!UUID_PATTERN.test(clientEventId)) {
    return null;
  }

  const canonicalSourceType = sourceType as NewsletterSourceType;
  const canonicalPagePath = SOURCE_PATHS[canonicalSourceType];

  if (pagePath !== canonicalPagePath) {
    return null;
  }

  return {
    clientEventId,
    sessionId,
    pagePath: canonicalPagePath,
    referrer: text(input.referrer, 1000),
    utmSource: text(input.utmSource, 255),
    utmMedium: text(input.utmMedium, 255),
    utmCampaign: text(input.utmCampaign, 255),
    sourceType: canonicalSourceType,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = String(body?.email ?? "").trim().toLowerCase();
    const firstName = String(body?.firstName ?? "").trim();
    const language = body?.language === "en" ? "EN" : "FR";
    const analytics = parseAnalyticsContext(body?.analytics);

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Courriel invalide." },
        { status: 400 }
      );
    }

    if (!analytics) {
      return NextResponse.json(
        {
          success: false,
          error: "Contexte d’inscription invalide.",
        },
        { status: 400 }
      );
    }

    const expectedLanguage =
      analytics.sourceType === "newsletter_page_en" ||
      analytics.sourceType === "coming_soon_en"
        ? "EN"
        : "FR";

    if (language !== expectedLanguage) {
      return NextResponse.json(
        {
          success: false,
          error: "Langue d’inscription incohérente.",
        },
        { status: 400 }
      );
    }

    const apiKey = process.env.BREVO_API_KEY;
    const listId = Number(process.env.BREVO_LIST_ID);

    if (!apiKey || !Number.isInteger(listId)) {
      console.error("Configuration Brevo manquante.");

      return NextResponse.json(
        {
          success: false,
          error: "Service d’infolettre non configuré.",
        },
        { status: 500 }
      );
    }

    const { userId } = await auth();

    const headers = {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const emailHash = createHash("sha256")
      .update(email)
      .digest("hex");

    const result = await prisma.$transaction(
      async (tx) => {
        await tx.$executeRaw`
          SELECT pg_advisory_xact_lock(
            hashtextextended(${"newsletter:" + emailHash}, 0)
          )
        `;

        const contactUrl =
          "https://api.brevo.com/v3/contacts/" +
          encodeURIComponent(email) +
          "?identifierType=email_id";

        const lookupResponse = await fetch(contactUrl, {
          method: "GET",
          headers,
          cache: "no-store",
        });

        let existedBefore = false;
        let wasAlreadySubscribed = false;

        if (lookupResponse.ok) {
          existedBefore = true;

          const existingContact =
            (await lookupResponse.json()) as BrevoContact;

          wasAlreadySubscribed =
            Array.isArray(existingContact.listIds) &&
            existingContact.listIds.includes(listId);
        } else if (lookupResponse.status !== 404) {
          const errorText = await lookupResponse.text();

          console.error(
            "Brevo newsletter lookup error:",
            lookupResponse.status,
            errorText
          );

          throw new Error("BREVO_LOOKUP_FAILED");
        }

        const attributes: Record<string, string> = {
          LANGUAGE: language,
        };

        if (firstName) {
          attributes.FIRSTNAME = firstName;
        }

        const response = await fetch(
          "https://api.brevo.com/v3/contacts",
          {
            method: "POST",
            headers,
            body: JSON.stringify({
              email,
              attributes,
              listIds: [listId],
              updateEnabled: true,
            }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();

          console.error(
            "Brevo newsletter error:",
            response.status,
            errorText
          );

          throw new Error("BREVO_SUBSCRIBE_FAILED");
        }

        const subscriptionStatus = wasAlreadySubscribed
          ? "already_subscribed"
          : existedBefore
            ? "added_to_list"
            : "created";

        if (!wasAlreadySubscribed) {
          await tx.analyticsEvent.create({
            data: {
              clientEventId: analytics.clientEventId,
              eventName: "newsletter_subscribed",
              eventVersion: 1,
              occurredAt: new Date(),
              environment: getAnalyticsEnvironment(),
              isReportable: true,
              qualityReason: null,
              duplicateOfId: null,
              clerkUserId: userId ?? null,
              sessionId: analytics.sessionId,
              isAuthenticated: Boolean(userId),
              pagePath: analytics.pagePath,
              referrer: analytics.referrer,
              utmSource: analytics.utmSource,
              utmMedium: analytics.utmMedium,
              utmCampaign: analytics.utmCampaign,
              sourceType: analytics.sourceType,
            },
          });
        }

        return {
          success: true,
          subscribed: !wasAlreadySubscribed,
          subscriptionStatus,
        };
      },
      {
        maxWait: 10_000,
        timeout: 30_000,
      }
    );

    return NextResponse.json(result);
  } catch (error) {
    if (
      error instanceof Error &&
      (
        error.message === "BREVO_LOOKUP_FAILED" ||
        error.message === "BREVO_SUBSCRIBE_FAILED"
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Impossible de compléter l’inscription.",
        },
        { status: 502 }
      );
    }

    console.error("Newsletter API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Une erreur est survenue.",
      },
      { status: 500 }
    );
  }
}
