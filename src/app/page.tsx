"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
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
  Heart,
  BarChart3,
  Sparkles,
  Flame,
  Droplets,
  ArrowUp,
  Star,
  Trophy,
  MessageSquare,
  Users,
  Bell,
  Shield,
  ArrowUpRight,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import type { LucideIcon } from "lucide-react"

// Enhanced FloatingIcon component with proper types and improved animations
const FloatingIcon = ({
  icon: Icon,
  color,
  delay = 0,
  className = "",
}: {
  icon: LucideIcon
  color: string
  delay?: number
  className?: string
}) => (
  <motion.div
    className={`absolute ${className} w-16 h-16 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg flex items-center justify-center border border-white/40`}
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
    whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
  >
    <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
  </motion.div>
)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const AnimatedStat = ({
  label,
  value,
  color,
  delay = 0,
}: { label: string; value: string; color: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: delay }}
    whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.08)" }}
    className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-sm hover:shadow-md transition-all border border-gray-100/60"
  >
    <div className={`text-3xl font-bold text-${color}-500 mb-1`}>{value}</div>
    <p className="text-gray-600">{label}</p>
  </motion.div>
)

// New component for feature cards
const FeatureCard = ({
  title,
  description,
  icon,
  color,
  index = 0,
}: {
  title: string
  description: string
  icon: React.ReactNode
  color: string
  index?: number
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    whileHover={{ y: -8, transition: { duration: 0.2 } }}
    className="bg-white/90 backdrop-blur-sm border border-gray-100/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group"
  >
    <div
      className={`w-14 h-14 ${color} rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all`}
    >
      {icon}
    </div>
    <div>
      <h3 className="text-xl font-bold mb-2 group-hover:text-green-600 transition-colors">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </motion.div>
)



// Update the CarouselFeatureCard component to be more visually appealing
const CarouselFeatureCard = ({
  title,
  description,
  icon,
  color = "green",
}: {
  title: string
  description: string
  icon: React.ReactNode
  color?: string
}) => {
  // Map color names to gradient classes
  const colorMap = {
    green: "from-green-500 to-emerald-600",
    blue: "from-blue-500 to-cyan-600",
    purple: "from-purple-500 to-indigo-600",
    amber: "from-amber-500 to-yellow-600",
    orange: "from-orange-500 to-amber-600",
    sky: "from-sky-500 to-blue-600",
    indigo: "from-indigo-500 to-violet-600",
    emerald: "from-emerald-500 to-green-600",
    red: "from-red-500 to-rose-600",
    violet: "from-violet-500 to-purple-600",
    pink: "from-pink-500 to-rose-600",
    lime: "from-lime-500 to-green-600",
    cyan: "from-cyan-500 to-blue-600",
    teal: "from-teal-500 to-emerald-600",
    rose: "from-rose-500 to-pink-600",
    gold: "from-amber-500 to-yellow-400",
  }

  const gradientClass = colorMap[color as keyof typeof colorMap] || "from-green-500 to-emerald-600"

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg h-full flex flex-col"
      whileHover={{ y: -8, scale: 1.02, boxShadow: "0 20px 30px rgba(0,0,0,0.1)" }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={`w-14 h-14 bg-gradient-to-br ${gradientClass} rounded-xl flex items-center justify-center shadow-md mb-5`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-800">{title}</h3>
      <p className="text-gray-600 flex-grow">{description}</p>
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
        <span className="text-xs text-green-600 font-medium">Coming soon</span>
        <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
          <ArrowUpRight className="w-4 h-4 text-green-500" />
        </div>
      </div>
    </motion.div>
  )
}

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const featuresRef = useRef<HTMLDivElement>(null)
  const faqRef = useRef<HTMLDivElement>(null)
  const solutionsRef = useRef<HTMLDivElement>(null)
  const futureRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const topRef = useRef<HTMLDivElement>(null)

  // Add a state for the active filter after the other useState declarations
  const [activeFilter, setActiveFilter] = useState("all")

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, -100])

  // Handle scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollTop(true)
      } else {
        setShowScrollTop(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  // Custom smooth scrolling implementation
  const smoothScroll = (target: HTMLElement, duration = 800) => {
    const targetPosition = target.getBoundingClientRect().top + window.scrollY
    const startPosition = window.scrollY
    const distance = targetPosition - startPosition
    let startTime: number | null = null

    function animation(currentTime: number) {
      if (startTime === null) startTime = currentTime
      const timeElapsed = currentTime - startTime
      const progress = Math.min(timeElapsed / duration, 1)
      const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1)
      window.scrollTo(0, startPosition + distance * ease(progress))

      if (timeElapsed < duration) {
        requestAnimationFrame(animation)
      }
    }

    requestAnimationFrame(animation)
  }

  if (loading) return null

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      smoothScroll(ref.current)
      setMobileMenuOpen(false)
    }
  }

  const scrollToTop = () => {
    smoothScroll(document.documentElement)
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

  // Enhanced features array with better icons and design
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

  // Add categories to each feature in the futureFeatures array
  const futureFeatures = [
    {
      title: "Nutritional Score (1-100)",
      description:
        "Get a comprehensive score based on your meal's nutritional value and balance for quick health insights.",
      icon: <LineChart className="w-6 h-6 text-white" />,
      color: "green",
      category: "nutrition",
    },
    {
      title: "Future Health Prediction",
      description:
        "AI-powered insights into your future health based on current eating patterns and lifestyle choices.",
      icon: <Brain className="w-6 h-6 text-white" />,
      color: "purple",
      category: "ai",
    },
    {
      title: "Trend Insights & Meal Highlights",
      description: "Discover patterns in your eating habits with smart meal analysis and personalized highlights.",
      icon: <BarChart3 className="w-6 h-6 text-white" />,
      color: "blue",
      category: "ai",
    },
    {
      title: "Challenges & Leaderboards",
      description: "Compete with friends and join community fitness challenges for motivation and accountability.",
      icon: <Trophy className="w-6 h-6 text-white" />,
      color: "amber",
      category: "social",
    },
    {
      title: "Gamification & Achievements",
      description: "Earn badges and unlock achievements as you reach milestones in your health journey.",
      icon: <Star className="w-6 h-6 text-white" />,
      color: "orange",
      category: "social",
    },
    {
      title: "Social Media Sharing",
      description: "Share your healthy meals and achievements with friends through the 'Food Flex' feature.",
      icon: <MessageSquare className="w-6 h-6 text-white" />,
      color: "sky",
      category: "social",
    },
    {
      title: "Community Ratings & Comments",
      description: "Rate meals and leave comments to help others discover healthy food options.",
      icon: <Users className="w-6 h-6 text-white" />,
      color: "indigo",
      category: "social",
    },
    {
      title: "Cultural & Seasonal Insights",
      description: "Get insights on cultural and seasonal foods to diversify your diet throughout the year.",
      icon: <Sparkles className="w-6 h-6 text-white" />,
      color: "emerald",
      category: "nutrition",
    },
    {
      title: "Festival Mode",
      description: "Special features for holidays like Diwali, Ramadan, Christmas with healthy alternatives.",
      icon: <Flame className="w-6 h-6 text-white" />,
      color: "red",
      category: "nutrition",
    },
    {
      title: "AI-Based Recommendations",
      description: "Smart meal suggestions based on your preferences, goals, and dietary restrictions.",
      icon: <Brain className="w-6 h-6 text-white" />,
      color: "violet",
      category: "ai",
    },
    {
      title: "Eat Like a Celebrity Mode",
      description: "Discover and adapt meal plans inspired by your favorite celebrities' healthy diets.",
      icon: <Star className="w-6 h-6 text-white" />,
      color: "pink",
      category: "nutrition",
    },
    {
      title: "Meal Alternative Suggestions",
      description: "Get healthier alternatives to your favorite meals without sacrificing taste.",
      icon: <Apple className="w-6 h-6 text-white" />,
      color: "lime",
      category: "nutrition",
    },
    {
      title: "Hydration Tracking",
      description: "Monitor your daily water intake with smart reminders to stay properly hydrated.",
      icon: <Droplets className="w-6 h-6 text-white" />,
      color: "cyan",
      category: "nutrition",
    },
    {
      title: "Processed vs. Fresh Food Ratio",
      description: "Track the balance between processed and fresh foods in your diet for better health.",
      icon: <BarChart3 className="w-6 h-6 text-white" />,
      color: "teal",
      category: "nutrition",
    },
    {
      title: "Mindful Eating Reminders",
      description: "Receive gentle reminders to practice mindful eating for better digestion and satisfaction.",
      icon: <Bell className="w-6 h-6 text-white" />,
      color: "amber",
      category: "nutrition",
    },
    {
      title: "Health App Integration",
      description: "Seamlessly connect with your favorite fitness and health apps for a unified experience.",
      icon: <Heart className="w-6 h-6 text-white" />,
      color: "rose",
      category: "ai",
    },
    {
      title: "Premium Subscription",
      description: "Access exclusive features and personalized coaching with our premium subscription model.",
      icon: <Shield className="w-6 h-6 text-white" />,
      color: "gold",
      category: "social",
    },
  ]

  // Add a function to handle filter changes
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter)
  }

  const scrollbarHideStyles = `
    /* Hide scrollbar for Chrome, Safari and Opera */
    body::-webkit-scrollbar,
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }

    /* Hide scrollbar for IE, Edge and Firefox */
    body,
    .hide-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none; /* Firefox */
    }
  `

  return (
    <motion.div style={{ y }} className="relative">
      <div className="min-h-screen bg-white text-gray-900 relative overflow-hidden" ref={containerRef}>
        <style jsx global>{`
          ${scrollbarHideStyles}
        `}</style>
        {/* Enhanced background gradient elements - glowing blobs with more modern styling */}
        <div className="fixed inset-0 overflow-hidden -z-10">
          {/* Main green gradient blob */}
          <div className="absolute top-[10%] right-[5%] w-[800px] h-[800px] bg-gradient-to-b from-green-400/20 to-green-600/10 rounded-full blur-[100px] animate-pulse-slow"></div>

          {/* Secondary purple gradient blob */}
          <div className="absolute bottom-[10%] left-[5%] w-[700px] h-[700px] bg-gradient-to-t from-purple-500/10 to-green-300/10 rounded-full blur-[100px] animate-pulse-slow animation-delay-2000"></div>

          {/* Accent blobs */}
          <div className="absolute top-[40%] left-[15%] w-[500px] h-[500px] bg-gradient-to-r from-green-300/15 to-teal-400/10 rounded-full blur-[80px] animate-pulse-slow animation-delay-1000"></div>
          <div className="absolute top-[60%] right-[15%] w-[400px] h-[400px] bg-gradient-to-l from-emerald-400/15 to-blue-300/10 rounded-full blur-[80px] animate-pulse-slow animation-delay-3000"></div>

          {/* Small accent blobs */}
          <div className="absolute top-[20%] left-[30%] w-[300px] h-[300px] bg-gradient-to-br from-green-200/20 to-green-400/5 rounded-full blur-[60px] animate-pulse-slow animation-delay-4000"></div>
          <div className="absolute bottom-[30%] right-[25%] w-[250px] h-[250px] bg-gradient-to-tr from-teal-300/15 to-green-200/10 rounded-full blur-[60px] animate-pulse-slow animation-delay-5000"></div>
        </div>

        {/* Scroll to top button - Enhanced with glassmorphism */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={scrollToTop}
              className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md border border-white/40 text-green-600 shadow-lg flex items-center justify-center hover:shadow-xl transition-all"
              whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Navigation - Enhanced glassmorphism effect */}
        <header className="fixed top-0 left-0 right-0 z-50 py-4 px-6 md:px-12 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-gray-100/50 shadow-sm">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
              <Dumbbell className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-gray-800">FitWell</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {[
              { name: "Home", action: scrollToTop },
              { name: "Features", ref: featuresRef },
              { name: "Future", ref: futureRef },
              { name: "FAQ", ref: faqRef },
            ].map((item) => (
              <Link
                key={item.name}
                href={`#${item.name === "Home" ? "" : item.name.toLowerCase().replace(" ", "-")}`}
                onClick={(e) => {
                  e.preventDefault()
                  item.action ? item.action() : scrollToSection(item.ref)
                }}
                className="text-sm text-gray-600 hover:text-green-500 transition-colors relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          <div className="hidden md:block">
            <Button
              onClick={() => router.push("/login")}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full px-6 shadow-md hover:shadow-lg transition-all"
            >
              Get Started
            </Button>
          </div>

          <button
            className="md:hidden text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        {/* Mobile menu - Enhanced with better animations and styling */}
        <AnimatePresence>
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
                  { name: "Home", action: scrollToTop },
                  { name: "Features", ref: featuresRef },
                  { name: "Future", ref: futureRef },
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
                      onClick={(e) => {
                        e.preventDefault()
                        item.action ? item.action() : scrollToSection(item.ref)
                      }}
                      className="flex items-center justify-between py-2 border-b border-gray-100 text-gray-800 hover:text-green-500 transition-colors"
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
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full shadow-md w-full py-6 text-base"
                  >
                    Get Started
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Section - Enhanced with modern design elements */}
        <section id="top" ref={topRef} className="relative pt-28 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
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
                    className="flex items-center gap-2 bg-gradient-to-r from-green-100 to-green-200 text-green-600 px-3 py-1 rounded-full text-xs font-medium"
                  >
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
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
                  className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-br from-green-600 via-emerald-500 to-teal-400 animate-gradient-x relative"
                  style={{
                    WebkitBackgroundClip: "text",
                    backgroundSize: "200% auto",
                  }}
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
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full px-8 py-6 shadow-lg hover:shadow-xl transition-all text-base w-full sm:w-auto group relative overflow-hidden"
                  >
                    <span className="relative z-10">Start Your Journey</span>
                    <span className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => scrollToSection(featuresRef)}
                    className="rounded-full px-8 py-6 border-gray-300 hover:border-green-500 hover:text-green-500 transition-all text-base flex items-center justify-center gap-2 w-full sm:w-auto group"
                  >
                    Explore Features
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            {/* Hero right column with enhanced animated elements */}
            <motion.div
              className="order-1 md:order-2 relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="relative h-[400px] w-full">
                {/* Enhanced background with softer gradient and glassmorphism */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100/50 rounded-3xl overflow-hidden backdrop-blur-sm border border-white/40 shadow-xl">
                  {/* Soft background circles */}
                  <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-green-100/50 rounded-full"></div>
                  <div className="absolute -top-10 -right-10 w-48 h-48 bg-green-100/50 rounded-full"></div>

                  {/* App Icons with enhanced styling */}
                  <FloatingIcon icon={LineChart} color="bg-blue-500" className="top-[20%] right-[20%]" />
                  <FloatingIcon icon={Apple} color="bg-green-500" className="bottom-[25%] left-[15%]" delay={1} />
                  <FloatingIcon icon={Dumbbell} color="bg-orange-500" className="top-[40%] left-[40%]" delay={0.5} />

                  {/* Enhanced Daily Goal Card with glassmorphism */}
                  <motion.div
                    className="absolute bottom-[15%] right-[10%] bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 w-[140px] border border-white/40"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                  >
                    <div className="text-sm text-gray-500 mb-1">Daily Goal</div>
                    <div className="text-2xl font-bold text-green-500">2,000</div>
                    <div className="text-xs text-gray-500">calories</div>
                  </motion.div>

                  {/* Activity Stats Card with glassmorphism */}
                  <motion.div
                    className="absolute top-[15%] left-[15%] bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 w-[160px] border border-white/40"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Flame className="w-4 h-4 text-green-500" />
                      </div>
                      <div className="text-sm font-semibold">Activity</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-2xl font-bold text-gray-800">8,546</div>
                        <div className="text-xs text-gray-500">steps today</div>
                      </div>
                      <div className="text-xs text-green-500 font-medium">+12%</div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section - Modernized with enhanced cards */}
        <section id="features" ref={featuresRef} className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium mb-4">
              Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-600 via-emerald-500 to-green-600">
              Powerful Tools for Your Fitness Journey
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our comprehensive suite of features is designed to help you achieve your health and fitness goals with ease
              and precision.
            </p>
          </motion.div>

          {/* Features grid with enhanced animations and cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                color={feature.color}
                index={index}
              />
            ))}
          </div>

          {/* Feature showcase with enhanced glassmorphism */}
          <motion.div
            className="mt-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 md:p-12 shadow-sm border border-white/40 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Personalized Fitness Experience</h3>
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
                      <div className="w-5 h-5 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      </div>
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
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full px-6 shadow-md hover:shadow-lg transition-all group relative overflow-hidden"
                  >
                    <span className="relative z-10">Experience It Now</span>
                    <span className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
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
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl"></div>

                  {/* Analytics visualization with glassmorphism */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-4 border border-white/40">
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-1">Fitness Progress</h4>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-gray-500">Last 7 days</span>
                      </div>
                    </div>

                    <div className="h-[60%] flex items-end gap-2">
                      {[65, 40, 85, 70, 90, 60, 80].map((height, index) => (
                        <motion.div
                          key={index}
                          className="flex-1 bg-gradient-to-t from-green-500 to-emerald-400 rounded-t-md"
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

                  {/* Floating elements with glassmorphism */}
                  <motion.div
                    className="absolute top-[10%] right-[10%] bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 border border-white/40"
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
                    className="absolute bottom-[15%] left-[10%] bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 border border-white/40"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
                  >
                    <div className="text-xs font-semibold mb-1">Calories Burned</div>
                    <div className="text-lg font-bold text-green-500">350 kcal</div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Replace the Future Features section with an enhanced version */}
        <section id="future" ref={futureRef} className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden -z-10">
            <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-gradient-to-b from-green-400/10 to-emerald-600/5 rounded-full blur-[80px]"></div>
            <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-gradient-to-t from-purple-500/10 to-indigo-300/5 rounded-full blur-[80px]"></div>
          </div>

          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium mb-4">
              Coming Soon
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600">
              Future Features
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience the next generation of AI-powered nutrition tracking and wellness features designed to transform
              your health journey.
            </p>
          </motion.div>

          {/* Feature filter tabs */}
          <div className="flex justify-center mb-12 overflow-x-auto pb-2 hide-scrollbar">
            <div className="flex space-x-2">
              <motion.button
                className={`px-4 py-2 rounded-full ${activeFilter === "all" ? "bg-green-100 text-green-700" : "bg-white border border-gray-200 text-gray-600"} font-medium text-sm`}
                whileHover={{ scale: 1.05, backgroundColor: activeFilter === "all" ? "" : "rgba(240, 253, 244, 1)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFilterChange("all")}
              >
                All Features
              </motion.button>
              <motion.button
                className={`px-4 py-2 rounded-full ${activeFilter === "nutrition" ? "bg-green-100 text-green-700" : "bg-white border border-gray-200 text-gray-600"} font-medium text-sm`}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: activeFilter === "nutrition" ? "" : "rgba(240, 253, 244, 1)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFilterChange("nutrition")}
              >
                Nutrition
              </motion.button>
              <motion.button
                className={`px-4 py-2 rounded-full ${activeFilter === "social" ? "bg-green-100 text-green-700" : "bg-white border border-gray-200 text-gray-600"} font-medium text-sm`}
                whileHover={{ scale: 1.05, backgroundColor: activeFilter === "social" ? "" : "rgba(240, 253, 244, 1)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFilterChange("social")}
              >
                Social
              </motion.button>
              <motion.button
                className={`px-4 py-2 rounded-full ${activeFilter === "ai" ? "bg-green-100 text-green-700" : "bg-white border border-gray-200 text-gray-600"} font-medium text-sm`}
                whileHover={{ scale: 1.05, backgroundColor: activeFilter === "ai" ? "" : "rgba(240, 253, 244, 1)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFilterChange("ai")}
              >
                AI & Insights
              </motion.button>
            </div>
          </div>

          {/* Feature cards grid with masonry-like layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {futureFeatures
              .filter((feature) => activeFilter === "all" || feature.category === activeFilter)
              .map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className={index % 3 === 0 ? "md:col-span-1 lg:col-span-1" : ""}
                  layout // Add layout animation for smooth transitions when filtering
                  animate={{ opacity: 1 }} // Ensure items are visible when filtered
                >
                  <CarouselFeatureCard {...feature} />
                </motion.div>
              ))}
          </div>

          {/* Call to action */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join our waitlist to be the first to experience these exciting new features as they roll out.
            </p>
            <Button
              onClick={() => router.push("/waitlist")}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full px-8 py-6 shadow-md hover:shadow-lg transition-all text-base"
            >
              Join the Waitlist
            </Button>
          </motion.div>
        </section>

        {/* Solutions Section - Modernized with glassmorphism */}
        <section id="solutions" ref={solutionsRef} className="pt-0 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          ></motion.div>

          <motion.div
            className="mt-12 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 text-white shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Fitness Journey?</h3>
                <p className="text-gray-300 mb-8">
                  Join thousands of users who have already improved their health and wellness with FitWell&apos;s AI-powered
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
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full px-8 py-6 shadow-md hover:shadow-lg transition-all text-base group relative overflow-hidden"
                  >
                    <span className="relative z-10">Get Started Today</span>
                    <span className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
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
                    className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center cursor-pointer"
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Play className="w-8 h-8 text-white ml-1" />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* FAQ Section - Modernized with glassmorphism */}
        <section id="faq" ref={faqRef} className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-violet-500 to-purple-600">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about FitWell&apos;s AI-powered fitness platform.
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
                <motion.button
                  onClick={() => toggleFaq(index)}
                  className={`w-full text-left p-6 rounded-xl border backdrop-blur-sm transition-all duration-300 ${
                    openFaq === index
                      ? "border-green-300 bg-gradient-to-r from-green-50 to-green-100 shadow-md"
                      : "border-gray-200 hover:border-green-200 hover:bg-gray-50/80"
                  }`}
                  whileHover={{
                    scale: openFaq === index ? 1 : 1.01,
                    boxShadow: openFaq === index ? "" : "0 4px 20px rgba(0,0,0,0.05)",
                  }}
                  whileTap={{ scale: 0.99 }}
                  aria-expanded={openFaq === index}
                  aria-controls={`faq-content-${index}`}
                >
                  <div className="flex justify-between items-center">
                    <motion.h3
                      className={`font-semibold text-lg transition-colors duration-300 ${openFaq === index ? "text-green-700" : "text-gray-800"}`}
                      animate={{ color: openFaq === index ? "#047857" : "#1f2937" }}
                    >
                      {faq.question}
                    </motion.h3>
                    <motion.div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                        openFaq === index ? "bg-green-100" : "bg-gray-100"
                      }`}
                      animate={{
                        backgroundColor: openFaq === index ? "rgba(220, 252, 231, 1)" : "rgba(243, 244, 246, 1)",
                        rotate: openFaq === index ? 180 : 0,
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <ChevronDown
                        className={`h-5 w-5 transition-colors duration-300 ${openFaq === index ? "text-green-600" : "text-gray-500"}`}
                      />
                    </motion.div>
                  </div>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        id={`faq-content-${index}`}
                        initial={{ opacity: 0, height: 0, y: -10 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -10 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                          opacity: { duration: 0.2 },
                        }}
                        className="mt-4 text-gray-600 overflow-hidden"
                      >
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                        >
                          {faq.answer}
                        </motion.p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer - Compact and modern */}
        <footer className="bg-gray-900 text-white py-8 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Logo */}
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                  <Dumbbell className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold">FitWell</span>
              </div>

              {/* Links */}
              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
                <a href="#" className="hover:text-white transition-colors">
                  Privacy
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Terms
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Contact
                </a>
              </div>

              {/* Copyright */}
              <p className="text-gray-500 text-sm">© {new Date().getFullYear()} FitWell</p>
            </div>
          </div>
        </footer>
      </div>
    </motion.div>
  )
}

