"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/supabase-client";
import { Button } from "../Navbar/button";
import { Link, useLocation } from "react-router-dom";
import { 
  Trash2, 
  CalendarDays, 
  MessageSquare, 
  Megaphone,
  Archive,
  Clock,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  MapPin,
  Mail,
  User,
  FileText,
  Eye
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";

type ArchiveItem = {
  [x: string]: string;
  id: string;
  data: any;
  created_at: string;
  type: string;
};

// Admin Navbar Component
function AdminNavbar() {
  const location = useLocation();
  const pathname = location.pathname;
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: "/admin/analytics", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { to: "/admin/dashboard", label: "Announcement", icon: <Megaphone size={20} /> },
    { to: "/admin/feedback", label: "User Feedback", icon: <MessageSquare size={20} /> },
    { to: "/admin/events", label: "Events", icon: <Clock size={20} /> },
    { to: "/admin/archive", label: "Archives", icon: <Archive size={20} /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="text-white" size={18} />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">KaHealth Admin</h1>
              <p className="text-xs sm:text-sm text-emerald-600">Community Information System</p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-base font-bold text-gray-900">Health Admin</h1>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 px-3 xl:px-4 py-2.5 rounded-xl font-medium transition-all duration-200 hover:scale-105 text-sm xl:text-base ${
                  pathname === link.to
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-200"
                    : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
                }`}
              >
                {link.icon}
                <span className="hidden xl:inline font-medium">{link.label}</span>
              </Link>
            ))}
            <div className="ml-4 pl-4 border-l border-gray-200">
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.href = "/admin/login";
                }}
                className="flex items-center gap-2 px-3 xl:px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 font-medium text-sm xl:text-base"
              >
                <LogOut size={20} />
                <span className="hidden xl:inline">Logout</span>
              </button>
            </div>
          </nav>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 sm:p-3 rounded-xl text-gray-600 hover:bg-emerald-50 transition-colors"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {menuOpen && (
          <div className="lg:hidden mt-4 py-4 border-t border-emerald-100">
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm sm:text-base ${
                    pathname === link.to
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg"
                      : "text-gray-600 hover:bg-emerald-50"
                  }`}
                >
                  {link.icon}
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}
              <div className="pt-2 mt-2 border-t border-emerald-100">
                <button
                  onClick={async () => {
                    await supabase.auth.signOut();
                    window.location.href = "/admin/login";
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 font-medium text-sm sm:text-base"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default function ArchivePage() {
  const [archives, setArchives] = useState<ArchiveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("all");
  
  const archivesPerPage = 6;
  const indexOfLast = currentPage * archivesPerPage;
  const indexOfFirst = indexOfLast - archivesPerPage;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchArchives = async () => {
    setLoading(true);
    const tables = [
      "archive_events",
      "archive_feedback",
      "archive_announcements",
    ];

    const results = await Promise.all(
      tables.map(async (table) => {
        const { data, error } = await supabase.from(table).select("*");
        if (error) {
          console.error(error);
          return [];
        }
        return (
          data?.map((item) => ({
            ...item,
            type: table,
          })) || []
        );
      })
    );

    setArchives(results.flat());
    setLoading(false);
  };

  useEffect(() => {
    fetchArchives();
  }, []);

  const deleteArchive = async (id: string, table: string) => {
    if (!confirm("Are you sure you want to permanently delete this archived item?")) return;

    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Archived item deleted permanently.");
      setArchives((prev) => prev.filter((item) => item.id !== id));
    }
  };

  //Auto-Delete in 30 days (to make it in seconds just change date to seconds)
  const autoDeleteOldArchives = async () => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30);

    const tables = [
      "archive_events",
      "archive_feedback",
      "archive_announcements",
    ];

    for (const table of tables) {
      const { error } = await supabase
        .from(table)
        .delete()
        .lt("created_at", cutoffDate.toISOString());
      if (error) console.error(`Error cleaning ${table}:`, error);
    }
  };

  useEffect(() => {
    autoDeleteOldArchives();
  }, []);
const daysUntilDeletion = (createdAt: string) => {
  const createdDate = new Date(createdAt);
  const now = new Date();
  const diffInMs = now.getTime() - createdDate.getTime();
  const daysElapsed = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const daysLeft = 30 - daysElapsed;
  return daysLeft > 0 ? daysLeft : 0;
};
  const typeBadge = (type: string) => {
    switch (type) {
      case "archive_events":
        return (
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
            <CalendarDays size={14} /> Event
          </span>
        );
      case "archive_feedback":
        return (
          <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
            <MessageSquare size={14} /> Feedback
          </span>
        );
      case "archive_announcements":
        return (
          <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
            <Megaphone size={14} /> Announcement
          </span>
        );
      default:
        return null;
    }
  };

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

  const filteredArchives = archives.filter(item => {
    if (selectedFilter === "all") return true;
    return item.type === selectedFilter;
  });

  const currentArchives = filteredArchives.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.max(1, Math.ceil(filteredArchives.length / archivesPerPage));

  const totalArchives = archives.length;
  const eventsCount = archives.filter(a => a.type === "archive_events").length;
  const feedbackCount = archives.filter(a => a.type === "archive_feedback").length;
  const announcementsCount = archives.filter(a => a.type === "archive_announcements").length;

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-emerald-50 via-teal-50/30 to-cyan-50 min-h-screen">
        <AdminNavbar />
        <div className="p-8 text-center text-gray-500 animate-pulse flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mb-4">
            <Archive className="text-emerald-400 w-8 h-8 animate-bounce" />
          </div>
          <p className="text-lg font-semibold">Loading archives...</p>
        </div>
      </div>
    );
  }

