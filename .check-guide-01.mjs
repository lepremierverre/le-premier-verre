import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "czq6bjyu",
  dataset: "production",
  apiVersion: "2025-08-15",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
});



let n = 0;
const key = (prefix = "b") =>
  `${prefix}${String(++n).padStart(3, "0")}`;

function block(text, style = "normal") {
  return {
    _type: "block",
    _key: key(),
    style,
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: key("s"),
        text,
        marks: [],
      },
    ],
  };
}

const p = (text) => block(text);
const h2 = (text) => block(text, "h2");

function guideTable({
  title,
  titleEn,
  columns,
  rows,
}) {
  return {
    _type: "guideTable",
    _key: key("table"),
    title,
    titleEn,
    columns: columns.map(([label, labelEn]) => ({
      _type: "guideTableColumn",
      _key: key("col"),
      label,
      labelEn,
    })),
    rows: rows.map((cells) => ({
      _type: "guideTableRow",
      _key: key("row"),
      cells: cells.map(([text, textEn]) => ({
        _type: "guideTableCell",
        _key: key("cell"),
        text,
        textEn,
      })),
    })),
  };
}

function cloneWithFreshKeys(value) {
  if (Array.isArray(value)) {
    return value.map(cloneWithFreshKeys);
  }

  if (value && typeof value === "object") {
    const clone = {};

    for (const [name, item] of Object.entries(value)) {
      clone[name] = name === "_key"
        ? key("clone")
        : cloneWithFreshKeys(item);
    }

    return clone;
  }

  return value;
}

function guideChecklist({
  title,
  titleEn,
  groups,
}) {
  return {
    _type: "guideChecklist",
    _key: key("check"),
    title,
    titleEn,
    groups: groups.map(({ label, labelEn, items }) => ({
      _type: "guideChecklistGroup",
      _key: key("group"),
      label,
      labelEn,
      items: items.map(([text, textEn]) => ({
        _type: "guideChecklistItem",
        _key: key("item"),
        text,
        textEn,
      })),
    })),
  };
}

