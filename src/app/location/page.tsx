"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui";
import Link from "next/link";
import {
  ChevronLeft,
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

  const searchLocation = async () => {
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
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-accent-secondary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/[0.05] hover:border-white/[0.1] text-text-secondary hover:text-white transition-all duration-300 hover:shadow-[0_4px_16px_rgba(255,255,255,0.05)] active:scale-95 mb-8 w-fit group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-sm font-medium font-display">Back</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold font-display mb-2">
            Choose Your <span className="gradient-text-primary">Location</span>
          </h1>
          <p className="text-text-secondary mb-6 text-sm">
            Where do you want to find restaurants?
          </p>

          {/* Iframe Notice */}
          {isInIframe && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-accent-secondary/10 border border-accent-secondary/20 rounded-2xl p-3.5 mb-4 text-accent-secondary text-sm"
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

          {/* Search Input - Now Primary */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Search city or neighborhood..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchLocation()}
              className="flex-1 bg-bg-secondary/90 border border-white/[0.06] rounded-2xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary/50 transition-colors"
            />
            <Button
              variant="primary"
              onClick={searchLocation}
              disabled={isLoading || !searchQuery.trim()}
              className="px-4"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </Button>
          </div>

          {/* Popular Cities */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs text-text-muted font-medium">Popular cities (India):</div>
              <div className="flex items-center gap-1.5 text-[10px] text-accent-primary font-medium px-2.5 py-1 rounded-full border border-accent-primary/20 bg-accent-primary/10">
                <Globe className="w-3 h-3" />
                Global Search Supported
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {POPULAR_CITIES.map((city) => (
                <button
                  key={city.name}
                  onClick={() => selectCity(city)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold font-display transition-all ${
                    location?.name === city.name
                      ? "bg-accent-primary text-white shadow-[0_4px_16px_rgba(255,58,92,0.3)]"
                      : "bg-bg-secondary/80 text-text-secondary hover:bg-bg-tertiary hover:text-text-primary border border-white/[0.03]"
                  }`}
                >
                  {city.name}
                </button>
              ))}
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
                className="w-full p-4 bg-bg-secondary/70 rounded-2xl border border-white/[0.04] hover:border-accent-primary/30 transition-all mb-4 flex items-center gap-4 group"
              >
                <div className="w-11 h-11 rounded-xl bg-accent-primary/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                  {isDetecting ? (
                    <Loader2 className="w-5 h-5 text-accent-primary animate-spin" />
                  ) : (
                    <MapPin className="w-5 h-5 text-accent-primary" />
                  )}
                </div>
                <div className="text-left flex-1">
                  <div className="font-semibold text-text-primary font-display text-sm">
                    Use Current Location
                  </div>
                  <div className="text-xs text-text-muted">
                    {isDetecting ? "Detecting..." : "Auto-detect your location"}
                  </div>
                </div>
              </button>
            </>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-accent-error/10 border border-accent-error/20 rounded-2xl p-3 mb-4 text-accent-error text-xs"
            >
              {error}
            </motion.div>
          )}

          {/* Selected Location */}
          {location && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-accent-primary/10 border border-accent-primary/20 rounded-2xl p-4 mb-6"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent-primary/20 flex items-center justify-center">
                  <Check className="w-5 h-5 text-accent-primary" />
                </div>
                <div>
                  <div className="font-semibold text-accent-primary font-display">
                    {location.name}
                  </div>
                  <div className="text-xs text-text-secondary">
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
            Continue to {mode === "join" ? "Join Room" : "Create Room"}
          </Button>
        </motion.div>
      </div>
    </main>
  );
}

function LocationLoading() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-accent-primary border-t-transparent rounded-full animate-spin" />
    </main>
  );
}

export default function LocationPage() {
  return (
    <Suspense fallback={<LocationLoading />}>
      <LocationContent />
    </Suspense>
  );
}
