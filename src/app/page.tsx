"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Target, Utensils, GanttChart, Dumbbell } from "lucide-react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Progress } from "@/components/ui/progress";

interface MacroData {
  current: number;
  goal: number;
}

interface CaloriesState {
  baseGoal: number;
  intake: number;
  exercise: number;
  carbs: MacroData;
  protein: MacroData;
  fat: MacroData;
}

export default function Home() {
  const [calories, setCalories] = useState<CaloriesState>({
    baseGoal: 1700,
    intake: 40,
    exercise: 40,
    carbs: {
      current: 40,
      goal: 200,
    },
    protein: {
      current: 40,
      goal: 150,
    },
    fat: {
      current: 40,
      goal: 150,
    },
  });

  const updateValue = (key: keyof CaloriesState, value: number) => {
    setCalories((prev) => ({
      ...prev,
      [key]:
        typeof prev[key] === "object"
          ? { ...(prev[key] as MacroData), current: value }
          : value,
    }));
  };

  const remaining = calories.baseGoal - calories.intake;
  const progress = (calories.intake / calories.baseGoal) * 100;

  return (
    <div className="min-h-screen leading-tight tracking-tight p-6 max-w-md mx-auto pb-20 space-y-4">
      <motion.div
        className=" text-black border rounded-3xl p-6 shadow-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.h1 className="text-2xl font-bold  mb-8">
          Calories Remaining
        </motion.h1>

        {/* Progress Circle */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-[200px] h-[200px]">
            <CircularProgressbar
              value={calories.intake - calories.exercise}
              maxValue={calories.baseGoal}
              strokeWidth={5}
              styles={buildStyles({
                pathColor: "#000000",

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
          {[
            { label: "Daily Goal", value: calories.baseGoal, icon: Target },
            {
              label: "Calories Intake",
              value: calories.intake,
              icon: Utensils,
            },
            {
              label: "Exercise",
              value: calories.exercise,
              icon: Dumbbell,
            },
          ].map((item) => (
            <div key={item.label} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <item.icon className="w-4 h-4 /60" />
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
          { title: "Carbs", data: calories.carbs, icon: GanttChart },
          { title: "Protein", data: calories.protein, icon: Dumbbell },
          { title: "Fat", data: calories.fat, icon: Dumbbell },
        ].map((macro, index) => (
          <motion.div
            key={macro.title}
            className=" text-black border shadow-lg rounded-2xl p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.6 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <macro.icon className="w-5 h-5 /60" />
              <h3 className="text-[20px] font-bold ">{macro.title}</h3>
            </div>
            <Progress
              value={(macro.data.current / macro.data.goal) * 100}
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
    </div>
  );
}
