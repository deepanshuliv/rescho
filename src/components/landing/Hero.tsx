"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Button from "../ui/Button";
import { useAuth, UserButton } from "@clerk/nextjs";
import {
  ArrowRight,
  ArrowDown,
  Star,
  UtensilsCrossed,
} from "lucide-react";

export default function Hero() {
  const { isSignedIn } = useAuth();

  // Where "Create Room" should take the user
  const createRoomHref = isSignedIn
    ? "/location?mode=create"
    : "/sign-in?redirect_url=%2Flocation%3Fmode%3Dcreate";

  return (
    <section className="min-h-screen relative overflow-hidden">
      {/* Background Effects — Vibrant multi-color orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 left-1/4 w-[700px] h-[700px] bg-accent-primary/[0.07] rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/6 w-[600px] h-[600px] bg-accent-secondary/[0.06] rounded-full blur-[150px]" />
        <div className="absolute top-1/2 -left-20 w-[400px] h-[400px] bg-accent-tertiary/[0.04] rounded-full blur-[120px]" />
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-30 max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-12 py-5"
      >
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/logo.webp"
            alt="RESCHO Logo"
            width={36}
            height={36}
            className="object-contain mix-blend-screen transition-transform duration-300 group-hover:scale-105"
            priority
          />
          <span className="text-xl font-bold font-display text-white tracking-tight group-hover:text-accent-primary transition-colors duration-200">
            RESCHO
          </span>
        </Link>

        {/* Center Nav Capsule */}
        <div className="hidden md:flex items-center gap-1 bg-bg-secondary/60 backdrop-blur-2xl border border-white/[0.08] p-1.5 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <a
            href="#features"
            className="px-5 py-2 rounded-full text-sm font-semibold font-display text-text-secondary hover:text-white hover:bg-white/[0.08] hover:shadow-[0_2px_8px_rgba(255,255,255,0.05)] transition-all duration-300"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="px-5 py-2 rounded-full text-sm font-semibold font-display text-text-secondary hover:text-white hover:bg-white/[0.08] hover:shadow-[0_2px_8px_rgba(255,255,255,0.05)] transition-all duration-300"
          >
            How It Works
          </a>
          <a
            href="#discover"
            className="px-5 py-2 rounded-full text-sm font-semibold font-display text-text-secondary hover:text-white hover:bg-white/[0.08] hover:shadow-[0_2px_8px_rgba(255,255,255,0.05)] transition-all duration-300"
          >
            Discover
          </a>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2.5">
          <Link href="/room/join">
            <button className="text-sm font-bold font-display text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] hover:border-white/[0.2] px-5 py-2.5 rounded-xl transition-all duration-300 hover:shadow-[0_4px_16px_rgba(255,255,255,0.05)] active:scale-95">
              Join Room
            </button>
          </Link>

          {isSignedIn ? (
            <>
              <Link href="/location?mode=create">
                <button className="text-xs font-semibold font-display bg-gradient-to-r from-accent-primary to-[#d4284a] text-white px-5 py-2.5 rounded-xl hover:shadow-[0_8px_24px_rgba(255,58,92,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
                  Create Room
                </button>
              </Link>
              <UserButton
                appearance={{
                  variables: {
                    colorPrimary: "#ff3a5c",
                  },
                  elements: {
                    avatarBox: "w-9 h-9 ring-2 ring-[#ff3a5c]/30",
                    userButtonPopoverCard:
                      "bg-[#0e0e14] border border-white/[0.06] shadow-2xl",
                    userButtonPopoverActionButton:
                      "text-[#f0f0f5] hover:bg-[#16161f]",
                    userButtonPopoverActionButtonText: "text-[#f0f0f5]",
                    userButtonPopoverFooter: "hidden",
                  },
                }}
              />
            </>
          ) : (
            <Link href={createRoomHref}>
              <button className="text-xs font-semibold font-display bg-gradient-to-r from-accent-primary to-[#d4284a] text-white px-5 py-2.5 rounded-xl hover:shadow-[0_8px_24px_rgba(255,58,92,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
                Get Started
              </button>
            </Link>
          )}
        </div>
      </motion.nav>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 pt-8 lg:pt-14">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — Text Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light mb-6"
            >
              <UtensilsCrossed className="w-4 h-4 text-accent-primary" />
              <span className="text-accent-primary text-xs font-medium tracking-[0.15em] uppercase">
                Easy Way to Choose Your Food
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-display mb-6"
            >
              <span className="text-text-primary">Swipe &amp; Match </span>
              <br />
              <span className="text-text-primary">Your Perfect </span>
              <br />
              <span className="gradient-text-primary">Restaurant!</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-text-secondary text-body-lg max-w-md mb-10 leading-relaxed"
            >
              Connect with your partner and swipe through restaurants together.
              When you both like the same place — it&apos;s a match!
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4 mb-12"
            >
              <Link href={createRoomHref}>
                <Button variant="primary" size="lg">
                  <span className="flex items-center gap-2.5">
                    Create Room
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </Button>
              </Link>
              <Link href="/room/join" className="group">
                <span className="flex items-center gap-2 text-accent-secondary font-semibold group-hover:text-accent-secondary/80 transition-colors text-sm">
                  Join Room
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    →
                  </span>
                </span>
              </Link>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex items-center gap-4"
            >
              <div className="flex -space-x-2.5">
                {[
                  { src: '/avatars/avatar-1.webp', alt: 'Sarah' },
                  { src: '/avatars/avatar-2.webp', alt: 'David' },
                  { src: '/avatars/avatar-3.webp', alt: 'Elena' },
                  { src: '/avatars/avatar-4.webp', alt: 'Michael' },
                ].map((person, i) => (
                  <div
                    key={i}
                    className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-bg-primary"
                  >
                    <Image
                      src={person.src}
                      alt={person.alt}
                      fill
                      className="object-cover"
                      sizes="32px"
                    />
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full ring-2 ring-bg-primary bg-accent-primary/20 flex items-center justify-center">
                  <span className="text-accent-primary text-xs font-bold font-display">
                    2k+
                  </span>
                </div>
              </div>
              <div>
                <p className="text-text-primary text-sm font-semibold font-display">
                  Happy Couples
                </p>
                <p className="text-text-muted text-xs">
                  found their dinner spot
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right — Hero Image with floating elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            {/* Main food image in a glassy container */}
            <div className="relative rounded-3xl overflow-hidden border border-white/[0.06] bg-bg-secondary/50 backdrop-blur-sm shadow-2xl">
              <div className="relative aspect-square max-w-lg mx-auto">
                <Image
                  src="/hero-food.webp"
                  alt="Gourmet food"
                  fill
                  className="object-cover"
                  priority
                />
                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/70 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-l from-bg-primary/30 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-accent-primary/[0.03]" />
              </div>

              {/* Floating rating badge */}
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-5 right-5 glass rounded-xl px-4 py-2.5 shadow-xl"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex -space-x-1">
                    {["😊", "😄", "🤩"].map((e, i) => (
                      <span key={i} className="text-base">
                        {e}
                      </span>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">
                      Our Happy Customers
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className="w-3 h-3 text-accent-primary"
                          fill="currentColor"
                          strokeWidth={0}
                        />
                      ))}
                      <span className="text-xs text-text-primary font-semibold ml-1">
                        4.9
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Floating decorative elements */}
            {/* 1. Top Left - Pizza */}
            <motion.div
              animate={{ y: [-8, 8, -8], rotate: [-5, 5, -5] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -left-6 w-16 h-16 rounded-2xl glass-light shadow-[0_8px_32px_rgba(255,58,92,0.2)] flex items-center justify-center text-3xl z-20"
            >
              <span className="drop-shadow-md">🍕</span>
            </motion.div>

            {/* 2. Center Right - Taco */}
            <motion.div
              animate={{ y: [6, -6, 6], rotate: [10, -5, 10] }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute top-[40%] -right-8 w-14 h-14 rounded-full glass shadow-[0_8px_24px_rgba(255,58,92,0.15)] flex items-center justify-center text-2xl z-20"
            >
              <span className="drop-shadow-md">🌮</span>
            </motion.div>

            {/* 3. Bottom Right - Sushi */}
            <motion.div
              animate={{ y: [-5, 5, -5], rotate: [0, 15, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="absolute -bottom-4 right-12 w-12 h-12 rounded-xl glass-light shadow-[0_8px_32px_rgba(255,58,92,0.25)] flex items-center justify-center text-xl z-20"
            >
              <span className="drop-shadow-md">🍣</span>
            </motion.div>

            {/* 4. Bottom Left - Burger */}
            <motion.div
              animate={{ y: [8, -8, 8], rotate: [-10, 0, -10] }}
              transition={{
                duration: 5.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5,
              }}
              className="absolute bottom-8 -left-8 w-14 h-14 rounded-full glass shadow-[0_8px_24px_rgba(255,58,92,0.15)] flex items-center justify-center text-2xl z-20"
            >
              <span className="drop-shadow-md">🍔</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-text-muted flex flex-col items-center gap-2"
        >
          <span className="text-xs tracking-[0.25em] uppercase">Scroll</span>
          <ArrowDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}
