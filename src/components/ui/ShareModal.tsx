"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

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
      bg: "bg-gradient-to-br from-[#25D366]/20 to-[#25D366]/5 border border-[#25D366]/10",
      shadow: "shadow-[0_8px_24px_rgba(37,211,102,0.15)] group-hover:shadow-[0_8px_32px_rgba(37,211,102,0.25)]",
    },
    {
      name: "Telegram",
      icon: <Send className="w-5 h-5 text-[#229ED9]" />,
      onClick: () => window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(fullText)}`, "_blank"),
      bg: "bg-gradient-to-br from-[#229ED9]/20 to-[#229ED9]/5 border border-[#229ED9]/10",
      shadow: "shadow-[0_8px_24px_rgba(34,158,217,0.15)] group-hover:shadow-[0_8px_32px_rgba(34,158,217,0.25)]",
    },
    {
      name: "X (Twitter)",
      icon: <Twitter className="w-5 h-5 text-white" />,
      onClick: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(fullText)}&url=${encodeURIComponent(url)}`, "_blank"),
      bg: "bg-gradient-to-br from-white/15 to-white/5 border border-white/10",
      shadow: "shadow-[0_8px_24px_rgba(255,255,255,0.1)] group-hover:shadow-[0_8px_32px_rgba(255,255,255,0.15)]",
    },
    {
      name: "Copy Link",
      icon: copied ? <Check className="w-5 h-5 text-accent-primary" /> : <Copy className="w-5 h-5 text-text-primary" />,
      onClick: handleCopy,
      bg: "bg-gradient-to-br from-accent-primary/20 to-accent-primary/5 border border-accent-primary/10",
      shadow: "shadow-[0_8px_24px_rgba(255,58,92,0.15)] group-hover:shadow-[0_8px_32px_rgba(255,58,92,0.25)]",
    },
    {
      name: "More Options",
      icon: <MoreHorizontal className="w-6 h-6 text-text-secondary" />,
      onClick: () => {
        if (navigator.share) {
          navigator.share({ title, text: fullText, url }).catch(console.error);
        }
      },
      bg: "bg-gradient-to-br from-white/5 to-transparent border border-white/[0.05]",
      shadow: "shadow-[0_8px_24px_rgba(0,0,0,0.2)] group-hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
    },
  ];

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
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center p-4 pb-8"
          >
            <div className="bg-bg-secondary/95 backdrop-blur-3xl rounded-[2rem] border border-white/[0.06] w-full max-w-sm shadow-2xl overflow-hidden relative">
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-12 h-1.5 rounded-full bg-white/10" />
              </div>
              <div className="px-6 pb-4 pt-2 border-b border-white/[0.04] flex items-center justify-between">
                <h2 className="text-2xl font-bold font-display">
                  <span className="gradient-text-primary">Share</span> Room
                </h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 pb-8 flex flex-wrap justify-center gap-6">
                {shareOptions.map((option, i) => (
                  <button
                    key={i}
                    onClick={option.onClick}
                    className="flex flex-col items-center gap-2 group w-[72px]"
                  >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${option.bg} ${option.shadow} group-hover:-translate-y-1 group-active:scale-95 transition-all duration-300`}>
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
