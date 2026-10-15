import { defineField, defineType } from "sanity";

export const event = defineType({
  name: "event",
  title: "Rendez-vous LPV",
  type: "document",

  groups: [
    { name: "editorial", title: "Éditorial", default: true },
    { name: "logistics", title: "Date et lieu" },
    { name: "booking", title: "Réservation" },
  ],

  fields: [
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      group: "editorial",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "titleEn",
      title: "Titre — EN",
      type: "string",
      group: "editorial",
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "editorial",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "eventType",
      title: "Type de Rendez-vous",
      type: "string",
      group: "editorial",
      options: {
        list: [
          { title: "Dégustation", value: "tasting" },
          { title: "Rencontre producteur", value: "producer-meetup" },
          { title: "Atelier", value: "workshop" },
          { title: "Souper / accord", value: "dinner" },
          { title: "Pop-up", value: "popup" },
          { title: "Autre", value: "other" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "description",
      title: "Description",
      type: "array",
      group: "editorial",
      of: [{ type: "block" }],
    }),

    defineField({
      name: "descriptionEn",
      title: "Description — EN",
      type: "array",
      group: "editorial",
      of: [{ type: "block" }],
    }),

    defineField({
      name: "coverImage",
      title: "Image",
      type: "image",
      group: "editorial",
      options: { hotspot: true },
    }),

    defineField({
      name: "startsAt",
      title: "Début",
      type: "datetime",
      group: "logistics",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "endsAt",
      title: "Fin",
      type: "datetime",
      group: "logistics",
    }),

    defineField({
      name: "venueName",
      title: "Lieu",
      type: "string",
      group: "logistics",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "city",
      title: "Ville",
      type: "string",
      group: "logistics",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "address",
      title: "Adresse",
      type: "string",
      group: "logistics",
    }),

    defineField({
      name: "capacity",
      title: "Capacité",
      type: "number",
      group: "logistics",
      validation: (Rule) => Rule.integer().positive(),
    }),

    defineField({
      name: "price",
      title: "Prix par personne",
      type: "number",
      group: "booking",
      validation: (Rule) => Rule.min(0),
    }),

    defineField({
      name: "bookingUrl",
      title: "Lien de réservation",
      type: "url",
      group: "booking",
    }),

    defineField({
      name: "status",
      title: "Statut",
      type: "string",
      group: "booking",
      initialValue: "draft",
      options: {
        layout: "radio",
        list: [
          { title: "Brouillon", value: "draft" },
          { title: "À venir", value: "upcoming" },
          { title: "Complet", value: "sold-out" },
          { title: "Terminé", value: "completed" },
          { title: "Annulé", value: "cancelled" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "published",
      title: "Publié sur Le Premier Verre",
      type: "boolean",
      group: "booking",
      initialValue: false,
      validation: (Rule) => Rule.required(),
    }),
  ],

  preview: {
    select: {
      title: "title",
      startsAt: "startsAt",
      city: "city",
      media: "coverImage",
    },
    prepare({ title, startsAt, city, media }) {
      const date =
        startsAt && !Number.isNaN(new Date(startsAt).getTime())
          ? new Intl.DateTimeFormat("fr-CA", {
              dateStyle: "medium",
            }).format(new Date(startsAt))
          : null;

      return {
        title: title || "Rendez-vous sans titre",
        subtitle: [date, city].filter(Boolean).join(" · "),
        media,
      };
    },
  },
});
