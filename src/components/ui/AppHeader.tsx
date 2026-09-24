import Link from "next/link";
import { ReactNode } from "react";
import Logo from "./Logo";

interface AppHeaderProps {
  /** Defaults to the logo linking home. */
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
}

// Same floating-island language as the landing navbar, for every inner page.
export default function AppHeader({ left, center, right }: AppHeaderProps) {
  return (
    <header className="relative z-[var(--z-nav)] px-4 pt-4 sm:px-6 sm:pt-5">
      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="justify-self-start">
          {left ?? (
            <Link href="/" className="island flex h-12 items-center pl-3.5 pr-4" aria-label="RESCHO home">
              <Logo size={26} />
            </Link>
          )}
        </div>
        <div className="justify-self-center">{center}</div>
        <div className="justify-self-end">{right}</div>
      </div>
    </header>
  );
}
