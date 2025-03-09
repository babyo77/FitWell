"use client";
import { motion, AnimatePresence } from "framer-motion";
import { LoaderIcon } from "lucide-react";

function Loader() {
  return (
    <div className="flex flex-col items-center justify-center h-screen ">
      <AnimatePresence key={"loader"} mode="wait">
        <motion.div
          className="flex flex-col items-center justify-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="flex items-center gap-2"
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

          <div className=" w-full flex flex-col items-center justify-center">
            <motion.div
              className="text-center text-sm mt-2 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Loading your fitness journey...
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
      <motion.div
        className=" fixed bottom-7"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
      >
        <LoaderIcon className=" animate-spin " />
      </motion.div>
    </div>
  );
}

export default Loader;
