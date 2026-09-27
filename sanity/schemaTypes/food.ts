import { defineField, defineType } from "sanity";

export const food = defineType({
  name: "food",
  title: "Accords mets-vins",
  type: "document",

  groups: [
    { name: "editorial", title: "Éditorial", default: true },
    { name: "pairing", title: "L’accord" },
    { name: "recommendation", title: "Moteur de recommandation" },
    { name: "wines", title: "Sélection LPV" },
    { name: "seo", title: "SEO" },
  ],

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
      group: "editorial",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "nameEn",
      title: "Nom — EN",
      type: "string",
      group: "editorial",
      description: "Nom anglais de l’accord.",
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "editorial",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "category",
      title: "Catégorie",
      type: "string",
      group: "editorial",
      options: {
        list: [
          { title: "Apéritif", value: "aperitif" },
          { title: "Poisson", value: "fish" },
          { title: "Fruits de mer", value: "seafood" },
          { title: "Volaille", value: "poultry" },
          { title: "Viande rouge", value: "red-meat" },
          { title: "Charcuterie", value: "charcuterie" },
          { title: "Fromage", value: "cheese" },
          { title: "Végétarien", value: "vegetarian" },
          { title: "Dessert", value: "dessert" },
          { title: "Autre", value: "other" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "image",
      title: "Image",
      type: "image",
      group: "editorial",
      options: { hotspot: true },
    }),

    defineField({
      name: "oneLiner",
      title: "En une phrase",
      description:
        "La réponse immédiate LPV. Exemple : Avec une pizza tomate, cherche surtout de la fraîcheur et un rouge qui ne soit pas trop lourd.",
      type: "string",
      group: "pairing",
      validation: (Rule) => Rule.max(180),
    }),

    defineField({
      name: "oneLinerEn",
      title: "En une phrase — EN",
      type: "string",
      group: "pairing",
      description: "Version anglaise.",
      validation: (Rule) => Rule.max(180),
    }),

    defineField({
      name: "description",
      title: "Pourquoi ça marche",
      type: "array",
      group: "pairing",
      of: [{ type: "block" }],
    }),

    defineField({
      name: "descriptionEn",
      title: "Pourquoi ça marche — EN",
      type: "array",
      group: "pairing",
      of: [{ type: "block" }],
    }),

    defineField({
      name: "lpvAdvice",
      title: "Le conseil LPV",
      description: "Le réflexe simple à retenir, sans jargon.",
      type: "text",
      rows: 3,
      group: "pairing",
    }),

    defineField({
      name: "lpvAdviceEn",
      title: "Le conseil LPV — EN",
      type: "text",
      rows: 3,
      group: "pairing",
      description: "Version anglaise.",
    }),

    defineField({
      name: "wineStyles",
      title: "Styles de vins à chercher",
      description:
        "Ex. rouge léger, sangiovese, barbera, rosé sec.",
      type: "array",
      group: "pairing",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),

    defineField({
      name: "wineStylesEn",
      title: "Styles de vins à chercher — EN",
      type: "array",
      group: "pairing",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description: "Version anglaise.",
    }),

    defineField({
      name: "avoid",
      title: "À éviter",
      description:
        "Un conseil court seulement lorsque c’est réellement utile.",
      type: "string",
      group: "pairing",
    }),

    defineField({
      name: "avoidEn",
      title: "À éviter — EN",
      type: "string",
      group: "pairing",
      description: "Version anglaise.",
    }),

    defineField({
      name: "servingTip",
      title: "Petit conseil de service",
      description:
        "Température, carafe ou autre conseil pratique pertinent.",
      type: "string",
      group: "pairing",
    }),

    defineField({
      name: "servingTipEn",
      title: "Petit conseil de service — EN",
      type: "string",
      group: "pairing",
      description: "Version anglaise.",
    }),

    // ─────────────────────────────────────────────
    // MOTEUR DE RECOMMANDATION
    // ─────────────────────────────────────────────

    defineField({
      name: "recommendedColors",
      title: "Types de vins recommandés",
      description:
        "Types qui fonctionnent particulièrement bien avec cet accord. Laisser vide si tous les types peuvent convenir.",
      type: "array",
      group: "recommendation",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Rouge", value: "red" },
          { title: "Blanc", value: "white" },
          { title: "Rosé", value: "rose" },
          { title: "Orange", value: "orange" },
          { title: "Bulles", value: "sparkling" },
          { title: "Fortifié", value: "fortified" },
        ],
      },
    }),

    defineField({
      name: "bodyTarget",
      title: "Corps idéal",
      description: "1 = très léger · 5 = très puissant",
      type: "number",
      group: "recommendation",
      validation: (Rule) => Rule.min(1).max(5),
    }),

    defineField({
      name: "bodyTolerance",
      title: "Tolérance — corps",
      description:
        "Écart acceptable autour de la valeur idéale. Exemple : cible 3 + tolérance 1 = 2 à 4.",
      type: "number",
      group: "recommendation",
      initialValue: 1,
      validation: (Rule) => Rule.min(0).max(4),
    }),

    defineField({
      name: "acidityTarget",
      title: "Acidité idéale",
      description: "1 = faible · 5 = très élevée",
      type: "number",
      group: "recommendation",
      validation: (Rule) => Rule.min(1).max(5),
    }),

    defineField({
      name: "acidityTolerance",
      title: "Tolérance — acidité",
      type: "number",
      group: "recommendation",
      initialValue: 1,
      validation: (Rule) => Rule.min(0).max(4),
    }),

    defineField({
      name: "sweetnessTarget",
      title: "Niveau de sucre idéal",
      description: "1 = très sec · 5 = très doux",
      type: "number",
      group: "recommendation",
      validation: (Rule) => Rule.min(1).max(5),
    }),

    defineField({
      name: "sweetnessTolerance",
      title: "Tolérance — sucre",
      type: "number",
      group: "recommendation",
      initialValue: 1,
      validation: (Rule) => Rule.min(0).max(4),
    }),

    defineField({
      name: "roundnessTarget",
      title: "Rondeur idéale",
      description: "1 = très vif · 5 = très rond",
      type: "number",
      group: "recommendation",
      validation: (Rule) => Rule.min(1).max(5),
    }),

    defineField({
      name: "roundnessTolerance",
      title: "Tolérance — rondeur",
      type: "number",
      group: "recommendation",
      initialValue: 1,
      validation: (Rule) => Rule.min(0).max(4),
    }),

    defineField({
      name: "tanninsMax",
      title: "Tanins maximum",
      description:
        "1 = très peu tannique · 5 = très tannique. Laisser vide si ce critère n’est pas important.",
      type: "number",
      group: "recommendation",
      validation: (Rule) => Rule.min(1).max(5),
    }),

    defineField({
      name: "intensityTarget",
      title: "Intensité aromatique idéale",
      description: "1 = délicat · 5 = très intense",
      type: "number",
      group: "recommendation",
      validation: (Rule) => Rule.min(1).max(5),
    }),

    defineField({
      name: "intensityTolerance",
      title: "Tolérance — intensité",
      type: "number",
      group: "recommendation",
      initialValue: 1,
      validation: (Rule) => Rule.min(0).max(4),
    }),

    defineField({
      name: "oakInfluenceMax",
      title: "Influence du bois maximum",
      description:
        "1 = très peu boisé · 5 = très boisé. Laisser vide si ce critère n’est pas important.",
      type: "number",
      group: "recommendation",
      validation: (Rule) => Rule.min(1).max(5),
    }),

    defineField({
      name: "fruitIntensityTarget",
      title: "Expression du fruit idéale",
      description:
        "1 = fruit discret · 5 = fruit très expressif. Laisser vide si ce critère n’est pas important.",
      type: "number",
      group: "recommendation",
      validation: (Rule) => Rule.min(1).max(5),
    }),

    defineField({
      name: "fruitIntensityTolerance",
      title: "Tolérance — expression du fruit",
      type: "number",
      group: "recommendation",
      initialValue: 1,
      validation: (Rule) => Rule.min(0).max(4),
    }),

    defineField({
      name: "mineralityTarget",
      title: "Minéralité idéale",
      description:
        "1 = peu minéral · 5 = très minéral. Laisser vide si ce critère n’est pas important.",
      type: "number",
      group: "recommendation",
      validation: (Rule) => Rule.min(1).max(5),
    }),

    defineField({
      name: "mineralityTolerance",
      title: "Tolérance — minéralité",
      type: "number",
      group: "recommendation",
      initialValue: 1,
      validation: (Rule) => Rule.min(0).max(4),
    }),

    defineField({
      name: "complexityTarget",
      title: "Complexité idéale",
      description:
        "1 = très simple · 5 = très complexe. Laisser vide si ce critère n’est pas important.",
      type: "number",
      group: "recommendation",
      validation: (Rule) => Rule.min(1).max(5),
    }),

    defineField({
      name: "complexityTolerance",
      title: "Tolérance — complexité",
      type: "number",
      group: "recommendation",
      initialValue: 1,
      validation: (Rule) => Rule.min(0).max(4),
    }),

    defineField({
      name: "savoryTarget",
      title: "Caractère savoureux idéal",
      description:
        "1 = très fruité · 5 = très savoureux / épicé / terreux. Laisser vide si ce critère n’est pas important.",
      type: "number",
      group: "recommendation",
      validation: (Rule) => Rule.min(1).max(5),
    }),

    defineField({
      name: "savoryTolerance",
      title: "Tolérance — caractère savoureux",
      type: "number",
      group: "recommendation",
      initialValue: 1,
      validation: (Rule) => Rule.min(0).max(4),
    }),

    defineField({
      name: "preferredGrapes",
      title: "Cépages particulièrement adaptés",
      description:
        "Signal positif pour le classement, jamais une obligation.",
      type: "array",
      group: "recommendation",
      of: [{ type: "reference", to: [{ type: "grape" }] }],
    }),

    defineField({
      name: "pairingKeywords",
      title: "Mots-clés de recommandation",
      description:
        "Signaux éditoriaux supplémentaires. Ex. vif, minéral, fruité, faible tanin, aromatique.",
      type: "array",
      group: "recommendation",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),

    defineField({
      name: "wines",
      title: "Choix éditoriaux LPV",
      description:
        "Bouteilles particulièrement recommandées par Le Premier Verre. Elles obtiennent un bonus dans le classement, mais les recommandations affichées pourront évoluer automatiquement avec le catalogue.",
      type: "array",
      group: "wines",
      of: [{ type: "reference", to: [{ type: "wine" }] }],
    }),

    defineField({
      name: "seoTitle",
      title: "Titre SEO",
      type: "string",
      group: "seo",
      validation: (Rule) => Rule.max(70),
    }),

    defineField({
      name: "seoTitleEn",
      title: "Titre SEO — EN",
      type: "string",
      group: "seo",
      validation: (Rule) => Rule.max(70),
    }),

    defineField({
      name: "seoDescription",
      title: "Description SEO",
      type: "text",
      rows: 3,
      group: "seo",
      validation: (Rule) => Rule.max(170),
    }),

    defineField({
      name: "seoDescriptionEn",
      title: "Description SEO — EN",
      type: "text",
      rows: 3,
      group: "seo",
      validation: (Rule) => Rule.max(170),
    }),

    defineField({
      name: "published",
      title: "Publié",
      type: "boolean",
      group: "editorial",
      initialValue: false,
    }),
  ],

  preview: {
    select: {
      title: "name",
      subtitle: "oneLiner",
      media: "image",
    },
  },
});
