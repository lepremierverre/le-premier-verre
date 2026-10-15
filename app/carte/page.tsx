"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Script from "next/script";
import PremiumPageShell from "../../components/ui/PremiumPageShell";
import {
  PremiumInfoCard,
  PremiumSection,
  PremiumStatCard,
} from "../../components/ui/PremiumSection";

type MapMode = "quebec" | "world";
type Budget = "petit" | "moyen" | "premium";
type Pace = "detente" | "equilibre" | "intensif";
type PointType = "vineyard" | "wine";

type MapPoint = {
  id: string;
  name: string;
  slug?: string | null;
  latitude: number;
  longitude: number;
  type: PointType;
  region?: string | null;
  country?: string | null;
  city?: string | null;
  image?: string | null;
  originLabel?: string | null;
  isQuebec?: boolean;
  featured?: boolean;
  price?: number | null;
  color?: string | null;
  style?: string | null;
  producer?: string | null;
  description?: string | null;
};

type RouteStop = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type?: PointType;
  region?: string | null;
  country?: string | null;
  city?: string | null;
  image?: string | null;
  description?: string | null;
  score?: number | null;
};

type PlannedRoute = {
  title?: string;
  subtitle?: string;
  summary?: string;
  totalDistanceKm?: number;
  totalDurationMinutes?: number;
  estimatedBudgetLabel?: string;
  encodedPolyline?: string;
  polyline?: string;
  path?: Array<{ lat: number; lng: number }>;
  stops?: RouteStop[];
};

type RouteApiResponse = {
  route?: PlannedRoute;
  routes?: PlannedRoute[];
};

type RoutePreferences = {
  days: number;
  budget: Budget;
  styles: string[];
  pace: Pace;
  regionMode: MapMode;
};

type EditorialCard = {
  _id: string;
  name?: string;
  title?: string;
  slug?: string | null;
  municipality?: string | null;
  oneLiner?: string | null;
  description?: string | null;
  excerpt?: string | null;
  imageUrl?: string | null;
  country?: { name?: string | null } | null;
  region?: { name?: string | null } | null;
  category?: string | null;
  guideType?: string | null;
};

type EditorialMapContent = {
  producers: EditorialCard[];
  regions: EditorialCard[];
  guides: EditorialCard[];
  articles: EditorialCard[];
};

declare global {
  interface Window {
    google?: typeof google;
  }
}

const MAP_ID = "le-premier-verre-map";
const DEFAULT_CENTER_QUEBEC = { lat: 45.3151, lng: -72.9046 };
const DEFAULT_CENTER_WORLD = { lat: 20, lng: 0 };
const STYLE_OPTIONS = [
  "Rouge",
  "Blanc",
  "Rosé",
  "Bulles",
  "Nature",
  "Orange",
  "Biodynamie",
  "Premium",
];

