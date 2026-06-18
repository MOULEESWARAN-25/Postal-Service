"use client";
import dynamic from "next/dynamic";

const PersonDashboard = dynamic(() => import("../components/PersonDashboard"), {
  ssr: false,
});

export default function PersonalDetailsPage() {
  return <PersonDashboard />;
}
