import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import type { SanityImageSource } from "@sanity/image-url";

import EventInterestLink from "@/components/analytics/EventInterestLink";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

export const revalidate = 60;

type EventPage = {
  _id: string;
  title: string;
  titleEn?: string;
  slug: string;
  eventType: string;
  description?: PortableTextBlock[];
  descriptionEn?: PortableTextBlock[];
  coverImage?: SanityImageSource;
  startsAt: string;
  endsAt?: string;
  venueName: string;
  city: string;
  address?: string;
  capacity?: number;
  price?: number;
  bookingUrl: string;
  status: string;
};

const eventQuery = `
  *[
    _type == "event" &&
    slug.current == $slug &&
    published == true &&
    status == "upcoming" &&
    defined(bookingUrl) &&
    !(_id in path("drafts.**"))
  ][0]{
    _id,
    title,
    titleEn,
    "slug": slug.current,
    eventType,
    description,
    descriptionEn,
    coverImage,
    startsAt,
    endsAt,
    venueName,
    city,
    address,
    capacity,
    price,
    bookingUrl,
    status
  }
`;

const eventTypeLabels: Record<string, string> = {
  tasting: "Tasting",
  "producer-meetup": "Meet the producer",
  workshop: "Workshop",
  dinner: "Dinner · pairing",
  popup: "Pop-up",
  other: "Event",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Toronto",
  }).format(new Date(value));
}

function formatPrice(value?: number) {
  if (typeof value !== "number") return null;

  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(value);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const event = await client.fetch<EventPage | null>(eventQuery, {
    slug,
  });

  if (!event) {
    return {
      title: "Events | Le Premier Verre",
    };
  }

  return {
    title: `${event.titleEn || event.title} | Le Premier Verre`,
    description: `${event.venueName} · ${event.city}`,
  };
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const event = await client.fetch<EventPage | null>(eventQuery, {
    slug,
  });

  if (!event) notFound();

  const title = event.titleEn || event.title;
  const description = event.descriptionEn || event.description;

  const imageSrc = event.coverImage
    ? urlFor(event.coverImage)
        .width(1600)
        .height(1100)
        .fit("crop")
        .url()
    : null;

  const price = formatPrice(event.price);

  return (
    <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
      <article className="lpv-container pb-24">
        <div className="pt-8 md:pt-10">
          <Link href="/en" className="lpv-text-link">
            <span>←</span> Le Premier Verre
          </Link>
        </div>

        <section className="border-b border-[var(--lpv-line)] pb-16 pt-16 md:pb-24 md:pt-24">
          <div className="flex items-start justify-between gap-8">
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              Event · {eventTypeLabels[event.eventType] ?? "Event"}
            </p>

            <p className="max-w-md text-right text-xs uppercase tracking-[0.16em] text-[var(--lpv-muted)]">
              {event.city}
            </p>
          </div>

          <h1 className="lpv-display mt-12 max-w-[12ch] text-[clamp(4.5rem,10vw,10rem)] leading-[0.82] tracking-[-0.05em]">
            {title}
          </h1>

          {imageSrc ? (
            <div className="mt-14 border-t border-[var(--lpv-line)] pt-8 md:mt-20 md:pt-10">
              <div className="aspect-[3/2] overflow-hidden bg-[var(--lpv-paper-light)]">
                <img
                  src={imageSrc}
                  alt={title}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          ) : null}
        </section>

        <section className="grid gap-12 border-b border-[var(--lpv-line)] py-14 md:grid-cols-[0.62fr_0.38fr] md:py-20">
          <div>
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              The event
            </p>

            {description?.length ? (
              <div className="mt-8 max-w-2xl space-y-5 text-lg leading-8 text-[var(--lpv-muted)]">
                <PortableText value={description} />
              </div>
            ) : (
              <p className="mt-8 max-w-2xl text-lg leading-8 text-[var(--lpv-muted)]">
                A Le Premier Verre event.
              </p>
            )}
          </div>

          <div className="border-t border-[var(--lpv-line)] pt-8 md:border-l md:border-t-0 md:pl-10 md:pt-0">
            <dl className="space-y-7">
              <div>
                <dt className="lpv-kicker text-[var(--lpv-muted)]">
                  When
                </dt>
                <dd className="mt-2 text-lg">
                  {formatDate(event.startsAt)}
                </dd>
              </div>

              <div>
                <dt className="lpv-kicker text-[var(--lpv-muted)]">
                  Where
                </dt>
                <dd className="mt-2 text-lg">
                  {event.venueName}
                  <br />
                  <span className="text-[var(--lpv-muted)]">
                    {[event.address, event.city]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </dd>
              </div>

              {price ? (
                <div>
                  <dt className="lpv-kicker text-[var(--lpv-muted)]">
                    Ticket
                  </dt>
                  <dd className="mt-2 text-lg">{price}</dd>
                </div>
              ) : null}

              {typeof event.capacity === "number" ? (
                <div>
                  <dt className="lpv-kicker text-[var(--lpv-muted)]">
                    Capacity
                  </dt>
                  <dd className="mt-2 text-lg">
                    {event.capacity} guests
                  </dd>
                </div>
              ) : null}
            </dl>

            <EventInterestLink
              href={event.bookingUrl}
              eventId={event._id}
              locale="en"
              target="_blank"
              rel="noreferrer"
              className="mt-10 inline-flex border-b border-[var(--lpv-ink)] pb-1 text-sm uppercase tracking-[0.16em] transition-opacity hover:opacity-50"
            >
              Book ↗
            </EventInterestLink>
          </div>
        </section>
      </article>
    </main>
  );
}
