"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showDemo, setShowDemo] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      const { token } = data;

      localStorage.setItem("token", token);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-[0_12px_45px_rgba(0,0,0,0.06)] rounded-2xl p-8 border-0 relative overflow-hidden bg-white">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#C8102E] to-[#A00D24]" />
        {/* Background Pattern */}
        <div className="absolute top-0 left-0 right-0 bottom-0 opacity-5 pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0 0 500 500"
          >
            <pattern
              id="postPattern"
              patternUnits="userSpaceOnUse"
              width="100"
              height="100"
            >
              <path
                d="M0 50 L50 0 L100 50 L50 100 Z"
                fill="#C8102E"
                opacity="0.1"
              />
            </pattern>
            <rect width="100%" height="100%" fill="url(#postPattern)" />
          </svg>
        </div>

        {/* Logo and Header */}
        <div className="flex flex-col items-center mb-8">
          <div className=" p-4  w-full flex justify-center items-center  ">
            <img src="/postoffice.png" className="w-44" alt="India Post Logo" />
          </div>

          <h3 className="text-3xl font-bold text-center text-[#1A2B4A] mb-3">
            Login
          </h3>

          <p className="text-gray-600 text-center text-sm mb-4">
            Secure Access to Postal Services Decision Support System
          </p>

          <div className="w-full flex flex-col items-center">
            <button
              type="button"
              onClick={() => setShowDemo(!showDemo)}
              className="text-xs font-semibold text-[#C8102E] hover:underline focus:outline-none transition-colors duration-200"
            >
              {showDemo ? "Hide Demo Credentials" : "Show Demo Credentials"}
            </button>
            
            {showDemo && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-muted-foreground text-center mt-2.5 p-2 bg-slate-50 border border-slate-100 rounded-lg w-full shadow-inner"
              >
                Use these demo credentials: <br />
                <strong>Email:</strong> <code className="bg-slate-100 px-1 py-0.5 rounded text-[#C8102E]">a@g.c</code> | <strong>Password:</strong> <code className="bg-slate-100 px-1 py-0.5 rounded text-[#C8102E]">123</code>
              </motion.div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 z-10 relative">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="text-slate-400 w-5 h-5" />
            </div>
            <Input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 py-6 text-sm border border-gray-300 rounded-lg focus-visible:ring-[#C8102E] transition duration-300"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="text-slate-400 w-5 h-5" />
            </div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 py-6 text-sm border border-gray-300 rounded-lg focus-visible:ring-[#C8102E] transition duration-300"
            />
          </motion.div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[#C8102E] text-xs font-semibold text-center"
            >
              {error}
            </motion.p>
          )}

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              type="submit"
              className="w-full py-6 bg-[#C8102E] text-white hover:bg-[#A30D24] font-bold text-sm transition duration-300 ease-in-out shadow-lg"
            >
              Sign In
            </Button>
          </motion.div>
        </form>

        <div className="mt-6 text-center text-xs">
          <p className="text-gray-600">
            Forgot your password?{" "}
            <a href="#" className="text-[#C8102E] hover:underline" onClick={(e) => { e.preventDefault(); alert("Contact Admin for password reset."); }}>
              Reset Here
            </a>
          </p>
        </div>
      </Card>
      </motion.div>
    </div>
  );
}
