"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button, PageShell, PageHeading } from "@/components/ui";
import {
  Search,
  Loader2,
  MapPin,
  Info,
  Check,
  Globe,
} from "lucide-react";

interface LocationData {
  lat: number;
  lng: number;
  name: string;
}

// Popular cities for quick selection
const POPULAR_CITIES: LocationData[] = [
  { name: "Delhi", lat: 28.6139, lng: 77.209 },
  { name: "Mumbai", lat: 19.076, lng: 72.8777 },
  { name: "Bengaluru", lat: 12.9716, lng: 77.5946 },
  { name: "Pune", lat: 18.5204, lng: 73.8567 },
  { name: "Hyderabad", lat: 17.385, lng: 78.4867 },
  { name: "Chennai", lat: 13.0827, lng: 80.2707 },
];

function LocationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") || "create";
  const hasDetected = useRef(false);

  // Joiners don't need to select a location — redirect them to join page
  useEffect(() => {
    if (mode === "join") {
      router.replace("/room/join");
    }
  }, [mode, router]);

  const [location, setLocation] = useState<LocationData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);
  const [isInIframe, setIsInIframe] = useState(false);

  // Detect if running in iframe
  useEffect(() => {
    try {
      setIsInIframe(window.self !== window.top);
    } catch {
      setIsInIframe(true); // If we can't access window.top, we're in an iframe
    }
  }, []);

  const detectLocation = useCallback(() => {
    // Check if in iframe first
    let inIframe = false;
    try {
      inIframe = window.self !== window.top;
    } catch {
      inIframe = true;
    }

    if (inIframe) {
      setError(
        "GPS is blocked in preview mode. Please search for a city below or select a popular city.",
      );
      return;
    }

    setIsDetecting(true);
    setError("");

    if (!navigator.geolocation) {
      setError(
        "Geolocation is not supported by your browser. Please search for a city.",
      );
      setIsDetecting(false);
      return;
    }

    // Check permissions API first if available
    if (navigator.permissions) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((result) => {
          if (result.state === "denied") {
            setError(
              "Location access is blocked. Please enable it in browser settings or search for a city.",
            );
            setIsDetecting(false);
            return;
          }
        })
        .catch(() => {
          // Permissions API not fully supported, continue with geolocation
        });
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            { headers: { "User-Agent": "RESCHO-App/1.0" } },
          );
          const data = await response.json();
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.county ||
            "Current Location";

          setLocation({ lat: latitude, lng: longitude, name: city });
        } catch {
          setLocation({
            lat: latitude,
            lng: longitude,
            name: "Current Location",
          });
        }
        setIsDetecting(false);
      },
      (err) => {
        let errorMessage = "Location detection failed. ";

        // Check for permissions policy error (iframe restriction)
        if (
          err.message?.includes("permissions policy") ||
          err.message?.includes("Only secure origins")
        ) {
          errorMessage =
            "GPS is blocked in this preview. Please search for a city or select from popular cities below.";
        } else {
          switch (err.code) {
            case err.PERMISSION_DENIED:
              errorMessage =
                "Location access denied. Please enable permissions or search for a city.";
              break;
            case err.POSITION_UNAVAILABLE:
              errorMessage = "Location unavailable. Please search for a city.";
              break;
            case err.TIMEOUT:
              errorMessage =
                "Location request timed out. Please try again or search for a city.";
              break;
            default:
              errorMessage =
                "Please search for a city or select from popular cities below.";
          }
        }
        setError(errorMessage);
        setIsDetecting(false);
        console.error("Geolocation error:", err.code, err.message);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  }, []);

  const searchLocation = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`,
        { headers: { "User-Agent": "RESCHO-App/1.0" } },
      );
      const data = await response.json();

      if (data.length > 0) {
        setLocation({
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          name: data[0].display_name.split(",")[0],
        });
        setError("");
      } else {
        setError("Location not found. Please try a different search.");
      }
    } catch {
      setError("Failed to search location. Please try again.");
    }

    setIsLoading(false);
  };

  const selectCity = (city: LocationData) => {
    setLocation(city);
    setError("");
  };

  const handleContinue = () => {
    if (!location) return;
    sessionStorage.setItem("rescho_location", JSON.stringify(location));
    router.push(mode === "join" ? "/room/join" : "/room/create");
  };

  useEffect(() => {
    // Only auto-detect if not in iframe
    if (!hasDetected.current) {
      hasDetected.current = true;

      // Check iframe status before auto-detecting
      let inIframe = false;
      try {
        inIframe = window.self !== window.top;
      } catch {
        inIframe = true;
      }

      if (!inIframe) {
        const timer = setTimeout(() => detectLocation(), 100);
        return () => clearTimeout(timer);
      }
    }
  }, [detectLocation]);

  return (
    <PageShell>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PageHeading
            title={<>Choose your <span className="text-text-secondary">location</span></>}
            subtitle="Where do you want to find restaurants?"
          />

          {/* Iframe Notice */}
          {isInIframe && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="surface-glow mb-4 rounded-2xl p-3.5 text-sm text-text-secondary"
            >
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>
                  GPS is blocked in preview. Search for a city or select from
                  popular cities below.
                </span>
              </div>
            </motion.div>
          )}

          {/* Search */}
          <form
            onSubmit={searchLocation}
            role="search"
            className="mb-6 flex h-[52px] items-center gap-2 rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-bg-secondary/80 pl-4 pr-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-[border-color,box-shadow] focus-within:border-accent-primary/60 focus-within:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_0_4px_rgba(255,58,92,0.12)]"
          >
            <Search className="h-4 w-4 shrink-0 text-text-muted" aria-hidden />
            <label htmlFor="location-search" className="sr-only">
              Search city or neighborhood
            </label>
            <input
              id="location-search"
              type="search"
              placeholder="Search city or neighborhood"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-full min-w-0 flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
            />
            <Button
              type="submit"
              size="sm"
              disabled={isLoading || !searchQuery.trim()}
              className="rounded-xl"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
            </Button>
          </form>

          {/* Popular Cities */}
          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between gap-4">
              <p className="text-xs font-medium text-text-secondary">Popular in India</p>
              <p className="flex items-center gap-1.5 text-[11px] text-text-muted">
                <Globe className="h-3 w-3" />
                Search works worldwide
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {POPULAR_CITIES.map((city) => {
                const selected = location?.name === city.name;
                return (
                  <button
                    key={city.name}
                    type="button"
                    onClick={() => selectCity(city)}
                    aria-pressed={selected}
                    className={`h-9 rounded-full px-4 font-display text-xs font-semibold ${
                      selected
                        ? "bg-brand-gradient text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                        : "border border-white/[0.07] bg-gradient-to-b from-white/[0.05] to-white/[0.01] text-text-secondary shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:border-white/[0.14] hover:text-text-primary"
                    }`}
                  >
                    {city.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          {!isInIframe && (
            <>
              <div className="flex items-center gap-4 my-4">
                <div className="flex-1 h-px bg-white/[0.06]" />
                <span className="text-text-muted text-xs uppercase tracking-wider">or</span>
                <div className="flex-1 h-px bg-white/[0.06]" />
              </div>

              {/* Detect Location Button */}
              <button
                onClick={detectLocation}
                disabled={isDetecting}
                type="button"
                className="surface-glow group mb-4 flex w-full items-center gap-4 rounded-2xl p-4 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_20px_40px_-20px_rgba(0,0,0,0.8)]"
              >
                <div className="icon-tile h-11 w-11">
                  {isDetecting ? (
                    <Loader2 className="h-5 w-5 animate-spin text-white/80" />
                  ) : (
                    <MapPin className="h-5 w-5 text-white/80" />
                  )}
                </div>
                <div className="text-left flex-1">
                  <div className="font-semibold text-text-primary font-display text-sm">
                    Use current location
                  </div>
                  <div className="text-xs text-text-muted">
                    {isDetecting ? "Detecting..." : "Find restaurants around you"}
                  </div>
                </div>
              </button>
            </>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              role="alert"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 rounded-2xl border border-accent-error/20 bg-accent-error/10 p-3.5 text-xs leading-relaxed text-accent-error"
            >
              {error}
            </motion.div>
          )}

          {/* Selected Location */}
          {location && (
            <motion.div
              role="status"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="surface-glow mb-6 rounded-2xl p-4"
            >
              <div className="flex items-center gap-3">
                <div className="icon-tile h-10 w-10">
                  <Check className="w-5 h-5 text-accent-primary" />
                </div>
                <div>
                  <div className="font-display font-semibold text-text-primary">
                    {location.name}
                  </div>
                  <div className="tabular text-xs text-text-secondary">
                    {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Continue Button */}
          <Button
            variant="primary"
            size="lg"
            onClick={handleContinue}
            disabled={!location}
            className="w-full"
          >
            {location ? `Continue with ${location.name}` : "Pick a location to continue"}
          </Button>
        </motion.div>
    </PageShell>
  );
}

function LocationLoading() {
  return (
    <PageShell>
      <div className="w-full space-y-4" aria-busy="true" aria-label="Loading">
        <div className="skeleton h-9 w-40 rounded-xl" />
        <div className="skeleton h-4 w-64 rounded-md" />
        <div className="skeleton mt-6 h-[52px] w-full rounded-2xl" />
        <div className="flex gap-2">
          {[64, 72, 80, 56, 76].map((w) => (
            <div key={w} className="skeleton h-9 rounded-full" style={{ width: w }} />
          ))}
        </div>
      </div>
    </PageShell>
  );
}

export default function LocationPage() {
  return (
    <Suspense fallback={<LocationLoading />}>
      <LocationContent />
    </Suspense>
  );
}
