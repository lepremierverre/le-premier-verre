import { defineField, defineType } from "sanity";

export const country = defineType({
  name: "country",
  title: "Pays",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nom",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "nameEn",
      title: "Nom — anglais",
      type: "string",
    }),
    defineField({
      name: "nativeName",
      title: "Nom local",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "isoCode",
      title: "Code ISO",
      type: "string",
      description: "Exemple : FR, IT, CA, ES.",
    }),
    defineField({
      name: "flagEmoji",
      title: "Drapeau",
      type: "string",
      description: "Exemple : 🇫🇷",
    }),
    defineField({
      name: "heroImage",
      title: "Image héro",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "description",
      title: "Description courte",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "descriptionEn",
      title: "Description courte — anglais",
      type: "text",
      rows: 4,
    }),

    defineField({
      name: "wineHistory",
      title: "Histoire viticole",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "wineHistoryEn",
      title: "Histoire viticole — anglais",
      type: "array",
      of: [{ type: "block" }],
    }),

    defineField({
      name: "climate",
      title: "Climat",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "climateEn",
      title: "Climat — anglais",
      type: "text",
      rows: 4,
    }),

    defineField({
      name: "wineSurface",
      title: "Superficie viticole",
      type: "string",
      description: "Exemple : environ 750 000 hectares.",
    }),
    defineField({
      name: "wineSurfaceEn",
      title: "Superficie viticole — anglais",
      type: "string",
    }),

    defineField({
      name: "annualProduction",
      title: "Production annuelle",
      type: "string",
      description: "Exemple : environ 45 millions d'hectolitres.",
    }),
    defineField({
      name: "annualProductionEn",
      title: "Production annuelle — anglais",
      type: "string",
    }),

    defineField({
      name: "mainWineStyles",
      title: "Styles de vins principaux",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "mainWineStylesEn",
      title: "Styles de vins principaux — anglais",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),

    defineField({
      name: "signatureGrapes",
      title: "Cépages emblématiques",
      type: "array",
      of: [{ type: "reference", to: [{ type: "grape" }] }],
    }),
    defineField({
      name: "seoTitle",
      title: "Titre SEO",
      type: "string",
    }),
    defineField({
      name: "seoDescription",
      title: "Description SEO",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "seoTitleEn",
      title: "Titre SEO — anglais",
      type: "string",
    }),

    defineField({
      name: "seoDescriptionEn",
      title: "Description SEO — anglais",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "nativeName",
      media: "heroImage",
    },
  },
});
