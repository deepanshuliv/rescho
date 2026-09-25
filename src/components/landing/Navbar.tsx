"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth, UserButton } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import Logo from "../ui/Logo";

const NAV_LINKS = [
  { id: "discover", label: "Discover" },
  { id: "features", label: "Features" },
  { id: "how-it-works", label: "How It Works" },
];

const ease = [0.16, 1, 0.3, 1] as const;

const island = "island";

export default function Navbar() {
  const { isSignedIn } = useAuth();
  const [active, setActive] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const createRoomHref = isSignedIn
    ? "/location?mode=create"
    : "/sign-in?redirect_url=%2Flocation%3Fmode%3Dcreate";

  // Highlight the section currently in view
  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
        if (window.scrollY < window.innerHeight * 0.5) setActive(null);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Close the mobile menu with Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const indicator = hovered ?? active;

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease }}
      className="fixed inset-x-0 top-0 z-[var(--z-nav)] px-4 pt-4 sm:px-6 sm:pt-5"
    >
      <nav aria-label="Main" className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-3">
          {/* Brand */}
          <Link
            href="/"
            className={`${island} group flex h-12 items-center pl-3.5 pr-4 transition-colors hover:border-white/[0.12]`}
          >
            <Logo size={26} />
          </Link>

          {/* Center links */}
          <ul
            className={`${island} hidden h-12 items-center p-1.5 md:flex`}
            onMouseLeave={() => setHovered(null)}
          >
            {NAV_LINKS.map((link) => {
              const isActive = active === link.id;
              return (
                <li key={link.id} className="relative">
                  {indicator === link.id && (
                    <motion.span
                      layoutId="nav-indicator"
                      transition={{ type: "spring", stiffness: 420, damping: 36 }}
                      className="absolute inset-0 rounded-full bg-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                    />
                  )}
                  <a
                    href={`#${link.id}`}
                    onMouseEnter={() => setHovered(link.id)}
                    aria-current={isActive ? "location" : undefined}
                    className={`relative flex h-9 items-center rounded-full px-4 font-display text-[13px] font-medium ${
                      isActive ? "text-white" : "text-white/55 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Actions */}
          <div className={`${island} flex h-12 items-center gap-1 p-1.5`}>
            <Link
              href="/room/join"
              className="hidden h-9 items-center rounded-full px-4 font-display text-[13px] font-medium text-white/55 hover:bg-white/[0.06] hover:text-white sm:flex"
            >
              Join Room
            </Link>

            <Link
              href={createRoomHref}
              className="btn-sheen hidden h-9 items-center rounded-full bg-brand-gradient px-4 font-display text-[13px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] hover:brightness-110 sm:flex"
            >
              {isSignedIn ? "Create Room" : "Get Started"}
            </Link>

            {isSignedIn && (
              <span className="flex items-center px-1">
                <UserButton
                  appearance={{
                    variables: { colorPrimary: "#ff3a5c" },
                    elements: {
                      avatarBox: "w-8 h-8 ring-1 ring-white/15",
                      userButtonPopoverCard: "bg-[#09090b] border border-white/[0.06] shadow-2xl",
                      userButtonPopoverActionButton: "text-[#f0f0f5] hover:bg-[#16161f]",
                      userButtonPopoverActionButtonText: "text-[#f0f0f5]",
                      userButtonPopoverFooter: "hidden",
                    },
                  }}
                />
              </span>
            )}

            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 hover:bg-white/[0.06] hover:text-white md:hidden"
            >
              {menuOpen ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.25, ease }}
              className="mt-2 origin-top rounded-3xl border border-white/[0.07] bg-zinc-950/90 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_24px_48px_-16px_rgba(0,0,0,0.9)] backdrop-blur-xl md:hidden"
            >
              {NAV_LINKS.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => setMenuOpen(false)}
                  className={`flex h-11 items-center rounded-2xl px-4 font-display text-[15px] font-medium ${
                    active === link.id
                      ? "bg-white/[0.06] text-white"
                      : "text-white/60 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-white/[0.06] pt-2">
                <Link
                  href="/room/join"
                  onClick={() => setMenuOpen(false)}
                  className="flex h-11 items-center justify-center rounded-2xl border border-white/[0.08] font-display text-sm font-medium text-white/80 hover:bg-white/[0.04]"
                >
                  Join Room
                </Link>
                <Link
                  href={createRoomHref}
                  onClick={() => setMenuOpen(false)}
                  className="flex h-11 items-center justify-center rounded-2xl bg-brand-gradient font-display text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                >
                  {isSignedIn ? "Create Room" : "Get Started"}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}
