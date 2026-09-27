"use client";

import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { Restaurant } from "@/types";
import Image from "next/image";
import { MapPin, Star } from "lucide-react";

export type SwipeDirection = "left" | "right";

const cardVariants = {
  exit: (direction: SwipeDirection | null) => ({
    x: direction === "right" ? 420 : -420,
    rotate: direction === "right" ? 18 : -18,
    opacity: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

interface SwipeCardProps {
  restaurant: Restaurant;
  onSwipe: (direction: "left" | "right") => void;
  isTop: boolean;
}

export default function SwipeCard({
  restaurant,
  onSwipe,
  isTop,
}: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(
    x,
    [-200, -100, 0, 100, 200],
    [0.5, 1, 1, 1, 0.5],
  );

  // Like/Dislike indicator opacity
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const dislikeOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const threshold = 100;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    if (offset > threshold || velocity > 500) {
      onSwipe("right");
    } else if (offset < -threshold || velocity < -500) {
      onSwipe("left");
    }
  };

  const gradient =
    restaurant.gradient ||
    "linear-gradient(135deg, #37474f 0%, #263238 50%, #1a1a2e 100%)";

  return (
    <motion.div
      className="absolute w-full h-full cursor-grab active:cursor-grabbing"
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        opacity: isTop ? opacity : 1,
        zIndex: isTop ? 10 : 1,
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      whileTap={isTop ? { scale: 1.02 } : undefined}
      variants={cardVariants}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 10, opacity: 1 }}
      exit="exit"
      aria-hidden={!isTop}
    >
      <div
        className="relative w-full h-full rounded-[1.75rem] overflow-hidden ring-1 ring-white/[0.1] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_30px_60px_-20px_rgba(0,0,0,0.85)]"
      >
        {/* Background: dark base, faint cuisine tint, oversized initial */}
        <div className="absolute inset-0 bg-[#0c0c10]">
          <div
            className="absolute inset-0 opacity-[0.22]"
            style={{
              background: gradient,
              maskImage: "radial-gradient(120% 80% at 50% 0%, #000 0%, transparent 70%)",
              WebkitMaskImage: "radial-gradient(120% 80% at 50% 0%, #000 0%, transparent 70%)",
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,rgba(255,255,255,0.06),transparent_70%)]" />
          <span
            aria-hidden
            className="pointer-events-none absolute -right-4 top-2 select-none font-display text-[15rem] font-bold leading-none tracking-tighter text-white/[0.045]"
          >
            {restaurant.name.charAt(0)}
          </span>
          {/* Foursquare category icon */}
          <div className="icon-tile absolute left-6 top-6 h-14 w-14 overflow-hidden rounded-2xl">
            <Image
              src={restaurant.image}
              alt=""
              draggable={false}
              width={56}
              height={56}
              className="h-full w-full object-cover opacity-90"
              unoptimized
            />
          </div>
          {/* Fade for text readability */}
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>

        {/* Like/Dislike Indicators */}
        <motion.div
          className="absolute left-8 top-8 z-10 -rotate-12 rounded-2xl border-2 border-accent-primary bg-accent-primary/15 px-4 py-1.5 font-display text-2xl font-bold tracking-wide text-accent-primary backdrop-blur-sm"
          style={{ opacity: likeOpacity }}
        >
          LIKE
        </motion.div>
        <motion.div
          className="absolute right-8 top-8 z-10 rotate-12 rounded-2xl border-2 border-white/70 bg-black/30 px-4 py-1.5 font-display text-2xl font-bold tracking-wide text-white backdrop-blur-sm"
          style={{ opacity: dislikeOpacity }}
        >
          NOPE
        </motion.div>

        {/* Restaurant Info */}
        <div
          className="absolute bottom-0 left-0 right-0 p-6 z-10"
          style={{ visibility: isTop ? "visible" : "hidden" }}
        >
          {/* Cuisine Tag */}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/85 backdrop-blur-sm">
              {restaurant.cuisine}
            </span>
            {restaurant.priceLevel && (
              <span className="rounded-full bg-white/10 px-3 py-1 font-display text-xs font-semibold text-accent-primary backdrop-blur-sm">
                {restaurant.priceLevel}
              </span>
            )}
            {restaurant.rating && (
              <span className="tabular flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                <Star
                  className="h-3 w-3 text-accent-primary"
                  fill="currentColor"
                  strokeWidth={0}
                />
                {restaurant.rating.toFixed(1)}
              </span>
            )}
          </div>

          {/* Restaurant Name */}
          <h2 className="mb-2 font-display text-3xl font-bold leading-tight tracking-tight text-white">
            {restaurant.name}
          </h2>

          {/* Description */}
          <p className="mb-4 line-clamp-2 text-sm text-white/70">
            {restaurant.description}
          </p>

          {/* Address */}
          <div className="flex items-center gap-2 text-xs text-white/55">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{restaurant.address}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
