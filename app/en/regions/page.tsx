import { client } from "@/sanity/lib/client";
import {
  CountryRegionMap,
  type AtlasRegion,
} from "@/components/knowledge/country-region-map";

export const revalidate = 60;

type Region = AtlasRegion;

type AtlasTerritory = {
  _id: string;
  name: string;
  nameEn?: string;
  slug: string;
  order: number;
  geometryKey: string;
  mapLabel?: string;
  mapLabelEn?: string;
  regions: Region[];
};

export default async function RegionsPage() {
  const territories = await client.fetch<AtlasTerritory[]>(`
    *[
      _type == "atlasTerritory" &&
      published == true &&
      count(
        *[
          _type == "region" &&
          !(_id in path("drafts.**")) &&
          showInAtlas == true &&
          references(^._id)
        ]
      ) > 0
    ] | order(order asc, name asc) {
      _id,
      name,
      nameEn,
      "slug": slug.current,
      order,
      geometryKey,
      mapLabel,
      mapLabelEn,

      "regions": *[
        _type == "region" &&
        !(_id in path("drafts.**")) &&
        showInAtlas == true &&
        references(^._id)
      ] | order(name asc) {
        _id,
        name,
        nameEn,
        "slug": slug.current,
        latitude,
        longitude
      }
    }
  `);

  const regionCount = territories.reduce(
    (total, territory) => total + territory.regions.length,
    0
  );

  return (
    <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
      <div className="lpv-container pb-16 pt-8 md:pb-24 md:pt-16">

        {/* HERO */}
        <section className="border-b border-[var(--lpv-line)] pb-9 md:pb-20">
          <p className="lpv-kicker text-[var(--lpv-cocoa)]">
            Wine atlas
          </p>

          <div className="mt-5 grid gap-6 md:mt-7 md:gap-10 lg:grid-cols-[0.7fr_0.3fr] lg:items-end">
            <h1 className="lpv-display text-[clamp(3.7rem,15vw,4.7rem)] leading-[0.84] md:text-[clamp(4.5rem,9vw,9rem)]">
              Wine
              <br />
              regions.
            </h1>

            <div>
              <p className="max-w-md text-[0.95rem] leading-7 text-[var(--lpv-muted)] md:text-base md:leading-8">
                Climates, soils and ways of making wine that give each region
                its own identity. Explore the regions followed by Le Premier
                Verre, here in Quebec and around the world.
              </p>

              <p className="lpv-kicker mt-5 text-[var(--lpv-cocoa)] md:mt-8">
                {regionCount} regions · {territories.length} territories
              </p>
            </div>
          </div>
        </section>

        {/* ATLAS */}
        <section>
          {territories.map((territory, territoryIndex) => (
            <article
              key={territory._id}
              className="border-b border-[var(--lpv-line)] py-9 md:py-20"
            >
              <header className="mb-6 flex items-end justify-between gap-4 md:mb-14 md:gap-8">
                <div>
                  <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                    {String(territoryIndex + 1).padStart(2, "0")} · Territory
                  </p>

                  <h2 className="lpv-display mt-3 text-[clamp(2.8rem,11.5vw,3.7rem)] leading-[0.88] md:mt-5 md:text-[clamp(3.5rem,7vw,7rem)] md:leading-[0.86]">
                    {territory.mapLabelEn ||
                      territory.nameEn ||
                      territory.mapLabel ||
                      territory.name}
                  </h2>
                </div>

                <p className="lpv-kicker shrink-0 pb-1 text-[var(--lpv-muted)] md:pb-2">
                  {territory.regions.length}{" "}
                  {territory.regions.length === 1 ? "region" : "regions"}
                </p>
              </header>

              <CountryRegionMap
                locale="en"
                country={territory.nameEn || territory.name}
                regions={territory.regions.map((region) => ({
                  ...region,
                  name: region.nameEn || region.name,
                }))}
              />
            </article>
          ))}
        </section>

      </div>
    </main>
  );
}
