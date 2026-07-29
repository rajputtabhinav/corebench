"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/* Re-mounts on every navigation — gives each page a subtle fade-in.
   Opacity-only so it never creates a transform context that would break
   sticky/fixed descendants inside pages. */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
