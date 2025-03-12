"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Target,
  Utensils,
  GanttChart,
  Dumbbell,
  Edit2,
  Droplets,
  Plus,
  Minus,
  CircleDashed,
  Trophy,
  TrendingUp,
  MessageSquare,
  ArrowRight,
} from "lucide-react"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import { Progress } from "@/components/ui/progress"
import { type CaloriesState, type MacroData, useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { waterIntakeDB } from "@/lib/waterIntakeDB"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { updateStreaks } from "@/lib/updateStreaks"

export default function Home() {
  const { user, calories, setCalories } = useAuth()
  const [newGoal, setNewGoal] = useState<number>(1700)
  const [waterIntake, setWaterIntake] = useState(0) // Will now store ml
  const [waterGoal] = useState(2500) // 2.5L in ml as default goal

  const router = useRouter()

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.uid) return

      try {
        // Fetch user data including calorie goal
        const userResponse = await fetch(`/api/user?uid=${user.uid}`)
        const userData = await userResponse.json()

        if (userResponse.ok && userData.user) {
          const newBaseGoal = userData.user.calorieGoal || calories.baseGoal
          setCalories((prev) => ({
            ...prev,
            baseGoal: newBaseGoal,
          }))
          setNewGoal(newBaseGoal)
        }

        const fetchTodaysFoodIntake = async () => {
          const response = await fetch(`/api/diary/${user.uid}`)
          const data = await response.json()

          if (response.ok && data) {
            const totalCalories = Math.max(data.totalCalories - user?.exercise || 0, 0)

            let totalCarbs = 0
            let totalProtein = 0
            let totalFat = 0

            const processMeal = (foods: any[]) => {
              foods.forEach((food) => {
                totalCarbs += Number.parseInt(food.carbs || "0")
                totalProtein += Number.parseInt(food.protein || food.protien || "0")
                totalFat += Number.parseInt(food.fat || "0")
              })
            }

            if (data.breakfast?.foods) processMeal(data.breakfast.foods)
            if (data.lunch?.foods) processMeal(data.lunch.foods)
            if (data.dinner?.foods) processMeal(data.dinner.foods)

            setCalories((prev) => ({
              ...prev,
              intake: totalCalories,
              exercise: user.exercise,
              carbs: {
                current: totalCarbs,
              },
              protein: {
                current: totalProtein,
              },
              fat: {
                current: totalFat,
              },
            }))
          }
        }

        fetchTodaysFoodIntake()
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }

    fetchUserData()
  }, [user?.uid])

  useEffect(() => {
    if (!user?.uid) return

    const loadWaterIntake = async () => {
      const amount = await waterIntakeDB.getWaterIntake(user.uid)
      setWaterIntake(amount)
    }

    // Check if day has changed at midnight
    const checkDayChange = () => {
      const now = new Date()
      const hours = now.getHours()
      const minutes = now.getMinutes()

      // If it's midnight (00:00), reset the water intake
      if (hours === 0 && minutes === 0) {
        setWaterIntake(0)
        waterIntakeDB.saveWaterIntake(user.uid, 0)
      }
    }

    // Set up interval to check for day change
    const intervalId = setInterval(checkDayChange, 60000) // Check every minute

    // Initial load
    loadWaterIntake()

    // Clean up interval on unmount
    return () => clearInterval(intervalId)
  }, [user?.uid])

  const updateValue = (key: keyof CaloriesState, value: number) => {
    setCalories((prev) => ({
      ...prev,
      [key]: typeof prev[key] === "object" ? { ...(prev[key] as MacroData), current: value } : value,
    }))
  }

  const remaining = Math.max(0, calories.baseGoal - calories.intake)
  const progress = (calories.intake / calories.baseGoal) * 100

  const updateCalorieGoal = async () => {
    if (!user?.uid) return

    try {
      const response = await fetch("/api/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: user.uid,
          calorieGoal: newGoal,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update calorie goal")
      }

      setCalories((prev) => ({
        ...prev,
        baseGoal: newGoal,
      }))
      toast.success("Calorie goal updated!")
    } catch (error) {
      console.error("Error updating calorie goal:", error)
      toast.error("Failed to update calorie goal")
    }
  }

  const handleAddWater = async () => {
    if (!user?.uid) return

    try {
      await waterIntakeDB.saveWaterIntake(user.uid, waterIntake + 250)
      setWaterIntake((prev) => prev + 250)
      await updateStreaks(user.uid)
    } catch (error) {
      console.error("Error updating water intake:", error)
    }
  }

  const handleRemoveWater = async () => {
    if (waterIntake >= 250) {
      // Checks if at least 250ml to remove
      const newAmount = waterIntake - 250 // Removes 250ml each time
      setWaterIntake(newAmount)
      await waterIntakeDB.saveWaterIntake(user?.uid!, newAmount)
    }
  }

  // Feature cards for the bento grid
  const featureCards = [
    {
      title: "Today's Meals",
      description: "View your daily food diary",
      icon: <Utensils className="w-5 h-5" />,
      bgClass: "bg-gradient-to-r from-gray-100 via-gray-50 to-white-50",
      iconBgClass: "",
      route: "/plan",
      size: "col-span-2",
    },
    {
      title: "Challenges",
      description: "Complete challenges to earn rewards",
      icon: <Trophy className="w-5 h-5 text-purple-600" />,
      bgClass: "bg-gradient-to-r from-purple-100 via-purple-50 to-white-50",
      iconBgClass: "bg-purple-100",
      route: "/challenges",
      size: "col-span-1",
    },
    {
      title: "Trends",
      description: "Track your progress over time",
      icon: <TrendingUp className="w-5 h-5 text-blue-600" />,
      bgClass: "bg-gradient-to-r from-blue-100 via-blue-50 to-white-50",
      iconBgClass: "bg-blue-100",
      route: "/trends",
      size: "col-span-1",
    },
    // {
    //   title: "Assistant",
    //   description: "Get personalized health advice",
    //   icon: <MessageSquare className="w-5 h-5 text-green-600" />,
    //   bgClass: "bg-gradient-to-r from-green-100 via-green-50 to-white-50",
    //   iconBgClass: "bg-green-100",
    //   route: "/chat",
    //   size: "col-span-2",
    // },
  ]

  return (
    <div className="min-h-screen leading-tight tracking-tight p-4 max-w-md mx-auto pb-24 space-y-5">
      {/* Welcome section with text animation */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative cursor-pointer group"
            onClick={() => router.push("/more")}
          >
            <Avatar className="w-10 h-10 border-2 border-transparent group-hover:border-primary transition-all">
              <AvatarImage src={user?.photoURL} alt={user?.displayName} />
              <AvatarFallback>{user?.displayName?.split(" ")[0]}</AvatarFallback>
            </Avatar>

          </motion.div>
          <motion.h1
            className="text-2xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Welcome back, {user?.displayName?.split(" ")[0]}
          </motion.h1>
        </div>
        <motion.div
          className="text-sm font-medium text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
        </motion.div>
      </motion.div>

      {/* Calories Card */}
      <motion.div
        className="text-black border rounded-3xl p-6 shadow-sm bg-white"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="flex justify-between items-center mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-xl font-bold tracking-tight">Calories</h1>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
            onClick={() => {
              setNewGoal(calories.baseGoal)
              setIsDrawerOpen(true)
            }}
          >
            <Edit2 className="h-4 w-4 text-gray-500" />
          </Button>
        </motion.div>

        {/* Progress Circle with animated text */}
        <div className="flex items-center justify-between">
          <div className="w-[140px] h-[140px]">
            <CircularProgressbar
              value={calories.intake - calories.exercise}
              maxValue={calories.baseGoal}
              strokeWidth={5}
              styles={buildStyles({
                pathColor: "currentColor",
                trailColor: "#e5e5e5",
                strokeLinecap: "round",
                textSize: "0px",
              })}
            />
            {/* Overlay for centered content with animations */}
            <div className="relative -mt-[140px] flex flex-col items-center justify-center h-[140px]">
              <motion.span
                className="text-3xl font-bold leading-none mb-1"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
              >
                {remaining}
              </motion.span>
              <motion.span
                className="uppercase text-xs leading-tight font-medium tracking-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                REMAINING
              </motion.span>
            </div>
          </div>

          {/* Stats with staggered text animations */}
          <motion.div
            className="space-y-3.5 flex-1 ml-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.6,
                },
              },
            }}
          >
            <motion.div
              className="flex justify-between items-center"
              variants={{
                hidden: { opacity: 0, y: 5 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-500" />
                <span className="text-sm">Daily Goal</span>
              </div>
              <motion.span
                className="text-sm font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                {calories.baseGoal}
              </motion.span>
            </motion.div>

            {/* Calories and Exercise stats with animations */}
            {[
              {
                label: "Calories Intake",
                value: calories.intake,
                icon: Utensils,
                iconColor: "text-green-500",
              },
              {
                label: "Exercise",
                value: calories.exercise,
                icon: Dumbbell,
                iconColor: "text-orange-500",
              },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                className="flex justify-between items-center"
                variants={{
                  hidden: { opacity: 0, y: 5 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <div className="flex items-center gap-2">
                  <item.icon className={`w-4 h-4 ${item.iconColor}`} />
                  <span className="text-sm">{item.label}</span>
                </div>
                <motion.p
                  className="text-sm font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  {item.value}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Feature Cards Bento Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Challenges Card */}
        <motion.div
          className="bg-[#F8F2FF] p-4 rounded-2xl border cursor-pointer hover:shadow-md transition-shadow relative overflow-hidden group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
          onClick={() => router.push("/challenges")}
        >
          <div className="flex items-start h-full">
            <div className="flex-1">
              <div className="bg-[#F3E6FF] w-10 h-10 rounded-xl flex items-center justify-center mb-3">
                <Trophy className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="font-semibold text-base mb-0.5">Challenges</h2>
                <p className="text-sm text-gray-600 leading-tight">Complete challenges to earn rewards</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </div>
        </motion.div>

        {/* Trends Card */}
        <motion.div
          className="bg-[#F2F8FF] p-4 rounded-2xl border cursor-pointer hover:shadow-md transition-shadow relative overflow-hidden group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          onClick={() => router.push("/trends")}
        >
          <div className="flex items-start h-full">
            <div className="flex-1">
              <div className="bg-[#E6F0FF] w-10 h-10 rounded-xl flex items-center justify-center mb-3">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="font-semibold text-base mb-0.5">Trends</h2>
                <p className="text-sm text-gray-600 leading-tight">Track your progress over time</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </div>
        </motion.div>

        {/* Assistant Card - Full Width */}
        {/* <motion.div
          className="col-span-2 bg-[#F2FFF7] p-4 rounded-2xl border cursor-pointer hover:shadow-md transition-shadow relative overflow-hidden group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          onClick={() => router.push("/chat")}
        >
          <div className="flex items-start h-full">
            <div className="flex-1">
              <div className="bg-[#E6FFE6] w-10 h-10 rounded-xl flex items-center justify-center mb-3">
                <MessageSquare className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="font-semibold text-base mb-0.5">Assistant</h2>
                <p className="text-sm text-gray-600 leading-tight">Get personalized health advice</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </div>
        </motion.div> */}
      </div>

      {/* Macros Section */}
      <div>
        <h2 className="text-xl font-bold mb-3">Macros</h2>
        <div className="grid grid-cols-3 gap-3">
          {/* Carbs Card */}
          <motion.div
            className="text-black border rounded-2xl p-4 hover:shadow-md transition-shadow bg-white"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <GanttChart className="w-4 h-4 text-purple-500" />
              <h3 className="text-sm font-medium">Carbs</h3>
            </div>
            <div className="text-2xl font-semibold mb-1">{calories.carbs.current}g</div>
            <Progress 
            value={(calories.carbs.current / calories.baseGoal) * 100}
  className="h-1.5 bg-purple-100 [&>div]:bg-purple-500"
/>
          </motion.div>

          {/* Protein Card */}
          <motion.div
            className="text-black border rounded-2xl p-4 hover:shadow-md transition-shadow bg-white"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Dumbbell className="w-4 h-4 text-red-500" />
              <h3 className="text-sm font-medium">Protein</h3>
            </div>
            <div className="text-2xl font-semibold mb-1">{calories.protein.current}g</div>
            <Progress
             value={(calories.protein.current / calories.baseGoal) * 100}
              className="h-1.5 bg-red-100 [&>div]:bg-red-500"
            />
          </motion.div>

          {/* Fat Card */}
          <motion.div
            className="text-black border rounded-2xl p-4 hover:shadow-md transition-shadow bg-white"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2, delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <CircleDashed className="w-4 h-4 text-yellow-500" />
              <h3 className="text-sm font-medium">Fat</h3>
            </div>
            <div className="text-2xl font-semibold mb-1">{calories.fat.current}g</div>
            <Progress
              value={(calories.fat.current / calories.baseGoal) * 100}
              className="h-1.5 bg-yellow-100 [&>div]:bg-yellow-500"
            />
          </motion.div>
        </div>
      </div>

      {/* Reminders Section */}
      <div>
        <h2 className="text-xl font-bold mb-3">Reminders</h2>
        <div className="space-y-3">
          {/* Water Tracking Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2, delay: 0.3 }}
          >
            <Card className="border rounded-2xl shadow-none bg-white">
              <CardHeader className="pb-0 h-2">
                <CardTitle className="flex items-center gap-2 p-0">
                  <Droplets className="h-4 w-4 text-cyan-500" />
                  <span className="text-sm font-medium">Water Intake</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <motion.div
                  className="flex items-center justify-between"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <span className="text-xs">Daily Goal: 2500ml</span>
                  <span className="text-xs font-medium">{waterIntake}ml / 2500ml</span>
                </motion.div>

                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
  <Progress
  value={(waterIntake / waterGoal) * 100}
  className="h-1.5 bg-blue-100 [&>div]:bg-blue-500"
/>
                </motion.div>

                <motion.div
                  className="flex items-center justify-between gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={handleRemoveWater}
                    disabled={waterIntake <= 0}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>

                  <div className="flex-1 text-center">
                    <div className="text-2xl font-semibold">{waterIntake}</div>
                    <div className="text-xs">ml today</div>
                  </div>

                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={handleAddWater}>
                    <Plus className="h-3 w-3" />
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Challenge Reminder Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2, delay: 0.4 }}
          >
            <Card className="border rounded-2xl shadow-none bg-white">
              <CardHeader className="pb-0 h-2">
                <CardTitle className="flex items-center gap-2 p-0">
                  <Trophy className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">Active Challenge</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <h3 className="font-medium">5 Days Without Junk Food</h3>
                    <p className="text-xs text-muted-foreground mt-1">2 days remaining</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs" onClick={() => router.push("/challenges")}>
                    View
                  </Button>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Progress</span>
                    <span>3/5 days</span>
                  </div>
                  <Progress 
               value={(calories.protein.current / calories.baseGoal) * 100} 
                  className="h-1.5 bg-purple-100 [&>div]:bg-purple-500" 
                />        
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <DrawerHeader className="text-center">
            <DrawerTitle>Update Daily Goal</DrawerTitle>
            <DrawerDescription>Enter your new calorie goal below</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 py-0 pb-3 space-y-6">
            <Input
              type="text"
              value={newGoal}
              onChange={(e) => setNewGoal(Number(e.target.value))}
              className="text-center text-lg h-12"
            />
          </div>
          <DrawerFooter className="pt-2">
            <Button
              className="w-full text-white"
              onClick={async () => {
                await updateCalorieGoal()
                setIsDrawerOpen(false)
              }}
            >
              Save changes
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