const content = [
  h2("Comment utiliser ce guide"),
  p("Commencez par le nombre de personnes qui boiront réellement du vin, puis regardez le menu et le niveau de variété souhaité. Le guide donne des estimations plutôt que des règles strictes. Une soirée où huit personnes prennent deux verres chacune ne demande évidemment pas la même quantité qu’une longue réception où le vin accompagne l’apéro, le repas et la fin de soirée."),
  p("L’idée est de vous permettre de faire vos achats rapidement. Une fois la formule choisie, vous pourrez ensuite remplacer les styles proposés par des bouteilles précises du répertoire du Premier Verre."),

  h2("1. Avant de faire les courses"),
  guideTable({
    title: "Les questions à se poser",
    titleEn: "Questions to ask yourself",
    columns: [
      ["Question", "Question"],
      ["Ce qu’il faut décider", "What to decide"],
    ],
    rows: [
      [
        ["Combien serons-nous?", "How many people will there be?"],
        ["Comptez séparément les personnes qui boiront du vin et celles qui n’en boiront pas.", "Count separately the people who will drink wine and those who will not."],
      ],
      [
        ["Quel type de soirée?", "What kind of gathering is it?"],
        ["Apéro seulement, souper, réception longue, buffet, brunch ou occasion spéciale.", "Aperitif only, dinner, a long gathering, buffet, brunch or special occasion."],
      ],
      [
        ["Quel est le menu?", "What is on the menu?"],
        ["Identifiez surtout si le repas est léger, riche, épicé, grillé, crémeux ou très varié.", "Focus on whether the meal is light, rich, spicy, grilled, creamy or very varied."],
      ],
      [
        ["Quelle place pour le vin?", "What role will wine play?"],
        ["Une présence discrète ou plusieurs bouteilles au fil de la soirée.", "A discreet presence or several bottles throughout the evening."],
      ],
      [
        ["Quel budget?", "What is the budget?"],
        ["Accessible, confortable ou occasion spéciale.", "Accessible, comfortable or special occasion."],
      ],
      [
        ["Quels autres choix?", "What other options?"],
        ["Eau, boissons sans alcool, bière ou cocktails, selon les invités.", "Water, alcohol-free drinks, beer or cocktails, depending on your guests."],
      ],
    ],
  }),
  p("Avant d’acheter, pensez aussi à ce que vous avez déjà à la maison. Une bouteille de bulles, un blanc polyvalent ou un rouge souple qui attend dans votre cave peut parfaitement devenir le point de départ de la soirée."),

  h2("2. Combien de bouteilles prévoir?"),
  p("Une bouteille de 750 ml donne environ cinq verres de service raisonnables. Pour une réception où le vin accompagne l’apéro et le repas, une bonne base consiste à prévoir environ une demi-bouteille par personne qui boit du vin. Il s’agit d’un point de départ et non d’une quantité à consommer."),
  guideTable({
    title: "Quantités de départ",
    titleEn: "Starting quantities",
    columns: [
      ["Personnes qui boivent", "People drinking wine"],
      ["Base simple", "Simple base"],
      ["Avec marge pour une soirée plus longue", "With extra for a longer evening"],
    ],
    rows: [
      [["2", "2"], ["1 bouteille", "1 bottle"], ["2 bouteilles", "2 bottles"]],
      [["4", "4"], ["2 bouteilles", "2 bottles"], ["2 à 3 bouteilles", "2 to 3 bottles"]],
      [["6", "6"], ["3 bouteilles", "3 bottles"], ["3 à 4 bouteilles", "3 to 4 bottles"]],
      [["8", "8"], ["4 bouteilles", "4 bottles"], ["5 bouteilles", "5 bottles"]],
      [["10", "10"], ["5 bouteilles", "5 bottles"], ["6 bouteilles", "6 bottles"]],
      [["12", "12"], ["6 bouteilles", "6 bottles"], ["7 bouteilles", "7 bottles"]],
      [["16", "16"], ["8 bouteilles", "8 bottles"], ["9 à 10 bouteilles", "9 to 10 bottles"]],
    ],
  }),
  p("Si plusieurs invités boivent peu, si le repas est très copieux ou si d’autres boissons sont servies, réduisez la quantité. Si la soirée commence tôt et se termine tard, prévoyez une bouteille supplémentaire. Une bouteille de réserve est généralement plus utile que plusieurs bouteilles ouvertes en même temps."),

  h2("3. Quelle répartition entre blanc, rouge et bulles?"),
  guideTable({
    title: "Répartition de départ",
    titleEn: "Starting mix",
    columns: [
      ["Type de réception", "Type of gathering"],
      ["Répartition de départ", "Starting mix"],
    ],
    rows: [
      [
        ["Apéro + repas léger", "Aperitif + light meal"],
        ["Bulles + majorité de blancs + 1 rouge au besoin", "Sparkling + mostly whites + 1 red if needed"],
      ],
      [
        ["Souper équilibré", "Balanced dinner"],
        ["1 bouteille de bulles, puis blancs et rouges selon le menu", "1 bottle of sparkling, then whites and reds according to the menu"],
      ],
      [
        ["Repas de viande", "Meat-based meal"],
        ["1 blanc pour l’entrée ou l’apéro + majorité de rouges", "1 white for the starter or aperitif + mostly reds"],
      ],
      [
        ["Repas de poisson ou fruits de mer", "Fish or seafood meal"],
        ["Bulles et blancs en majorité", "Mostly sparkling and whites"],
      ],
      [
        ["Menu très varié", "Very varied menu"],
        ["Blanc polyvalent + rouge souple + bulles", "Versatile white + supple red + sparkling"],
      ],
      [
        ["Groupe aux goûts inconnus", "Guests with unknown preferences"],
        ["Au moins un blanc et un rouge, avec bulles si le nombre le justifie", "At least one white and one red, with sparkling if the group size justifies it"],
      ],
    ],
  }),
  p("La répartition n’a pas besoin d’être égale. Si vos invités boivent surtout du blanc, achetez davantage de blanc. Le meilleur calcul est celui qui correspond aux personnes réellement présentes."),

  h2("4. Trois budgets pour une même réception"),
  p("Le budget ci-dessous sert de repère pour construire votre sélection. Les prix réels des bouteilles peuvent varier selon le millésime et la disponibilité."),
  guideTable({
    title: "Trois niveaux de budget",
    titleEn: "Three budget levels",
    columns: [
      ["Niveau", "Level"],
      ["4 personnes", "4 people"],
      ["8 personnes", "8 people"],
      ["12 personnes", "12 people"],
    ],
    rows: [
      [
        ["Accessible", "Accessible"],
        ["≈ 40–50 $", "≈ $40–50"],
        ["≈ 80–100 $", "≈ $80–100"],
        ["≈ 120–150 $", "≈ $120–150"],
      ],
      [
        ["Confortable", "Comfortable"],
        ["≈ 55–75 $", "≈ $55–75"],
        ["≈ 110–150 $", "≈ $110–150"],
        ["≈ 165–225 $", "≈ $165–225"],
      ],
      [
        ["Occasion spéciale", "Special occasion"],
        ["≈ 80–110 $", "≈ $80–110"],
        ["≈ 150–210 $", "≈ $150–210"],
        ["≈ 225–315 $", "≈ $225–315"],
      ],
    ],
  }),
  p("Le budget n’a pas à être réparti uniformément. Une réception peut très bien combiner trois bouteilles accessibles et une bouteille un peu plus spéciale. Cela permet de garder la facture raisonnable tout en donnant à la soirée un petit quelque chose de particulier."),

  h2("5. Construire son apéro"),
  p("Pour l’arrivée des invités, privilégiez un vin frais et facile à servir. Les bulles sont une option naturelle, mais un blanc frais ou un rosé sec peuvent tout aussi bien faire le travail."),
  p("Pour quatre à six personnes, une bouteille peut suffire pour commencer. Pour un groupe de huit à douze personnes, deux bouteilles permettent de ne pas interrompre l’apéro dès le premier verre. Si le vin de l’apéro doit continuer avec l’entrée, choisissez-le en conséquence."),
  guideTable({
    title: "Quoi servir à l’apéro",
    titleEn: "What to serve for the aperitif",
    columns: [
      ["Bouchées", "Food"],
      ["Styles à regarder", "Styles to consider"],
    ],
    rows: [
      [["Olives, noix, chips, crudités", "Olives, nuts, chips, raw vegetables"], ["Bulles, blanc frais, rosé sec", "Sparkling, fresh white, dry rosé"]],
      [["Charcuteries", "Charcuterie"], ["Bulles, rosé sec, rouge léger", "Sparkling, dry rosé, light red"]],
      [["Fromages frais", "Fresh cheeses"], ["Bulles, blanc frais", "Sparkling, fresh white"]],
      [["Tartinades et houmous", "Spreads and hummus"], ["Blanc frais, rosé sec", "Fresh white, dry rosé"]],
      [["Crevettes et fruits de mer", "Shrimp and seafood"], ["Bulles ou blanc frais", "Sparkling or fresh white"]],
      [["Bouchées plus riches", "Richer bites"], ["Blanc texturé ou bulles", "Textured white or sparkling"]],
    ],
  }),

  h2("6. Entrée et plat principal"),
  p("Ne changez pas automatiquement de bouteille entre l’apéro et l’entrée. Si le premier vin fonctionne encore, gardez-le. Cela réduit le nombre de bouteilles nécessaires et simplifie énormément le service."),
  guideTable({
    title: "Choisir selon le menu",
    titleEn: "Choosing according to the menu",
    columns: [
      ["Menu", "Menu"],
      ["Option polyvalente", "Versatile option"],
      ["Si le plat est plus riche", "If the dish is richer"],
    ],
    rows: [
      [["Poisson", "Fish"], ["Blanc frais", "Fresh white"], ["Blanc plus texturé", "More textured white"]],
      [["Fruits de mer", "Seafood"], ["Blanc frais ou bulles", "Fresh white or sparkling"], ["Blanc texturé", "Textured white"]],
      [["Volaille", "Poultry"], ["Blanc ou rouge souple", "White or supple red"], ["Blanc plus ample ou rouge léger", "Fuller white or light red"]],
      [["Pâtes tomate", "Tomato pasta"], ["Rouge frais", "Fresh red"], ["Rouge moyennement structuré", "Moderately structured red"]],
      [["Pâtes crémeuses", "Creamy pasta"], ["Blanc texturé", "Textured white"], ["Blanc plus ample", "Fuller white"]],
      [["Légumes grillés", "Grilled vegetables"], ["Rosé ou rouge souple", "Rosé or supple red"], ["Rouge moyennement structuré", "Moderately structured red"]],
      [["Viande grillée", "Grilled meat"], ["Rouge souple", "Supple red"], ["Rouge plus structuré", "More structured red"]],
      [["Menu buffet", "Buffet"], ["Blanc polyvalent + rouge souple", "Versatile white + supple red"], ["Ajouter des bulles si désiré", "Add sparkling if desired"]],
    ],
  }),
];

