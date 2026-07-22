"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type HeroVideoProps = {
  src: string;
  poster: string;
};

/**
 * Full-bleed hero background video.
 *
 * Deliberately avoids the generic "autoplay loop behind centered logo"
 * treatment: instead of a decorative loop, the video is framed as
 * content you're watching — a thin playhead line tracks real progress,
 * and a mute toggle makes clear it's a real clip, not ambient wallpaper.
 * Falls back to a static poster frame for prefers-reduced-motion.
 */
export function HeroVideo({ src, poster }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(query.matches);

    const handleChange = (event: MediaQueryListEvent) =>
      setReduceMotion(event.matches);

    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (reduceMotion) {
      video.pause();
      return;
    }

    video.play().catch(() => {
      // Autoplay can be blocked by the browser; the poster frame remains
      // visible, which is an acceptable fallback.
    });
  }, [reduceMotion]);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    setProgress((video.currentTime / video.duration) * 100);
  };

  return (
    <>
      {reduceMotion ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${poster})` }}
          role="img"
          aria-label="Modern concept store interior"
        />
      ) : (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover opacity-55"
          src={src}
          poster={poster}
          muted={muted}
          loop
          playsInline
          autoPlay
          onTimeUpdate={handleTimeUpdate}
          aria-hidden="true"
        />
      )}

      {!reduceMotion && (
        <>
          <div className="absolute inset-x-0 top-0 z-20 h-[2px] bg-white/15">
            <div
              className="h-full bg-white transition-[width] duration-150 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

          <button
            type="button"
            onClick={() => setMuted((value) => !value)}
            className="absolute bottom-8 left-6 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-xl transition hover:bg-white/20 sm:left-12 lg:left-20"
            aria-label={muted ? "Unmute video" : "Mute video"}
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </>
      )}
    </>
  );
}
