import { defineArrayMember, defineField, defineType } from "sanity";

export const grape = defineType({
  name: "grape",
  title: "Cépage",
  type: "document",

  groups: [
    {
      name: "identity",
      title: "Identité",
      default: true,
    },
    {
      name: "lpv",
      title: "Le Premier Verre",
    },
    {
      name: "profile",
      title: "Profil",
    },
    {
      name: "food",
      title: "À table",
    },
    {
      name: "geography",
      title: "Géographie",
    },
    {
      name: "discover",
      title: "À essayer",
    },
    {
      name: "advanced",
      title: "Informations avancées",
    },
    {
      name: "publication",
      title: "Publication",
    },
  ],

  fields: [
    {
      name: "translationSourceHash",
      title: "Translation source hash",
      type: "string",
      hidden: true,
      readOnly: true,
    },

    // IDENTITÉ
    defineField({
      name: "name",
      title: "Nom",
      type: "string",
      group: "identity",
      validation: (Rule) => Rule.required(),
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
      name: "color",
      title: "Couleur",
      type: "string",
      group: "identity",
      options: {
        list: [
          { title: "Rouge", value: "red" },
          { title: "Blanc", value: "white" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "heroImage",
      title: "Image principale",
      type: "image",
      group: "identity",
      options: {
        hotspot: true,
      },
    }),

    // LE PREMIER VERRE
    defineField({
      name: "oneLiner",
      title: "En une phrase",
      type: "text",
      group: "lpv",
      rows: 3,
      description:
        "Expliquer immédiatement le style du cépage, dans le ton Le Premier Verre.",
      validation: (Rule) => Rule.required().max(220),
    }),

    defineField({
      name: "oneLinerEn",
      title: "En une phrase — anglais",
      type: "text",
      group: "lpv",
      rows: 3,
    }),

    // PROFIL
    defineField({
      name: "aromas",
      title: "Arômes typiques",
      type: "array",
      group: "profile",
      description: "Choisir de 3 à 5 arômes caractéristiques.",
      of: [defineArrayMember({ type: "string" })],
      options: {
        layout: "tags",
      },
      validation: (Rule) => Rule.required().min(3).max(5),
    }),

    defineField({
      name: "aromasEn",
      title: "Arômes typiques — anglais",
      type: "array",
      group: "profile",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),

    defineField({
      name: "body",
      title: "Corps",
      type: "number",
      group: "profile",
      description: "1 = léger · 3 = moyen · 5 = puissant",
      validation: (Rule) => Rule.required().integer().min(1).max(5),
    }),

    defineField({
      name: "acidity",
      title: "Acidité",
      type: "number",
      group: "profile",
      description: "1 = faible · 3 = moyenne · 5 = élevée",
      validation: (Rule) => Rule.required().integer().min(1).max(5),
    }),

    defineField({
      name: "tannins",
      title: "Tanins",
      type: "number",
      group: "profile",
      description:
        "1 = très faibles · 3 = moyens · 5 = élevés. Pour un blanc, utiliser 1.",
      validation: (Rule) => Rule.required().integer().min(1).max(5),
    }),

    defineField({
      name: "servingTemperature",
      title: "Température de service",
      type: "string",
      group: "profile",
      description: "Ex. 13–15 °C",
      validation: (Rule) => Rule.required(),
    }),

    // À TABLE
    defineField({
      name: "simplePairings",
      title: "4 accords simples",
      type: "array",
      group: "food",
      description:
        "Des accords faciles à comprendre et à utiliser au quotidien.",
      of: [defineArrayMember({ type: "string" })],
      validation: (Rule) => Rule.required().min(4).max(4),
    }),

    defineField({
      name: "simplePairingsEn",
      title: "4 accords simples — anglais",
      type: "array",
      group: "food",
      of: [defineArrayMember({ type: "string" })],
    }),

    // GÉOGRAPHIE
    defineField({
      name: "mainRegions",
      title: "Principales régions",
      type: "array",
      group: "geography",
      description:
        "Régions LPV particulièrement associées à ce cépage.",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "region" }],
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),

    // À ESSAYER
    defineField({
      name: "tryNext",
      title: "Si tu aimes ceci, essaie…",
      type: "array",
      group: "discover",
      description:
        "Suggérer de 2 à 4 autres cépages et expliquer brièvement pourquoi.",
      of: [
        defineArrayMember({
          type: "object",
          name: "grapeSuggestion",
          title: "Suggestion",
          fields: [
            defineField({
              name: "grape",
              title: "Cépage",
              type: "reference",
              to: [{ type: "grape" }],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "reason",
              title: "Pourquoi l'essayer?",
              type: "string",
              description:
                "Ex. Pour son fruit croquant et sa fraîcheur.",
              validation: (Rule) => Rule.max(160),
            }),
            defineField({
              name: "reasonEn",
              title: "Pourquoi l'essayer? — anglais",
              type: "string",
            }),
          ],
          preview: {
            select: {
              title: "grape.name",
              subtitle: "reason",
            },
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(2).max(4),
    }),

    // INFORMATIONS AVANCÉES
    defineField({
      name: "description",
      title: "Description courte — ancien champ",
      type: "text",
      rows: 4,
      group: "advanced",
    }),

    defineField({
      name: "descriptionEn",
      title: "Description courte — anglais",
      type: "text",
      rows: 4,
      group: "advanced",
    }),

    defineField({
      name: "history",
      title: "Histoire",
      type: "array",
      group: "advanced",
      of: [defineArrayMember({ type: "block" })],
    }),

    defineField({
      name: "historyEn",
      title: "Histoire — anglais",
      type: "array",
      group: "advanced",
      of: [defineArrayMember({ type: "block" })],
    }),

    defineField({
      name: "originCountry",
      title: "Pays d'origine",
      type: "reference",
      group: "advanced",
      to: [{ type: "country" }],
    }),

    defineField({
      name: "flavors",
      title: "Saveurs dominantes — ancien champ",
      type: "array",
      group: "advanced",
      of: [defineArrayMember({ type: "string" })],
      options: {
        layout: "tags",
      },
    }),

    defineField({
      name: "flavorsEn",
      title: "Saveurs dominantes — anglais",
      type: "array",
      group: "advanced",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),

    defineField({
      name: "agingPotential",
      title: "Potentiel de garde",
      type: "string",
      group: "advanced",
    }),

    defineField({
      name: "agingPotentialEn",
      title: "Potentiel de garde — anglais",
      type: "string",
      group: "advanced",
    }),

    defineField({
      name: "recommendedFoods",
      title: "Accords classiques — ancien champ",
      type: "array",
      group: "advanced",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "food" }],
        }),
      ],
    }),

    // PUBLICATION
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
      color: "color",
      media: "heroImage",
    },
    prepare({ title, color, media }) {
      const labels: Record<string, string> = {
        red: "Rouge",
        white: "Blanc",
      };

      return {
        title,
        subtitle: labels[color] || color || "Cépage",
        media,
      };
    },
  },
});
