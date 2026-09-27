"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import countries50m from "world-atlas/countries-50m.json";
import quebecGeoJson from "@/data/geo/quebec-atlas.json";
import { TerritoryAtlasMap } from "@/components/knowledge/territory-atlas-map";

export type AtlasRegion = {
  _id: string;
  name: string;
  nameEn?: string;
  slug: string;
  latitude?: number;
  longitude?: number;
};

type CountryRegionMapProps = {
  country: string;
  regions: AtlasRegion[];
  locale?: "fr" | "en";
};

type GeoFeature = {
  type: "Feature";
  id?: string | number;
  properties?: Record<string, unknown>;
  geometry: {
    type: string;
    coordinates: any;
  };
};

type ProjectedRegion = AtlasRegion & {
  x: number;
  y: number;
};

const COUNTRY_IDS: Record<string, string> = {
  "Afrique du Sud": "710",
  Allemagne: "276",
  Australie: "036",
  Autriche: "040",
  Canada: "124",
  Chili: "152",
  Espagne: "724",
  France: "250",
  Italie: "380",
  "Nouvelle-Zélande": "554",
  Portugal: "620",
  "États-Unis": "840",
};

const WIDTH = 760;
const HEIGHT = 560;

function largestPolygon(featureInput: GeoFeature): GeoFeature {
  if (featureInput.geometry.type !== "MultiPolygon") {
    return featureInput;
  }

  const polygons = featureInput.geometry.coordinates as number[][][][];

  if (!polygons.length) {
    return featureInput;
  }

  const ringArea = (ring: number[][]) => {
    let area = 0;

    for (let i = 0; i < ring.length; i += 1) {
      const [x1, y1] = ring[i];
      const [x2, y2] = ring[(i + 1) % ring.length];

      area += x1 * y2 - x2 * y1;
    }

    return Math.abs(area / 2);
  };

  const largest = polygons.reduce((best, polygon) => {
    const area = polygon[0] ? ringArea(polygon[0]) : 0;
    const bestArea = best[0] ? ringArea(best[0]) : 0;

    return area > bestArea ? polygon : best;
  }, polygons[0]);

  return {
    ...featureInput,
    geometry: {
      type: "Polygon",
      coordinates: largest,
    },
  };
}

function getWorldCountryFeature(country: string): GeoFeature | null {
  const countryId = COUNTRY_IDS[country];

  if (!countryId) return null;

  const collection = feature(
    countries50m as any,
    (countries50m as any).objects.countries
  ) as any;

  const found = collection.features.find(
    (item: GeoFeature) =>
      String(item.id).padStart(3, "0") === countryId
  ) as GeoFeature | undefined;

  if (!found) return null;

  if (country === "France" || country === "États-Unis") {
    return largestPolygon(found);
  }

  return found;
}

function getTerritoryFeature(country: string): GeoFeature | null {
  if (country === "Québec") {
    const collection = quebecGeoJson as any;

    if (
      collection?.type === "FeatureCollection" &&
      collection.features?.length
    ) {
      return collection.features[0] as GeoFeature;
    }

    if (collection?.type === "Feature") {
      return collection as GeoFeature;
    }

    return null;
  }

  return getWorldCountryFeature(country);
}

function RegionMarker({
  region,
  index,
  activeSlug,
  setActiveSlug,
  compact = false,
  locale = "fr",
}: {
  region: ProjectedRegion;
  index: number;
  activeSlug: string | null;
  setActiveSlug: (slug: string | null) => void;
  compact?: boolean;
  locale?: "fr" | "en";
}) {
  const isActive = activeSlug === region.slug;
  const muted = Boolean(activeSlug && !isActive);

  // Décalage visuel des numéros uniquement.
  // Les coordonnées géographiques des points ne bougent pas.
  const compactLabelOffsets = [
    { x: -22, y: 16 }, // 01 · Cantons-de-l'Est
    { x: 12, y: -10 }, // 02 · Lanaudière
    { x: 13, y: 15 },  // 03 · Montérégie
  ];

  const compactLabelOffset =
    compactLabelOffsets[index] ?? { x: 12, y: -9 };

  return (
    <g
      role="link"
      tabIndex={0}
      aria-label={region.name}
      className="cursor-pointer"
      style={{
        opacity: muted ? 0.22 : 1,
        transition: "opacity 180ms ease",
      }}
      onMouseEnter={() => setActiveSlug(region.slug)}
      onMouseLeave={() => setActiveSlug(null)}
      onFocus={() => setActiveSlug(region.slug)}
      onBlur={() => setActiveSlug(null)}
      onClick={() => {
        window.location.href = `${locale === "en" ? "/en/regions" : "/regions"}/${region.slug}`;
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          window.location.href = `${locale === "en" ? "/en/regions" : "/regions"}/${region.slug}`;
        }
      }}
    >
      <circle
        cx={region.x}
        cy={region.y}
        r={isActive ? (compact ? 10 : 15) : compact ? 7 : 11}
        fill="var(--lpv-paper)"
        stroke="var(--lpv-cocoa)"
        strokeWidth={isActive ? 1.4 : 0.8}
        vectorEffect="non-scaling-stroke"
      />

      <circle
        cx={region.x}
        cy={region.y}
        r={isActive ? (compact ? 4.5 : 6) : compact ? 3.2 : 4.5}
        fill="var(--lpv-cocoa)"
      />

      {compact ? (
        <text
          x={region.x + compactLabelOffset.x}
          y={region.y + compactLabelOffset.y}
          fill="var(--lpv-muted)"
          fontSize="8"
          fontWeight="500"
          letterSpacing="1.2"
        >
          {String(index + 1).padStart(2, "0")}
        </text>
      ) : (
        <>
          <text
            x={region.x + 18}
            y={region.y - 11}
            fill="var(--lpv-muted)"
            fontSize="9"
            letterSpacing="1.4"
          >
            {String(index + 1).padStart(2, "0")}
          </text>

          <text
            x={region.x + 18}
            y={region.y + 5}
            fill="var(--lpv-ink)"
            fontSize={isActive ? 14 : 12}
            fontWeight={isActive ? 500 : 400}
          >
            {region.name}
          </text>
        </>
      )}
    </g>
  );
}

