"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Mailbox } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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
    <div className="min-h-screen bg-red-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-8 border-t-4 border-red-600 relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute top-0 left-0 right-0 bottom-0 opacity-10 pointer-events-none">
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
                fill="red"
                opacity="0.1"
              />
            </pattern>
            <rect width="100%" height="100%" fill="url(#postPattern)" />
          </svg>
        </div>

        {/* Logo and Header */}
        <div className="flex flex-col items-center mb-8">
          <div className=" p-4  w-full flex justify-center items-center  ">
            <img src="/postoffice.png" className="w-44" />
          </div>

          <h3 className="text-3xl font-bold text-center text-red-600 mb-3">
            Login
          </h3>

          <p className="text-gray-600 text-center">
            Secure Access to Postal Services
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 z-10 relative">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="text-red-500 w-5 h-5" />
            </div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="text-red-500 w-5 h-5" />
            </div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300"
            />
          </motion.div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm text-center"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 ease-in-out shadow-lg"
          >
            Sign In
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Forgot your password?{" "}
            <a href="/reset-password" className="text-red-500 hover:underline">
              Reset Here
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
