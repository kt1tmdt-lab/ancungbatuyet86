"use client";

import React from "react";
import { motion, Variants } from "framer-motion";

export interface CurtainHoverProps {
  children: React.ReactNode;
  overlayContent: React.ReactNode;
  overlayHeight?: string; // Optional custom height override (e.g. "h-[45%]")
  overlayMode?: "partial" | "full" | "admin";
  className?: string; // Wrapper classes
  overlayClassName?: string; // Overlay inner classes
  disabled?: boolean;
}

// Framer Motion Variants
export const curtainOverlay: Variants = {
  initial: { y: "100%" },
  hover: {
    y: "0%",
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const curtainContent: Variants = {
  initial: { opacity: 0, y: 12 },
  hover: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.08,
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const subtleImageHover: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.015,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function CurtainHover({
  children,
  overlayContent,
  overlayHeight,
  overlayMode = "partial",
  className = "",
  overlayClassName = "",
  disabled = false,
}: CurtainHoverProps) {
  // Determine height based on mode
  let heightClass = "h-[45%]";
  if (overlayMode === "full") {
    heightClass = "h-full";
  } else if (overlayMode === "admin") {
    heightClass = "h-[55%]";
  }

  // Override height if overlayHeight is explicitly provided
  if (overlayHeight) {
    heightClass = overlayHeight;
  }

  // Default overlay styling: dark background with clear white text
  const baseOverlayClass = `absolute bottom-0 left-0 right-0 z-20 flex flex-col justify-center items-center pointer-events-none px-4 py-3 select-none text-white font-extrabold ${heightClass}`;
  
  // Choose standard background if none is custom defined
  const bgClass = overlayClassName.includes("bg-")
    ? overlayClassName
    : `bg-slate-950/90 backdrop-blur-[1px] ${overlayClassName}`;

  return (
    <motion.div
      initial="initial"
      whileHover={disabled ? undefined : "hover"}
      className={`group relative overflow-hidden ${className}`}
    >
      {children}
      
      {!disabled && (
        <motion.div
          variants={curtainOverlay}
          className={`${baseOverlayClass} ${bgClass}`}
        >
          <motion.div variants={curtainContent} className="w-full flex items-center justify-center gap-1.5 text-center text-sm uppercase tracking-wider">
            {overlayContent}
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