export function CountryRegionMap({
  country,
  regions,
  locale = "fr",
}: CountryRegionMapProps) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const mappedRegions = useMemo(
    () =>
      regions.filter(
        (region) =>
          typeof region.latitude === "number" &&
          typeof region.longitude === "number"
      ),
    [regions]
  );

  const geography = useMemo(() => {
    const territoryFeature = getTerritoryFeature(country);

    if (!territoryFeature) return null;

    /*
     * Cadrage de l'Atlas.
     *
     * Québec : on cadre le sud viticole plutôt que toute la province.
     * La vraie silhouette du Québec est ensuite dessinée avec cette même
     * projection : le SVG agit donc comme une fenêtre géographique.
     *
     * Les autres territoires restent cadrés sur leur géométrie complète.
     */
    const projection = geoMercator().fitExtent(
      [
        [55, 45],
        [WIDTH - 55, HEIGHT - 45],
      ],
      territoryFeature as any
    );

    const path = geoPath(projection);
    const countryPath = path(territoryFeature as any);

    const points = mappedRegions
      .map((region) => {
        const projected = projection([
          region.longitude!,
          region.latitude!,
        ]);

        if (!projected) return null;

        return {
          ...region,
          // Stabilise le rendu SSR/client de D3.
          // 4 décimales sont largement suffisantes pour un SVG 760 × 560.
          x: Math.round(projected[0] * 10000) / 10000,
          y: Math.round(projected[1] * 10000) / 10000,
        };
      })
      .filter(Boolean) as ProjectedRegion[];

    return {
      countryPath,
      points,
    };
  }, [country, mappedRegions]);

  return (
    <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
      {/* CARTE VECTORIELLE */}
      <div className="relative flex min-h-[340px] items-center justify-center md:min-h-[560px]">
        <div className="relative w-full">
          <TerritoryAtlasMap
            territory={country}
            regions={regions}
            activeSlug={activeSlug}
            setActiveSlug={setActiveSlug}
          />
        </div>
      </div>

      {/* LISTE DES RÉGIONS */}
      <div className="flex flex-col justify-center">
        {regions.map((region, index) => {
          const isActive = activeSlug === region.slug;

          const hasCoordinates =
            typeof region.latitude === "number" &&
            typeof region.longitude === "number";

          return (
            <Link
              key={region._id}
              href={`${locale === "en" ? "/en/regions" : "/regions"}/${region.slug}`}
              onMouseEnter={() => {
                if (hasCoordinates) {
                  setActiveSlug(region.slug);
                }
              }}
              onMouseLeave={() => setActiveSlug(null)}
              onFocus={() => {
                if (hasCoordinates) {
                  setActiveSlug(region.slug);
                }
              }}
              onBlur={() => setActiveSlug(null)}
              className={`group grid grid-cols-[2.25rem_1fr_auto] items-center gap-4 border-b border-[var(--lpv-line)] py-5 last:border-b-0 md:last:border-b transition-opacity duration-200 ${
                activeSlug && !isActive ? "opacity-35" : "opacity-100"
              }`}
            >
              <span className="text-[0.6rem] tracking-[0.16em] text-[var(--lpv-muted)]">
                {String(index + 1).padStart(2, "0")}
              </span>

              <span className="lpv-display text-3xl leading-none md:text-4xl">
                {region.name}
              </span>

              <span className="text-sm transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
