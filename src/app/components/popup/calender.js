"use client";
import React, { useEffect, useState } from "react";
import { gapi } from "gapi-script";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  SlidersHorizontal,
  FileText,
} from "lucide-react";

export default function ModernCalendar() {
  const [allEvents, setAllEvents] = useState({});
  const [districtData, setDistrictData] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState("Holiday");
  const [goToDate, setGoToDate] = useState("");
  const [hoveredDay, setHoveredDay] = useState(null);

  const districts = ["Holiday", "Coimbatore", "Chennai", "Thanjavur"];

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const calendarId = {
    Holiday: "en.indian#holiday@group.v.calendar.google.com",
    Coimbatore:
      "6ac1687f488815d713a6c5a45675d30437d97e42b65b24aaf621145d8510be22@group.calendar.google.com",
    Chennai:
      "0f9827236d2f73bb4705ad00c27d7b5d4fde8abfe11164e6d9cdf87641a3d240@group.calendar.google.com",
    Thanjavur:
      "5870ae90cd377ca289ec009216c6078cc72bc1c557cfaca54e19383e72c506d9@group.calendar.google.com",
  };

  const groupEventsByMonth = (events) => {
    const grouped = {};
    events.forEach((event) => {
      const date = new Date(event.start.dateTime || event.start.date);
      const year = date.getFullYear();
      const monthYear = `${months[date.getMonth()]} ${year}`;
      if (!grouped[monthYear]) grouped[monthYear] = {};
      
      const dateString = date.toDateString();
      if (!grouped[monthYear][dateString]) {
        grouped[monthYear][dateString] = [];
      }
      grouped[monthYear][dateString].push(event);
    });
    return grouped;
  };

  const listUpcomingEvents = () => {
    const startOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    ).toISOString();
    const endOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    ).toISOString();

    const districtPromises = Object.keys(calendarId).map((district) => {
      return gapi.client.calendar.events
        .list({
          calendarId: calendarId[district],
          timeMin: startOfMonth,
          timeMax: endOfMonth,
          showDeleted: false,
          singleEvents: true,
          orderBy: "startTime",
        })
        .then((response) => {
          const holidayEvents = response.result.items;
          return { district, events: groupEventsByMonth(holidayEvents) };
        });
    });

    Promise.all(districtPromises)
      .then((districtsData) => {
        const data = {};
        districtsData.forEach(({ district, events }) => {
          data[district] = events;
        });
        setDistrictData(data);
      })
      .catch((error) => console.error("Error fetching holiday events:", error));
  };

  useEffect(() => {
    const initClient = () => {
      console.log("Initializing Google API Client"); // Debug log
      gapi.client
        .init({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_API,
          clientId: process.env.NEXT_PUBLIC_GOOGLE_CALENDER_ID,
          scope: process.env.NEXT_PUBLIC_GOOGLE_CALENDER_SCOPES,
        })
        .then(() => {
          gapi.client.load("calendar", "v3", listUpcomingEvents);
        })
        .catch((error) =>
          console.error("Error initializing Google API client:", error)
        );
    };

    gapi.load("client:auth2", initClient);
  }, []);

  useEffect(() => {
    if (Object.keys(districtData).length > 0) {
      listUpcomingEvents();
    }
  }, [currentMonth, selectedDistrict]);

  const handleGoToDate = () => {
    const inputDate = new Date(goToDate);
    if (!isNaN(inputDate.getTime())) {
      setCurrentMonth(
        new Date(inputDate.getFullYear(), inputDate.getMonth(), 1)
      );
      setSelectedDay(inputDate);
    } else {
      alert("Please enter a valid date");
    }
  };

  const getEventsForDay = (day) => {
    if (!day) return [];

    const monthYear = `${months[day.getMonth()]} ${day.getFullYear()}`;
    const dayEvents = 
      (districtData[selectedDistrict]?.[monthYear]?.[day.toDateString()] || []);
    
    return dayEvents;
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

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <motion.div
        initial={{ width: sidebarOpen ? "280px" : "0px" }}
        animate={{ width: sidebarOpen ? "280px" : "0px" }}
        transition={{ type: "tween" }}
        className="bg-white border-r border-gray-200 shadow-lg overflow-hidden"
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <CalendarIcon className="mr-3 text-blue-600" />
            Districts
          </h2>
          <div className="space-y-2">
            {districts.map((district) => (
              <motion.button
                key={district}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDistrict(district)}
                className={`w-full p-3 rounded-lg text-left transition-colors ${
                  selectedDistrict === district
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-blue-100"
                }`}
              >
                {district}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main Calendar Area */}
      <div className="flex-1 flex h-screen overflow-y-auto  flex-col">
        {/* Header */}
        <div className="w-full bg-white shadow-md p-2 px-6 flex justify-between items-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 bg-gray-100 rounded-full"
          >
            <SlidersHorizontal className="text-gray-700" />
          </motion.button>

          <div className="flex items-center space-x-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() =>
                setCurrentMonth(
                  (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
                )
              }
              className="p-2 bg-gray-100 rounded-full"
            >
              <ChevronLeft className="text-gray-700" />
            </motion.button>

            <h2 className="text-2xl font-bold text-gray-800">
              {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h2>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() =>
                setCurrentMonth(
                  (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
                )
              }
              className="p-2 bg-gray-100 rounded-full"
            >
              <ChevronRight className="text-gray-700" />
            </motion.button>
          </div>

          {/* Go to Date Input */}
          <div className="flex items-center space-x-2 ">
            <input
              type="date"
              value={goToDate}
              onChange={(e) => setGoToDate(e.target.value)}
              className="p-2 border-2 bg-white rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleGoToDate}
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Go
            </motion.button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-6 grid grid-cols-7 gap-4 bg-white m-6 rounded-xl shadow-lg">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div key={day} className="text-center font-semibold text-gray-500">
              {day}
            </div>
          ))}

          {/* Blank spaces for days before month start */}
          {new Array(correctedStartDay).fill(null).map((_, index) => (
            <div key={`blank-${index}`} className=""></div>
          ))}

          {/* Days of the month */}
          {daysInMonth.map((day, index) => {
            const isToday = day.toDateString() === new Date().toDateString();
            const dayEvents = getEventsForDay(day);

            return (
              <div
                key={index}
                className={`relative flex items-center justify-center rounded-lg p-4 cursor-pointer transition-all 
                  ${
                    isToday
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-blue-100"
                  }`}
                onClick={() => setSelectedDay(day)}
              >
                <span className="font-bold block">{day.getDate()}</span>

                {dayEvents.length > 0 && (
                  <div className="absolute top-1 right-1 flex items-center">
                    <FileText className="w-4 h-4 text-blue-600 mr-1" />
                    <span className="text-xs font-bold text-blue-600">
                      {dayEvents.length}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Day Details Modal */}
        <AnimatePresence>
          {selectedDay && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={() => setSelectedDay(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-2xl font-bold mb-4 text-gray-800">
                  {selectedDay.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h3>

                {getEventsForDay(selectedDay).length > 0 ? (
                  <div>
                    <h4 className="font-semibold mb-2">Events:</h4>
                    <ul className="space-y-2">
                      {getEventsForDay(selectedDay).map((event, index) => (
                        <li key={index} className="bg-gray-100 p-3 rounded-lg">
                          <span className="font-medium">{event.summary}</span>
                          {event.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {event.description}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-gray-500">No events for this day</p>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}