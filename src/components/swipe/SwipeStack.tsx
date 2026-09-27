"use client";

import { useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Restaurant } from "@/types";
import SwipeCard, { SwipeDirection } from "./SwipeCard";
import SwipeActions from "./SwipeActions";
import { Button } from "@/components/ui";
import { Heart, Home, Plus, Trophy } from "lucide-react";

interface SwipeStackProps {
  restaurants: Restaurant[];
  onSwipe: (restaurantId: string, direction: "left" | "right") => void;
  onEmpty?: () => void;
  matchCount?: number;
  /** Enables ←/→ keyboard swiping; turn off while an overlay is open. */
  keyboardEnabled?: boolean;
}

export default function SwipeStack({
  restaurants,
  onSwipe,
  onEmpty,
  matchCount = 0,
  keyboardEnabled = true,
}: SwipeStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [lastDirection, setLastDirection] = useState<SwipeDirection | null>(null);

  const handleSwipe = useCallback(
    (direction: SwipeDirection) => {
      if (currentIndex >= restaurants.length) return;

      const restaurant = restaurants[currentIndex];
      setLastDirection(direction);
      onSwipe(restaurant.id, direction);

      setCurrentIndex((prev) => {
        const newIndex = prev + 1;
        if (newIndex >= restaurants.length) {
          setTimeout(() => {
            setShowEndScreen(true);
            if (onEmpty) onEmpty();
          }, 400);
        }
        return newIndex;
      });
    },
    [currentIndex, restaurants, onSwipe, onEmpty],
  );

  useEffect(() => {
    if (!keyboardEnabled) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowLeft") handleSwipe("left");
      if (e.key === "ArrowRight") handleSwipe("right");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [keyboardEnabled, handleSwipe]);

  // Show only top 3 cards for performance
  const visibleCards = restaurants
    .slice(currentIndex, currentIndex + 3)
    .reverse();

  // ── End-of-stack premium screen ──────────────────────────────────────────
  if (showEndScreen || currentIndex >= restaurants.length) {
    const hasMatches = matchCount > 0;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center justify-center h-full text-center px-6 py-8"
      >
        {/* Animated trophy / heart icon */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 18,
            delay: 0.1,
          }}
          className="relative mb-6"
        >
          <div className="halo" aria-hidden />
          <div className="surface-glow relative w-24 h-24 rounded-full flex items-center justify-center">
            {hasMatches ? (
              <Trophy className="w-10 h-10 text-accent-primary" />
            ) : (
              <Heart className="w-10 h-10 text-accent-primary" />
            )}
          </div>
          {/* Animated ring */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full border-2 border-accent-primary/30"
          />
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.45 }}
        >
          <h3 className="text-2xl font-bold font-display text-text-primary mb-2">
            {hasMatches ? "You're done swiping" : "All done"}
          </h3>
          <p className="text-text-secondary text-sm max-w-xs mx-auto leading-relaxed">
            {hasMatches
              ? `You and your partner matched on ${matchCount} restaurant${matchCount > 1 ? "s" : ""}. Time to decide!`
              : "You've seen every restaurant in this area. Try a new location!"}
          </p>
        </motion.div>

        {/* Match count badge */}
        {hasMatches && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, type: "spring", stiffness: 220 }}
            className="surface-glow mt-5 flex items-center gap-2 px-5 py-2.5 rounded-full"
          >
            <Heart
              className="w-4 h-4 text-accent-primary"
              fill="currentColor"
              strokeWidth={0}
            />
            <span className="text-accent-primary font-bold font-display text-sm">
              {matchCount} {matchCount === 1 ? "match" : "matches"} found
            </span>
          </motion.div>
        )}

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.45 }}
          className="mt-8 w-full max-w-xs flex flex-col gap-3"
        >
          <Button href="/location?mode=create" size="lg" className="w-full">
            <Plus className="h-4 w-4" />
            Create new room
          </Button>
          <Button href="/" variant="ghost" size="lg" className="w-full">
            <Home className="h-4 w-4" />
            Back to home
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Card Stack */}
      <div className="relative flex-1 min-h-[400px] max-h-[500px] mx-auto w-full max-w-sm">
        <AnimatePresence mode="sync" custom={lastDirection}>
          {visibleCards.map((restaurant, index) => (
            <SwipeCard
              key={restaurant.id}
              restaurant={restaurant}
              onSwipe={handleSwipe}
              isTop={index === visibleCards.length - 1}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Progress */}
      <p className="tabular mt-4 text-center text-xs text-white/40" aria-live="polite">
        {currentIndex + 1} of {restaurants.length}
        <span className="hidden sm:inline"> &middot; use &larr; &rarr; to swipe</span>
      </p>

      {/* Action Buttons */}
      <SwipeActions onSwipe={handleSwipe} />
    </div>
  );
}
