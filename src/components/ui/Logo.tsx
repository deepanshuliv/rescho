import Image from "next/image";

interface LogoProps {
  /** Glyph height in px; the wordmark scales with it. */
  size?: number;
  showWordmark?: boolean;
  className?: string;
}

export default function Logo({ size = 28, showWordmark = true, className = "" }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Image
        src="/logo-mark.png"
        alt=""
        width={size}
        height={size}
        className="object-contain"
        priority
      />
      {showWordmark && (
        <span
          className="font-display font-semibold tracking-[0.06em] text-white"
          style={{ fontSize: Math.round(size * 0.56) }}
        >
          RESCHO
        </span>
      )}
      <span className="sr-only">RESCHO home</span>
    </span>
  );
}