const contentEn = [
  h2("How to use this guide"),
  p("Start with the number of people who will actually drink wine, then consider the menu and how much variety you want. This guide offers estimates rather than strict rules. An evening where eight people have two glasses each obviously does not require the same amount as a long gathering where wine accompanies the aperitif, dinner and the rest of the evening."),
  p("The idea is to help you shop quickly. Once you have chosen a formula, you can replace the suggested styles with specific bottles from the Le Premier Verre directory."),

  h2("1. Before you shop"),
  cloneWithFreshKeys(content[3]),

  p("Before buying anything, also think about what you already have at home. A bottle of sparkling wine, a versatile white or a supple red waiting in your cellar can easily become the starting point for the evening."),

  h2("2. How many bottles should you plan for?"),
  p("A 750 ml bottle gives roughly five reasonable servings. For a gathering where wine accompanies the aperitif and the meal, a useful starting point is about half a bottle per person who drinks wine. This is a planning estimate, not an amount anyone is expected to drink."),
  cloneWithFreshKeys(content[7]),
  p("If several guests drink very little, the meal is particularly substantial or other drinks are being served, reduce the amount. If the evening starts early and ends late, plan for one extra bottle. A reserve bottle is generally more useful than having several bottles open at the same time."),

  h2("3. How should you divide whites, reds and sparkling?"),
  cloneWithFreshKeys(content[11]),
  p("The split does not need to be equal. If your guests mostly drink white, buy more white. The best calculation is the one that reflects the people who will actually be there."),

  h2("4. Three budgets for the same gathering"),
  p("The budgets below are a guide for building your selection. Actual bottle prices may vary depending on vintage and availability."),
  cloneWithFreshKeys(content[15]),
  p("The budget does not need to be divided evenly. A gathering can easily combine three accessible bottles with one slightly more special bottle. This keeps the total reasonable while still giving the evening something a little distinctive."),

  h2("5. Building the aperitif"),
  p("When guests arrive, choose a wine that is fresh and easy to serve. Sparkling is a natural option, but a fresh white or dry rosé can work just as well."),
  p("For four to six people, one bottle may be enough to get started. For a group of eight to twelve, two bottles keep the aperitif from being interrupted after the first glass. If the aperitif wine will continue with the starter, choose it accordingly."),
  cloneWithFreshKeys(content[21]),

  h2("6. Starter and main course"),
  p("Do not automatically change bottles between the aperitif and the starter. If the first wine still works, keep serving it. This reduces the number of bottles needed and makes service much simpler."),
  cloneWithFreshKeys(content[25]),
];

