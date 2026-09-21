"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight, Volume2, VolumeX } from "lucide-react";

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  function toggleMute() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }

  return (
    <section className="relative w-full overflow-hidden" style={{ height: "100svh" }} aria-labelledby="hero-heading">

      {/* Video — starts muted for autoplay, user can unmute */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      >
        <source src="/madison.mp4" type="video/mp4" />
      </video>

      {/* Layered overlay — bottom heavy for text legibility */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to top, rgba(10,25,18,0.82) 0%, rgba(10,25,18,0.55) 40%, rgba(10,25,18,0.30) 70%, rgba(10,25,18,0.10) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Mute toggle — top right */}
      <button
        onClick={toggleMute}
        aria-label={muted ? "Unmute video" : "Mute video"}
        className="absolute top-6 right-5 md:right-10 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        style={{
          background: "rgba(255,255,255,0.15)",
          border: "1px solid rgba(255,255,255,0.25)",
          backdropFilter: "blur(8px)",
          color: "#fff",
          marginTop: "var(--nav-h)",
        }}
      >
        {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
      </button>

      {/* Content — mobile: centred upper-middle; desktop: lower third */}
      <div className="relative z-10 h-full flex flex-col justify-center md:justify-end pt-[10vh] md:pt-0 pb-0 md:pb-[10vh] px-5 md:px-10 lg:px-16 max-w-[1440px] mx-auto w-full">

        {/* Headline */}
        <motion.h1
          id="hero-heading"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.80, ease: [0.16, 1, 0.3, 1] }}
          className="font-bold mb-7"
          style={{
            fontSize:      "clamp(2.8rem, 7vw, 6rem)",
            lineHeight:    1.04,
            letterSpacing: "-0.03em",
            color:         "#fff",
            textWrap:      "balance",
            maxWidth:      "14ch",
          }}
        >
          Feed your garden
          {" "}
          <em
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle:  "italic",
              fontWeight: 600,
              color:      "var(--green-light)",
            }}
          >
            the right way.
          </em>
        </motion.h1>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.48, duration: 0.55 }}
          className="flex flex-wrap gap-3"
        >
          <Link
            href="/products"
            className="flex items-center gap-2.5 px-7 py-3.5 rounded-full font-bold text-sm transition-all hover:brightness-110 active:scale-95"
            style={{
              background: "var(--green-accent)",
              color:      "#fff",
              boxShadow:  "0 4px 24px rgba(0,117,74,0.45)",
            }}
          >
            <ShoppingBag size={15} />
            Shop now
          </Link>
          <Link
            href="/bundles"
            className="flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm transition-all"
            style={{
              background:     "rgba(255,255,255,0.12)",
              color:          "#fff",
              border:         "1px solid rgba(255,255,255,0.22)",
              backdropFilter: "blur(8px)",
            }}
          >
            View bundles
            <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>

    </section>
  );
}
