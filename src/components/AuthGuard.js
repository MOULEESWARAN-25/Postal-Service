"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token && pathname !== "/login") {
      setAuthorized(false);
      router.push("/login");
    } else if (token && pathname === "/login") {
      setAuthorized(false);
      router.push("/dashboard");
    } else {
      setAuthorized(true);
    }
  }, [pathname, router]);

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center space-y-4">
          {/* Custom Elegant Premium Spinner */}
          <div className="w-12 h-12 rounded-full border-4 border-slate-700 border-t-red-600 animate-spin" />
          <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
            India Post DSS Secure Portal
          </p>
        </div>
      </div>
    );
  }

  return children;
}
