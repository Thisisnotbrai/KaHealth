import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils"; // shadcn helper for conditional classes
import { Home, Megaphone, Settings, Menu } from "lucide-react";
import { Button } from "./Navbar/button";

const navItems = [
  { label: "Dashboard", href: "/", icon: Home },
  { label: "Announcements", href: "/announcements", icon: Megaphone },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function SideNav() {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "h-screen bg-gray-900 text-gray-100 flex flex-col border-r border-gray-800 transition-all duration-300",
        collapsed ? "w-16" : "w-56"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-800">
        {!collapsed && <span className="font-bold text-lg">Admin</span>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-300 hover:text-white"
        >
          <Menu size={20} />
        </Button>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 overflow-y-auto py-2">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              to={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 mx-2 rounded-md text-sm font-medium transition-colors",
                active
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              )}
            >
              <Icon size={18} />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-800 text-xs text-gray-500">
        {!collapsed && "© 2025 My Admin"}
      </div>
    </div>
  );
}
