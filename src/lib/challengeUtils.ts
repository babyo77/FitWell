// Default challenges that can be assigned to users
export const defaultChallenges = [
    {
      title: "5 Days Without Junk Food",
      description: "Avoid junk food for 5 consecutive days to complete this challenge",
      type: "streak",
      category: "nutrition",
      targetValue: 5,
      reward: "Unlock healthy recipe collection",
      icon: "burger",
    },
    {
      title: "Try a New Healthy Dish",
      description: "Add a new healthy dish to your food diary",
      type: "one-time",
      category: "nutrition",
      targetValue: 1,
      reward: "Nutrition tips badge",
      icon: "salad",
    },
    {
      title: "Drink 2L of Water Daily",
      description: "Drink at least 2 liters of water for 7 consecutive days",
      type: "streak",
      category: "water",
      targetValue: 7,
      reward: "Hydration master badge",
      icon: "droplet",
    },
    {
      title: "30-Day Exercise Streak",
      description: "Log exercise activity for 30 consecutive days",
      type: "streak",
      category: "exercise",
      targetValue: 30,
      reward: "Fitness enthusiast badge",
      icon: "dumbbell",
    },
    {
      title: "Balanced Macros Week",
      description: "Maintain balanced macronutrients for 7 days",
      type: "streak",
      category: "nutrition",
      targetValue: 7,
      reward: "Nutrition expert badge",
      icon: "pieChart",
    },
  ]
  
  // Create initial challenges for a new user
  export async function createInitialChallenges(userId: string) {
    try {
      const response = await fetch("/api/challenges", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          title: defaultChallenges[0].title,
          description: defaultChallenges[0].description,
          type: defaultChallenges[0].type,
          category: defaultChallenges[0].category,
          targetValue: defaultChallenges[0].targetValue,
          currentValue: 0,
          reward: defaultChallenges[0].reward,
          icon: defaultChallenges[0].icon,
        }),
      })
  
      if (!response.ok) {
        throw new Error("Failed to create initial challenge")
      }
  
      return await response.json()
    } catch (error) {
      console.error("Error creating initial challenges:", error)
      throw error
    }
  }
  
  // Update challenge progress
  export async function updateChallengeProgress(challengeId: string, newValue: number) {
    try {
      const response = await fetch("/api/challenges", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: challengeId,
          currentValue: newValue,
        }),
      })
  
      if (!response.ok) {
        throw new Error("Failed to update challenge progress")
      }
  
      return await response.json()
    } catch (error) {
      console.error("Error updating challenge progress:", error)
      throw error
    }
  }
  
  // Check if a streak challenge is still active
  export function isStreakActive(lastUpdated: Date, requiredDays = 1): boolean {
    const now = new Date()
    const lastDate = new Date(lastUpdated)
  
    // Calculate the difference in days
    const diffTime = Math.abs(now.getTime() - lastDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
    // If the difference is more than the required days, the streak is broken
    return diffDays <= requiredDays
  }
  
  // Generate a new challenge for the user
  export async function generateNewChallenge(userId: string) {
    try {
      // Get a random challenge from the default challenges
      const randomIndex = Math.floor(Math.random() * defaultChallenges.length)
      const challenge = defaultChallenges[randomIndex]
  
      const response = await fetch("/api/challenges", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          title: challenge.title,
          description: challenge.description,
          type: challenge.type,
          category: challenge.category,
          targetValue: challenge.targetValue,
          currentValue: 0,
          reward: challenge.reward,
          icon: challenge.icon,
        }),
      })
  
      if (!response.ok) {
        throw new Error("Failed to generate new challenge")
      }
  
      return await response.json()
    } catch (error) {
      console.error("Error generating new challenge:", error)
      throw error
    }
  }
  
  