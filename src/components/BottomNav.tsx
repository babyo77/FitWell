"use client"

import type React from "react"

import { useAuth } from "@/context/auth-context"
import Link from "next/link"
import { Camera, Upload, X, Home, ClipboardList, MessageSquare, MoreHorizontal, ScanEye } from "lucide-react"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { useState, useRef, useCallback } from "react"
import { usePathname } from "next/navigation"
import Webcam from "react-webcam"
import { motion } from "framer-motion"
import { FoodAnalysisDrawer, type AnalysisResponse } from "./FoodAnalysisDrawer"

interface CameraCaptureProps {
  onClose: () => void
}

function CameraCapture({ onClose }: CameraCaptureProps) {
  const webcamRef = useRef<Webcam>(null)
  const [showDrawer, setShowDrawer] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null)

  const videoConstraints = {
    facingMode: { exact: "environment" },
    width: { ideal: 1920 },
    height: { ideal: 1080 },
  }

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (imageSrc) {
      setCapturedImage(imageSrc)
      setShowDrawer(true)
    }
  }, [])

  const handleAnalyze = async (imageData: string) => {
    try {
      setIsLoading(true)
      const base64Response = await fetch(imageData)
      const blob = await base64Response.blob()

      const formData = new FormData()
      formData.append("image", blob, "food.png")

      const response = await fetch("https://fitwell-backend.onrender.com/calorie/analyze/", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        setAnalysisResult({
          calories_info: { foods: [] },
          error: data.message || "Failed to analyze image",
        })
        return
      }

      if (!data.calories_info?.foods?.length) {
        setAnalysisResult({
          calories_info: { foods: [] },
          error: "No food detected in the image",
        })
        return
      }

      setAnalysisResult(data)
    } catch (error) {
      setAnalysisResult({
        calories_info: { foods: [] },
        error: "Something went wrong. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setShowDrawer(false)
    setCapturedImage(null)
    setAnalysisResult(null)
    onClose()
  }

  const handleRetake = () => {
    setShowDrawer(false)
    setCapturedImage(null)
    setAnalysisResult(null)
  }

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        className="h-full w-full object-cover"
      />

      {/* Camera frame guide */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-4/5 aspect-square border-2 border-white/50 rounded-lg border-dashed"></div>
      </div>

      <button onClick={handleClose} className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/40 text-white">
        <X className="h-6 w-6" />
      </button>

      <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center gap-4 p-8 bg-gradient-to-t from-black/50 to-transparent">
        <p className="text-white/70 text-sm">Position your food in the frame</p>
        <button
          onClick={capture}
          className="bg-white text-black px-8 py-3 rounded-full font-medium flex items-center gap-2"
        >
          <Camera className="h-5 w-5" />
          Capture Food
        </button>
      </div>

      <Drawer
        open={showDrawer}
        onOpenChange={(open) => {
          if (!open) {
            handleRetake()
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
    </motion.div>
  )
}

const NavLink = ({
  href,
  icon: Icon,
  label,
  isActive,
}: {
  href: string
  icon: any
  label: string
  isActive: boolean
}) => (
  <Link
    href={href}
    className={`relative flex flex-col items-center justify-center w-16 h-16 transition-colors ${
      isActive ? "text-black" : "text-gray-400 hover:text-gray-600"
    }`}
  >
    <Icon className={`w-5 h-5 transition-all ${isActive ? "scale-110" : ""}`} />
    <span className={`text-xs mt-1 transition-all ${isActive ? "font-medium" : ""}`}>{label}</span>
    {isActive && (
      <motion.div
        layoutId="activeTab"
        className="absolute -bottom-[1px] left-3 right-3 h-0.5 bg-black rounded-full"
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    )}
  </Link>
)

export default function BottomNav() {
  const { user } = useAuth()
  const pathname = usePathname()
  const [showCamera, setShowCamera] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [showUploadDrawer, setShowUploadDrawer] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null)

  const handleAnalyze = async (imageData: string) => {
    try {
      setIsUploading(true)
      const base64Response = await fetch(imageData)
      const blob = await base64Response.blob()

      const formData = new FormData()
      formData.append("image", blob, "food.png")

      const response = await fetch("https://fitwell-backend.onrender.com/calorie/analyze/", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        setAnalysisResult({
          calories_info: { foods: [] },
          error: data.message || "Failed to analyze image",
        })
        return
      }

      if (!data.calories_info?.foods?.length) {
        setAnalysisResult({
          calories_info: { foods: [] },
          error: "No food detected in the image",
        })
        return
      }

      setAnalysisResult(data)
    } catch (error) {
      setAnalysisResult({
        calories_info: { foods: [] },
        error: "Something went wrong. Please try again.",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target?.result as string
        setUploadedImage(imageData)
        setShowUploadDrawer(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCloseUpload = () => {
    setShowUploadDrawer(false)
    setUploadedImage(null)
    setAnalysisResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  if (!user) return null
  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-sm backdrop-blur-lg bg-opacity-90">
        <div className="flex justify-around items-center max-w-md mx-auto px-4">
          <NavLink href="/" icon={Home} label="Home" isActive={pathname === "/"} />

          <NavLink href="/diary" icon={ClipboardList} label="Diary" isActive={pathname === "/diary"} />

          <Drawer>
            <DrawerTrigger asChild>
              <button className="flex flex-col items-center justify-center -mt-8">
                <div className="bg-black rounded-full p-4 shadow-lg hover:scale-105 transition-transform">
                  <ScanEye className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
              </button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="text-center">
                <DrawerTitle>Add food to your diary</DrawerTitle>
                <DrawerDescription>Scan your food to get the nutritional information</DrawerDescription>
              </DrawerHeader>
              <div className="mx-auto w-full max-w-sm p-4 pt-0">
                <div className="flex flex-col gap-3">
                  <DrawerClose asChild>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full bg-blue-50 hover:bg-blue-100 border-blue-100"
                      onClick={() => setShowCamera(true)}
                    >
                      <Camera className="mr-2 h-5 w-5" />
                      Scan Food
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
                    size="lg"
                    className="w-full bg-orange-50 hover:bg-orange-100 border-orange-100"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="mr-2 h-5 w-5" />
                    Upload Photo
                  </Button>
                </div>
              </div>
            </DrawerContent>
          </Drawer>

          <NavLink href="/chat" icon={MessageSquare} label="Assistant" isActive={pathname === "/chat"} />

          <NavLink href="/more" icon={MoreHorizontal} label="More" isActive={pathname === "/more"} />
        </div>
      </nav>

      <Drawer
        open={showUploadDrawer}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseUpload()
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
            setShowCamera(false)
          }}
        />
      )}
    </>
  )
}

