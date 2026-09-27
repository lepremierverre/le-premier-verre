import { defineField, defineType } from "sanity";

export const article = defineType({
  name: "article",
  title: "Article",
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
      title: "Extrait",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "excerptEn",
      title: "Résumé (EN)",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "content",
      title: "Contenu",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Titre 2", value: "h2" },
            { title: "Titre 3", value: "h3" },
            { title: "Citation", value: "blockquote" },
            { title: "À retenir", value: "takeaway" },
          ],
          lists: [
            { title: "Puces", value: "bullet" },
            { title: "Numérotée", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Gras", value: "strong" },
              { title: "Italique", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Lien",
                fields: [
                  {
                    name: "href",
                    type: "string",
                    title: "Lien",
                  },
                ],
              },
            ],
          },
        },
        {
          type: "object",
          name: "articleWineCard",
          title: "Carte de vin",
          fields: [
            {
              name: "wine",
              title: "Vin",
              type: "reference",
              to: [{ type: "wine" }],
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: "wine.name",
              subtitle: "wine.producer.name",
              media: "wine.bottleImage",
            },
            prepare({ title, subtitle, media }) {
              return {
                title: title || "Vin à sélectionner",
                subtitle: subtitle
                  ? `Carte de vin · ${subtitle}`
                  : "Carte de vin",
                media,
              };
            },
          },
        },
        {
          type: "object",
          name: "articleProducerCard",
          title: "Carte de producteur",
          fields: [
            {
              name: "producer",
              title: "Producteur",
              type: "reference",
              to: [{ type: "producer" }],
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: "producer.name",
              subtitle: "producer.municipality",
              media: "producer.heroImage",
            },
            prepare({ title, subtitle, media }) {
              return {
                title: title || "Producteur à sélectionner",
                subtitle: subtitle
                  ? `Carte de producteur · ${subtitle}`
                  : "Carte de producteur",
                media,
              };
            },
          },
        },
        {
          type: "object",
          name: "articlePlaceCard",
          title: "Carte de bonne adresse",
          fields: [
            {
              name: "place",
              title: "Adresse",
              type: "reference",
              to: [{ type: "place" }],
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: "place.name",
              subtitle: "place.city",
              media: "place.coverImage",
            },
            prepare({ title, subtitle, media }) {
              return {
                title: title || "Adresse à sélectionner",
                subtitle: subtitle
                  ? `Carte d’adresse · ${subtitle}`
                  : "Carte de bonne adresse",
                media,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "contentEn",
      title: "Contenu (EN)",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "object",
          name: "articleWineCard",
          title: "Carte de vin",
          fields: [
            {
              name: "wine",
              title: "Vin",
              type: "reference",
              to: [{ type: "wine" }],
              validation: (Rule) => Rule.required(),
            },
          ],
        },
        {
          type: "object",
          name: "articleProducerCard",
          title: "Carte de producteur",
          fields: [
            {
              name: "producer",
              title: "Producteur",
              type: "reference",
              to: [{ type: "producer" }],
              validation: (Rule) => Rule.required(),
            },
          ],
        },
        {
          type: "object",
          name: "articlePlaceCard",
          title: "Carte de bonne adresse",
          fields: [
            {
              name: "place",
              title: "Adresse",
              type: "reference",
              to: [{ type: "place" }],
              validation: (Rule) => Rule.required(),
            },
          ],
        },
      ],
    }),
    defineField({
      name: "coverImage",
      title: "Image de couverture",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "category",
      title: "Catégorie",
      type: "string",
    }),
    defineField({
      name: "categoryEn",
      title: "Catégorie (EN)",
      type: "string",
    }),
    defineField({
      name: "author",
      title: "Auteur",
      type: "string",
    }),
    defineField({
      name: "tags",
      title: "Thèmes",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "tagsEn",
      title: "Mots-clés (EN)",
      type: "array",
      of: [{ type: "string" }],
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
      name: "featured",
      title: "Article en vedette",
      type: "boolean",
      initialValue: false,
    }),

    defineField({
      name: "publishedAt",
      title: "Date de publication",
      type: "datetime",
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
      subtitle: "category",
      media: "coverImage",
    },
  },
});
