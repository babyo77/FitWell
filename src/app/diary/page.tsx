"use client";

import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/auth-context";
import { Plus, Search, X, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateStreaks } from "@/lib/updateStreaks";

interface FoodItem {
  _id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  count: string;
  mealType: "breakfast" | "lunch" | "dinner";
  quantity: number;
}

interface MealSummary {
  totalCalories: number;
  foods: FoodItem[];
}

interface DaySummary {
  date: Date;
  breakfast: MealSummary;
  lunch: MealSummary;
  dinner: MealSummary;
  totalCalories: number;
}

function DiaryPage() {
  const { user } = useAuth();
  const [foodDiary, setFoodDiary] = useState<DaySummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState<Date>(new Date());
  const [showAddFood, setShowAddFood] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<
    "breakfast" | "lunch" | "dinner"
  >("breakfast");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const fetchFoodDiary = async () => {
      if (!user?.uid) return;

      try {
        const response = await fetch(
          `/api/diary/${user.uid}?date=${date.toISOString()}`
        );
        const data = await response.json();

        if (response.ok) {
          setFoodDiary(data);
        } else {
          // Clear diary when no data found
          setFoodDiary(null);
        }
      } catch (error) {
        console.error("Error fetching food diary:", error);
        // Clear diary on error
        setFoodDiary(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFoodDiary();
  }, [user?.uid, date]);

  // Update the search effect with AbortController ref
  useEffect(() => {
    const searchFoods = async () => {
      if (searchQuery.length === 0) {
        setSearchResults([]);
        return;
      }

      // Abort previous request if it exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new controller for this request
      abortControllerRef.current = new AbortController();
      setIsSearching(true);

      try {
        const response = await fetch(
          "https://fitwell-backend.onrender.com/calorie/search/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: searchQuery }),
            signal: abortControllerRef.current.signal,
          }
        );

        const data = await response.json();
        setSearchResults(
          data.calories_info.foods.map((food: any) => ({
            ...food,
            calories: parseInt(food.calories),
            protein: parseFloat(food.protien.replace("g", "")),
            carbs: parseFloat(food.carbs.replace("g", "")),
            fat: parseFloat(food.fat.replace("g", "")),
            quantity: parseInt(food.quantity),
          }))
        );
      } catch (error: any) {
        if (error.name === "AbortError") {
          // Request was aborted, do nothing
          return;
        }
        console.error("Error searching foods:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(searchFoods, 300);

    return () => {
      clearTimeout(timeoutId);
      // Abort any ongoing request when effect cleanup runs
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [searchQuery]);

  // Function to check if date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const handleAddFood = (mealType: "breakfast" | "lunch" | "dinner") => {
    setSelectedMeal(mealType);
    setShowAddFood(true);
  };

  const addFoodToDiary = async (food: FoodItem) => {
    if (!user?.uid) return;

    try {
      const response = await fetch("/api/diary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
          foods: [food],
          mealType: food.mealType,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add food");
      }

      await updateStreaks(user.uid);
      
      // Refresh the diary
      const updatedDiary = await fetch(
        `/api/diary/${user.uid}?date=${date.toISOString()}`
      );
      const data = await updatedDiary.json();
      setFoodDiary(data);

      toast.success(`Food added to ${food.mealType}!`);
      setSearchQuery("");
      setShowAddFood(false);
    } catch (error) {
      toast.error("Failed to add food to diary");
    }
  };

  const handleDeleteFood = async (
    foodId: string,
    mealType: "breakfast" | "lunch" | "dinner"
  ) => {
    if (!user?.uid) return;

    try {
      const response = await fetch("/api/diary", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
          foodId,
          mealType,
          date: date.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete food");
      }

      // Refresh the diary
      const updatedDiary = await fetch(
        `/api/diary/${user.uid}?date=${date.toISOString()}`
      );
      const data = await updatedDiary.json();
      setFoodDiary(data);
      toast.success("Food deleted from diary!");
    } catch (error) {
      toast.error("Failed to delete food from diary");
    }
  };

  // Modify the renderMeal function to always show the meal section
  const renderMeal = (
    title: string,
    meal: MealSummary | null,
    mealType: "breakfast" | "lunch" | "dinner"
  ) => {
    return (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">{title}</span>
            <span className="text-sm text-gray-600">
              {meal?.totalCalories || 0} cal
            </span>
          </div>
          {isToday(date) && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleAddFood(mealType)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="space-y-2">
          {meal?.foods.map((food, index) => (
            <div
              key={index}
              className="bg-white p-3 rounded-lg border border-gray-200"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{food.name}</h3>
                  </div>
                  <p className="text-sm text-gray-500">{food.count}</p>
                </div>
                <div className="flex items-center gap-2">
                  {isToday(date) && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleDeleteFood(food._id, mealType)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          addFoodToDiary({ ...food, mealType: "breakfast" });
                        }}
                      >
                        Add to Breakfast
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          addFoodToDiary({ ...food, mealType: "lunch" });
                        }}
                      >
                        Add to Lunch
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          addFoodToDiary({ ...food, mealType: "dinner" });
                        }}
                      >
                        Add to Dinner
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <span className="text-sm">{food.calories} cal</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div className="text-center p-1.5 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-xs text-gray-500">Protein</div>
                  <div className="text-sm font-medium">{food.protein}g</div>
                </div>
                <div className="text-center p-1.5 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-xs text-gray-500">Carbs</div>
                  <div className="text-sm font-medium">{food.carbs}g</div>
                </div>
                <div className="text-center p-1.5 bg-pink-50 border border-pink-200 rounded-lg">
                  <div className="text-xs text-gray-500">Fat</div>
                  <div className="text-sm font-medium">{food.fat}g</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Update the Calendar onSelect handler
  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setIsLoading(true);
      setDate(newDate);
      setCalendarOpen(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto pb-20">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Food Diary</h1>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline">{format(date, "PPP")}</Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateChange}
                disabled={(date) => date > new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        {foodDiary && (
          <p className="text-gray-600">
            Total Calories: {foodDiary.totalCalories} cal
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600 mb-2" />
          <p className="text-gray-600">Loading diary...</p>
        </div>
      ) : (
        <>
          {renderMeal("Breakfast", foodDiary?.breakfast || null, "breakfast")}
          {renderMeal("Lunch", foodDiary?.lunch || null, "lunch")}
          {renderMeal("Dinner", foodDiary?.dinner || null, "dinner")}
        </>
      )}

      <Drawer open={showAddFood} onOpenChange={setShowAddFood}>
        <DrawerContent className="h-[85vh]">
          <DrawerHeader>
            <DrawerTitle>Add Food to {selectedMeal}</DrawerTitle>
            <DrawerDescription>
              Search for food to add to your diary
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 flex flex-col h-full">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                className="pl-9"
                placeholder="Search foods..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="absolute right-3 top-3"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>

            <div className="mt-4 space-y-2 flex-1 max-h-[500px] pb-3 overflow-y-auto">
              {isSearching ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((food, index) => (
                  <div
                    key={index}
                    className="w-full p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100 relative group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{food.name}</h3>
                        <p className="text-sm text-gray-500">{food.count}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Click + to add to diary
                        </p>
                      </div>
                      <div className="text-right flex items-center gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                addFoodToDiary({
                                  ...food,
                                  mealType: "breakfast",
                                })
                              }
                            >
                              Add to Breakfast
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                addFoodToDiary({ ...food, mealType: "lunch" })
                              }
                            >
                              Add to Lunch
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                addFoodToDiary({ ...food, mealType: "dinner" })
                              }
                            >
                              Add to Dinner
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <div>
                          <span className="text-sm font-semibold">
                            {food.calories}
                          </span>
                          <span className="text-xs text-gray-500 ml-1">
                            cal
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <div className="text-center p-1.5 bg-green-50 border border-green-200 rounded-lg">
                        <div className="text-xs text-gray-500">Protein</div>
                        <div className="text-sm font-medium">
                          {food.protein}g
                        </div>
                      </div>
                      <div className="text-center p-1.5 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="text-xs text-gray-500">Carbs</div>
                        <div className="text-sm font-medium">{food.carbs}g</div>
                      </div>
                      <div className="text-center p-1.5 bg-pink-50 border border-pink-200 rounded-lg">
                        <div className="text-xs text-gray-500">Fat</div>
                        <div className="text-sm font-medium">{food.fat}g</div>
                      </div>
                    </div>
                  </div>
                ))
              ) : searchQuery ? (
                <div className="text-center py-4 text-gray-500">
                  No results found
                </div>
              ) : null}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default DiaryPage;
