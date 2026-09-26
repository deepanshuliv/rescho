import Link from "next/link";
import { Navbar, Hero, Features } from "@/components/landing";
import { Logo } from "@/components/ui";

const FOOTER_LINKS = [
  { href: "#features", label: "How it works" },
  { href: "/room/join", label: "Join a room" },
  { href: "/location?mode=create", label: "Create a room" },
];

export default function Home() {
  return (
    <main className="min-h-[100dvh]">
      <Navbar />
      <Hero />
      <Features />

      <footer className="border-t border-white/[0.05] px-6 py-10 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 text-sm text-text-muted">
            <Logo size={22} />
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-text-secondary">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-text-primary"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://foursquare.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-text-secondary"
            >
              Powered by Foursquare
            </a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
