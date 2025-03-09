"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Target, Utensils, GanttChart, Dumbbell, Edit2, Droplets, Plus, Minus } from "lucide-react"
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

export default function Home() {
  const { user, calories, setCalories } = useAuth()
  const [newGoal, setNewGoal] = useState<number>(1700)
  const [waterIntake, setWaterIntake] = useState(0) // Will now store ml
  const [waterGoal] = useState(2500) // 2.5L in ml as default goal

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
            const totalCalories = data.totalCalories || 0

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
    const newAmount = waterIntake + 250  // Adds 250ml each time
    setWaterIntake(newAmount)
    await waterIntakeDB.saveWaterIntake(user.uid!, newAmount)
    toast.success("Water intake logged!")
  }

  const handleRemoveWater = async () => {
    if (waterIntake >= 250) {  // Checks if at least 250ml to remove
      const newAmount = waterIntake - 250  // Removes 250ml each time
      setWaterIntake(newAmount)
      await waterIntakeDB.saveWaterIntake(user.uid!, newAmount)
      toast.info("Water intake updated")
    }
  }

  return (
    <div className="min-h-screen leading-tight tracking-tight p-4 max-w-md mx-auto pb-20 space-y-3">
      <motion.div
        className=" text-black border rounded-3xl p-6 shadow-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.h1 className="text-2xl font-bold  mb-8">Calories</motion.h1>

        {/* Progress Circle */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-[200px] h-[200px]">
            <CircularProgressbar
              value={calories.intake - calories.exercise}
              maxValue={calories.baseGoal}
              strokeWidth={5}
              styles={buildStyles({
                pathColor: "#38bdf8",

                strokeLinecap: "round",
                // Custom text removed to use overlay
                textSize: "0px",
              })}
            />
            {/* Overlay for centered content */}
            <div className="relative -mt-[200px] flex flex-col items-center justify-center h-[200px]">
              <span className="text-[48px] font-bold  leading-none mb-1">{remaining}</span>
              <span className="text-[#666666] uppercase text-sm tracking-wider">REMAINING</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-3.5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-500" />
              <span className="text-sm">Daily Goal</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{calories.baseGoal}</span>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-gray-100"
                onClick={() => {
                  setNewGoal(calories.baseGoal)
                  setIsDrawerOpen(true)
                }}
              >
                <Edit2 className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
          </div>
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
          ].map((item) => (
            <div key={item.label} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <item.icon className={`w-4 h-4 ${item.iconColor}`} />
                <span className="text-sm ">{item.label}</span>
              </div>
<<<<<<< HEAD
              <p className="w-16 bg-transparent text-right text-sm  focus:outline-none">
                {" "}
                {item.value}
              </p>
=======
              <input
                type="number"
                value={item.value}
                onChange={(e) =>
                  updateValue(item.label.toLowerCase().replace(" ", "") as keyof CaloriesState, Number(e.target.value))
                }
                className="w-16 bg-transparent text-right text-sm  focus:outline-none"
              />
>>>>>>> 3e401717b1ae163dcda0a9171ddd0ad126324f6e
            </div>
          ))}
        </div>
      </motion.div>

      {/* Macros Cards */}
      <div className="grid grid-cols-2 gap-3">
        {[
          {
            title: "Carbs",
            data: calories.carbs,
            icon: GanttChart,
            iconColor: "text-purple-500",
          },
          {
            title: "Protein",
            data: calories.protein,
            icon: Dumbbell,
            iconColor: "text-red-500",
          },
          {
            title: "Fat",
            data: calories.fat,
            icon: Dumbbell,
            iconColor: "text-yellow-500",
          },
        ].map((macro, index) => (
          <motion.div
            key={macro.title}
            className="bg-white text-black border shadow-sm rounded-2xl p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.6 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <macro.icon className={`w-4 h-4 ${macro.iconColor}`} />
              <h3 className="text-sm font-medium">{macro.title}</h3>
            </div>
            <Progress value={(macro.data.current / calories.baseGoal) * 100} className="h-1.5 mb-3" />
            <input
              type="number"
              value={macro.data.current}
              onChange={(e) => updateValue(macro.title.toLowerCase() as keyof CaloriesState, Number(e.target.value))}
              className="w-full bg-transparent text-2xl font-semibold focus:outline-none"
            />
          </motion.div>
        ))}
      </div>

      {/* Water Tracking Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
        <Card className="border shadow-sm rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Water Intake</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Daily Goal: 2.5L</span>
              <span className="text-xs font-medium">
                {(waterIntake / 1000).toFixed(2)}L / 2.5L
              </span>
            </div>

            <Progress
              value={(waterIntake / waterGoal) * 100}
              className="h-1.5 bg-blue-50"
              indicatorClassName="bg-blue-500"
            />

            <div className="flex items-center justify-between gap-4">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full border-gray-200"
                onClick={handleRemoveWater}
                disabled={waterIntake <= 0}
              >
                <Minus className="h-3 w-3" />
              </Button>

              <div className="flex-1 text-center">
                <div className="text-2xl font-semibold">{(waterIntake / 1000).toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">liters today</div>
              </div>

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full border-gray-200"
                onClick={handleAddWater}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <DrawerHeader className="text-center">
            <DrawerTitle>Update Daily Goal</DrawerTitle>
            <DrawerDescription>Enter your new calorie goal below</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 space-y-6">
            <Input
              type="text"
              value={newGoal}
              onChange={(e) => setNewGoal(Number(e.target.value))}
              className="text-center text-lg h-12"
            />
          </div>
          <DrawerFooter className="pt-2">
            <Button
              className="w-full bg-black text-white"
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

