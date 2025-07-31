"use client";

import React, { useEffect, useState } from "react";

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  return (
<div className="w-full bg-background text-foreground px-4 py-2 flex justify-between items-center shadow-md border-b">
  <div className="text-sm font-mono tracking-tight">
    {currentTime.toLocaleString(undefined, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })}
  </div>
</div>
  );
};

export default Header;