const contentPart2 = [
  h2("7. Trois scénarios de menus"),

  p("Scénario A — Souper simple pour 4"),
  p("Apéro avec olives, fromage et pain, suivi d’une volaille rôtie avec légumes et pommes de terre. Une bouteille de bulles ou de blanc peut commencer la soirée, puis un rouge souple peut accompagner le repas. Deux bouteilles suffisent généralement."),
  p("Formule d’achat : 1 bouteille pour l’apéro et l’entrée, 1 bouteille pour le repas. Si les invités boivent peu, la deuxième bouteille peut rester fermée."),

  p("Scénario B — Souper pour 8"),
  p("Apéro avec bouchées, entrée légère, plat principal et fromage. Quatre bouteilles constituent une bonne base. Une formule simple consiste à prévoir une bouteille de bulles, une ou deux bouteilles de blanc et deux rouges. Si le repas est principalement composé de poisson ou de fruits de mer, inversez la proportion."),
  p("Formule d’achat : 4 bouteilles de base, avec une cinquième en réserve si la soirée doit être longue."),

  p("Scénario C — Grande réception pour 12"),
  p("Pour douze personnes, prévoyez davantage de variété et une petite marge. Une formule possible est une bouteille de bulles, deux blancs, trois rouges et une bouteille de réserve. Cette réserve n’a pas nécessairement besoin d’être ouverte. Elle sert surtout à éviter de se retrouver sans rien si la soirée se prolonge."),
  p("Pour un buffet où les plats sont nombreux et les préférences difficiles à prévoir, cette formule est particulièrement pratique."),

  h2("8. Fromage et dessert"),
  p("Le fromage peut être traité comme une continuité du repas. Si vous avez déjà un rouge souple ou un blanc suffisamment texturé, il n’est généralement pas nécessaire d’ouvrir une nouvelle bouteille uniquement pour la planche."),
  p("Pour le dessert, demandez-vous d’abord si le vin est réellement souhaité. Un café ou un thé peut parfaitement terminer le repas. Si vous servez un vin, pensez au sucre. Un dessert très sucré demande généralement un vin qui possède lui aussi suffisamment de douceur."),
  guideTable({
    title: "Que servir avec le dessert",
    titleEn: "What to serve with dessert",
    columns: [
      ["Dessert", "Dessert"],
      ["Piste générale", "General direction"],
    ],
    rows: [
      [
        ["Fruits frais ou tarte légère", "Fresh fruit or light tart"],
        ["Bulles ou vin légèrement doux", "Sparkling or slightly sweet wine"],
      ],
      [
        ["Dessert crémeux", "Creamy dessert"],
        ["Vin doux ou moelleux selon le dessert", "Sweet wine depending on the dessert"],
      ],
      [
        ["Chocolat", "Chocolate"],
        ["Vin plus riche et doux", "Richer, sweeter wine"],
      ],
      [
        ["Dessert très sucré", "Very sweet dessert"],
        ["Éviter un vin nettement moins sucré que le dessert", "Avoid a wine that is noticeably less sweet than the dessert"],
      ],
    ],
  }),

  h2("9. Quand on ne connaît pas les goûts des invités"),
  p("Ne cherchez pas à deviner le vin préféré de chacun. Cherchez plutôt à couvrir les grandes préférences avec quelques styles faciles à partager."),
  guideTable({
    title: "Les essentiels",
    titleEn: "The essentials",
    columns: [
      ["À avoir", "What to have"],
      ["Pourquoi", "Why"],
    ],
    rows: [
      [
        ["1 blanc frais", "1 fresh white"],
        ["Option rassurante pour ceux qui préfèrent les blancs.", "A reliable option for guests who prefer white wine."],
      ],
      [
        ["1 rouge souple", "1 supple red"],
        ["Option rouge accessible sans être trop puissant.", "An approachable red option without being too powerful."],
      ],
      [
        ["Bulles", "Sparkling"],
        ["Très polyvalentes et faciles à servir à l’arrivée.", "Very versatile and easy to serve when guests arrive."],
      ],
      [
        ["Eau et option sans alcool", "Water and an alcohol-free option"],
        ["Permettent à chacun de participer à son rythme.", "Allow everyone to take part at their own pace."],
      ],
    ],
  }),
  p("Si vous pouvez poser une question avant la soirée, gardez-la simple. « Tu bois plutôt blanc, rouge ou les deux? » suffit. Il n’est pas nécessaire de transformer la préparation du souper en questionnaire de dégustation."),

  h2("10. Ordre de service"),
  guideTable({
    title: "Du premier verre au dessert",
    titleEn: "From the first glass to dessert",
    columns: [
      ["Étape", "Stage"],
      ["Action", "What to do"],
    ],
    rows: [
      [["Arrivée", "Arrival"], ["Bulles, blanc frais ou rosé.", "Sparkling, fresh white or rosé."]],
      [["Entrée", "Starter"], ["Conserver le vin de l’apéro si le plat s’y prête.", "Keep serving the aperitif wine if it works with the dish."]],
      [["Plat principal", "Main course"], ["Passer au blanc plus ample ou au rouge selon le menu.", "Move to a fuller white or a red depending on the menu."]],
      [["Fromage", "Cheese"], ["Continuer le vin du repas lorsque possible.", "Continue with the wine from the meal whenever possible."]],
      [["Dessert", "Dessert"], ["Vin doux si souhaité, sinon café ou thé.", "Sweet wine if desired, otherwise coffee or tea."]],
    ],
  }),
  p("Le principe général est de commencer par les vins plus légers et frais et de progresser vers les vins plus riches ou structurés. Ce principe est souple. Si les invités veulent continuer avec le même blanc pendant tout le repas, laissez-les faire."),

  h2("11. Températures et refroidissement"),
  guideTable({
    title: "Repères pratiques",
    titleEn: "Practical guidelines",
    columns: [
      ["Vin", "Wine"],
      ["Repère pratique", "Practical guideline"],
    ],
    rows: [
      [["Bulles", "Sparkling"], ["Bien frais.", "Well chilled."]],
      [["Blanc léger", "Light white"], ["Frais.", "Chilled."]],
      [["Blanc plus riche", "Richer white"], ["Frais, mais pas glacé.", "Chilled, but not ice-cold."]],
      [["Rosé", "Rosé"], ["Frais.", "Chilled."]],
      [["Rouge léger", "Light red"], ["Légèrement rafraîchi si la pièce est chaude.", "Slightly chilled if the room is warm."]],
      [["Rouge plus structuré", "More structured red"], ["Température fraîche de la pièce, sans chaleur excessive.", "A cool room temperature, without excessive warmth."]],
    ],
  }),
  p("Le réfrigérateur suffit pour préparer les bouteilles à l’avance. Pour refroidir rapidement une bouteille, utilisez un seau avec de la glace et de l’eau. Une bouteille qui reste sur la table peut retourner dans le seau dès que nécessaire."),
  p("La température exacte est moins importante que le fait d’éviter les extrêmes. Un blanc trop chaud paraît souvent lourd et un rouge trop chaud peut sembler plus alcoolisé et moins équilibré."),

  h2("12. Verrerie, eau et service"),
  p("Pour une réception simple, vous n’avez pas besoin de quatre verres différents par personne. Un verre polyvalent par invité peut suffire. Si vous servez plusieurs styles, un deuxième verre peut être pratique, mais il n’est pas obligatoire."),
  p("L’eau devrait être installée sur la table avant l’arrivée des invités. Cela facilite le service et évite de devoir interrompre les conversations pour remplir les verres. Une carafe ou plusieurs bouteilles d’eau accessibles font très bien l’affaire."),
  p("Le vin peut être ouvert au fur et à mesure. Il n’est pas nécessaire de déboucher toutes les bouteilles avant l’arrivée des invités."),
];

