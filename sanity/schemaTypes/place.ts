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
      description:
        "Ne sera affichée publiquement que si le statut des droits ci-dessous autorise son utilisation.",
    }),

    defineField({
      name: "secondaryImage",
      title: "Deuxième image",
      type: "image",
      options: { hotspot: true },
      description:
        "Deuxième visuel utilisé sur les fiches partenaires Bonnes adresses.",
    }),

    defineField({
      name: "secondaryImageCredit",
      title: "Crédit de la deuxième image",
      type: "string",
      description:
        "Crédit à afficher sous la deuxième image.",
    }),

    defineField({
      name: "mediaPermissionStatus",
      title: "Droits d’utilisation du visuel",
      type: "string",
      description:
        "Ce statut détermine si la photo peut être affichée publiquement sur Le Premier Verre.",
      initialValue: "none",
      options: {
        layout: "radio",
        list: [
          {
            title: "Aucune autorisation — ne pas publier",
            value: "none",
          },
          {
            title: "Visuel fourni directement par l’établissement",
            value: "provided_by_place",
          },
          {
            title: "Utilisation autorisée par l’établissement",
            value: "authorized_by_place",
          },
          {
            title: "Photo originale Le Premier Verre",
            value: "lpv_original",
          },
          {
            title: "Visuel sous licence",
            value: "licensed",
          },
        ],
      },
    }),

    defineField({
      name: "mediaCredit",
      title: "Crédit du visuel",
      type: "string",
      description:
        "Ex. établissement, photographe, agence ou Le Premier Verre.",
      hidden: ({ document }) =>
        !document?.mediaPermissionStatus ||
        document.mediaPermissionStatus === "none",
    }),

    defineField({
      name: "mediaPermissionDate",
      title: "Date de l’autorisation / réception",
      type: "date",
      hidden: ({ document }) =>
        !document?.mediaPermissionStatus ||
        document.mediaPermissionStatus === "none",
    }),

    defineField({
      name: "mediaPermissionNote",
      title: "Note interne sur les droits",
      type: "text",
      rows: 3,
      description:
        "Usage interne seulement. Ex. autorisation reçue par courriel, photos transmises directement, portée de la licence, etc.",
      hidden: ({ document }) =>
        !document?.mediaPermissionStatus ||
        document.mediaPermissionStatus === "none",
    }),

    defineField({
      name: "lpvPartner",
      title: "Partenaire Le Premier Verre",
      type: "boolean",
      initialValue: false,
      description:
        "Activer uniquement lorsqu’une collaboration ou un partenariat avec Le Premier Verre est confirmé. Les établissements partenaires peuvent être mis en avant dans Bonnes adresses.",
    }),
    defineField({
      name: "published",
      title: "Publié",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
