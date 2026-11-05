"use client";

import { useState } from "react";
import Image from "next/image";

type Img = { url: string; altText: string | null };

export function BundleGallery({ images, title }: { images: Img[]; title: string }) {
  const [active, setActive] = useState(0);
  if (images.length === 0) return null;
  const current = images[active] ?? images[0];

  return (
    <div className="mb-8">
      <div
        className="relative w-full overflow-hidden rounded-2xl"
        style={{ aspectRatio: "4 / 3", background: "var(--surface-alt)", border: "1px solid var(--ceramic)" }}
      >
        <Image
          key={current.url}
          src={current.url}
          alt={current.altText || title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 700px"
          className="object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-2.5 mt-3">
          {images.map((img, i) => (
            <button
              key={img.url}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1} of ${images.length}`}
              aria-pressed={active === i}
              className="relative overflow-hidden rounded-xl transition-all"
              style={{
                width: 72,
                height: 72,
                border: active === i ? "2px solid var(--green-accent)" : "2px solid var(--ceramic)",
                opacity: active === i ? 1 : 0.75,
              }}
            >
              <Image src={img.url} alt="" fill sizes="72px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
