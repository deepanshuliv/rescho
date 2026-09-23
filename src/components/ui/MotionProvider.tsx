"use client";

import { MotionConfig } from "framer-motion";
import { ReactNode } from "react";

// Honors the OS "reduce motion" setting for every framer-motion animation.
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
