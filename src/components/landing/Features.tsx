"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  Star,
  MapPin,
  Heart,
  Users,
  ArrowUpDown,
  X,
  Zap,
  Crosshair,
  HeartHandshake,
} from "lucide-react";

export default function Features() {
  return (
    <>
      {/* Bento Grid — Discover Section */}
      <section id="discover" className="section-padding">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <span className="text-accent-secondary text-caption font-semibold tracking-[0.2em] uppercase">
              Discover
            </span>
            <h2 className="text-headline mt-2 mb-3">
              Explore <span className="gradient-text-primary">Cuisines</span>{" "}
              You Love
            </h2>
            <p className="text-text-secondary text-body-lg max-w-md leading-relaxed">
              Create a room, invite your partner, and swipe through the best
              restaurants near you together.
            </p>
          </motion.div>

          {/* Bento Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-[auto] gap-5 md:gap-6">
            {/* Large featured card — spans 2 cols, 2 rows */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="col-span-2 row-span-2 group relative rounded-2xl overflow-hidden border border-white/[0.04] bg-bg-secondary min-h-[300px] md:min-h-[380px]"
            >
              <Image
                src="/food-sushi.webp"
                alt="Premium Sushi"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <div className="inline-flex items-center gap-2 bg-accent-primary/20 backdrop-blur-sm px-3 py-1.5 rounded-full mb-3">
                  <span className="text-sm">🍣</span>
                  <span className="text-accent-primary text-xs font-semibold tracking-wider">
                    PREMIUM PICK
                  </span>
                </div>
                <h3 className="text-title text-white mb-2">Japanese Cuisine</h3>
                <p className="text-white/60 text-body">
                  Discover the finest sushi, ramen, and izakaya spots in your
                  area
                </p>
                <div className="flex items-center gap-1 mt-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-accent-primary"
                      fill="currentColor"
                      strokeWidth={0}
                    />
                  ))}
                  <span className="text-white/50 text-caption ml-2">
                    4.9 Rating
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Stat card — top right */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="col-span-1 group relative rounded-2xl overflow-hidden border border-white/[0.04] bg-gradient-to-br from-accent-primary/[0.08] to-bg-secondary p-5 flex flex-col justify-between min-h-[170px]"
            >
              <div className="w-11 h-11 rounded-xl bg-accent-primary/15 flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5 text-accent-primary" />
              </div>
              <div>
                <p className="text-headline text-accent-primary">500+</p>
                <p className="text-text-secondary text-caption mt-1">
                  Restaurants Nearby
                </p>
              </div>
            </motion.div>

            {/* Pasta card — mid right */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="col-span-1 group relative rounded-2xl overflow-hidden border border-white/[0.04] bg-bg-secondary min-h-[170px]"
            >
              <Image
                src="/food-pasta.webp"
                alt="Italian pasta"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-white font-semibold text-base">Italian</p>
                <p className="text-white/50 text-xs mt-1">42 spots nearby</p>
              </div>
            </motion.div>

            {/* Burger card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="col-span-1 group relative rounded-2xl overflow-hidden border border-white/[0.04] bg-bg-secondary min-h-[170px]"
            >
              <Image
                src="/food-burger.webp"
                alt="Gourmet burger"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-white font-semibold text-base">Burgers</p>
                <p className="text-white/50 text-xs mt-1">38 spots nearby</p>
              </div>
            </motion.div>

            {/* Match percentage card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="col-span-1 group relative rounded-2xl overflow-hidden border border-white/[0.04] bg-gradient-to-br from-accent-primary/[0.08] to-bg-secondary p-5 flex flex-col justify-between min-h-[170px]"
            >
              <div className="w-11 h-11 rounded-xl bg-accent-primary/15 flex items-center justify-center mb-4">
                <Heart
                  className="w-5 h-5 text-accent-primary"
                  fill="currentColor"
                  strokeWidth={0}
                />
              </div>
              <div>
                <p className="text-headline text-accent-primary">92%</p>
                <p className="text-text-secondary text-caption mt-1">
                  Match Success Rate
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features — How It Works */}
      <section id="features" className="section-padding relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="text-accent-tertiary text-caption font-semibold tracking-[0.2em] uppercase">
              How It Works
            </span>
            <h2 className="text-headline mt-2 mb-3">
              Three Steps to Your{" "}
              <span className="gradient-text-vivid">Perfect Meal</span>
            </h2>
            <p className="text-text-secondary text-body-lg max-w-md mx-auto leading-relaxed">
              No more endless debates about where to eat. Create a room, invite your partner, and let the swiping decide your next date night destination!
            </p>
          </motion.div>

          {/* Bento feature cards */}
          <div className="grid md:grid-cols-3 gap-5">
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="group relative rounded-[16px] overflow-hidden border border-white/[0.04] bg-bg-secondary/60 backdrop-blur-sm p-7 hover:bg-bg-secondary hover:border-accent-primary/20 transition-all duration-500"
            >
              {/* Step number */}
              <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-accent-primary/10 flex items-center justify-center">
                <span className="text-accent-primary font-bold text-lg">1</span>
              </div>
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-primary/15 to-accent-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                <Users className="w-6 h-6 text-accent-primary" />
              </div>
              <h3 className="text-title text-white mb-2">
                Create &amp; Invite
              </h3>
              <p className="text-white/60 text-body leading-relaxed">
                One person sets the location and creates a room. Share the unique code with your partner so they can join instantly—no complicated sign-ups.
              </p>
              {/* Decorative line */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="group relative rounded-[16px] overflow-hidden border border-white/[0.04] bg-bg-secondary/60 backdrop-blur-sm p-7 hover:bg-bg-secondary hover:border-accent-secondary/20 transition-all duration-500"
            >
              <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-accent-secondary/10 flex items-center justify-center">
                <span className="text-accent-secondary font-bold text-lg">
                  2
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-secondary/15 to-accent-secondary/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                <ArrowUpDown className="w-6 h-6 text-accent-secondary" />
              </div>
              <h3 className="text-title text-white mb-2">
                Swipe Together
              </h3>
              <p className="text-white/60 text-body leading-relaxed">
                Both of you swipe through a curated list of local spots. Swipe right if you love it, left if you don&apos;t. We keep your choices hidden!
              </p>
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent-secondary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="group relative rounded-[16px] overflow-hidden border border-white/[0.04] bg-bg-secondary/60 backdrop-blur-sm p-7 hover:bg-bg-secondary hover:border-accent-tertiary/20 transition-all duration-500"
            >
              <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-accent-tertiary/10 flex items-center justify-center">
                <span className="text-accent-tertiary font-bold text-lg">
                  3
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-tertiary/15 to-accent-tertiary/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                <Heart
                  className="w-6 h-6 text-accent-tertiary"
                  fill="currentColor"
                  strokeWidth={0}
                />
              </div>
              <h3 className="text-title text-white mb-2">
                Match & Dine!
              </h3>
              <p className="text-white/60 text-body leading-relaxed">
                When you and your partner both swipe right on the same
                restaurant — it&apos;s a match! Time to book a table and eat! 🎉
              </p>
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent-tertiary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works — Visual Steps */}
      <section id="how-it-works" className="section-padding">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden border border-white/[0.06] bg-bg-secondary/40 backdrop-blur-xl p-8 md:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
          >
            {/* Background decoration - heavily reduced to avoid muddiness */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent-primary/[0.02] rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent-secondary/[0.02] rounded-full blur-[100px]" />

            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-accent-primary text-caption font-semibold tracking-[0.2em] uppercase">
                  Ready to Choose?
                </span>
                <h2 className="text-headline mt-2 mb-3 text-text-primary">
                  Stop debating.{" "}
                  <span className="gradient-text-primary">Start swiping.</span>
                </h2>
                <p className="text-text-secondary text-body-lg mb-8 leading-relaxed">
                  Connect with your partner in real-time. You both swipe through
                  the same restaurants independently, and let our algorithm find your
                  perfect match. It&apos;s that simple.
                </p>
                <div className="flex flex-wrap gap-4">
                  {/* Real-time */}
                  <div className="flex-1 min-w-[160px] flex items-center gap-3 glass hover:glass-light transition-all duration-300 rounded-2xl px-5 py-4 border border-white/5 hover:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_32px_rgba(255,58,92,0.1)] group cursor-default">
                    <div className="w-10 h-10 rounded-xl bg-accent-primary/10 group-hover:bg-accent-primary/20 flex items-center justify-center transition-colors duration-300 shrink-0">
                      <Zap
                        className="w-5 h-5 text-accent-primary"
                        fill="currentColor"
                        strokeWidth={0}
                      />
                    </div>
                    <div>
                      <p className="text-text-primary text-sm font-semibold mb-0.5">
                        Real-time
                      </p>
                      <p className="text-text-muted text-xs">Instant sync</p>
                    </div>
                  </div>
                  {/* Accurate */}
                  <div className="flex-1 min-w-[160px] flex items-center gap-3 glass hover:glass-light transition-all duration-300 rounded-2xl px-5 py-4 border border-white/5 hover:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_32px_rgba(192,24,46,0.1)] group cursor-default">
                    <div className="w-10 h-10 rounded-xl bg-accent-secondary/10 group-hover:bg-accent-secondary/20 flex items-center justify-center transition-colors duration-300 shrink-0">
                      <Crosshair className="w-5 h-5 text-accent-secondary" />
                    </div>
                    <div>
                      <p className="text-text-primary text-sm font-semibold mb-0.5">
                        Accurate
                      </p>
                      <p className="text-text-muted text-xs">GPS based</p>
                    </div>
                  </div>
                  {/* Fun */}
                  <div className="flex-1 min-w-[160px] flex items-center gap-3 glass hover:glass-light transition-all duration-300 rounded-2xl px-5 py-4 border border-white/5 hover:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_32px_rgba(122,15,30,0.15)] group cursor-default">
                    <div className="w-10 h-10 rounded-xl bg-accent-tertiary/10 group-hover:bg-accent-tertiary/20 flex items-center justify-center transition-colors duration-300 shrink-0">
                      <HeartHandshake className="w-5 h-5 text-accent-tertiary" />
                    </div>
                    <div>
                      <p className="text-text-primary text-sm font-semibold mb-0.5">
                        Fun
                      </p>
                      <p className="text-text-muted text-xs">Gamified UX</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-8 md:mt-0">
                {/* Phone mockup with swipe preview */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  {/* Phone Bezel */}
                  <div className="w-[280px] h-[520px] bg-black rounded-[3.5rem] p-3 shadow-[0_32px_64px_rgba(0,0,0,0.6)] relative z-10 ring-1 ring-white/10 border-[3px] border-[#2a2a2a]">
                    
                    {/* Hardware Buttons */}
                    <div className="absolute top-24 -left-[4px] w-1 h-8 bg-[#333] rounded-l-md" />
                    <div className="absolute top-36 -left-[4px] w-1 h-14 bg-[#333] rounded-l-md" />
                    <div className="absolute top-52 -left-[4px] w-1 h-14 bg-[#333] rounded-l-md" />
                    <div className="absolute top-40 -right-[4px] w-1 h-20 bg-[#333] rounded-r-md" />

                    {/* Phone Screen */}
                    <div className="w-full h-full rounded-[2.75rem] overflow-hidden bg-bg-secondary relative">
                      
                      {/* Dynamic Island */}
                      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-[90px] h-7 bg-black rounded-full z-30 flex items-center justify-between px-2.5">
                        <div className="w-2 h-2 rounded-full bg-white/10" />
                        <div className="w-2.5 h-2.5 rounded-full bg-white/10 relative">
                          <div className="absolute inset-0 m-auto w-1 h-1 bg-[#1a1a1a] rounded-full" />
                        </div>
                      </div>

                      {/* Phone screen content */}
                      <div className="absolute inset-0 flex flex-col pt-1">
                        {/* Status bar */}
                        <div className="flex items-center justify-between px-7 pt-3 pb-2 z-20 relative">
                          <span className="text-[11px] text-white font-semibold">
                            9:41
                          </span>
                          <div className="flex items-center gap-1.5 opacity-90">
                            {/* Simplified battery icon */}
                            <div className="w-[18px] h-[10px] border border-white/50 rounded-[3px] p-[1px] flex justify-end">
                              <div className="w-[12px] h-full bg-white rounded-[1.5px]" />
                            </div>
                          </div>
                        </div>

                        {/* App Header */}
                        <div className="flex items-center justify-between px-5 pt-3 pb-3">
                          <span className="text-[11px] text-text-muted font-medium">
                            Room: A7X2
                          </span>
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent-tertiary shadow-[0_0_8px_rgba(122,15,30,0.6)] animate-pulse" />
                            <span className="text-[11px] text-text-muted font-medium">
                              Connected
                            </span>
                          </div>
                        </div>

                        {/* Card stack */}
                        <div className="flex-1 px-4 pb-4 relative">
                          {/* Back card */}
                          <div className="absolute inset-x-6 top-3 bottom-6 rounded-2xl bg-bg-tertiary opacity-40 transform rotate-3 border border-white/5" />
                          {/* Front card */}
                          <motion.div
                            animate={{ rotate: [-1.5, 1.5, -1.5] }}
                            transition={{
                              duration: 4,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            className="absolute inset-x-4 top-0 bottom-4 rounded-2xl overflow-hidden border border-white/10 shadow-xl"
                          >
                            <Image
                              src="/food-pasta.webp"
                              alt="Restaurant preview"
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/95 via-bg-primary/30 to-transparent" />
                            <div className="absolute bottom-5 left-4 right-4">
                              <div className="inline-flex items-center gap-1 glass-light border border-white/10 px-2.5 py-1 rounded-full mb-2 shadow-md">
                                <span className="text-white text-[10px] font-semibold tracking-wide">
                                  Italian
                                </span>
                              </div>
                              <p className="text-white font-display font-bold text-xl mb-1 drop-shadow-md">
                                Trattoria Bella
                              </p>
                              <p className="text-white/80 text-[11px] font-medium">
                                0.9km • $$$ • 9.0★
                              </p>
                            </div>
                          </motion.div>
                        </div>
                        
                        {/* Action buttons */}
                        <div className="flex justify-center gap-8 pb-8">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-14 h-14 rounded-full glass border border-white/10 shadow-lg flex items-center justify-center cursor-pointer group"
                          >
                            <X
                              className="w-6 h-6 text-text-muted group-hover:text-accent-error transition-colors"
                              strokeWidth={2.5}
                            />
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-14 h-14 rounded-full glass border border-white/10 shadow-lg flex items-center justify-center cursor-pointer group"
                          >
                            <Heart
                              className="w-6 h-6 text-accent-primary"
                              fill="currentColor"
                              strokeWidth={0}
                            />
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Floating match notification */}
                  <motion.div
                    animate={{ y: [-4, 4, -4], x: [2, -2, 2] }}
                    transition={{
                      duration: 3.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute top-12 -right-14 glass border border-white/10 text-white text-sm font-bold px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-2.5 z-20"
                  >
                    <span className="text-xl drop-shadow-md">🎉</span>
                    <span className="drop-shadow-sm">It&apos;s a Match!</span>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
