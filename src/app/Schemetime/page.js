"use client";
import dynamic from "next/dynamic";

const SchemesPage = dynamic(() => import("../components/SchemesPage"), {
  ssr: false,
});

export default function SchemesPageRoute() {
  return <SchemesPage />;
}