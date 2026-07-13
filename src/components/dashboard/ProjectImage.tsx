"use client";

import { useState } from "react";
import Image from "next/image";

export function ProjectImage({
  src,
  alt,
}: {
  src: string | null;
  alt: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted">
        No image
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover"
      unoptimized
      onError={() => setFailed(true)}
    />
  );
}
