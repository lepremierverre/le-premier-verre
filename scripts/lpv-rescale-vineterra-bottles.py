from pathlib import Path
from PIL import Image

FOLDER = Path("public/images/lpv/photos bouteilles/vineterra-normalized")
BACKUP = FOLDER / "before-87-5-percent"

TARGET_W = 900
TARGET_H = 1260
TARGET_OCCUPANCY = 0.875
TARGET_SUBJECT_H = round(TARGET_H * TARGET_OCCUPANCY)

BACKUP.mkdir(exist_ok=True)

files = sorted(FOLDER.glob("*.png"))

if len(files) != 5:
    raise RuntimeError(f"Attendu 5 PNG Vineterra, trouvé {len(files)}")

print("\n===== NORMALISATION VINETERRA À 87,5 % =====")

for path in files:
    img = Image.open(path).convert("RGBA")

    if img.size != (TARGET_W, TARGET_H):
        raise RuntimeError(
            f"{path.name} n'est pas en 900 × 1260"
        )

    # Sauvegarde exacte de la version actuelle
    backup = BACKUP / path.name
    if not backup.exists():
        img.save(backup, "PNG")

    alpha = img.getchannel("A")
    mask = alpha.point(lambda x: 255 if x > 20 else 0)
    bbox = mask.getbbox()

    if not bbox:
        raise RuntimeError(
            f"Sujet introuvable dans {path.name}"
        )

    left, top, right, bottom = bbox

    # On travaille sur la vraie zone contenant la bouteille
    subject = img.crop((left, top, right, bottom))

    current_h = bottom - top
    scale = TARGET_SUBJECT_H / current_h

    new_w = round(subject.width * scale)
    new_h = round(subject.height * scale)

    subject = subject.resize(
        (new_w, new_h),
        Image.Resampling.LANCZOS
    )

    canvas = Image.new(
        "RGBA",
        (TARGET_W, TARGET_H),
        (255, 255, 255, 0)
    )

    x = (TARGET_W - new_w) // 2
    y = (TARGET_H - new_h) // 2

    canvas.alpha_composite(subject, (x, y))
    canvas.save(path, "PNG", optimize=True)

    # Mesure réelle après traitement
    final_alpha = canvas.getchannel("A")
    final_mask = final_alpha.point(
        lambda x: 255 if x > 20 else 0
    )
    final_bbox = final_mask.getbbox()

    fl, ft, fr, fb = final_bbox
    final_subject_h = fb - ft
    final_subject_w = fr - fl

    print(f"\n✓ {path.name}")
    print(f"  avant       {current_h}px")
    print(f"  facteur     ×{scale:.3f}")
    print(f"  après       {final_subject_h}px")
    print(
        f"  occupation  "
        f"{final_subject_h / TARGET_H * 100:.1f}% H"
    )
    print(
        f"  largeur     "
        f"{final_subject_w / TARGET_W * 100:.1f}% W"
    )

print("\n✓ 5 images ajustées")
print("✓ Cible LPV Ridge : 87,5 %")
print("✓ Canevas conservé : 900 × 1260")
print("✓ Versions précédentes sauvegardées")
