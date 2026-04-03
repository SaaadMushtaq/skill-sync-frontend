import { motion } from "framer-motion";

interface AnimatedBlobProps {
  color: string;
  size: string;
  position: string;
  duration: number;
  delay?: number;
}

export default function AnimatedBlob({
  color,
  size,
  position,
  duration,
  delay = 0,
}: AnimatedBlobProps) {
  return (
    <motion.div
      className={`rounded-full blur-3xl ${color} ${size} ${position}`}
      animate={{
        x: [0, 30, -20, 0],
        y: [0, -40, 20, 0],
        scale: [1, 1.1, 0.9, 1],
      }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}
