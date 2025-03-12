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
import { Mars, Venus, Users, Flame, Trophy } from "lucide-react"
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
    <div className="mx-auto pb-12 px-3 max-w-md">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className="border-none shadow-none mb-4">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-base font-bold">Profile Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="flex flex-col items-center pb-3 gap-2">
                <Avatar className="w-20 h-20 border border-gray-200">
                  <AvatarImage src={form.watch("photoURL")} />
                  <AvatarFallback className="text-xl">{form.watch("displayName")?.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="displayName" className="text-sm font-medium">
                    Display Name
                  </Label>
                  <Input
                    id="displayName"
                    {...form.register("displayName")}
                    className={`h-9 text-sm ${form.formState.errors.displayName ? "border-red-500" : ""}`}
                  />
                  {form.formState.errors.displayName && (
                    <p className="text-xs text-red-500">{form.formState.errors.displayName.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input id="email" type="email" disabled={true} {...form.register("email")} className="h-9 text-sm" />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="age" className="text-sm font-medium">
                    Age
                  </Label>
                  <Input
                    id="age"
                    type="text"
                    {...form.register("age")}
                    className={`h-9 text-sm ${form.formState.errors.age ? "border-red-500" : ""}`}
                  />
                  {form.formState.errors.age && (
                    <p className="text-xs text-red-500">{form.formState.errors.age.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="gender" className="text-sm font-medium">
                    Gender
                  </Label>
                  <Select
                    value={form.watch("gender")}
                    onValueChange={(value) => form.setValue("gender", value as "male" | "female" | "other")}
                  >
                    <SelectTrigger className={`h-9 text-sm ${form.formState.errors.gender ? "border-red-500" : ""}`}>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male" className="flex items-center gap-2">
                        <Mars className="w-3 h-3 text-blue-500" />
                        Male
                      </SelectItem>
                      <SelectItem value="female" className="flex items-center gap-2">
                        <Venus className="w-3 h-3 text-pink-500" />
                        Female
                      </SelectItem>
                      <SelectItem value="other" className="flex items-center gap-2">
                        <Users className="w-3 h-3 text-purple-500" />
                        Other
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.gender && (
                    <p className="text-xs text-red-500">{form.formState.errors.gender.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="height" className="text-sm font-medium">
                    Height (ft)
                  </Label>
                  <Input
                    id="height"
                    type="text"
                    {...form.register("height")}
                    className={`h-9 text-sm ${form.formState.errors.height ? "border-red-500" : ""}`}
                  />
                  {form.formState.errors.height && (
                    <p className="text-xs text-red-500">{form.formState.errors.height.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="weight" className="text-sm font-medium">
                    Weight (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="text"
                    {...form.register("weight")}
                    className={`h-9 text-sm ${form.formState.errors.weight ? "border-red-500" : ""}`}
                  />
                  {form.formState.errors.weight && (
                    <p className="text-xs text-red-500">{form.formState.errors.weight.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="healthIssues" className="text-sm font-medium">
                    Health Issues
                  </Label>
                  <Textarea
                    id="healthIssues"
                    placeholder="List any health issues or conditions..."
                    {...form.register("healthIssues")}
                    className={`min-h-[60px] text-sm ${form.formState.errors.healthIssues ? "border-red-500" : ""}`}
                  />
                  {form.formState.errors.healthIssues && (
                    <p className="text-xs text-red-500">{form.formState.errors.healthIssues.message}</p>
                  )}
                </div>

                {!notification && (
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications" className="text-sm font-medium">
                      Notifications
                    </Label>
                    <Switch
                      id="notifications"
                      checked={notification}
                      onCheckedChange={(checked) => (checked ? enableNotifications() : null)}
                    />
                  </div>
                )}

                <div className="flex flex-col gap-2 pt-2">
                  <Button
                    type="submit"
                    variant="default"
                    disabled={loading || form.formState.isSubmitting}
                    className="w-full h-9 text-sm"
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
                    className="w-full h-9 text-sm"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="border-none shadow-none mt-4">
          <CardHeader className="py-2">
            <CardTitle className="text-base font-bold flex items-center gap-1">
              <Flame className="w-4 h-4 text-orange-500" />
              Your Streaks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between bg-gradient-to-r from-orange-400 to-red-500 rounded-lg p-3 text-white">
              <div className="flex items-center gap-3">
                <div className="bg-white rounded-full p-1">
                  <Trophy className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Current Streak</h3>
                  <p className="text-xs opacity-80">Keep it up!</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-bold">{streaks}</span>
              </div>
            </div>
            <p className="text-center mt-2 text-xs text-gray-600">Consecutive days of meeting your goals</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}