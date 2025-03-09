"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell } from "lucide-react";

function Loader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 1;
      });
    }, 10);

    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className="flex flex-col items-center justify-center h-screen ">
      <AnimatePresence>
        <motion.div
          className="flex flex-col items-center justify-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="flex items-center gap-2 mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.8,
              type: "spring",
              stiffness: 100,
              delay: 0.2,
            }}
          >
            <motion.h1 className="text-4xl font-bold tracking-tighter">
              FitWell
            </motion.h1>
          </motion.div>

          <div className="w-64 mb-3">
            <div className="h-2 w-full  rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-black"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
              />
            </div>
            <motion.div
              className="text-center text-sm mt-2 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {progress < 100 ? "Loading your fitness journey..." : "Ready!"}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default Loader;
