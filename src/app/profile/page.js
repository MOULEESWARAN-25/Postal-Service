"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfileRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/personalDetails");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-10 h-10 rounded-full border-4 border-slate-700 border-t-red-600 animate-spin" />
        <p className="text-xs font-semibold text-slate-400">Redirecting to profile details...</p>
      </div>
    </div>
  );
}
