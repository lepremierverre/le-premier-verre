import type { SanityImageSource } from "@sanity/image-url";

import { urlFor } from "@/sanity/lib/image";

type BottleStageProps = {
  image?: SanityImageSource;
  alt: string;
  color?: string;
  variant?: "hero" | "card" | "mini";
  className?: string;
  imageFit?: "contain" | "cover";
};

export default function BottleStage({
  image,
  alt,
  variant = "hero",
  className = "",
  imageFit = "contain",
}: BottleStageProps) {
  const imageSrc = image
    ? urlFor(image)
        .ignoreImageParams()
        .width(1200)
        .fit("max")
        .url()
    : null;

  const stageClass =
    variant === "hero"
      ? "h-[620px] md:h-[700px]"
      : variant === "card"
        ? "h-[360px]"
        : "h-[220px]";

  const innerClass =
    variant === "hero"
      ? "h-[540px] w-full"
      : variant === "card"
        ? "h-[300px] w-full"
        : "h-[180px] w-full";

  const imageClass =
    variant === "hero"
      ? "h-full w-auto max-w-full"
      : variant === "card"
        ? "h-full w-auto max-w-full"
        : "h-full w-auto max-w-full";

  return (
    <div
      className={`relative flex w-full items-center justify-center ${stageClass} ${className}`}
    >
      <div
        className={`flex items-center justify-center ${
          imageFit === "cover" ? "h-full w-full" : innerClass
        }`}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={alt}
            className={`block ${
              imageFit === "cover" ? "h-full w-full object-cover" : "object-contain"
            } drop-shadow-[0_16px_14px_rgba(38,29,22,0.07)] ${imageFit === "cover" ? "" : imageClass}`}
          />
        ) : (
          <div className="px-8 text-center">
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              Le Premier Verre
            </p>

            <p className="mt-4 text-lg leading-7 text-[var(--lpv-muted)]">
              {alt}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
