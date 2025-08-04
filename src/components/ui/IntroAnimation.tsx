"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const IntroAnimation = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 2500); // Animation duration in ms

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#162942] text-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-4xl font-bold tracking-widest"
          >
            KaHealth
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroAnimation;
