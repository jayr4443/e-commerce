"use client";

import Image from "next/image";
import { ZoomIn } from "lucide-react";
import { useRef, useState } from "react";

type ZoomableImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  /** How much to magnify on hover. 2 = 200%. */
  zoomLevel?: number;
};

export function ZoomableImage({
  src,
  alt,
  priority,
  sizes,
  className = "",
  zoomLevel = 2.2,
}: ZoomableImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isZooming, setIsZooming] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const container = containerRef.current;

    if (!container) return;

    const rect = container.getBoundingClientRect();

    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    setOrigin({
      x: Math.min(100, Math.max(0, x)),
      y: Math.min(100, Math.max(0, y)),
    });
  }

  return (
    <div
      ref={containerRef}
      className="group/zoom relative h-full w-full cursor-zoom-in touch-none"
      onMouseEnter={() => setIsZooming(true)}
      onMouseLeave={() => setIsZooming(false)}
      onMouseMove={handleMouseMove}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={`${className} transition-transform duration-200 ease-out will-change-transform`}
        style={{
          transform: isZooming ? `scale(${zoomLevel})` : "scale(1)",
          transformOrigin: `${origin.x}% ${origin.y}%`,
        }}
      />

      {/* Hint badge — fades out as soon as the person starts zooming */}
      <div
        className={`pointer-events-none absolute bottom-5 right-5 z-10 flex items-center gap-2 rounded-full bg-white/90 px-3.5 py-2 text-xs font-bold text-black shadow-md backdrop-blur transition-opacity duration-300 ${
          isZooming ? "opacity-0" : "opacity-100 group-hover/zoom:opacity-100"
        }`}
      >
        <ZoomIn size={14} />
        Hover to zoom
      </div>
    </div>
  );
}
