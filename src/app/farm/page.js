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
      console.error("Weather fetch error:", err);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate form data
    const isValid = Object.values(formData).every((value) => value !== "");

    if (isValid) {
      // Submission logic
      console.log("Form submitted:", formData);
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
    }
  };

  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="flex flex-col md:flex-row w-screen min-h-screen bg-slate-50">
      {/* Left Side - Form */}
      <div className="w-full md:w-1/2 bg-slate-50 flex items-start justify-center p-4 md:p-8">
        <div className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-700 to-slate-900 p-6 shadow-sm">
            <h2 className="text-2xl md:text-3xl font-semibold text-center text-white tracking-wide uppercase">
              Agricultural Data Collection
            </h2>
          </div>

          {isSubmitted ? (
            <div className="p-8 text-center">
              <div className="bg-emerald-100 border border-emerald-300 text-emerald-700 px-6 py-4 rounded-lg">
                <p className="text-xl font-medium">
                  Data Submitted Successfully
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Areas Input */}
                <div>
                  <label
                    htmlFor="areas"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Cultivation Areas
                  </label>
                  <input
                    type="text"
                    id="areas"
                    name="areas"
                    value={formData.areas}
                    onChange={handleInputChange}
                    placeholder="Enter cultivation areas"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-slate-800"
                    required
                  />
                </div>

                {/* Crop Input */}
                <div>
                  <label
                    htmlFor="crop"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Crop Variety
                  </label>
                  <input
                    type="text"
                    id="crop"
                    name="crop"
                    value={formData.crop}
                    onChange={handleInputChange}
                    placeholder="Enter crop name"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-slate-800"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Land Area Input */}
                <div>
                  <label
                    htmlFor="landArea"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Land Area (sq.km)
                  </label>
                  <input
                    type="number"
                    id="landArea"
                    name="landArea"
                    value={formData.landArea}
                    onChange={handleInputChange}
                    placeholder="Enter land area"
                    step="0.01"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-slate-800"
                    required
                  />
                </div>

                {/* Amount Input */}
                <div>
                  <label
                    htmlFor="amount"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Estimated Yield/Production
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="Enter amount"
                    step="0.01"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-slate-800"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start Month Input */}
                <div>
                  <label
                    htmlFor="startMonth"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Cultivation Start Month
                  </label>
                  <select
                    id="startMonth"
                    name="startMonth"
                    value={formData.startMonth}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-slate-700"
                    required
                  >
                    <option value="" disabled>
                      Select start month
                    </option>
                    {months.map((month, index) => (
                      <option
                        key={index}
                        value={month}
                        className="text-slate-700"
                      >
                        {month}
                      </option>
                    ))}
                  </select>
                </div>

                {/* End Month Input */}
                <div>
                  <label
                    htmlFor="endMonth"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Cultivation End Month
                  </label>
                  <select
                    id="endMonth"
                    name="endMonth"
                    value={formData.endMonth}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-slate-700"
                    required
                  >
                    <option value="" disabled>
                      Select end month
                    </option>
                    {months.map((month, index) => (
                      <option
                        key={index}
                        value={month}
                        className="text-slate-700"
                      >
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-slate-800 text-white py-4 rounded-lg font-semibold uppercase tracking-wide 
                  hover:bg-slate-900 transition-colors duration-300 
                  focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 
                  shadow-md hover:shadow-lg"
                >
                  Submit Agricultural Data
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Right Side - Other Data */}
      <div className="w-full md:w-1/2 p-4 md:p-6 bg-slate-50 flex flex-col gap-6">
        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
          {/* Seasonal Info Cards */}
          <div className="bg-white shadow-md rounded-xl p-5 hover:shadow-xl transition flex items-center min-h-[100px] min-w-[350px] border border-slate-200">
            <Leaf className="text-emerald-600 mr-4" size={36} />
            <div>
              <h2 className="text-xl font-medium text-slate-800">Sowing Season</h2>
              <p className="text-sm text-slate-600 mt-1">June to July</p>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-xl p-5 hover:shadow-sm transition flex items-center min-h-[100px] min-w-[350px] border border-slate-200">
            <Sprout className="text-emerald-600 mr-4" size={36} />
            <div>
              <h2 className="text-xl font-medium text-slate-800">Harvesting Season</h2>
              <p className="text-sm text-slate-600 mt-1">November to January</p>
            </div>
          </div>
        </div>

        {/* Weather Forecast */}
        <div className="bg-white shadow-md rounded-xl p-6 min-w-[500px] border border-slate-200">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">
            Weekly Weather Forecast
          </h2>
          {loading ? (
            <p className="text-slate-700">Loading weather data...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {weatherData.daily.map((day, index) => (
                <div
                  key={index}
                  className="text-center bg-slate-50 p-4 rounded-lg shadow-sm hover:shadow-md transition border border-slate-200"
                >
                  <p className="text-sm font-semibold text-slate-700">
                    {new Date(day.date).toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </p>
                  <div className="flex justify-center items-center my-2">
                    <Thermometer className="text-sky-600 mr-1" size={20} />
                    <span className="text-slate-800 text-sm">
                      {day.max_temp}°C / {day.min_temp}°C
                    </span>
                  </div>
                  <div className="flex justify-center items-center">
                    <Droplet className="text-sky-600 mr-1" size={20} />
                    <span className="text-slate-800 text-sm">
                      {day.precipitation_probability}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!loading && !error && (
            <p className="text-center text-slate-700 mt-2 text-sm pt-7 pb-0">
              {weatherData.city} - Weekly Forecast
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
          {/* Additional Info Cards */}
          <div className="bg-white shadow-md rounded-xl p-5 hover:shadow-xl transition flex items-center min-h-[100px] min-w-[350px] border border-slate-200">
            <Mountain className="text-emerald-600 mr-4" size={36} />
            <div>
              <h2 className="text-xl font-medium text-slate-800">Soil Type</h2>
              <p className="text-sm text-slate-600 mt-1">Alluvial Soil</p>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-xl p-5 hover:shadow-xl transition flex items-center min-h-[100px] min-w-[350px] border border-slate-200">
            <Cloud className="text-sky-600 mr-4" size={36} />
            <div>
              <h2 className="text-xl font-medium text-slate-800">Underground Water</h2>
              <p className="text-sm text-slate-600 mt-1">Yes</p>
            </div>
          </div>
        </div>

      
      </div>
    </div>
  );
};

export default AgriculturalForm;