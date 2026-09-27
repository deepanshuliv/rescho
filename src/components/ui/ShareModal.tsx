"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, Send, Twitter, Copy, MoreHorizontal, Check } from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomCode: string;
  url: string;
  title?: string;
  text?: string;
}

export default function ShareModal({
  isOpen,
  onClose,
  roomCode,
  url,
  title = "Join my Rescho Room!",
  text = "Join my restaurant matching room on Rescho! Use code: ",
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const fullText = `${text}${roomCode}`;

  const canNativeShare = useSyncExternalStore(
    () => () => {},
    () => !!navigator.share,
    () => false,
  );

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: <MessageCircle className="w-6 h-6 text-[#25D366]" />,
      onClick: () => window.open(`https://wa.me/?text=${encodeURIComponent(fullText + " " + url)}`, "_blank"),
    },
    {
      name: "Telegram",
      icon: <Send className="w-5 h-5 text-[#229ED9]" />,
      onClick: () => window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(fullText)}`, "_blank"),
    },
    {
      name: "X (Twitter)",
      icon: <Twitter className="w-5 h-5 text-white" />,
      onClick: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(fullText)}&url=${encodeURIComponent(url)}`, "_blank"),
    },
    {
      name: copied ? "Copied" : "Copy link",
      icon: copied ? <Check className="w-5 h-5 text-accent-primary" /> : <Copy className="w-5 h-5 text-text-primary" />,
      onClick: handleCopy,
    },
    canNativeShare && {
      name: "More options",
      icon: <MoreHorizontal className="w-6 h-6 text-text-secondary" />,
      onClick: () => {
        if (navigator.share) {
          navigator.share({ title, text: fullText, url }).catch(console.error);
        }
      },
    },
  ].filter((o): o is Exclude<typeof o, false> => Boolean(o));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            aria-hidden
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center p-4 pb-8"
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="share-title"
              className="surface-glow rounded-[2rem] w-full max-w-sm overflow-hidden">
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-12 h-1.5 rounded-full bg-white/10" />
              </div>
              <div className="px-6 pb-4 pt-2 border-b border-white/[0.04] flex items-center justify-between">
                <h2 id="share-title" className="text-2xl font-bold font-display">
                  <span className="text-text-secondary">Share</span> Room
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  autoFocus
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="px-6 pt-5">
                <p className="mb-1 text-xs text-text-muted">Room code</p>
                <p className="pl-[0.2em] font-mono text-accent-primary text-2xl font-bold tracking-[0.2em]">
                  {roomCode}
                </p>
              </div>
              <div className="p-6 pb-8 flex flex-wrap justify-center gap-6">
                {shareOptions.map((option) => (
                  <button
                    type="button"
                    key={option.name === "Copied" ? "Copy link" : option.name}
                    onClick={option.onClick}
                    className="flex flex-col items-center gap-2 group w-[72px]"
                  >
                    <div className="icon-tile h-14 w-14 rounded-full transition-[transform,border-color,background-color] duration-300 group-hover:-translate-y-1 group-hover:border-white/[0.14] group-hover:bg-white/[0.07]">
                      {option.icon}
                    </div>
                    <span className="text-[11px] text-text-secondary group-hover:text-text-primary transition-colors font-medium text-center leading-tight">
                      {option.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
