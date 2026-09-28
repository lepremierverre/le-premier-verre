import { defineField, defineType } from "sanity";

export const guideTable = defineType({
  name: "guideTable",
  title: "Tableau de guide",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
    }),
    defineField({
      name: "titleEn",
      title: "Titre (EN)",
      type: "string",
    }),
    defineField({
      name: "columns",
      title: "Colonnes",
      type: "array",
      validation: (Rule) => Rule.required().min(2),
      of: [
        {
          type: "object",
          name: "guideTableColumn",
          title: "Colonne",
          fields: [
            defineField({
              name: "label",
              title: "Libellé",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "labelEn",
              title: "Libellé (EN)",
              type: "string",
            }),
          ],
          preview: {
            select: {
              title: "label",
              subtitle: "labelEn",
            },
          },
        },
      ],
    }),
    defineField({
      name: "rows",
      title: "Lignes",
      type: "array",
      of: [
        {
          type: "object",
          name: "guideTableRow",
          title: "Ligne",
          fields: [
            defineField({
              name: "cells",
              title: "Cellules",
              type: "array",
              of: [
                {
                  type: "object",
                  name: "guideTableCell",
                  title: "Cellule",
                  fields: [
                    defineField({
                      name: "text",
                      title: "Texte",
                      type: "text",
                      rows: 2,
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                      name: "textEn",
                      title: "Texte (EN)",
                      type: "text",
                      rows: 2,
                    }),
                  ],
                  preview: {
                    select: {
                      title: "text",
                      subtitle: "textEn",
                    },
                  },
                },
              ],
            }),
          ],
          preview: {
            prepare() {
              return {
                title: "Ligne du tableau",
              };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      titleEn: "titleEn",
    },
    prepare({ title, titleEn }) {
      return {
        title: title || titleEn || "Tableau",
        subtitle: "Tableau de guide",
      };
    },
  },
});
