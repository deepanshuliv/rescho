"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button, ShareModal, PageShell, PageHeading } from "@/components/ui";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import {
  AlertTriangle,
  Check,
  Copy,
  MapPin,
  Plus,
  Share2,
} from "lucide-react";

interface LocationData {
  lat: number;
  lng: number;
  name: string;
}

export default function CreateRoomPage() {
  const router = useRouter();
  const { user } = useUser();
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [location, setLocation] = useState<LocationData | null>(null);

  useEffect(() => {
    // Get location from sessionStorage or redirect to location page
    const storedLocation = sessionStorage.getItem("rescho_location");

    if (!storedLocation) {
      router.push("/location?mode=create");
      return;
    }

    const locationData = JSON.parse(storedLocation) as LocationData;
    setLocation(locationData);

    // Create room first, then pre-fetch restaurants and register them with the room
    initializeRoom(locationData);
  }, [router]);

  const initializeRoom = async (loc: LocationData) => {
    try {
      // Generate userId before room creation so we can register the creator server-side
      const userId = uuidv4();

      // Step 1: Create the room (register creator at the same time)
      const response = await fetch("/api/rooms/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location: loc, userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to create room");
      }

      const data = await response.json();
      setRoomCode(data.code);
      setRoomId(data.roomId);

      // Store session data
      sessionStorage.setItem("rescho_user_id", userId);
      sessionStorage.setItem("rescho_room_id", data.roomId);
      sessionStorage.setItem("rescho_room_code", data.code);
      sessionStorage.setItem("rescho_is_creator", "true");

      setIsLoading(false);

      // Step 2: Pre-fetch restaurants and cache them for instant load on swipe page
      prefetchAndRegisterRestaurants(loc, data.roomId);
    } catch (err) {
      console.error(err);
      setError("Failed to create room. Please try again.");
      setIsLoading(false);
    }
  };

  const prefetchAndRegisterRestaurants = async (
    loc: LocationData,
    createdRoomId: string,
  ) => {
    try {
      const response = await fetch(
        `/api/restaurants?lat=${loc.lat}&lng=${loc.lng}&limit=15`,
      );
      const data = await response.json();
      if (data.restaurants && data.restaurants.length > 0) {
        // Cache locally for instant load on swipe page
        sessionStorage.setItem(
          "rescho_restaurants",
          JSON.stringify(data.restaurants),
        );
      }

      // Register restaurants server-side by triggering the state endpoint
      // This ensures the joiner gets the same list when they poll
      const userId = sessionStorage.getItem("rescho_user_id");
      if (userId && createdRoomId) {
        await fetch(
          `/api/rooms/${createdRoomId}/state?userId=${encodeURIComponent(userId)}`,
          { cache: "no-store" },
        );
      }
    } catch (err) {
      console.error(
        "Pre-fetch restaurants failed (will retry on swipe page):",
        err,
      );
    }
  };

  const copyCode = async () => {
    if (!roomCode) return;

    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = roomCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = () => {
    if (!roomCode) return;
    setIsShareModalOpen(true);
  };

  const startSwiping = () => {
    if (roomId) {
      router.push(`/room/${roomId}`);
    }
  };

  if (isLoading) {
    return (
      <PageShell hideBack>
        <div className="w-full text-center" aria-busy="true">
          <div className="skeleton mx-auto mb-3 h-10 w-56 rounded-xl" />
          <div className="skeleton mx-auto mb-10 h-4 w-64 rounded-md" />
          <div className="skeleton mb-6 h-44 w-full rounded-[1.75rem]" />
          <p className="text-sm text-text-secondary">Creating your room...</p>
        </div>
      </PageShell>
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
            We couldn&apos;t create your room
          </h1>
          <p className="mb-8 text-sm text-text-secondary">{error}</p>
          <div className="flex flex-col items-center gap-3">
            <Button onClick={() => window.location.reload()} className="w-full">
              Try again
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
    <PageShell backHref="/location?mode=create" backLabel="Change location">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <PageHeading
            align="center"
            title={<>Your room is <span className="text-text-secondary">ready</span></>}
            subtitle="Share this code with your partner so they can join."
          />

          {/* Room Code Display */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="surface-glow relative mb-6 rounded-[1.75rem] p-3"
          >
            <div className="halo -z-10" aria-hidden />
            <button
              type="button"
              onClick={copyCode}
              aria-label={`Room code ${roomCode}. Click to copy.`}
              className="w-full rounded-2xl py-7 hover:bg-white/[0.02]"
            >
              <span className="block pl-[0.3em] font-mono text-accent-primary text-5xl font-bold tracking-[0.3em]">
                {roomCode}
              </span>
              <span className="mt-3 block text-[11px] text-text-muted" aria-live="polite">
                {copied ? "Copied to clipboard" : "Tap the code to copy"}
              </span>
            </button>
            <div className="grid grid-cols-2 gap-2 border-t border-white/[0.05] pt-3">
              <Button variant="ghost" size="sm" onClick={copyCode} className="rounded-xl">
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-accent-primary" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy code
                  </>
                )}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleShare} className="rounded-xl">
                <Share2 className="h-4 w-4" />
                Share link
              </Button>
            </div>
          </motion.div>

          {/* Location Info */}
          {location && (
            <div className="flex items-center justify-center gap-2 text-sm text-text-secondary mb-8">
              <MapPin className="w-4 h-4 text-accent-primary" />
              <span>{location.name}</span>
            </div>
          )}

          {/* Waiting Animation with Human Image */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/15 bg-bg-tertiary">
                <img
                  src={user?.imageUrl || "/avatars/avatar-user.webp"}
                  alt={user?.firstName || "You"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-1.5" aria-hidden>
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2 }}
                    className="h-1.5 w-1.5 rounded-full bg-text-secondary"
                  />
                ))}
              </div>
              <div className="w-12 h-12 rounded-full bg-bg-tertiary/60 border border-white/[0.08] flex items-center justify-center">
                <Plus className="w-5 h-5 text-text-muted" />
              </div>
            </div>
            <p className="text-xs text-text-secondary" aria-live="polite">
              Waiting for your partner to join
            </p>
          </motion.div>

          {/* Start Button (for testing without partner) */}
          <Button
            variant="primary"
            size="lg"
            onClick={startSwiping}
            className="w-full"
          >
            Start Swiping
          </Button>
          <p className="mt-3 text-xs text-text-muted">
            You can start now. Your partner can join at any time.
          </p>
        </motion.div>

      {/* Share Modal */}
      {roomCode && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          roomCode={roomCode}
          url={typeof window !== "undefined" ? `${window.location.origin}/room/join?code=${roomCode}` : ""}
        />
      )}
    </PageShell>
  );
}
