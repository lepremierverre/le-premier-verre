import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { client } from "@/sanity/lib/client";
import { searchSanity } from "@/lib/search/server-search";
import { getFilteredWineCatalog } from "@/lib/catalog/wine-catalog";
import {
  getPairingRecommendations,
  type PairingAlcoholChoice,
} from "@/lib/recommendations/pairing-recommendations";

export const runtime = "nodejs";

const QUEBEC_ATLAS_TERRITORY_ID = "atlas-territory-quebec";

type CanonicalProduct = {
  contentId: string;
  contentSlug: string | null;
  producerId: string | null;
  producerSlug: string | null;
  beverageType: string;
  isAlcoholFree: boolean;
  country: string | null;
  region: string | null;
  isQuebec: boolean;
  price: number | null;
  purchaseChannel: string | null;
  purchaseUrl: string | null;
  purchaseLastChecked: string | null;
};

async function getCanonicalProduct(
  contentId: string
): Promise<CanonicalProduct | null> {
  return client.fetch<CanonicalProduct | null>(
    `*[
      _type == "wine" &&
      _id == $contentId &&
      !(_id in path("drafts.**")) &&
      published == true
    ][0]{
      "contentId": _id,
      "contentSlug": slug.current,
      "producerId": producer->_id,
      "producerSlug": producer->slug.current,
      "beverageType": select(
        beverageType == "cider" => "cider",
        "wine"
      ),
      "isAlcoholFree": coalesce(alcoholFree, false),
      "country": country->name,
      "region": region->name,
      "isQuebec": coalesce(
        country->name == "Canada" &&
        region->atlasTerritory->_id == $quebecTerritoryId,
        false
      ),
      "price": approxPrice,
      purchaseChannel,
      purchaseUrl,
      purchaseLastChecked
    }`,
    {
      contentId,
      quebecTerritoryId: QUEBEC_ATLAS_TERRITORY_ID,
    }
  );
}

type CanonicalPairing = {
  contentId: string;
  contentSlug: string;
};

async function getCanonicalPairing(
  contentId: string
): Promise<CanonicalPairing | null> {
  return client.fetch<CanonicalPairing | null>(
    `*[
      _type == "food" &&
      _id == $contentId &&
      !(_id in path("drafts.**")) &&
      published == true &&
      defined(slug.current)
    ][0]{
      "contentId": _id,
      "contentSlug": slug.current
    }`,
    { contentId }
  );
}

type CanonicalProducer = {
  producerId: string;
  producerSlug: string | null;
  website: string | null;
  country: string | null;
  region: string | null;
  isQuebec: boolean;
};

async function getCanonicalProducer(
  producerId: string
): Promise<CanonicalProducer | null> {
  return client.fetch<CanonicalProducer | null>(
    `*[
      _type == "producer" &&
      _id == $producerId &&
      !(_id in path("drafts.**")) &&
      published == true
    ][0]{
      "producerId": _id,
      "producerSlug": slug.current,
      website,
      "country": country->name,
      "region": region->name,
      "isQuebec": coalesce(
        country->name == "Canada" &&
        region->atlasTerritory->_id == $quebecTerritoryId,
        false
      )
    }`,
    {
      producerId,
      quebecTerritoryId: QUEBEC_ATLAS_TERRITORY_ID,
    }
  );
}

type CanonicalEvent = {
  contentId: string;
  contentSlug: string;
  title: string;
  eventType: string;
  startsAt: string;
  endsAt: string | null;
  venueName: string;
  city: string;
  capacity: number | null;
  price: number | null;
  bookingUrl: string;
  status: string;
};

async function getCanonicalEvent(
  contentId: string
): Promise<CanonicalEvent | null> {
  return client.fetch<CanonicalEvent | null>(
    `*[
      _type == "event" &&
      _id == $contentId &&
      !(_id in path("drafts.**")) &&
      published == true &&
      status == "upcoming" &&
      defined(slug.current) &&
      defined(bookingUrl)
    ][0]{
      "contentId": _id,
      "contentSlug": slug.current,
      title,
      eventType,
      startsAt,
      endsAt,
      venueName,
      city,
      capacity,
      price,
      bookingUrl,
      status
    }`,
    { contentId }
  );
}

const ALLOWED_EVENTS = new Set([
  "product_view",
  "producer_view",
  "search_performed",
  "filter_applied",
  "recommendation_clicked",
  "recommendation_impression",
  "favorite_added",
  "list_item_added",
  "pairing_clicked",
  "producer_website_clicked",
  "where_to_buy_clicked",
  "event_interest_clicked",
]);

function text(value: unknown, max = 255): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value.trim();
  if (!cleaned) return null;
  return cleaned.slice(0, max);
}

function cleanSearchQuery(value: unknown): string | null {
  const cleaned = text(value, 500);

  if (!cleaned) {
    return null;
  }

  return cleaned
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("fr-CA");
}

