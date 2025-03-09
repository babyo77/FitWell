interface waterIntakeDB {
  id: string
  amount: number
  date: string
}

class WaterIntakeDB {
  private dbName = "fitwellDB"
  private storeName = "waterIntake"
  private version = 1

  private openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onupgradeneeded = (event) => {
        const db = request.result
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: "id" })
        }
      }

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  private getTodayString(): string {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
  }

  async getWaterIntake(userId: string): Promise<number> {
    try {
      const db = await this.openDB()
      const transaction = db.transaction(this.storeName, "readonly")
      const store = transaction.objectStore(this.storeName)
      const today = this.getTodayString()
      const key = `${userId}-${today}`

      return new Promise((resolve) => {
        const request = store.get(key)
        request.onsuccess = () => resolve(request.result?.amount || 0)
        request.onerror = () => resolve(0)
      })
    } catch (error) {
      console.error("Error getting water intake:", error)
      return 0
    }
  }

  async saveWaterIntake(userId: string, amount: number): Promise<void> {
    if (!userId) return

    try {
      const db = await this.openDB()
      const transaction = db.transaction(this.storeName, "readwrite")
      const store = transaction.objectStore(this.storeName)
      const today = this.getTodayString()
      const key = `${userId}-${today}`

      await store.put({ id: key, amount, date: today })
    } catch (error) {
      console.error("Error saving water intake:", error)
    }
  }
}

export const waterIntakeDB = new WaterIntakeDB()
