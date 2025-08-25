import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/supabase-client";
import { Button } from "../Navbar/button";
import { Input } from "../Input";
import { Textarea } from "../Textarea";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import {
  LayoutDashboard,
  FileText,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  Plus,
  Calendar,
  Clock,
  MapPin,
  Heart,
  CalendarDays,
  Trash2,
  Activity,
  Users,
  Stethoscope,
  Eye
} from "lucide-react";

// Admin Navbar Component
function AdminNavbar() {
  const location = useLocation();
  const pathname = location.pathname;
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { to: "/admin/events", label: "Events", icon: <Clock size={20} /> },
    { to: "/announcements", label: "Health Announcements", icon: <Bell size={20} /> },
    { to: "/posts", label: "Health Posts", icon: <FileText size={20} /> },
    { to: "/settings", label: "Settings", icon: <Settings size={20} /> },
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
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Barangay Health Admin</h1>
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

export default function AdminEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEventType, setSelectedEventType] = useState("all");
  
  const eventsPerPage = 6;
  const indexOfLast = currentPage * eventsPerPage;
  const indexOfFirst = indexOfLast - eventsPerPage;
  
  // Filter events based on type
  const filteredEvents = events.filter(event => {
    if (selectedEventType === "all") return true;
    if (selectedEventType === "upcoming") return new Date(event.date) >= new Date();
    if (selectedEventType === "past") return new Date(event.date) < new Date();
    return true;
  });
  
  const currentEvents = filteredEvents.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / eventsPerPage));

  // Timer effect for live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch events
  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true });
    if (error) toast.error(error.message);
    else setEvents(data || []);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Add event
  const addEvent = async () => {
    if (!title || !date || !time) {
      toast.error("Please fill in required fields");
      return;
    }

    const { error } = await supabase.from("events").insert([
      { title, description, date, time, location },
    ]);

    if (error) toast.error(error.message);
    else {
      toast.success("Health event added successfully!");
      setTitle("");
      setDescription("");
      setDate("");
      setTime("");
      setLocation("");
      fetchEvents();
    }
  };

  // Delete event
  const deleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this health event?")) return;
    
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Health event deleted successfully!");
      fetchEvents();
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

  const upcomingEvents = events.filter(event => new Date(event.date) >= new Date());
  const pastEvents = events.filter(event => new Date(event.date) < new Date());
  const thisMonthEvents = events.filter(event => 
    new Date(event.date).getMonth() === new Date().getMonth() &&
    new Date(event.date).getFullYear() === new Date().getFullYear()
  );

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-teal-50/30 to-cyan-50 min-h-screen">
      {/* Enhanced Philippine Standard Time top bar */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Clock size={18} className="text-white" />
              </div>
              <div>
                <span className="font-semibold text-base sm:text-lg">Philippine Standard Time</span>
                <div className="text-emerald-100 text-xs sm:text-sm">Health Events Management</div>
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
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 lg:mb-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
                <CalendarDays className="text-white" size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide truncate">Total Events</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{events.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg">
                <Activity className="text-white" size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide truncate">Upcoming Events</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{upcomingEvents.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl shadow-lg">
                <Users className="text-white" size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide truncate">Past Events</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{pastEvents.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                <Stethoscope className="text-white" size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide truncate">This Month</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{thisMonthEvents.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Create Event Form */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 lg:mb-8">
            <div className="p-3 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl shadow-lg">
              <Plus className="text-white w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Create Health Event</h2>
              <p className="text-sm sm:text-base text-gray-600 mt-1">Schedule health programs and activities for your community</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Health Event Title *</label>
                <Input
                  placeholder="e.g., COVID-19 Vaccination Drive, Health Screening Program..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all text-base text-gray-900 placeholder:text-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Event Description</label>
                <Textarea
                  placeholder="Provide detailed information about the health event, requirements, and procedures..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all min-h-24 text-sm sm:text-base leading-relaxed text-gray-900 placeholder:text-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Event Location</label>
                <Input
                  placeholder="e.g., Barangay Health Center, Community Hall..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all text-base text-gray-900 placeholder:text-gray-500"
                />
              </div>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Event Date *</label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all text-base text-gray-900"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Event Time *</label>
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all text-base text-gray-900"
                />
              </div>
              
              <div className="pt-4 lg:pt-8">
                <Button
                  onClick={addEvent}
                  className="w-full px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-base sm:text-lg"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Calendar size={20} />
                    Schedule Health Event
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Event Management Section */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Health Events Management</h2>
              <p className="text-sm sm:text-base text-gray-600 mt-1">Manage your community health events and activities</p>
            </div>
            
            {/* Event Filter */}
            <div className="flex items-center gap-2 bg-emerald-50 p-1 rounded-xl">
              {[
                { value: "all", label: "All Events", icon: <CalendarDays size={16} /> },
                { value: "upcoming", label: "Upcoming", icon: <Activity size={16} /> },
                { value: "past", label: "Past", icon: <Clock size={16} /> },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => {
                    setSelectedEventType(filter.value);
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm ${
                    selectedEventType === filter.value
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

          {/* Enhanced Events List */}
          {events.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="text-emerald-400 w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No health events scheduled</h3>
              <p className="text-sm sm:text-base text-gray-500">Create your first health event to get started</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Eye className="text-gray-400 w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No events found</h3>
              <p className="text-sm sm:text-base text-gray-500">Try changing the filter or create a new event</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {currentEvents.map((event) => {
                const eventDate = new Date(event.date);
                const isUpcoming = eventDate >= new Date();
                const isPast = eventDate < new Date();
                
                return (
                  <div
                    key={event.id}
                    className={`relative bg-white/90 backdrop-blur-sm border-2 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
                      isUpcoming ? "border-emerald-200 hover:border-emerald-300" :
                      isPast ? "border-gray-200 hover:border-gray-300" : 
                      "border-blue-200 hover:border-blue-300"
                    }`}
                  >
                    {/* Event Status Badge */}
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
                      isUpcoming ? "bg-emerald-100 text-emerald-700" :
                      isPast ? "bg-gray-100 text-gray-600" :
                      "bg-blue-100 text-blue-700"
                    }`}>
                      {isUpcoming ? "Upcoming" : isPast ? "Past" : "Today"}
                    </div>
                    
                    {/* Event Header */}
                    <div className={`p-4 sm:p-6 border-b border-gray-100 ${
                      isUpcoming ? "bg-gradient-to-r from-emerald-50 to-teal-50" :
                      isPast ? "bg-gradient-to-r from-gray-50 to-gray-100" :
                      "bg-gradient-to-r from-blue-50 to-cyan-50"
                    } rounded-t-2xl`}>
                      <h3 className="font-bold text-gray-900 text-lg sm:text-xl mb-2 line-clamp-2 leading-tight">
                        {event.title}
                      </h3>
                      {event.description && (
                        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                          {event.description}
                        </p>
                      )}
                    </div>
                    
                    {/* Event Details */}
                    <div className="p-4 sm:p-6 space-y-3">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <div className={`p-2 rounded-lg ${
                          isUpcoming ? "bg-emerald-100" : isPast ? "bg-gray-100" : "bg-blue-100"
                        }`}>
                          <Calendar size={16} className={
                            isUpcoming ? "text-emerald-600" : isPast ? "text-gray-600" : "text-blue-600"
                          } />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900">
                            {eventDate.toLocaleDateString('en-PH', { 
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDistanceToNow(eventDate, { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <div className={`p-2 rounded-lg ${
                          isUpcoming ? "bg-emerald-100" : isPast ? "bg-gray-100" : "bg-blue-100"
                        }`}>
                          <Clock size={16} className={
                            isUpcoming ? "text-emerald-600" : isPast ? "text-gray-600" : "text-blue-600"
                          } />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900">
                            {new Date(`2000-01-01T${event.time}`).toLocaleTimeString('en-PH', {
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true
                            })}
                          </p>
                          <p className="text-xs text-gray-500">Event time</p>
                        </div>
                      </div>
                      
                      {event.location && (
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <div className={`p-2 rounded-lg ${
                            isUpcoming ? "bg-emerald-100" : isPast ? "bg-gray-100" : "bg-blue-100"
                          }`}>
                            <MapPin size={16} className={
                              isUpcoming ? "text-emerald-600" : isPast ? "text-gray-600" : "text-blue-600"
                            } />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900 line-clamp-1">{event.location}</p>
                            <p className="text-xs text-gray-500">Event location</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Event Actions */}
                    <div className="p-4 sm:p-6 pt-0">
                      <Button
                        onClick={() => deleteEvent(event.id)}
                        className="w-full px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                      >
                        <Trash2 size={16} />
                        Delete Event
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Enhanced Pagination */}
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