content.push(...contentPart2);

const contentEnPart2 = [
  h2("7. Three menu scenarios"),

  p("Scenario A — Simple dinner for 4"),
  p("Start with olives, cheese and bread for the aperitif, followed by roast poultry with vegetables and potatoes. A bottle of sparkling or white can start the evening, followed by a supple red with the meal. Two bottles are generally enough."),
  p("Shopping formula: 1 bottle for the aperitif and starter, 1 bottle for the meal. If your guests drink very little, the second bottle can stay closed."),

  p("Scenario B — Dinner for 8"),
  p("Aperitif bites, a light starter, main course and cheese. Four bottles make a good base. A simple formula is one bottle of sparkling, one or two whites and two reds. If the meal is mainly fish or seafood, reverse the proportions."),
  p("Shopping formula: 4 base bottles, with a fifth in reserve if the evening is expected to run long."),

  p("Scenario C — Large gathering for 12"),
  p("For twelve people, plan for more variety and a little extra. One possible formula is one bottle of sparkling, two whites, three reds and one reserve bottle. The reserve does not necessarily need to be opened. Its main purpose is to make sure you do not run out if the evening continues."),
  p("For a buffet with many dishes and preferences that are difficult to predict, this formula is particularly practical."),

  h2("8. Cheese and dessert"),
  p("Cheese can be treated as a continuation of the meal. If you already have a supple red or a sufficiently textured white, there is generally no need to open a new bottle solely for the cheese board."),
  p("For dessert, first ask whether wine is actually wanted. Coffee or tea can end the meal perfectly well. If you do serve wine, think about sweetness. A very sweet dessert generally calls for a wine with enough sweetness of its own."),
  cloneWithFreshKeys(contentPart2[12]),

  h2("9. When you do not know your guests’ preferences"),
  p("Do not try to guess everyone’s favourite wine. Instead, cover the main preferences with a few styles that are easy to share."),
  cloneWithFreshKeys(contentPart2[15]),
  p("If you can ask one question before the evening, keep it simple. “Do you usually drink white, red or both?” is enough. There is no need to turn dinner preparation into a tasting questionnaire."),

  h2("10. Order of service"),
  cloneWithFreshKeys(contentPart2[19]),
  p("The general idea is to begin with lighter, fresher wines and move toward richer or more structured wines. This is flexible. If your guests want to keep drinking the same white throughout the meal, let them."),

  h2("11. Temperatures and chilling"),
  cloneWithFreshKeys(contentPart2[22]),
  p("The refrigerator is enough to prepare bottles in advance. To chill a bottle quickly, use a bucket with ice and water. A bottle sitting on the table can go back into the bucket whenever necessary."),
  p("The exact temperature matters less than avoiding extremes. A white served too warm can seem heavy, while a red served too warm may seem more alcoholic and less balanced."),

  h2("12. Glassware, water and service"),
  p("For a simple gathering, you do not need four different glasses per person. One versatile wine glass for each guest can be enough. If you are serving several styles, a second glass can be useful, but it is not essential."),
  p("Water should be on the table before guests arrive. This makes service easier and avoids interrupting conversations to refill glasses. A carafe or several accessible bottles of water work perfectly well."),
  p("Wine can be opened gradually as the evening unfolds. There is no need to uncork every bottle before your guests arrive."),
];

