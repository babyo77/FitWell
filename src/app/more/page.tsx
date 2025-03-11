"use client"

import { signOut } from "firebase/auth"
import { auth, messaging } from "@/app/lib/firebase"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { getToken } from "firebase/messaging"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mars, Venus, Users, Flame, Trophy, ChevronRight } from "lucide-react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

const profileSchema = z.object({
  uid: z.string(),
  displayName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  age: z.string().refine((val) => !val || (Number(val) >= 13 && Number(val) <= 120), {
    message: "Age must be between 13 and 120",
  }),
  gender: z.enum(["male", "female", "other"]),
  height: z.string().refine((val) => !val || (Number(val) >= 2 && Number(val) <= 9), {
    message: "Height must be between 2 and 9 feet",
  }),
  weight: z.string().refine((val) => !val || (Number(val) >= 20 && Number(val) <= 500), {
    message: "Weight must be between 20 and 500 kg",
  }),
  healthIssues: z.string().optional(),
  photoURL: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function ProfileSettingsPage() {
  const { user, setUser } = useAuth()
  const [notification, setNotification] = useState<boolean>(false)
  const [streaks, setStreaks] = useState(0)

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      uid: user?.uid || "",
      displayName: user?.displayName || "",
      email: user?.email || "",
      age: user?.age || "",
      gender: (user?.gender as "male" | "female" | "other") || undefined,
      height: user?.height || "",
      weight: user?.weight || "",
      photoURL: user?.photoURL || "",
      healthIssues: user?.healthIssues || "",
    },
  })

  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        getKey()
      } else {
        setNotification(false)
      }
    }
    fetchStreaks()
  }, [user])

  const fetchStreaks = async () => {
    if (user?.uid) {
      try {
        const response = await fetch(`/api/streaks?uid=${user.uid}`)
        if (response.ok) {
          const data = await response.json()
          setStreaks(data.streaks)
        }
      } catch (error) {
        console.error("Error fetching streaks:", error)
      }
    }
  }

  const [loading, setLoading] = useState(false)
  const handleSubmit = async (data: ProfileFormData) => {
    try {
      setLoading(true)
      const updatedUser = await fetch("/api/user", {
        method: "PATCH",
        body: JSON.stringify({
          uid: user?.uid,
          displayName: data.displayName,
          age: data.age,
          gender: data.gender,
          height: data.height,
          weight: data.weight,
          healthIssues: data.healthIssues,
        }),
      })
      if (updatedUser.ok) {
        toast.success("Profile updated successfully")
        setUser(
          (prev) =>
            ({
              ...prev,
              displayName: data.displayName,
              age: data.age,
              gender: data.gender,
              height: data.height,
              weight: data.weight,
              healthIssues: data.healthIssues,
            }) as unknown as typeof prev,
        )
      } else {
        toast.error("Failed to update profile")
      }
    } catch (error) {
      toast.error("Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const getKey = async () => {
    if (messaging) {
      const token = await getToken(messaging, {
        vapidKey: "BJ1CyFl3hnseciEi32YNYFZhqKQnLSc40FuY-UIQTnFOoBS10OkvcoiY399nRyW7a6cZQDAPM2Rpykk1N9LZO2Y",
      })
      const res = await fetch("/api/user", {
        method: "PATCH",
        body: JSON.stringify({
          uid: user?.uid,
          notify: token,
        }),
      })
      if (res.ok) {
        setNotification(true)
      } else {
        toast.error("Failed to enable notification")
      }
    }
  }

  const enableNotifications = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission()

      if (permission === "granted") {
        setNotification(true)
        getKey()
      } else {
        alert("Enable from your settings")
        setNotification(false)
      }
    } else {
      alert("Not supported! Please install NGLdrx. from account settings")
      setNotification(false)
    }
  }

  return (
    <div className="mx-auto pb-20 px-4 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="border-none shadow-none mb-8">
          <CardHeader className="pb-4">
            <CardTitle className="text-3xl font-bold">Profile Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              <div className="flex flex-col items-center pb-6 gap-4">
                <Avatar className="w-32 h-32 border-2 border-gray-200">
                  <AvatarImage src={form.watch("photoURL")} />
                  <AvatarFallback className="text-4xl">{form.watch("displayName")?.charAt(0)}</AvatarFallback>
                </Avatar>
                
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="displayName" className="text-base font-medium">
                    Display Name
                  </Label>
                  <Input
                    id="displayName"
                    {...form.register("displayName")}
                    className={`h-12 text-lg ${form.formState.errors.displayName ? "border-red-500" : ""}`}
                  />
                  {form.formState.errors.displayName && (
                    <p className="text-sm text-red-500">{form.formState.errors.displayName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base font-medium">
                    Email
                  </Label>
                  <Input id="email" type="email" disabled={true} {...form.register("email")} className="h-12 text-lg" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age" className="text-base font-medium">
                    Age
                  </Label>
                  <Input
                    id="age"
                    type="text"
                    {...form.register("age")}
                    className={`h-12 text-lg ${form.formState.errors.age ? "border-red-500" : ""}`}
                  />
                  {form.formState.errors.age && (
                    <p className="text-sm text-red-500">{form.formState.errors.age.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-base font-medium">
                    Gender
                  </Label>
                  <Select
                    value={form.watch("gender")}
                    onValueChange={(value) => form.setValue("gender", value as "male" | "female" | "other")}
                  >
                    <SelectTrigger className={`h-12 text-lg ${form.formState.errors.gender ? "border-red-500" : ""}`}>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male" className="flex items-center gap-2">
                        <Mars className="w-4 h-4 text-blue-500" />
                        Male
                      </SelectItem>
                      <SelectItem value="female" className="flex items-center gap-2">
                        <Venus className="w-4 h-4 text-pink-500" />
                        Female
                      </SelectItem>
                      <SelectItem value="other" className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-500" />
                        Other
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.gender && (
                    <p className="text-sm text-red-500">{form.formState.errors.gender.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height" className="text-base font-medium">
                    Height (ft)
                  </Label>
                  <Input
                    id="height"
                    type="text"
                    {...form.register("height")}
                    className={`h-12 text-lg ${form.formState.errors.height ? "border-red-500" : ""}`}
                  />
                  {form.formState.errors.height && (
                    <p className="text-sm text-red-500">{form.formState.errors.height.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-base font-medium">
                    Weight (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="text"
                    {...form.register("weight")}
                    className={`h-12 text-lg ${form.formState.errors.weight ? "border-red-500" : ""}`}
                  />
                  {form.formState.errors.weight && (
                    <p className="text-sm text-red-500">{form.formState.errors.weight.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="healthIssues" className="text-base font-medium">
                    Health Issues
                  </Label>
                  <Textarea
                    id="healthIssues"
                    placeholder="List any health issues or conditions..."
                    {...form.register("healthIssues")}
                    className={`min-h-[100px] text-lg ${form.formState.errors.healthIssues ? "border-red-500" : ""}`}
                  />
                  {form.formState.errors.healthIssues && (
                    <p className="text-sm text-red-500">{form.formState.errors.healthIssues.message}</p>
                  )}
                </div>

                {!notification && (
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications" className="text-base font-medium">
                      Notifications
                    </Label>
                    <Switch
                      id="notifications"
                      checked={notification}
                      onCheckedChange={(checked) => (checked ? enableNotifications() : null)}
                    />
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  <Button
                    type="submit"
                    variant="default"
                    disabled={loading || form.formState.isSubmitting}
                    className="w-full h-12 text-lg"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      signOut(auth)
                      window.location.reload()
                    }}
                    className="w-full h-12 text-lg"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="border-none shadow-none mt-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Flame className="w-6 h-6 text-orange-500" />
              Your Streaks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between bg-gradient-to-r from-orange-400 to-red-500 rounded-xl p-4 text-white">
              <div className="flex items-center gap-4">
                <div className="bg-white rounded-full p-2">
                  <Trophy className="w-8 h-8 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Current Streak</h3>
                  <p className="text-sm opacity-80">Keep it up!</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-4xl font-bold">{streaks}</span>
                <ChevronRight className="w-6 h-6" />
              </div>
            </div>
            <p className="text-center mt-4 text-gray-600">Consecutive days of meeting your goals</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

