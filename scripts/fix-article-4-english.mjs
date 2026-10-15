import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "czq6bjyu",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-08-15",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
});

const ARTICLE_ID = "article-recevoir-sans-se-compliquer-la-vie";

const headings = [
  "Hosting should be simple",
  "Start with the aperitif",
  "The starter doesn't need a completely different wine",
  "For the meal, think about style before the perfect bottle",
  "Cheese can keep the same bottle going",
  "And dessert?",
  "How many bottles should you buy?",
  "The budget can stay reasonable",
  "When you don't know your guests' tastes",
  "The serving order is simpler than it seems",
  "Temperature matters more than fancy accessories",
  "What if the menu changes at the last minute?",
  "A few bottles can be enough for the whole evening",
  "Hosting, simply",
];

const paragraphs = [
  `There's a moment before almost every dinner when you look at the bottles on the counter and wonder if you chose the right ones. Is the white dry enough for the aperitif? Should you open the red now or wait for the main course? Will someone prefer the rosé? And that bottle you bought for dessert—will it really have a place?`,

  `You can also decide not to ask yourself all those questions.`,

  `Hosting people you care about shouldn't feel like a sommelier's test. Wine is there to accompany the meal, the conversation and the moment. It doesn't need to be perfectly matched to every bite to do its job. In fact, when you're hosting, the most useful bottle is often the one that doesn't demand too much attention.`,

  `That's especially true when you don't know everyone's tastes. There will always be someone who prefers white, someone who rarely drinks red, someone who likes fruitier wines and someone who will tell you they don't know anything about wine. That's not a problem to solve. It's simply a good reason to choose wines that are fresh, versatile and easy to share.`,

  `The idea isn't to build a miniature cellar every time friends come over for dinner. With a few well-chosen styles, you can cover an entire evening and save your energy for what really matters: being with your guests.`,

  `The aperitif is probably the easiest part of the evening when it comes to wine. The food isn't all on the table yet, conversations are starting, someone is snacking on olives while someone else arrives with a baguette under their arm. You want a bottle that invites the first glass, not one that needs an explanation.`,

  `Bubbles are an obvious fit here. They immediately make things feel festive and work just as well with salty snacks as they do with a charcuterie or cheese board. A fresh white works just as well and has the advantage of carrying through to the starter if the meal stays in the same vein.`,

  `A dry rosé can also be an excellent welcome bottle, especially in spring and summer. It pairs easily with grilled vegetables, spreads, salads, seafood and all the little bites that make their way around before dinner.`,

  `For an aperitif that's meant to last, plan on about one bottle for every four or five people who drink wine. That gives you enough to get started without opening the whole reserve before everyone even sits down.`,

  `This is where we sometimes make things more complicated than they need to be. We imagine we need one bottle for the aperitif, another for the starter and a third as soon as the main course arrives. But if the wine you served when everyone arrived works with the starter too, why change it?`,

  `A fresh white can easily accompany ceviche, shrimp, salad, roasted vegetables or a cheese-based starter. A dry rosé can do the same. If the starter is richer, with a creamy sauce, mushrooms or something gratinéed, simply choose a white with a little more texture.`,

  `The principle is much simpler than trying to find an exact pairing. Look for a wine that doesn't overpower the food and that you still want to drink. If the first bottle works across two courses, that's a good thing. A dinner doesn't need a new wine every time another plate reaches the table.`,

  `When the main course arrives, that's often when people start searching for the perfect wine. Instead, start with a much simpler question. Is the dish light, rich, spicy, grilled or braised?`,

  `With fish, seafood, poultry or a vegetarian dish, a fresh white remains a very versatile choice. With a creamier dish or roasted vegetables, a fuller white can be interesting. With grilled food, a roast, tomato sauce or a richer pasta dish, a supple or medium-bodied red can take over naturally.`,

  `That doesn't mean you need to rule out reds with fish or whites with meat. Quite the opposite. If your guests like white, there's no benefit in serving them a red simply because a pairing chart says you should. The meal is there to be enjoyed and the wine is there to be drunk.`,

  `It's also worth resisting the instinct to choose the most powerful wine for a rich dish. More full-bodied doesn't automatically mean better with generous food. A very oaky, tannic or concentrated wine can quickly take over. For an evening that lasts, a balanced, supple wine is often much more enjoyable.`,

  `Cheese is one of the easiest places to keep things simple. The same wine can accompany several cheeses, especially if you choose a fairly straightforward selection. Fresh whites work very well with many soft cheeses and goat cheeses, while a supple red can easily carry through to more aged cheeses.`,

  `You don't need a different bottle for every cheese on the board. If you're serving a small, varied selection, choose a versatile wine and let everyone taste. The combination that works best may be the one nobody expected.`,

  `That's actually a lovely way to host. Put things on the table and leave a little room for discovery.`,

  `Dessert is probably the course where it's easiest to decide not to serve wine at all. Coffee, tea or simply a glass of water can be a perfectly good way to end the meal. If you do want to continue with wine, the sweetness of the dessert is the first thing to consider.`,

  `A very sweet dessert can make a dry wine seem thin and harsh. In that case, an off-dry or sweet wine can be much more pleasant. With chocolate desserts, richer wines can also work well, depending on the style of the dessert.`,

  `But again, there's no need to add another bottle just because there's one last course. If everyone is happy around the table, the meal can end perfectly well without another glass.`,

  `To plan quantities, you mainly need to know how many people will actually drink wine and how long the evening is likely to last. A 750-millilitre bottle generally gives you about five reasonable glasses. It's not an absolute rule, but it's a useful starting point when you're shopping.`,

  `For four people who drink wine, two bottles can be enough for a relaxed dinner. For six people, three bottles give you a little more room. For eight people, four bottles usually let you offer two styles or keep a backup bottle. For ten or twelve people, simply increase the quantities while keeping the same basic approach.`,

  `It's often more enjoyable to plan for a little variety than to keep adding bottles. For eight people, for example, four bottles could be divided between two whites and two reds if the meal suits both. You could also replace one of them with bubbles to welcome your guests.`,

  `The most important thing is not to confuse having enough wine with an obligation to drink it. Some people will have one glass, others none at all. Water should always be easy to reach, and non-alcoholic options can absolutely be part of the evening. Planning generously doesn't mean you need to open everything.`,

  `Hosting several people can quickly become expensive if every bottle is chosen as though it needs to be the star of the meal. It doesn't.`,

  `For a relaxed evening, it's often more worthwhile to spread the budget across a few well-chosen bottles than to spend almost everything on one prestigious bottle. A versatile white, a supple red and some accessible bubbles can make for a much better evening than one exceptional bottle that everyone has to share.`,

  `The budget will of course depend on your habits and the occasion. For a small gathering, a few affordable bottles can do the job beautifully. For a larger celebration or a special meal, you can add one bottle that's a little more special without turning the whole selection into a splurge.`,

  `And if you already have a few bottles at home, start there. Having people over is a great opportunity to open a bottle you already like instead of automatically buying something new.`,

  `This is probably one of the easiest situations to handle once you stop trying to please everyone perfectly.`,

  `When you don't know your guests' preferences, it's better to avoid wines that tend to divide people. Choose a fresh white, a supple red and, if the number of guests justifies it, some bubbles. Those three styles already cover a lot of situations.`,

  `You can also ask one very simple question before dinner. Do you usually drink white, red or a bit of both? That's more than enough. There's no need to ask about their favourite grape, preferred region or ideal level of acidity.`,

  `And if nobody really knows how to answer, even better. That's exactly when versatile bottles make sense and everyone can simply discover what they like.`,

  `There isn't one correct way to serve wine at the table, but a fairly natural progression works for most evenings. In general, start with the freshest and lightest wines, then move toward richer or more structured ones.`,

  `That might mean starting with bubbles, moving on to a white and then serving a red with the main course. But if your white works throughout the meal and nobody is asking for red, there's no reason to change bottles just to follow a theoretical order.`,

  `It's also better to open bottles as you go. A bottle waiting in the fridge or somewhere cool can be opened when the first one is finished or when the meal changes direction. This helps keep the wine at a pleasant temperature and avoids ending up with several open bottles at once.`,

  `Wine doesn't require complicated staging, but temperature can make a real difference. Bubbles and whites are generally more enjoyable when they're properly chilled. A light or supple red can also benefit from a slight chill, especially if the room is warm.`,

  `You don't need a full set of special equipment. A bottle of white can stay in the refrigerator before dinner and go into an ice bucket if it needs to sit on the table for a while. For a red, even a few minutes in the fridge can sometimes make a noticeable difference.`,

  `Decanting is an option, not an obligation. Some wines benefit from it, while others don't need it at all. For an evening where the goal is to keep things simple, opening the bottle, serving it at a pleasant temperature and sitting down at the table is often all you need.`,

  `There's always someone who announces at the last minute that they're bringing a dish after all, someone who forgot to mention they don't eat meat or someone who decides to order pizza because nobody feels like cooking. That's exactly when versatile wines come in handy.`,

  `If the meal changes, start with the wine that adapts best. A fresh white can accompany far more dishes than you might think. A supple red can also work with a wide range of food. Bubbles can even carry an entire evening from the aperitif to small bites and on to the main course.`,

  `The best plan B is often the same as plan A. Keep a few balanced bottles around that are easy to share.`,

  `At its simplest, hosting with wine comes down to a few choices. One bottle to start, another to accompany the meal, and perhaps a third if the evening continues. Everything else can adapt to the people, the menu and the mood.`,

  `You can of course take things much further. Looking for a precise pairing, opening a rarer bottle, comparing two regions or introducing your guests to a grape variety can all be wonderful. But they're extra pleasures, not requirements for a successful evening.`,

  `The best bottle of the evening won't necessarily be the most expensive or the most complex. It may simply be the one that was still on the table when everyone poured themselves another glass and the conversation carried on an hour longer than expected.`,

  `Hosting without overcomplicating things means accepting that a meal doesn't need to be perfectly orchestrated to be successful. Wine can accompany the aperitif, follow everyone to the table, change when the meal calls for it or stay the same for several hours. There's no bell that rings between courses.`,

  `A fresh white, a supple red and some bubbles already go a long way. Add water on the table, something good to eat and enough room for the conversation to settle in.`,

  `The rest can wait.`,

  `Because in the end, if your guests leave talking about the dinner rather than the wine you should have chosen, you probably hosted them very well.`,
];

