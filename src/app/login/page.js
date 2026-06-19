"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) router.push("/dashboard");
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Rich gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #0B1120 0%, #1A2B4A 45%, #0F1E35 100%)",
        }}
      />

      {/* Decorative radial glows */}
      <div
        className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(200,16,46,0.12) 0%, transparent 70%)",
          transform: "translate(-30%, -30%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(42,63,102,0.4) 0%, transparent 70%)",
          transform: "translate(25%, 25%)",
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Floating orbs animation */}
      <div
        className="absolute top-1/4 right-1/4 w-2 h-2 rounded-full bg-primary/60 pointer-events-none"
        style={{ animation: "float 6s ease-in-out infinite" }}
      />
      <div
        className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 rounded-full bg-white/20 pointer-events-none"
        style={{ animation: "float 8s ease-in-out infinite 2s" }}
      />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.6; }
          50% { transform: translateY(-16px) scale(1.2); opacity: 1; }
        }
      `}</style>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[420px] mx-4 z-10"
      >
        {/* Card */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: "rgba(255, 255, 255, 0.06)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            boxShadow: "0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06) inset",
          }}
        >
          {/* Top accent bar */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ background: "linear-gradient(90deg, #C8102E 0%, #E8193A 50%, #C8102E 100%)" }}
          />

          <div className="p-8 pt-10">
            {/* Logo section */}
            <div className="flex flex-col items-center mb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="mb-5 relative"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{
                    background: "rgba(200, 16, 46, 0.15)",
                    border: "1px solid rgba(200, 16, 46, 0.3)",
                    boxShadow: "0 0 24px rgba(200, 16, 46, 0.2)",
                  }}
                >
                  <img
                    src="/postoffice.png"
                    alt="India Post Logo"
                    className="w-10 h-10 object-contain"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <h1
                  className="text-2xl font-extrabold text-white tracking-tight"
                  style={{ letterSpacing: "-0.03em" }}
                >
                  Postal Service DSS
                </h1>
                <p className="text-xs font-semibold mt-1.5" style={{ color: "rgba(148,163,184,0.9)" }}>
                  Decision Support System Portal
                </p>
              </motion.div>
            </div>

            {/* Demo credentials banner */}
            <div className="mb-6">
              <button
                type="button"
                onClick={() => setShowDemo(!showDemo)}
                className="w-full text-xs font-bold uppercase tracking-wider py-2 px-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5"
                style={{
                  color: "rgba(200, 16, 46, 0.9)",
                  background: "rgba(200, 16, 46, 0.08)",
                  border: "1px solid rgba(200, 16, 46, 0.2)",
                }}
              >
                <Shield size={10} />
                {showDemo ? "Hide Demo Credentials" : "View Demo Access"}
              </button>

              <AnimatePresence>
                {showDemo && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="mt-2 px-3 py-2.5 rounded-lg text-xs font-medium text-center"
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "rgba(148, 163, 184, 0.9)",
                      }}
                    >
                      <strong style={{ color: "rgba(226, 232, 240, 0.9)" }}>Email:</strong>{" "}
                      <code
                        className="px-1.5 py-0.5 rounded font-bold"
                        style={{ background: "rgba(200,16,46,0.2)", color: "#F43F5E" }}
                      >
                        a@g.c
                      </code>{" "}
                      &nbsp;
                      <strong style={{ color: "rgba(226, 232, 240, 0.9)" }}>Password:</strong>{" "}
                      <code
                        className="px-1.5 py-0.5 rounded font-bold"
                        style={{ background: "rgba(200,16,46,0.2)", color: "#F43F5E" }}
                      >
                        123
                      </code>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email input */}
              <div className="relative">
                <label
                  className="block text-xs font-bold uppercase tracking-widest mb-1.5"
                  style={{ color: "rgba(148, 163, 184, 0.8)" }}
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
                    <Mail className="w-4 h-4" style={{ color: "rgba(148,163,184,0.7)" }} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full pl-10 pr-4 py-3 text-sm rounded-lg transition-all duration-200 placeholder-shown:text-slate-400"
                    style={{
                      background: "rgba(255, 255, 255, 0.06)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      color: "rgba(226, 232, 240, 0.95)",
                      outline: "none",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "rgba(200, 16, 46, 0.6)";
                      e.target.style.boxShadow = "0 0 0 3px rgba(200, 16, 46, 0.12)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>

              {/* Password input */}
              <div className="relative">
                <label
                  className="block text-xs font-bold uppercase tracking-widest mb-1.5"
                  style={{ color: "rgba(148, 163, 184, 0.8)" }}
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
                    <Lock className="w-4 h-4" style={{ color: "rgba(148,163,184,0.7)" }} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full pl-10 pr-10 py-3 text-sm rounded-lg transition-all duration-200"
                    style={{
                      background: "rgba(255, 255, 255, 0.06)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      color: "rgba(226, 232, 240, 0.95)",
                      outline: "none",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "rgba(200, 16, 46, 0.6)";
                      e.target.style.boxShadow = "0 0 0 3px rgba(200, 16, 46, 0.12)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center z-10"
                    style={{ color: "rgba(148,163,184,0.6)" }}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Error message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs font-semibold px-3 py-2 rounded-lg"
                    style={{
                      color: "#F87171",
                      background: "rgba(239, 68, 68, 0.1)",
                      border: "1px solid rgba(239, 68, 68, 0.2)",
                    }}
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-lg transition-all duration-200 mt-2"
                style={{
                  background: isLoading
                    ? "rgba(200, 16, 46, 0.6)"
                    : "linear-gradient(135deg, #C8102E 0%, #A00D24 100%)",
                  color: "#fff",
                  boxShadow: isLoading
                    ? "none"
                    : "0 4px 16px rgba(200, 16, 46, 0.35), 0 1px 4px rgba(0,0,0,0.2)",
                  cursor: isLoading ? "not-allowed" : "pointer",
                }}
              >
                {isLoading ? (
                  <span
                    className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"
                  />
                ) : (
                  <>
                    Sign In to Portal
                    <ArrowRight size={15} />
                  </>
                )}
              </motion.button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-xs" style={{ color: "rgba(100, 116, 139, 0.8)" }}>
                Forgot password?{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Contact Admin for password reset.");
                  }}
                  className="font-bold transition-colors"
                  style={{ color: "rgba(200, 16, 46, 0.8)" }}
                  onMouseEnter={(e) => (e.target.style.color = "#C8102E")}
                  onMouseLeave={(e) => (e.target.style.color = "rgba(200, 16, 46, 0.8)")}
                >
                  Contact Admin
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom brand label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-5 text-xs font-bold uppercase tracking-widest"
          style={{ color: "rgba(100, 116, 139, 0.5)" }}
        >
          India Post Decision Support System &bull; Secured Portal
        </motion.p>
      </motion.div>
    </div>
  );
}
