"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Bot, Send, BookOpen, AlertCircle, ArrowRight
} from "lucide-react";
import dynamic from "next/dynamic";
import useDashboardStore from "@/store/dashboardStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import ErrorBoundary from "@/components/ErrorBoundary";

const MarkdownCustom = dynamic(() => import("./MarkdownCustomWrapper"), {
  ssr: false,
});

export default function PostOfficeChatbot() {
  const { chatbotQuery, triggerChatbot } = useDashboardStore();
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Hello! I am your India Post Support Assistant.\n\nI can help resolve your questions regarding savings schemes, accounts, interest rates, eligibility rules, and document requirements. Type a question below or select a suggested topic to get started!"
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [userPrompt, setUserPrompt] = useState("");
  const scrollAreaRef = useRef(null);

  // Sync external chatbot triggers (e.g. "Explain Recommendation")
  useEffect(() => {
    if (chatbotQuery) {
      handleSend(chatbotQuery);
      // Clear the trigger after executing
      triggerChatbot("");
    }
  }, [chatbotQuery]);

  const suggestions = [
    "What are the benefits of the Post Office Savings Scheme?",
    "How can I open a Senior Citizens Savings Scheme account?",
    "How do I invest in the National Savings Certificate (NSC)?",
    "How can I enroll in the Sukanya Samriddhi Account (SSA)?"
  ];

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (promptText = userPrompt) => {
    if (!promptText.trim()) return;

    setLoading(true);
    const userMessage = { text: promptText, type: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setUserPrompt("");

    let reply = "I'm sorry, I'm having trouble connecting to the system right now.";
    let provenance = null;
    let retrievalQuality = null;
    try {
      const res = await fetch("/api/query-resolver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptText })
      });
      const data = await res.json();
      if (data && data.text) {
        reply = data.text;
        provenance = data.provenance;
        retrievalQuality = data.retrievalQuality;
      }
    } catch (err) {
      console.warn("Chatbot query failed:", err);
    }

    const botMessage = { 
      text: reply, 
      type: "bot",
      provenance,
      retrievalQuality
    };
    setMessages((prev) => [...prev, botMessage]);
    setLoading(false);
  };

  return (
    <ErrorBoundary>
      <div className="bg-background min-h-[calc(100vh-80px)] text-foreground flex flex-col justify-start">
        <div className="page-container flex flex-col flex-grow space-y-5">
          
          {/* Premium Page Hero */}
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #0F172A 0%, #1A2B4A 55%, #1E3A5F 100%)",
              padding: "1.5rem 2rem",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            }}
          >
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(200,16,46,0.15) 0%, transparent 70%)", transform: "translate(20%, -40%)" }}
            />
            <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
            <div className="relative z-10 flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(200,16,46,0.2)", border: "1px solid rgba(200,16,46,0.3)" }}
              >
                <Bot size={22} style={{ color: "#F87171" }} />
              </div>
              <div>
                <h1
                  className="text-xl font-extrabold text-white"
                  style={{ letterSpacing: "-0.03em" }}
                >
                  Post Office Assistant
                </h1>
                <p className="text-xs font-medium mt-0.5" style={{ color: "rgba(148,163,184,0.85)" }}>
                  Resolve customer queries instantly using the knowledge directory for banking, insurance, and postal services.
                </p>
              </div>
            </div>
          </div>

          {/* Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-grow min-h-[550px]">
            
            {/* Left Column — Scheme Reference Info */}
            <div className="lg:col-span-4 flex flex-col space-y-4">
              <Card className="flex flex-col flex-1 h-full border-border bg-card">
                <CardHeader className="pb-2 border-b border-border">
                  <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                    <BookOpen size={18} className="text-primary" /> Schemes Reference
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 flex-1 flex flex-col justify-between pt-4 px-4 pb-4">
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 flex-1">
                    {[
                      { title: "Sukanya Samriddhi Account (SSA)", desc: "For girl children under 10 years. Currently offers 8.2% interest. Exemption under 80C." },
                      { title: "Senior Citizens Savings Scheme (SCSS)", desc: "For citizens aged 60+. Offers 8.2% interest. Quarterly interest payouts." },
                      { title: "National Savings Certificate (NSC)", desc: "5-year maturity scheme. 7.7% interest rate compounded annually. 80C tax benefits." },
                      { title: "Kisan Vikas Patra (KVP)", desc: "Doubles investment in 115 months. 7.5% interest rate compounded annually." },
                    ].map(({ title, desc }) => (
                      <div key={title}
                        className="p-3 rounded-xl border transition-all duration-150 cursor-default"
                        style={{ background: "#F8FAFF", border: "1px solid #EEF1F8" }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#CBD5E1"; e.currentTarget.style.background = "#F1F5F9"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#EEF1F8"; e.currentTarget.style.background = "#F8FAFF"; }}
                      >
                        <h4 className="font-bold text-xs" style={{ color: "#1A2B4A" }}>{title}</h4>
                        <p className="text-xs mt-1 leading-relaxed" style={{ color: "#64748B" }}>{desc}</p>
                      </div>
                    ))}
                  </div>

                  <div
                    className="p-3 rounded-xl flex items-start gap-2 text-xs mt-4"
                    style={{ background: "rgba(200,16,46,0.06)", border: "1px solid rgba(200,16,46,0.12)", color: "#C8102E" }}
                  >
                    <AlertCircle size={14} className="shrink-0 mt-0.5" />
                    <span>Scheme interest rates are reviewed quarterly by the Ministry of Finance.</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column — Chat Container */}
            <div
              className="lg:col-span-8 flex flex-col rounded-xl overflow-hidden min-h-[500px]"
              style={{ border: "1px solid #E8EDF5", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", background: "#fff" }}
            >
              {/* Chat Header */}
              <div
                className="px-6 py-4 flex items-center justify-between"
                style={{ background: "linear-gradient(135deg, #0F172A 0%, #1A2B4A 100%)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(200,16,46,0.2)", border: "1px solid rgba(200,16,46,0.3)" }}
                  >
                    <Bot size={16} style={{ color: "#F87171" }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white" style={{ letterSpacing: "-0.01em" }}>Postal Service Assistant</h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-semibold" style={{ color: "rgba(148,163,184,0.7)" }}>Assistant Online</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Messages scroll area */}
              <ScrollArea ref={scrollAreaRef} className="flex-1 p-6 h-[420px] bg-muted/10">
                <div className="space-y-4">
                  {messages.map((msg, index) => (
                    <div key={index} className="flex flex-col space-y-1">
                      <div
                        className={`flex items-end gap-2.5 ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {msg.type === "bot" && (
                          <Avatar className="h-8 w-8 shrink-0 border border-border">
                            <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-bold">IP</AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs shadow-sm leading-relaxed ${
                            msg.type === "user"
                              ? "bg-primary text-primary-foreground rounded-br-none"
                              : "bg-card text-foreground rounded-bl-none border border-border"
                          }`}
                        >
                          {msg.type === "bot" ? (
                            <MarkdownCustom>{msg.text}</MarkdownCustom>
                          ) : (
                            <p className="whitespace-pre-line font-medium">{msg.text}</p>
                          )}
                        </div>
                        {msg.type === "user" && (
                          <Avatar className="h-8 w-8 shrink-0 border border-border">
                            <AvatarFallback className="bg-muted text-muted-foreground text-xs font-bold">USR</AvatarFallback>
                          </Avatar>
                        )}
                      </div>

                      {/* AI trust, retrieval quality, and provenance logs removed to focus purely on business-relevant scheme guidance */}
                    </div>
                  ))}
                  
                  {loading && (
                    <div className="flex items-end gap-2.5 justify-start">
                      <Avatar className="h-8 w-8 shrink-0 border border-border">
                        <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-bold">IP</AvatarFallback>
                      </Avatar>
                      <div className="max-w-[75%] rounded-2xl rounded-bl-none bg-card text-foreground border border-border px-4 py-3 text-xs shadow-sm space-y-2 w-48">
                        <Skeleton className="h-3 w-5/6" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-2/3" />
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Suggestions */}
              {messages.length === 1 && (
                <div className="px-6 pb-3 pt-2 bg-card border-t border-border">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Suggested Inquiries</p>
                  <div className="flex flex-col gap-2">
                    {suggestions.map((sug, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        onClick={() => handleSend(sug)}
                        className="justify-between h-9 text-xs font-semibold px-4 w-full border-border text-foreground hover:text-primary hover:border-primary group"
                      >
                        <span>{sug}</span>
                        <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Input */}
              <div className="p-4 border-t border-border bg-muted/20">
                <form
                  onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                  className="flex items-center gap-2"
                >
                  <Input
                    type="text"
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    placeholder="Ask a question about post office savings, deposits, insurance..."
                    className="flex-1 bg-card text-xs text-foreground px-4 h-10 border-border focus:ring-primary placeholder-muted-foreground"
                    disabled={loading}
                  />
                  <Button
                    type="submit"
                    disabled={loading || !userPrompt.trim()}
                    className="h-10 w-10 shrink-0"
                  >
                    <Send size={16} />
                  </Button>
                </form>
              </div>

            </div>

          </div>

        </div>
      </div>
    </ErrorBoundary>
  );
}