const article = await client.fetch(
  `*[_id == $id][0]{contentEn}`,
  { id: ARTICLE_ID }
);

if (!article?.contentEn) {
  throw new Error("Article 4 ou contentEn introuvable.");
}

const headingBlocks = article.contentEn.filter(
  (item) => item._type === "block" && item.style === "h2"
);

const paragraphBlocks = article.contentEn.filter(
  (item) => item._type === "block" && item.style !== "h2"
);

if (headingBlocks.length !== headings.length) {
  throw new Error(
    `Nombre de titres inattendu: ${headingBlocks.length} au lieu de ${headings.length}`
  );
}

if (paragraphBlocks.length !== paragraphs.length) {
  throw new Error(
    `Nombre de paragraphes inattendu: ${paragraphBlocks.length} au lieu de ${paragraphs.length}`
  );
}

let headingIndex = 0;
let paragraphIndex = 0;

const replaceText = (block, text) => {
  const children = Array.isArray(block.children) ? block.children : [];
  const spans = children.filter((child) => child._type === "span");

  if (spans.length === 0) {
    throw new Error(`Bloc sans span: ${block._key}`);
  }

  return {
    ...block,
    children: children.map((child) => {
      if (child._type !== "span") return child;

      if (child._key === spans[0]._key) {
        return { ...child, text };
      }

      return { ...child, text: "" };
    }),
  };
};

const correctedContentEn = article.contentEn.map((item) => {
  if (item._type !== "block") {
    return item;
  }

  if (item.style === "h2") {
    const text = headings[headingIndex++];
    return replaceText(item, text);
  }

  const text = paragraphs[paragraphIndex++];
  return replaceText(item, text);
});

await client
  .patch(ARTICLE_ID)
  .set({
    titleEn: "Hosting without overcomplicating things",
    excerptEn:
      "A few bottles, a good meal and far fewer rules. How to choose versatile wines for hosting without turning dinner into a sommelier exercise.",
    categoryEn: "Entertaining",
    seoTitleEn:
      "What wine to serve when hosting | Le Premier Verre",
    seoDescriptionEn:
      "Host without overcomplicating things with a few versatile bottles for the aperitif, the meal and your guests, without endless rules or pairings.",
    contentEn: correctedContentEn,
  })
  .commit();

console.log("Article 4 EN corrigé.");
console.log(`Titres EN: ${headingIndex}`);
console.log(`Paragraphes EN: ${paragraphIndex}`);
console.log(`Blocs totaux conservés: ${correctedContentEn.length}`);
