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
      {/* Very subtle background - barely visible */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -translate-x-12 translate-y-12"></div>
      </div>

      {/* Simple health cross icon */}
      <div className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 hidden sm:block">
        <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v12m6-6H6" />
          </svg>
        </div>
      </div>

      {/* Simple status indicator */}
      <div className="absolute right-4 sm:right-6 top-1/2 transform -translate-y-1/2 hidden sm:flex items-center gap-2">
        <div className="w-2 h-2 bg-emerald-300 rounded-full"></div>
        <span className="text-xs text-emerald-200 font-medium">ONLINE</span>
      </div>

      {/* Main Content - cleaner and simpler */}
      <div className="relative px-4 sm:px-16 py-4 sm:py-6 text-white text-center">
        {/* Clean branding */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 bg-emerald-400 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <span className="text-sm sm:text-base font-semibold text-white">
            Philippine Health System
          </span>
        </div>

        {/* Simple time zone label */}
        <div className="text-xs sm:text-sm text-emerald-200 mb-2 tracking-wide font-medium">
          Philippine Standard Time
        </div>

        {/* Clean time display */}
        <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white tracking-wide mb-3">
          {formattedTime}
        </div>

        {/* Minimal status indicators */}
        <div className="flex items-center justify-center gap-4 text-xs text-emerald-200">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
            <span>System Active</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>All Services Online</span>
          </div>
        </div>
      </div>

      {/* Simple bottom line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 opacity-60"></div>
    </div>
  );
};

export default Header;