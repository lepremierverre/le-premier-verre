import { defineArrayMember, defineField, defineType } from "sanity";

export const region = defineType({
  name: "region",
  title: "Régions",
  type: "document",

  groups: [
    { name: "identity", title: "Identité", default: true },
    { name: "lpv", title: "Le Premier Verre" },
    { name: "map", title: "Localisation & carte" },
    { name: "wine", title: "Climat & cépages" },
    { name: "content", title: "Contenu lié" },
    { name: "advanced", title: "Informations avancées" },
    { name: "publication", title: "Publication" },
  ],

  fields: [
    {
      name: "translationSourceHash",
      title: "Translation source hash",
      type: "string",
      hidden: true,
      readOnly: true,
    },

    defineField({
      name: "name",
      title: "Nom de la région",
      type: "string",
      group: "identity",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "nameEn",
      title: "Nom de la région — anglais",
      type: "string",
      group: "identity",
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "identity",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "country",
      title: "Pays",
      type: "reference",
      to: [{ type: "country" }],
      group: "identity",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "parentRegion",
      title: "Région parente",
      type: "reference",
      to: [{ type: "region" }],
      group: "identity",
      description:
        "À utiliser seulement lorsque la région appartient à une région viticole plus large.",
    }),

    defineField({
      name: "heroImage",
      title: "Photo principale",
      type: "image",
      group: "identity",
      options: { hotspot: true },
    }),

    defineField({
      name: "introduction",
      title: "Introduction",
      type: "array",
      group: "lpv",
      description:
        "Présentation de la région en environ 100 à 150 mots.",
      of: [{ type: "block" }],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "introductionEn",
      title: "Introduction — anglais",
      type: "array",
      group: "lpv",
      of: [{ type: "block" }],
    }),

    defineField({
      name: "atlasTerritory",
      title: "Territoire dans l’Atlas",
      type: "reference",
      to: [{ type: "atlasTerritory" }],
      group: "map",
      description:
        "Territoire cartographique dans lequel cette région doit apparaître. Ex. Québec, France, Canada.",
    }),

    defineField({
      name: "showInAtlas",
      title: "Afficher comme région dans l’Atlas",
      type: "boolean",
      group: "map",
      description:
        "Active le point et la fiche de cette région dans son territoire Atlas.",
      initialValue: true,
    }),

    defineField({
      name: "geocodingQuery",
      title: "Recherche géographique",
      type: "string",
      group: "map",
      description:
        "Nom précis utilisé pour trouver automatiquement la région sur la carte. Ex. « Bordeaux wine region, France ».",
    }),

    defineField({
      name: "locationText",
      title: "Localisation",
      type: "text",
      rows: 3,
      group: "map",
      description:
        "Explication simple de l’emplacement de la région : où elle se trouve et ses principaux repères géographiques.",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "locationTextEn",
      title: "Localisation — anglais",
      type: "text",
      rows: 3,
      group: "map",
    }),

    defineField({
      name: "latitude",
      title: "Latitude de la mini-carte",
      type: "number",
      group: "map",
      description:
        "Coordonnée approximative du centre de la région.",
      validation: (Rule) =>
        Rule.required().min(-90).max(90),
    }),

    defineField({
      name: "longitude",
      title: "Longitude de la mini-carte",
      type: "number",
      group: "map",
      description:
        "Coordonnée approximative du centre de la région.",
      validation: (Rule) =>
        Rule.required().min(-180).max(180),
    }),

    defineField({
      name: "mapZoom",
      title: "Zoom de la mini-carte",
      type: "number",
      group: "map",
      description:
        "Valeur indicative pour cadrer la région. 7 à 9 convient généralement à une région viticole.",
      initialValue: 8,
      validation: (Rule) =>
        Rule.min(1).max(15),
    }),

    defineField({
      name: "mapPolygon",
      title: "Zone de la région sur la carte",
      type: "array",
      group: "map",
      description:
        "Coordonnées qui dessinent la zone approximative de la région sur la carte.",
      of: [
        defineArrayMember({
          type: "object",
          name: "mapPoint",
          title: "Point",
          fields: [
            defineField({
              name: "latitude",
              title: "Latitude",
              type: "number",
              validation: (Rule) =>
                Rule.required().min(-90).max(90),
            }),
            defineField({
              name: "longitude",
              title: "Longitude",
              type: "number",
              validation: (Rule) =>
                Rule.required().min(-180).max(180),
            }),
          ],
          preview: {
            select: {
              latitude: "latitude",
              longitude: "longitude",
            },
            prepare({ latitude, longitude }) {
              return {
                title: `${latitude ?? "—"}, ${longitude ?? "—"}`,
              };
            },
          },
        }),
      ],
    }),

    defineField({
      name: "climate",
      title: "Climat",
      type: "text",
      rows: 4,
      group: "wine",
      description:
        "Les éléments climatiques qui ont une incidence réelle sur la vigne et les vins.",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "climateEn",
      title: "Climat — anglais",
      type: "text",
      rows: 4,
      group: "wine",
    }),

    defineField({
      name: "signatureGrapes",
      title: "Principaux cépages",
      type: "array",
      group: "wine",
      of: [{ type: "reference", to: [{ type: "grape" }] }],
      validation: (Rule) =>
        Rule.required().min(1),
    }),

    defineField({
      name: "characteristics",
      title: "Caractéristiques utiles",
      type: "array",
      group: "lpv",
      description:
        "3 à 5 choses concrètes à savoir pour comprendre rapidement la région.",
      validation: (Rule) =>
        Rule.required().min(3).max(5),
      of: [
        {
          type: "object",
          name: "regionCharacteristic",
          title: "Caractéristique",
          fields: [
            defineField({
              name: "title",
              title: "Titre",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "text",
              title: "Explication",
              type: "text",
              rows: 3,
              validation: (Rule) =>
                Rule.required().max(350),
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "text",
            },
          },
        },
      ],
    }),

    defineField({
      name: "characteristicsEn",
      title: "Caractéristiques — anglais",
      type: "array",
      group: "lpv",
      of: [
        {
          type: "object",
          name: "regionCharacteristicEn",
          title: "Caractéristique — anglais",
          fields: [
            defineField({
              name: "title",
              title: "Titre",
              type: "string",
            }),
            defineField({
              name: "text",
              title: "Explication",
              type: "text",
              rows: 3,
            }),
          ],
        },
      ],
    }),

    defineField({
      name: "guides",
      title: "Guides liés",
      type: "array",
      group: "content",
      description:
        "Guides Le Premier Verre pertinents pour cette région.",
      of: [{ type: "reference", to: [{ type: "guide" }] }],
    }),

    /*
     * Les producteurs et les vins de la région ne sont volontairement
     * pas enregistrés ici. Ils seront récupérés automatiquement sur
     * la page publique à partir de leur référence vers cette région.
     */

    defineField({
      name: "description",
      title: "Ancienne description courte",
      type: "text",
      rows: 4,
      group: "advanced",
      description:
        "Champ conservé pour compatibilité. Utiliser désormais « Introduction ».",
    }),

    defineField({
      name: "descriptionEn",
      title: "Ancienne description courte — anglais",
      type: "text",
      rows: 4,
      group: "advanced",
    }),

    defineField({
      name: "overview",
      title: "Ancienne présentation détaillée",
      type: "array",
      group: "advanced",
      of: [{ type: "block" }],
      description:
        "Champ conservé pour compatibilité. Utiliser désormais « Introduction ».",
    }),

    defineField({
      name: "overviewEn",
      title: "Ancienne présentation détaillée — anglais",
      type: "array",
      group: "advanced",
      of: [{ type: "block" }],
    }),

    defineField({
      name: "soilTypes",
      title: "Types de sols",
      type: "array",
      group: "advanced",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),

    defineField({
      name: "soilTypesEn",
      title: "Types de sols — anglais",
      type: "array",
      group: "advanced",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),

    defineField({
      name: "mainWineStyles",
      title: "Styles de vins principaux",
      type: "array",
      group: "advanced",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),

    defineField({
      name: "mainWineStylesEn",
      title: "Styles de vins principaux — anglais",
      type: "array",
      group: "advanced",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),

    defineField({
      name: "seoTitle",
      title: "Titre SEO",
      type: "string",
      group: "publication",
    }),

    defineField({
      name: "seoDescription",
      title: "Description SEO",
      type: "text",
      rows: 3,
      group: "publication",
    }),

    defineField({
      name: "seoTitleEn",
      title: "Titre SEO — anglais",
      type: "string",
      group: "publication",
    }),

    defineField({
      name: "seoDescriptionEn",
      title: "Description SEO — anglais",
      type: "text",
      rows: 3,
      group: "publication",
    }),

    defineField({
      name: "published",
      title: "Publié",
      type: "boolean",
      group: "publication",
      initialValue: false,
    }),
  ],

  preview: {
    select: {
      title: "name",
      country: "country.name",
      parent: "parentRegion.name",
      media: "heroImage",
    },

    prepare({ title, country, parent, media }) {
      return {
        title,
        subtitle: [parent, country]
          .filter(Boolean)
          .join(" · "),
        media,
      };
    },
  },
});
