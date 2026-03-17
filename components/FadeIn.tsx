"use client"; // This is a client-side animation

import { motion } from "framer-motion";

export default function FadeIn({ 
  children, 
  delay = 0, 
  direction = "up", 
  fullWidth = false 
}: { 
  children: React.ReactNode, 
  delay?: number, 
  direction?: "up" | "down" | "left" | "right",
  fullWidth?: boolean
}) {
  
  // Set the initial direction
  const x = direction === "left" ? 40 : direction === "right" ? -40 : 0;
  const y = direction === "up" ? 40 : direction === "down" ? -40 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x, y }}      // Start invisible and slightly shifted
      whileInView={{ opacity: 1, x: 0, y: 0 }} // Animate to visible and original position
      viewport={{ once: true, margin: "-100px" }} // Trigger when 100px of the element is visible
      transition={{ duration: 0.7, delay, type: "spring", bounce: 0.3 }} // Smooth spring animation
      className={fullWidth ? "w-full" : "w-auto"}
    >
      {children}
    </motion.div>
  );
}