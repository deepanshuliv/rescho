"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/**
 * Reads a sessionStorage value during render. Returns null on the server and
 * during hydration, then the stored value on the client.
 *
 * Values are only written by our own navigation flow before the page mounts,
 * so there is no change event to subscribe to.
 */
export function useSessionItem(key: string): string | null {
  return useSyncExternalStore(
    noopSubscribe,
    () => {
      try {
        return sessionStorage.getItem(key);
      } catch {
        return null;
      }
    },
    () => null,
  );
}
