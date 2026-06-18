"use client";

import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  SlidersHorizontal,
  Sparkles,
  Users,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import useDashboardStore from "@/store/dashboardStore";
import axios from "axios";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import ErrorBoundary from "@/components/ErrorBoundary";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

export default function ModernCalendar() {
  const { triggerChatbot } = useDashboardStore();
  const [eventsList, setEventsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState("Erode");
  const [goToDate, setGoToDate] = useState("");

  const districts = ["Erode", "Coimbatore", "Chennai", "Thanjavur"];

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/events?district=${selectedDistrict}`);
      if (response.data.success) {
        setEventsList(response.data.events || []);
      }
    } catch (error) {
      console.warn("Error fetching events from MongoDB:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [selectedDistrict]);

  const handleGoToDate = (d) => {
    if (d) {
      setGoToDate(d.toISOString().split("T")[0]);
      setCurrentMonth(new Date(d.getFullYear(), d.getMonth(), 1));
      setSelectedDay(d);
    }
  };

  const getEventsForDay = (day) => {
    if (!day) return [];
    return eventsList.filter(event => {
      const eDate = new Date(event.date);
      return eDate.toDateString() === day.toDateString();
    });
  };

  const daysInMonth = new Array(
    new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    ).getDate()
  )
    .fill(null)
    .map(
      (_, i) =>
        new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1)
    );

  const startDay = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();
  const correctedStartDay = startDay === 0 ? 6 : startDay - 1;

  const handleSuggestCampaign = (event) => {
    const promptText = `Suggest a campaign plan for the event "${event.eventName}" at "${event.location}" scheduled on ${new Date(event.date).toLocaleDateString()}. Expected crowd is ${event.expectedCrowd || "High"} and suggested schemes are ${event.suggestedSchemes || "POSA, APY"}. Provide a strategy, suggested promotion techniques, and timelines.`;
    triggerChatbot(promptText);
  };

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen bg-background text-foreground border-t border-border">
        
        {/* Sidebar - District Filter */}
        {sidebarOpen && (
          <aside className="w-[280px] bg-card border-r border-border shrink-0 p-6 flex flex-col justify-between">
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <CalendarIcon className="text-primary h-5 w-5" />
                Districts Filter
              </h2>
              <div className="space-y-2">
                {districts.map((district) => (
                  <Button
                    key={district}
                    onClick={() => setSelectedDistrict(district)}
                    variant={selectedDistrict === district ? "default" : "outline"}
                    className="w-full justify-start text-xs font-semibold h-10"
                  >
                    {district}
                  </Button>
                ))}
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <h3 className="font-bold text-primary text-xs flex items-center gap-1">
                <Sparkles size={14} className="text-primary animate-pulse" /> AI Opportunity
              </h3>
              <p className="text-xs text-foreground mt-1.5 leading-relaxed">
                Select <strong>Erode</strong> to view active festival crowds and local farmer meets detected by our AI event crawler.
              </p>
            </div>
          </aside>
        )}

        {/* Main Calendar Area */}
        <div className="flex-1 flex flex-col h-screen overflow-y-auto">
          
          {/* Header toolbar */}
          <div className="w-full bg-card p-4 px-6 flex flex-col sm:flex-row justify-between items-center border-b border-border gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="h-9 w-9 text-muted-foreground hover:bg-muted"
              >
                <SlidersHorizontal size={16} />
              </Button>
              <h1 className="text-lg font-bold text-foreground">Campaign Opportunity Calendar</h1>
            </div>

            {/* Month selector */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setCurrentMonth(
                    (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
                  )
                }
                className="h-8 w-8 rounded-full"
              >
                <ChevronLeft size={16} />
              </Button>

              <h2 className="text-sm font-bold text-foreground min-w-[140px] text-center">
                {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h2>

              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setCurrentMonth(
                    (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
                  )
                }
                className="h-8 w-8 rounded-full"
              >
                <ChevronRight size={16} />
              </Button>
            </div>

            {/* Date Picker using Popover + Calendar */}
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger render={
                  <button className="w-[180px] justify-start text-left font-normal text-xs h-9 border border-border bg-background hover:bg-muted/50 rounded-lg px-3 py-1.5 flex items-center transition-colors" />
                }>
                  <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground animate-pulse" />
                  {goToDate ? format(new Date(goToDate), "PPP") : <span className="text-muted-foreground">Jump to Date</span>}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-border bg-card" align="end">
                  <Calendar
                    mode="single"
                    selected={goToDate ? new Date(goToDate) : undefined}
                    onSelect={handleGoToDate}
                    initialFocus
                    className="bg-card text-foreground"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Calendar Grid Container */}
          <ScrollArea className="flex-grow p-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
              </div>
            ) : (
              <Card className="border border-slate-200 bg-white shadow-sm rounded-2xl p-6">
                <div className="grid grid-cols-7 gap-4 mb-4">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                    <div key={day} className="text-center font-bold text-slate-500 text-xs uppercase tracking-wider">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-4">
                  {/* Blank spaces for days before month start */}
                  {Array.from({ length: correctedStartDay }).map((_, index) => (
                    <div key={`blank-${index}`} className="h-28 bg-slate-50/50 rounded-xl border border-dashed border-slate-100"></div>
                  ))}

                  {/* Days of the month */}
                  {daysInMonth.map((day, index) => {
                    const isToday = day.toDateString() === new Date().toDateString();
                    const dayEvents = getEventsForDay(day);

                    return (
                      <div
                        key={index}
                        onClick={() => setSelectedDay(day)}
                        className={`h-28 relative flex flex-col justify-between rounded-xl p-2.5 cursor-pointer transition-colors border
                          ${
                            isToday
                              ? "bg-red-50/50 border-[#C8102E] text-[#C8102E] shadow-sm"
                              : "bg-white border-slate-100 text-slate-800 hover:bg-slate-50"
                          }`}
                      >
                        <span className={`font-bold text-xs ${isToday ? "text-[#C8102E]" : "text-slate-500"}`}>
                          {day.getDate()}
                        </span>

                        {dayEvents.length > 0 && (
                          <div className="space-y-1">
                            {dayEvents.map((evt, i) => (
                              <div 
                                key={i} 
                                className="text-[10px] font-bold truncate bg-red-50 text-[#C8102E] px-1.5 py-0.5 rounded border border-red-100 flex items-center gap-0.5"
                                title={evt.eventName}
                              >
                                <Sparkles size={8} className="shrink-0" />
                                {evt.eventName}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
          </ScrollArea>
        </div>

        {/* Day Details Dialog */}
        {selectedDay && (
          <Dialog open={!!selectedDay} onOpenChange={() => setSelectedDay(null)}>
            <DialogContent className="max-w-lg w-full max-h-[85vh] overflow-y-auto border border-slate-200 bg-white rounded-2xl p-6 shadow-xl">
              <DialogHeader className="border-b border-border pb-3">
                <DialogTitle className="text-lg font-bold text-foreground">
                  {selectedDay.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  AI opportunities, scraped events, and suggested campaign promotions.
                </DialogDescription>
              </DialogHeader>

              {getEventsForDay(selectedDay).length > 0 ? (
                <div className="space-y-4 pt-4">
                  <h4 className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                    Detected AI Event Opportunities
                  </h4>
                  <div className="space-y-4">
                    {getEventsForDay(selectedDay).map((event, index) => (
                      <div
                        key={index}
                        className="bg-muted/20 border border-border rounded-lg p-4 space-y-3 relative"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-bold text-foreground text-sm">{event.eventName}</h5>
                            <p className="text-xs text-muted-foreground mt-0.5">{event.location}</p>
                          </div>
                          <Badge variant="outline" className="text-xs font-semibold border-orange-500 bg-orange-500/10 text-orange-700">
                            {event.expectedCrowd || "High"} Crowd
                          </Badge>
                        </div>

                        <p className="text-xs text-foreground/80 leading-relaxed">
                          {event.description}
                        </p>

                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded font-medium flex items-center gap-1">
                            <Users size={10} /> Source: {event.scrapedSource || 'Scraped'}
                          </span>
                          <Badge variant="outline" className="border-green-500 bg-green-500/10 text-green-700 dark:text-green-400">
                            Status: {event.status || 'Planned'}
                          </Badge>
                        </div>

                        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                          <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-1">
                            Recommended Promotion Schemes
                          </span>
                          <p className="text-xs text-foreground font-semibold">{event.suggestedSchemes || "POSA, APY"}</p>
                        </div>

                        <Button
                          onClick={() => handleSuggestCampaign(event)}
                          className="w-full h-9 flex items-center justify-center gap-1 text-xs"
                        >
                          <Sparkles size={14} />
                          <span>Suggest Campaign Plan</span>
                          <ArrowRight size={12} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground text-sm font-medium">
                  No festival or community events logged for this date.
                </div>
              )}

              <div className="pt-4 flex justify-end">
                <Button onClick={() => setSelectedDay(null)} size="sm" className="w-full md:w-auto font-bold">
                  Close
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </ErrorBoundary>
  );
}
