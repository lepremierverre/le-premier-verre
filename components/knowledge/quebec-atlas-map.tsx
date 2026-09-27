"use client";

import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

maplibregl.setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");

type AtlasRegion = {
  _id: string;
  name: string;
  slug: string;
  latitude?: number;
  longitude?: number;
};

type QuebecAtlasMapProps = {
  regions: AtlasRegion[];
  activeSlug: string | null;
  setActiveSlug: (slug: string | null) => void;
};

export function QuebecAtlasMap({
  regions,
  activeSlug,
  setActiveSlug,
}: QuebecAtlasMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<
    { slug: string; marker: maplibregl.Marker; element: HTMLDivElement }[]
  >([]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,

      // Fond vectoriel Protomaps — Atlas LPV.
      style: `https://api.protomaps.com/styles/v5/light/en.json?key=${process.env.NEXT_PUBLIC_PROTOMAPS_KEY}`,

      // Cadrage Montréal → Québec / Rive-Nord → Rive-Sud.
      center: [-72.72, 46.05],
      zoom: 6.55,

      attributionControl: false,
      interactive: false,
    });

    mapRef.current = map;

    map.on("error", (event) => {
      console.error("LPV MAPLIBRE ERROR:", event.error);
    });

    map.on("load", () => {
      console.log("LPV MAPLIBRE: style chargé", map.getStyle());

      /*
       * On transforme le style de démonstration en fond éditorial LPV.
       * Les couches dont le nom varie selon la source sont traitées
       * à partir de leur type et de leur identifiant.
       */
      const style = map.getStyle();

      style.layers?.forEach((layer: maplibregl.LayerSpecification) => {
      const id = layer.id;

      // ATLAS LPV — Québec
      // Une géographie éditoriale plutôt qu'une carte routière.

      const hiddenLayers = [
        "landcover",
        "landuse_park",
        "landuse_urban_green",
        "landuse_hospital",
        "landuse_industrial",
        "landuse_school",
        "landuse_beach",
        "landuse_zoo",
        "landuse_aerodrome",
        "landuse_runway",
        "landuse_pedestrian",
        "landuse_pier",
        "buildings",
        "roads_runway",
        "roads_taxiway",
        "roads_rail",
        "roads_oneway",
        "roads_shields",
        "address_label",
        "water_waterway_label",
        "water_label_ocean",
        "earth_label_islands",
        "water_label_lakes",
        "pois",
        "places_subplace",
        "places_region",
        "places_locality",
        "places_country",
      ];

      if (
        hiddenLayers.includes(id) ||
        id.startsWith("roads_") ||
        id.startsWith("roads_tunnels") ||
        id.startsWith("roads_bridges")
      ) {
        map.setLayoutProperty(id, "visibility", "none");
        return;
      }

      // Même papier que le reste de l'Atlas.
      if (id === "background") {
        map.setPaintProperty(id, "background-color", "#f3eee6");
        return;
      }

      if (id === "earth") {
        map.setPaintProperty(id, "fill-color", "#f3eee6");
        return;
      }

      // Le Saint-Laurent devient l'élément graphique principal.
      if (id === "water") {
        map.setPaintProperty(id, "fill-color", "#d8d0c5");
        map.setPaintProperty(id, "fill-opacity", 0.62);
        return;
      }

      // Petits cours d'eau presque invisibles.
      if (id === "water_stream") {
        map.setPaintProperty(id, "line-color", "#aa9c8e");
        map.setPaintProperty(id, "line-opacity", 0.16);
        map.setPaintProperty(id, "line-width", 0.45);
        return;
      }

      if (id === "water_river") {
        map.setPaintProperty(id, "line-color", "#9d8d7e");
        map.setPaintProperty(id, "line-opacity", 0.24);
        map.setPaintProperty(id, "line-width", 0.6);
        return;
      }

      // Frontière internationale : contour principal.
      if (id === "boundaries_country") {
        map.setPaintProperty(id, "line-color", "#756657");
        map.setPaintProperty(id, "line-opacity", 0.68);
        map.setPaintProperty(id, "line-width", 0.85);
        return;
      }

      // Limites secondaires très délicates.
      if (id === "boundaries") {
        map.setPaintProperty(id, "line-color", "#8d7d6d");
        map.setPaintProperty(id, "line-opacity", 0.22);
        map.setPaintProperty(id, "line-width", 0.5);
        map.setPaintProperty(id, "line-dasharray", [2, 3]);
        return;
      }

      // Rien d'autre : on veut une géographie, pas une carte.
      if (
        layer.type === "fill" ||
        layer.type === "line" ||
        layer.type === "symbol"
      ) {
        map.setLayoutProperty(id, "visibility", "none");
      }
    });

      regions.forEach((region) => {
        if (
          typeof region.latitude !== "number" ||
          typeof region.longitude !== "number"
        ) {
          return;
        }

        const element = document.createElement("div");
        element.dataset.slug = region.slug;

        Object.assign(element.style, {
          display: "flex",
          alignItems: "center",
          gap: "7px",
          cursor: "pointer",
          whiteSpace: "nowrap",
          transition: "opacity 180ms ease",
        });

        const point = document.createElement("span");

        Object.assign(point.style, {
          display: "block",
          width: "10px",
          height: "10px",
          flex: "0 0 10px",
          borderRadius: "999px",
          background: "#7b6858",
          border: "3px solid #f3eee6",
          boxShadow: "0 0 0 1px #8a7767",
        });

        const label = document.createElement("span");

        const number = String(
          regions.findIndex((item) => item.slug === region.slug) + 1
        ).padStart(2, "0");

        label.textContent = `${number} - ${region.name}`;

        Object.assign(label.style, {
          display: "block",
          padding: "0",
          background: "transparent",
          color: "#2a2521",
          fontSize: "13px",
          fontWeight: "400",
          lineHeight: "1",
          letterSpacing: "-0.01em",
          whiteSpace: "nowrap",
        });

        element.appendChild(point);
        element.appendChild(label);

        element.addEventListener("mouseenter", () => {
          setActiveSlug(region.slug);
        });

        element.addEventListener("mouseleave", () => {
          setActiveSlug(null);
        });

        element.addEventListener("click", () => {
          window.location.href = `/regions/${region.slug}`;
        });

        const marker = new maplibregl.Marker({
          element,
          anchor: "left",
        })
          .setLngLat([region.longitude, region.latitude])
          .addTo(map);

        markersRef.current.push({
          slug: region.slug,
          marker,
          element,
        });
      });
    });

    return () => {
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, [regions, setActiveSlug]);

  useEffect(() => {
    markersRef.current.forEach(({ slug, element }) => {
      element.style.opacity =
        activeSlug && activeSlug !== slug ? "0.25" : "1";

      element.style.zIndex =
        activeSlug === slug ? "30" : "10";
    });
  }, [activeSlug]);

  return (
    <div
      className="relative h-[430px] w-full overflow-hidden md:h-[560px]"
      aria-label="Atlas des régions viticoles du Québec"
    >
      <div
        ref={mapContainerRef}
        className="absolute inset-0 h-full w-full"
      />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          boxShadow:
            "inset 0 0 70px 20px rgba(244,239,230,0.18)",
        }}
      />
    </div>
  );
}
