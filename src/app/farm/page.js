"use client";

import React, { useState, useEffect } from "react";
import {
  Leaf,
  Cloud,
  Droplet,
  Mountain,
  Thermometer,
  Sprout,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AgriculturalForm = () => {
  const [weatherData, setWeatherData] = useState({
    daily: [],
    city: "Erode", // Default city
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Coordinates for Erode, Tamil Nadu
  const LATITUDE = "11.3410";
  const LONGITUDE = "77.7172";
  const fetchWeeklyWeather = async () => {
    const api = `https://api.open-meteo.com/v1/forecast?latitude=${LATITUDE}&longitude=${LONGITUDE}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset&timezone=Asia/Kolkata&forecast_days=7`;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(api);
      const data = await response.json();

      if (!data.daily) {
        throw new Error("Unable to fetch weather data");
      }

      const transformedDaily = data.daily.time.map((date, index) => ({
        date: date,
        max_temp: Math.round(data.daily.temperature_2m_max[index]),
        min_temp: Math.round(data.daily.temperature_2m_min[index]),
        precipitation_probability:
          data.daily.precipitation_probability_max[index],
        sunrise: data.daily.sunrise[index],
        sunset: data.daily.sunset[index],
      }));

      setWeatherData({
        daily: transformedDaily,
        city: "Erode",
      });
    } catch (err) {
      setError(err.message);
      console.warn("Weather fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeeklyWeather();
  }, []);

  const [formData, setFormData] = useState({
    areas: "",
    crop: "",
    landArea: "",
    startMonth: "",
    endMonth: "",
    amount: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate form data
    const isValid = Object.values(formData).every((value) => value !== "");

    if (isValid) {
      try {
        const response = await fetch("/api/crop", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            areas: formData.areas,
            crop: formData.crop,
            landArea: Number(formData.landArea),
            amount: Number(formData.amount),
            startMonth: formData.startMonth,
            endMonth: formData.endMonth,
          }),
        });

        if (!response.ok) {
          const resData = await response.json();
          throw new Error(resData.error || "Failed to submit agricultural data");
        }

        setIsSubmitted(true);

        // Reset form after 3 seconds
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            areas: "",
            crop: "",
            landArea: "",
            startMonth: "",
            endMonth: "",
            amount: "",
          });
        }, 3000);
      } catch (err) {
        alert(err.message || "An error occurred while submitting data.");
        console.error("Submission error:", err);
      }
    }
  };

  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="w-full min-h-screen bg-background py-6">
      <div className="page-container max-w-[1200px] mx-auto w-full flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <Card className="w-full border border-border bg-card shadow-sm rounded-xl overflow-hidden p-0">
            <CardHeader className="bg-secondary text-secondary-foreground p-6 border-b border-border">
              <CardTitle className="text-lg font-bold tracking-wider uppercase text-center">
                Agricultural Data Collection
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 md:p-8">
              {isSubmitted ? (
                <div className="text-center py-6">
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 px-6 py-4 rounded-lg">
                    <p className="text-sm font-bold">
                      Data Submitted Successfully
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Areas Input */}
                    <div className="space-y-2">
                      <Label htmlFor="areas" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Cultivation Areas
                      </Label>
                      <Input
                        type="text"
                        id="areas"
                        name="areas"
                        value={formData.areas}
                        onChange={handleInputChange}
                        placeholder="Enter cultivation areas"
                        className="w-full text-sm h-10"
                        required
                      />
                    </div>

                    {/* Crop Input */}
                    <div className="space-y-2">
                      <Label htmlFor="crop" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Crop Variety
                      </Label>
                      <Input
                        type="text"
                        id="crop"
                        name="crop"
                        value={formData.crop}
                        onChange={handleInputChange}
                        placeholder="Enter crop name"
                        className="w-full text-sm h-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Land Area Input */}
                    <div className="space-y-2">
                      <Label htmlFor="landArea" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Land Area (sq.km)
                      </Label>
                      <Input
                        type="number"
                        id="landArea"
                        name="landArea"
                        value={formData.landArea}
                        onChange={handleInputChange}
                        placeholder="Enter land area"
                        step="0.01"
                        className="w-full text-sm h-10"
                        required
                      />
                    </div>

                    {/* Amount Input */}
                    <div className="space-y-2">
                      <Label htmlFor="amount" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Estimated Yield/Production
                      </Label>
                      <Input
                        type="number"
                        id="amount"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        placeholder="Enter amount"
                        step="0.01"
                        className="w-full text-sm h-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Start Month Input */}
                    <div className="space-y-2">
                      <Label htmlFor="startMonth" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Cultivation Start Month
                      </Label>
                      <Select
                        value={formData.startMonth}
                        onValueChange={(val) =>
                          setFormData((prev) => ({ ...prev, startMonth: val }))
                        }
                        required
                      >
                        <SelectTrigger id="startMonth" className="w-full px-4 py-5 text-sm h-10">
                          <SelectValue placeholder="Select start month" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border border-border">
                          {months.map((month) => (
                            <SelectItem key={month} value={month} className="focus:bg-muted cursor-pointer text-sm">
                              {month}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* End Month Input */}
                    <div className="space-y-2">
                      <Label htmlFor="endMonth" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Cultivation End Month
                      </Label>
                      <Select
                        value={formData.endMonth}
                        onValueChange={(val) =>
                          setFormData((prev) => ({ ...prev, endMonth: val }))
                        }
                        required
                      >
                        <SelectTrigger id="endMonth" className="w-full px-4 py-5 text-sm h-10">
                          <SelectValue placeholder="Select end month" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border border-border">
                          {months.map((month) => (
                            <SelectItem key={month} value={month} className="focus:bg-muted cursor-pointer text-sm">
                              {month}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      className="w-full bg-primary text-white hover:bg-primary/90 py-5 rounded-lg font-bold uppercase tracking-wider transition-colors duration-200 shadow-sm h-10"
                    >
                      Submit Agricultural Data
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Other Data */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Seasonal Info Cards */}
            <Card className="flex items-center p-6 min-h-[90px] flex-1 border border-border shadow-sm bg-card rounded-xl">
              <Leaf className="text-emerald-600 mr-4 shrink-0" size={28} />
              <div className="space-y-0.5">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Sowing Season</h3>
                <p className="text-base font-extrabold text-foreground">June to July</p>
              </div>
            </Card>

            <Card className="flex items-center p-6 min-h-[90px] flex-1 border border-border shadow-sm bg-card rounded-xl">
              <Sprout className="text-emerald-600 mr-4 shrink-0" size={28} />
              <div className="space-y-0.5">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Harvesting Season</h3>
                <p className="text-base font-extrabold text-foreground">November to January</p>
              </div>
            </Card>
          </div>

          {/* Weather Forecast */}
          <Card className="border border-border shadow-sm bg-card rounded-xl overflow-hidden w-full p-0">
            <CardHeader className="border-b border-border bg-muted/40 p-5">
              <CardTitle className="text-sm font-bold text-secondary tracking-wide uppercase">
                Weekly Weather Forecast
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {loading ? (
                <p className="text-sm text-muted-foreground animate-pulse">Loading weather data...</p>
              ) : error ? (
                <p className="text-sm text-destructive">{error}</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {weatherData.daily.map((day, index) => (
                    <div
                      key={index}
                      className="text-center bg-muted/20 p-4 rounded-lg border border-border/60 hover:shadow-sm transition"
                    >
                      <p className="text-xs font-bold text-foreground">
                        {new Date(day.date).toLocaleDateString("en-US", {
                          weekday: "short",
                        })}
                      </p>
                      <div className="flex justify-center items-center my-2 text-foreground">
                        <Thermometer className="text-primary mr-1 shrink-0" size={14} />
                        <span className="text-xs font-bold">
                          {day.max_temp}°C / {day.min_temp}°C
                        </span>
                      </div>
                      <div className="flex justify-center items-center text-foreground">
                        <Droplet className="text-sky-600 mr-1 shrink-0" size={14} />
                        <span className="text-xs font-semibold text-muted-foreground">
                          {day.precipitation_probability}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {!loading && !error && (
                <p className="text-center text-xs font-semibold text-muted-foreground mt-4">
                  {weatherData.city} - Weekly Forecast
                </p>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Additional Info Cards */}
            <Card className="flex items-center p-6 min-h-[90px] flex-1 border border-border shadow-sm bg-card rounded-xl">
              <Mountain className="text-emerald-600 mr-4 shrink-0" size={28} />
              <div className="space-y-0.5">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Soil Type</h3>
                <p className="text-base font-extrabold text-foreground">Alluvial Soil</p>
              </div>
            </Card>

            <Card className="flex items-center p-6 min-h-[90px] flex-1 border border-border shadow-sm bg-card rounded-xl">
              <Cloud className="text-sky-600 mr-4 shrink-0" size={28} />
              <div className="space-y-0.5">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Underground Water</h3>
                <p className="text-base font-extrabold text-foreground">Yes</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgriculturalForm;
