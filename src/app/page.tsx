"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Target, Utensils, GanttChart, Dumbbell, Edit2 } from "lucide-react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Progress } from "@/components/ui/progress";
import { CaloriesState, MacroData, useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

export default function Home() {
  const { user, calories, setCalories } = useAuth();
  const [newGoal, setNewGoal] = useState<number>(1700);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.uid) return;

      try {
        // Fetch user data including calorie goal
        const userResponse = await fetch(`/api/user?uid=${user.uid}`);
        const userData = await userResponse.json();

        if (userResponse.ok && userData.user) {
          const newBaseGoal = userData.user.calorieGoal || calories.baseGoal;
          setCalories((prev) => ({
            ...prev,
            baseGoal: newBaseGoal,
          }));
          setNewGoal(newBaseGoal);
        }

        const fetchTodaysFoodIntake = async () => {
          const response = await fetch(`/api/diary/${user.uid}`);
          const data = await response.json();

          if (response.ok && data) {
            const totalCalories = data.totalCalories || 0;

            let totalCarbs = 0;
            let totalProtein = 0;
            let totalFat = 0;

            const processMeal = (foods: any[]) => {
              foods.forEach((food) => {
                totalCarbs += parseInt(food.carbs || "0");
                totalProtein += parseInt(food.protein || food.protien || "0");
                totalFat += parseInt(food.fat || "0");
              });
            };

            if (data.breakfast?.foods) processMeal(data.breakfast.foods);
            if (data.lunch?.foods) processMeal(data.lunch.foods);
            if (data.dinner?.foods) processMeal(data.dinner.foods);

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
            }));
          }
        };

        fetchTodaysFoodIntake();
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user?.uid]);

  const updateValue = (key: keyof CaloriesState, value: number) => {
    setCalories((prev) => ({
      ...prev,
      [key]:
        typeof prev[key] === "object"
          ? { ...(prev[key] as MacroData), current: value }
          : value,
    }));
  };

  const remaining = Math.max(0, calories.baseGoal - calories.intake);
  const progress = (calories.intake / calories.baseGoal) * 100;

  const updateCalorieGoal = async () => {
    if (!user?.uid) return;

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
      });

      if (!response.ok) {
        throw new Error("Failed to update calorie goal");
      }

      setCalories((prev) => ({
        ...prev,
        baseGoal: newGoal,
      }));
      toast.success("Calorie goal updated!");
    } catch (error) {
      console.error("Error updating calorie goal:", error);
      toast.error("Failed to update calorie goal");
    }
  };

  return (
    <div className="min-h-screen leading-tight tracking-tight p-6 max-w-md mx-auto pb-20 space-y-4">
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
              <span className="text-[48px] font-bold  leading-none mb-1">
                {remaining}
              </span>
              <span className="text-[#666666] uppercase text-sm tracking-wider">
                REMAINING
              </span>
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
                  setNewGoal(calories.baseGoal);
                  setIsDrawerOpen(true);
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
              <input
                type="number"
                value={item.value}
                onChange={(e) =>
                  updateValue(
                    item.label
                      .toLowerCase()
                      .replace(" ", "") as keyof CaloriesState,
                    Number(e.target.value)
                  )
                }
                className="w-16 bg-transparent text-right text-sm  focus:outline-none"
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Macros Cards */}
      <div className="grid grid-cols-2 gap-4">
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
            className=" text-black border shadow-lg rounded-2xl p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.6 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <macro.icon className={`w-5 h-5 ${macro.iconColor}`} />
              <h3 className="text-[20px] font-bold ">{macro.title}</h3>
            </div>
            <Progress
              value={(macro.data.current / calories.baseGoal) * 100}
              className=" mb-4 "
            />
            <div className="flex items-baseline justify-between">
              <input
                type="number"
                value={macro.data.current}
                onChange={(e) =>
                  updateValue(
                    macro.title.toLowerCase() as keyof CaloriesState,
                    Number(e.target.value)
                  )
                }
                className="w-16 bg-transparent text-lg font-semibold  focus:outline-none"
              />
              <span className="text-[#666666]"></span>
            </div>
          </motion.div>
        ))}
      </div>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <DrawerHeader className="text-center">
            <DrawerTitle>Update Daily Goal</DrawerTitle>
            <DrawerDescription>
              Enter your new calorie goal below
            </DrawerDescription>
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
                await updateCalorieGoal();
                setIsDrawerOpen(false);
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
  );
}
