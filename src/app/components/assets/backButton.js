"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/")} // Navigate to the main page
      className="flex items-center rounded-full gap-1 bg-white text-black shadow-md py-1"
    >
      <ArrowLeft />
    </button>
  );
}

export default BackButton;
