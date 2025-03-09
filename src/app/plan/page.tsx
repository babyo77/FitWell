"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";

// Types
interface MealItem {
  name: string;
  qty: string;
  cal: number;
  carbs: string;
  protein: string;
  fat: string;
}

interface Meal {
  time: string;
  item: MealItem;
}

interface DietPlan {
  breakfast: Meal;
  lunch: Meal;
  snack: Meal;
  dinner: Meal;
}

export default function MealPlanPage() {
  const { user } = useAuth();
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingMeal, setIsAddingMeal] = useState(false);
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
  });

  useEffect(() => {
    const fetchDietPlan = async () => {
      try {
        const response = await fetch(
          "https://fitwell-backend.onrender.com/diet/plan/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ user }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch diet plan");
        }

        const data = await response.json();
        setDietPlan(data.diet_plan);
      } catch (error) {
        toast.error("Failed to load meal plan");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDietPlan();
  }, [user]);

  // Calculate total calories and macros
  const calculateTotals = () => {
    if (!dietPlan) return { calories: 0, carbs: 0, protein: 0, fat: 0 };
    const meals = Object.values(dietPlan);
    return {
      calories: meals.reduce((sum, meal) => sum + meal.item.cal, 0),
      carbs: meals.reduce(
        (sum, meal) => sum + Number.parseInt(meal.item.carbs),
        0
      ),
      protein: meals.reduce(
        (sum, meal) => sum + Number.parseInt(meal.item.protein),
        0
      ),
      fat: meals.reduce((sum, meal) => sum + Number.parseInt(meal.item.fat), 0),
    };
  };

  const totals = calculateTotals();

  // Handle adding a new meal
  const handleAddMeal = () => {
    if (!newMeal.time || !newMeal.item.name) {
      toast.error("Please fill in at least the time and meal name");
      return;
    }

    // Find the appropriate meal slot based on time
    const time24h = convertTo24Hour(newMeal.time);
    let mealSlot: keyof DietPlan = "breakfast";

    if (time24h >= 11 && time24h < 15) mealSlot = "lunch";
    else if (time24h >= 18) mealSlot = "dinner";

    setDietPlan((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [mealSlot]: newMeal,
      } as DietPlan;
    });

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
    });
    setIsAddingMeal(false);
    toast.success(`New meal added to ${mealSlot}`);
  };

  // Helper function to convert time to 24-hour format
  const convertTo24Hour = (time12h: string): number => {
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");
    let hoursNum = parseInt(hours, 10);

    if (modifier === "PM" && hoursNum < 12) hoursNum += 12;
    if (modifier === "AM" && hoursNum === 12) hoursNum = 0;

    return hoursNum;
  };

  // Helper function to extract numeric value from string with unit
  const extractNumber = (value: string): number => {
    const match = value.match(/\d+/);
    return match ? Number.parseInt(match[0]) : 0;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!dietPlan) {
    return (
      <div className="flex justify-center items-center h-screen">
        No meal plan available
      </div>
    );
  }

  return (
    <div className="pb-24 px-4 max-w-3xl mx-auto bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b py-4 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-black">
            Today&apos;s Meal Plan
          </h1>
        </div>
      </div>

      {/* Daily Summary */}
      <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <h2 className="text-lg font-semibold mb-3 text-black">Daily Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Total Calories</p>
            <p className="text-xl font-bold text-black">{totals.calories}</p>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Carbs</p>
            <p className="text-xl font-bold text-black">{totals.carbs}g</p>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Protein</p>
            <p className="text-xl font-bold text-black">{totals.protein}g</p>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Fat</p>
            <p className="text-xl font-bold text-black">{totals.fat}g</p>
          </div>
        </div>
      </div>

      {/* Meal Cards */}
      <div className="space-y-6">
        {(Object.keys(dietPlan) as Array<keyof DietPlan>).map(
          (mealType, index) => {
            const meal = dietPlan[mealType];
            return (
              <motion.div
                key={mealType}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border shadow-none hover:border-black transition-colors duration-200">
                  <CardHeader className=" border-b pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="capitalize text-lg font-semibold text-black">
                        {mealType}
                      </CardTitle>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        {meal.time}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 py-0 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg w-54 break-words text-black">
                          {meal.item.name}
                        </h3>
                        <p className="text-sm text-gray-600">{meal.item.qty}</p>
                      </div>
                      <Button variant="outline" size="sm" className="h-8 px-3 ">
                        Eaten
                      </Button>
                    </div>

                    <div className="flex justify-between text-sm mb-3">
                      <span className="font-medium text-base text-black">
                        {meal.item.cal} calories
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <span className="px-3 py-1 bg-blue-50 text-blue-900 border border-blue-200 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors">
                        {meal.item.carbs} carbs
                      </span>
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-full text-sm font-medium hover:bg-emerald-100 transition-colors">
                        {meal.item.protein} protein
                      </span>
                      <span className="px-3 py-1 bg-rose-50 text-rose-900 border border-rose-200 rounded-full text-sm font-medium hover:bg-rose-100 transition-colors">
                        {meal.item.fat} fat
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          }
        )}
      </div>
    </div>
  );
}

// Macro Progress Bar Component
function MacroBar({
  label,
  value,
  max,
  color,
  unit,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  unit: string;
}) {
  const percentage = Math.min(100, (value / max) * 100);

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
  );
}
