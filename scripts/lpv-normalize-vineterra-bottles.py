from pathlib import Path
from PIL import Image, ImageChops, ImageFilter
import numpy as np

SOURCE = Path("public/images/lpv/photos bouteilles")
OUT = SOURCE / "vineterra-normalized"

FILES = {
    "cheval-tout-blanc": "DSC08069-Edit-Edit.JPEG",
    "croix-sur-la-montagne": "DSC08091-Edit-Edit-Edit.JPEG",
    "patte-de-loup": "DSC08032-Edit-Edit.JPEG",
    "lac-sans-fond": "DSC07992-Edit-Edit-Edit-Edit.JPEG",
    "magie-des-semis": "DSC08049-Edit-Edit.JPEG",
}

CANVAS_W = 900
CANVAS_H = 1260

# On garde un peu d'air autour de la bouteille comme les assets Ridge.
TARGET_H = 1080
TARGET_MAX_W = 650

def normalize(path, out_path):
    img = Image.open(path).convert("RGB")

    # Réduction de travail pour éviter de traiter inutilement 30+ MP.
    max_work_h = 2400
    if img.height > max_work_h:
        ratio = max_work_h / img.height
        img = img.resize(
            (round(img.width * ratio), max_work_h),
            Image.Resampling.LANCZOS
        )

    arr = np.asarray(img).astype(np.int16)

    # Estimation du fond à partir des quatre coins.
    corners = np.array([
        arr[0, 0],
        arr[0, -1],
        arr[-1, 0],
        arr[-1, -1],
    ])
    bg = np.median(corners, axis=0)

    # Distance chromatique au fond.
    dist = np.sqrt(np.sum((arr - bg) ** 2, axis=2))

    # Le fond studio Vineterra est très clair.
    # On garde comme sujet ce qui diffère suffisamment du fond.
    subject = dist > 24

    mask = Image.fromarray((subject * 255).astype("uint8"), "L")

    # Nettoyage léger.
    mask = mask.filter(ImageFilter.MedianFilter(5))
    mask = mask.filter(ImageFilter.GaussianBlur(0.8))

    bbox = mask.getbbox()
    if not bbox:
        raise RuntimeError(f"Impossible de détecter la bouteille dans {path.name}")

    left, top, right, bottom = bbox

    # Marge autour du sujet.
    pad_x = max(20, int((right - left) * 0.08))
    pad_y = max(20, int((bottom - top) * 0.035))

    left = max(0, left - pad_x)
    top = max(0, top - pad_y)
    right = min(img.width, right + pad_x)
    bottom = min(img.height, bottom + pad_y)

    rgba = img.convert("RGBA")
    rgba.putalpha(mask)

    cropped = rgba.crop((left, top, right, bottom))

    scale = min(
        TARGET_H / cropped.height,
        TARGET_MAX_W / cropped.width
    )

    new_size = (
        max(1, round(cropped.width * scale)),
        max(1, round(cropped.height * scale)),
    )

    cropped = cropped.resize(new_size, Image.Resampling.LANCZOS)

    canvas = Image.new("RGBA", (CANVAS_W, CANVAS_H), (255, 255, 255, 0))

    x = (CANVAS_W - cropped.width) // 2
    y = (CANVAS_H - cropped.height) // 2

    canvas.alpha_composite(cropped, (x, y))
    canvas.save(out_path, "PNG", optimize=True)

    print(
        f"✓ {path.name}\n"
        f"  → {out_path}\n"
        f"  sujet final {cropped.width}×{cropped.height} "
        f"dans canvas {CANVAS_W}×{CANVAS_H}"
    )

OUT.mkdir(parents=True, exist_ok=True)

for slug, filename in FILES.items():
    src = SOURCE / filename

    if not src.exists():
        raise FileNotFoundError(f"Photo introuvable : {src}")

    normalize(src, OUT / f"{slug}.png")

print("\n===== TERMINÉ =====")
print("✓ 5 PNG transparents créés")
print("✓ Format 900 × 1260 identique au standard Ridge")
print("✓ Aucun document Sanity modifié")
print("✓ Aucun template modifié")
