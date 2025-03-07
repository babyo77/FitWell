"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dumbbell,
  Scale,
  Heart,
  Salad,
  User,
  Leaf,
  Beef,
  Cookie,
  PersonStanding,
  GraduationCap,
  Flame,
} from "lucide-react";

interface OnboardingData {
  goal: string;
  age: string;
  weight: string;
  gender: string;
  height: string;
  preferences: {
    workoutType: string;
    dietPreference: string;
  };
}

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    goal: "",
    age: "",
    weight: "",
    gender: "",
    height: "",
    preferences: {
      workoutType: "",
      dietPreference: "",
    },
  });

  const updateFormData = (field: string, value: string) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof OnboardingData] as Record<string, string>),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const [loading, setLoading] = useState(false);
  const handleContinue = async () => {
    if (step === 7) {
      setLoading(true);
      await fetch("/api/user", {
        method: "PATCH",
        body: JSON.stringify({ ...formData, onboarding: true }),
      });
      setLoading(false);
      return;
    }
    setStep((prev) => prev + 1);
  };

  const steps = [
    "Goal",
    "Age",
    "Weight",
    "Gender",
    "Height",
    "Workout",
    "Diet",
  ];

  return (
    <div className="flex justify-center w-full  items-start h-screen fixed top-0 left-0 right-0 bottom-0 z-50">
      <div className="fixed top-0 left-0 right-0 bg-white z-10 pt-8 pb-6">
        <div className="max-w-md mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <p className="text-gray-500 text-sm">Step {step} of 7</p>
          </motion.div>

          {/* New Progress Bar */}
          <div className="space-y-2">
            <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-black rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${(step / 7) * 100}%` }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
            </div>
            <div className="flex justify-between px-1">
              {steps.map((text, index) => (
                <span
                  key={text}
                  className={`text-[10px] font-medium transition-colors ${
                    index + 1 === step
                      ? "text-black"
                      : index + 1 < step
                      ? "text-gray-400"
                      : "text-gray-300"
                  }`}
                >
                  {text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 pt-44 pb-32 px-4">
        <div className="max-w-md mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl tracking-tight font-bold text-center">
                    What's your goal?
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    <SelectCard
                      icon={<Scale className="w-6 h-6" />}
                      title="Weight Loss"
                      selected={formData.goal === "weight-loss"}
                      onClick={() => updateFormData("goal", "weight-loss")}
                    />
                    <SelectCard
                      icon={<Dumbbell className="w-6 h-6" />}
                      title="Muscle Gain"
                      selected={formData.goal === "muscle-gain"}
                      onClick={() => updateFormData("goal", "muscle-gain")}
                    />
                    <SelectCard
                      icon={<Heart className="w-6 h-6" />}
                      title="Maintenance"
                      selected={formData.goal === "maintenance"}
                      onClick={() => updateFormData("goal", "maintenance")}
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl tracking-tight font-bold text-center">
                    How old are you?
                  </h2>
                  <Input
                    type="number"
                    placeholder="Enter your age"
                    value={formData.age}
                    onChange={(e) => updateFormData("age", e.target.value)}
                    className="text-center text-lg h-12"
                  />
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl tracking-tight font-bold text-center">
                    What's your weight?
                  </h2>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="Weight in kg"
                      value={formData.weight}
                      onChange={(e) => updateFormData("weight", e.target.value)}
                      className="text-center text-lg h-12"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      kg
                    </span>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <h2 className="text-2xl tracking-tight font-bold text-center">
                    What's your gender?
                  </h2>
                  <div className="grid grid-cols-3 gap-4">
                    <SelectCard
                      icon={<User className="w-6 h-6" />}
                      title="Male"
                      selected={formData.gender === "male"}
                      onClick={() => updateFormData("gender", "male")}
                    />
                    <SelectCard
                      icon={<User className="w-6 h-6" />}
                      title="Female"
                      selected={formData.gender === "female"}
                      onClick={() => updateFormData("gender", "female")}
                    />
                    <SelectCard
                      icon={<User className="w-6 h-6" />}
                      title="Other"
                      selected={formData.gender === "other"}
                      onClick={() => updateFormData("gender", "other")}
                    />
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-6">
                  <h2 className="text-2xl tracking-tight font-bold text-center">
                    What's your height?
                  </h2>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="Height in Ft"
                      value={formData.height}
                      onChange={(e) => updateFormData("height", e.target.value)}
                      className="text-center text-lg h-12"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      Ft
                    </span>
                  </div>
                </div>
              )}

              {step === 6 && (
                <div className="space-y-6">
                  <h2 className="text-2xl tracking-tight font-bold text-center">
                    Preferred workout type?
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <SelectCard
                      icon={<PersonStanding className="w-6 h-6" />}
                      title="Cardio"
                      selected={formData.preferences.workoutType === "cardio"}
                      onClick={() =>
                        updateFormData("preferences.workoutType", "cardio")
                      }
                    />
                    <SelectCard
                      icon={<Dumbbell className="w-6 h-6" />}
                      title="Strength"
                      selected={formData.preferences.workoutType === "strength"}
                      onClick={() =>
                        updateFormData("preferences.workoutType", "strength")
                      }
                    />
                    <SelectCard
                      icon={<GraduationCap className="w-6 h-6" />}
                      title="Yoga"
                      selected={formData.preferences.workoutType === "yoga"}
                      onClick={() =>
                        updateFormData("preferences.workoutType", "yoga")
                      }
                    />
                    <SelectCard
                      icon={<Flame className="w-6 h-6" />}
                      title="Mixed"
                      selected={formData.preferences.workoutType === "mixed"}
                      onClick={() =>
                        updateFormData("preferences.workoutType", "mixed")
                      }
                    />
                  </div>
                </div>
              )}

              {step === 7 && (
                <div className="space-y-6">
                  <h2 className="text-2xl tracking-tight font-bold text-center">
                    Diet preference?
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <SelectCard
                      icon={<Leaf className="w-6 h-6" />}
                      title="Vegan"
                      selected={formData.preferences.dietPreference === "vegan"}
                      onClick={() =>
                        updateFormData("preferences.dietPreference", "vegan")
                      }
                    />
                    <SelectCard
                      icon={<Salad className="w-6 h-6" />}
                      title="Vegetarian"
                      selected={
                        formData.preferences.dietPreference === "vegetarian"
                      }
                      onClick={() =>
                        updateFormData(
                          "preferences.dietPreference",
                          "vegetarian"
                        )
                      }
                    />
                    <SelectCard
                      icon={<Beef className="w-6 h-6" />}
                      title="Non-vegetarian"
                      selected={
                        formData.preferences.dietPreference === "non-vegetarian"
                      }
                      onClick={() =>
                        updateFormData(
                          "preferences.dietPreference",
                          "non-vegetarian"
                        )
                      }
                    />
                    <SelectCard
                      icon={<Cookie className="w-6 h-6" />}
                      title="Keto"
                      selected={formData.preferences.dietPreference === "keto"}
                      onClick={() =>
                        updateFormData("preferences.dietPreference", "keto")
                      }
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white p-4">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              size="lg"
              className="w-full h-11 font-medium rounded-xl"
              onClick={handleContinue}
              disabled={
                (step === 1 && !formData.goal) ||
                (step === 2 && !formData.age) ||
                (step === 3 && !formData.weight) ||
                (step === 4 && !formData.gender) ||
                (step === 5 && !formData.height) ||
                (step === 6 && !formData.preferences.workoutType) ||
                (step === 7 && !formData.preferences.dietPreference) ||
                loading
              }
            >
              {step === 7 ? "Complete" : "Continue"}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

interface SelectCardProps {
  icon: React.ReactNode;
  title: string;
  selected: boolean;
  onClick: () => void;
}

function SelectCard({ icon, title, selected, onClick }: SelectCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`p-3 rounded-xl border-2 transition-all ${
        selected
          ? "border-black bg-black text-white"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="flex flex-col font-medium leading-tight text-sm items-center gap-2">
        {icon}
        <span>{title}</span>
      </div>
    </motion.button>
  );
}