contentEn.push(...contentEnPart2);

const contentPart3 = [
  h2("13. Liste de courses type pour 8 personnes"),
  guideTable({
    title: "Une base simple pour 8",
    titleEn: "A simple base for 8",
    columns: [
      ["À acheter", "What to buy"],
      ["Quantité", "Quantity"],
      ["Utilisation", "Use"],
    ],
    rows: [
      [["Bulles", "Sparkling"], ["1 bouteille", "1 bottle"], ["Accueil et apéro", "Arrival and aperitif"]],
      [["Blanc polyvalent", "Versatile white"], ["1 à 2 bouteilles", "1 to 2 bottles"], ["Apéro, entrée et repas", "Aperitif, starter and meal"]],
      [["Rouge souple", "Supple red"], ["2 bouteilles", "2 bottles"], ["Plat principal et fromage", "Main course and cheese"]],
      [["Bouteille de réserve", "Reserve bottle"], ["1 au besoin", "1 if needed"], ["Soirée longue ou préférences du groupe", "Long evening or group preferences"]],
      [["Eau", "Water"], ["En quantité", "Plenty"], ["Table et service", "Table and service"]],
      [["Boisson sans alcool", "Alcohol-free drink"], ["Selon le groupe", "According to the group"], ["Alternative pour les invités", "Alternative for guests"]],
    ],
  }),

  h2("14. Planification sans stress"),
  guideTable({
    title: "Le déroulement",
    titleEn: "The timeline",
    columns: [
      ["Quand", "When"],
      ["À faire", "What to do"],
    ],
    rows: [
      [["La veille", "The day before"], ["Confirmer le nombre d’invités, choisir les bouteilles, vérifier le menu, mettre les blancs et bulles au frais.", "Confirm the number of guests, choose the bottles, check the menu and chill the whites and sparkling wines."]],
      [["Le matin", "That morning"], ["Vérifier la quantité totale, préparer la table, les verres et l’eau. Prévoir le seau à glace.", "Check the total quantity, prepare the table, glasses and water. Have an ice bucket ready."]],
      [["2 heures avant", "2 hours before"], ["Terminer la préparation du repas, vérifier les températures et sortir les bouteilles qui doivent être accessibles.", "Finish preparing the meal, check temperatures and set out the bottles that need to be accessible."]],
      [["1 heure avant", "1 hour before"], ["Préparer l’apéro, placer l’eau et les boissons sans alcool et organiser les bouteilles dans l’ordre prévu.", "Prepare the aperitif, set out water and alcohol-free drinks and organize the bottles in the planned order."]],
      [["À l’arrivée", "When guests arrive"], ["Servir une première bouteille fraîche et laisser les invités s’installer.", "Serve the first chilled bottle and let guests settle in."]],
      [["Pendant le repas", "During the meal"], ["Ouvrir les bouteilles progressivement selon les besoins.", "Open bottles gradually as needed."]],
      [["Fin de soirée", "End of the evening"], ["Boucher et conserver les bouteilles ouvertes qui peuvent l’être plutôt que de les laisser sur la table.", "Recork and store open bottles that can be kept rather than leaving them on the table."]],
    ],
  }),

  h2("15. Plan B si le menu change"),
  p("Un invité apporte finalement un plat, une recette ne fonctionne pas ou le repas est remplacé par une commande de dernière minute. Le meilleur plan B est d’avoir au moins une bouteille blanche et une bouteille rouge qui peuvent accompagner plusieurs styles de nourriture."),
  p("Si le menu devient très varié, servez d’abord le vin le plus polyvalent. Ne cherchez pas à réorganiser toute la soirée autour du nouvel aliment arrivé sur la table. Le but du guide est précisément de vous permettre de rester flexible."),

  h2("16. Les cinq formules LPV à retenir"),
  guideTable({
    title: "Les formules",
    titleEn: "The formulas",
    columns: [
      ["Formule", "Formula"],
      ["Base", "Base"],
    ],
    rows: [
      [["4 personnes", "4 people"], ["2 bouteilles pour un souper normal.", "2 bottles for a typical dinner."]],
      [["8 personnes", "8 people"], ["4 bouteilles, avec une cinquième en réserve si la soirée se prolonge.", "4 bottles, with a fifth in reserve if the evening runs long."]],
      [["12 personnes", "12 people"], ["6 bouteilles, avec une septième en réserve selon le groupe.", "6 bottles, with a seventh in reserve depending on the group."]],
      [["Goûts inconnus", "Unknown preferences"], ["Bulles + blanc frais + rouge souple.", "Sparkling + fresh white + supple red."]],
      [["Budget serré", "Tight budget"], ["Moins de variété, mais des bouteilles polyvalentes et faciles à partager.", "Less variety, but versatile bottles that are easy to share."]],
    ],
  }),

  h2("17. Des bouteilles choisies selon le contexte"),
  p("Les bouteilles les plus utiles pour recevoir ne sont pas simplement une liste de produits. Elles dépendent du nombre d’invités, du budget, du menu et du rôle que le vin doit jouer pendant la soirée. Le répertoire du Premier Verre permet de passer de ces repères à des bouteilles précises en privilégiant la polyvalence et la facilité de partage."),
  guideTable({
    title: "Construire sa sélection",
    titleEn: "Building your selection",
    columns: [
      ["Situation", "Situation"],
      ["Nombre de vins à regarder", "Number of wines to consider"],
      ["Priorité", "Priority"],
    ],
    rows: [
      [["Passe-partout pour recevoir", "Versatile bottles for hosting"], ["6 vins", "6 wines"], ["Polyvalence et facilité de partage.", "Versatility and ease of sharing."]],
      [["Recevoir 4 personnes", "Hosting 4 people"], ["2 à 3 vins", "2 to 3 wines"], ["Petite facture et simplicité.", "A modest bill and simplicity."]],
      [["Recevoir 8 personnes", "Hosting 8 people"], ["4 à 5 vins", "4 to 5 wines"], ["Variété blanc, rouge et bulles.", "A mix of white, red and sparkling."]],
      [["Recevoir 12 personnes", "Hosting 12 people"], ["5 à 7 vins", "5 to 7 wines"], ["Choix plus large et bouteille de réserve.", "A wider selection and a reserve bottle."]],
      [["Quand on ne connaît pas les goûts", "When preferences are unknown"], ["4 à 6 vins", "4 to 6 wines"], ["Styles accessibles et peu polarisants.", "Approachable styles that are unlikely to be polarizing."]],
      [["Petit budget", "Small budget"], ["5 à 6 vins", "5 to 6 wines"], ["Prix raisonnable et grande polyvalence.", "Reasonable prices and strong versatility."]],
      [["Occasion spéciale", "Special occasion"], ["5 à 6 vins", "5 to 6 wines"], ["Une ou deux bouteilles plus festives.", "One or two more festive bottles."]],
    ],
  }),

  h2("18. Checklist finale"),
  guideChecklist({
    title: "Avant, pendant, profitez",
    titleEn: "Before, during, enjoy",
    groups: [
      {
        label: "Avant de partir acheter",
        labelEn: "Before shopping",
        items: [
          ["Nombre d’invités confirmé", "Number of guests confirmed"],
          ["Nombre de personnes qui boivent", "Number of people drinking wine"],
          ["Menu choisi", "Menu chosen"],
          ["Budget fixé", "Budget set"],
          ["Bouteilles choisies", "Bottles chosen"],
        ],
      },
      {
        label: "Avant l’arrivée",
        labelEn: "Before guests arrive",
        items: [
          ["Blancs et bulles au frais", "Whites and sparkling chilled"],
          ["Verres prêts", "Glasses ready"],
          ["Glace et seau prêts", "Ice and bucket ready"],
          ["Option sans alcool prévue", "Alcohol-free option planned"],
          ["Apéro préparé", "Aperitif prepared"],
        ],
      },
      {
        label: "Pendant la soirée",
        labelEn: "During the evening",
        items: [
          ["Eau accessible", "Water accessible"],
          ["Bouteilles ouvertes progressivement", "Bottles opened gradually"],
          ["Température surveillée", "Temperature kept in check"],
          ["Pas besoin de changer de vin à chaque plat", "No need to change wine with every course"],
          ["Réserve conservée pour la suite", "Reserve kept for later"],
        ],
      },
    ],
  }),

  h2("Ce qu’il faut retenir"),
  p("Pour bien recevoir, commencez par les personnes et le repas, pas par les bouteilles. Prévoyez environ une demi-bouteille par personne qui boit du vin pour une réception normale, gardez une marge lorsque la soirée sera longue et choisissez des styles qui peuvent traverser plusieurs moments du repas."),
  p("Le reste peut être simple. Un vin frais à l’arrivée, une bouteille qui accompagne bien le repas, de l’eau sur la table et assez de temps pour profiter de ses invités. C’est déjà une très bonne façon de recevoir."),
];

