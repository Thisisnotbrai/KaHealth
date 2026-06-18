import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabase-client";
import { Input } from "../Input";
import { Button } from "../Navbar/button";
import { Textarea } from "../Textarea";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import {
  LayoutDashboard,
  LogOut,
  Megaphone,
  Pill,
  CalendarDays,
  User,
  Clock,
  Heart,
  Shield,
  TrendingUp,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Send,
  Camera,
  Phone,
  Mail,
  Cake,
  Home,
  FileText,
  Activity,
  X,
  Eye,
} from "lucide-react";
// ─── Types ────────────────────────────────────────────────────────────────────
interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  barangay?: string;
  phone?: string;
  date_of_birth?: string;
  created_at: string;
}
interface Announcement {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
}
interface MedicineRequest {
  id: number;
  user_id: string;
  medicine_name: string;
  quantity: number;
  status: "pending" | "approved" | "denied";
  notes?: string;
  created_at: string;
}
interface CommunityEvent {
  id: number;
  title: string;
  description: string;
  event_date: string;
  location: string;
  created_at: string;
}
type Section = "home" | "announcements" | "medicine" | "events" | "profile";
// ─── Sidebar (Desktop) ───────────────────────────────────────────────────────
function UserSidebar({
  activeSection,
  onNavigate,
  profile,
  collapsed,
  onToggleCollapse,
  onLogout,
}: {
  activeSection: Section;
  onNavigate: (s: Section) => void;
  profile: Profile | null;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onLogout: () => void;
}) {
  const links: { key: Section; label: string; icon: React.ReactNode }[] = [
    { key: "home", label: "Dashboard", icon: <LayoutDashboard size={22} /> },
    { key: "announcements", label: "Announcements", icon: <Megaphone size={22} /> },
    { key: "medicine", label: "Medicine", icon: <Pill size={22} /> },
    { key: "events", label: "Events", icon: <CalendarDays size={22} /> },
    { key: "profile", label: "Profile", icon: <User size={22} /> },
  ];
  return (
    <aside
      className={`hidden lg:flex flex-col fixed left-0 top-0 h-screen z-40 bg-white/95 backdrop-blur-xl border-r border-emerald-100 shadow-xl transition-all duration-300 ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-emerald-100">
        <div className="relative shrink-0">
          <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200/50">
            <Heart className="text-white" size={20} />
          </div>
          <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
        </div>
        {!collapsed && (
          <div className="min-w-0 overflow-hidden">
            <h1 className="text-lg font-bold text-gray-900 truncate">KaHealth</h1>
            <p className="text-xs text-emerald-600 font-medium truncate">Community Wellness</p>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="ml-auto p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors shrink-0"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
      {/* User Mini Card */}
      {!collapsed && profile && (
        <div className="px-5 py-4 border-b border-emerald-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0">
              {profile.full_name
                ? profile.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                : "U"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {profile.full_name || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">{profile.email}</p>
            </div>
          </div>
        </div>
      )}
      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {links.map((link) => (
          <button
            key={link.key}
            onClick={() => onNavigate(link.key)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${
              activeSection === link.key
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-200/50"
                : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
            } ${collapsed ? "justify-center px-3" : ""}`}
            title={collapsed ? link.label : undefined}
          >
            <span className={`shrink-0 transition-transform duration-200 ${activeSection !== link.key ? "group-hover:scale-110" : ""}`}>
              {link.icon}
            </span>
            {!collapsed && <span className="text-sm truncate">{link.label}</span>}
          </button>
        ))}
      </nav>
      {/* Logout */}
      <div className="px-3 py-4 border-t border-emerald-100">
        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 font-medium transition-all duration-200 ${
            collapsed ? "justify-center px-3" : ""
          }`}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut size={22} />
          {!collapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
// ─── Bottom Tab Bar (Mobile) ──────────────────────────────────────────────────
function UserBottomNav({
  activeSection,
  onNavigate,
}: {
  activeSection: Section;
  onNavigate: (s: Section) => void;
}) {
  const tabs: { key: Section; label: string; icon: React.ReactNode }[] = [
    { key: "home", label: "Home", icon: <Home size={22} /> },
    { key: "announcements", label: "News", icon: <Megaphone size={22} /> },
    { key: "medicine", label: "Medicine", icon: <Pill size={22} /> },
    { key: "events", label: "Events", icon: <CalendarDays size={22} /> },
    { key: "profile", label: "Profile", icon: <User size={22} /> },
  ];
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-emerald-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onNavigate(tab.key)}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[60px] ${
              activeSection === tab.key
                ? "text-emerald-600 bg-emerald-50 scale-105"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab.icon}
            <span className="text-[10px] font-semibold tracking-wide">{tab.label}</span>
            {activeSection === tab.key && (
              <div className="w-1 h-1 rounded-full bg-emerald-500 mt-0.5" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: "pending" | "approved" | "denied" }) {
  const config = {
    pending: {
      bg: "bg-amber-50 border-amber-200",
      text: "text-amber-700",
      icon: <AlertCircle size={14} />,
      label: "Pending",
    },
    approved: {
      bg: "bg-emerald-50 border-emerald-200",
      text: "text-emerald-700",
      icon: <CheckCircle2 size={14} />,
      label: "Approved",
    },
    denied: {
      bg: "bg-red-50 border-red-200",
      text: "text-red-700",
      icon: <XCircle size={14} />,
      label: "Denied",
    },
  };
  const c = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${c.bg} ${c.text}`}
    >
      {c.icon}
      {c.label}
    </span>
  );
}
// ─── Dashboard Home ───────────────────────────────────────────────────────────
function DashboardHome({
  profile,
  announcements,
  medicineRequests,
  events,
  onNavigate,
}: {
  profile: Profile | null;
  announcements: Announcement[];
  medicineRequests: MedicineRequest[];
  events: CommunityEvent[];
  onNavigate: (s: Section) => void;
}) {
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
  const pendingRequests = medicineRequests.filter((r) => r.status === "pending").length;
  const upcomingEvents = events.filter((e) => new Date(e.event_date) >= new Date()).length;
  const greeting = (() => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  })();
  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl shadow-xl p-6 sm:p-8">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/3 w-24 h-24 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-emerald-100 text-sm sm:text-base font-medium mb-1">
                {greeting},
              </p>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                {profile?.full_name || "Welcome Back"}
              </h1>
              <p className="text-emerald-100 text-sm sm:text-base">
                Your community health dashboard is up to date.
              </p>
            </div>
            <div className="flex items-center gap-2.5 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 self-start">
              <Clock size={18} className="text-emerald-200" />
              <div>
                <p className="text-[10px] text-emerald-200 font-medium uppercase tracking-wider">
                  Philippine Standard Time
                </p>
                <p className="text-sm sm:text-base text-white font-semibold">{formattedTime}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          {
            icon: <Megaphone size={24} />,
            gradient: "from-emerald-500 to-emerald-600",
            label: "Announcements",
            value: announcements.length,
          },
          {
            icon: <Pill size={24} />,
            gradient: "from-amber-500 to-orange-500",
            label: "Pending Requests",
            value: pendingRequests,
          },
          {
            icon: <CalendarDays size={24} />,
            gradient: "from-teal-500 to-teal-600",
            label: "Upcoming Events",
            value: upcomingEvents,
          },
          {
            icon: <Activity size={24} />,
            gradient: "from-cyan-500 to-cyan-600",
            label: "Total Requests",
            value: medicineRequests.length,
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-white/50 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <div
                className={`p-2.5 sm:p-3 bg-gradient-to-br ${stat.gradient} rounded-xl shadow-lg shrink-0`}
              >
                <span className="text-white">{stat.icon}</span>
              </div>
              <div className="min-w-0">
                <p className="text-[11px] sm:text-xs font-medium text-gray-500 uppercase tracking-wide truncate">
                  {stat.label}
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-0.5">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Two-Column: Recent Announcements + Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Announcements */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg shadow-md">
                <Megaphone className="text-white" size={18} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Recent Announcements</h2>
            </div>
            <button
              onClick={() => onNavigate("announcements")}
              className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
            >
              View All
            </button>
          </div>
          {announcements.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Megaphone className="text-emerald-400" size={24} />
              </div>
              <p className="text-sm text-gray-500">No announcements yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {announcements.slice(0, 3).map((a) => (
                <div
                  key={a.id}
                  className="flex items-start gap-4 p-4 rounded-xl bg-gray-50/80 hover:bg-emerald-50/50 border border-transparent hover:border-emerald-100 transition-all duration-200 group"
                >
                  {a.image_url ? (
                    <img
                      src={a.image_url}
                      alt=""
                      className="w-14 h-14 rounded-xl object-cover shadow-sm shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center shrink-0">
                      <Heart className="text-emerald-400" size={20} />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-emerald-700 transition-colors">
                      {a.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
                      {a.content}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2 text-[11px] text-gray-400">
                      <Clock size={12} />
                      {formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Upcoming Events */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg shadow-md">
                <CalendarDays className="text-white" size={18} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Upcoming Events</h2>
            </div>
            <button
              onClick={() => onNavigate("events")}
              className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
            >
              View All
            </button>
          </div>
          {events.filter((e) => new Date(e.event_date) >= new Date()).length === 0 ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <CalendarDays className="text-teal-400" size={24} />
              </div>
              <p className="text-sm text-gray-500">No upcoming events</p>
            </div>
          ) : (
            <div className="space-y-3">
              {events
                .filter((e) => new Date(e.event_date) >= new Date())
                .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
                .slice(0, 3)
                .map((evt) => {
                  const d = new Date(evt.event_date);
                  return (
                    <div
                      key={evt.id}
                      className="flex items-start gap-4 p-4 rounded-xl bg-gray-50/80 hover:bg-teal-50/50 border border-transparent hover:border-teal-100 transition-all duration-200"
                    >
                      {/* Date Badge */}
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex flex-col items-center justify-center text-white shadow-md shrink-0">
                        <span className="text-[10px] uppercase font-bold leading-none">
                          {d.toLocaleDateString("en-PH", { month: "short" })}
                        </span>
                        <span className="text-xl font-bold leading-tight">{d.getDate()}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">{evt.title}</h3>
                        <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{evt.description}</p>
                        <div className="flex items-center gap-1.5 mt-2 text-[11px] text-gray-400">
                          <MapPin size={12} />
                          <span className="truncate">{evt.location}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
      {/* Medicine Request Summary */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg shadow-md">
              <Pill className="text-white" size={18} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Recent Medicine Requests</h2>
          </div>
          <button
            onClick={() => onNavigate("medicine")}
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
          >
            View All
          </button>
        </div>
        {medicineRequests.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Pill className="text-amber-400" size={24} />
            </div>
            <p className="text-sm text-gray-500">No medicine requests yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Medicine
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Qty
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {medicineRequests.slice(0, 3).map((req) => (
                  <tr
                    key={req.id}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-gray-900">{req.medicine_name}</td>
                    <td className="py-3 px-4 text-gray-600">{req.quantity}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="py-3 px-4 text-gray-500 hidden sm:table-cell">
                      {formatDistanceToNow(new Date(req.created_at), { addSuffix: true })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
// ─── Announcements Feed ───────────────────────────────────────────────────────
function AnnouncementsFeed({ announcements }: { announcements: Announcement[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const perPage = 6;
  const filtered = announcements.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Health Announcements</h2>
          <p className="text-sm text-gray-500 mt-1">
            Stay updated with the latest community health news
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <Input
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/80 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all text-sm"
          />
        </div>
      </div>
      {/* Grid */}
      {paged.length === 0 ? (
        <div className="text-center py-16 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50">
          <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Megaphone className="text-emerald-400" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            {searchQuery ? "No matching announcements" : "No announcements yet"}
          </h3>
          <p className="text-sm text-gray-500">
            {searchQuery
              ? "Try adjusting your search terms"
              : "Health announcements will appear here"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {paged.map((a) => (
            <div
              key={a.id}
              className="bg-white/95 backdrop-blur-sm border-2 border-gray-100 rounded-2xl shadow-lg hover:shadow-xl hover:border-emerald-200 transition-all duration-300 overflow-hidden group"
            >
              {a.image_url ? (
                <img
                  src={a.image_url}
                  alt={a.title}
                  className="w-full h-44 object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-44 bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100 flex items-center justify-center">
                  <Heart className="text-emerald-300 w-12 h-12" />
                </div>
              )}
              <div className="p-5">
                <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 leading-snug">
                  {a.title}
                </h3>
                <p
                  className={`text-gray-600 text-sm leading-relaxed ${
                    expandedId === a.id ? "" : "line-clamp-3"
                  }`}
                >
                  {a.content}
                </p>
                {a.content.length > 150 && (
                  <button
                    onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}
                    className="text-emerald-600 hover:text-emerald-700 text-sm font-semibold mt-2 flex items-center gap-1 transition-colors"
                  >
                    <Eye size={14} />
                    {expandedId === a.id ? "Show Less" : "Read More"}
                  </button>
                )}
                <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-gray-100 text-xs text-gray-400">
                  <Clock size={13} />
                  <span className="font-medium">
                    {formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2.5 rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-emerald-50 hover:border-emerald-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 rounded-xl font-semibold text-sm transition-all duration-200 ${
                page === currentPage
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg"
                  : "bg-white/80 text-gray-600 border-2 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2.5 rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-emerald-50 hover:border-emerald-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
// ─── Medicine Requests ────────────────────────────────────────────────────────
function MedicineRequests({
  requests,
  onSubmitRequest,
}: {
  requests: MedicineRequest[];
  onSubmitRequest: (name: string, qty: number, notes: string) => Promise<void>;
}) {
  const [medicineName, setMedicineName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "denied">(
    "all"
  );
  const filtered = filterStatus === "all" ? requests : requests.filter((r) => r.status === filterStatus);
  async function handleSubmit() {
    if (!medicineName.trim() || !quantity.trim()) {
      return toast.error("Please provide medicine name and quantity.");
    }
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 1) {
      return toast.error("Please enter a valid quantity.");
    }
    setSubmitting(true);
    try {
      await onSubmitRequest(medicineName.trim(), qty, notes.trim());
      setMedicineName("");
      setQuantity("");
      setNotes("");
      setShowForm(false);
      toast.success("Medicine request submitted successfully!");
    } catch {
      toast.error("Error submitting request.");
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Medicine Requests</h2>
          <p className="text-sm text-gray-500 mt-1">
            Request medicine from your barangay health center
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? "Cancel" : "New Request"}
        </Button>
      </div>
      {/* New Request Form */}
      {showForm && (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-100 p-5 sm:p-7 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl shadow-md">
              <Pill className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Submit Medicine Request</h3>
              <p className="text-xs text-gray-500">Fill in the details below</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Medicine Name
              </label>
              <Input
                placeholder="e.g., Paracetamol, Amoxicillin..."
                value={medicineName}
                onChange={(e) => setMedicineName(e.target.value)}
                className="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
              <Input
                type="number"
                min="1"
                placeholder="e.g., 10"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all text-sm"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Notes{" "}
              <span className="text-gray-400 font-normal text-xs">(optional)</span>
            </label>
            <Textarea
              placeholder="Any additional details or instructions..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all min-h-20 text-sm"
            />
          </div>
          <div className="mt-5 flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Submit Request
                </>
              )}
            </Button>
          </div>
        </div>
      )}
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {(["all", "pending", "approved", "denied"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 capitalize ${
              filterStatus === status
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg"
                : "bg-white/80 text-gray-600 border-2 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
            }`}
          >
            {status === "all" ? `All (${requests.length})` : `${status} (${requests.filter((r) => r.status === status).length})`}
          </button>
        ))}
      </div>
      {/* Requests List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50">
          <div className="w-20 h-20 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Pill className="text-amber-400" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No medicine requests</h3>
          <p className="text-sm text-gray-500">
            {filterStatus === "all"
              ? "Submit your first medicine request above"
              : `No ${filterStatus} requests found`}
          </p>
        </div>
      ) : (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
                  <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Medicine
                  </th>
                  <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Qty
                  </th>
                  <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Notes
                  </th>
                  <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Submitted
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((req) => (
                  <tr
                    key={req.id}
                    className="border-b border-gray-50 last:border-0 hover:bg-emerald-50/30 transition-colors"
                  >
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center shrink-0">
                          <Pill className="text-emerald-600" size={16} />
                        </div>
                        <span className="font-semibold text-gray-900">{req.medicine_name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-gray-700 font-medium">{req.quantity}</td>
                    <td className="py-4 px-5">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="py-4 px-5 text-gray-500 hidden md:table-cell max-w-[200px] truncate">
                      {req.notes || "—"}
                    </td>
                    <td className="py-4 px-5 text-gray-500 hidden sm:table-cell text-xs">
                      {formatDistanceToNow(new Date(req.created_at), { addSuffix: true })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
// ─── Events Section ───────────────────────────────────────────────────────────
function EventsSection({ events }: { events: CommunityEvent[] }) {
  const now = new Date();
  const upcoming = events
    .filter((e) => new Date(e.event_date) >= now)
    .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());
  const past = events
    .filter((e) => new Date(e.event_date) < now)
    .sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime());
  function EventCard({ evt, isPast }: { evt: CommunityEvent; isPast?: boolean }) {
    const d = new Date(evt.event_date);
    return (
      <div
        className={`bg-white/95 backdrop-blur-sm border-2 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
          isPast ? "border-gray-200 opacity-75" : "border-gray-100 hover:border-teal-200"
        }`}
      >
        <div className="flex flex-col sm:flex-row">
          {/* Date Side */}
          <div
            className={`sm:w-28 p-4 sm:p-5 flex sm:flex-col items-center justify-center gap-2 sm:gap-1 ${
              isPast
                ? "bg-gradient-to-br from-gray-200 to-gray-300"
                : "bg-gradient-to-br from-teal-500 to-cyan-600"
            }`}
          >
            <span className="text-xs uppercase font-bold text-white/80">
              {d.toLocaleDateString("en-PH", { month: "short" })}
            </span>
            <span className="text-3xl sm:text-4xl font-bold text-white leading-none">
              {d.getDate()}
            </span>
            <span className="text-[11px] text-white/70 font-medium">
              {d.toLocaleDateString("en-PH", { weekday: "short" })}
            </span>
          </div>
          {/* Content */}
          <div className="flex-1 p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5">{evt.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                  {evt.description}
                </p>
              </div>
              {!isPast && (
                <span className="shrink-0 px-3 py-1 bg-emerald-100 text-emerald-700 text-[11px] font-bold rounded-full uppercase tracking-wide">
                  Upcoming
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <MapPin size={14} className="text-teal-500" />
                <span className="font-medium">{evt.location}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Clock size={14} className="text-teal-500" />
                <span className="font-medium">
                  {d.toLocaleTimeString("en-PH", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Community Events</h2>
        <p className="text-sm text-gray-500 mt-1">
          Health programs and wellness activities in your barangay
        </p>
      </div>
      {events.length === 0 ? (
        <div className="text-center py-16 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50">
          <div className="w-20 h-20 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CalendarDays className="text-teal-400" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No events scheduled</h3>
          <p className="text-sm text-gray-500">Check back later for community health events</p>
        </div>
      ) : (
        <>
          {/* Upcoming */}
          {upcoming.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-emerald-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Upcoming Events ({upcoming.length})
              </h3>
              <div className="space-y-4">
                {upcoming.map((evt) => (
                  <EventCard key={evt.id} evt={evt} />
                ))}
              </div>
            </div>
          )}
          {/* Past */}
          {past.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Past Events ({past.length})
              </h3>
              <div className="space-y-4">
                {past.slice(0, 5).map((evt) => (
                  <EventCard key={evt.id} evt={evt} isPast />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
// ─── Profile Section ──────────────────────────────────────────────────────────
function ProfileSection({
  profile,
  onUpdateProfile,
}: {
  profile: Profile | null;
  onUpdateProfile: (updates: Partial<Profile>) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [barangay, setBarangay] = useState(profile?.barangay || "");
  const [dob, setDob] = useState(profile?.date_of_birth || "");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setPhone(profile.phone || "");
      setBarangay(profile.barangay || "");
      setDob(profile.date_of_birth || "");
    }
  }, [profile]);
  async function handleSave() {
    setSaving(true);
    try {
      await onUpdateProfile({
        full_name: fullName,
        phone,
        barangay,
        date_of_birth: dob,
      });
      setEditing(false);
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Error updating profile.");
    } finally {
      setSaving(false);
    }
  }
  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">My Profile</h2>
        <p className="text-sm text-gray-500 mt-1">Manage your personal health information</p>
      </div>
      {/* Profile Card */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
        {/* Cover / Header */}
        <div className="relative h-32 sm:h-40 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE4YzMuMzE0IDAgNiAyLjY4NiA2IDZzLTIuNjg2IDYtNiA2LTYtMi42ODYtNi02IDIuNjg2LTYgNi02eiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          {/* Decorative blobs */}
          <div className="absolute top-4 right-8 w-20 h-20 bg-white/10 rounded-full blur-xl" />
          <div className="absolute bottom-2 left-12 w-16 h-16 bg-white/10 rounded-full blur-lg" />
        </div>
        {/* Avatar + Actions */}
        <div className="relative px-6 sm:px-8 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-12 sm:-mt-14 gap-4">
            <div className="flex items-end gap-4">
              <div className="relative">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Profile"
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-white shadow-xl"
                  />
                ) : (
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-3xl sm:text-4xl border-4 border-white shadow-xl">
                    {initials}
                  </div>
                )}
                <button
                  className="absolute -bottom-1 -right-1 p-2 bg-white rounded-xl shadow-lg border border-gray-200 text-gray-500 hover:text-emerald-600 hover:border-emerald-300 transition-colors"
                  title="Change photo"
                >
                  <Camera size={16} />
                </button>
              </div>
              <div className="mb-1">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {profile?.full_name || "User"}
                </h3>
                <p className="text-sm text-gray-500">{profile?.email}</p>
              </div>
            </div>
            <Button
              onClick={() => (editing ? handleSave() : setEditing(true))}
              disabled={saving}
              className={`flex items-center gap-2 px-5 py-2.5 font-semibold rounded-xl shadow-lg transition-all duration-300 text-sm ${
                editing
                  ? "bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white"
                  : "bg-white border-2 border-gray-200 text-gray-700 hover:border-emerald-300 hover:bg-emerald-50"
              }`}
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : editing ? (
                <>
                  <CheckCircle2 size={16} />
                  Save Changes
                </>
              ) : (
                <>
                  <FileText size={16} />
                  Edit Profile
                </>
              )}
            </Button>
          </div>
        </div>
        {/* Profile Fields */}
        <div className="px-6 sm:px-8 pb-8 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                <User size={14} className="text-emerald-500" />
                Full Name
              </label>
              {editing ? (
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all text-sm"
                />
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-900 font-medium border border-gray-100">
                  {profile?.full_name || "—"}
                </p>
              )}
            </div>
            {/* Email (read-only) */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Mail size={14} className="text-emerald-500" />
                Email Address
              </label>
              <p className="px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-900 font-medium border border-gray-100">
                {profile?.email || "—"}
              </p>
            </div>
            {/* Phone */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Phone size={14} className="text-emerald-500" />
                Phone Number
              </label>
              {editing ? (
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g., +63 912 345 6789"
                  className="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all text-sm"
                />
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-900 font-medium border border-gray-100">
                  {profile?.phone || "—"}
                </p>
              )}
            </div>
            {/* Barangay */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Home size={14} className="text-emerald-500" />
                Barangay
              </label>
              {editing ? (
                <Input
                  value={barangay}
                  onChange={(e) => setBarangay(e.target.value)}
                  placeholder="e.g., Barangay San Antonio"
                  className="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all text-sm"
                />
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-900 font-medium border border-gray-100">
                  {profile?.barangay || "—"}
                </p>
              )}
            </div>
            {/* Date of Birth */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Cake size={14} className="text-emerald-500" />
                Date of Birth
              </label>
              {editing ? (
                <Input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all text-sm"
                />
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-900 font-medium border border-gray-100">
                  {profile?.date_of_birth
                    ? new Date(profile.date_of_birth).toLocaleDateString("en-PH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "—"}
                </p>
              )}
            </div>
            {/* Member Since (read-only) */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Shield size={14} className="text-emerald-500" />
                Member Since
              </label>
              <p className="px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-900 font-medium border border-gray-100">
                {profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString("en-PH", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "—"}
              </p>
            </div>
          </div>
          {editing && (
            <div className="mt-6 pt-5 border-t border-gray-100 flex justify-end gap-3">
              <Button
                onClick={() => {
                  setEditing(false);
                  setFullName(profile?.full_name || "");
                  setPhone(profile?.phone || "");
                  setBarangay(profile?.barangay || "");
                  setDob(profile?.date_of_birth || "");
                }}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-200 rounded-xl font-semibold transition-all text-sm"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 text-sm"
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
// ─── Main: UserDashboard ──────────────────────────────────────────────────────
export default function UserDashboard() {
  const navigate = useNavigate();
  // Auth & Data State
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [medicineRequests, setMedicineRequests] = useState<MedicineRequest[]>([]);
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [loadingAuth, setLoadingAuth] = useState(true);
  // Navigation State
  const [activeSection, setActiveSection] = useState<Section>("home");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // ── Auth Guard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    async function checkAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      setUserId(session.user.id);
      setLoadingAuth(false);
    }
    checkAuth();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/login");
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);
  // ── Data Fetching ───────────────────────────────────────────────────────────
  const fetchProfile = useCallback(async () => {
    if (!userId) return;
    const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
    if (data) setProfile(data);
  }, [userId]);
  const fetchAnnouncements = useCallback(async () => {
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setAnnouncements(data);
  }, []);
  const fetchMedicineRequests = useCallback(async () => {
    if (!userId) return;
    const { data } = await supabase
      .from("medicine_requests")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (data) setMedicineRequests(data);
  }, [userId]);
  const fetchEvents = useCallback(async () => {
    const { data } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });
    if (data) setEvents(data);
  }, []);
  useEffect(() => {
    if (!userId) return;
    fetchProfile();
    fetchAnnouncements();
    fetchMedicineRequests();
    fetchEvents();
  }, [userId, fetchProfile, fetchAnnouncements, fetchMedicineRequests, fetchEvents]);
  // ── Handlers ────────────────────────────────────────────────────────────────
  async function handleSubmitMedicineRequest(name: string, qty: number, notes: string) {
    if (!userId) return;
    const { error } = await supabase.from("medicine_requests").insert([
      {
        user_id: userId,
        medicine_name: name,
        quantity: qty,
        notes: notes || null,
        status: "pending",
      },
    ]);
    if (error) throw error;
    fetchMedicineRequests();
  }
  async function handleUpdateProfile(updates: Partial<Profile>) {
    if (!userId) return;
    const { error } = await supabase.from("profiles").update(updates).eq("id", userId);
    if (error) throw error;
    fetchProfile();
  }
  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }
  // ── Loading State ───────────────────────────────────────────────────────────
  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50/30 to-cyan-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-xl shadow-emerald-200/50 animate-pulse">
              <Heart className="text-white" size={28} />
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium">Loading your dashboard...</span>
          </div>
        </div>
      </div>
    );
  }
  // ── Render Active Section ───────────────────────────────────────────────────
  function renderSection() {
    switch (activeSection) {
      case "home":
        return (
          <DashboardHome
            profile={profile}
            announcements={announcements}
            medicineRequests={medicineRequests}
            events={events}
            onNavigate={setActiveSection}
          />
        );
      case "announcements":
        return <AnnouncementsFeed announcements={announcements} />;
      case "medicine":
        return (
          <MedicineRequests
            requests={medicineRequests}
            onSubmitRequest={handleSubmitMedicineRequest}
          />
        );
      case "events":
        return <EventsSection events={events} />;
      case "profile":
        return <ProfileSection profile={profile} onUpdateProfile={handleUpdateProfile} />;
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50/30 to-cyan-50">
      {/* Desktop Sidebar */}
      <UserSidebar
        activeSection={activeSection}
        onNavigate={setActiveSection}
        profile={profile}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onLogout={handleLogout}
      />
      {/* Mobile Bottom Nav */}
      <UserBottomNav activeSection={activeSection} onNavigate={setActiveSection} />
      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${
          sidebarCollapsed ? "lg:ml-20" : "lg:ml-72"
        } pb-24 lg:pb-8`}
      >
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-emerald-100 shadow-sm px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
              <Heart className="text-white" size={16} />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900">KaHealth</h1>
              <p className="text-[10px] text-emerald-600 font-medium">Community Wellness</p>
            </div>
            <div className="ml-auto">
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
        {/* Content Area */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">{renderSection()}</div>
      </main>
    </div>
  );
}
