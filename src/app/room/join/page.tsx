"use client";

import { Suspense, useEffect, useRef, useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button, PageShell, PageHeading } from "@/components/ui";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import { AlertCircle } from "lucide-react";

const CODE_LENGTH = 6;

const cleanCode = (value: string) =>
  value.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, CODE_LENGTH);

export default function JoinRoomPage() {
  return (
    <Suspense>
      <JoinRoomContent />
    </Suspense>
  );
}

function JoinRoomContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  // Prefill from shared links: /room/join?code=ABC123
  const [code, setCode] = useState(() => cleanCode(searchParams.get("code") ?? ""));
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCodeChange = (value: string) => {
    // Only allow alphanumeric and convert to uppercase
    setCode(cleanCode(value));
    setError("");
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const joinRoom = async (e?: FormEvent) => {
    e?.preventDefault();
    if (code.length !== CODE_LENGTH) {
      setError("Enter the full 6-character room code.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const userId = uuidv4();

      const response = await fetch("/api/rooms/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to join room");
      }

      // Store session data
      sessionStorage.setItem("rescho_user_id", userId);
      sessionStorage.setItem("rescho_room_id", data.roomId);
      sessionStorage.setItem("rescho_room_code", code);
      sessionStorage.setItem("rescho_location", JSON.stringify(data.location));
      sessionStorage.setItem("rescho_is_creator", "false");
      // Clear any previously cached restaurants — joiner gets the creator's list
      sessionStorage.removeItem("rescho_restaurants");

      // Navigate to swipe page
      router.push(`/room/${data.roomId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join room");
      setIsLoading(false);
    }
  };

  const activeIndex = Math.min(code.length, CODE_LENGTH - 1);

  return (
    <PageShell>
        <motion.form
          onSubmit={joinRoom}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          noValidate
        >
          <PageHeading
            title={<>Join a <span className="text-text-secondary">room</span></>}
            subtitle="Enter the 6-character code your partner shared with you."
          />

          <label htmlFor="room-code" className="mb-3 block text-xs font-medium text-text-secondary">
            Room code
          </label>
          <div className="relative mb-3">
            <input
              ref={inputRef}
              id="room-code"
              type="text"
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              maxLength={CODE_LENGTH}
              autoComplete="one-time-code"
              autoCapitalize="characters"
              spellCheck={false}
              aria-invalid={!!error}
              aria-describedby={error ? "code-error" : undefined}
              className="absolute inset-0 z-10 h-full w-full cursor-text opacity-0"
            />
            <div className="grid grid-cols-6 gap-2 sm:gap-2.5" aria-hidden>
              {Array.from({ length: CODE_LENGTH }).map((_, i) => {
                const char = code[i];
                const isActive = isFocused && i === activeIndex;
                return (
                  <div
                    key={i}
                    className={`flex aspect-[4/5] items-center justify-center rounded-2xl border bg-gradient-to-b font-mono text-2xl font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-[border-color,box-shadow,background-color] duration-200 sm:text-3xl ${
                      error
                        ? "border-accent-error/40 from-accent-error/[0.06] to-transparent"
                        : isActive
                          ? "border-accent-primary/60 from-white/[0.05] to-bg-secondary shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_0_3px_rgba(255,58,92,0.1)]"
                          : char
                            ? "border-white/[0.14] from-white/[0.06] to-bg-secondary"
                            : "border-white/[0.07] from-white/[0.04] to-bg-secondary/60"
                    }`}
                  >
                    {char ? (
                      <motion.span
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-text-primary"
                      >
                        {char}
                      </motion.span>
                    ) : isActive ? (
                      <span className="h-7 w-[2px] animate-pulse rounded-full bg-accent-primary" />
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mb-8 min-h-5">
            {error ? (
              <motion.p
                id="code-error"
                role="alert"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1.5 text-xs text-accent-error"
              >
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {error}
              </motion.p>
            ) : (
              <p className="tabular text-xs text-text-muted">
                {code.length}/{CODE_LENGTH} characters
              </p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={code.length !== CODE_LENGTH}
            isLoading={isLoading}
            loadingText="Joining..."
            className="w-full"
          >
            Join Room
          </Button>

          <p className="mt-8 text-center text-sm text-text-muted">
            Don&apos;t have a code?{" "}
            <Link
              href="/location?mode=create"
              className="font-semibold text-text-secondary underline-offset-4 hover:text-text-primary hover:underline"
            >
              Create a new room
            </Link>
          </p>
        </motion.form>
    </PageShell>
  );
}
