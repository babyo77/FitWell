"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/app/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import User from "@/app/model/user-model";
interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  calories: CaloriesState;
  setCalories: React.Dispatch<React.SetStateAction<CaloriesState>>;
}

export interface MacroData {
  current: number;
}

export interface CaloriesState {
  baseGoal: number;
  intake: number;
  exercise: number;
  carbs: MacroData;
  protein: MacroData;
  fat: MacroData;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const [calories, setCalories] = useState<CaloriesState>({
    baseGoal: user?.calorieGoal || 0,
    intake: 0,
    exercise: 0,
    carbs: {
      current: 0,
    },
    protein: {
      current: 0,
    },
    fat: {
      current: 0,
    },
  });
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDoc = await fetch(`/api/user?uid=${currentUser.uid}`);
        if (!userDoc.ok) {
          router.push("/login");
          setLoading(false);
          return;
        }
        const data = await userDoc.json();
        setUser({ ...data.user });
        if (pathname === "/login") {
          router.push("/");
        }
      } else {
        router.push("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, setUser, calories, setCalories }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
