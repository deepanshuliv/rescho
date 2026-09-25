"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Button from "../ui/Button";
import FloatingHearts from "../ui/FloatingHearts";
import { useAuth } from "@clerk/nextjs";
import { ArrowRight, Star, Heart, UtensilsCrossed } from "lucide-react";

const AVATARS = [
  { src: "/avatars/avatar-1.webp", alt: "Aanya" },
  { src: "/avatars/avatar-2.webp", alt: "Kabir" },
  { src: "/avatars/avatar-3.webp", alt: "Meera" },
  { src: "/avatars/avatar-4.webp", alt: "Rohan" },
];

const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const { isSignedIn } = useAuth();

  // Where "Create Room" should take the user
  const createRoomHref = isSignedIn
    ? "/location?mode=create"
    : "/sign-in?redirect_url=%2Flocation%3Fmode%3Dcreate";

  return (
    <section className="relative min-h-[100dvh] overflow-hidden pb-20 lg:pb-28">
      {/* Ambient light */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-40 left-1/4 h-[700px] w-[700px] rounded-full bg-accent-primary/[0.05] blur-[150px]" />
      </div>
      <FloatingHearts />

      {/* Hero Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-28 sm:pt-32 lg:px-12 lg:pt-40">
        <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
          {/* Left: copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease }}
              className="surface-glow mb-7 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5"
            >
              <UtensilsCrossed className="h-3.5 w-3.5 text-accent-primary" />
              <span className="text-xs font-medium text-text-primary/80">
                The easy way to choose your food
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18, ease }}
              className="text-display mb-7 max-w-[12ch]"
            >
              Swipe &amp; match your{" "}
              <span className="gradient-text-primary">perfect restaurant</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.26, ease }}
              className="text-body-lg mb-10 max-w-[44ch] text-text-secondary"
            >
              Connect with your partner and swipe through restaurants together.
              When you both like the same place, it&apos;s a match.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.34, ease }}
              className="mb-14 flex flex-wrap items-center gap-x-6 gap-y-4"
            >
              <Button href={createRoomHref} size="lg" className="group">
                Create Room
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Button>
              <Link
                href="/room/join"
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-text-secondary hover:text-text-primary"
              >
                I have a room code
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center gap-4"
            >
              <div className="flex -space-x-2.5">
                {AVATARS.map((person) => (
                  <div
                    key={person.src}
                    className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-bg-primary"
                  >
                    <Image
                      src={person.src}
                      alt={person.alt}
                      fill
                      className="object-cover"
                      sizes="36px"
                    />
                  </div>
                ))}
              </div>
              <div className="border-l border-white/[0.08] pl-4">
                <p className="font-display text-sm font-semibold text-text-primary">
                  2k+ happy couples
                </p>
                <p className="text-xs text-text-muted">found their dinner spot</p>
              </div>
            </motion.div>
          </div>

          {/* Right: image with an overlapping match card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease }}
            className="relative mx-auto w-full max-w-lg lg:mr-0"
          >
            <div className="halo" aria-hidden />
            <div className="surface-glow tile-shine relative overflow-hidden rounded-[2rem] p-1.5">
              <div className="relative overflow-hidden rounded-[1.6rem]">
              <div className="relative aspect-[4/5] sm:aspect-square">
                <Image
                  src="/hero-food.webp"
                  alt="A plated gourmet dish on a dark table"
                  fill
                  sizes="(min-width: 1024px) 512px, 100vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/70 via-transparent to-transparent" />
              </div>
              </div>

              {/* Rating badge */}
              <div className="surface-glow absolute right-6 top-6 rounded-2xl px-4 py-3">
                <p className="text-[11px] text-text-muted">Rated by our couples</p>
                <div className="mt-1 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="h-3 w-3 text-accent-primary"
                      fill="currentColor"
                      strokeWidth={0}
                    />
                  ))}
                  <span className="tabular ml-1 text-xs font-semibold text-text-primary">
                    4.9
                  </span>
                </div>
              </div>
            </div>

            {/* Overlapping match card */}
            <motion.div
              initial={{ opacity: 0, y: 16, rotate: -4 }}
              animate={{ opacity: 1, y: 0, rotate: -3 }}
              transition={{ duration: 0.7, delay: 0.7, ease }}
              className="surface-glow absolute -bottom-8 left-4 flex w-[260px] items-center gap-3 rounded-2xl p-3 sm:-left-8"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/10">
                <Image
                  src="/food-sushi.webp"
                  alt=""
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold text-accent-primary">
                  <motion.span
                    animate={{ scale: [1, 1.25, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 1.4 }}
                    className="inline-flex"
                  >
                    <Heart className="h-3 w-3" fill="currentColor" strokeWidth={0} />
                  </motion.span>
                  It&apos;s a match
                </p>
                <p className="truncate font-display text-sm font-semibold text-text-primary">
                  Sakura Omakase
                </p>
                <p className="text-[11px] text-text-muted">Japanese, 1.2 km away</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
