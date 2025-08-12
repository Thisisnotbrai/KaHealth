// components/AdminLayout.tsx
import { useState } from "react";
import { Button } from "./Navbar/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Users", href: "/admin/users" },
  { label: "Settings", href: "/admin/settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const pathname = location.pathname;

  const Sidebar = () => (
    <div className="flex flex-col gap-2 p-4 w-56 bg-gray-800 text-gray-200 min-h-screen">
      <h2 className="text-xl font-bold mb-4">Admin</h2>
      {navItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            "px-3 py-2 rounded-lg hover:bg-gray-700 transition",
            pathname === item.href && "bg-gray-700 font-semibold"
          )}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden absolute top-4 left-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="bg-gray-800 text-gray-200">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 bg-gray-800 text-gray-200">
            <Sidebar />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 bg-gray-900 text-gray-100">
        {children}
      </div>
    </div>
  );
}
