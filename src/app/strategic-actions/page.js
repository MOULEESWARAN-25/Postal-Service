"use client";
import dynamic from "next/dynamic";

const StrategicActionsView = dynamic(() => import("../components/StrategicActionsView"), {
  ssr: false,
});

export default function StrategicActionsPage() {
  return <StrategicActionsView />;
}
