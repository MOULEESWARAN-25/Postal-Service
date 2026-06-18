"use client";
import dynamic from "next/dynamic";

const VillageIntelligenceView = dynamic(() => import("../components/VillageIntelligenceView"), {
  ssr: false,
});

export default function VillageIntelligencePage() {
  return <VillageIntelligenceView />;
}
