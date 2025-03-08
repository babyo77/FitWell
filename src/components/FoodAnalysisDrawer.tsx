import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { toast } from "sonner";

interface FoodItem {
  name: string;
  count: string;
  calories: string;
  protien: string;
  protein: string;
  carbs: string;
  fat: string;
}

export interface AnalysisResponse {
  calories_info: {
    foods: FoodItem[];
  };
  error?: string;
}

interface FoodAnalysisDrawerProps {
  image: string | null;
  isLoading: boolean;
  analysisResult: AnalysisResponse | null;
  onRetake: () => void;
  onAnalyze: (imageData: string) => Promise<void>;
  onClose: () => void;
}

export function FoodAnalysisDrawer({
  image,
  isLoading,
  analysisResult,
  onRetake,
  onAnalyze,
  onClose,
}: FoodAnalysisDrawerProps) {
  const hasError = analysisResult?.error;
  const hasFood = (analysisResult?.calories_info?.foods?.length ?? 0) > 0;

  const addFoodToDiary = () => {
    try {
      console.log(analysisResult?.calories_info?.foods);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to add food to diary");
    } finally {
      onClose();
    }
  };
  return (
    <DrawerContent>
      <div className="max-h-[85vh] overflow-y-auto">
        <DrawerHeader>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <DrawerTitle className="text-lg font-semibold">
              {analysisResult ? "Nutritional Information" : "Review Photo"}
            </DrawerTitle>
            <DrawerDescription className="text-sm text-gray-500">
              {analysisResult
                ? "Here's what we found in your meal"
                : "Make sure your food is clearly visible"}
            </DrawerDescription>
          </motion.div>
        </DrawerHeader>
        <div className="p-4 pt-0 space-y-4">
          {image && !analysisResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className="bg-gray-50 rounded-lg">
                <motion.img
                  src={image}
                  alt="Food"
                  className="w-full min-h-full max-h-56 rounded-lg object-contain"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <motion.div
                className="flex gap-3 mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <Button
                  variant="outline"
                  className="flex-1 h-11 text-sm"
                  onClick={onRetake}
                  disabled={isLoading}
                >
                  Retake
                </Button>
                <Button
                  className="flex-1 h-11 bg-black hover:bg-gray-800 text-sm"
                  onClick={() => image && onAnalyze(image)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      Analyzing...
                    </div>
                  ) : (
                    "Analyze Food"
                  )}
                </Button>
              </motion.div>
            </motion.div>
          )}

          {analysisResult && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              {hasError ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 text-center space-y-3 bg-gray-50 rounded-lg"
                >
                  <div className="text-red-500 bg-red-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <h3 className="text-base font-medium text-gray-900">
                    Analysis Failed
                  </h3>
                  <p className="text-sm text-gray-500">
                    {analysisResult.error ||
                      "Something went wrong. Please try again."}
                  </p>
                  <Button variant="outline" className="mt-2" onClick={onRetake}>
                    Try Again
                  </Button>
                </motion.div>
              ) : !hasFood ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 text-center space-y-3 bg-gray-50 rounded-lg"
                >
                  <div className="text-yellow-500 bg-yellow-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-base font-medium text-gray-900">
                    No Food Detected
                  </h3>
                  <p className="text-sm text-gray-500">
                    We couldn't identify any food in this image. Please try
                    again with a clearer photo.
                  </p>
                  <Button variant="outline" className="mt-2" onClick={onRetake}>
                    Take Another Photo
                  </Button>
                </motion.div>
              ) : (
                <>
                  <div className="rounded-lg overflow-hidden border">
                    {analysisResult.calories_info.foods.map((food, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10, y: 10 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={{
                          delay: index * 0.15,
                          duration: 0.5,
                          ease: "easeOut",
                        }}
                        className="p-4 bg-white border-b last:border-b-0"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-base font-medium text-gray-900">
                              {food.name}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {food.count}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-base font-semibold">
                              {food.calories}
                            </span>
                            <span className="text-xs text-gray-500 ml-1">
                              cal
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          <div className="text-center p-1.5 border bg-gray-50 rounded-lg">
                            <div className="text-xs text-gray-500">Protein</div>
                            <div className="text-sm font-medium">
                              {food.protien || food.protein}
                            </div>
                          </div>
                          <div className="text-center p-1.5 border bg-gray-50 rounded-lg">
                            <div className="text-xs text-gray-500">Carbs</div>
                            <div className="text-sm font-medium">
                              {food.carbs}
                            </div>
                          </div>
                          <div className="text-center p-1.5 border bg-gray-50 rounded-lg">
                            <div className="text-xs text-gray-500">Fat</div>
                            <div className="text-sm font-medium">
                              {food.fat}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    <motion.div
                      className="bg-black text-white p-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: analysisResult.calories_info.foods.length * 0.15,
                        duration: 0.5,
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Total Calories
                        </span>
                        <div>
                          <span className="text-lg font-semibold">
                            {analysisResult.calories_info.foods.reduce(
                              (total, food) => total + parseInt(food.calories),
                              0
                            )}
                          </span>
                          <span className="text-xs ml-1 opacity-80">cal</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay:
                        analysisResult.calories_info.foods.length * 0.15 + 0.2,
                      duration: 0.4,
                    }}
                  >
                    <Button
                      className="w-full h-11 bg-black hover:bg-gray-800 text-sm"
                      onClick={addFoodToDiary}
                    >
                      Add to Diary
                    </Button>
                  </motion.div>
                </>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </DrawerContent>
  );
}
