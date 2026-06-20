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
    const promptText = `Suggest a campaign plan for the event "${event.eventName}" at "${event.location}" scheduled on ${new Date(event.date).toLocaleDateString()}. Expected crowd is ${event.expectedCrowd || "High"} and suggested schemes are ${event.suggestedSchemes || "SB, APY"}. Provide a strategy, suggested promotion techniques, and timelines.`;
    triggerChatbot(promptText);
  };

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen bg-background text-foreground border-t border-border">
        
        {/* Sidebar - District Filter */}
        {sidebarOpen && (
          <aside className="w-[280px] bg-card border-r border-border shrink-0 p-6 flex flex-col justify-between">
            <div className="space-y-6">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-wider">
                <CalendarIcon className="text-primary h-4 w-4" />
                Districts Filter
              </h2>
              <div className="space-y-2">
                {districts.map((district) => (
                  <Button
                    key={district}
                    onClick={() => setSelectedDistrict(district)}
                    variant={selectedDistrict === district ? "default" : "outline"}
                    className="w-full justify-start text-xs font-semibold h-9 rounded-lg"
                  >
                    {district}
                  </Button>
                ))}
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <h3 className="font-bold text-primary text-xs flex items-center gap-1">
                <Sparkles size={12} className="text-primary animate-pulse" /> AI Crawler Opportunity
              </h3>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed font-semibold">
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
                className="h-8 w-8 text-muted-foreground hover:bg-muted"
              >
                <SlidersHorizontal size={14} />
              </Button>
              <h1 className="text-base font-extrabold text-foreground">Campaign Opportunity Calendar</h1>
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
                <ChevronLeft size={14} />
              </Button>

              <h2 className="text-xs font-bold text-foreground min-w-[120px] text-center">
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
                <ChevronRight size={14} />
              </Button>
            </div>

            {/* Date Picker using Popover + Calendar */}
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger render={
                  <button className="w-[180px] justify-start text-left font-normal text-xs h-8 border border-border bg-card hover:bg-muted/50 rounded-lg px-3 py-1.5 flex items-center transition-colors text-foreground" />
                }>
                  <CalendarIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
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
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
              </div>
            ) : (
              <Card className="border border-border bg-card shadow-sm rounded-xl p-6">
                <div className="grid grid-cols-7 gap-4 mb-4">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                    <div key={day} className="text-center font-bold text-muted-foreground text-xs uppercase tracking-wider">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-4">
                  {/* Blank spaces for days before month start */}
                  {Array.from({ length: correctedStartDay }).map((_, index) => (
                    <div key={`blank-${index}`} className="h-28 bg-muted/20 rounded-xl border border-dashed border-border/50"></div>
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
                               ? "bg-primary/5 border-primary text-primary shadow-sm"
                              : "bg-card border-border text-foreground hover:bg-slate-50"
                          }`}
                      >
                        <span className={`font-bold text-xs ${isToday ? "text-primary" : "text-muted-foreground"}`}>
                          {day.getDate()}
                        </span>

                        {dayEvents.length > 0 && (
                          <div className="space-y-1">
                            {dayEvents.map((evt, i) => (
                              <div 
                                key={i} 
                                className="text-xs font-bold truncate bg-primary/10 text-primary px-1.5 py-0.5 rounded border border-primary/20 flex items-center gap-0.5"
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
            <DialogContent className="max-w-lg w-full max-h-[85vh] overflow-y-auto border border-border bg-card rounded-xl p-6 shadow-xl">
              <DialogHeader className="border-b border-border pb-3 mb-4">
                <DialogTitle className="text-base font-extrabold text-foreground">
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
                <div className="space-y-4">
                   <h4 className="font-bold text-muted-foreground text-xs uppercase tracking-wider">
                    Detected AI Event Opportunities
                  </h4>
                  <div className="space-y-4">
                    {getEventsForDay(selectedDay).map((event, index) => (
                      <div
                        key={index}
                        className="bg-muted/30 border border-border rounded-xl p-4 space-y-3 relative"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-bold text-secondary text-sm">{event.eventName}</h5>
                            <p className="text-xs text-muted-foreground mt-0.5">{event.location}</p>
                          </div>
                           <Badge variant="outline" className="text-xs font-bold border-border bg-muted text-foreground rounded">
                            {event.expectedCrowd || "High"} Crowd
                          </Badge>
                        </div>

                        <p className="text-xs text-muted-foreground leading-normal font-semibold">
                          {event.description}
                        </p>

                          <div className="flex flex-wrap gap-2 text-xs">
                           <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded font-bold flex items-center gap-1">
                             <Users size={10} /> Source: {event.scrapedSource || 'Scraped'}
                           </span>
                           <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary rounded text-xs font-bold">
                             Status: {event.status || 'Planned'}
                           </Badge>
                         </div>

                        <div className="bg-primary/5 border border-primary/15 rounded-lg p-3">
                           <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-1">
                            Recommended Promotion Schemes
                          </span>
                          <p className="text-xs text-foreground font-bold">{event.suggestedSchemes || "SB, APY"}</p>
                        </div>

                        <Button
                          onClick={() => handleSuggestCampaign(event)}
                          className="w-full h-8 flex items-center justify-center gap-1 text-xs rounded-lg font-bold"
                        >
                          <Sparkles size={12} />
                          <span>Suggest Campaign Plan</span>
                          <ArrowRight size={12} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground text-xs font-semibold">
                  No festival or community events logged for this date.
                </div>
              )}

              <div className="pt-4 flex justify-end">
                <Button onClick={() => setSelectedDay(null)} size="sm" className="w-full md:w-auto font-bold text-xs h-8 px-4 rounded-lg">
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
