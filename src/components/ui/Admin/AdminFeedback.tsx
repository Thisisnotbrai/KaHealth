import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/supabase-client";
import { Button } from "../Navbar/button";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Calendar,
  Clock,
  Heart,
  MessageCircle,
  Search,
  TrendingUp,
  Eye,
  MessageSquare,
  ThumbsUp,
  BarChart3,
  Activity,
  Filter,
  Archive,
  Trash2,
  RotateCcw,
} from "lucide-react";

// Admin Navbar Component (reused from AdminEvents)
function AdminNavbar() {
  const location = useLocation();
  const pathname = location.pathname;
  const [menuOpen, setMenuOpen] = useState(false);

    const navLinks = [
    { to: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { to: "/admin/feedback", label: "User Feedback", icon: <MessageCircle size={20} /> },
    { to: "/admin/events", label: "Events", icon: <Clock size={20} /> },
    { to: "/admin/archive", label: "Archives", icon: <Archive size={20} /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
        <div className="flex items-center justify-between">
          {/* Enhanced Logo / Title */}
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="text-white" size={18} />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">KaHealth Admin</h1>
              <p className="text-xs sm:text-sm text-emerald-600">Community Wellness System</p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-base font-bold text-gray-900">Health Admin</h1>
            </div>
          </div>

          {/* Enhanced Desktop Menu */}
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

          {/* Enhanced Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 sm:p-3 rounded-xl text-gray-600 hover:bg-emerald-50 transition-colors"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Enhanced Mobile Menu */}
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

interface Feedback {
  id: string;
  message: string;
  created_at: string;
  is_archived?: boolean;
}

export default function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("all");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [viewArchived, setViewArchived] = useState(false);

  const feedbacksPerPage = 6; // Changed to match AdminEvents
  
  // Timer effect for live clock (matching AdminEvents)
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchFeedback = async () => {
      const { data, error } = await supabase
        .from("feedback")
        .select("*")
        .eq("is_archived", viewArchived)
        .order("created_at", { ascending: false });
      if (!error && data) setFeedbacks(data);
    };
    fetchFeedback();
  }, [viewArchived]);

  // Filter feedbacks based on search and time filter
  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch = feedback.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedTimeFilter === "all") return matchesSearch;
    
    const feedbackDate = new Date(feedback.created_at);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - feedbackDate.getTime()) / (1000 * 60 * 60 * 24));
    
    switch (selectedTimeFilter) {
      case "today": return daysDiff === 0 && matchesSearch;
      case "week": return daysDiff <= 7 && matchesSearch;
      case "month": return daysDiff <= 30 && matchesSearch;
      default: return matchesSearch;
    }
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredFeedbacks.length / feedbacksPerPage));
  const indexOfLast = currentPage * feedbacksPerPage;
  const indexOfFirst = indexOfLast - feedbacksPerPage;
  const currentFeedbacks = filteredFeedbacks.slice(indexOfFirst, indexOfLast);

  // Stats calculations
  const todayFeedbacks = feedbacks.filter(fb => {
    const feedbackDate = new Date(fb.created_at);
    const today = new Date();
    return feedbackDate.toDateString() === today.toDateString();
  });

  const thisWeekFeedbacks = feedbacks.filter(fb => {
    const feedbackDate = new Date(fb.created_at);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - feedbackDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff <= 7;
  });

  const thisMonthFeedbacks = feedbacks.filter(fb => {
    const feedbackDate = new Date(fb.created_at);
    const now = new Date();
    return feedbackDate.getMonth() === now.getMonth() && feedbackDate.getFullYear() === now.getFullYear();
  });

  const avgFeedbackLength = feedbacks.length > 0 
    ? Math.round(feedbacks.reduce((sum, fb) => sum + fb.message.length, 0) / feedbacks.length)
    : 0;

  // Archive/Restore/Delete functions
  const handleArchiveFeedback = async (id: string) => {
    const { error } = await supabase
      .from("feedback")
      .update({ is_archived: true })
      .eq("id", id);

    if (error) {
      toast.error("Failed to archive feedback");
    } else {
      toast.success("Feedback archived successfully");
      const fetchFeedback = async () => {
        const { data, error } = await supabase
          .from("feedback")
          .select("*")
          .eq("is_archived", viewArchived)
          .order("created_at", { ascending: false });
        if (!error && data) setFeedbacks(data);
      };
      fetchFeedback();
    }
  };

  const handleRestoreFeedback = async (id: string) => {
    const { error } = await supabase
      .from("feedback")
      .update({ is_archived: false })
      .eq("id", id);

    if (error) {
      toast.error("Failed to restore feedback");
    } else {
      toast.success("Feedback restored successfully");
      const fetchFeedback = async () => {
        const { data, error } = await supabase
          .from("feedback")
          .select("*")
          .eq("is_archived", viewArchived)
          .order("created_at", { ascending: false });
        if (!error && data) setFeedbacks(data);
      };
      fetchFeedback();
    }
  };

  const handleDeleteFeedback = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this feedback? This action cannot be undone.")) return;
    
    const { error } = await supabase.from("feedback").delete().eq("id", id);
    
    if (error) {
      toast.error("Failed to delete feedback");
    } else {
      toast.success("Feedback deleted permanently");
      const fetchFeedback = async () => {
        const { data, error } = await supabase
          .from("feedback")
          .select("*")
          .eq("is_archived", viewArchived)
          .order("created_at", { ascending: false });
        if (!error && data) setFeedbacks(data);
      };
      fetchFeedback();
    }
  };

  // Philippine Standard Time formatting (matching AdminEvents)
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
    <div className="bg-gradient-to-br from-emerald-50 via-teal-50/30 to-cyan-50 min-h-screen">
      {/* Enhanced Philippine Standard Time top bar (matching AdminEvents) */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Clock size={18} className="text-white" />
              </div>
              <div>
                <span className="font-semibold text-base sm:text-lg">Philippine Standard Time</span>
                <div className="text-emerald-100 text-xs sm:text-sm">Community Feedback Management</div>
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
        {/* Enhanced Stats Cards (matching AdminEvents layout) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 lg:mb-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
                <MessageSquare className="text-white" size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide truncate">
                  {viewArchived ? "Archived Feedback" : "Total Feedback"}
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{feedbacks.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg">
                <Activity className="text-white" size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide truncate">This Week</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{thisWeekFeedbacks.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl shadow-lg">
                <TrendingUp className="text-white" size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide truncate">Today</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{todayFeedbacks.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                <BarChart3 className="text-white" size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide truncate">This Month</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{thisMonthFeedbacks.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Filters Section (matching AdminEvents style) */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-3 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl shadow-lg">
                <Filter className="text-white w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {viewArchived ? "Archived Feedback" : "Community Health Feedback"}
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  {viewArchived 
                    ? "Review and manage archived feedback messages" 
                    : "Monitor and analyze community wellness concerns"
                  }
                </p>
              </div>
            </div>
            
            {/* Archive Toggle Button */}
            <div className="flex items-center gap-2">
              <Button
                onClick={() => {
                  setViewArchived(!viewArchived);
                  setCurrentPage(1);
                  setSearchQuery("");
                  setSelectedTimeFilter("all");
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 text-sm ${
                  viewArchived 
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg"
                    : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg"
                }`}
              >
                {viewArchived ? (
                  <>
                    <MessageCircle size={16} />
                    View Active
                  </>
                ) : (
                  <>
                    <Archive size={16} />
                    View Archived
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            {/* Search Bar */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search Feedback Messages</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Search feedback content..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all text-base text-gray-900 placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Time Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Time</label>
              <div className="flex items-center gap-2 bg-emerald-50 p-1 rounded-xl">
                {[
                  { value: "all", label: "All", icon: <Calendar size={16} /> },
                  { value: "today", label: "Today", icon: <Clock size={16} /> },
                  { value: "week", label: "Week", icon: <Activity size={16} /> },
                  { value: "month", label: "Month", icon: <TrendingUp size={16} /> },
                ].map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => {
                      setSelectedTimeFilter(filter.value);
                      setCurrentPage(1);
                    }}
                    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm ${
                      selectedTimeFilter === filter.value
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
          </div>

          {/* Results Summary */}
          <div className="mt-4 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-xl p-3">
            <div className="flex items-center gap-2 text-blue-700">
              <Eye size={16} />
              <span className="text-sm font-medium">
                Showing {filteredFeedbacks.length} of {feedbacks.length} feedback{filteredFeedbacks.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="text-xs text-blue-600">
              Average length: {avgFeedbackLength} characters
            </div>
          </div>
        </div>

        {/* Enhanced Feedback Management Section (matching AdminEvents structure) */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Feedback Management</h2>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                {selectedTimeFilter === "all" ? "All community feedback messages" :
                 selectedTimeFilter === "today" ? "Today's feedback messages" :
                 selectedTimeFilter === "week" ? "This week's feedback messages" :
                 "This month's feedback messages"}
              </p>
            </div>
          </div>

          {/* Enhanced Feedback List */}
          {feedbacks.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                {viewArchived ? (
                  <Archive className="text-emerald-400 w-8 h-8 sm:w-10 sm:h-10" />
                ) : (
                  <MessageCircle className="text-emerald-400 w-8 h-8 sm:w-10 sm:h-10" />
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
                {viewArchived ? "No archived feedback" : "No feedback received yet"}
              </h3>
              <p className="text-sm sm:text-base text-gray-500">
                {viewArchived 
                  ? "Archived feedback messages will appear here"
                  : "Community feedback will appear here when submitted"
                }
              </p>
            </div>
          ) : filteredFeedbacks.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="text-gray-400 w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No feedback found</h3>
              <p className="text-sm sm:text-base text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {currentFeedbacks.map((fb) => {
                const feedbackDate = new Date(fb.created_at);
                const isToday = feedbackDate.toDateString() === new Date().toDateString();
                const isRecent = (new Date().getTime() - feedbackDate.getTime()) < (24 * 60 * 60 * 1000);
                
                return (
                  <div
                    key={fb.id}
                    className={`relative bg-white/90 backdrop-blur-sm border-2 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
                      isToday ? "border-emerald-200 hover:border-emerald-300" :
                      isRecent ? "border-teal-200 hover:border-teal-300" : 
                      "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {/* Feedback Status Badge */}
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
                      viewArchived ? "bg-amber-100 text-amber-700" :
                      isToday ? "bg-emerald-100 text-emerald-700" :
                      isRecent ? "bg-teal-100 text-teal-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {viewArchived ? "Archived" : 
                       isToday ? "Today" : isRecent ? "Recent" : "Older"}
                    </div>
                    
                    {/* Feedback Header */}
                    <div className={`p-4 sm:p-6 border-b border-gray-100 ${
                      isToday ? "bg-gradient-to-r from-emerald-50 to-teal-50" :
                      isRecent ? "bg-gradient-to-r from-teal-50 to-cyan-50" :
                      "bg-gradient-to-r from-gray-50 to-gray-100"
                    } rounded-t-2xl`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-lg ${
                          isToday ? "bg-emerald-100" : isRecent ? "bg-teal-100" : "bg-gray-100"
                        }`}>
                          <MessageSquare size={16} className={
                            isToday ? "text-emerald-600" : isRecent ? "text-teal-600" : "text-gray-600"
                          } />
                        </div>
                        <span className="text-xs text-gray-500">Community Feedback</span>
                        {isToday && (
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-xs text-green-600 font-medium">New</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm sm:text-base text-gray-800 leading-relaxed line-clamp-3">
                        {fb.message}
                      </p>
                    </div>
                    
                    {/* Feedback Details */}
                    <div className="p-4 sm:p-6 space-y-3">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <div className={`p-2 rounded-lg ${
                          isToday ? "bg-emerald-100" : isRecent ? "bg-teal-100" : "bg-gray-100"
                        }`}>
                          <Calendar size={16} className={
                            isToday ? "text-emerald-600" : isRecent ? "text-teal-600" : "text-gray-600"
                          } />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900">
                            {feedbackDate.toLocaleDateString('en-PH', { 
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDistanceToNow(feedbackDate, { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <div className={`p-2 rounded-lg ${
                          isToday ? "bg-emerald-100" : isRecent ? "bg-teal-100" : "bg-gray-100"
                        }`}>
                          <Clock size={16} className={
                            isToday ? "text-emerald-600" : isRecent ? "text-teal-600" : "text-gray-600"
                          } />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900">
                            {feedbackDate.toLocaleTimeString('en-PH', {
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true
                            })}
                          </p>
                          <p className="text-xs text-gray-500">{fb.message.length} characters</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Feedback Actions */}
                    <div className="p-4 sm:p-6 pt-0">
                      {viewArchived ? (
                        // Actions for archived feedback
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleRestoreFeedback(fb.id)}
                            className="flex-1 px-3 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-xs sm:text-sm"
                          >
                            <RotateCcw size={14} />
                            Restore
                          </Button>
                          <Button
                            onClick={() => handleDeleteFeedback(fb.id)}
                            className="flex-1 px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-xs sm:text-sm"
                          >
                            <Trash2 size={14} />
                            Delete
                          </Button>
                        </div>
                      ) : (
                        // Actions for active feedback
                        <div className="flex gap-2">
                          <Button
                            className="flex-1 px-3 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-xs sm:text-sm"
                          >
                            <ThumbsUp size={14} />
                            Mark Helpful
                          </Button>
                          <Button
                            onClick={() => handleArchiveFeedback(fb.id)}
                            className="flex-1 px-3 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-xs sm:text-sm"
                          >
                            <Archive size={14} />
                            Archive
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Enhanced Pagination (matching AdminEvents) */}
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
      </main>
    </div>
  );
}