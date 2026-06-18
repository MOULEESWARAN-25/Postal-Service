"use client";
import dynamic from "next/dynamic";

const ModernCalendar = dynamic(() => import("../components/ModernCalendar"), {
  ssr: false,
});

export default function CalendarPage() {
  return <ModernCalendar />;
}
