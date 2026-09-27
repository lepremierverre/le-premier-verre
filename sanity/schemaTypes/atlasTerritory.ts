import { defineField, defineType } from "sanity";

export const atlasTerritory = defineType({
  name: "atlasTerritory",
  title: "Territoires de l’Atlas",
  type: "document",

  groups: [
    { name: "identity", title: "Identité", default: true },
    { name: "map", title: "Carte" },
    { name: "publication", title: "Publication" },
  ],

  fields: [
    defineField({
      name: "name",
      title: "Nom",
      type: "string",
      group: "identity",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "nameEn",
      title: "Nom — anglais",
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
      name: "order",
      title: "Ordre dans l’Atlas",
      type: "number",
      group: "identity",
      description:
        "Ordre d’affichage. Québec peut par exemple être 10, Afrique du Sud 20, Allemagne 30, etc.",
      validation: (Rule) => Rule.required().integer().min(0),
    }),

    defineField({
      name: "geometryKey",
      title: "Clé de géométrie",
      type: "string",
      group: "map",
      description:
        "Identifie la silhouette utilisée par l’Atlas. Ex. quebec, france-mainland, usa-contiguous, canada.",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "mapLabel",
      title: "Libellé cartographique",
      type: "string",
      group: "map",
      description:
        "Nom affiché sur la carte si différent du nom du territoire.",
    }),

    defineField({
      name: "mapLabelEn",
      title: "Libellé cartographique — anglais",
      type: "string",
      group: "map",
    }),

    defineField({
      name: "published",
      title: "Publié",
      type: "boolean",
      group: "publication",
      initialValue: true,
    }),
  ],

  preview: {
    select: {
      title: "name",
      order: "order",
      geometryKey: "geometryKey",
    },

    prepare({ title, order, geometryKey }) {
      return {
        title,
        subtitle: [
          typeof order === "number" ? `#${order}` : null,
          geometryKey,
        ]
          .filter(Boolean)
          .join(" · "),
      };
    },
  },
});
