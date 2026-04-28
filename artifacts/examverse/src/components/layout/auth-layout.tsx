import { ReactNode } from "react";
import { motion } from "framer-motion";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-background relative overflow-hidden">
      {/* Paper grain SVG noise overlay */}
      <svg className="pointer-events-none fixed isolate z-50 opacity-[0.03] mix-blend-multiply" width="100%" height="100%">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-[440px] px-4 py-8"
      >
        <div className="bg-card shadow-xl rounded-2xl overflow-hidden border border-border flex flex-col relative">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

export function TornEdgeDivider() {
  return (
    <div className="w-full h-4 relative -mt-2 mb-6 z-10 text-card">
      <svg viewBox="0 0 1000 20" preserveAspectRatio="none" className="w-full h-full fill-current drop-shadow-sm">
        <path d="M0,0 L0,20 L15,15 L30,20 L45,12 L60,18 L75,10 L90,19 L105,11 L120,20 L135,14 L150,19 L165,12 L180,18 L195,10 L210,19 L225,11 L240,20 L255,13 L270,18 L285,11 L300,19 L315,14 L330,20 L345,12 L360,18 L375,10 L390,19 L405,11 L420,20 L435,13 L450,18 L465,11 L480,19 L495,14 L510,20 L525,12 L540,18 L555,10 L570,19 L585,11 L600,20 L615,13 L630,18 L645,11 L660,19 L675,14 L690,20 L705,12 L720,18 L735,10 L750,19 L765,11 L780,20 L795,13 L810,18 L825,11 L840,19 L855,14 L870,20 L885,12 L900,18 L915,10 L930,19 L945,11 L960,20 L975,14 L990,19 L1000,15 L1000,0 Z" />
      </svg>
    </div>
  );
}
