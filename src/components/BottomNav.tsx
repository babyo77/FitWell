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
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";

interface CameraCaptureProps {
  onCapture: (image: string) => void;
  onClose: () => void;
}

function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      setStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError(
        "Unable to access camera. Please make sure you have granted camera permissions."
      );
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(videoRef.current, 0, 0);
      const imageData = canvas.toDataURL("image/jpeg");
      onCapture(imageData);
      stopCamera();
      onClose();
    }
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="relative flex-1">
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center flex-col gap-4 p-4">
            <div className="text-white text-center">
              <svg
                className="w-12 h-12 mx-auto mb-4 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-lg font-semibold mb-2">Camera Error</p>
              <p className="text-gray-300">{error}</p>
            </div>
            <Button
              variant="outline"
              className="bg-white text-black hover:bg-gray-200"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        )}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-white"
          onClick={() => {
            stopCamera();
            onClose();
          }}
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
      {!error && (
        <div className="p-4 bg-black">
          <Button
            variant="outline"
            size="lg"
            className="w-full bg-white"
            onClick={captureImage}
          >
            <Camera className="mr-2 h-5 w-5" />
            Capture
          </Button>
        </div>
      )}
    </div>
  );
}

export default function BottomNav() {
  const { user } = useAuth();
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageCapture = (imageData: string) => {
    // Handle the captured image data here
    console.log("Captured image:", imageData);
    // You can send this image to your server or process it further
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        console.log("Uploaded image:", imageData);
        // You can process the image data here
        // It will be in base64 format, similar to the camera capture
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) return null;
  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 border-t bg-white border-gray-200">
        <div className="flex justify-around items-center h-16">
          <Link href="/" className="flex flex-col items-center">
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

          <Link href="/diary" className="flex flex-col items-center">
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
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={() => setShowCamera(true)}
                  >
                    <Camera className="mr-2 h-5 w-5" />
                    Scan
                  </Button>

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

          <Link href="/plans" className="flex flex-col items-center">
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

          <Link href="/more" className="flex flex-col items-center">
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

      {showCamera && (
        <CameraCapture
          onCapture={handleImageCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </>
  );
}