function boolean(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

function number(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function cleanOccurredAt(value: unknown): Date {
  const serverNow = new Date();

  if (typeof value !== "string") {
    return serverNow;
  }

  const parsedMs = Date.parse(value);

  if (Number.isNaN(parsedMs)) {
    return serverNow;
  }

  const minAllowed = serverNow.getTime() - 5 * 60 * 1000;
  const maxAllowed = serverNow.getTime() + 60 * 1000;

  if (parsedMs < minAllowed || parsedMs > maxAllowed) {
    return serverNow;
  }

  return new Date(parsedMs);
}

function cleanResultCount(value: unknown): number | null {
  if (
    typeof value !== "number" ||
    !Number.isInteger(value) ||
    value < 0
  ) {
    return null;
  }

  return value;
}

function canonicalPrice(value: number | null): number | null {
  if (value === null || !Number.isFinite(value) || value <= 0) {
    return null;
  }

  return value;
}

function getPriceBand(price: number | null): string | null {
  const validPrice = canonicalPrice(price);

  if (validPrice === null) return null;
  if (validPrice < 20) return "under_20";
  if (validPrice < 25) return "20_24_99";
  if (validPrice < 30) return "25_29_99";
  if (validPrice < 40) return "30_39_99";
  return "40_plus";
}

function getAnalyticsEnvironment(): "development" | "preview" | "production" {
  if (process.env.VERCEL_ENV === "production") return "production";
  if (process.env.VERCEL_ENV === "preview") return "preview";
  return "development";
}

function cleanPagePath(value: unknown): string | null {
  const raw = text(value, 2000);
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
    return null;
  }

  const pathname = raw.split("?")[0].split("#")[0];

  if (!pathname.startsWith("/")) {
    return null;
  }

  return pathname.slice(0, 1000);
}

function cleanReferrer(value: unknown): string | null {
  const raw = text(value, 2000);
  if (!raw) return null;

  try {
    const url = new URL(raw);
    return `${url.origin}${url.pathname}`.slice(0, 2000);
  } catch {
    return null;
  }
}

function cleanDestinationUrl(value: unknown): string | null {
  const raw = text(value, 2000);
  if (!raw) return null;

  try {
    const url = new URL(raw);
    return `${url.origin}${url.pathname}`.slice(0, 2000);
  } catch {
    return raw.startsWith("/") ? raw.split("?")[0].slice(0, 2000) : null;
  }
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const eventName = text(body?.eventName, 100);

    if (!eventName || !ALLOWED_EVENTS.has(eventName)) {
      return NextResponse.json(
        { success: false, error: "Événement analytics invalide." },
        { status: 400 }
      );
    }

    const { userId } = await auth();

    const clientEventId = text(body?.clientEventId, 150);

    let canonicalProduct: CanonicalProduct | null = null;
    let canonicalEvent: CanonicalEvent | null = null;
    let canonicalProducer: CanonicalProducer | null = null;
    let canonicalPairing: CanonicalPairing | null = null;
    let canonicalPairingSourceType: string | null = null;
    let canonicalPairingSourceId: string | null = null;
    let canonicalPairingSourceSlug: string | null = null;
    let canonicalListSourceType: string | null = null;
    let canonicalListSourceId: string | null = null;

    let canonicalRecommendationSourceType: string | null = null;
    let canonicalRecommendationSourceId: string | null = null;
    let canonicalRecommendationSourceSlug: string | null = null;
    let canonicalRecommendationDestinationUrl: string | null = null;
    let canonicalRecommendationMetadata:
      | {
          pairingId: string;
          pairingSlug: string;
          alcoholChoice: PairingAlcoholChoice;
          rank: number;
          score: number;
        }
      | undefined;

    if (
      eventName === "product_view" ||
      eventName === "favorite_added" ||
      eventName === "list_item_added"
    ) {
      const contentId = text(body?.contentId, 255);

      if (!contentId) {
        return NextResponse.json(
          {
            success: false,
            error: `contentId requis pour ${eventName}.`,
          },
          { status: 400 }
        );
      }

      canonicalProduct = await getCanonicalProduct(contentId);

      if (!canonicalProduct) {
        return NextResponse.json(
          { success: false, error: "Produit publié introuvable." },
          { status: 400 }
        );
      }
    }

    if (eventName === "where_to_buy_clicked") {
  const contentId = text(body?.contentId, 255);
  const sourceType = text(body?.sourceType, 100);

  const allowedSourceTypes = [
    "wine_detail_fr",
    "wine_detail_en",
  ];

  const allowedPurchaseChannels = [
    "saq",
    "private-import",
    "producer",
    "other",
  ];

  if (!contentId) {
    return NextResponse.json(
      {
        success: false,
        error: "contentId requis pour where_to_buy_clicked.",
      },
      { status: 400 }
    );
  }

  if (!sourceType || !allowedSourceTypes.includes(sourceType)) {
    return NextResponse.json(
      {
        success: false,
        error: "sourceType invalide pour where_to_buy_clicked.",
      },
      { status: 400 }
    );
  }

  canonicalProduct = await getCanonicalProduct(contentId);

  if (!canonicalProduct) {
    return NextResponse.json(
      {
        success: false,
        error: "Produit publié introuvable.",
      },
      { status: 400 }
    );
  }

  if (
    !canonicalProduct.purchaseChannel ||
    !allowedPurchaseChannels.includes(
      canonicalProduct.purchaseChannel
    )
  ) {
    return NextResponse.json(
      {
        success: false,
        error: "Circuit d’achat canonique invalide ou introuvable.",
      },
      { status: 400 }
    );
  }

  if (!canonicalProduct.purchaseUrl) {
    return NextResponse.json(
      {
        success: false,
        error: "Lien d’achat canonique introuvable.",
      },
      { status: 400 }
    );
  }
}

if (eventName === "pairing_clicked") {
      const contentId = text(body?.contentId, 255);
      const sourceType = text(body?.sourceType, 100);

      const allowedSourceTypes = [
        "pairing_directory_fr",
        "pairing_directory_en",
        "wine_detail_fr",
        "wine_detail_en",
      ];

      if (!contentId) {
        return NextResponse.json(
          {
            success: false,
            error: "contentId requis pour pairing_clicked.",
          },
          { status: 400 }
        );
      }

      if (!sourceType || !allowedSourceTypes.includes(sourceType)) {
        return NextResponse.json(
          {
            success: false,
            error: "sourceType invalide pour pairing_clicked.",
          },
          { status: 400 }
        );
      }

      canonicalPairing = await getCanonicalPairing(contentId);

      if (!canonicalPairing) {
        return NextResponse.json(
          {
            success: false,
            error: "Accord publié introuvable.",
          },
          { status: 400 }
        );
      }

      canonicalPairingSourceType = sourceType;

      const isWineDetail =
        sourceType === "wine_detail_fr" ||
        sourceType === "wine_detail_en";

      if (isWineDetail) {
        const sourceId = text(body?.sourceId, 255);

        if (!sourceId) {
          return NextResponse.json(
            {
              success: false,
              error:
                "sourceId requis pour pairing_clicked depuis une fiche vin.",
            },
            { status: 400 }
          );
        }

        const sourceWine = await client.fetch<{
          contentId: string;
          contentSlug: string | null;
        } | null>(
          `*[
            _type == "wine" &&
            _id == $sourceId &&
            !(_id in path("drafts.**")) &&
            published == true &&
            $pairingId in foodPairings[]._ref
          ][0]{
            "contentId": _id,
            "contentSlug": slug.current
          }`,
          {
            sourceId,
            pairingId: canonicalPairing.contentId,
          }
        );

        if (!sourceWine) {
          return NextResponse.json(
            {
              success: false,
              error:
                "Relation canonique entre cette bouteille et cet accord introuvable.",
            },
            { status: 400 }
          );
        }

        canonicalPairingSourceId = sourceWine.contentId;
        canonicalPairingSourceSlug = sourceWine.contentSlug;
      } else {
        canonicalPairingSourceId = null;
        canonicalPairingSourceSlug = null;
      }
    }

    if (eventName === "list_item_added") {
      if (!userId) {
        return NextResponse.json(
          {
            success: false,
            error: "Authentification requise pour list_item_added.",
          },
          { status: 401 }
        );
      }

      const sourceId = text(body?.sourceId, 255);

      if (!sourceId) {
        return NextResponse.json(
          {
            success: false,
            error: "sourceId requis pour list_item_added.",
          },
          { status: 400 }
        );
      }

      const ownedListId = await client.fetch<string | null>(
        `*[
          _type == "wineList" &&
          _id == $sourceId &&
          userId == $userId
        ][0]._id`,
        {
          sourceId,
          userId,
        }
      );

      if (!ownedListId) {
        return NextResponse.json(
          {
            success: false,
            error: "Liste utilisateur introuvable.",
          },
          { status: 400 }
        );
      }

      canonicalListSourceType = "user_wine_list";
      canonicalListSourceId = ownedListId;
    }

    if (
        eventName === "recommendation_clicked" ||
        eventName === "recommendation_impression"
      ) {
      const recommendationId = text(body?.recommendationId, 255);
      const pairingSlug = text(body?.sourceSlug, 255);
      const sourceType = text(body?.sourceType, 100);
      const alcoholChoice = text(body?.metadata?.alcoholChoice, 20);

      const allowedSourceTypes = [
        "pairing_detail_fr",
        "pairing_detail_en",
      ];

      if (!recommendationId) {
        return NextResponse.json(
          {
            success: false,
            error: `${"recommendationId requis pour"} ${eventName}.`,
          },
          { status: 400 }
        );
      }

      if (!pairingSlug) {
        return NextResponse.json(
          {
            success: false,
            error: `${"sourceSlug requis pour"} ${eventName}.`,
          },
          { status: 400 }
        );
      }

      if (!sourceType || !allowedSourceTypes.includes(sourceType)) {
        return NextResponse.json(
          {
            success: false,
            error: `${"sourceType invalide pour"} ${eventName}.`,
          },
          { status: 400 }
        );
      }

      if (alcoholChoice !== "with" && alcoholChoice !== "without") {
        return NextResponse.json(
          {
            success: false,
            error: `${"alcoholChoice invalide pour"} ${eventName}.`,
          },
          { status: 400 }
        );
      }

      const canonicalRecommendations = await getPairingRecommendations(
        pairingSlug,
        alcoholChoice
      );

      if (!canonicalRecommendations.food) {
        return NextResponse.json(
          {
            success: false,
            error: "Accord publié introuvable.",
          },
          { status: 400 }
        );
      }

      const topRecommendations =
        canonicalRecommendations.candidates.slice(0, 4);

      const canonicalCandidate = topRecommendations.find(
        (candidate) => candidate.wine._id === recommendationId
      );

      if (!canonicalCandidate) {
        return NextResponse.json(
          {
            success: false,
            error:
              "La bouteille ne fait pas partie des recommandations canoniques de cet accord.",
          },
          { status: 400 }
        );
      }

      canonicalProduct = await getCanonicalProduct(recommendationId);

      if (!canonicalProduct) {
        return NextResponse.json(
          {
            success: false,
            error: "Produit recommandé publié introuvable.",
          },
          { status: 400 }
        );
      }

      const isEnglish = sourceType === "pairing_detail_en";

      canonicalRecommendationSourceType = sourceType;
      canonicalRecommendationSourceId =
        canonicalRecommendations.food._id;
      canonicalRecommendationSourceSlug =
        canonicalRecommendations.food.slug;

      canonicalRecommendationDestinationUrl =
        canonicalProduct.contentSlug
          ? isEnglish
            ? `/en/wines/${canonicalProduct.contentSlug}`
            : `/vins/${canonicalProduct.contentSlug}`
          : null;

      canonicalRecommendationMetadata = {
        pairingId: canonicalRecommendations.food._id,
        pairingSlug: canonicalRecommendations.food.slug,
        alcoholChoice,
        rank: canonicalCandidate.recommendationRank,
        score: canonicalCandidate.recommendationScore,
      };
    }

    if (eventName === "producer_view") {
      const producerId = text(body?.producerId, 255);

      if (!producerId) {
        return NextResponse.json(
          { success: false, error: "producerId requis pour producer_view." },
          { status: 400 }
        );
      }

      canonicalProducer = await getCanonicalProducer(producerId);

      if (!canonicalProducer) {
        return NextResponse.json(
          { success: false, error: "Producteur publié introuvable." },
          { status: 400 }
        );
      }
    }

    let canonicalProducerWebsiteSourceType: string | null = null;

    if (eventName === "producer_website_clicked") {
      const producerId = text(body?.producerId, 255);
      const sourceType = text(body?.sourceType, 100);

      const allowedSourceTypes = [
        "producer_detail_fr",
        "producer_detail_en",
      ];

      if (!producerId) {
        return NextResponse.json(
          {
            success: false,
            error: "producerId requis pour producer_website_clicked.",
          },
          { status: 400 }
        );
      }

      if (!sourceType || !allowedSourceTypes.includes(sourceType)) {
        return NextResponse.json(
          {
            success: false,
            error: "sourceType invalide pour producer_website_clicked.",
          },
          { status: 400 }
        );
      }

      canonicalProducer = await getCanonicalProducer(producerId);

      if (!canonicalProducer) {
        return NextResponse.json(
          { success: false, error: "Producteur publié introuvable." },
          { status: 400 }
        );
      }

      if (!canonicalProducer.website) {
        return NextResponse.json(
          {
            success: false,
            error: "Site officiel du producteur introuvable.",
          },
          { status: 400 }
        );
      }

      canonicalProducerWebsiteSourceType = sourceType;
    }

    let canonicalSearchQuery: string | null = null;
    let canonicalResultCount: number | null = null;
    let canonicalSearchSourceType: string | null = null;

    if (eventName === "search_performed") {
      canonicalSearchQuery = cleanSearchQuery(body?.searchQuery);
      canonicalSearchSourceType = text(body?.sourceType, 100);

      if (!canonicalSearchQuery || canonicalSearchQuery.length < 2) {
        return NextResponse.json(
          {
            success: false,
            error: "searchQuery d'au moins 2 caractères requis pour search_performed.",
          },
          { status: 400 }
        );
      }

      const allowedSearchSourceTypes = [
        "global_search_fr",
        "global_search_en",
        "wine_catalog_fr",
        "wine_catalog_en",
      ];

      if (
        !canonicalSearchSourceType ||
        !allowedSearchSourceTypes.includes(canonicalSearchSourceType)
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "sourceType invalide pour search_performed.",
          },
          { status: 400 }
        );
      }

      const searchLocale =
        canonicalSearchSourceType.endsWith("_en") ? "en" : "fr";

      if (canonicalSearchSourceType.startsWith("global_search_")) {
        const canonicalSearchResults = await searchSanity(
          canonicalSearchQuery,
          searchLocale,
          50
        );

        canonicalResultCount = canonicalSearchResults.length;
      } else {
        const canonicalSearchResults = await getFilteredWineCatalog(
          {
            q: canonicalSearchQuery,
            type: text(body?.metadata?.type, 100) ?? undefined,
            color: text(body?.metadata?.color, 100) ?? undefined,
            country: text(body?.metadata?.country, 150) ?? undefined,
            region: text(body?.metadata?.region, 150) ?? undefined,
            price: text(body?.metadata?.price, 100) ?? undefined,
          },
          searchLocale
        );

        canonicalResultCount = canonicalSearchResults.length;
      }
    }

    let canonicalFilterName: string | null = null;
    let canonicalFilterValue: string | null = null;
    let canonicalFilterSourceType: string | null = null;

    if (eventName === "filter_applied") {
      canonicalFilterName = text(body?.filterName, 150);
      canonicalFilterValue = text(body?.filterValue, 500);
      canonicalFilterSourceType = text(body?.sourceType, 100);

      const allowedFilterNames = [
        "type",
        "color",
        "country",
        "region",
        "price",
      ];

      const allowedFilterSourceTypes = [
        "wine_catalog_fr",
        "wine_catalog_en",
      ];

      if (
        !canonicalFilterName ||
        !allowedFilterNames.includes(canonicalFilterName)
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "filterName invalide pour filter_applied.",
          },
          { status: 400 }
        );
      }

      if (!canonicalFilterValue) {
        return NextResponse.json(
          {
            success: false,
            error: "filterValue requis pour filter_applied.",
          },
          { status: 400 }
        );
      }

      if (
        !canonicalFilterSourceType ||
        !allowedFilterSourceTypes.includes(canonicalFilterSourceType)
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "sourceType invalide pour filter_applied.",
          },
          { status: 400 }
        );
      }

      const allowedTypeValues = [
        "all",
        "wine",
        "cider",
        "alcohol-free",
      ];

      const allowedPriceValues = [
        "under-20",
        "20-30",
        "30-40",
        "40-60",
        "60-plus",
      ];

      if (
        canonicalFilterName === "type" &&
        !allowedTypeValues.includes(canonicalFilterValue)
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "filterValue invalide pour le filtre type.",
          },
          { status: 400 }
        );
      }

      if (
        canonicalFilterName === "price" &&
        !allowedPriceValues.includes(canonicalFilterValue)
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "filterValue invalide pour le filtre price.",
          },
          { status: 400 }
        );
      }
    }

    if (eventName === "event_interest_clicked") {
      const contentId = text(body?.contentId, 255);
      const sourceType = text(body?.sourceType, 100);

      const allowedSourceTypes = [
        "event_detail_fr",
        "event_detail_en",
      ];

      if (!contentId) {
        return NextResponse.json(
          {
            success: false,
            error: "contentId requis pour event_interest_clicked.",
          },
          { status: 400 }
        );
      }

      if (!sourceType || !allowedSourceTypes.includes(sourceType)) {
        return NextResponse.json(
          {
            success: false,
            error: "sourceType invalide pour event_interest_clicked.",
          },
          { status: 400 }
        );
      }

      canonicalEvent = await getCanonicalEvent(contentId);

      if (!canonicalEvent) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Rendez-vous publié, à venir et réservable introuvable.",
          },
          { status: 400 }
        );
      }

      const allowedEventTypes = [
        "tasting",
        "producer-meetup",
        "workshop",
        "dinner",
        "popup",
        "other",
      ];

      if (
        !canonicalEvent.eventType ||
        !allowedEventTypes.includes(canonicalEvent.eventType)
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "Type canonique du Rendez-vous invalide.",
          },
          { status: 400 }
        );
      }

      if (
        !canonicalEvent.title ||
        !canonicalEvent.startsAt ||
        !canonicalEvent.venueName ||
        !canonicalEvent.city ||
        !canonicalEvent.bookingUrl
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "Données canoniques du Rendez-vous incomplètes.",
          },
          { status: 400 }
        );
      }

      if (Number.isNaN(Date.parse(canonicalEvent.startsAt))) {
        return NextResponse.json(
          {
            success: false,
            error: "Date canonique du Rendez-vous invalide.",
          },
          { status: 400 }
        );
      }

      try {
        new URL(canonicalEvent.bookingUrl);
      } catch {
        return NextResponse.json(
          {
            success: false,
            error: "URL canonique de réservation invalide.",
          },
          { status: 400 }
        );
      }
    }

    const environment = getAnalyticsEnvironment();
    const sessionId = text(body?.sessionId, 150);
    const occurredAt = cleanOccurredAt(body?.occurredAt);

    let isReportable = true;
    let qualityReason: string | null = null;
    let duplicateOfId: string | null = null;

    const data = {
      clientEventId,
      eventName,
      eventVersion: 1,
      environment,

      occurredAt,

      isReportable,
      qualityReason,
      duplicateOfId,

      clerkUserId: userId ?? null,
      sessionId,
      isAuthenticated: Boolean(userId),

      pagePath: cleanPagePath(body?.pagePath),
      referrer: cleanReferrer(body?.referrer),
      utmSource: text(body?.utmSource, 255),
      utmMedium: text(body?.utmMedium, 255),
      utmCampaign: text(body?.utmCampaign, 255),

      contentId:
        eventName === "event_interest_clicked"
          ? canonicalEvent?.contentId ?? null
          : eventName === "pairing_clicked"
            ? canonicalPairing?.contentId ?? null
          : eventName === "producer_website_clicked"
            ? null
            : canonicalProduct?.contentId ?? text(body?.contentId, 255),

      contentType:
        eventName === "event_interest_clicked"
          ? "event"
          : eventName === "pairing_clicked"
            ? "pairing"
          : eventName === "producer_website_clicked"
            ? null
            : eventName === "product_view" ||
                eventName === "favorite_added" ||
                eventName === "list_item_added" ||
                eventName === "recommendation_clicked" ||
                eventName === "recommendation_impression" ||
                eventName === "where_to_buy_clicked"
              ? "product"
              : text(body?.contentType, 100),

      contentSlug:
        eventName === "event_interest_clicked"
          ? canonicalEvent?.contentSlug ?? null
          : eventName === "pairing_clicked"
            ? canonicalPairing?.contentSlug ?? null
          : eventName === "producer_website_clicked"
            ? null
            : canonicalProduct?.contentSlug ?? text(body?.contentSlug, 255),

      producerId:
        eventName === "event_interest_clicked" ||
        eventName === "pairing_clicked"
          ? null
          : canonicalProduct?.producerId ??
            canonicalProducer?.producerId ??
            text(body?.producerId, 255),

      producerSlug:
        eventName === "event_interest_clicked" ||
        eventName === "pairing_clicked"
          ? null
          : canonicalProduct?.producerSlug ??
            canonicalProducer?.producerSlug ??
            text(body?.producerSlug, 255),

      beverageType:
        eventName === "event_interest_clicked" ||
        eventName === "pairing_clicked" ||
        eventName === "producer_website_clicked"
          ? null
          : canonicalProduct?.beverageType ?? text(body?.beverageType, 100),

      isAlcoholFree:
        eventName === "event_interest_clicked" ||
        eventName === "pairing_clicked" ||
        eventName === "producer_website_clicked"
          ? null
          : canonicalProduct?.isAlcoholFree ?? boolean(body?.isAlcoholFree),

      country:
        eventName === "event_interest_clicked" ||
        eventName === "pairing_clicked"
          ? null
          : canonicalProduct?.country ??
            canonicalProducer?.country ??
            text(body?.country, 150),

      province:
        eventName === "event_interest_clicked" ||
        eventName === "pairing_clicked" ||
        eventName === "producer_website_clicked" ||
        eventName === "product_view" ||
        eventName === "favorite_added" ||
        eventName === "list_item_added" ||
        eventName === "where_to_buy_clicked"
          ? null
          : text(body?.province, 150),

      region:
        eventName === "event_interest_clicked" ||
        eventName === "pairing_clicked"
          ? null
          : canonicalProduct?.region ??
            canonicalProducer?.region ??
            text(body?.region, 150),

      isQuebec:
        eventName === "event_interest_clicked" ||
        eventName === "pairing_clicked"
          ? null
          : canonicalProduct?.isQuebec ??
            canonicalProducer?.isQuebec ??
            boolean(body?.isQuebec),

      price:
        eventName === "event_interest_clicked"
          ? null
          : eventName === "pairing_clicked" ||
              eventName === "producer_website_clicked"
          ? null
          : eventName === "product_view" ||
              eventName === "favorite_added" ||
              eventName === "list_item_added" ||
              eventName === "recommendation_clicked" ||
              eventName === "recommendation_impression" ||
              eventName === "where_to_buy_clicked"
            ? canonicalPrice(canonicalProduct?.price ?? null)
            : number(body?.price),

      priceBand:
        eventName === "event_interest_clicked"
          ? null
          : eventName === "pairing_clicked" ||
              eventName === "producer_website_clicked"
          ? null
          : eventName === "product_view" ||
              eventName === "favorite_added" ||
              eventName === "list_item_added" ||
              eventName === "recommendation_clicked" ||
              eventName === "recommendation_impression" ||
              eventName === "where_to_buy_clicked"
            ? getPriceBand(canonicalProduct?.price ?? null)
            : text(body?.priceBand, 100),

      sourceType:
        eventName === "event_interest_clicked"
          ? text(body?.sourceType, 100)
          : eventName === "pairing_clicked"
            ? canonicalPairingSourceType
          : eventName === "producer_website_clicked"
            ? canonicalProducerWebsiteSourceType
            : eventName === "where_to_buy_clicked"
              ? text(body?.sourceType, 100)
              : eventName === "search_performed"
                ? canonicalSearchSourceType
                : eventName === "filter_applied"
                  ? canonicalFilterSourceType
                  : eventName === "list_item_added"
                    ? canonicalListSourceType
                    : eventName === "recommendation_clicked" ||
                        eventName === "recommendation_impression"
                      ? canonicalRecommendationSourceType
                      : text(body?.sourceType, 100),

      sourceId:
        eventName === "event_interest_clicked"
          ? null
          : eventName === "pairing_clicked"
            ? canonicalPairingSourceId
          : eventName === "producer_website_clicked" ||
              eventName === "where_to_buy_clicked"
            ? null
            : eventName === "list_item_added"
              ? canonicalListSourceId
              : eventName === "recommendation_clicked" ||
                  eventName === "recommendation_impression"
                ? canonicalRecommendationSourceId
                : text(body?.sourceId, 255),

      sourceSlug:
        eventName === "event_interest_clicked"
          ? null
          : eventName === "pairing_clicked"
            ? canonicalPairingSourceSlug
          : eventName === "producer_website_clicked" ||
              eventName === "where_to_buy_clicked"
            ? null
            : eventName === "list_item_added"
              ? null
              : eventName === "recommendation_clicked" ||
                  eventName === "recommendation_impression"
                ? canonicalRecommendationSourceSlug
                : text(body?.sourceSlug, 255),

      recommendationId:
        eventName === "event_interest_clicked" ||
        eventName === "pairing_clicked" ||
        eventName === "list_item_added" ||
        eventName === "producer_website_clicked" ||
        eventName === "where_to_buy_clicked"
          ? null
          : eventName === "recommendation_clicked" ||
              eventName === "recommendation_impression"
            ? canonicalProduct?.contentId ?? null
            : text(body?.recommendationId, 255),

      recommendationReason:
        eventName === "event_interest_clicked" ||
        eventName === "pairing_clicked" ||
        eventName === "list_item_added" ||
        eventName === "producer_website_clicked" ||
        eventName === "where_to_buy_clicked" ||
        eventName === "recommendation_clicked" ||
        eventName === "recommendation_impression"
          ? null
          : text(body?.recommendationReason, 500),

      destinationType:
        eventName === "event_interest_clicked"
          ? "event_booking"
          : eventName === "pairing_clicked" || eventName === "list_item_added"
            ? null
          : eventName === "producer_website_clicked"
            ? "producer_website"
            : eventName === "where_to_buy_clicked"
              ? "purchase"
              : eventName === "recommendation_clicked"
                ? "product"
                : eventName === "recommendation_impression"
                  ? null
                  : text(body?.destinationType, 100),

      destinationId:
        eventName === "event_interest_clicked"
          ? null
          : eventName === "pairing_clicked" ||
        eventName === "list_item_added" ||
        eventName === "producer_website_clicked" ||
        eventName === "where_to_buy_clicked"
          ? null
          : eventName === "recommendation_clicked"
            ? canonicalProduct?.contentId ?? null
            : eventName === "recommendation_impression"
              ? null
              : text(body?.destinationId, 255),

      destinationUrl:
        eventName === "event_interest_clicked"
          ? canonicalEvent?.bookingUrl ?? null
          : eventName === "pairing_clicked" || eventName === "list_item_added"
            ? null
          : eventName === "producer_website_clicked"
            ? canonicalProducer?.website ?? null
            : eventName === "where_to_buy_clicked"
              ? canonicalProduct?.purchaseUrl ?? null
              : eventName === "recommendation_clicked"
                ? canonicalRecommendationDestinationUrl
                : eventName === "recommendation_impression"
                  ? null
                  : cleanDestinationUrl(body?.destinationUrl),

      searchQuery:
        eventName === "event_interest_clicked" ||
        eventName === "pairing_clicked" ||
        eventName === "list_item_added" ||
        eventName === "producer_website_clicked" ||
        eventName === "where_to_buy_clicked"
          ? null
          : eventName === "search_performed"
            ? canonicalSearchQuery
            : text(body?.searchQuery, 500),

      resultCount:
        eventName === "event_interest_clicked" ||
        eventName === "pairing_clicked" ||
        eventName === "list_item_added" ||
        eventName === "producer_website_clicked" ||
        eventName === "where_to_buy_clicked"
          ? null
          : eventName === "search_performed"
            ? canonicalResultCount
            : cleanResultCount(body?.resultCount),

      filterName:
        eventName === "event_interest_clicked" ||
        eventName === "pairing_clicked" ||
        eventName === "list_item_added" ||
        eventName === "producer_website_clicked" ||
        eventName === "where_to_buy_clicked"
          ? null
          : eventName === "filter_applied"
            ? canonicalFilterName
            : text(body?.filterName, 150),

      filterValue:
        eventName === "event_interest_clicked" ||
        eventName === "pairing_clicked" ||
        eventName === "list_item_added" ||
        eventName === "producer_website_clicked" ||
        eventName === "where_to_buy_clicked"
          ? null
          : eventName === "filter_applied"
            ? canonicalFilterValue
            : text(body?.filterValue, 500),

      metadata:
        eventName === "event_interest_clicked"
          ? {
              title: canonicalEvent?.title ?? null,
              eventType: canonicalEvent?.eventType ?? null,
              startsAt: canonicalEvent?.startsAt ?? null,
              endsAt: canonicalEvent?.endsAt ?? null,
              venueName: canonicalEvent?.venueName ?? null,
              city: canonicalEvent?.city ?? null,
              capacity: canonicalEvent?.capacity ?? null,
              price: canonicalEvent?.price ?? null,
              status: canonicalEvent?.status ?? null,
            }
          : eventName === "where_to_buy_clicked"
            ? {
              purchaseChannel: canonicalProduct?.purchaseChannel ?? null,
              purchaseLastChecked:
                canonicalProduct?.purchaseLastChecked ?? null,
            }
          : eventName === "producer_website_clicked"
            ? undefined
            : eventName === "recommendation_clicked" ||
                eventName === "recommendation_impression"
              ? canonicalRecommendationMetadata
              : undefined,
    };

    try {
      const viewEntityId =
        eventName === "product_view"
          ? canonicalProduct?.contentId ?? null
          : eventName === "producer_view"
            ? canonicalProducer?.producerId ?? null
            : null;

      const recommendationImpressionId =
        eventName === "recommendation_impression"
          ? canonicalProduct?.contentId ?? null
          : null;

      const recommendationImpressionPairingId =
        eventName === "recommendation_impression"
          ? canonicalRecommendationSourceId
          : null;

      const recommendationImpressionAlcoholChoice =
        eventName === "recommendation_impression"
          ? canonicalRecommendationMetadata?.alcoholChoice ?? null
          : null;

      const shouldAuditRapidDuplicate =
        Boolean(sessionId) &&
        (Boolean(viewEntityId) ||
          Boolean(
            recommendationImpressionId &&
              recommendationImpressionPairingId &&
              recommendationImpressionAlcoholChoice
          ));

      if (shouldAuditRapidDuplicate && sessionId) {
        await prisma.$transaction(async (tx) => {
          const lockKey =
            eventName === "recommendation_impression"
              ? [
                  environment,
                  eventName,
                  sessionId,
                  recommendationImpressionId,
                  recommendationImpressionPairingId,
                  recommendationImpressionAlcoholChoice,
                ].join(":")
              : [
                  environment,
                  eventName,
                  sessionId,
                  viewEntityId,
                ].join(":");

          await tx.$executeRaw`
            SELECT pg_advisory_xact_lock(
              hashtextextended(${lockKey}, 0)
            )
          `;

          const duplicateWindowStart = new Date(Date.now() - 10_000);

          let previousReportableEvent: { id: string } | null = null;

          if (
            eventName === "recommendation_impression" &&
            recommendationImpressionId &&
            recommendationImpressionPairingId &&
            recommendationImpressionAlcoholChoice
          ) {
            previousReportableEvent =
              await tx.analyticsEvent.findFirst({
                where: {
                  eventName,
                  environment,
                  sessionId,
                  recommendationId: recommendationImpressionId,
                  sourceId: recommendationImpressionPairingId,
                  isReportable: true,
                  receivedAt: {
                    gte: duplicateWindowStart,
                  },
                  metadata: {
                    path: ["alcoholChoice"],
                    equals: recommendationImpressionAlcoholChoice,
                  },
                },
                orderBy: {
                  receivedAt: "desc",
                },
                select: {
                  id: true,
                },
              });
          } else if (viewEntityId) {
            previousReportableEvent =
              await tx.analyticsEvent.findFirst({
                where: {
                  eventName,
                  environment,
                  sessionId,
                  ...(eventName === "product_view"
                    ? { contentId: viewEntityId }
                    : { producerId: viewEntityId }),
                  isReportable: true,
                  receivedAt: {
                    gte: duplicateWindowStart,
                  },
                },
                orderBy: {
                  receivedAt: "desc",
                },
                select: {
                  id: true,
                },
              });
          }

          const auditedData = previousReportableEvent
            ? {
                ...data,
                isReportable: false,
                qualityReason: "rapid_duplicate",
                duplicateOfId: previousReportableEvent.id,
              }
            : data;

          await tx.analyticsEvent.create({
            data: auditedData,
          });
        });
      } else {
        await prisma.analyticsEvent.create({ data });
      }
    } catch (error: unknown) {
      if (
        clientEventId &&
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "P2002"
      ) {
        return NextResponse.json({
          success: true,
          duplicate: true,
        });
      }

      throw error;
    }

    return NextResponse.json(
      { success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Analytics ingestion error:", error);

    return NextResponse.json(
      { success: false, error: "Impossible d’enregistrer l’événement." },
      { status: 500 }
    );
  }
}
