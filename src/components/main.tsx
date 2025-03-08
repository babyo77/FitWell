"use client";
import React from "react";
import { useAuth } from "@/context/auth-context";
import Loader from "./loader";
import Onboarding from "./onboarding";
function Main({ children }: { children: React.ReactNode }) {
  const { loading, user } = useAuth();
  if (loading) {
    return <Loader />;
  }

  if (user && !user.onboarding) {
    return <Onboarding />;
  }

  return (
    <main className=" min-h-screen pb-20 overflow-y-scroll">{children}</main>
  );
}

export default Main;
