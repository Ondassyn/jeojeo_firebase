"use client";
import { useState, useRef } from "react";
import Image from "next/image";

export default function AdaptiveContainer({
  src,
  alt,
}: {
  src: string;
  alt?: string;
}) {
  const [bgColor, setBgColor] = useState("rgba(0,0,0,0.05)");
  const imgRef = useRef<HTMLImageElement>(null);

  const extractLeftEdgeColor = () => {
    const img = imgRef.current;
    if (!img) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Draw the image at its natural size
    ctx.drawImage(img, 0, 0);

    // Sample a 1x1 pixel from the left edge, halfway down the height
    // Coordinates: x=0, y=height/2
    const pixel = ctx.getImageData(0, Math.floor(canvas.height / 2), 1, 1).data;
    const [r, g, b] = pixel;

    setBgColor(`rgb(${r}, ${g}, ${b})`);
  };

  return (
    <div
      className="relative w-full aspect-video rounded-xl overflow-hidden transition-colors duration-700 ease-in-out flex items-center justify-center max-h-[600]"
      style={{ backgroundColor: bgColor }}
    >
      <div className="relative w-full h-full">
        {/* Padding creates the "frame" look */}
        <Image
          ref={imgRef}
          src={src}
          alt={alt || "Image"}
          fill
          className="object-contain"
          onLoadingComplete={extractLeftEdgeColor}
          crossOrigin="anonymous" // Required for canvas access on external domains
        />
      </div>
    </div>
  );
}
