"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { defaultChallenges, generateNewChallenge } from "@/lib/challengeUtils"
import { toast } from "sonner"
import {
  Trophy,
  Medal,
  Star,
  Gift,
  Calendar,
  CheckCircle,
  Salad,
  Dumbbell,
  Droplet,
  PieChart,
  Plus,
} from "lucide-react"
import { format } from "date-fns"

interface Challenge {
  _id: string
  title: string
  description: string
  type: "streak" | "one-time"
  category: "nutrition" | "exercise" | "water" | "sleep"
  targetValue: number
  currentValue: number
  startDate: string
  endDate?: string
  completed: boolean
  completedDate?: string
  reward?: string
  icon?: string
}

export default function ChallengePage() {
  const { user } = useAuth()
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [activeTab, setActiveTab] = useState("active")
  const [loading, setLoading] = useState(true)
  const [showNewChallengeDialog, setShowNewChallengeDialog] = useState(false)

  // Show loading state when the page is first loaded
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (user?.uid) {
      fetchChallenges()
    }
  }, [user])

  const fetchChallenges = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/challenges?userId=${user?.uid}`)

      if (response.ok) {
        const data = await response.json()
        setChallenges(data.challenges || [])
      } else {
        toast.error("Failed to fetch challenges")
      }
    } catch (error) {
      console.error("Error fetching challenges:", error)
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  // Add sample challenges if none exist
  useEffect(() => {
    if (!loading && challenges.length === 0 && user?.uid) {
      // Add a sample challenge for demonstration
      handleAddNewChallenge()
    }
  }, [loading, challenges.length, user?.uid])

  const handleAddNewChallenge = async () => {
    try {
      if (!user?.uid) return

      const result = await generateNewChallenge(user.uid)
      setChallenges((prev) => [...prev, result.challenge])
      toast.success("New challenge added!")
      setShowNewChallengeDialog(false)
    } catch (error) {
      console.error("Error adding challenge:", error)
      toast.error("Failed to add challenge")
    }
  }

  const handleUpdateProgress = async (challengeId: string, newValue: number) => {
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

      if (response.ok) {
        const data = await response.json()
        setChallenges((prev) => prev.map((challenge) => (challenge._id === challengeId ? data.challenge : challenge)))

        if (data.challenge.completed) {
          toast.success("Challenge completed! 🎉")
        } else {
          toast.success("Progress updated!")
        }
      } else {
        toast.error("Failed to update progress")
      }
    } catch (error) {
      console.error("Error updating challenge progress:", error)
      toast.error("Something went wrong")
    }
  }

  const getIconComponent = (iconName?: string) => {
    switch (iconName) {
      case "burger":
        return <Salad className="w-5 h-5" />
      case "salad":
        return <Salad className="w-5 h-5" />
      case "dumbbell":
        return <Dumbbell className="w-5 h-5" />
      case "droplet":
        return <Droplet className="w-5 h-5" />
      case "pieChart":
        return <PieChart className="w-5 h-5" />
      default:
        return <Star className="w-5 h-5" />
    }
  }

  const activeChallenges = challenges.filter((challenge) => !challenge.completed)
  const completedChallenges = challenges.filter((challenge) => challenge.completed)

  return (
    <div className="container mx-auto px-4 py-8 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-6"
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Challenges</h1>
            <p className="text-muted-foreground">Complete challenges to earn rewards</p>
          </div>
          <Button onClick={() => setShowNewChallengeDialog(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Challenge
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active" className="relative">
              Active
              {activeChallenges.length > 0 && (
                <Badge className="ml-2 bg-primary text-primary-foreground">{activeChallenges.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed
              {completedChallenges.length > 0 && (
                <Badge className="ml-2 bg-green-500 text-white">{completedChallenges.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Active Challenges */}
          <TabsContent value="active" className="mt-6">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : activeChallenges.length === 0 ? (
              <div className="text-center py-12 bg-muted/50 rounded-lg">
                <Trophy className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No active challenges</h3>
                <p className="text-muted-foreground mb-6">Start a new challenge to improve your health habits</p>
                <Button onClick={() => setShowNewChallengeDialog(true)}>Start a Challenge</Button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                <AnimatePresence>
                  {activeChallenges.map((challenge) => (
                    <motion.div
                      key={challenge._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <div
                                className={`p-2 rounded-full ${
                                  challenge.category === "nutrition"
                                    ? "bg-green-100 text-green-600"
                                    : challenge.category === "exercise"
                                      ? "bg-orange-100 text-orange-600"
                                      : challenge.category === "water"
                                        ? "bg-blue-100 text-blue-600"
                                        : "bg-purple-100 text-purple-600"
                                }`}
                              >
                                {getIconComponent(challenge.icon)}
                              </div>
                              <CardTitle className="text-lg">{challenge.title}</CardTitle>
                            </div>
                            <Badge variant={challenge.type === "streak" ? "outline" : "secondary"}>
                              {challenge.type === "streak" ? "Streak" : "One-time"}
                            </Badge>
                          </div>
                          <CardDescription>{challenge.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Progress</span>
                                <span className="font-medium">
                                  {challenge.currentValue} / {challenge.targetValue}
                                </span>
                              </div>
                              <Progress value={(challenge.currentValue / challenge.targetValue) * 100} />
                            </div>
                            <div className="flex justify-between items-center text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>Started {format(new Date(challenge.startDate), "MMM d, yyyy")}</span>
                              </div>
                              {challenge.reward && (
                                <div className="flex items-center gap-1">
                                  <Gift className="w-4 h-4" />
                                  <span>{challenge.reward}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="pt-2">
                          <Button
                            className="w-full"
                            onClick={() => handleUpdateProgress(challenge._id, challenge.currentValue + 1)}
                          >
                            Log Progress
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </TabsContent>

          {/* Completed Challenges */}
          <TabsContent value="completed" className="mt-6">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : completedChallenges.length === 0 ? (
              <div className="text-center py-12 bg-muted/50 rounded-lg">
                <Medal className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No completed challenges yet</h3>
                <p className="text-muted-foreground mb-6">Complete challenges to see them here</p>
                <Button onClick={() => setActiveTab("active")}>View Active Challenges</Button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                <AnimatePresence>
                  {completedChallenges.map((challenge) => (
                    <motion.div
                      key={challenge._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="overflow-hidden border-green-200 bg-green-50/30">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <div
                                className={`p-2 rounded-full ${
                                  challenge.category === "nutrition"
                                    ? "bg-green-100 text-green-600"
                                    : challenge.category === "exercise"
                                      ? "bg-orange-100 text-orange-600"
                                      : challenge.category === "water"
                                        ? "bg-blue-100 text-blue-600"
                                        : "bg-purple-100 text-purple-600"
                                }`}
                              >
                                {getIconComponent(challenge.icon)}
                              </div>
                              <CardTitle className="text-lg">{challenge.title}</CardTitle>
                            </div>
                            <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>
                          </div>
                          <CardDescription>{challenge.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Progress</span>
                                <span className="font-medium">
                                  {challenge.targetValue} / {challenge.targetValue}
                                </span>
                              </div>
                              <Progress value={100} className="bg-green-200 [&>div]:bg-green-500" />                            </div>
                            <div className="flex justify-between items-center text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>
                                  Completed{" "}
                                  {challenge.completedDate
                                    ? format(new Date(challenge.completedDate), "MMM d, yyyy")
                                    : ""}
                                </span>
                              </div>
                              {challenge.reward && (
                                <div className="flex items-center gap-1">
                                  <Gift className="w-4 h-4" />
                                  <span>{challenge.reward}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* New Challenge Dialog */}
      <Dialog open={showNewChallengeDialog} onOpenChange={setShowNewChallengeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start a New Challenge</DialogTitle>
            <DialogDescription>Choose a challenge to improve your health habits</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {defaultChallenges.map((challenge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-muted/50"
                onClick={() => handleAddNewChallenge()}
              >
                <div
                  className={`p-2 rounded-full ${
                    challenge.category === "nutrition"
                      ? "bg-green-100 text-green-600"
                      : challenge.category === "exercise"
                        ? "bg-orange-100 text-orange-600"
                        : challenge.category === "water"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-purple-100 text-purple-600"
                  }`}
                >
                  {getIconComponent(challenge.icon)}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{challenge.title}</h3>
                  <p className="text-sm text-muted-foreground">{challenge.description}</p>
                </div>
                <Badge variant={challenge.type === "streak" ? "outline" : "secondary"}>
                  {challenge.type === "streak" ? "Streak" : "One-time"}
                </Badge>
              </motion.div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewChallengeDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

