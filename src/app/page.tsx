"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import {
  Dumbbell,
  Brain,
  LineChart,
  Apple,
  ChevronDown,
  Play,
  Menu,
  X,
  ArrowRight,
  CheckCircle2,
  Zap,
  Heart,
  BarChart3,
  Sparkles,
  Flame,
  Droplets,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { LucideIcon } from 'lucide-react'

// Update the FloatingIcon component with proper types
const FloatingIcon = ({ 
  icon: Icon, 
  color, 
  delay = 0, 
  className = "" 
}: {
  icon: LucideIcon;
  color: string;
  delay?: number;
  className?: string;
}) => (
  <motion.div
    className={`absolute ${className} w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center`}
    animate={{
      y: [0, -15, 0],
      rotate: [0, 5, -5, 0],
    }}
    transition={{
      duration: 6,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
      delay,
    }}
  >
    <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
  </motion.div>
)

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const videoRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)
  const faqRef = useRef<HTMLDivElement>(null)
  const solutionsRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, -100])

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  // Add smooth scrolling
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth"
    return () => {
      document.documentElement.style.scrollBehavior = "auto"
    }
  }, [])

  if (loading) return null

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  const faqs = [
    {
      question: "How does FitWell personalize my fitness journey?",
      answer:
        "FitWell uses your goals, preferences, and activity data to create personalized meal plans, workout recommendations, and health insights tailored specifically to you.",
    },
    {
      question: "Can I track my nutrition and calories with FitWell?",
      answer:
        "Yes! FitWell provides comprehensive nutrition tracking, including calories, macros (protein, carbs, fat), and micronutrients. You can log meals, scan food labels, and get detailed insights about your diet.",
    },
    {
      question: "How does the AI health assistant work?",
      answer:
        "Our AI health assistant uses advanced algorithms to provide personalized advice, answer your fitness and nutrition questions, and offer guidance based on your specific goals and progress.",
    },
    {
      question: "Is FitWell suitable for beginners?",
      answer:
        "FitWell is designed for users at all fitness levels. Whether you're just starting your fitness journey or you're an experienced athlete, our app adapts to your needs and helps you reach your goals.",
    },
    {
      question: "How does water intake tracking work?",
      answer:
        "FitWell makes it easy to track your daily water consumption with simple tap controls. You'll receive reminders throughout the day and can visualize your hydration progress against your personalized goals.",
    },
  ]

  // 2. Update the Features section with better icons and design
  // Replace the existing features array with this enhanced version
  const features = [
    {
      title: "AI-Powered Insights",
      description: "Get personalized recommendations based on your unique health data and goals",
      icon: <Sparkles className="w-5 h-5 text-white" />,
      color: "bg-gradient-to-br from-purple-500 to-indigo-600",
    },
    {
      title: "Nutrition Tracking",
      description: "Log meals, scan food, and track macros with our intelligent food recognition system",
      icon: <Apple className="w-5 h-5 text-white" />,
      color: "bg-gradient-to-br from-green-500 to-emerald-600",
    },
    {
      title: "Workout Plans",
      description: "Access customized workout routines tailored to your fitness level and preferences",
      icon: <Flame className="w-5 h-5 text-white" />,
      color: "bg-gradient-to-br from-orange-500 to-red-600",
    },
    {
      title: "Progress Analytics",
      description: "Visualize your fitness journey with comprehensive charts and insights",
      icon: <BarChart3 className="w-5 h-5 text-white" />,
      color: "bg-gradient-to-br from-blue-500 to-cyan-600",
    },
    {
      title: "Heart Rate Monitoring",
      description: "Track your heart rate during workouts to optimize intensity and recovery",
      icon: <Heart className="w-5 h-5 text-white" />,
      color: "bg-gradient-to-br from-pink-500 to-rose-600",
    },
    {
      title: "Hydration Tracking",
      description: "Monitor your daily water intake with smart reminders to stay properly hydrated",
      icon: <Droplets className="w-5 h-5 text-white" />,
      color: "bg-gradient-to-br from-sky-500 to-blue-600",
    },
  ]

  return (
    <div className="min-h-screen bg-white text-gray-900 relative overflow-hidden">
      {/* Background gradient elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-b from-orange-100/30 to-transparent rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-t from-blue-100/20 to-transparent rounded-full blur-3xl -z-10 -translate-x-1/3 translate-y-1/3"></div>

      {/* Navigation - Made sticky and glassmorphic */}
      <header className="fixed top-0 left-0 right-0 z-50 py-4 px-6 md:px-12 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-gray-100/50 shadow-sm">
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <Dumbbell className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-gray-800">FitWell</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="#"
            onClick={() => scrollToSection({ current: document.getElementById("top") as HTMLDivElement })}
            className="text-sm text-gray-600 hover:text-orange-500 transition-colors"
          >
            Home
          </Link>
          <Link
            href="#about"
            onClick={() => scrollToSection(aboutRef)}
            className="text-sm text-gray-600 hover:text-orange-500 transition-colors"
          >
            About Us
          </Link>
          <Link
            href="#features"
            onClick={() => scrollToSection(featuresRef)}
            className="text-sm text-gray-600 hover:text-orange-500 transition-colors"
          >
            Features
          </Link>
          <Link
            href="#solutions"
            onClick={() => scrollToSection(solutionsRef)}
            className="text-sm text-gray-600 hover:text-orange-500 transition-colors"
          >
            Solutions
          </Link>
          <Link
            href="#faq"
            onClick={() => scrollToSection(faqRef)}
            className="text-sm text-gray-600 hover:text-orange-500 transition-colors"
          >
            FAQ
          </Link>
        </div>

        <div className="hidden md:block">
          <Button
            onClick={() => router.push("/login")}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-full px-6 shadow-md hover:shadow-lg transition-all"
          >
            Get Started
          </Button>
        </div>

        <button
          className="md:hidden text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden fixed top-16 left-0 right-0 bg-white/95 backdrop-blur-md z-50 p-6 shadow-lg border-b border-gray-100"
        >
          <div className="flex flex-col space-y-5">
            {[
              { name: "Home", ref: { current: document.getElementById("top") as HTMLDivElement } },
              { name: "About Us", ref: aboutRef },
              { name: "Features", ref: featuresRef },
              { name: "Solutions", ref: solutionsRef },
              { name: "FAQ", ref: faqRef },
            ].map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link
                  href={`#${item.name === "Home" ? "" : item.name.toLowerCase().replace(" ", "-")}`}
                  onClick={() => {
                    scrollToSection(item.ref)
                    setMobileMenuOpen(false)
                  }}
                  className="flex items-center justify-between py-2 border-b border-gray-100 text-gray-800 hover:text-orange-500 transition-colors"
                >
                  <span className="font-medium">{item.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="pt-4"
            >
              <Button
                onClick={() => {
                  router.push("/login")
                  setMobileMenuOpen(false)
                }}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-full shadow-md w-full py-6 text-base"
              >
                Get Started
              </Button>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Hero Section - Updated with modern design */}

      <section id="top" className="relative pt-28 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div
            className="order-2 md:order-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8 max-w-lg">
              <div className="flex flex-wrap gap-4 mb-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex items-center gap-2 bg-gradient-to-r from-orange-100 to-orange-200 text-orange-600 px-3 py-1 rounded-full text-xs font-medium"
                >
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  AI-Powered Fitness
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-600 px-3 py-1 rounded-full text-xs font-medium"
                >
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Health Analytics
                </motion.div>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-sm text-gray-500 mb-4"
              >
                Your intelligent fitness companion
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
              >
                Transform Your Health Journey
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-base text-gray-600 mb-8 leading-relaxed"
              >
                FitWell combines cutting-edge AI technology with personalized fitness tracking to create a comprehensive
                wellness solution that adapts to your unique needs and goals.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button
                  onClick={() => router.push("/login")}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-full px-8 py-6 shadow-lg hover:shadow-xl transition-all text-base w-full sm:w-auto"
                >
                  Start Your Journey
                </Button>
                <Button
                  variant="outline"
                  onClick={() => scrollToSection(featuresRef)}
                  className="rounded-full px-8 py-6 border-gray-300 hover:bg-gray-50 transition-all text-base flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  Explore Features <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Add this inside the hero section's right column */}
          <motion.div
            className="order-1 md:order-2 relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="relative h-[400px] w-full">
              {/* Enhanced background with softer gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-3xl overflow-hidden">
                {/* Soft background circles */}
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-orange-100/50 rounded-full"></div>
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-orange-100/50 rounded-full"></div>

                {/* App Icons with enhanced styling */}
                <motion.div
                  className="absolute top-[20%] right-[20%] w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center"
                  animate={{
                    y: [0, -15, 0],
                    rotate: [0, 2, 0, -2, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <LineChart className="w-6 h-6 text-white" />
                  </div>
                </motion.div>

                <motion.div
                  className="absolute bottom-[25%] left-[15%] w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center"
                  animate={{
                    y: [0, 15, 0],
                    rotate: [0, -2, 0, 2, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                >
                  <div className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center">
                    <Apple className="w-5 h-5 text-white" />
                  </div>
                </motion.div>

                <motion.div
                  className="absolute top-[40%] left-[40%] w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center"
                  animate={{
                    y: [0, 10, 0],
                    rotate: [0, 3, 0, -3, 0],
                  }}
                  transition={{
                    duration: 7,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                >
                  <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center">
                    <Dumbbell className="w-8 h-8 text-white" />
                  </div>
                </motion.div>

                {/* Enhanced Daily Goal Card */}
                <motion.div
                  className="absolute bottom-[15%] right-[10%] bg-white rounded-xl shadow-lg p-4 w-[140px]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                >
                  <div className="text-sm text-gray-500 mb-1">Daily Goal</div>
                  <div className="text-2xl font-bold text-orange-500">2,000</div>
                  <div className="text-xs text-gray-500">calories</div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Trusted by section */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <p className="text-sm text-gray-500 mb-6">TRUSTED BY HEALTH ENTHUSIASTS WORLDWIDE</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {["Nike", "Adidas", "Under Armour", "Fitbit", "Garmin"].map((brand, index) => (
              <motion.div
                key={brand}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                className="text-gray-400 font-semibold text-lg"
              >
                {brand}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Section - Modernized */}
      <section id="features" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-block px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium mb-4">
            Features
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Tools for Your Fitness Journey</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our comprehensive suite of features is designed to help you achieve your health and fitness goals with ease
            and precision.
          </p>
        </motion.div>

        {/* 4. Replace the Features section JSX with this enhanced version */}
        {/* Find the Features section and replace it with this code */}
        {/* Replace the grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 with: */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:translate-y-[-5px]"
            >
              <div className="flex flex-col items-start gap-4">
                <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center shadow-md`}>
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feature showcase */}
        <motion.div
          className="mt-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 md:p-12 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Personalized Fitness Experience</h3>
              <p className="text-gray-600 mb-6">
                Our AI-powered platform adapts to your unique needs, preferences, and goals to deliver a truly
                personalized fitness experience.
              </p>

              <div className="space-y-4">
                {[
                  "Smart workout recommendations based on your progress",
                  "Nutritional guidance tailored to your dietary preferences",
                  "Adaptive goal setting that evolves with your fitness journey",
                  "Personalized insights to optimize your performance",
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">{item}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-8"
              >
                <Button
                  onClick={() => router.push("/login")}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-full px-6 shadow-md hover:shadow-lg transition-all"
                >
                  Experience It Now
                </Button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative"
            >
              <div className="relative h-[400px] w-full">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl"></div>

                {/* Analytics visualization */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-white rounded-xl shadow-xl p-4">
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-1">Fitness Progress</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-xs text-gray-500">Last 7 days</span>
                    </div>
                  </div>

                  <div className="h-[60%] flex items-end gap-2">
                    {[65, 40, 85, 70, 90, 60, 80].map((height, index) => (
                      <motion.div
                        key={index}
                        className="flex-1 bg-gradient-to-t from-orange-500 to-red-500 rounded-t-md"
                        initial={{ height: 0 }}
                        whileInView={{ height: `${height}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                      ></motion.div>
                    ))}
                  </div>

                  <div className="flex justify-between mt-2">
                    {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                      <div key={index} className="text-xs text-gray-500">
                        {day}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating elements */}
                <motion.div
                  className="absolute top-[10%] right-[10%] bg-white rounded-lg shadow-lg p-3"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold">Goal Achieved</div>
                      <div className="text-[10px] text-gray-500">Daily steps target</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute bottom-[15%] left-[10%] bg-white rounded-lg shadow-lg p-3"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
                >
                  <div className="text-xs font-semibold mb-1">Calories Burned</div>
                  <div className="text-lg font-bold text-orange-500">350 kcal</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Future Features Section */}
      <section
        id="future-features"
        className="py-24 px-6 md:px-12 max-w-7xl mx-auto bg-gradient-to-br from-gray-50 to-gray-100"
      >
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm font-medium mb-4">
            Coming Soon
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Future Features</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're constantly innovating to bring you the most advanced fitness technology. Here's a sneak peek at what's
            coming to FitWell.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* Timeline */}
          <div className="relative pl-8 border-l-2 border-indigo-200 space-y-16">
            {[
              {
                quarter: "Q2 2025",
                title: "Smart Watch Integration",
                description:
                  "Seamlessly sync with all major smartwatch brands for real-time health monitoring and workout tracking.",
              },
              {
                quarter: "Q3 2025",
                title: "Social Fitness Community",
                description:
                  "Connect with friends, join challenges, and share achievements in our new social fitness ecosystem.",
              },
              {
                quarter: "Q4 2025",
                title: "AR Workout Assistant",
                description:
                  "Train with augmented reality guidance that ensures perfect form and technique for every exercise.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative"
              >
                <div className="absolute -left-[41px] top-0 w-8 h-8 bg-white rounded-full border-2 border-indigo-300 flex items-center justify-center">
                  <div className="w-4 h-4 bg-indigo-500 rounded-full"></div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                  <div className="text-sm font-semibold text-indigo-500 mb-2">{item.quarter}</div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Feature Preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
              <h3 className="text-xl font-bold mb-2">AI Fitness Coach</h3>
              <p className="text-white/80">Coming Q1 2025</p>
            </div>
            <div className="p-6">
              <div className="aspect-video bg-gray-100 rounded-lg mb-6 overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center"
                  >
                    <Play className="w-8 h-8 text-indigo-500" />
                  </motion.div>
                </div>
              </div>
              <h4 className="text-lg font-semibold mb-3">Personalized AI Coaching</h4>
              <p className="text-gray-600 mb-4">
                Our upcoming AI Coach will analyze your movements in real-time, provide voice guidance, and adapt
                workouts based on your performance and progress.
              </p>
              <div className="space-y-3">
                {[
                  "Real-time form correction and feedback",
                  "Voice-guided workout sessions",
                  "Adaptive difficulty based on performance",
                  "Personalized motivation and encouragement",
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6">
                <Button
                  variant="outline"
                  className="w-full rounded-lg border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                >
                  Join Waitlist
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Innovation Commitment */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-20 text-center max-w-3xl mx-auto"
        >
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-indigo-500" />
          </div>
          <h3 className="text-2xl font-bold mb-4">Committed to Innovation</h3>
          <p className="text-gray-600 mb-8">
            At FitWell, we're constantly pushing the boundaries of what's possible in fitness technology. Our team of
            engineers, fitness experts, and data scientists work together to create features that truly transform your
            health journey.
          </p>
          <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-full px-8 py-3 shadow-md hover:shadow-lg transition-all">
            Learn About Our Technology
          </Button>
        </motion.div>
      </section>

      {/* 5. Replace the About section with a redesigned version without images */}
      {/* Find the About section and replace it with this code */}
      <section id="about" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
            About Us
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Transforming Fitness with AI</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            FitWell is dedicated to revolutionizing the fitness landscape with cutting-edge artificial intelligence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="relative h-[400px] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
              {/* Abstract shapes */}
              <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] bg-blue-200/30 rounded-full"></div>
              <div className="absolute bottom-[-30px] left-[-30px] w-[150px] h-[150px] bg-indigo-200/40 rounded-full"></div>

              {/* Animated elements */}
              <motion.div
                className="absolute top-[20%] left-[15%] w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center"
                animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </motion.div>

              <motion.div
                className="absolute bottom-[25%] right-[20%] w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center"
                animate={{ y: [0, 15, 0], rotate: [0, -5, 5, 0] }}
                transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
              >
                <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
              </motion.div>

              <motion.div
                className="absolute top-[60%] left-[50%] w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center"
                animate={{ y: [0, 10, 0], rotate: [0, 3, -3, 0] }}
                transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.5 }}
              >
                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
              </motion.div>

              {/* Central element */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <motion.div
                  className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-xl"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                >
                  <Dumbbell className="w-12 h-12 text-white" />
                </motion.div>
              </div>

              {/* Connection lines */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 400 400"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <motion.path
                  d="M100 100 L200 200 L300 100"
                  stroke="rgba(99, 102, 241, 0.2)"
                  strokeWidth="2"
                  strokeDasharray="5 5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", ease: "easeInOut" }}
                />
                <motion.path
                  d="M100 100 L200 200 L100 300"
                  stroke="rgba(99, 102, 241, 0.2)"
                  strokeWidth="2"
                  strokeDasharray="5 5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 2,
                    delay: 0.5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                    ease: "easeInOut",
                  }}
                />
                <motion.path
                  d="M300 100 L200 200 L300 300"
                  stroke="rgba(99, 102, 241, 0.2)"
                  strokeWidth="2"
                  strokeDasharray="5 5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 2,
                    delay: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                    ease: "easeInOut",
                  }}
                />
              </svg>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="space-y-6">
              <p className="text-gray-600 leading-relaxed">
                Our mission is to provide advanced, intuitive, and reliable health solutions that cater to individual
                needs. We believe that everyone deserves access to personalized fitness guidance, regardless of their
                experience level or background.
              </p>

              <p className="text-gray-600 leading-relaxed">
                That's why we've built a platform that adapts to your unique journey and helps you achieve your goals
                through cutting-edge AI technology and data-driven insights.
              </p>

              <div className="grid grid-cols-2 gap-6 mt-8">
                {[
                  { label: "Active Users", value: "10k+", color: "orange" },
                  { label: "Success Rate", value: "95%", color: "green" },
                  { label: "AI Support", value: "24/7", color: "blue" },
                  { label: "Expert Trainers", value: "50+", color: "purple" },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                  >
                    <div className={`text-3xl font-bold text-${stat.color}-500 mb-1`}>{stat.value}</div>
                    <p className="text-gray-600">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="mt-8"
              >
                <Button
                  onClick={() => router.push("/login")}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-full px-8 py-3 shadow-md hover:shadow-lg transition-all"
                >
                  Learn More About Us
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Solutions Section - Modernized */}
      <section id="solutions" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-block px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium mb-4">
            Solutions
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Fitness Solutions</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our platform offers a wide range of solutions to help you achieve your fitness goals, from workout planning
            to nutrition tracking.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Workout Planning",
              description:
                "Access personalized workout plans tailored to your fitness level, goals, and available equipment.",
              icon: <Dumbbell className="w-6 h-6 text-white" />,
              color: "bg-gradient-to-br from-orange-500 to-red-500",
            },
            {
              title: "Nutrition Tracking",
              description: "Log your meals, track your macros, and get personalized nutrition recommendations.",
              icon: <Apple className="w-6 h-6 text-white" />,
              color: "bg-gradient-to-br from-green-500 to-emerald-500",
            },
            {
              title: "Progress Analytics",
              description:
                "Visualize your progress with detailed analytics and insights to optimize your fitness journey.",
              icon: <LineChart className="w-6 h-6 text-white" />,
              color: "bg-gradient-to-br from-blue-500 to-cyan-500",
            },
          ].map((solution, index) => (
            <motion.div
              key={solution.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                className={`w-14 h-14 ${solution.color} rounded-2xl flex items-center justify-center shadow-md mb-6`}
              >
                {solution.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{solution.title}</h3>
              <p className="text-gray-600 mb-6">{solution.description}</p>
              <Button
                variant="outline"
                onClick={() => router.push("/login")}
                className="rounded-full border-gray-200 hover:border-orange-500 hover:text-orange-500 transition-colors"
              >
                Learn More
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-20 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 text-white shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Fitness Journey?</h3>
              <p className="text-gray-300 mb-8">
                Join thousands of users who have already improved their health and wellness with FitWell's AI-powered
                platform.
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Button
                  onClick={() => router.push("/login")}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-full px-8 py-6 shadow-md hover:shadow-lg transition-all text-base"
                >
                  Get Started Today
                </Button>
              </motion.div>
            </div>

            <div className="relative h-[300px]">
              <motion.div
                className="absolute top-[10%] left-[10%] w-16 h-16 bg-white/10 rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              ></motion.div>
              <motion.div
                className="absolute top-[40%] right-[20%] w-24 h-24 bg-white/10 rounded-full"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.7, 0.5] }}
                transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
              ></motion.div>
              <motion.div
                className="absolute bottom-[20%] left-[30%] w-20 h-20 bg-white/10 rounded-full"
                animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0.6, 0.5] }}
                transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 2 }}
              ></motion.div>

              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Play className="w-8 h-8 text-white ml-1" />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FAQ Section - Modernized */}
      <section id="faq" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-block px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-medium mb-4">
            FAQ
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about FitWell's AI-powered fitness platform.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="mb-4"
            >
              <button
                onClick={() => toggleFaq(index)}
                className={`w-full text-left p-6 rounded-xl border ${
                  openFaq === index
                    ? "border-orange-200 bg-gradient-to-r from-orange-50 to-orange-100"
                    : "border-gray-200 hover:border-orange-200 hover:bg-gray-50"
                } transition-all duration-200`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">{faq.question}</h3>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      openFaq === index ? "bg-orange-100" : "bg-gray-100"
                    }`}
                  >
                    <ChevronDown
                      className={`h-5 w-5 ${openFaq === index ? "text-orange-500" : "text-gray-500"} transition-transform ${openFaq === index ? "rotate-180" : ""}`}
                    />
                  </div>
                </div>
                {openFaq === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 text-gray-600"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section - Modernized */}

      <section className="py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div
          className="bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-8 md:p-16 text-white shadow-xl relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/3 -translate-x-1/4"></div>

          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <motion.h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Start Your Fitness Journey Today
            </motion.h2>
            <motion.p
              className="text-white/80 mb-8 text-base md:text-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Join thousands of users who have already transformed their health and wellness with FitWell.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                onClick={() => router.push("/login")}
                className="bg-white text-orange-500 hover:bg-gray-100 rounded-full px-8 py-6 shadow-md hover:shadow-lg transition-all text-base w-full sm:w-auto"
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                onClick={() => scrollToSection(featuresRef)}
                className="rounded-full border-white/30 text-white hover:bg-white/10 transition-colors px-8 py-6 text-base w-full sm:w-auto"
              >
                Learn More
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Footer - Modernized */}

      <footer
        className="bg-gradient-to-br from-orange-400 to-red-400 text-white py-16 px-6 md:px-12"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/3 -translate-x-1/4"></div>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <Dumbbell className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-xl">FitWell</span>
              </div>
              <p className="text-white mb-6 max-w-md">
                FitWell combines cutting-edge AI technology with personalized fitness tracking to create a comprehensive
                wellness solution that adapts to your unique needs and goals.
              </p>
              <div className="flex space-x-4">
                {["facebook", "twitter", "instagram", "linkedin"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                  >
                    <span className="sr-only">{social}</span>
                    <div className="w-5 h-5 bg-gray-500 rounded-full"></div>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Company</h3>
              <ul className="space-y-3">
                {["About Us", "Careers", "Blog", "Press"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-white hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Resources</h3>
              <ul className="space-y-3">
                {["Help Center", "Privacy Policy", "Terms of Service", "Contact Us"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-white hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© {new Date().getFullYear()} FitWell. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-6 mt-4 md:mt-0">
              <a href="#" className="text-white hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-white hover:text-white text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-white hover:text-white text-sm transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

