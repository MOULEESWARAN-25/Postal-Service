"use client";
import dynamic from "next/dynamic";
import ErrorBoundary from "@/components/ErrorBoundary";

const DashboardView = dynamic(() => import("../components/DashboardView"), {
  ssr: false,
});

export default function DashboardPageRoute() {
  return (
    <ErrorBoundary>
      <DashboardView />
    </ErrorBoundary>
  );
}
