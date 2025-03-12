"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getTrendData, generateSuggestions, formatTrendDataForCharts } from "@/lib/trendUtils"
import { toast } from "sonner"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ArrowUpRight, ArrowDownRight, TrendingUp, BarChart2, PieChartIcon, Utensils, Flame, Info } from 'lucide-react'

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

export default function TrendsPage() {
  const { user } = useAuth()
  const [period, setPeriod] = useState<"week" | "month" | "year">("week")
  const [trendData, setTrendData] = useState<any>(null)
  const [chartData, setChartData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [suggestions, setSuggestions] = useState<string[]>([])

  // Show loading state when the page is first loaded
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (user?.uid) {
      fetchTrendData()
    }
  }, [user, period])

  const fetchTrendData = async () => {
    try {
      setLoading(true)
      const data = await getTrendData(user?.uid as string, period)
      setTrendData(data)

      // Format data for charts
      if (data.trends && data.trends.length > 0) {
        setChartData(formatTrendDataForCharts(data))
        setSuggestions(generateSuggestions(data))
      } else {
        setChartData(null)
        setSuggestions(["Start logging your meals to see personalized insights and trends."])
      }
    } catch (error) {
      console.error("Error fetching trend data:", error)
      toast.error("Failed to fetch trend data")
    } finally {
      setLoading(false)
    }
  }

  // Add sample data for demonstration if no data exists
  useEffect(() => {
    if (!loading && !trendData && user?.uid) {
      // Create sample data
      const sampleData = {
        trends: [
          { date: new Date(), calorieIntake: 1800, waterIntake: 2000 },
          { date: new Date(Date.now() - 86400000), calorieIntake: 2100, waterIntake: 1800 },
          { date: new Date(Date.now() - 86400000 * 2), calorieIntake: 1950, waterIntake: 2200 },
        ],
        averages: {
          calories: 1950,
          protein: 75,
          carbs: 220,
          fat: 65,
          water: 2000,
        },
        mostEatenFoods: [
          { name: "Chicken", count: 5 },
          { name: "Rice", count: 4 },
          { name: "Broccoli", count: 3 },
          { name: "Eggs", count: 2 },
        ],
      }

      setTrendData(sampleData)
      setChartData(formatTrendDataForCharts(sampleData))
      setSuggestions(generateSuggestions(sampleData))
    }
  }, [loading, trendData, user?.uid])

  return (
    <div className="container mx-auto px-4 py-8 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col gap-6"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold">Trends & Insights</h1>
            <p className="text-muted-foreground mt-1">Track your progress and get personalized insights</p>
          </div>
          <div className="relative self-start">
            <Tabs
              value={period}
              onValueChange={(value) => setPeriod(value as "week" | "month" | "year")}
              className="relative z-10"
            >
              <TabsList className="rounded-full bg-muted/80 p-1 relative">
                <TabsTrigger
                  value="week"
                  className="rounded-full px-6 py-1.5 transition-all duration-500 ease-in-out relative z-10"
                >
                  Week
                </TabsTrigger>
                <TabsTrigger
                  value="month"
                  className="rounded-full px-6 py-1.5 transition-all duration-500 ease-in-out relative z-10"
                >
                  Month
                </TabsTrigger>
                <TabsTrigger
                  value="year"
                  className="rounded-full px-6 py-1.5 transition-all duration-500 ease-in-out relative z-10"
                >
                  Year
                </TabsTrigger>
                <motion.div
                  className="absolute top-1 bottom-1 rounded-full bg-white shadow-sm z-0"
                  initial={false}
                  animate={{
                    left: period === "week" ? "0%" : period === "month" ? "33.333%" : "66.666%",
                    width: "33.333%",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    mass: 1,
                  }}
                />
              </TabsList>
            </Tabs>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : !chartData ? (
          <div className="text-center py-12 bg-muted/50 rounded-lg">
            <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No trend data available</h3>
            <p className="text-muted-foreground mb-6">Start logging your meals to see your trends</p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.1,
                  ease: "easeOut",
                }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Average Calories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="text-2xl font-bold">
                        {Math.round(trendData.averages.calories)}
                        <span className="text-sm font-normal text-muted-foreground ml-1">cal</span>
                      </div>
                      <div
                        className={`flex items-center ${
                          trendData.averages.calories > 2000 ? "text-red-500" : "text-green-500"
                        }`}
                      >
                        {trendData.averages.calories > 2000 ? (
                          <ArrowUpRight className="w-4 h-4 mr-1" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 mr-1" />
                        )}
                        <span className="text-sm font-medium">
                          {trendData.averages.calories > 2000 ? "High" : "Good"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.2,
                  ease: "easeOut",
                }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Water Intake</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="text-2xl font-bold">
                        {Math.round(trendData.averages.water)}
                        <span className="text-sm font-normal text-muted-foreground ml-1">ml</span>
                      </div>
                      <div
                        className={`flex items-center ${
                          trendData.averages.water < 2000 ? "text-amber-500" : "text-blue-500"
                        }`}
                      >
                        {trendData.averages.water < 2000 ? (
                          <ArrowDownRight className="w-4 h-4 mr-1" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4 mr-1" />
                        )}
                        <span className="text-sm font-medium">{trendData.averages.water < 2000 ? "Low" : "Good"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.3,
                  ease: "easeOut",
                }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Protein Intake</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="text-2xl font-bold">
                        {Math.round(trendData.averages.protein)}
                        <span className="text-sm font-normal text-muted-foreground ml-1">g</span>
                      </div>
                      <div
                        className={`flex items-center ${
                          trendData.averages.protein < 50 ? "text-amber-500" : "text-green-500"
                        }`}
                      >
                        {trendData.averages.protein < 50 ? (
                          <ArrowDownRight className="w-4 h-4 mr-1" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4 mr-1" />
                        )}
                        <span className="text-sm font-medium">{trendData.averages.protein < 50 ? "Low" : "Good"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Calorie Trend Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.4,
                  ease: "easeOut",
                }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold">Calorie Intake</CardTitle>
                      <BarChart2 className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <CardDescription>Daily calorie intake over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData.calorieData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="calories"
                            stroke="#8884d8"
                            strokeWidth={2}
                            activeDot={{ r: 8 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Macros Distribution Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.5,
                  ease: "easeOut",
                }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold">Macros Distribution</CardTitle>
                      <PieChartIcon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <CardDescription>Average macronutrient breakdown</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData.macrosData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {chartData.macrosData.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Most Eaten Foods */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.6,
                ease: "easeOut",
              }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Most Eaten Foods</CardTitle>
                    <Utensils className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <CardDescription>Your most frequently consumed foods</CardDescription>
                </CardHeader>
                <CardContent>
                  {trendData.mostEatenFoods.length > 0 ? (
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData.foodData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#8884d8">
                            {chartData.foodData.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No food data available yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Suggestions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.7,
                ease: "easeOut",
              }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Personalized Insights</CardTitle>
                    <Info className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <CardDescription>Suggestions based on your eating patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {suggestions.map((suggestion, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                      >
                        <div className="mt-0.5 text-primary">
                          <Flame className="w-5 h-5" />
                        </div>
                        <p>{suggestion}</p>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  )
}
