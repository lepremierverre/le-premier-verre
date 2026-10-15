import type { SanityImageSource } from "@sanity/image-url";

import { urlFor } from "@/sanity/lib/image";

type BottleStageProps = {
  image?: SanityImageSource;
  alt: string;
  color?: string;
  variant?: "hero" | "card" | "mini";
  className?: string;
};

function getImageDimensions(image?: SanityImageSource) {
  if (!image || typeof image !== "object") return null;

  const asset = (image as {
    asset?: {
      _ref?: string;
    };
  }).asset;

  const ref = asset?._ref;
  if (!ref) return null;

  const match = ref.match(/-(\d+)x(\d+)-/);
  if (!match) return null;

  return {
    width: Number(match[1]),
    height: Number(match[2]),
  };
}

export default function BottleStage({
  image,
  alt,
  variant = "hero",
  className = "",
}: BottleStageProps) {
  const dimensions = getImageDimensions(image);

  const isSquare =
    dimensions &&
    Math.abs(dimensions.width / dimensions.height - 1) < 0.08;

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

  const standardImageClass =
    variant === "hero"
      ? "max-h-full max-w-[58%]"
      : variant === "card"
        ? "max-h-full max-w-[58%]"
        : "max-h-full max-w-[65%]";

  const squareImageClass =
    variant === "hero"
      ? "h-[125%] w-[125%] max-w-none object-contain"
      : variant === "card"
        ? "h-[130%] w-[130%] max-w-none object-contain"
        : "h-[135%] w-[135%] max-w-none object-contain";

  return (
    <div
      className={`relative flex w-full items-center justify-center ${stageClass} ${className}`}
    >
      <div
        className={`flex items-center justify-center ${
          isSquare ? "overflow-hidden" : ""
        } ${innerClass}`}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={alt}
            className={`block drop-shadow-[0_16px_14px_rgba(38,29,22,0.07)] ${
              isSquare
                ? squareImageClass
                : `h-auto w-auto object-contain ${standardImageClass}`
            }`}
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