content.push(...contentPart3);

const contentEnPart3 = [
  h2("13. Sample shopping list for 8 people"),
  cloneWithFreshKeys(contentPart3[1]),

  h2("14. Stress-free planning"),
  cloneWithFreshKeys(contentPart3[3]),

  h2("15. Plan B if the menu changes"),
  p("A guest unexpectedly brings a dish, a recipe does not work out or dinner is replaced by a last-minute order. The best plan B is to have at least one white and one red that can work with several styles of food."),
  p("If the menu becomes very varied, serve the most versatile wine first. Do not try to reorganize the entire evening around the new food that has appeared on the table. The purpose of this guide is precisely to help you stay flexible."),

  h2("16. Five LPV formulas to remember"),
  cloneWithFreshKeys(contentPart3[8]),

  h2("17. Bottles chosen for the occasion"),
  p("The most useful bottles for hosting are not simply a list of products. They depend on the number of guests, the budget, the menu and the role wine will play during the evening. The Le Premier Verre directory lets you move from these guidelines to specific bottles while prioritizing versatility and ease of sharing."),
  cloneWithFreshKeys(contentPart3[11]),

  h2("18. Final checklist"),
  cloneWithFreshKeys(contentPart3[13]),

  h2("What to remember"),
  p("To host well, start with the people and the meal, not the bottles. Plan on roughly half a bottle per person who drinks wine for a typical gathering, leave some extra room when the evening will be long and choose styles that can carry through several moments of the meal."),
  p("The rest can stay simple. A fresh wine when guests arrive, a bottle that works well with the meal, water on the table and enough time to enjoy your guests. That is already a very good way to host."),
];

