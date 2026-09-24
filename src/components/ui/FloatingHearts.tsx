import { Heart } from "lucide-react";

// Deterministic layout so server and client render the same markup.
const HEARTS = [
  { left: 6, size: 10, duration: 16, delay: 0, opacity: 0.35 },
  { left: 18, size: 14, duration: 21, delay: 6, opacity: 0.25 },
  { left: 34, size: 8, duration: 18, delay: 11, opacity: 0.3 },
  { left: 52, size: 12, duration: 23, delay: 3, opacity: 0.2 },
  { left: 68, size: 9, duration: 17, delay: 9, opacity: 0.3 },
  { left: 81, size: 15, duration: 25, delay: 1.5, opacity: 0.22 },
  { left: 93, size: 10, duration: 19, delay: 13, opacity: 0.3 },
];

export default function FloatingHearts({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {HEARTS.map((h, i) => (
        <Heart
          key={i}
          className="heart-float"
          fill="currentColor"
          strokeWidth={0}
          style={{
            left: `${h.left}%`,
            width: h.size,
            height: h.size,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
            opacity: h.opacity,
          }}
        />
      ))}
    </div>
  );
}
