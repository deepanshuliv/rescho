"use client";

import { motion } from "framer-motion";
import { X, Heart } from "lucide-react";

interface SwipeActionsProps {
  onSwipe: (direction: "left" | "right") => void;
}

const spring = { type: "spring", stiffness: 400, damping: 20 } as const;

export default function SwipeActions({ onSwipe }: SwipeActionsProps) {
  return (
    <div className="flex items-center justify-center gap-10 py-4">
      <motion.button
        type="button"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.9 }}
        transition={spring}
        onClick={() => onSwipe("left")}
        className="swipe-btn-dislike"
        aria-label="Pass (left arrow)"
      >
        <X className="h-7 w-7" strokeWidth={2.5} />
      </motion.button>

      <motion.button
        type="button"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.9 }}
        transition={spring}
        onClick={() => onSwipe("right")}
        className="swipe-btn-like"
        aria-label="Like (right arrow)"
      >
        <Heart className="h-7 w-7" strokeWidth={0} fill="currentColor" />
      </motion.button>
    </div>
  );
}
