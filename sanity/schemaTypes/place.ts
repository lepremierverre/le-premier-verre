import { defineField, defineType } from "sanity";

export const place = defineType({
  name: "place",
  title: "Bonnes adresses",
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
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Restaurant", value: "restaurant" },
          { title: "Bar à vin", value: "wine-bar" },
          { title: "Caviste", value: "caviste" },
          { title: "Boutique", value: "shop" },
          { title: "Autre", value: "other" },
        ],
      },
    }),
    defineField({
      name: "city",
      title: "Ville",
      type: "string",
    }),
    defineField({
      name: "producer",
      title: "Producteur lié",
      type: "reference",
      to: [{ type: "producer" }],
      description:
        "À utiliser lorsqu’une bonne adresse fait directement partie de l’expérience d’un producteur.",
    }),
    defineField({
      name: "availableWines",
      title: "Vins disponibles",
      type: "array",
      description:
        "Sélection manuelle de vins du catalogue disponibles à cette adresse. Les vins du producteur lié peuvent être ajoutés automatiquement sur le site.",
      of: [{ type: "reference", to: [{ type: "wine" }] }],
    }),
    defineField({
      name: "region",
      title: "Région",
      type: "string",
    }),
    defineField({
      name: "address",
      title: "Adresse",
      type: "string",
    }),
    defineField({
      name: "website",
      title: "Site web",
      type: "url",
    }),
    defineField({
      name: "instagram",
      title: "Instagram",
      type: "url",
      description: "URL du profil Instagram de l’établissement.",
    }),
    defineField({
      name: "instagramPosts",
      title: "Publications Instagram",
      type: "array",
      description:
        "Jusqu’à 3 publications publiques à afficher au bas de la fiche.",
      validation: (Rule) => Rule.max(3),
      of: [
        {
          type: "object",
          name: "instagramPost",
          title: "Publication Instagram",
          fields: [
            {
              name: "url",
              title: "URL de la publication",
              type: "url",
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: "url",
            },
          },
        },
      ],
    }),
    defineField({
      name: "highlights",
      title: "Pourquoi on y va — repères",
      type: "array",
      description:
        "Maximum 3 repères éditoriaux très courts pour résumer ce qui distingue l’adresse.",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: "highlightsEn",
      title: "Pourquoi on y va — repères (EN)",
      type: "array",
      description: "English translation of the editorial highlights.",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.max(3),
    }),

    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block" }],
    }),

    defineField({
      name: "descriptionEn",
      title: "Description (EN)",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "coverImage",
      title: "Image principale",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "published",
      title: "Publié",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
