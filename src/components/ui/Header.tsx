"use client";

import React, { useEffect, useState } from "react";

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");
  const [healthTip, setHealthTip] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const updateGreeting = () => {
      const hour = currentTime.getHours();
      if (hour < 6) setGreeting("Good Night");
      else if (hour < 12) setGreeting("Good Morning");
      else if (hour < 17) setGreeting("Good Afternoon");
      else if (hour < 21) setGreeting("Good Evening");
      else setGreeting("Good Night");
    };

    const updateHealthTip = () => {
      const tips = [
        "Stay hydrated! Drink 8-10 glasses of water daily",
        "Get 7-9 hours of quality sleep for better health",
        "Wash your hands regularly to prevent illness",
        "Exercise for at least 30 minutes today",
        "Eat 5 servings of fruits and vegetables daily",
        "Take deep breaths - reduce stress naturally",
        "Schedule regular health check-ups",
        "Protect your skin from harmful UV rays",
        "Limit screen time and rest your eyes",
        "Practice good posture for spine health"
      ];
      const dayOfYear = Math.floor((currentTime.getTime() - new Date(currentTime.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
      setHealthTip(tips[dayOfYear % tips.length]);
    };

    updateGreeting();
    updateHealthTip();
  }, [currentTime]);

  const formattedTime = currentTime.toLocaleString("en-PH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
    timeZone: "Asia/Manila",
  });

  const getTimeIcon = () => {
    const hour = currentTime.getHours();
    if (hour >= 6 && hour < 12) return "🌅"; // Morning
    if (hour >= 12 && hour < 17) return "☀️"; // Afternoon
    if (hour >= 17 && hour < 21) return "🌆"; // Evening
    return "🌙"; // Night
  };

  const getWellnessColor = () => {
    const hour = currentTime.getHours();
    if (hour >= 6 && hour < 12) return "from-green-600 via-emerald-700 to-teal-800"; // Morning - fresh green
    if (hour >= 12 && hour < 17) return "from-emerald-700 via-teal-700 to-cyan-800"; // Afternoon - bright
    if (hour >= 17 && hour < 21) return "from-teal-800 via-emerald-800 to-green-900"; // Evening - calmer
    return "from-emerald-900 via-teal-900 to-green-950"; // Night - deep
  };

  return (
    <div className={`relative w-full border-t-4 border-emerald-400 bg-gradient-to-r ${getWellnessColor()} overflow-hidden transition-all duration-1000`}>
      {/* Enhanced subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full translate-x-16 -translate-y-16 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -translate-x-12 translate-y-12 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white rounded-full -translate-x-8 -translate-y-8 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>


      {/* Smart time indicator */}
      <div className="absolute right-4 sm:right-6 top-1/2 transform -translate-y-1/2 hidden sm:flex flex-col items-center gap-1">
        <span className="text-2xl animate-bounce" style={{ animationDuration: '2s' }}>
          {getTimeIcon()}
        </span>
        <div className="text-xs text-emerald-200 font-medium text-center">
          {greeting.split(' ')[1]}
        </div>
      </div>

      {/* Enhanced main content */}
      <div className="relative px-4 sm:px-16 py-6 sm:py-8 text-white text-center">
        {/* Smart greeting with branding */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-8 h-8 bg-emerald-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v12m6-6H6" />
            </svg>
          </div>
          <div className="text-center">
            <div className="text-sm sm:text-base font-semibold text-white">
              {greeting}, Barangay!
            </div>
            <div className="text-xs text-emerald-200">
              Philippine Health Portal
            </div>
          </div>
        </div>

        {/* Enhanced time display */}
        <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white tracking-wide mb-4 bg-black/10 rounded-lg px-4 py-2 backdrop-blur-sm border border-white/10">
          {formattedTime}
        </div>

        {/* Smart daily health tip */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 mb-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-emerald-400/80 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-emerald-200 mb-1">
                  Daily Health Tip
                </div>
                <div className="text-sm text-white leading-relaxed">
                  {healthTip}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Smart weather-aware reminder */}
        <div className="flex items-center justify-center gap-6 text-xs text-emerald-200">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>Stay Protected</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>Community Health First</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;