const handleUnarchive = async (item: ArchiveItem) => {
  let targetTable = "";
  let newRecord: any = {};

  if (item.type === "archive_events") {
    targetTable = "events";
    newRecord = {
      title: item.title ?? item.data?.title,
      description: item.description ?? item.data?.description,
      date: item.date ?? item.data?.date,
      time: item.time ?? item.data?.time,
      location: item.location ?? item.data?.location,
      created_at: item.created_at,
      is_archived: false,
    };
  } 
  else if (item.type === "archive_announcements") {
    targetTable = "announcements";
    newRecord = {
      title: item.title ?? item.data?.title,
      content: item.content ?? item.data?.content,
      created_at: item.created_at,
      image_url: item.data?.image_url ?? null,
      is_archived: false,
    };
  } 
  else if (item.type === "archive_feedback") {
    targetTable = "feedback";
    newRecord = {
      message: item.message ?? item.data?.message,
      created_at: item.created_at,
      is_archived: false,
    };
  } 
  else {
    toast.error("Unknown archive type.");
    return;
  }

  // Remove undefined values to avoid insert issues
  Object.keys(newRecord).forEach((k) => newRecord[k] === undefined && delete newRecord[k]);

  const { error: insertError } = await supabase.from(targetTable).insert([newRecord]);
  if (insertError) {
    console.error("Unarchive insert error:", insertError);
    toast.error(`Failed to unarchive: ${insertError.message}`);
    return;
  }

  // Delete from archive table
  const { error: deleteError } = await supabase
    .from(item.type)
    .delete()
    .eq("id", item.id);

  if (deleteError) {
    console.error("Unarchive delete error:", deleteError);
    toast.error(`Failed to remove from archive: ${deleteError.message}`);
    return;
  }

  setArchives((prev) => prev.filter((a) => a.id !== item.id));
  toast.success("Item successfully unarchived!");
};

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-teal-50/30 to-cyan-50 min-h-screen">
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Clock size={18} className="text-white" />
              </div>
              <div>
                <span className="font-semibold text-base sm:text-lg">Philippine Standard Time</span>
                <div className="text-emerald-100 text-xs sm:text-sm">Archive Management</div>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-lg sm:text-xl font-bold">{formattedTime}</div>
            </div>
          </div>
        </div>
      </div>

      <AdminNavbar />

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 lg:mb-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                <Archive className="text-white" size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide truncate">Total Archives</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{totalArchives}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <CalendarDays className="text-white" size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide truncate">Archived Events</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{eventsCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
                <MessageSquare className="text-white" size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide truncate">Archived Feedback</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{feedbackCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg">
                <Megaphone className="text-white" size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide truncate">Archived Announcements</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{announcementsCount}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Archive Management</h2>
              <p className="text-sm sm:text-base text-gray-600 mt-1">View and manage archived items from your system</p>
            </div>
            
            <div className="flex items-center gap-2 bg-emerald-50 p-1 rounded-xl flex-wrap">
              {[
                { value: "all", label: "All", icon: <Archive size={16} /> },
                { value: "archive_events", label: "Events", icon: <CalendarDays size={16} /> },
                { value: "archive_feedback", label: "Feedback", icon: <MessageSquare size={16} /> },
                { value: "archive_announcements", label: "Announcements", icon: <Megaphone size={16} /> },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => {
                    setSelectedFilter(filter.value);
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm ${
                    selectedFilter === filter.value
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-emerald-100"
                  }`}
                >
                  {filter.icon}
                  <span className="hidden sm:inline">{filter.label}</span>
                </button>
              ))}
            </div>
          </div>

          {archives.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Archive className="text-emerald-400 w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No archived items</h3>
              <p className="text-sm sm:text-base text-gray-500">Archived items will appear here</p>
            </div>
          ) : filteredArchives.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Eye className="text-gray-400 w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No items found</h3>
              <p className="text-sm sm:text-base text-gray-500">Try changing the filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {currentArchives.map((item) => {
                const archiveDate = new Date(item.created_at);
                
                return (
                  <div
                    key={item.id}
                    className="relative bg-white/90 backdrop-blur-sm border-2 border-gray-200 hover:border-gray-300 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                  >
                    <div className="absolute top-4 right-4">
                      {typeBadge(item.type)}
                    </div>
                    
                    <div className="p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-2xl">
                      <div className="pr-20">
                        <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1 line-clamp-2 leading-tight">
                          {item.type === "archive_events" && (item.data.title || "Untitled Event")}
                          {item.type === "archive_feedback" && `Feedback from ${item.data.name || "Anonymous"}`}
                          {item.type === "archive_announcements" && (item.title || "Untitled Announcement")}
                        </h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock size={12} />
                          Archived {formatDistanceToNow(archiveDate, { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-4 sm:p-6 space-y-3">
                      {item.type === "archive_events" && (
                        <>
                          {item.data.date && (
                            <div className="flex items-start gap-3 text-sm">
                              <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                                <CalendarDays size={16} className="text-blue-600" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-gray-900">
                                  {new Date(item.data.date).toLocaleDateString('en-PH', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                  {item.data.time && ` at ${new Date(`2000-01-01T${item.data.time}`).toLocaleTimeString('en-PH', {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true
                                  })}`}
                                </p>
                                <p className="text-xs text-gray-500">Event date & time</p>
                              </div>
                            </div>
                          )}
                          
                          {item.data.location && (
                            <div className="flex items-start gap-3 text-sm">
                              <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                                <MapPin size={16} className="text-blue-600" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-gray-900 line-clamp-2">{item.data.location}</p>
                                <p className="text-xs text-gray-500">Location</p>
                              </div>
                            </div>
                          )}
                          
                          {item.data.description && (
                            <div className="flex items-start gap-3 text-sm">
                              <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                                <FileText size={16} className="text-blue-600" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-gray-700 line-clamp-3">{item.data.description}</p>
                                <p className="text-xs text-gray-500 mt-1">Description</p>
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {item.type === "archive_feedback" && (
                        <>
                          <div className="flex items-start gap-3 text-sm">
                            <div className="p-2 bg-emerald-100 rounded-lg flex-shrink-0">
                              <User size={16} className="text-emerald-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-gray-900">{item.data.name || "Anonymous"}</p>
                              <p className="text-xs text-gray-500">Name</p>
                            </div>
                          </div>
                          
                          {item.data.email && (
                            <div className="flex items-start gap-3 text-sm">
                              <div className="p-2 bg-emerald-100 rounded-lg flex-shrink-0">
                                <Mail size={16} className="text-emerald-600" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-gray-900 break-all">{item.data.email}</p>
                                <p className="text-xs text-gray-500">Email</p>
                              </div>
                            </div>
                          )}
                          
                          {item.data.message && (
                            <div className="flex items-start gap-3 text-sm">
                              <div className="p-2 bg-emerald-100 rounded-lg flex-shrink-0">
                                <MessageSquare size={16} className="text-emerald-600" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-gray-700 line-clamp-4">{item.data.message}</p>
                                <p className="text-xs text-gray-500 mt-1">Message</p>
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {item.type === "archive_announcements" && (
                        <>
                          {item.date && (
                            <div className="flex items-start gap-3 text-sm">
                              <div className="p-2 bg-amber-100 rounded-lg flex-shrink-0">
                                <CalendarDays size={16} className="text-amber-600" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-gray-900">
                                  {new Date(item.data.date).toLocaleDateString('en-PH', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </p>
                                <p className="text-xs text-gray-500">Announcement date</p>
                              </div>
                            </div>
                          )}
                          
                          {(item.content || item.description) && (
                            <div className="flex items-start gap-3 text-sm">
                              <div className="p-2 bg-amber-100 rounded-lg flex-shrink-0">
                                <FileText size={16} className="text-amber-600" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-gray-700 line-clamp-4">{item.content || item.description}</p>
                                <p className="text-xs text-gray-500 mt-1">Content</p>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    
                    
                      <div className="p-4 sm:p-6 pt-0">
                      <p className="text-xs text-gray-500 text-center mb-2">
                        🕒 Will be permanently deleted in{" "}
                        <span
                          className={`font-semibold ${
                            daysUntilDeletion(item.created_at) <= 10
                              ? "text-red-600"
                              : daysUntilDeletion(item.created_at) <= 20
                              ? "text-orange-500"
                              : "text-green-600"
                          }`}
                        >
                          {daysUntilDeletion(item.created_at)}
                        </span>{" "}
                        days
                      </p>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleUnarchive(item)}
                          className="w-1/2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                        >
                          <Archive size={16} />
                          Unarchive
                        </Button>

                        <Button
                          onClick={() => deleteArchive(item.id, item.type)}
                          className="w-1/2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                        >
                          <Trash2 size={16} />
                          Delete Permanently
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
              <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl font-semibold transition-all duration-300 flex-shrink-0 text-sm sm:text-base ${
                      page === currentPage
                        ? "bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg hover:shadow-xl"
                        : "bg-white/80 text-gray-700 border-2 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
                    }`}
                  >
                    {page}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl shadow-lg border border-blue-200 p-4 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-500 rounded-xl shadow-lg flex-shrink-0">
              <Archive className="text-white" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Archive Information</h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                Archived items are automatically deleted after 30 days to maintain system performance. 
                You can manually delete items at any time by clicking the "Delete Permanently" button on each card.
              </p>
              <div className="flex items-center gap-2 text-xs text-blue-700 bg-blue-100 rounded-lg px-3 py-2 inline-flex">
                <Clock size={14} />
                <span className="font-medium">Auto-cleanup runs automatically every session</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}