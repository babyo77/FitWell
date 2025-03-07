"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Mail,
  Calendar,
  UserCircle2,
  Ruler,
  Weight,
  Bell,
  Camera,
  Mars,
  Venus,
  Users,
} from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react";

const profileSchema = z.object({
  uid: z.string(),
  displayName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  age: z
    .string()
    .refine((val) => !val || (Number(val) >= 13 && Number(val) <= 120), {
      message: "Age must be between 13 and 120",
    }),
  gender: z.enum(["male", "female", "other"]),
  height: z
    .string()
    .refine((val) => !val || (Number(val) >= 2 && Number(val) <= 9), {
      message: "Height must be between 2 and 9 feet",
    }),
  weight: z
    .string()
    .refine((val) => !val || (Number(val) >= 20 && Number(val) <= 500), {
      message: "Weight must be between 20 and 500 kg",
    }),
  notifications: z.boolean(),
  photoURL: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileSettingsPage() {
  const { user } = useAuth();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      uid: user?.uid || "",
      displayName: user?.displayName || "",
      email: user?.email || "",
      notifications: true,
      age: user?.age || "",
      gender: (user?.gender as "male" | "female" | "other") || undefined,
      height: user?.height || "",
      weight: user?.weight || "",
      photoURL: user?.photoURL || "",
    },
  });

  const [loading, setLoading] = useState(false);
  const handleSubmit = async (data: ProfileFormData) => {
    try {
      setLoading(true);
      // TODO: Implement API call to save settings
      const updatedUser = await fetch("/api/user", {
        method: "PATCH",
        body: JSON.stringify({
          uid: user?.uid,
          displayName: data.displayName,
          age: data.age,
          gender: data.gender,
          height: data.height,
          weight: data.weight,
        }),
      });
      if (updatedUser.ok) {
        toast.success("Profile updated successfully");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto">
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="space-y-2">
              <div className="flex flex-col items-start pb-3 gap-4">
                <Avatar className="w-28 h-28 border-2 border-gray-200 ">
                  <AvatarImage src={form.watch("photoURL")} />
                  <AvatarFallback>
                    {form.watch("displayName")?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>

              <Label htmlFor="displayName" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Display Name
              </Label>
              <Input
                id="displayName"
                {...form.register("displayName")}
                className={
                  form.formState.errors.displayName ? "border-red-500" : ""
                }
              />
              {form.formState.errors.displayName && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.displayName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                disabled={true}
                {...form.register("email")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Age
              </Label>
              <Input
                id="age"
                type="text"
                {...form.register("age")}
                className={form.formState.errors.age ? "border-red-500" : ""}
              />
              {form.formState.errors.age && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.age.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender" className="flex items-center gap-2">
                <UserCircle2 className="w-4 h-4" />
                Gender
              </Label>
              <Select
                value={form.watch("gender")}
                onValueChange={(value) =>
                  form.setValue("gender", value as "male" | "female" | "other")
                }
              >
                <SelectTrigger
                  className={`w-full ${
                    form.formState.errors.gender ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male" className="flex items-center gap-2">
                    <Mars className="w-4 h-4" />
                    Male
                  </SelectItem>
                  <SelectItem
                    value="female"
                    className="flex items-center gap-2"
                  >
                    <Venus className="w-4 h-4" />
                    Female
                  </SelectItem>
                  <SelectItem value="other" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Other
                  </SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.gender && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.gender.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="height" className="flex items-center gap-2">
                <Ruler className="w-4 h-4" />
                Height (ft)
              </Label>
              <Input
                id="height"
                type="text"
                {...form.register("height")}
                className={form.formState.errors.height ? "border-red-500" : ""}
              />
              {form.formState.errors.height && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.height.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight" className="flex items-center gap-2">
                <Weight className="w-4 h-4" />
                Weight (kg)
              </Label>
              <Input
                id="weight"
                type="text"
                {...form.register("weight")}
                className={form.formState.errors.weight ? "border-red-500" : ""}
              />
              {form.formState.errors.weight && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.weight.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Label
                htmlFor="notifications"
                className="flex items-center gap-2"
              >
                <Bell className="w-4 h-4" />
                Notifications
              </Label>
              <Switch
                id="notifications"
                checked={form.watch("notifications")}
                onCheckedChange={(checked) =>
                  form.setValue("notifications", checked)
                }
              />
            </div>

            <div className="flex justify-between">
              <Button
                type="submit"
                variant="default"
                disabled={loading || form.formState.isSubmitting}
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  signOut(auth);
                  window.location.reload();
                }}
              >
                Logout
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
