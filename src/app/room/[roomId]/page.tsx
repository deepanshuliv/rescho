"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SwipeStack, MatchModal } from "@/components/swipe";
import { Button, ShareModal, AppHeader, PageShell } from "@/components/ui";
import { Restaurant } from "@/types";
import Image from "next/image";
import { useSessionItem } from "@/lib/ui/useSessionItem";
import {
  X,
  Heart,
  Plus,
  AlertTriangle,
  WifiOff,
  Share2,
  LogOut,
} from "lucide-react";

// Poll state from server every 2.5 seconds
const POLL_INTERVAL = 2500;

export default function SwipePage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.roomId as string;

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [matches, setMatches] = useState<Restaurant[]>([]);
  const [seenMatchIds, setSeenMatchIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [partnerConnected, setPartnerConnected] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [swipeCount, setSwipeCount] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("Connecting to room...");

  // Match modal state
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [currentMatch, setCurrentMatch] = useState<Restaurant | null>(null);

  // Matches drawer state
  const [showMatches, setShowMatches] = useState(false);
  const [showShare, setShowShare] = useState(false);

  // Values written to sessionStorage by the create/join pages
  const storedRoomCode = useSessionItem("rescho_room_code");
  const isCreator = useSessionItem("rescho_is_creator") === "true";
  const cachedRaw = useSessionItem("rescho_restaurants");
  const cachedRestaurants = useMemo<Restaurant[]>(() => {
    if (!isCreator || !cachedRaw) return [];
    try {
      const parsed = JSON.parse(cachedRaw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return []; // ignore corrupt cache
    }
  }, [isCreator, cachedRaw]);

  // The creator starts on the cached list; the server's copy replaces it on first poll
  const displayRestaurants = restaurants.length > 0 ? restaurants : cachedRestaurants;
  const showLoading = isLoading && displayRestaurants.length === 0;
  const displayRoomCode = roomCode || storedRoomCode || "";

  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const initDoneRef = useRef(false);
  const restaurantsLoadedRef = useRef(false);
  const userIdRef = useRef<string | null>(null);

  // ─────────────────────────────────────────────────────────────
  // Core state poll — loads restaurants, partner status, matches
  // ─────────────────────────────────────────────────────────────
  const pollRoomState = useCallback(async () => {
    const userId = userIdRef.current;
    if (!userId || !roomId) return;

    try {
      const res = await fetch(
        `/api/rooms/${roomId}/state?userId=${encodeURIComponent(userId)}`,
        { cache: "no-store" },
      );

      if (!res.ok) {
        if (res.status === 404) {
          setError("Room not found. It may have expired.");
          setIsLoading(false);
          return;
        }
        setIsConnected(false);
        return;
      }

      const data = await res.json();
      setIsConnected(true);

      // Update partner status
      setPartnerConnected(data.partnerConnected);

      // Set room code once
      if (data.code && !roomCode) {
        setRoomCode(data.code);
      }

      // Load restaurants once (first time they're available)
      if (!restaurantsLoadedRef.current && data.restaurants?.length > 0) {
        setRestaurants(data.restaurants);
        restaurantsLoadedRef.current = true;
        setIsLoading(false);
        setIsConnected(true);
      }

      // Detect NEW matches (avoid showing modal for already-seen matches)
      if (data.matches?.length > 0) {
        const newMatchIds = data.matches.filter(
          (id: string) => !seenMatchIds.has(id),
        );
        if (newMatchIds.length > 0) {
          // Find restaurant objects for new matches
          const allRestaurants: Restaurant[] =
            restaurants.length > 0 ? restaurants : data.restaurants || [];
          for (const matchId of newMatchIds) {
            const matchedRestaurant = allRestaurants.find(
              (r) => r.id === matchId,
            );
            if (matchedRestaurant) {
              setCurrentMatch(matchedRestaurant);
              setMatches((prev) => {
                if (prev.some((r) => r.id === matchId)) return prev;
                return [...prev, matchedRestaurant];
              });
              setShowMatchModal(true);
            }
          }
          setSeenMatchIds((prev) => {
            const updated = new Set(prev);
            newMatchIds.forEach((id: string) => updated.add(id));
            return updated;
          });
        }
      }
    } catch {
      setIsConnected(false);
    }
  }, [roomId, roomCode, seenMatchIds, restaurants]);

  // ─────────────────────────────────────────────────────────────
  // Initialization
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (initDoneRef.current) return;
    initDoneRef.current = true;

    const userId = sessionStorage.getItem("rescho_user_id");

    if (!userId) {
      router.push("/");
      return;
    }

    userIdRef.current = userId;

    // Show loading message progression for joiner
    if (sessionStorage.getItem("rescho_is_creator") !== "true") {
      const msgs = [
        "Connecting to room...",
        "Loading restaurant list...",
        "Almost ready...",
      ];
      let idx = 0;
      const msgTimer = setInterval(() => {
        idx = (idx + 1) % msgs.length;
        setLoadingMessage(msgs[idx]);
      }, 1800);
      setTimeout(() => clearInterval(msgTimer), 12000);
    }

    // First poll right away; the interval effect below keeps it going
    setTimeout(pollRoomState, 0);
  }, [router, pollRoomState]);

  // ─────────────────────────────────────────────────────────────
  // Polling intervals — start after init, keep alive
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    // Don't start polling until we have a userId
    if (!userIdRef.current) return;

    pollTimerRef.current = setInterval(pollRoomState, POLL_INTERVAL);

    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [pollRoomState]);

  // ─────────────────────────────────────────────────────────────
  // Swipe handler — POST to REST API, poll faster for matches
  // ─────────────────────────────────────────────────────────────
  const handleSwipe = useCallback(
    async (restaurantId: string, direction: "left" | "right") => {
      const userId = userIdRef.current;
      if (!userId) return;

      setSwipeCount((prev) => prev + 1);

      try {
        const res = await fetch("/api/rooms/swipe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomId, userId, restaurantId, direction }),
        });

        if (!res.ok) return;

        const data = await res.json();

        // If it's a match, immediately update UI without waiting for next poll
        if (data.isMatch && data.matchedRestaurant) {
          const matchId = data.matchedRestaurant.id;
          if (!seenMatchIds.has(matchId)) {
            setCurrentMatch(data.matchedRestaurant);
            setMatches((prev) => {
              if (prev.some((r) => r.id === matchId)) return prev;
              return [...prev, data.matchedRestaurant];
            });
            setShowMatchModal(true);
            setSeenMatchIds((prev) => new Set(prev).add(matchId));
          }
        }

        // Also poll immediately after a right-swipe to catch the partner's match
        if (direction === "right") {
          setTimeout(pollRoomState, 300);
          setTimeout(pollRoomState, 1200);
        }
      } catch (err) {
        console.error("Swipe failed:", err);
      }
    },
    [roomId, seenMatchIds, pollRoomState],
  );

  // Close the matches drawer with Escape
  useEffect(() => {
    if (!showMatches) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowMatches(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showMatches]);

  const handleLeaveRoom = () => {
    if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    sessionStorage.removeItem("rescho_room_id");
    sessionStorage.removeItem("rescho_room_code");
    sessionStorage.removeItem("rescho_is_creator");
    sessionStorage.removeItem("rescho_restaurants");
    router.push("/");
  };

  // ─────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────
  if (showLoading) {
    return (
      <div className="flex min-h-[100dvh] flex-col">
      <AppHeader />
      <main className="flex flex-1 flex-col items-center justify-center px-5 pb-10">
        <div className="w-full max-w-sm" aria-busy="true">
          <div className="skeleton relative h-[440px] w-full overflow-hidden rounded-[1.75rem]">
            <div className="absolute inset-x-6 bottom-6 space-y-3">
              <div className="h-6 w-24 rounded-full bg-white/[0.05]" />
              <div className="h-8 w-3/4 rounded-lg bg-white/[0.06]" />
              <div className="h-4 w-full rounded-md bg-white/[0.04]" />
              <div className="h-4 w-2/3 rounded-md bg-white/[0.04]" />
            </div>
          </div>
          <div className="mt-8 flex justify-center gap-8">
            <div className="skeleton h-[4.5rem] w-[4.5rem] rounded-full" />
            <div className="skeleton h-[4.5rem] w-[4.5rem] rounded-full" />
          </div>
          <motion.p
            key={loadingMessage}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 text-center text-sm text-text-secondary"
            aria-live="polite"
          >
            {loadingMessage}
          </motion.p>
          <p className="mt-1 text-center text-xs text-text-muted">
            This can take a few seconds on first load
          </p>
        </div>
      </main>
      </div>
    );
  }

  if (error) {
    return (
      <PageShell>
        <div className="text-center" role="alert">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-accent-error/20 bg-accent-error/10">
            <AlertTriangle className="h-6 w-6 text-accent-error" />
          </div>
          <h1 className="mb-2 font-display text-xl font-semibold text-text-primary">
            We couldn&apos;t open this room
          </h1>
          <p className="mb-8 text-sm text-text-secondary">{error}</p>
          <div className="flex flex-col gap-3">
            <Button href="/room/join" className="w-full">
              Enter a different code
            </Button>
            <Button href="/" variant="ghost" className="w-full">
              Back to home
            </Button>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <main className="flex min-h-[100dvh] flex-col">
      {/* Header: same floating islands as the rest of the site */}
      <AppHeader
        left={
          <button
            type="button"
            onClick={handleLeaveRoom}
            className="island group flex h-12 items-center gap-2 pl-1.5 pr-4 font-display text-[13px] font-medium text-white/60 hover:text-white"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.05] transition-colors group-hover:bg-white/[0.1]">
              <LogOut className="h-4 w-4" />
            </span>
            <span className="hidden sm:inline">Leave room</span>
          </button>
        }
        center={
          <button
            type="button"
            onClick={() => displayRoomCode && setShowShare(true)}
            className="island group flex h-12 items-center gap-3 pl-5 pr-1.5"
            aria-label={`Room code ${displayRoomCode}. Share with your partner.`}
          >
            <span className="hidden text-[11px] font-medium text-text-muted sm:inline">Room</span>
            <span className="pl-[0.15em] font-mono text-[15px] font-bold tracking-[0.15em] text-accent-primary">
              {displayRoomCode}
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.05] text-white/60 transition-colors group-hover:bg-white/[0.1] group-hover:text-white">
              <Share2 className="h-4 w-4" />
            </span>
          </button>
        }
        right={
          <div className="flex items-center gap-2">
            {!isConnected && (
              <span
                className="island flex h-12 items-center gap-1.5 px-4 text-[12px] font-medium text-accent-error"
                role="status"
              >
                <WifiOff className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Offline</span>
              </span>
            )}
            <button
              type="button"
              onClick={() => setShowMatches(true)}
              aria-label={`View matches (${matches.length})`}
              className="island group flex h-12 items-center gap-2 pl-1.5 pr-4 font-display text-[13px] font-medium text-white/60 hover:text-white"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.05] transition-colors group-hover:bg-white/[0.1]">
                <Heart
                  className={`h-4 w-4 ${matches.length > 0 ? "text-accent-primary" : ""}`}
                  fill="currentColor"
                  strokeWidth={0}
                />
              </span>
              <span className="hidden sm:inline">Matches</span>
              <motion.span
                key={matches.length}
                initial={{ scale: 0.7 }}
                animate={{ scale: 1 }}
                className="tabular text-white"
              >
                {matches.length}
              </motion.span>
            </button>
          </div>
        }
      />

      {/* Partner status */}
      <div className="mx-auto mt-6 w-full max-w-sm px-4">
        <div className="island flex h-12 items-center justify-between pl-2 pr-4">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="relative h-8 w-8 overflow-hidden rounded-full ring-2 ring-zinc-950">
                <Image
                  src="/avatars/avatar-user.webp"
                  alt="You"
                  fill
                  className="object-cover"
                  sizes="32px"
                />
              </div>
              <AnimatePresence mode="wait">
                {partnerConnected ? (
                  <motion.div
                    key="connected"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="relative h-8 w-8 overflow-hidden rounded-full ring-2 ring-zinc-950"
                  >
                    <Image
                      src="/avatars/avatar-partner.webp"
                      alt="Partner"
                      fill
                      className="object-cover"
                      sizes="32px"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="waiting"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-dashed border-white/[0.15] bg-zinc-900 ring-2 ring-zinc-950"
                  >
                    <Plus className="h-3.5 w-3.5 text-text-muted" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <p className="font-display text-[13px] font-medium text-text-primary" aria-live="polite">
              {partnerConnected ? "Partner joined" : "Waiting for partner"}
            </p>
          </div>
          <span className="tabular text-[12px] text-text-muted">{swipeCount} seen</span>
        </div>
      </div>

      {/* Swipe Area */}
      <div className="flex-1 overflow-hidden px-4 py-5">
        <SwipeStack
          restaurants={displayRestaurants}
          onSwipe={handleSwipe}
          matchCount={matches.length}
          keyboardEnabled={!showMatchModal && !showMatches && !showShare}
        />
      </div>

      {/* Footer Attribution */}
      <footer className="px-4 pb-3 pt-1 text-center">
        <a
          href="https://foursquare.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-text-muted hover:text-text-secondary transition-colors inline-flex items-center gap-1"
        >
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.727 3.465c-.322-.188-.534-.188-.961-.188H7.13c-.749 0-1.069.32-1.069 1.07v16.653c0 .749.32 1.07 1.07 1.07h.214c.535 0 .749-.214.963-.535l4.172-5.883c.107-.107.214-.214.428-.214h2.033c.642 0 .963-.321 1.07-.856l1.927-10.058c.107-.428-.107-.856-.211-1.059z" />
          </svg>
          Powered by Foursquare
        </a>
      </footer>

      {/* Match Modal */}
      <MatchModal
        isOpen={showMatchModal}
        onClose={() => setShowMatchModal(false)}
        restaurant={currentMatch}
        onContinue={() => setShowMatchModal(false)}
        onViewMatches={() => {
          setShowMatchModal(false);
          setShowMatches(true);
        }}
      />

      {/* Share Modal */}
      {displayRoomCode && (
        <ShareModal
          isOpen={showShare}
          onClose={() => setShowShare(false)}
          roomCode={displayRoomCode}
          url={
            typeof window !== "undefined"
              ? `${window.location.origin}/room/join?code=${displayRoomCode}`
              : ""
          }
        />
      )}

      {/* Matches Drawer */}
      <AnimatePresence>
        {showMatches && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowMatches(false)}
              aria-hidden
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="matches-title"
              className="fixed bottom-0 right-0 top-0 z-50 w-full max-w-sm overflow-y-auto border-l border-white/[0.06] bg-bg-secondary/95 backdrop-blur-2xl"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.04] bg-bg-secondary/90 px-5 py-4 backdrop-blur-xl">
                <h2 id="matches-title" className="font-display text-xl font-bold">
                  Matches{" "}
                  <span className="tabular text-text-muted">{matches.length}</span>
                </h2>
                <button
                  type="button"
                  onClick={() => setShowMatches(false)}
                  aria-label="Close matches"
                  autoFocus
                  className="flex h-9 w-9 items-center justify-center rounded-full text-text-secondary hover:bg-white/[0.06] hover:text-text-primary"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {matches.length === 0 ? (
                <div className="px-8 py-16 text-center">
                  <div className="icon-tile mx-auto mb-5 h-14 w-14">
                    <Heart className="h-6 w-6 text-accent-primary" />
                  </div>
                  <p className="font-display font-semibold text-text-primary">
                    No matches yet
                  </p>
                  <p className="mx-auto mt-1.5 max-w-[26ch] text-xs text-text-muted">
                    When you both swipe right on the same place, it shows up here.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 p-4">
                  {matches.map((restaurant) => (
                    <motion.div
                      key={restaurant.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="surface-glow flex gap-4 rounded-2xl p-3"
                    >
                      <div
                        className="icon-tile relative h-14 w-14 shrink-0 overflow-hidden"
                      >
                        <span
                          aria-hidden
                          className="absolute inset-0 opacity-30"
                          style={{
                            background:
                              restaurant.gradient ||
                              "linear-gradient(135deg, #37474f 0%, #263238 50%, #1a1a2e 100%)",
                          }}
                        />
                        <span className="relative font-display text-xl font-bold text-white/90">
                          {restaurant.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-text-primary font-display truncate text-sm">
                          {restaurant.name}
                        </h3>
                        <p className="text-xs font-medium text-text-secondary">
                          {restaurant.cuisine}
                        </p>
                        {restaurant.priceLevel && (
                          <p className="text-[11px] text-accent-primary font-medium mt-0.5">
                            {restaurant.priceLevel}
                          </p>
                        )}
                        <p className="text-[11px] text-text-muted mt-1 truncate">
                          {restaurant.address}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
