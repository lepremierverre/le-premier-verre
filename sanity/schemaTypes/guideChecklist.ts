import { defineField, defineType } from "sanity";

export const guideChecklist = defineType({
  name: "guideChecklist",
  title: "Checklist de guide",
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
      name: "groups",
      title: "Groupes",
      type: "array",
      validation: (Rule) => Rule.required().min(1),
      of: [
        {
          type: "object",
          name: "guideChecklistGroup",
          title: "Groupe",
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
            defineField({
              name: "items",
              title: "Éléments",
              type: "array",
              validation: (Rule) => Rule.required().min(1),
              of: [
                {
                  type: "object",
                  name: "guideChecklistItem",
                  title: "Élément",
                  fields: [
                    defineField({
                      name: "text",
                      title: "Texte",
                      type: "string",
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                      name: "textEn",
                      title: "Texte (EN)",
                      type: "string",
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
            select: {
              title: "label",
              subtitle: "labelEn",
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
        title: title || titleEn || "Checklist",
        subtitle: "Checklist de guide",
      };
    },
  },
});
