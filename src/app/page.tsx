"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Target,
  Utensils,
  GanttChart,
  Dumbbell,
  Edit2,
  Droplets,
  Plus,
  Minus,
} from "lucide-react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Progress } from "@/components/ui/progress";
import {
  type CaloriesState,
  type MacroData,
  useAuth,
} from "@/context/auth-context";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { waterIntakeDB } from "@/lib/waterIntakeDB";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, calories, setCalories } = useAuth();
  const [newGoal, setNewGoal] = useState<number>(1700);
  const [waterIntake, setWaterIntake] = useState(0); // Will now store ml
  const [waterGoal] = useState(2500); // 2.5L in ml as default goal

  const router = useRouter();

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
            const totalCalories = Math.max(
              data.totalCalories - user?.exercise || 0,
              0
            );

            let totalCarbs = 0;
            let totalProtein = 0;
            let totalFat = 0;

            const processMeal = (foods: any[]) => {
              foods.forEach((food) => {
                totalCarbs += Number.parseInt(food.carbs || "0");
                totalProtein += Number.parseInt(
                  food.protein || food.protien || "0"
                );
                totalFat += Number.parseInt(food.fat || "0");
              });
            };

            if (data.breakfast?.foods) processMeal(data.breakfast.foods);
            if (data.lunch?.foods) processMeal(data.lunch.foods);
            if (data.dinner?.foods) processMeal(data.dinner.foods);

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

  useEffect(() => {
    if (!user?.uid) return;

    const loadWaterIntake = async () => {
      const amount = await waterIntakeDB.getWaterIntake(user.uid);
      setWaterIntake(amount);
    };

    // Check if day has changed at midnight
    const checkDayChange = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      // If it's midnight (00:00), reset the water intake
      if (hours === 0 && minutes === 0) {
        setWaterIntake(0);
        waterIntakeDB.saveWaterIntake(user.uid, 0);
      }
    };

    // Set up interval to check for day change
    const intervalId = setInterval(checkDayChange, 60000); // Check every minute

    // Initial load
    loadWaterIntake();

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
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

  const handleAddWater = async () => {
    const newAmount = waterIntake + 250; // Adds 250ml each time
    setWaterIntake(newAmount);
    await waterIntakeDB.saveWaterIntake(user?.uid!, newAmount);
  };

  const handleRemoveWater = async () => {
    if (waterIntake >= 250) {
      // Checks if at least 250ml to remove
      const newAmount = waterIntake - 250; // Removes 250ml each time
      setWaterIntake(newAmount);
      await waterIntakeDB.saveWaterIntake(user?.uid!, newAmount);
    }
  };

  return (
    <div className="min-h-screen leading-tight tracking-tight p-4 max-w-md mx-auto pb-24 space-y-3">
      {/* Welcome section with text animation */}
      <motion.div
        className="flex items-center gap-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Avatar className="w-10 h-10">
          <AvatarImage src={user?.photoURL} alt={user?.displayName} />
          <AvatarFallback>{user?.displayName?.charAt(0)}</AvatarFallback>
        </Avatar>
        <motion.h1
          className="text-2xl font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Welcome back, {user?.displayName}
        </motion.h1>
      </motion.div>

      {/* Calories Card */}
      <motion.div
        className=" text-black border rounded-3xl p-6 shadow-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.h1
          className="text-2xl font-bold tracking-tight mb-3 "
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Calories
        </motion.h1>

        {/* Progress Circle with animated text */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-[200px] h-[200px]">
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
            <div className="relative -mt-[200px] flex flex-col items-center justify-center h-[200px]">
              <motion.span
                className="text-[48px] font-bold leading-none mb-1 text-blue-700"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
              >
                {remaining}
              </motion.span>
              <motion.span
                className=" uppercase text-sm leading-tight font-medium tracking-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                REMAINING
              </motion.span>
            </div>
          </div>
        </div>

        {/* Stats with staggered text animations */}
        <motion.div
          className="space-y-3.5"
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
            <div className="flex items-center -mr-2 gap-2">
              <motion.span
                className="text-sm font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                {calories.baseGoal}
              </motion.span>
              <Button
                size="sm"
                variant="ghost"
                className="h-8  w-8 p-0 hover:bg-gray-100"
                onClick={() => {
                  setNewGoal(calories.baseGoal);
                  setIsDrawerOpen(true);
                }}
              >
                <Edit2 className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
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
                className="w-16 bg-transparent text-right text-sm focus:outline-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                {item.value}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <h1 className="text-2xl font-bold">Macros</h1>
      {/* Macros Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Carbs Card */}
        <motion.div
          className=" text-black border shadow-sm rounded-2xl p-4 hover:shadow-md transition-shadow"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <GanttChart className="w-4 h-4 text-purple-500" />
            <h3 className="text-sm font-medium">Carbs</h3>
          </div>
          <div className="w-24 h-24 mx-auto mb-3">
            <CircularProgressbar
              value={(calories.carbs.current / calories.baseGoal) * 100}
              strokeWidth={8}
              styles={buildStyles({
                pathColor: "currentColor",
                trailColor: "#e5e5e5",
                strokeLinecap: "round",
              })}
            />
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="w-full bg-transparent text-2xl font-semibold text-center "
          >
            {calories.carbs.current}g
          </motion.p>
        </motion.div>

        {/* Protein Card */}
        <motion.div
          className=" text-black border shadow-sm rounded-2xl p-4 hover:shadow-md transition-shadow"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Dumbbell className="w-4 h-4 text-red-500" />
            <h3 className="text-sm font-medium">Protein</h3>
          </div>
          <div className="w-24 h-24 mx-auto mb-3">
            <CircularProgressbar
              value={(calories.protein.current / calories.baseGoal) * 100}
              strokeWidth={8}
              styles={buildStyles({
                pathColor: "currentColor",
                trailColor: "#e5e5e5",
                strokeLinecap: "round",
              })}
            />
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="w-full bg-transparent text-2xl font-semibold text-center "
          >
            {calories.protein.current}g
          </motion.p>
        </motion.div>

        {/* Fat Card */}
        <motion.div
          className=" text-black border shadow-sm rounded-2xl p-4 hover:shadow-md transition-shadow"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Dumbbell className="w-4 h-4 text-yellow-500" />
            <h3 className="text-sm font-medium">Fat</h3>
          </div>
          <div className="w-24 h-24 mx-auto mb-3">
            <CircularProgressbar
              value={(calories.fat.current / calories.baseGoal) * 100}
              strokeWidth={8}
              styles={buildStyles({
                pathColor: "currentColor",
                trailColor: "#e5e5e5",
                strokeLinecap: "round",
              })}
            />
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="w-full bg-transparent text-2xl font-semibold text-center "
          >
            {calories.fat.current}g
          </motion.p>
        </motion.div>

        {/* Create Meal Card */}
        <motion.div
          className="text-black border shadow-sm rounded-2xl p-4 hover:shadow-md transition-shadow cursor-pointer"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          onClick={() => router.push("/chat")}
        >
          <div className="flex items-center gap-2 mb-3">
            <Utensils className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-medium">Create Meal</h3>
          </div>
          <div className="w-24 h-24 mx-auto mb-3 flex items-center justify-center">
            <Plus className="w-10 h-10 text-emerald-500" />
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            className="w-full bg-transparent text-sm font-medium text-center"
          >
            Add New Meal
          </motion.p>
        </motion.div>
      </div>

      {/* Water Tracking Card */}
      <h1 className="text-2xl font-bold">Reminders</h1>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2, delay: 0.5 }}
        className="hover:shadow-md transition-shadow"
      >
        <Card className="border shadow-sm rounded-2xl">
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
              transition={{ delay: 0.6 }}
            >
              <span className="text-xs">Daily Goal: 2500ml</span>
              <span className="text-xs font-medium">
                {waterIntake}ml / 2500ml
              </span>
            </motion.div>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Progress
                value={(waterIntake / waterGoal) * 100}
                className="h-1.5"
              />
            </motion.div>

            <motion.div
              className="flex items-center justify-between gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={handleRemoveWater}
                disabled={waterIntake <= 0}
              >
                <Minus className="h-3 w-3 " />
              </Button>

              <div className="flex-1 text-center">
                <div className="text-2xl font-semibold">{waterIntake}</div>
                <div className="text-xs">ml today</div>
              </div>

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={handleAddWater}
              >
                <Plus className="h-3 w-3 " />
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <DrawerHeader className="text-center">
            <DrawerTitle>Update Daily Goal</DrawerTitle>
            <DrawerDescription>
              Enter your new calorie goal below
            </DrawerDescription>
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
