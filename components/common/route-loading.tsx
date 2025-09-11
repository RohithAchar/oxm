"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function RouteLoadingBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // When either the path or query changes, show a brief loading bar
    setVisible(true);

    // Keep it visible for at least 300ms to make it noticeable
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setVisible(false), 500);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams?.toString()]);

  if (!visible) return null;

  return (
    <div className="fixed left-0 right-0 top-14 z-[60]">
      <div className="h-0.5 w-full overflow-hidden bg-transparent">
        <div className="h-full w-full origin-left animate-[loadingBar_0.5s_ease-out] bg-primary" />
      </div>
      <style jsx>{`
        @keyframes loadingBar {
          from { transform: scaleX(0.1); opacity: 0.7; }
          to { transform: scaleX(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}