contentEn.push(...contentEnPart3);

const guide = {
  _id: "guide-01-recevoir",
  _type: "guide",

  title: "Combien de bouteilles prévoir pour recevoir?",
  titleEn: "How Many Bottles Do You Need for a Dinner Party?",

  slug: {
    _type: "slug",
    current: "combien-de-bouteilles-prevoir-pour-recevoir",
  },

  excerpt:
    "Le guide pratique pour choisir les bouteilles, calculer les quantités et organiser le vin du début à la fin du repas.",
  excerptEn:
    "A practical guide to choosing bottles, planning quantities and organizing wine from the first glass to the end of the meal.",

  guideType: "practical",
  difficulty: "beginner",

  estimatedReadingTime: 10,
  estimatedReadingTimeEn: 10,

  content,
  contentEn,

  published: true,
  publishedAt: new Date().toISOString(),

  seoTitle:
    "Combien de bouteilles prévoir pour recevoir? | Le Premier Verre",
  seoTitleEn:
    "How Many Bottles Do You Need for a Dinner Party? | Le Premier Verre",

  seoDescription:
    "Combien de bouteilles prévoir pour recevoir? Quantités, budget, blancs, rouges, bulles, service et conseils pratiques pour 4, 8 ou 12 personnes.",
  seoDescriptionEn:
    "How many bottles do you need for a dinner party? Plan quantities, budget, whites, reds, sparkling wine and service for 4, 8 or 12 guests.",
};


console.log("\n--- CONTRÔLE STRUCTUREL ---");

for (const [name, arr] of [
  ["content", content],
  ["contentEn", contentEn],
]) {
  const invalid = arr
    .map((item, i) => ({ i, type: item?._type }))
    .filter(({ type }) => !["block", "guideTable", "guideChecklist"].includes(type));

  console.log(name, ":", arr.length, "blocs");
  console.log("  tables :", arr.filter(x => x?._type === "guideTable").length);
  console.log("  checklists :", arr.filter(x => x?._type === "guideChecklist").length);
  console.log("  invalides :", invalid);
}

console.log("\nObjets structurés EN :");
contentEn.forEach((item, i) => {
  if (item?._type === "guideTable" || item?._type === "guideChecklist") {
    console.log(i, item._type, "→", item.titleEn || item.title);
  }
});

process.exit(0);

const existing = await client.getDocument(guide._id);


if (existing) {
  await client
    .patch(guide._id)
    .set(guide)
    .commit();

  console.log(`Guide 01 mis à jour: ${guide._id}`);
} else {
  await client.create(guide);
  console.log(`Guide 01 créé: ${guide._id}`);
}

console.log(`Blocs FR: ${content.length}`);
console.log(`Blocs EN: ${contentEn.length}`);
console.log("Guide 01 FR + EN prêt.");
