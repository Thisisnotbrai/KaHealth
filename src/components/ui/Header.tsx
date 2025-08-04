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
    <div className="w-full border-t-[6px] border-lime-400 bg-gradient-to-r from-green-900 to-green-700 py-2 text-white text-center">
      <div className="text-sm">Philippine Standard Time</div>
      <div className="text-base font-semibold">{formattedTime}</div>
    </div>
  );
};

export default Header;
