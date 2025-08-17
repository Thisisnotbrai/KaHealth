"use client";

import React, { useEffect, useState } from "react";

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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

  return (
    <div className="relative w-full border-t-4 border-emerald-400 bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16 animate-pulse"></div>
        <div className="absolute top-4 right-8 w-24 h-24 bg-white rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-0 left-1/4 w-20 h-20 bg-white rounded-full translate-y-10 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Health Cross Icon */}
      <div className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 hidden sm:block">
        <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white border-opacity-30">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v12m6-6H6" />
          </svg>
        </div>
      </div>

      {/* Pulse Animation for Active Status */}
      <div className="absolute right-4 sm:right-6 top-1/2 transform -translate-y-1/2 hidden sm:flex items-center gap-2">
        <div className="relative">
          <div className="w-3 h-3 bg-emerald-400 rounded-full animate-ping absolute"></div>
          <div className="w-3 h-3 bg-emerald-300 rounded-full relative"></div>
        </div>
        <span className="text-xs text-emerald-200 font-medium">LIVE</span>
      </div>

      {/* Main Content */}
      <div className="relative px-4 sm:px-16 py-4 sm:py-6 text-white text-center">
        {/* Health System Branding */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <span className="text-sm sm:text-base font-semibold text-emerald-200">
            Philippine Health System
          </span>
        </div>

        {/* Time Zone Label */}
        <div className="text-xs sm:text-sm text-emerald-200 mb-1 tracking-wide uppercase font-medium">
          Philippine Standard Time
        </div>

        {/* Main Time Display */}
        <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white tracking-wide drop-shadow-lg">
          {formattedTime}
        </div>

        {/* Health Status Indicator */}
        <div className="mt-3 flex items-center justify-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-emerald-200">System Active</span>
          </div>
          <div className="w-1 h-1 bg-emerald-300 rounded-full opacity-50"></div>
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs text-emerald-200">All Services Online</span>
          </div>
        </div>
      </div>

      {/* Bottom Accent Line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>
    </div>
  );
};

export default Header;