"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import {
  ArrowRight,
  CheckCircle2,
  Dumbbell,
  Droplets,
  Brain,
  MessageSquare,
  LineChart,
  Apple,
  ChevronDown,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { useEffect, useState } from "react"

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  if (loading) return null

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
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

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full border-b border-gray-200/20 bg-white/70 backdrop-blur-lg shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link className="flex items-center space-x-2 font-bold text-gray-800" href="/">
            <Dumbbell className="h-6 w-6 text-emerald-500" />
            <span>FitWell</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link className="hidden text-sm text-gray-600 hover:text-emerald-500 transition-colors sm:block" href="/login">
              Log In
            </Link>
            <Button
              className="bg-gradient-to-r from-emerald-500/90 to-green-500/90 text-white backdrop-blur-sm hover:from-emerald-600/90 hover:to-green-600/90 shadow-sm transition-all duration-200"
              onClick={() => router.push("/login")}
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
        {/* Animated Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Curved Lines */}
          <svg className="absolute h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad1" x1="1" y1="0" x2="0" y2="0">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
                <stop offset="50%" stopColor="#10b981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="grad2" x1="1" y1="0" x2="0" y2="0">
                <stop offset="0%" stopColor="#002a1c" stopOpacity="0" />
                <stop offset="50%" stopColor="#002a1c" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#002a1c" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Top Curves */}
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                repeatDelay: 1,
              }}
              d="M 100 100 Q 300 0 500 100 T 900 100"
              fill="none"
              stroke="url(#grad1)"
              strokeWidth="1"
            />
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                repeatDelay: 1,
                delay: 0.5,
              }}
              d="M 0 200 Q 200 100 400 200 T 800 200"
              fill="none"
              stroke="url(#grad2)"
              strokeWidth="1"
            />
            {/* Bottom Curves */}
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                repeatDelay: 1,
                delay: 1,
              }}
              d="M 100 600 Q 300 500 500 600 T 900 600"
              fill="none"
              stroke="url(#grad1)"
              strokeWidth="1"
            />
          </svg>

          {/* Straight Lines */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ x: "100%", opacity: 0 }}
                animate={{
                  x: "-100%",
                  opacity: [0, 0.5, 0.5, 0],
                }}
                transition={{
                  duration: 2.5,
                  delay: i * 0.2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                  ease: "linear",
                }}
                className="absolute right-0"
                style={{
                  top: `${15 + i * 10}%`,
                  height: "1px",
                  width: "100%",
                  background: `linear-gradient(90deg, transparent, ${i % 2 === 0 ? "#10b981" : "#34d399"}60, transparent)`,
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* Animated Background */}
        <div className="absolute inset-0 z-[1]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="absolute -left-1/4 top-1/4 h-96 w-96 rounded-full bg-green-500/10 blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
            className="absolute -right-1/4 top-1/2 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl"
          />
        </div>

        {/* Updated Content */}
        <motion.div 
          style={{ opacity, scale }}
          className="container relative z-[3] px-4 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mx-auto max-w-3xl space-y-8"
          >
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Your Personalized Fitness Journey
            </h1>
            <p className="mx-auto max-w-2xl text text-gray-600 sm:text-xl">
              Track your meals, create custom diet plans, monitor your progress, and get AI-powered guidance all in one
              place
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button
                className="bg-gradient-to-r from-emerald-500 to-green-500 text-lg text-white hover:from-emerald-600 hover:to-green-600"
                onClick={() => router.push("/login")}
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Updated Features Section */}
      <section id="features" className="relative z-10 border-t border-gray-200 bg-gray-50 py-24">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="mb-16 text-center"
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Why Choose FitWell?
            </h2>
            <p className="mt-4 text-gray-600">Experience fitness tracking that works for you</p>
          </motion.div>

          {/* Updated Bento Grid Layout */}
          <div className="grid grid-cols-2 gap-4 md:gap-6 auto-rows-[200px] sm:auto-rows-[250px]">
            {/* First Row: Two Square Cards */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              className="group rounded-3xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm transition-all hover:shadow-md hover:border-emerald-200 flex flex-col"
            >
              <div className="flex flex-col items-center text-center mb-3">
                <div className="rounded-xl bg-green-100 p-2 mb-2">
                  <LineChart className="h-4 w-4 text-green-600" />
                </div>
                <h3 className="text-sm font-bold">Nutrition Tracking</h3>
              </div>
              <p className="text-gray-600 text-sm md:text-base line-clamp-3">
                Monitor your daily intake of calories, proteins, fats, and carbs with detailed insights
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group rounded-3xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm transition-all hover:shadow-md hover:border-emerald-200 flex flex-col"
            >
              <div className="flex flex-col items-center text-center mb-3">
                <div className="rounded-xl bg-blue-100 p-2 mb-2">
                  <Droplets className="h-4 w-4 text-blue-600" />
                </div>
                <h3 className="text-lg md:text-xl font-bold">Water Intake</h3>
              </div>
              <p className="text-gray-600 text-sm md:text-base line-clamp-3">
                Track your hydration levels and get reminders to stay properly hydrated throughout the day
              </p>
            </motion.div>

            {/* Second Row: Rectangle Card */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              className="col-span-2 group rounded-3xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm transition-all hover:shadow-md hover:border-emerald-200"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6 h-full">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-100 p-2">
                    <Apple className="h-4 w-4 text-emerald-600" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold">Custom Diet Plans</h3>
                </div>
                <div className="flex-1">
                  <p className="text-gray-600 text-sm md:text-base">
                    Create personalized meal plans based on your goals, preferences, and dietary restrictions. Our smart
                    algorithm adapts to your progress and helps you stay on track with your nutrition goals.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Third Row: Two Square Cards */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              className="group rounded-3xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm transition-all hover:shadow-md hover:border-emerald-200 flex flex-col"
            >
              <div className="flex flex-col items-center text-center mb-3">
                <div className="rounded-xl bg-purple-100 p-2 mb-2">
                  <MessageSquare className="h-4 w-4 text-purple-600" />
                </div>
                <h3 className="text-lg md:text-xl font-bold">AI Health Assistant</h3>
              </div>
              <p className="text-gray-600 text-sm md:text-base line-clamp-3">
                Get personalized advice and answers to your fitness and nutrition questions
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              className="group rounded-3xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm transition-all hover:shadow-md hover:border-emerald-200 flex flex-col"
            >
              <div className="flex flex-col items-center text-center mb-3">
                <div className="rounded-xl bg-indigo-100 p-2 mb-2">
                  <Brain className="h-4 w-4 text-indigo-600" />
                </div>
                <h3 className="text-lg md:text-xl font-bold">Smart Recommendations</h3>
              </div>
              <p className="text-gray-600 text-sm md:text-base line-clamp-3">
                Receive personalized recommendations based on your activity, goals, and progress
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Updated FAQ Section */}
      <section className="relative z-10 border-t border-gray-200 bg-white py-24">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="mb-16 text-center"
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-gray-600">Everything you need to know about FitWell</p>
          </motion.div>

          <div className="mx-auto max-w-3xl">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="mb-4"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className={`w-full text-left p-6 rounded-xl border ${
                    openFaq === index
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-gray-200 hover:border-emerald-200 hover:bg-gray-50"
                  } transition-all duration-200`}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg">{faq.question}</h3>
                    <ChevronDown
                      className={`h-5 w-5 text-emerald-500 transition-transform ${
                        openFaq === index ? "rotate-180" : ""
                      }`}
                    />
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
        </div>
      </section>

      {/* Updated CTA Section */}
      <section className="relative z-10 border-t border-gray-200 bg-gray-50 py-24">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-3xl rounded-3xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-green-50 p-8 text-center shadow-sm md:p-12 lg:p-16"
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Ready to Transform Your Fitness?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-600">
              Join thousands of users who have already improved their health and wellness with FitWell
            </p>
            <ul className="mx-auto mt-8 flex max-w-xl flex-col gap-4 text-left">
              <li className="flex items-center space-x-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span className="text-gray-700">Personalized meal and workout plans</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span className="text-gray-700">AI-powered health assistant</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span className="text-gray-700">Comprehensive nutrition tracking</span>
              </li>
            </ul>
            <Button
              className="mt-8 bg-gradient-to-r from-emerald-500 to-green-500 text-lg text-white hover:from-emerald-600 hover:to-green-600"
              onClick={() => router.push("/login")}
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Updated Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.6 }}
        className="border-t border-gray-200 bg-white py-8"
      >
        <div className="container flex flex-col items-center justify-between space-y-4 px-4 md:flex-row md:space-y-0">
          <div className="flex items-center space-x-2">
            <Dumbbell className="h-6 w-6 text-emerald-500" />
            <span className="font-bold">FitWell</span>
          </div>
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} FitWell. All rights reserved.</p>
          <div className="flex space-x-6">
            
          </div>
        </div>
      </motion.footer>
    </div>
  )
}

