"use client";
import React from "react";
import { useAuth } from "@/context/auth-context";
import Loader from "./loader";
function Main({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();
  if (loading) {
    return <Loader />;
  }

  return (
    <main className=" max-h-[calc(100vh-4.1rem)] overflow-y-scroll">
      {children}
    </main>
  );
}

export default Main;
