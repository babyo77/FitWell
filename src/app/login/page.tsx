"use client";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "@/app/lib/firebase";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        await fetch(`/api/user`, {
          method: "PUT",
          body: JSON.stringify({ ...res.user }),
        });
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className=" h-screen flex items-center justify-center bg-white tracking-tighter">
      <div className="w-full space-y-4 max-w-md p-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold">FitWell</h1>
        </div>

        {/* Login Text */}
        <div>
          <h2 className="text-sm">
            Your personalized fitness journey is ready to begin. Sign up to save
            your progress!
          </h2>
        </div>

        {/* Login Button */}
        <Button
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md text-center hover:bg-gray-50"
          onClick={handleLogin}
          disabled={loading}
        >
          Continue with Google
        </Button>

        {/* Decorative Circles (as shown in sketch) */}
        <div className="fixed bottom-8 left-8">
          <div className="w-3 h-3 rounded-full bg-gray-200 mb-2"></div>
          <div className="w-3 h-3 rounded-full bg-gray-200"></div>
        </div>
        <div className="fixed top-8 right-8">
          <div className="w-3 h-3 rounded-full bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
}
