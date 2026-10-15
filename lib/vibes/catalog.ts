export type VibeCatalogEntry = {
  /**
   * Identifiant canonique stable.
   *
   * Ne doit jamais changer lorsque le titre,
   * la description ou le slug évoluent.
   */
  id: string;

  slug: string;

  title: string;
  titleEn?: string;

  description: string;
  descriptionEn?: string;
};

export const VIBE_CATALOG: VibeCatalogEntry[] = [
  {
    id: "vibe_pool_15h",
    slug: "piscine-15h",
    title: "Piscine, 15 h",
    description:
      "Frais, léger, très froid. Rien qui demande trop d’attention.",
  },
  {
    id: "vibe_first_terrace_night",
    slug: "premier-soir-sur-la-terrasse",
    title: "Premier soir sur la terrasse",
    description:
      "Il fait 16 degrés, mais on mange dehors pareil.",
  },
  {
    id: "vibe_girls_aperitif",
    slug: "apero-entre-filles",
    title: "Apéro entre filles",
    description:
      "Facile à aimer, mais pas plate. La bouteille disparaît avant les olives.",
  },
  {
    id: "vibe_wednesday_reason_enough",
    slug: "mercredi-cest-assez-comme-raison",
    title: "Mercredi. C’est assez comme raison.",
    description:
      "Pas besoin d’attendre vendredi pour ouvrir quelque chose de bon.",
  },
  {
    id: "vibe_rain_red",
    slug: "il-pleut-on-ouvre-du-rouge",
    title: "Il pleut. On ouvre du rouge.",
    description:
      "Quelque chose de souple et réconfortant.",
  },
  {
    id: "vibe_first_fire",
    slug: "premier-feu-de-foyer",
    title: "Premier feu de foyer",
    description:
      "Un peu plus de matière. Quelque chose qui donne envie de rester là.",
  },
  {
    id: "vibe_late_august_outside",
    slug: "fin-aout-encore-dehors",
    title: "Fin août, encore dehors",
    description:
      "Encore frais, mais avec juste assez de matière pour sentir l’automne arriver.",
  },
  {
    id: "vibe_friday_1703",
    slug: "vendredi-17h03",
    title: "Vendredi, 17 h 03",
    description:
      "La semaine est terminée. Officiellement.",
  },
  {
    id: "vibe_cooking_bottle",
    slug: "la-bouteille-quon-ouvre-en-cuisinant",
    title: "La bouteille qu’on ouvre en cuisinant",
    description:
      "Il en restera peut-être pour le souper. Peut-être.",
  },
  {
    id: "vibe_after_ski",
    slug: "retour-du-ski",
    title: "Retour du ski",
    description:
      "Bottes mouillées, joues rouges, quelque chose qui réchauffe.",
  },
  {
    id: "vibe_park_white",
    slug: "le-blanc-quon-apporte-au-parc",
    title: "Le blanc qu’on apporte au parc",
    description:
      "Dans la glacière, avec beaucoup trop de snacks.",
  },
  {
    id: "vibe_unplanned_dinner",
    slug: "souper-qui-netait-pas-suppose-etre-un-souper",
    title: "Souper qui n’était pas supposé être un souper",
    description:
      "Quelqu’un reste. Puis deux. On finit par sortir des assiettes.",
  },
  {
    id: "vibe_outside_still_cold",
    slug: "un-verre-dehors-meme-sil-fait-encore-un-peu-froid",
    title: "Un verre dehors, même s’il fait encore un peu froid",
    description:
      "Parce qu’on a assez attendu.",
  },
  {
    id: "vibe_sunday_afternoon",
    slug: "dimanche-apres-midi",
    title: "Dimanche après-midi",
    description:
      "Rien de prévu après. C’est exactement le but.",
  },
  {
    id: "vibe_bbq_not_necessarily",
    slug: "bbq-mais-pas-necessairement-avec-le-bbq",
    title: "BBQ, mais pas nécessairement avec le BBQ",
    description:
      "Du monde dehors, de la musique, quelque chose qui se boit bien.",
  },
  {
    id: "vibe_overbooked_chalet",
    slug: "le-chalet-a-six-prevu-pour-quatre",
    title: "Le chalet à six, prévu pour quatre",
    description:
      "Trop de sacs, pas assez de lits, beaucoup de bouteilles.",
  },
  {
    id: "vibe_before_everyone_arrives",
    slug: "juste-avant-que-tout-le-monde-arrive",
    title: "Juste avant que tout le monde arrive",
    description:
      "La maison est prête. Toi aussi. Presque.",
  },
  {
    id: "vibe_everyone_stays_dinner",
    slug: "quand-tout-le-monde-reste-finalement-a-souper",
    title: "Quand tout le monde reste finalement à souper",
    description:
      "On improvise. C’est souvent là que ça devient bon.",
  },
  {
    id: "vibe_kitchen_counter",
    slug: "une-bouteille-au-comptoir-de-cuisine",
    title: "Une bouteille au comptoir de cuisine",
    description:
      "Pas de grande table. Pas de grande occasion.",
  },
  {
    id: "vibe_before_reservation",
    slug: "le-verre-avant-la-reservation",
    title: "Le verre avant la réservation",
    description:
      "Juste un. En théorie.",
  },
  {
    id: "vibe_pizza_order",
    slug: "on-commande-des-pizzas",
    title: "On commande des pizzas",
    description:
      "Il faut quelque chose qui suit sans compliquer la soirée.",
  },
  {
    id: "vibe_long_day",
    slug: "apres-une-journee-beaucoup-trop-longue",
    title: "Après une journée beaucoup trop longue",
    description:
      "Pas envie d’analyser quoi que ce soit. Juste envie que ce soit bon.",
  },
  {
    id: "vibe_first_hot_day",
    slug: "la-premiere-journee-vraiment-chaude",
    title: "La première journée vraiment chaude",
    description:
      "Celle où tout le monde cherche soudainement une terrasse.",
  },
  {
    id: "vibe_open_windows",
    slug: "fenetres-ouvertes",
    title: "Fenêtres ouvertes",
    description:
      "Enfin de l’air dans la maison.",
  },
  {
    id: "vibe_autumn_official",
    slug: "lautomne-est-officiellement-commence",
    title: "L’automne est officiellement commencé",
    description:
      "Les feuilles tombent. Le vin peut prendre un peu de poids.",
  },
  {
    id: "vibe_first_snow",
    slug: "premiere-neige",
    title: "Première neige",
    description:
      "On la trouve belle aujourd’hui. Profitons-en.",
  },
  {
    id: "vibe_storm_stay_home",
    slug: "tempete-on-ne-sort-plus",
    title: "Tempête. On ne sort plus.",
    description:
      "Les plans sont annulés. La bouteille, non.",
  },
  {
    id: "vibe_big_sweater",
    slug: "le-gros-chandail",
    title: "Le gros chandail",
    description:
      "Celui qu’on ressort dès qu’il fait 12 degrés.",
  },
  {
    id: "vibe_after_beach",
    slug: "apres-la-plage",
    title: "Après la plage",
    description:
      "Sel sur la peau, cheveux encore mouillés.",
  },
  {
    id: "vibe_dock_before_dinner",
    slug: "le-quai-avant-le-souper",
    title: "Le quai avant le souper",
    description:
      "Les pieds dans l’eau et absolument aucune urgence.",
  },
  {
    id: "vibe_long_july_evening",
    slug: "la-longue-soiree-de-juillet",
    title: "La longue soirée de juillet",
    description:
      "Il est 21 h 30 et personne n’a allumé les lumières.",
  },
  {
    id: "vibe_last_summer_weekend",
    slug: "le-dernier-week-end-de-lete",
    title: "Le dernier week-end de l’été",
    description:
      "On sait très bien que c’est presque fini. On n’en parle pas.",
  },
  {
    id: "vibe_breakfast_to_brunch",
    slug: "dejeuner-qui-devient-brunch-qui-devient",
    title: "Déjeuner qui devient brunch qui devient…",
    description:
      "À un moment donné, on arrête de regarder l’heure.",
  },
  {
    id: "vibe_tuesday_oysters",
    slug: "un-mardi-avec-des-huitres",
    title: "Un mardi avec des huîtres",
    description:
      "Parce que les huîtres n’ont jamais demandé que ce soit samedi.",
  },
  {
    id: "vibe_chips",
    slug: "quelque-chose-de-bon-avec-les-chips",
    title: "Quelque chose de bon avec les chips",
    description:
      "Oui, les chips. Et on assume complètement.",
  },
  {
    id: "vibe_small_things_table",
    slug: "la-table-pleine-de-petites-affaires",
    title: "La table pleine de petites affaires",
    description:
      "Fromage, olives, pain, charcuteries, trois bols dont personne ne connaît le contenu.",
  },
  {
    id: "vibe_late_dinner",
    slug: "on-mange-tard-ce-soir",
    title: "On mange tard ce soir",
    description:
      "L’apéro a pris un peu trop de place.",
  },
  {
    id: "vibe_sunday_dinner",
    slug: "le-souper-du-dimanche",
    title: "Le souper du dimanche",
    description:
      "Quelque chose de bon, sans sortir toute l’argenterie.",
  },
  {
    id: "vibe_pasta_parmesan",
    slug: "des-pates-beaucoup-de-parmesan",
    title: "Des pâtes, beaucoup de parmesan",
    description:
      "On ne réinvente rien. On veut juste que ce soit vraiment bon.",
  },
  {
    id: "vibe_relaxed_hosting",
    slug: "on-recoit-mais-relax",
    title: "On reçoit, mais relax",
    description:
      "La bonne bouteille sans transformer le souper en dégustation technique.",
  },
  {
    id: "vibe_bring_to_friends",
    slug: "la-bouteille-quon-apporte-chez-des-amis",
    title: "La bouteille qu’on apporte chez des amis",
    description:
      "Assez bonne pour faire plaisir. Pas assez bizarre pour devoir l’expliquer pendant dix minutes.",
  },
  {
    id: "vibe_new_to_wine",
    slug: "pour-quelquun-qui-dit-ne-pas-aimer-le-vin",
    title: "Pour quelqu’un qui dit ne pas aimer le vin",
    description:
      "On commence doucement.",
  },
  {
    id: "vibe_wine_person",
    slug: "pour-quelquun-qui-boit-vraiment-du-vin",
    title: "Pour quelqu’un qui boit vraiment du vin",
    description:
      "Là, on peut aller ailleurs.",
  },
  {
    id: "vibe_off_the_beaten_path",
    slug: "envie-de-sortir-des-sentiers-battus",
    title: "Envie de sortir des sentiers battus",
    description:
      "Quelque chose qu’on ne boit pas tous les jours.",
  },
  {
    id: "vibe_no_idea",
    slug: "jai-aucune-idee-de-ce-que-je-veux",
    title: "J’ai aucune idée de ce que je veux",
    description:
      "Parfait. On va partir de là.",
  },
  {
    id: "vibe_light_not_boring",
    slug: "leger-mais-pas-plate",
    title: "Léger, mais pas plate",
    description:
      "De la fraîcheur, du fruit, puis juste assez de caractère.",
  },
  {
    id: "vibe_belle_bouteille",
    slug: "on-sort-une-belle-bouteille",
    title: "On sort une belle bouteille",
    description:
      "Pas nécessairement une occasion. Juste une belle bouteille.",
  },
  {
    id: "vibe_small_dinner_big_bottle",
    slug: "petit-souper-grosse-bouteille",
    title: "Petit souper, grosse bouteille",
    description:
      "Deux personnes. Une très bonne raison d’ouvrir quelque chose de sérieux.",
  },
  {
    id: "vibe_another_glass",
    slug: "encore-un-verre",
    title: "Encore un verre?",
    description:
      "La question est surtout rhétorique.",
  },
  {
    id: "vibe_what_do_we_open",
    slug: "on-ouvre-quoi",
    title: "On ouvre quoi?",
    description:
      "Le classique. Personne ne sait. Tout le monde a une opinion.",
  },
];

export const VIBE_CATALOG_BY_ID = new Map(
  VIBE_CATALOG.map((vibe) => [vibe.id, vibe])
);

export const VIBE_CATALOG_BY_SLUG = new Map(
  VIBE_CATALOG.map((vibe) => [vibe.slug, vibe])
);
