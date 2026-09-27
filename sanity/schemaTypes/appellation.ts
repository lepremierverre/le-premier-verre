import { defineField, defineType } from "sanity";

export const appellation = defineType({
  name: "appellation",
  title: "Appellation",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nom",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "country",
      title: "Pays",
      type: "reference",
      to: [{ type: "country" }],
    }),
    defineField({
      name: "region",
      title: "Région",
      type: "reference",
      to: [{ type: "region" }],
    }),
    defineField({
      name: "classification",
      title: "Classification",
      type: "string",
      description: "Exemple : AOC, AOP, DOCG, IGP, AVA, VQA.",
    }),
    defineField({
      name: "heroImage",
      title: "Image héro",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "descriptionEn",
      title: "Description — anglais",
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
      name: "soilTypes",
      title: "Types de sols",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "soilTypesEn",
      title: "Types de sols — anglais",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),

    defineField({
      name: "grapes",
      title: "Cépages associés",
      type: "array",
      of: [{ type: "reference", to: [{ type: "grape" }] }],
    }),
    defineField({
      name: "authorizedWineStyles",
      title: "Styles autorisés ou typiques",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "authorizedWineStylesEn",
      title: "Styles autorisés ou typiques — anglais",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),

    defineField({
      name: "productionRules",
      title: "Règles de production",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "productionRulesEn",
      title: "Règles de production — anglais",
      type: "array",
      of: [{ type: "block" }],
    }),

    defineField({
      name: "foodPairingNotes",
      title: "Notes d'accords mets-vins",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "foodPairingNotesEn",
      title: "Notes d'accords mets-vins — anglais",
      type: "text",
      rows: 4,
    }),

    defineField({
      name: "latitude",
      title: "Latitude",
      type: "number",
    }),
    defineField({
      name: "longitude",
      title: "Longitude",
      type: "number",
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
      region: "region.name",
      country: "country.name",
      media: "heroImage",
    },
    prepare({ title, region, country }) {
      return {
        title,
        subtitle: [region, country].filter(Boolean).join(" · "),
      };
    },
  },
});
