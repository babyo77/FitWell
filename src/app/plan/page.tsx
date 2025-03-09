"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Clock, Plus, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"

// Types
interface MealItem {
  name: string
  qty: string
  cal: number
  carbs: string
  protein: string
  fat: string
}

interface Meal {
  time: string
  item: MealItem
}

interface DietPlan {
  breakfast: Meal
  lunch: Meal
  snack: Meal
  dinner: Meal
}

// Sample data based on the provided response
const sampleDietPlan: DietPlan = {
  breakfast: {
    time: "08:00 AM",
    item: {
      name: "Scrambled Eggs with Spinach",
      qty: "2 whole eggs",
      cal: 140,
      carbs: "2g",
      protein: "12g",
      fat: "10g",
    },
  },
  lunch: {
    time: "01:00 PM",
    item: {
      name: "Quinoa Salad with Grilled Chicken",
      qty: "150g Chicken + 1 cup Quinoa",
      cal: 450,
      carbs: "60g",
      protein: "35g",
      fat: "10g",
    },
  },
  snack: {
    time: "04:30 PM",
    item: {
      name: "Almonds",
      qty: "30g",
      cal: 174,
      carbs: "6g",
      protein: "6g",
      fat: "15g",
    },
  },
  dinner: {
    time: "07:30 PM",
    item: {
      name: "Baked Salmon with Broccoli",
      qty: "150g Salmon + 1 cup Broccoli",
      cal: 350,
      carbs: "15g",
      protein: "40g",
      fat: "20g",
    },
  },
}

export default function MealPlanPage() {
  const { user } = useAuth()
  const [dietPlan, setDietPlan] = useState<DietPlan>(sampleDietPlan)
  const [isAddingMeal, setIsAddingMeal] = useState(false)
  const [newMeal, setNewMeal] = useState<Meal>({
    time: "",
    item: {
      name: "",
      qty: "",
      cal: 0,
      carbs: "",
      protein: "",
      fat: "",
    },
  })

  // Calculate total calories and macros
  const calculateTotals = () => {
    const meals = Object.values(dietPlan)
    return {
      calories: meals.reduce((sum, meal) => sum + meal.item.cal, 0),
      carbs: meals.reduce((sum, meal) => sum + Number.parseInt(meal.item.carbs), 0),
      protein: meals.reduce((sum, meal) => sum + Number.parseInt(meal.item.protein), 0),
      fat: meals.reduce((sum, meal) => sum + Number.parseInt(meal.item.fat), 0),
    }
  }

  const totals = calculateTotals()

  // Handle adding a new meal
  const handleAddMeal = () => {
    if (!newMeal.time || !newMeal.item.name) {
      toast.error("Please fill in at least the time and meal name")
      return
    }

    // Find the appropriate meal slot based on time
    const time24h = convertTo24Hour(newMeal.time)
    let mealSlot: keyof DietPlan = 'breakfast'

    if (time24h >= 11 && time24h < 15) mealSlot = 'lunch'
    else if (time24h >= 15 && time24h < 18) mealSlot = 'snack'
    else if (time24h >= 18) mealSlot = 'dinner'

    setDietPlan((prev) => ({
      ...prev,
      [mealSlot]: newMeal,
    }))

    setNewMeal({
      time: "",
      item: {
        name: "",
        qty: "",
        cal: 0,
        carbs: "",
        protein: "",
        fat: "",
      },
    })
    setIsAddingMeal(false)
    toast.success(`New meal added to ${mealSlot}`)
  }

  // Helper function to convert time to 24-hour format
  const convertTo24Hour = (time12h: string): number => {
    const [time, modifier] = time12h.split(' ')
    let [hours, minutes] = time.split(':')
    let hoursNum = parseInt(hours, 10)

    if (modifier === 'PM' && hoursNum < 12) hoursNum += 12
    if (modifier === 'AM' && hoursNum === 12) hoursNum = 0

    return hoursNum
  }

  // Helper function to extract numeric value from string with unit
  const extractNumber = (value: string): number => {
    const match = value.match(/\d+/)
    return match ? Number.parseInt(match[0]) : 0
  }

  return (
    <div className="pb-20 px-4">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Today&apos;s Meal Plan</h1>
          <Button variant="outline" size="sm" className="rounded-full">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      {/* Meal Cards */}
      <div className="space-y-4">
        {(Object.keys(dietPlan) as Array<keyof DietPlan>).map((mealType, index) => {
          const meal = dietPlan[mealType]
          return (
            <motion.div
              key={mealType}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border shadow-sm overflow-hidden">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="capitalize text-lg">{mealType}</CardTitle>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {meal.time}
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium">{meal.item.name}</h3>
                      <p className="text-sm text-gray-500">{meal.item.qty}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>

                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">{meal.item.cal} cal</span>
                  </div>

                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs">
                      {meal.item.carbs} carbs
                    </span>
                    <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded-full text-xs">
                      {meal.item.protein} protein
                    </span>
                    <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-xs">
                      {meal.item.fat} fat
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// Macro Progress Bar Component
function MacroBar({
  label,
  value,
  max,
  color,
  unit,
}: {
  label: string
  value: number
  max: number
  color: string
  unit: string
}) {
  const percentage = Math.min(100, (value / max) * 100)

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span>
          {value}/{max} {unit}
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            delay: 0.1,
          }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  )
}

