export async function updateStreaks(uid: string) {
    try {
      const response = await fetch("/api/streaks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid }),
      })
  
      if (!response.ok) {
        throw new Error("Failed to update streaks")
      }
  
      const data = await response.json()
      return data.streaks
    } catch (error) {
      console.error("Error updating streaks:", error)
      throw error
    }
  }
  
  