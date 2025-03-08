"use client";

import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import { Camera, Upload, X } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";
import { FoodAnalysisDrawer, AnalysisResponse } from "./FoodAnalysisDrawer";

interface CameraCaptureProps {
  onClose: () => void;
}

function CameraCapture({ onClose }: CameraCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(
    null
  );

  const videoConstraints = {
    facingMode: { exact: "environment" },
    width: { ideal: 1920 },
    height: { ideal: 1080 },
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      setShowDrawer(true);
    }
  }, []);

  const handleAnalyze = async (imageData: string) => {
    try {
      setIsLoading(true);
      const base64Response = await fetch(imageData);
      const blob = await base64Response.blob();

      const formData = new FormData();
      formData.append("image", blob, "food.png");

      const response = await fetch(
        "https://fitwell-backend.onrender.com/calorie/analyze/",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setAnalysisResult({
          calories_info: { foods: [] },
          error: data.message || "Failed to analyze image",
        });
        return;
      }

      if (!data.calories_info?.foods?.length) {
        setAnalysisResult({
          calories_info: { foods: [] },
          error: "No food detected in the image",
        });
        return;
      }

      setAnalysisResult(data);
    } catch (error) {
      setAnalysisResult({
        calories_info: { foods: [] },
        error: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setShowDrawer(false);
    setCapturedImage(null);
    setAnalysisResult(null);
    onClose();
  };

  const handleRetake = () => {
    setShowDrawer(false);
    setCapturedImage(null);
    setAnalysisResult(null);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="h-full w-full object-cover"
        />
        <motion.button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white z-10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="h-6 w-6" />
        </motion.button>
        <motion.button
          onClick={capture}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white text-black px-8 py-3 rounded-full z-10"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
          }}
        >
          Capture
        </motion.button>
      </motion.div>

      <Drawer
        open={showDrawer}
        onOpenChange={(open) => {
          if (!open) {
            handleRetake();
          }
        }}
      >
        <FoodAnalysisDrawer
          image={capturedImage}
          isLoading={isLoading}
          analysisResult={analysisResult}
          onRetake={handleRetake}
          onAnalyze={handleAnalyze}
          onClose={handleClose}
        />
      </Drawer>
    </AnimatePresence>
  );
}

export default function BottomNav() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [showUploadDrawer, setShowUploadDrawer] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(
    null
  );

  const handleAnalyze = async (imageData: string) => {
    try {
      setIsUploading(true);
      const base64Response = await fetch(imageData);
      const blob = await base64Response.blob();

      const formData = new FormData();
      formData.append("image", blob, "food.png");

      const response = await fetch(
        "https://fitwell-backend.onrender.com/calorie/analyze/",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setAnalysisResult({
          calories_info: { foods: [] },
          error: data.message || "Failed to analyze image",
        });
        return;
      }

      if (!data.calories_info?.foods?.length) {
        setAnalysisResult({
          calories_info: { foods: [] },
          error: "No food detected in the image",
        });
        return;
      }

      setAnalysisResult(data);
    } catch (error) {
      setAnalysisResult({
        calories_info: { foods: [] },
        error: "Something went wrong. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setUploadedImage(imageData);
        setShowUploadDrawer(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCloseUpload = () => {
    setShowUploadDrawer(false);
    setUploadedImage(null);
    setAnalysisResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!user) return null;
  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 border-t bg-white border-gray-200">
        <div className="flex justify-around items-center h-16">
          <Link
            href="/"
            className={`flex flex-col items-center ${
              pathname === "/" ? "text-black" : "text-gray-400"
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="text-xs mt-1">Home</span>
          </Link>

          <Link
            href="/diary"
            className={`flex flex-col items-center ${
              pathname === "/diary" ? "text-black" : "text-gray-400"
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <span className="text-xs mt-1">Diary</span>
          </Link>

          <Drawer>
            <DrawerTrigger asChild>
              <button className="flex flex-col items-center">
                <div className="bg-black rounded-full p-3 -mt-0.5">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
              </button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Add food to your diary</DrawerTitle>
                <DrawerDescription>
                  Scan your food to get the nutritional information
                </DrawerDescription>
              </DrawerHeader>
              <div className="mx-auto w-full max-w-sm p-4 pt-0">
                <div className="flex flex-col gap-4">
                  <DrawerClose asChild>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full"
                      onClick={() => setShowCamera(true)}
                    >
                      <Camera className="mr-2 h-5 w-5" />
                      Scan
                    </Button>
                  </DrawerClose>

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                  />

                  <Button
                    variant="outline"
                    size={"lg"}
                    className="w-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="mr-2 h-5 w-5" />
                    Upload
                  </Button>
                </div>
              </div>
            </DrawerContent>
          </Drawer>

          <Link
            href="/plans"
            className={`flex flex-col items-center ${
              pathname === "/plans" ? "text-black" : "text-gray-400"
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <span className="text-xs mt-1">Plans</span>
          </Link>

          <Link
            href="/more"
            className={`flex flex-col items-center ${
              pathname === "/more" ? "text-black" : "text-gray-400"
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <span className="text-xs mt-1">More</span>
          </Link>
        </div>
      </nav>

      <Drawer
        open={showUploadDrawer}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseUpload();
          }
        }}
      >
        <FoodAnalysisDrawer
          image={uploadedImage}
          isLoading={isUploading}
          analysisResult={analysisResult}
          onRetake={handleCloseUpload}
          onAnalyze={handleAnalyze}
          onClose={handleCloseUpload}
        />
      </Drawer>

      {showCamera && (
        <CameraCapture
          onClose={() => {
            setShowCamera(false);
          }}
        />
      )}
    </>
  );
}
