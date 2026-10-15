import sharp from "sharp";

export const LPV_BOTTLE_CANVAS = {
  width: 900,
  height: 1260,
};

export const LPV_BOTTLE_PRODUCT = {
  maxWidth: 740,
  maxHeight: 1200,
};

export async function normalizeBottleImage(input) {
  /*
   * STANDARD IMAGE — LE PREMIER VERRE
   *
   * 1. Retire automatiquement les marges transparentes.
   * 2. Préserve toujours le ratio original du produit.
   * 3. Ne déforme jamais la bouteille.
   * 4. Dimensionne le contenu dans une zone maximale commune.
   * 5. Centre le produit sur un canevas transparent 900 × 1260.
   *
   * Une même image normalisée peut ensuite être utilisée partout :
   * fiche, répertoire, favoris, sélections, etc.
   */

  const trimmed = await sharp(input)
    .trim({
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  const product = await sharp(trimmed)
    .resize({
      width: LPV_BOTTLE_PRODUCT.maxWidth,
      height: LPV_BOTTLE_PRODUCT.maxHeight,
      fit: "inside",
      withoutEnlargement: false,
    })
    .png()
    .toBuffer();

  const productMeta = await sharp(product).metadata();

  const normalized = await sharp({
    create: {
      width: LPV_BOTTLE_CANVAS.width,
      height: LPV_BOTTLE_CANVAS.height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      {
        input: product,
        gravity: "center",
      },
    ])
    .png()
    .toBuffer();

  return {
    buffer: normalized,
    width: LPV_BOTTLE_CANVAS.width,
    height: LPV_BOTTLE_CANVAS.height,
    productWidth: productMeta.width,
    productHeight: productMeta.height,
  };
}
