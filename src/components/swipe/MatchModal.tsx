"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Restaurant } from "@/types";
import { Button } from "@/components/ui";
import { useEffect } from "react";
import { Heart } from "lucide-react";

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurant: Restaurant | null;
  onContinue: () => void;
  onViewMatches: () => void;
}

// Pre-generated confetti particles (static to avoid impure function calls)
const CONFETTI_COLORS = ["#ff3a5c", "#c0182e", "#d4284a", "#f0f0f5", "#7a0f1e"];
const INITIAL_PARTICLES = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  x: (i * 17 + 7) % 100, // Deterministic distribution
  colorIndex: i % 5,
  delay: (i % 10) * 0.05,
}));

// Confetti particle component
function Confetti() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {INITIAL_PARTICLES.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-3 h-3 rounded-full"
          style={{
            left: `${particle.x}%`,
            backgroundColor: CONFETTI_COLORS[particle.colorIndex],
          }}
          initial={{ y: "100vh", opacity: 1, rotate: 0 }}
          animate={{ y: "-100vh", opacity: 0, rotate: 720 }}
          transition={{
            duration: 2.5,
            delay: particle.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

export default function MatchModal({
  isOpen,
  onClose,
  restaurant,
  onContinue,
  onViewMatches,
}: MatchModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && restaurant && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50"
            onClick={onClose}
          />

          {/* Confetti */}
          <div className="fixed inset-0 z-50 pointer-events-none">
            <Confetti />
          </div>

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="match-title"
              className="surface-glow rounded-[2rem] max-w-sm w-full overflow-hidden bg-[#0c0c10]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header art: same treatment as the swipe card */}
              <div className="relative h-44 w-full overflow-hidden bg-[#0c0c10]">
                <div
                  className="absolute inset-0 opacity-25"
                  style={{
                    background:
                      restaurant.gradient ||
                      "linear-gradient(135deg, #37474f 0%, #263238 50%, #1a1a2e 100%)",
                    maskImage: "radial-gradient(120% 90% at 50% 0%, #000 0%, transparent 75%)",
                    WebkitMaskImage: "radial-gradient(120% 90% at 50% 0%, #000 0%, transparent 75%)",
                  }}
                />
                <span
                  aria-hidden
                  className="absolute inset-0 flex select-none items-center justify-center font-display text-[9rem] font-bold leading-none tracking-tighter text-white/[0.06]"
                >
                  {restaurant.name.charAt(0)}
                </span>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e14] via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6 text-center -mt-8 relative">
                {/* Match Badge */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="btn-sheen inline-flex items-center gap-2 bg-brand-gradient text-white px-6 py-2.5 rounded-full font-bold font-display text-sm mb-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_12px_32px_-6px_rgba(255,58,92,0.7)]"
                >
                  <Heart
                    className="w-5 h-5"
                    fill="currentColor"
                    strokeWidth={0}
                  />
                  It&apos;s a match
                </motion.div>

                {/* Restaurant Name */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  id="match-title"
                  className="text-2xl font-bold font-display text-text-primary mb-2"
                >
                  {restaurant.name}
                </motion.h2>

                {/* Cuisine & Price */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center justify-center gap-2 text-text-secondary mb-4"
                >
                  <span>{restaurant.cuisine}</span>
                  {restaurant.priceLevel && (
                    <>
                      <span>•</span>
                      <span className="text-accent-primary">
                        {restaurant.priceLevel}
                      </span>
                    </>
                  )}
                </motion.div>

                {/* Address */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-text-muted text-sm mb-6"
                >
                  {restaurant.address}
                </motion.p>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col gap-3"
                >
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={onViewMatches}
                    className="w-full"
                  >
                    View all matches
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={onContinue}
                    className="w-full"
                  >
                    Keep swiping
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
