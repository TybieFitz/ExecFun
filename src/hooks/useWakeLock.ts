import { useEffect, useRef } from "react";

export function useWakeLock() {
  const sentinelRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    if (!navigator.wakeLock) return;

    let cancelled = false;

    async function acquire() {
      if (cancelled || document.visibilityState !== "visible") return;

      try {
        if (sentinelRef.current && !sentinelRef.current.released) return;

        sentinelRef.current = await navigator.wakeLock.request("screen");

        sentinelRef.current.addEventListener("release", onRelease);
      } catch {
        // Unsupported, denied, or unavailable — fail silently
      }
    }

    function onRelease() {
      if (!cancelled && document.visibilityState === "visible") {
        void acquire();
      }
    }

    function onVisibilityChange() {
      if (document.visibilityState === "visible") {
        void acquire();
      }
    }

    void acquire();
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisibilityChange);

      const sentinel = sentinelRef.current;
      if (sentinel) {
        sentinel.removeEventListener("release", onRelease);
        void sentinel.release();
        sentinelRef.current = null;
      }
    };
  }, []);
}
