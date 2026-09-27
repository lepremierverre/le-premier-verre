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
  territory: string;
  regions: AtlasRegion[];
  activeSlug: string | null;
  setActiveSlug: (slug: string | null) => void;
};

export function TerritoryAtlasMap({
  territory,
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

    const validRegions = regions.filter(
      (region) =>
        typeof region.latitude === "number" &&
        typeof region.longitude === "number"
    );

    const fallbackCenters: Record<string, [number, number]> = {
      "Québec": [-72.72, 46.05],
      "Afrique du Sud": [24.0, -29.0],
      "Allemagne": [10.45, 51.1],
      "Australie": [134.5, -25.8],
      "Autriche": [14.2, 47.6],
      "Canada": [-106.0, 56.0],
      "Chili": [-71.2, -33.5],
      "Espagne": [-3.7, 40.3],
      "France": [2.2, 46.4],
      "Italie": [12.5, 42.7],
      "Nouvelle-Zélande": [172.5, -41.2],
      "Portugal": [-8.0, 39.6],
      "États-Unis": [-119.5, 37.2],
    };

    const fallbackZoom: Record<string, number> = {
      "Québec": 6.55,
      "Afrique du Sud": 4.2,
      "Allemagne": 5.1,
      "Australie": 3.3,
      "Autriche": 5.5,
      "Canada": 2.7,
      "Chili": 3.5,
      "Espagne": 4.7,
      "France": 4.7,
      "Italie": 4.7,
      "Nouvelle-Zélande": 4.2,
      "Portugal": 5.1,
      "États-Unis": 3.3,
    };

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: `https://api.protomaps.com/styles/v5/light/en.json?key=${process.env.NEXT_PUBLIC_PROTOMAPS_KEY}`,
      center: fallbackCenters[territory] ?? [0, 20],
      zoom: fallbackZoom[territory] ?? 4,
      attributionControl: false,
      interactive: false,
    });

    mapRef.current = map;

    map.on("error", (event) => {
      console.error("LPV MAPLIBRE ERROR:", event.error);
    });

    map.on("load", () => {
    // Cadrage éditorial dynamique basé uniquement sur les régions
    // actuellement présentes dans Sanity.
    //
    // 2 régions ou plus :
    // la carte englobe automatiquement tous les points.
    //
    // 1 seule région :
    // on centre la carte sur cette région avec suffisamment de contexte
    // géographique autour d'elle.
    //
    // Toute nouvelle région ajoutée plus tard dans Sanity sera donc
    // automatiquement intégrée au cadrage sans modifier ce composant.

    if (validRegions.length >= 2) {
      const bounds = new maplibregl.LngLatBounds();

      validRegions.forEach((region) => {
        bounds.extend([region.longitude!, region.latitude!]);
      });

      map.fitBounds(bounds, {
        padding: {
          top: 105,
          right: 115,
          bottom: 105,
          left: 115,
        },

        // Empêche les régions très proches de produire un zoom excessif.
        maxZoom: territory === "Québec" ? 6.55 : 6.35,

        duration: 0,
      });
    } else if (validRegions.length === 1) {
      const region = validRegions[0];

      // Ajustement éditorial uniquement lorsqu'un territoire
      // ne possède encore qu'une seule région.
      //
      // Dès qu'une deuxième région apparaît dans Sanity,
      // fitBounds reprend automatiquement le contrôle.
      /*
       * Cadrage éditorial LPV pour les territoires qui n'ont encore
       * qu'une seule région.
       *
       * Les décalages servent uniquement à composer l'image :
       * on garde la région visible tout en réduisant les grands vides.
       *
       * Dès qu'une deuxième région est ajoutée dans Sanity,
       * ce bloc n'est plus utilisé et fitBounds ci-dessus reprend
       * automatiquement le contrôle.
       */
      const singleRegionView: Record<
        string,
        { offsetLng: number; offsetLat: number; zoom: number }
      > = {
        "Afrique du Sud": {
          // Swartland : on pousse le territoire vers la gauche du cadre.
          offsetLng: 1.15,
          offsetLat: -0.15,
          zoom: 6.55,
        },
        "États-Unis": {
          // Californie : cadrage côte Ouest, moins de vide continental.
          offsetLng: 1.05,
          offsetLat: 0.15,
          zoom: 5.15,
        },
        "Nouvelle-Zélande": {
          // Marlborough : cadrage plus rapproché autour des deux îles.
          offsetLng: -0.15,
          offsetLat: -0.15,
          zoom: 5.0,
        },
        "Australie": {
          offsetLng: 0,
          offsetLat: 0,
          zoom: 4.6,
        },
      };

      const view = singleRegionView[territory];

      map.jumpTo({
        center: view
          ? [
              region.longitude! + view.offsetLng,
              region.latitude! + view.offsetLat,
            ]
          : [region.longitude!, region.latitude!],
        zoom: view?.zoom ?? 5.2,
      });
    }
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

      // Les très grands territoires ont besoin d'un peu plus de structure
      // pour rester lisibles, sans redevenir des cartes routières.
      const needsMoreContext = [
        "Afrique du Sud",
        "Australie",
        "États-Unis",
      ].includes(territory);

      if (needsMoreContext) {
        // Grandes routes seulement — très discrètes.
        if (id === "roads_major" || id === "roads_highway") {
          map.setLayoutProperty(id, "visibility", "visible");
          map.setPaintProperty(id, "line-color", "#a99b8d");
          map.setPaintProperty(id, "line-opacity", 0.20);
          map.setPaintProperty(id, "line-width", [
            "interpolate",
            ["linear"],
            ["zoom"],
            3, 0.3,
            6, 0.65,
          ]);
          return;
        }

        // Limites internes un peu plus présentes :
        // États/provinces deviennent un élément graphique de l'atlas.
        if (id === "boundaries") {
          map.setLayoutProperty(id, "visibility", "visible");
          map.setPaintProperty(id, "line-color", "#877769");
          map.setPaintProperty(id, "line-opacity", 0.34);
          map.setPaintProperty(id, "line-width", 0.55);
          map.setPaintProperty(id, "line-dasharray", [2, 3]);
          return;
        }

        // Les grands cours d'eau donnent un peu de géographie
        // sans ajouter de bruit visuel.
        if (id === "water_river") {
          map.setLayoutProperty(id, "visibility", "visible");
          map.setPaintProperty(id, "line-color", "#9d8d7e");
          map.setPaintProperty(id, "line-opacity", 0.26);
          map.setPaintProperty(id, "line-width", 0.6);
          return;
        }
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
      className="relative h-[340px] w-full overflow-hidden md:h-[560px]"
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
