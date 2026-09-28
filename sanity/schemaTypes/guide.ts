import { defineField, defineType } from "sanity";

export const guide = defineType({
  name: "guide",
  title: "Guides",
  type: "document",
  fields: [
    {
      name: "translationSourceHash",
      title: "Translation source hash",
      type: "string",
      hidden: true,
      readOnly: true,
    },

    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "titleEn",
      title: "Titre (EN)",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Résumé",
      type: "text",
      rows: 4,
    }),

    defineField({
      name: "excerptEn",
      title: "Résumé (EN)",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "coverImage",
      title: "Image principale",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "guideType",
      title: "Type de guide",
      type: "string",
      options: {
        list: [
          { title: "Guide débutant", value: "beginner" },
          { title: "Guide d'achat", value: "buying" },
          { title: "Guide pratique", value: "practical" },
          { title: "Guide régional", value: "region" },
          { title: "Guide cépage", value: "grape" },
          { title: "Guide accords", value: "pairing" },
          { title: "Guide dégustation", value: "tasting" },
          { title: "Guide voyage", value: "travel" },
        ],
      },
    }),
    defineField({
      name: "difficulty",
      title: "Niveau",
      type: "string",
      options: {
        list: [
          { title: "Débutant", value: "beginner" },
          { title: "Intermédiaire", value: "intermediate" },
          { title: "Avancé", value: "advanced" },
        ],
      },
    }),
    defineField({
      name: "estimatedReadingTime",
      title: "Temps de lecture estimé",
      type: "string",
      description: "Exemple : 8 minutes.",
    }),

    defineField({
      name: "estimatedReadingTimeEn",
      title: "Temps de lecture estimé (EN)",
      type: "string",
      description: "Example: 8 minutes.",
    }),

    defineField({
      name: "relatedCountries",
      title: "Pays liés",
      type: "array",
      of: [{ type: "reference", to: [{ type: "country" }] }],
    }),
    defineField({
      name: "relatedRegions",
      title: "Régions liées",
      type: "array",
      of: [{ type: "reference", to: [{ type: "region" }] }],
    }),
    defineField({
      name: "relatedAppellations",
      title: "Appellations liées",
      type: "array",
      of: [{ type: "reference", to: [{ type: "appellation" }] }],
    }),
    defineField({
      name: "relatedGrapes",
      title: "Cépages liés",
      type: "array",
      of: [{ type: "reference", to: [{ type: "grape" }] }],
    }),
    defineField({
      name: "relatedArticles",
      title: "Articles liés",
      type: "array",
      of: [{ type: "reference", to: [{ type: "article" }] }],
    }),
    defineField({
      name: "relatedWines",
      title: "Vins liés",
      type: "array",
      of: [{ type: "reference", to: [{ type: "wine" }] }],
    }),
    defineField({
      name: "relatedProducers",
      title: "Producteurs liés",
      type: "array",
      of: [{ type: "reference", to: [{ type: "producer" }] }],
    }),
    defineField({
      name: "relatedVineyards",
      title: "Vignobles liés",
      type: "array",
      of: [{ type: "reference", to: [{ type: "vineyard" }] }],
    }),
    defineField({
      name: "relatedPlaces",
      title: "Bonnes adresses liées",
      type: "array",
      of: [{ type: "reference", to: [{ type: "place" }] }],
    }),

    defineField({
      name: "published",
      title: "Publié",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "publishedAt",
      title: "Date de publication",
      type: "datetime",
    }),
    defineField({
      name: "content",
      title: "Contenu",
      type: "array",
      of: [{ type: "block" }, { type: "guideTable" }, { type: "guideChecklist" }],
    }),

    defineField({
      name: "contentEn",
      title: "Contenu (EN)",
      type: "array",
      of: [{ type: "block" }, { type: "guideTable" }, { type: "guideChecklist" }],
    }),

    defineField({
      name: "seoTitle",
      title: "Titre SEO",
      type: "string",
    }),

    defineField({
      name: "seoTitleEn",
      title: "Titre SEO (EN)",
      type: "string",
    }),
    defineField({
      name: "seoDescription",
      title: "Description SEO",
      type: "text",
      rows: 3,
    }),

    defineField({
      name: "seoDescriptionEn",
      title: "Description SEO (EN)",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "guideType",
      media: "coverImage",
    },
  },
});
