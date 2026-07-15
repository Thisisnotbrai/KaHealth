import { Button } from "./Navbar/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Archive,
  Clock,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Megaphone,
  MessageSquare,
  Shield,
} from "lucide-react";
import { supabase } from "@/supabase-client";

const navItems = [
  { label: "Dashboard", href: "/admin/analytics", icon: LayoutDashboard },
  { label: "Announcements", href: "/admin/dashboard", icon: Megaphone },
  { label: "Feedback", href: "/admin/feedback", icon: MessageSquare },
  { label: "Events", href: "/admin/events", icon: Clock },
  { label: "Archives", href: "/admin/archive", icon: Archive },
  { label: "Medicine Inventory", href: "/admin/medicine-inventory", icon: Shield },
  { label: "Medicine Requests", href: "/admin/medicine-requests", icon: Heart },
];

function SidebarContent() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className="flex h-dvh w-72 flex-col overflow-hidden border-r border-emerald-900/20 bg-slate-950 text-slate-100 shadow-2xl shadow-slate-950/40">
      <div className="border-b border-white/10 px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-lg font-semibold text-white">KaHealth Admin</p>
            <p className="text-sm text-emerald-200/80">Community Wellness System</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20"
                    : "text-slate-300 hover:bg-white/8 hover:text-white"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="shrink-0 border-t border-white/10 bg-slate-950 p-4">
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.href = "/admin/login";
          }}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-rose-300 transition-colors hover:bg-rose-500/10 hover:text-rose-200"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 lg:flex lg:items-start">
      <div className="hidden lg:sticky lg:top-0 lg:block lg:self-start">
        <SidebarContent />
      </div>

      <div className="fixed left-4 top-4 z-50 lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="border-emerald-200 bg-white/95 text-emerald-700 shadow-lg shadow-emerald-950/10 backdrop-blur"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 border-0 p-0 bg-transparent">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      <main className="min-w-0 flex-1 bg-gradient-to-br from-emerald-50 via-teal-50/30 to-cyan-50">
        {children}
      </main>
    </div>
  );
}
