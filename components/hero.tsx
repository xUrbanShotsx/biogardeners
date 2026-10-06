"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight } from "lucide-react";

export function Hero() {
  const videoRef  = useRef<HTMLVideoElement>(null);
  const playCount = useRef(0);
  const [muted,   setMuted]   = useState(true);
  const [ended,   setEnded]   = useState(false);

  // Mute imperatively (React JSX muted prop doesn't reach the DOM)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;

    function onEnded() {
      playCount.current += 1;
      if (playCount.current >= 2) {
        v!.loop = false;
        v!.pause();
        setEnded(true);
      } else {
        v!.play().catch(() => {});
      }
    }

    v.addEventListener("ended", onEnded);
    v.play().catch(() => {});
    return () => v.removeEventListener("ended", onEnded);
  }, []);

  function toggleMute() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }

  function playAgain() {
    const v = videoRef.current;
    if (!v) return;
    playCount.current = 0;
    v.loop  = false;
    v.currentTime = 0;
    setEnded(false);
    v.play().catch(() => {});
  }

  return (
    <section className="relative w-full overflow-hidden" style={{ height: "100svh" }} aria-labelledby="hero-heading">

      {/* Video — plays twice then stops */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        className="absolute left-0 right-0 bottom-0 w-full object-cover"
        style={{ top: "var(--nav-h)", height: "calc(100% - var(--nav-h))" }}
        aria-hidden="true"
      >
        <source src="/madison.mp4" type="video/mp4" />
      </video>

      {/* Layered overlay */}
      <div
        className="absolute left-0 right-0 bottom-0"
        style={{
          top: "var(--nav-h)",
          background: "linear-gradient(to top, rgba(10,25,18,0.82) 0%, rgba(10,25,18,0.55) 40%, rgba(10,25,18,0.30) 70%, rgba(10,25,18,0.10) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Mute + Play Again controls — top right */}
      <div
        className="absolute right-5 md:right-10 z-20 flex flex-col items-end gap-2"
        style={{ top: "calc(var(--nav-h) + 20px)" }}
      >
        <button
          onClick={toggleMute}
          aria-label={muted ? "Unmute video" : "Mute video"}
          className="px-6 py-3 rounded-full text-sm font-bold transition-all hover:scale-105 active:scale-95"
          style={{
            background:     "rgba(255,255,255,0.18)",
            border:         "1px solid rgba(255,255,255,0.35)",
            backdropFilter: "blur(10px)",
            color:          "#fff",
          }}
        >
          {muted ? "Click to unmute" : "Click to mute"}
        </button>

        {ended && (
          <button
            onClick={playAgain}
            aria-label="Play video again"
            className="px-6 py-3 rounded-full text-sm font-bold transition-all hover:scale-105 active:scale-95"
            style={{
              background:     "rgba(255,255,255,0.18)",
              border:         "1px solid rgba(255,255,255,0.35)",
              backdropFilter: "blur(10px)",
              color:          "#fff",
            }}
          >
            Play Again
          </button>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end pt-0 pb-[12vh] md:pb-[10vh] px-5 md:px-10 lg:px-16 max-w-[1440px] mx-auto w-full">

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
