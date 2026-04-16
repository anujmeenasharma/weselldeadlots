"use client";
import { ReactLenis, useLenis } from "lenis/react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// Inner component that has access to the Lenis instance via context
function LenisRouteSync() {
  const lenis = useLenis();
  const pathname = usePathname();

  useEffect(() => {
    if (!lenis) return;
    // After every route change, wait for React to finish painting the new page
    // then tell Lenis to recalculate the full document height.
    const timer = setTimeout(() => {
      lenis.resize();
    }, 150);
    return () => clearTimeout(timer);
  }, [pathname, lenis]);

  return null;
}

export default function ClientLayout({ children }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 1000);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const scrollSettings = isMobile
    ? {
        duration: 0.8,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
        smoothTouch: true,
        touchMultiplier: 1.5,
      }
    : {
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 2,
      };

  return (
    <ReactLenis root options={scrollSettings}>
      <LenisRouteSync />
      {children}
    </ReactLenis>
  );
}