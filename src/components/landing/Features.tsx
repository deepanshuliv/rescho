"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import Button from "../ui/Button";
import {
  Star,
  MapPin,
  Heart,
  X,
  Zap,
  Crosshair,
  HeartHandshake,
  ArrowRight,
} from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7, delay, ease },
});

const STEPS = [
  {
    title: "Create & invite",
    body: "One person sets the location and creates a room. Share the six-character code with your partner so they can join instantly. No complicated sign-ups.",
  },
  {
    title: "Swipe together",
    body: "You both swipe through the same list of local spots. Right if you love it, left if you don't. Your choices stay hidden from each other.",
  },
  {
    title: "Match & dine",
    body: "When you both swipe right on the same restaurant, it's a match. All that's left is booking the table.",
  },
];

const HIGHLIGHTS = [
  { icon: Zap, title: "Real-time", body: "Swipes sync instantly" },
  { icon: Crosshair, title: "Accurate", body: "GPS-based results" },
  { icon: HeartHandshake, title: "Fun", body: "Deciding feels like a game" },
];

export default function Features() {
  const { isSignedIn } = useAuth();
  const createRoomHref = isSignedIn
    ? "/location?mode=create"
    : "/sign-in?redirect_url=%2Flocation%3Fmode%3Dcreate";

  return (
    <>
      {/* Discover: bento grid */}
      <section id="discover" className="section-padding scroll-mt-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            {...reveal()}
            className="mb-12 grid gap-4 md:mb-16 md:grid-cols-2 md:items-end md:gap-12"
          >
            <div>
              <p className="mb-3 text-sm font-medium text-text-muted">Discover</p>
              <h2 className="text-headline">
                Explore <span className="text-text-secondary">cuisines</span> you
                love
              </h2>
            </div>
            <p className="text-body-lg max-w-[42ch] text-text-secondary md:justify-self-end">
              Create a room, invite your partner, and swipe through the best
              restaurants near you together.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
            {/* Featured */}
            <motion.div
              {...reveal()}
              className="tile-shine group relative col-span-2 row-span-2 min-h-[320px] overflow-hidden rounded-[1.75rem] bg-bg-secondary ring-1 ring-white/[0.06] md:min-h-[420px]"
            >
              <Image
                src="/food-sushi.webp"
                alt="Nigiri sushi on a slate board"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <h3 className="text-title mb-2 text-white">Japanese cuisine</h3>
                <p className="text-body max-w-[40ch] text-white/65">
                  The finest sushi, ramen, and izakaya spots in your area.
                </p>
                <div className="mt-4 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5 text-accent-primary"
                      fill="currentColor"
                      strokeWidth={0}
                    />
                  ))}
                  <span className="tabular ml-2 text-xs text-white/55">4.9 rating</span>
                </div>
              </div>
            </motion.div>

            {/* Stat */}
            <motion.div
              {...reveal(0.08)}
              className="surface-glow relative col-span-1 flex min-h-[180px] flex-col justify-between rounded-[1.5rem] p-5"
            >
              <span className="flex h-10 w-10 items-center justify-center icon-tile">
                <MapPin className="h-5 w-5 text-accent-primary" />
              </span>
              <div>
                <p className="tabular font-display text-4xl font-bold tracking-tight text-text-primary">
                  500+
                </p>
                <p className="mt-1 text-xs text-text-secondary">Restaurants nearby</p>
              </div>
            </motion.div>

            {/* Pasta */}
            <motion.div
              {...reveal(0.14)}
              className="tile-shine group relative col-span-1 min-h-[180px] overflow-hidden rounded-[1.5rem] bg-bg-secondary ring-1 ring-white/[0.06]"
            >
              <Image
                src="/food-pasta.webp"
                alt="Fresh Italian pasta"
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="font-display text-base font-semibold text-white">Italian</p>
                <p className="tabular mt-0.5 text-xs text-white/55">42 spots nearby</p>
              </div>
            </motion.div>

            {/* Burger */}
            <motion.div
              {...reveal(0.2)}
              className="tile-shine group relative col-span-1 min-h-[180px] overflow-hidden rounded-[1.5rem] bg-bg-secondary ring-1 ring-white/[0.06]"
            >
              <Image
                src="/food-burger.webp"
                alt="Gourmet burger with fries"
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="font-display text-base font-semibold text-white">Burgers</p>
                <p className="tabular mt-0.5 text-xs text-white/55">38 spots nearby</p>
              </div>
            </motion.div>

            {/* Match rate */}
            <motion.div
              {...reveal(0.26)}
              className="surface-glow relative col-span-1 flex min-h-[180px] flex-col justify-between rounded-[1.5rem] p-5"
            >
              <span className="flex h-10 w-10 items-center justify-center icon-tile">
                <Heart
                  className="h-5 w-5 text-accent-primary"
                  fill="currentColor"
                  strokeWidth={0}
                />
              </span>
              <div>
                <p className="tabular font-display text-4xl font-bold tracking-tight text-text-primary">
                  92%
                </p>
                <p className="mt-1 text-xs text-text-secondary">Match success rate</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features: how it works, as a numbered list */}
      <section id="features" className="section-padding scroll-mt-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <motion.div {...reveal()} className="lg:sticky lg:top-24 lg:self-start">
            <p className="mb-3 text-sm font-medium text-text-muted">How it works</p>
            <h2 className="text-headline mb-5">
              Three steps to your{" "}
              <span className="text-text-secondary">perfect meal</span>
            </h2>
            <p className="text-body-lg max-w-[44ch] text-text-secondary">
              No more endless debates about where to eat. Create a room, invite
              your partner, and let the swiping decide your next date night.
            </p>
          </motion.div>

          <ol className="relative">
            {STEPS.map((step, i) => (
              <motion.li
                key={step.title}
                {...reveal(i * 0.08)}
                className="group grid grid-cols-[3.5rem_1fr] gap-5 rounded-3xl border border-transparent p-5 transition-[background-color,border-color,box-shadow] duration-300 hover:border-white/[0.06] hover:bg-white/[0.025] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] md:grid-cols-[5rem_1fr] md:gap-8 md:p-7"
              >
                <span
                  className="tabular bg-gradient-to-b from-white/25 to-white/[0.04] bg-clip-text font-display text-4xl font-bold leading-none tracking-tight text-transparent transition-all duration-300 group-hover:from-white/70 group-hover:to-white/15 md:text-5xl"
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-title mb-2 text-text-primary">{step.title}</h3>
                  <p className="text-body max-w-[52ch] text-text-secondary">{step.body}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA with phone preview */}
      <section id="how-it-works" className="section-padding scroll-mt-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            {...reveal()}
            className="surface-glow relative overflow-hidden rounded-[2rem] p-8 md:p-14"
          >
            <div
              className="pointer-events-none absolute -right-24 -top-24 h-[28rem] w-[28rem] rounded-full bg-accent-primary/[0.05] blur-[120px]"
              aria-hidden
            />

            <div className="relative grid items-center gap-14 md:grid-cols-2">
              <div>
                <p className="mb-3 text-sm font-medium text-text-muted">
                  Ready to choose?
                </p>
                <h2 className="text-headline mb-5 text-text-primary">
                  Stop debating.{" "}
                  <span className="text-text-secondary">Start swiping.</span>
                </h2>
                <p className="text-body-lg mb-10 max-w-[46ch] text-text-secondary">
                  Connect with your partner in real time. You both swipe through
                  the same restaurants independently, and we surface the places
                  you both said yes to.
                </p>

                <ul className="mb-10 grid gap-5 sm:grid-cols-3">
                  {HIGHLIGHTS.map(({ icon: Icon, title, body }) => (
                    <li key={title} className="flex items-center gap-3 sm:flex-col sm:items-start sm:gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center icon-tile">
                        <Icon className="h-5 w-5 text-accent-primary" />
                      </span>
                      <div>
                        <p className="font-display text-sm font-semibold text-text-primary">
                          {title}
                        </p>
                        <p className="text-xs text-text-muted">{body}</p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                  <Button href={createRoomHref} size="lg" className="group">
                    Create a room
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Button>
                  <Link
                    href="/room/join"
                    className="text-sm font-semibold text-text-secondary hover:text-text-primary"
                  >
                    Join with a code
                  </Link>
                </div>
              </div>

              {/* Phone preview (decorative) */}
              <div className="flex justify-center" aria-hidden>
                <div className="relative">
                  <div className="halo" />
                  <div className="relative h-[520px] w-[272px] rounded-[3.25rem] border-[3px] border-[#26262e] bg-[#08080c] p-3 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] ring-1 ring-white/10">
                    <div className="relative h-full w-full overflow-hidden rounded-[2.6rem] bg-bg-secondary">
                      <div className="absolute left-1/2 top-2.5 z-30 h-7 w-[88px] -translate-x-1/2 rounded-full bg-[#08080c]" />

                      <div className="absolute inset-0 flex flex-col">
                        <div className="flex items-center justify-between px-7 pb-2 pt-4">
                          <span className="tabular text-[11px] font-semibold text-white">9:41</span>
                          <div className="flex h-[10px] w-[18px] justify-end rounded-[3px] border border-white/50 p-[1px]">
                            <div className="h-full w-[12px] rounded-[1.5px] bg-white" />
                          </div>
                        </div>

                        <div className="flex items-center justify-between px-5 py-3">
                          <span className="font-mono text-[11px] font-semibold tracking-[0.15em] text-accent-primary">
                            A7X2K9
                          </span>
                          <span className="text-[11px] text-text-muted">Partner joined</span>
                        </div>

                        <div className="relative flex-1 px-4 pb-4">
                          <div className="absolute inset-x-6 bottom-6 top-3 rotate-3 rounded-2xl border border-white/5 bg-bg-tertiary opacity-50" />
                          <motion.div
                            animate={{ rotate: [-1.5, 1.5, -1.5] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-x-4 bottom-4 top-0 overflow-hidden rounded-2xl border border-white/10 shadow-xl"
                          >
                            <Image
                              src="/food-pasta.webp"
                              alt=""
                              fill
                              sizes="240px"
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/95 via-bg-primary/25 to-transparent" />
                            <div className="absolute bottom-5 left-4 right-4">
                              <p className="mb-1 text-[10px] font-semibold text-white/70">Italian</p>
                              <p className="mb-1 font-display text-xl font-bold text-white">
                                Trattoria Bella
                              </p>
                              <p className="tabular text-[11px] font-medium text-white/70">
                                0.9 km, $$$, 4.6
                              </p>
                            </div>
                          </motion.div>
                        </div>

                        <div className="flex justify-center gap-8 pb-8">
                          <div className="glass flex h-14 w-14 items-center justify-center rounded-full">
                            <X className="h-6 w-6 text-text-muted" strokeWidth={2.5} />
                          </div>
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-gradient shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_10px_24px_-6px_rgba(255,58,92,0.6)]">
                            <Heart className="h-6 w-6 text-white" fill="currentColor" strokeWidth={0} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <motion.div
                    animate={{ y: [-4, 4, -4] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="surface-glow absolute -right-10 top-14 z-20 flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-white"
                  >
                    <Heart className="h-4 w-4 text-accent-primary" fill="currentColor" strokeWidth={0} />
                    It&apos;s a match
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