const WORLD_COUNTRIES = [
  "France",
  "Italie",
  "Espagne",
  "Portugal",
  "États-Unis",
  "Argentine",
  "Chili",
  "Australie",
  "Nouvelle-Zélande",
  "Afrique du Sud",
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function formatDuration(minutes?: number) {
  if (!minutes || Number.isNaN(minutes)) return "—";
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);

  if (h <= 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h} h ${m} min`;
}

function formatDistance(distanceKm?: number) {
  if (!distanceKm || Number.isNaN(distanceKm)) return "—";
  if (distanceKm < 10) return `${distanceKm.toFixed(1)} km`;
  return `${Math.round(distanceKm)} km`;
}

function normalizeValue(value: string | null | undefined): string {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’]/g, " ")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function isQuebecLikePoint(point: MapPoint): boolean {
  const values = [
    normalizeValue(point.country),
    normalizeValue(point.region),
    normalizeValue(point.city),
  ];

  if (point.isQuebec === true) return true;

  return values.some(
    (value) =>
      value === "quebec" ||
      value.includes("quebec") ||
      value === "monteregie" ||
      value === "estrie" ||
      value === "lanaudiere" ||
      value === "laurentides" ||
      value === "cantons de l est" ||
      value === "eastern townships" ||
      value === "ile d orleans"
  );
}

function markerGlyph(point: MapPoint) {
  if (point.type === "vineyard") return "V";
  return point.isQuebec ? "Q" : "M";
}

function resolvePointImage(point?: {
  image?: string | null;
  type?: PointType;
  isQuebec?: boolean;
}) {
  if (point?.image && point.image.trim().length > 0) {
    return point.image;
  }

  if (point?.type === "vineyard") {
    return "/images/lpv/vignes.jpg";
  }

  if (point?.isQuebec) {
    return "/images/lpv/table-vin.jpg";
  }

  return "/images/lpv/IMG_9706.JPG";
}

const lpvMapStyles: google.maps.MapTypeStyle[] = [
  {
    elementType: "geometry",
    stylers: [{ color: "#e6ddd1" }],
  },
  {
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#5e4f43" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#efe8df" }],
  },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [{ color: "#a89483" }],
  },
  {
    featureType: "administrative.country",
    elementType: "geometry.stroke",
    stylers: [{ color: "#7b6657" }, { weight: 1.2 }],
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [{ color: "#e3d9cc" }],
  },
  {
    featureType: "poi",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#f0e8de" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#c5b4a4" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6f5a4b" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#d7c8ba" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#9f8978" }],
  },
  {
    featureType: "transit",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#c4cbc8" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#5f6a66" }],
  },
];

export default function CartePage() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.OverlayView[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const routePolylineRef = useRef<google.maps.Polyline | null>(null);

  const [mapsReady, setMapsReady] = useState(false);

  useEffect(() => {
    if (window.google?.maps) {
      setMapsReady(true);
    }
  }, []);
  const [mapMode, setMapMode] = useState<MapMode>("quebec");
  const [regionSlug, setRegionSlug] = useState<string | null>(null);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [points, setPoints] = useState<MapPoint[]>([]);
  const [loadingPoints, setLoadingPoints] = useState(false);
  const [pointsError, setPointsError] = useState<string | null>(null);

  const [editorialContent, setEditorialContent] = useState<EditorialMapContent>({
    producers: [],
    regions: [],
    guides: [],
    articles: [],
  });

  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
  const [selectedStart, setSelectedStart] = useState<MapPoint | null>(null);

  const [days, setDays] = useState(2);
  const [budget, setBudget] = useState<Budget>("moyen");
  const [styles, setStyles] = useState<string[]>(["Rouge"]);
  const [pace, setPace] = useState<Pace>("equilibre");

  const [planning, setPlanning] = useState(false);
  const [planningError, setPlanningError] = useState<string | null>(null);
  const [plannedRoutes, setPlannedRoutes] = useState<PlannedRoute[]>([]);
  const [activeRouteIndex, setActiveRouteIndex] = useState(0);

  const activeRoute = plannedRoutes[activeRouteIndex] ?? null;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setRegionSlug(params.get("region"));
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadEditorialContent() {
      try {
        const res = await fetch("/api/map/editorial", {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) return;

        const data = await res.json();

        if (!cancelled) {
          setEditorialContent({
            producers: Array.isArray(data?.producers) ? data.producers : [],
            regions: Array.isArray(data?.regions) ? data.regions : [],
            guides: Array.isArray(data?.guides) ? data.guides : [],
            articles: Array.isArray(data?.articles) ? data.articles : [],
          });
        }
      } catch {
        // Le contenu éditorial est complémentaire : la carte reste utilisable sans lui.
      }
    }

    loadEditorialContent();

    return () => {
      cancelled = true;
    };
  }, []);

  const visiblePoints = useMemo(() => {
    if (mapMode === "quebec") {
      const vineyards = points.filter(
        (point) => point.type === "vineyard"
      );

      if (!regionSlug) {
        return vineyards;
      }

      const targetRegion = normalizeValue(regionSlug);

      return vineyards.filter(
        (point) => normalizeValue(point.region) === targetRegion
      );
    }

    return points.filter((point) => point.type === "wine");
  }, [mapMode, points, regionSlug]);

  const editorialGallery = useMemo(
    () => [
      {
        src: "/images/lpv/pexels-cmphotos06-5526117.jpg",
        title: "Paysage & dégustation",
        text: "Une lecture plus sensible du territoire, entre vignobles, routes et provenance.",
      },
      {
        src: "/images/lpv/greta-farnedi-DWZaTfhfZ_s-unsplash.jpg",
        title: "Origines sélectionnées",
        text: "Les points affichés sur la carte prennent une présence plus éditoriale et plus incarnée.",
      },
      {
        src: "/images/lpv/jkalina-grWhT_5JPDA-unsplash.jpg",
        title: "Terroir vivant",
        text: "Chaque itinéraire relie un lieu, une matière et une signature gustative.",
      },
    ],
    []
  );

  const initializeMap = useCallback(() => {
    if (!mapRef.current || !window.google || mapInstanceRef.current) return;

    const google = window.google;

    mapInstanceRef.current = new google.maps.Map(mapRef.current, {
      center: DEFAULT_CENTER_QUEBEC,
      zoom: 7,
      minZoom: 2,
      styles: lpvMapStyles,
      backgroundColor: "#e6ddd1",
      disableDefaultUI: true,
      zoomControl: true,
      fullscreenControl: false,
      streetViewControl: false,
      mapTypeControl: false,
      clickableIcons: false,
      gestureHandling: "greedy",
    });

    infoWindowRef.current = new google.maps.InfoWindow();
  }, []);

  const fitMapToPoints = useCallback(
    (pts: MapPoint[]) => {
      const map = mapInstanceRef.current;
      const google = window.google;
      if (!map || !google) return;

      if (pts.length === 0) {
        map.setCenter(
          mapMode === "quebec" ? DEFAULT_CENTER_QUEBEC : DEFAULT_CENTER_WORLD
        );
        map.setZoom(mapMode === "quebec" ? 7 : 2);
        return;
      }

      if (pts.length === 1) {
        map.panTo({ lat: pts[0].latitude, lng: pts[0].longitude });
        map.setZoom(mapMode === "quebec" ? 10 : 5);
        return;
      }

      const bounds = new google.maps.LatLngBounds();
      pts.forEach((point) => {
        bounds.extend({ lat: point.latitude, lng: point.longitude });
      });
      map.fitBounds(bounds, 80);
    },
    [mapMode]
  );

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((marker) => {
      marker.setMap(null);
    });
    markersRef.current = [];
  }, []);

  const clearRouteLine = useCallback(() => {
    if (routePolylineRef.current) {
      routePolylineRef.current.setMap(null);
      routePolylineRef.current = null;
    }
  }, []);

  const renderMarkers = useCallback(
    (pts: MapPoint[]) => {
      const map = mapInstanceRef.current;
      const google = window.google;
      const infoWindow = infoWindowRef.current;

      if (!map || !google) return;

      clearMarkers();

      markersRef.current = pts.map((point) => {
        let element: HTMLButtonElement | null = null;

        const overlay = new google.maps.OverlayView();

        overlay.onAdd = () => {
          element = document.createElement("button");
          element.type = "button";
          element.title = point.name;

          element.style.position = "absolute";
          element.style.transform = "translate(-50%, -50%)";
          element.style.cursor = "pointer";
          element.style.padding = "0";
          element.style.margin = "0";
          element.style.zIndex = "2";

          if (point.type === "vineyard" && point.image) {
            element.style.width = "58px";
            element.style.height = "58px";
            element.style.borderRadius = "9999px";
            element.style.overflow = "hidden";
            element.style.border = "3px solid #f4eee6";
            element.style.background = "#d8cec1";
            element.style.boxShadow =
              "0 5px 18px rgba(63, 45, 34, 0.28)";

            const img = document.createElement("img");
            img.src = point.image;
            img.alt = point.name;
            img.style.width = "100%";
            img.style.height = "100%";
            img.style.objectFit = "cover";
            img.style.display = "block";

            element.appendChild(img);
          } else {
            element.style.width = "42px";
            element.style.height = "42px";
            element.style.borderRadius = "9999px";
            element.style.border = "2px solid #f4eee6";
            element.style.background = "#8c654b";
            element.style.color = "#ffffff";
            element.style.fontSize = "11px";
            element.style.fontWeight = "600";
            element.style.display = "flex";
            element.style.alignItems = "center";
            element.style.justifyContent = "center";
            element.style.boxShadow =
              "0 5px 18px rgba(63, 45, 34, 0.25)";

            element.innerText = markerGlyph(point);
          }

          element.addEventListener("click", () => {
            setSelectedPoint(point);
            setSelectedStart(point);
            setPlanningError(null);

            const html = `
              <div style="min-width:220px;max-width:260px;padding:6px 2px 4px 2px;">
                <div style="font-size:11px;color:#8b6b57;text-transform:uppercase;letter-spacing:.12em;margin-bottom:6px;">
                  ${point.type === "vineyard" ? "Vignoble" : "Vin"}
                </div>

                <div style="font-weight:600;font-size:17px;color:#221a17;line-height:1.2;margin-bottom:7px;">
                  ${point.name}
                </div>

                <div style="font-size:13px;color:#5b4c43;line-height:1.5;">
                  ${[point.city, point.region, point.country]
                    .filter(Boolean)
                    .join(", ")}
                </div>
              </div>
            `;

            infoWindow?.setContent(html);
            infoWindow?.setPosition({
              lat: point.latitude,
              lng: point.longitude,
            });
            infoWindow?.open({ map });

            map.panTo({
              lat: point.latitude,
              lng: point.longitude,
            });
          });

          overlay
            .getPanes()
            ?.overlayMouseTarget.appendChild(element);
        };

        overlay.draw = () => {
          if (!element) return;

          const projection = overlay.getProjection();

          const position = projection.fromLatLngToDivPixel(
            new google.maps.LatLng(
              point.latitude,
              point.longitude
            )
          );

          if (!position) return;

          element.style.left = `${position.x}px`;
          element.style.top = `${position.y}px`;
        };

        overlay.onRemove = () => {
          if (element) {
            element.remove();
            element = null;
          }
        };

        overlay.setMap(map);

        return overlay;
      });
    },
    [clearMarkers]
  );

  const fetchPoints = useCallback(
    async (mode: MapMode) => {
      setLoadingPoints(true);
      setPointsError(null);

      try {
        if (mode === "world" && selectedCountries.length === 0) {
          setPoints([]);
          setSelectedPoint(null);
          setSelectedStart((current) => {
            if (!current) return null;
            return current.type === "wine" ? null : current;
          });
          setPlannedRoutes([]);
          setActiveRouteIndex(0);
          clearRouteLine();
          return;
        }

        let url = `/api/map/points?mode=${mode}`;

        if (mode === "world") {
          url += `&countries=${encodeURIComponent(selectedCountries.join(","))}&limit=500`;
        }

        const res = await fetch(url, {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`Impossible de charger les points (${res.status})`);
        }

        const data = await res.json();
        const nextPoints: MapPoint[] = Array.isArray(data?.points)
          ? data.points
          : [];

        setPoints(nextPoints);
        setSelectedPoint(null);
        setSelectedStart((current) => {
          if (!current) return null;
          const stillExists = nextPoints.find((p) => p.id === current.id);
          return stillExists ?? null;
        });
        setPlannedRoutes([]);
        setActiveRouteIndex(0);
        clearRouteLine();
      } catch (error) {
        setPointsError(
          error instanceof Error
            ? error.message
            : "Une erreur est survenue lors du chargement des points."
        );
      } finally {
        setLoadingPoints(false);
      }
    },
    [clearRouteLine, selectedCountries]
  );

  const drawRoute = useCallback(
    (route: PlannedRoute | null) => {
      const map = mapInstanceRef.current;
      const google = window.google;

      clearRouteLine();

      if (!map || !google || !route) return;

      let path: Array<{ lat: number; lng: number }> = [];

      if (Array.isArray(route.path) && route.path.length > 0) {
        path = route.path;
      } else {
        const encoded = route.encodedPolyline || route.polyline;
        if (
          encoded &&
          google.maps.geometry &&
          google.maps.geometry.encoding &&
          typeof google.maps.geometry.encoding.decodePath === "function"
        ) {
          path = google.maps.geometry.encoding.decodePath(encoded).map((p) => ({
            lat: p.lat(),
            lng: p.lng(),
          }));
        }
      }

      if (path.length === 0) return;

      routePolylineRef.current = new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: "#d6b692",
        strokeOpacity: 0.95,
        strokeWeight: 5,
      });

      routePolylineRef.current.setMap(map);

      const bounds = new google.maps.LatLngBounds();
      path.forEach((p) => bounds.extend(p));
      map.fitBounds(bounds, 120);
    },
    [clearRouteLine]
  );

  const handleToggleStyle = (style: string) => {
    setStyles((current) =>
      current.includes(style)
        ? current.filter((item) => item !== style)
        : [...current, style]
    );
  };

  const toggleCountry = (country: string) => {
    setSelectedCountries((current) => {
      if (current.includes(country)) {
        return current.filter((item) => item !== country);
      }

      if (current.length >= 5) {
        return current;
      }

      return [...current, country];
    });
  };

  const handleChooseStart = (point: MapPoint) => {
    setSelectedStart(point);
    setSelectedPoint(point);
    setPlanningError(null);

    const map = mapInstanceRef.current;
    if (map) {
      map.panTo({ lat: point.latitude, lng: point.longitude });
      map.setZoom(Math.max(map.getZoom() ?? 8, 9));
    }
  };

  const handlePlanRoute = async () => {
    if (!selectedStart) {
      setPlanningError(
        "Choisis d’abord un point de départ sur la carte ou dans la liste."
      );
      return;
    }

    setPlanning(true);
    setPlanningError(null);

    try {
      const payload = {
        start: {
          id: selectedStart.id,
          lat: selectedStart.latitude,
          lng: selectedStart.longitude,
          name: selectedStart.name,
        },
        preferences: {
          days,
          budget,
          styles,
          pace,
          regionMode: mapMode,
        } satisfies RoutePreferences,
      };

      const res = await fetch("/api/routes/plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Impossible de planifier l’itinéraire (${res.status})`);
      }

      const data: RouteApiResponse = await res.json();

      const nextRoutes =
        Array.isArray(data.routes) && data.routes.length > 0
          ? data.routes
          : data.route
            ? [data.route]
            : [];

      setPlannedRoutes(nextRoutes);
      setActiveRouteIndex(0);

      if (nextRoutes[0]) {
        drawRoute(nextRoutes[0]);
      } else {
        clearRouteLine();
      }
    } catch (error) {
      setPlanningError(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue pendant la planification."
      );
    } finally {
      setPlanning(false);
    }
  };

  useEffect(() => {
    if (!mapsReady) return;
    initializeMap();
  }, [mapsReady, initializeMap]);

  useEffect(() => {
    fetchPoints(mapMode);
  }, [fetchPoints, mapMode, selectedCountries]);

  useEffect(() => {
    if (!mapsReady || !mapInstanceRef.current) return;

    renderMarkers(visiblePoints);
    fitMapToPoints(visiblePoints);
  }, [mapsReady, visiblePoints, renderMarkers, fitMapToPoints]);

  useEffect(() => {
    drawRoute(activeRoute);
  }, [activeRoute, drawRoute]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (mapMode === "quebec") {
      if (regionSlug) return;

      map.setCenter(DEFAULT_CENTER_QUEBEC);
      map.setZoom(7);
    } else {
      map.setCenter(DEFAULT_CENTER_WORLD);
      map.setZoom(2);
    }
  }, [mapMode, regionSlug]);

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=marker,geometry`}
        strategy="afterInteractive"
        onLoad={() => setMapsReady(true)}
        onReady={() => setMapsReady(true)}
      />

      <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
        <div className="mx-auto w-full max-w-[1500px] px-5 pb-24 pt-16 md:px-8 md:pt-24 lg:px-12">

          {/* HERO */}
          <header className="border-b border-[var(--lpv-line)] pb-12 md:pb-16">
            <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--lpv-muted)]">
              Carte
            </p>

            <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_420px] lg:items-end">
              <div>
                <h1 className="max-w-5xl text-[clamp(4rem,9vw,9rem)] font-medium leading-[0.83] tracking-[-0.065em]">
                  Routes &
                  <br />
                  vignobles.
                </h1>
              </div>

              <div className="pb-2">
                <p className="max-w-md text-lg leading-8 text-[var(--lpv-muted)]">
                  Le vin commence toujours quelque part. Cette carte rassemble
                  les lieux, les producteurs et les routes qui permettent de
                  mieux comprendre ce qu’il y a dans le verre.
                </p>

                <div className="mt-7 flex gap-6 border-t border-[var(--lpv-line)] pt-5">
                  <button
                    type="button"
                    onClick={() => {
                      setMapMode("quebec");
                      setSelectedCountries([]);
                    }}
                    className={cx(
                      "border-b pb-1 text-sm transition",
                      mapMode === "quebec"
                        ? "border-[var(--lpv-ink)] text-[var(--lpv-ink)]"
                        : "border-transparent text-[var(--lpv-muted)] hover:border-[var(--lpv-line)]"
                    )}
                  >
                    Québec
                  </button>

                  <button
                    type="button"
                    onClick={() => setMapMode("world")}
                    className={cx(
                      "border-b pb-1 text-sm transition",
                      mapMode === "world"
                        ? "border-[var(--lpv-ink)] text-[var(--lpv-ink)]"
                        : "border-transparent text-[var(--lpv-muted)] hover:border-[var(--lpv-line)]"
                    )}
                  >
                    Monde
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* MAP */}
          <section className="border-b border-[var(--lpv-line)] py-10 md:py-14">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="text-[11px] uppercase tracking-[0.25em] text-[var(--lpv-muted)]">
                  Territoire
                </p>
                <h2 className="mt-2 text-3xl tracking-[-0.03em] md:text-4xl">
                  {mapMode === "quebec" ? "Vignobles du Québec" : "Origines du monde"}
                </h2>
              </div>

              <p className="text-sm text-[var(--lpv-muted)]">
                {visiblePoints.length} point{visiblePoints.length !== 1 ? "s" : ""} visible{visiblePoints.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="relative overflow-hidden border border-[var(--lpv-line)] bg-[#ded5c8]">
              <div
                ref={mapRef}
                className="h-[68vh] min-h-[560px] w-full md:min-h-[680px]"
              />

              {loadingPoints && points.length === 0 && (
                <div className="absolute right-4 top-4 bg-[var(--lpv-paper)] px-4 py-2 text-sm">
                  Chargement…
                </div>
              )}

              {pointsError && (
                <div className="absolute bottom-4 right-4 max-w-sm border border-[#9e6c5f] bg-[var(--lpv-paper)] px-4 py-3 text-sm text-[#7a4037]">
                  {pointsError}
                </div>
              )}
            </div>
          </section>

          {/* WORLD FILTER */}
          {mapMode === "world" && (
            <section className="border-b border-[var(--lpv-line)] py-10">
              <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-[var(--lpv-muted)]">
                    Monde
                  </p>
                  <h2 className="mt-3 text-3xl tracking-[-0.03em]">
                    Choisir les pays
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-[var(--lpv-muted)]">
                    Jusqu’à cinq pays peuvent être affichés simultanément.
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-x-6 gap-y-4">
                    {WORLD_COUNTRIES.map((country) => {
                      const active = selectedCountries.includes(country);

                      return (
                        <button
                          key={country}
                          type="button"
                          onClick={() => toggleCountry(country)}
                          className={cx(
                            "border-b pb-1 text-base transition",
                            active
                              ? "border-[var(--lpv-ink)] text-[var(--lpv-ink)]"
                              : "border-transparent text-[var(--lpv-muted)] hover:border-[var(--lpv-line)]"
                          )}
                        >
                          {country}
                        </button>
                      );
                    })}
                  </div>

                  {selectedCountries.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedCountries([])}
                      className="mt-7 text-sm underline underline-offset-4 text-[var(--lpv-muted)]"
                    >
                      Effacer la sélection
                    </button>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* PLANNER */}
          <section className="border-b border-[var(--lpv-line)] py-14 md:py-20">
            <div className="grid gap-14 xl:grid-cols-[0.9fr_1.1fr]">

              <div>
                <p className="text-[11px] uppercase tracking-[0.25em] text-[var(--lpv-muted)]">
                  Itinéraire
                </p>
                <h2 className="mt-3 text-4xl tracking-[-0.04em] md:text-5xl">
                  Construire une route.
                </h2>
                <p className="mt-4 max-w-lg text-base leading-7 text-[var(--lpv-muted)]">
                  Choisis un point de départ, une durée, un budget et quelques
                  préférences. Le Premier Verre propose ensuite un parcours.
                </p>

                <div className="mt-10 space-y-9">
                  <div>
                    <p className="mb-3 text-sm">Durée</p>
                    <div className="flex flex-wrap gap-3">
                      {[1, 2, 3].map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setDays(value)}
                          className={cx(
                            "border px-5 py-3 text-sm transition",
                            days === value
                              ? "border-[var(--lpv-ink)] bg-[var(--lpv-ink)] text-[var(--lpv-paper)]"
                              : "border-[var(--lpv-line)] hover:border-[var(--lpv-ink)]"
                          )}
                        >
                          {value} jour{value > 1 ? "s" : ""}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 text-sm">Budget</p>
                    <div className="flex flex-wrap gap-3">
                      {(["petit", "moyen", "premium"] as Budget[]).map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setBudget(value)}
                          className={cx(
                            "border px-5 py-3 text-sm capitalize transition",
                            budget === value
                              ? "border-[var(--lpv-ink)] bg-[var(--lpv-ink)] text-[var(--lpv-paper)]"
                              : "border-[var(--lpv-line)] hover:border-[var(--lpv-ink)]"
                          )}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 text-sm">Rythme</p>
                    <div className="flex flex-wrap gap-3">
                      {(
                        [
                          ["detente", "Détente"],
                          ["equilibre", "Équilibré"],
                          ["intensif", "Intensif"],
                        ] as Array<[Pace, string]>
                      ).map(([value, label]) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setPace(value)}
                          className={cx(
                            "border px-5 py-3 text-sm transition",
                            pace === value
                              ? "border-[var(--lpv-ink)] bg-[var(--lpv-ink)] text-[var(--lpv-paper)]"
                              : "border-[var(--lpv-line)] hover:border-[var(--lpv-ink)]"
                          )}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 text-sm">Styles recherchés</p>
                    <div className="flex flex-wrap gap-x-5 gap-y-3">
                      {STYLE_OPTIONS.map((style) => {
                        const active = styles.includes(style);

                        return (
                          <button
                            key={style}
                            type="button"
                            onClick={() => handleToggleStyle(style)}
                            className={cx(
                              "border-b pb-1 text-sm transition",
                              active
                                ? "border-[var(--lpv-ink)] text-[var(--lpv-ink)]"
                                : "border-transparent text-[var(--lpv-muted)] hover:border-[var(--lpv-line)]"
                            )}
                          >
                            {style}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="border-t border-[var(--lpv-line)] pt-6">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--lpv-muted)]">
                      Point de départ
                    </p>
                    <p className="mt-2 text-xl">
                      {selectedStart ? selectedStart.name : "Aucun point sélectionné"}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[var(--lpv-muted)]">
                      {selectedStart
                        ? [selectedStart.city, selectedStart.region, selectedStart.country]
                            .filter(Boolean)
                            .join(", ")
                        : "Choisis un vignoble sur la carte ou dans la liste plus bas."}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handlePlanRoute}
                    disabled={planning || !selectedStart}
                    className="border border-[var(--lpv-ink)] bg-[var(--lpv-ink)] px-6 py-4 text-sm text-[var(--lpv-paper)] transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    {planning
                      ? "Planification en cours…"
                      : "Générer l’itinéraire →"}
                  </button>

                  {planningError && (
                    <p className="border-l-2 border-[#8d3f33] pl-4 text-sm text-[#8d3f33]">
                      {planningError}
                    </p>
                  )}
                </div>
              </div>

              {/* ROUTE RESULT */}
              <div className="border-l-0 border-[var(--lpv-line)] xl:border-l xl:pl-12">
                <p className="text-[11px] uppercase tracking-[0.25em] text-[var(--lpv-muted)]">
                  Parcours proposé
                </p>

                {!activeRoute ? (
                  <div className="mt-6 border-t border-[var(--lpv-line)] py-10">
                    <p className="max-w-md text-2xl leading-9 text-[var(--lpv-muted)]">
                      Ton itinéraire apparaîtra ici après avoir choisi un départ
                      et lancé la planification.
                    </p>
                  </div>
                ) : (
                  <div className="mt-6 border-t border-[var(--lpv-line)] pt-8">
                    <h3 className="text-4xl tracking-[-0.04em]">
                      {activeRoute.title || "Escapade Le Premier Verre"}
                    </h3>

                    {activeRoute.subtitle && (
                      <p className="mt-3 text-base text-[var(--lpv-muted)]">
                        {activeRoute.subtitle}
                      </p>
                    )}

                    <div className="mt-8 grid grid-cols-3 border-y border-[var(--lpv-line)]">
                      <div className="py-5">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--lpv-muted)]">
                          Durée
                        </p>
                        <p className="mt-2">{formatDuration(activeRoute.totalDurationMinutes)}</p>
                      </div>
                      <div className="border-l border-[var(--lpv-line)] px-5 py-5">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--lpv-muted)]">
                          Distance
                        </p>
                        <p className="mt-2">{formatDistance(activeRoute.totalDistanceKm)}</p>
                      </div>
                      <div className="border-l border-[var(--lpv-line)] pl-5 py-5">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--lpv-muted)]">
                          Budget
                        </p>
                        <p className="mt-2">{activeRoute.estimatedBudgetLabel || budget}</p>
                      </div>
                    </div>

                    {activeRoute.summary && (
                      <p className="mt-7 max-w-xl text-base leading-7 text-[var(--lpv-muted)]">
                        {activeRoute.summary}
                      </p>
                    )}

                    <div className="mt-10">
                      <p className="mb-4 text-sm">Étapes</p>

                      <div className="divide-y divide-[var(--lpv-line)] border-y border-[var(--lpv-line)]">
                        {(activeRoute.stops ?? []).map((stop, index) => (
                          <div
                            key={`${stop.id}-${index}`}
                            className="grid gap-5 py-5 sm:grid-cols-[46px_1fr]"
                          >
                            <div className="text-xl">{String(index + 1).padStart(2, "0")}</div>
                            <div>
                              <p className="text-lg">{stop.name}</p>
                              <p className="mt-1 text-sm text-[var(--lpv-muted)]">
                                {[stop.city, stop.region, stop.country]
                                  .filter(Boolean)
                                  .join(", ")}
                              </p>

                              {stop.description && (
                                <p className="mt-3 text-sm leading-6 text-[var(--lpv-muted)]">
                                  {stop.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* POINTS */}
          <section className="py-14 md:py-20">
            <div className="grid gap-14 xl:grid-cols-[0.95fr_1.05fr]">

              <div>
                <div className="flex items-end justify-between border-b border-[var(--lpv-line)] pb-5">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.25em] text-[var(--lpv-muted)]">
                      Explorer
                    </p>
                    <h2 className="mt-2 text-4xl tracking-[-0.04em]">
                      Départs suggérés
                    </h2>
                  </div>
                  <p className="text-sm text-[var(--lpv-muted)]">
                    {visiblePoints.length}
                  </p>
                </div>

                <div className="max-h-[650px] overflow-y-auto">
                  {visiblePoints.slice(0, 16).map((point) => {
                    const isActive = selectedStart?.id === point.id;

                    return (
                      <button
                        key={point.id}
                        type="button"
                        onClick={() => handleChooseStart(point)}
                        className={cx(
                          "grid w-full grid-cols-[105px_1fr] gap-5 border-b border-[var(--lpv-line)] py-5 text-left transition",
                          isActive ? "bg-black/[0.035]" : "hover:bg-black/[0.02]"
                        )}
                      >
                        <div className="relative h-[90px] w-full overflow-hidden bg-[#e3dbcf]">
                          <Image
                            src={resolvePointImage(point)}
                            alt={point.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>

                        <div className="py-1">
                          <p className="text-lg">{point.name}</p>
                          <p className="mt-1 text-sm text-[var(--lpv-muted)]">
                            {[point.city, point.region, point.country]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                          <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-[var(--lpv-muted)]">
                            {point.type === "vineyard" ? "Vignoble" : "Vin"}
                          </p>
                        </div>
                      </button>
                    );
                  })}

                  {visiblePoints.length === 0 && !loadingPoints && (
                    <div className="border-b border-[var(--lpv-line)] py-8 text-sm text-[var(--lpv-muted)]">
                      Aucun point disponible pour cette sélection.
                    </div>
                  )}
                </div>
              </div>

              {/* SELECTED POINT */}
              <div className="xl:border-l xl:border-[var(--lpv-line)] xl:pl-12">
                <p className="text-[11px] uppercase tracking-[0.25em] text-[var(--lpv-muted)]">
                  Point sélectionné
                </p>

                {selectedPoint ? (
                  <div className="mt-5">
                    <div className="relative h-[360px] overflow-hidden bg-[#e3dbcf] md:h-[460px]">
                      <Image
                        src={resolvePointImage(selectedPoint)}
                        alt={selectedPoint.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    <div className="border-b border-[var(--lpv-line)] py-7">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--lpv-muted)]">
                        {selectedPoint.type === "vineyard" ? "Vignoble" : "Vin"}
                      </p>

                      <h3 className="mt-2 text-4xl tracking-[-0.04em]">
                        {selectedPoint.name}
                      </h3>

                      <p className="mt-3 text-sm text-[var(--lpv-muted)]">
                        {[selectedPoint.city, selectedPoint.region, selectedPoint.country]
                          .filter(Boolean)
                          .join(", ")}
                      </p>

                      {selectedPoint.description ? (
                        <p className="mt-5 max-w-xl text-base leading-7 text-[var(--lpv-muted)]">
                          {selectedPoint.description}
                        </p>
                      ) : selectedPoint.originLabel ? (
                        <p className="mt-5 max-w-xl text-base leading-7 text-[var(--lpv-muted)]">
                          {selectedPoint.originLabel}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 border-y border-[var(--lpv-line)] py-12">
                    <p className="max-w-md text-2xl leading-9 text-[var(--lpv-muted)]">
                      Sélectionne un point sur la carte ou dans la liste pour
                      découvrir son détail.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* EDITORIAL DISCOVERY */}
          <section className="border-t border-[var(--lpv-line)] py-16 md:py-24">
            <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
              <div>
                <p className="text-[11px] uppercase tracking-[0.25em] text-[var(--lpv-muted)]">
                  Continuer l’exploration
                </p>

                <h2 className="mt-4 max-w-md text-5xl tracking-[-0.05em] md:text-6xl">
                  Derrière la carte,
                  <br />
                  il y a les gens.
                </h2>

                <p className="mt-6 max-w-md text-base leading-7 text-[var(--lpv-muted)]">
                  Des domaines à connaître, des régions à comprendre et des
                  histoires qui donnent un peu plus de sens à ce qu’on boit.
                </p>
              </div>

              <div className="border-t border-[var(--lpv-line)]">
                {editorialContent.producers.map((producer) => (
                  <a
                    key={producer._id}
                    href={`/producteurs/${producer.slug}`}
                    className="group grid gap-5 border-b border-[var(--lpv-line)] py-6 sm:grid-cols-[130px_1fr_auto] sm:items-center"
                  >
                    <div className="relative h-[92px] overflow-hidden bg-[#e3dbcf]">
                      {producer.imageUrl ? (
                        <Image
                          src={producer.imageUrl}
                          alt={producer.name || ""}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-[1.025]"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[10px] uppercase tracking-[0.18em] text-[var(--lpv-muted)]">
                          Photo à venir
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--lpv-muted)]">
                        {[producer.municipality, producer.region?.name]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>

                      <h3 className="mt-2 text-2xl tracking-[-0.03em]">
                        {producer.name}
                      </h3>

                      {producer.oneLiner && (
                        <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--lpv-muted)]">
                          {producer.oneLiner}
                        </p>
                      )}
                    </div>

                    <span className="hidden text-xl transition-transform duration-300 group-hover:translate-x-1 sm:block">
                      →
                    </span>
                  </a>
                ))}

                {editorialContent.producers.length > 0 && (
                  <div className="pt-6">
                    <a
                      href="/producteurs"
                      className="text-sm underline decoration-[var(--lpv-line)] underline-offset-8 transition hover:decoration-[var(--lpv-ink)]"
                    >
                      Voir tous les producteurs
                    </a>
                  </div>
                )}
              </div>
            </div>
          </section>

          {editorialContent.regions.length > 0 && (
            <section className="border-t border-[var(--lpv-line)] py-16 md:py-24">
              <div className="flex items-end justify-between gap-6 border-b border-[var(--lpv-line)] pb-6">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-[var(--lpv-muted)]">
                    Géographie du vin
                  </p>
                  <h2 className="mt-3 text-4xl tracking-[-0.04em] md:text-5xl">
                    Régions à explorer
                  </h2>
                </div>

                <a
                  href="/regions"
                  className="hidden text-sm underline decoration-[var(--lpv-line)] underline-offset-8 md:block"
                >
                  Toutes les régions
                </a>
              </div>

              <div className="grid md:grid-cols-3">
                {editorialContent.regions.map((region, index) => (
                  <a
                    key={region._id}
                    href={`/regions/${region.slug}`}
                    className={`group py-7 md:px-7 ${
                      index > 0
                        ? "border-t border-[var(--lpv-line)] md:border-l md:border-t-0"
                        : ""
                    } ${index === 0 ? "md:pl-0" : ""}`}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#e3dbcf]">
                      {region.imageUrl ? (
                        <Image
                          src={region.imageUrl}
                          alt={region.name || ""}
                          fill
                          className="object-cover transition duration-700 group-hover:scale-[1.025]"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[10px] uppercase tracking-[0.18em] text-[var(--lpv-muted)]">
                          Région
                        </div>
                      )}
                    </div>

                    <p className="mt-5 text-[10px] uppercase tracking-[0.2em] text-[var(--lpv-muted)]">
                      {region.country?.name || "Région viticole"}
                    </p>

                    <div className="mt-2 flex items-start justify-between gap-5">
                      <h3 className="text-2xl tracking-[-0.03em]">
                        {region.name}
                      </h3>
                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </div>

                    {region.description && (
                      <p className="mt-3 text-sm leading-6 text-[var(--lpv-muted)]">
                        {region.description}
                      </p>
                    )}
                  </a>
                ))}
              </div>

              <a
                href="/regions"
                className="mt-4 inline-block text-sm underline decoration-[var(--lpv-line)] underline-offset-8 md:hidden"
              >
                Toutes les régions
              </a>
            </section>
          )}

          {(editorialContent.articles.length > 0 ||
            editorialContent.guides.length > 0) && (
            <section className="border-t border-[var(--lpv-line)] py-16 md:py-24">
              <div className="grid gap-14 lg:grid-cols-2">

                {editorialContent.articles.length > 0 && (
                  <div>
                    <div className="flex items-end justify-between border-b border-[var(--lpv-line)] pb-5">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.25em] text-[var(--lpv-muted)]">
                          Journal
                        </p>
                        <h2 className="mt-2 text-4xl tracking-[-0.04em]">
                          À lire avant de partir
                        </h2>
                      </div>

                      <a
                        href="/blog"
                        className="hidden text-sm underline decoration-[var(--lpv-line)] underline-offset-8 sm:block"
                      >
                        Tous les articles
                      </a>
                    </div>

                    <div>
                      {editorialContent.articles.map((article, index) => (
                        <a
                          key={article._id}
                          href={`/blog/${article.slug}`}
                          className="group grid grid-cols-[46px_1fr_auto] gap-4 border-b border-[var(--lpv-line)] py-6"
                        >
                          <span className="text-sm text-[var(--lpv-muted)]">
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          <div>
                            {article.category && (
                              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--lpv-muted)]">
                                {article.category}
                              </p>
                            )}

                            <h3 className="mt-1 text-xl leading-7">
                              {article.title}
                            </h3>

                            {article.excerpt && (
                              <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--lpv-muted)]">
                                {article.excerpt}
                              </p>
                            )}
                          </div>

                          <span className="transition-transform duration-300 group-hover:translate-x-1">
                            →
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {editorialContent.guides.length > 0 && (
                  <div>
                    <div className="flex items-end justify-between border-b border-[var(--lpv-line)] pb-5">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.25em] text-[var(--lpv-muted)]">
                          Pour aller plus loin
                        </p>
                        <h2 className="mt-2 text-4xl tracking-[-0.04em]">
                          Guides
                        </h2>
                      </div>

                      <a
                        href="/guides"
                        className="hidden text-sm underline decoration-[var(--lpv-line)] underline-offset-8 sm:block"
                      >
                        Tous les guides
                      </a>
                    </div>

                    <div>
                      {editorialContent.guides.map((guide, index) => (
                        <a
                          key={guide._id}
                          href={`/guides/${guide.slug}`}
                          className="group grid grid-cols-[46px_1fr_auto] gap-4 border-b border-[var(--lpv-line)] py-6"
                        >
                          <span className="text-sm text-[var(--lpv-muted)]">
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          <div>
                            {guide.guideType && (
                              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--lpv-muted)]">
                                {guide.guideType}
                              </p>
                            )}

                            <h3 className="mt-1 text-xl leading-7">
                              {guide.title}
                            </h3>

                            {guide.excerpt && (
                              <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--lpv-muted)]">
                                {guide.excerpt}
                              </p>
                            )}
                          </div>

                          <span className="transition-transform duration-300 group-hover:translate-x-1">
                            →
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </section>
          )}

        </div>
      </main>
    </>
  );
}
