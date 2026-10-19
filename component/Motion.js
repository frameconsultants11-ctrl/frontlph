"use client";
import { motion } from "framer-motion";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export function MotionGrid({ children, className }) {
  return <motion.div variants={container} initial="hidden" animate="show" className={className}>{children}</motion.div>;
}

export function MotionItem({ children, className }) {
  return (
    <motion.div variants={item} whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 22 }} className={className}>
      {children}
    </motion.div>
  );
}

export function FadeIn({ children, className }) {
  return <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={className}>{children}</motion.div>;
}