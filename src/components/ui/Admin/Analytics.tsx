import { useEffect, useState, useRef, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/supabase-client";
import AdminLayout from "../AdminLayout";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Clock,
  Heart,
  Shield,
  Megaphone,
  MessageSquare,
  Archive,
  TrendingUp,
  Users,
  Calendar,
  Pill,
  Activity,
  BarChart3,
  PieChart,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Download,
  ScrollText,
} from "lucide-react";
import { LineChart, Line, PieChart as RePieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Admin Navbar Component
export function AdminNavbar() {
  const location = useLocation();
  const pathname = location.pathname;
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: "/admin/analytics", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { to: "/admin/dashboard", label: "Announcement", icon: <Megaphone size={20} /> },
    { to: "/admin/feedback", label: "User Feedback", icon: <MessageSquare size={20} /> },
    { to: "/admin/events", label: "Events", icon: <Clock size={20} /> },
    { to: "/admin/archive", label: "Archives", icon: <Archive size={20} /> },
    { to: "/admin/medicine-inventory", label: "Medicine Inventory", icon: <Shield size={20} /> },
    { to: "/admin/medicine-requests", label: "Medicine Requests", icon: <Heart size={20} /> },
    { to: "/admin/logs", label: "Logs", icon: <ScrollText size={20} /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-600 rounded-xl flex items-center justify-center shadow-sm">
                <Heart className="text-white" size={18} />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-teal-400 rounded-full border-2 border-white"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">KaHealth Admin</h1>
              <p className="text-xs sm:text-sm text-gray-500">Community Wellness System</p>
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
                className={`flex items-center gap-2 px-3 xl:px-4 py-2.5 rounded-xl font-medium transition-colors text-sm xl:text-base ${
                  pathname === link.to
                    ? "bg-teal-600 text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
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
                className="flex items-center gap-2 px-3 xl:px-4 py-2.5 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors font-medium text-sm xl:text-base"
              >
                <LogOut size={20} />
                <span className="hidden xl:inline">Logout</span>
              </button>
            </div>
          </nav>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 sm:p-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {menuOpen && (
          <div className="lg:hidden mt-4 py-4 border-t border-gray-200">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm sm:text-base ${
                    pathname === link.to
                      ? "bg-teal-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {link.icon}
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}
              <div className="pt-2 mt-2 border-t border-gray-200">
                <button
                  onClick={async () => {
                    await supabase.auth.signOut();
                    window.location.href = "/admin/login";
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-100 font-medium text-sm sm:text-base"
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

// Isolated clock: ticks every second on its own, so the rest of the
// dashboard (charts, tables) never has to re-render just because a second passed.
function LiveClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatted = now.toLocaleString("en-PH", {
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

  return <div className="text-lg sm:text-xl font-bold">{formatted}</div>;
}

export default function Analytics() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [medicines, setMedicines] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [claimHistory, setClaimHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const [announcementsRes, eventsRes, feedbackRes, medicinesRes, requestsRes, claimsRes] = await Promise.all([
        supabase.from("announcements").select("*").order("created_at", { ascending: false }),
        supabase.from("events").select("*").order("date", { ascending: true }),
        supabase.from("feedback").select("*").order("created_at", { ascending: false }),
        supabase.from("medicines").select("*"),
        supabase.from("medicine_requests").select("*, medicines:medicine_id(name)").order("created_at", { ascending: false }),
        supabase
          .from("claims_history")
          .select("id, request_id, medicine_id, admin_id, delivered_by, notes, claimed_at, created_at")
          .order("claimed_at", { ascending: false, nullsFirst: false })
          .order("created_at", { ascending: false, nullsFirst: false }),
      ]);

      if (announcementsRes.data) setAnnouncements(announcementsRes.data);
      if (eventsRes.data) setEvents(eventsRes.data);
      if (feedbackRes.data) setFeedback(feedbackRes.data);
      if (medicinesRes.data) setMedicines(medicinesRes.data);
      if (requestsRes.data) setRequests(requestsRes.data);
      if (claimsRes.data) setClaimHistory(claimsRes.data);

      setLoading(false);
    };

    fetchData();
  }, []);

  // Analytics calculations — memoized so they only recompute when the
  // underlying fetched data changes, not on every render (e.g. clock ticks,
  // modal open/close, hover states).
  const {
    now,
    thisMonth,
    upcomingEvents,
    thisWeekFeedback,
    lowStockMeds,
    pendingRequests,
    approvedRequests,
    claimedRequests,
    deniedRequests,
    issueHistory,
    issueSummary,
    requestStatusData,
    monthlyData,
    stockStatusData,
  } = useMemo(() => {
    const now = new Date();
    const thisMonth = announcements.filter(a => new Date(a.created_at).getMonth() === now.getMonth());
    const upcomingEvents = events.filter(e => new Date(e.date) >= now);
    const thisWeekFeedback = feedback.filter(f => {
      const diff = (now.getTime() - new Date(f.created_at).getTime()) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    });
    const lowStockMeds = medicines.filter(m => m.stock < 10);
    const pendingRequests = requests.filter(r => r.status === "pending");
    const approvedRequests = requests.filter(r => r.status === "approved");
    const claimedRequests = requests.filter(r => r.status === "claimed");
    const deniedRequests = requests.filter(r => r.status === "denied");
    const requestMap = new Map(requests.map((request) => [request.id, request]));
    const medicineMap = new Map(medicines.map((medicine) => [medicine.id, medicine]));
    const issueHistory = claimHistory
      .map((entry) => {
        const request = entry.request_id ? requestMap.get(entry.request_id) || null : null;
        const medicine = entry.medicine_id ? medicineMap.get(entry.medicine_id) || null : request?.medicines || null;

        return {
          ...entry,
          request,
          medicine,
          issuedAt: entry.claimed_at || entry.created_at || request?.created_at || null,
        };
      })
      .filter((entry) => Boolean(entry.issuedAt));
    const issueWindowCount = (days: number) =>
      issueHistory.filter((entry) => {
        if (!entry.issuedAt) return false;
        const issueDate = new Date(entry.issuedAt).getTime();
        return issueDate >= now.getTime() - days * 24 * 60 * 60 * 1000;
      }).length;
    const issueSummary = [
      { label: "Daily", value: issueWindowCount(1), note: "Last 24 hours" },
      { label: "Weekly", value: issueWindowCount(7), note: "Last 7 days" },
      { label: "Monthly", value: issueWindowCount(30), note: "Last 30 days" },
      { label: "Quarterly", value: issueWindowCount(90), note: "Last 90 days" },
    ];

    // Request status data for pie chart
    const requestStatusData = [
      { name: "Pending", value: pendingRequests.length, color: "#d97706" },
      { name: "Approved", value: approvedRequests.length, color: "#0d9488" },
      { name: "Claimed", value: claimedRequests.length, color: "#0f766e" },
      { name: "Denied", value: deniedRequests.length, color: "#dc2626" },
    ];

    // Monthly trend data (last 6 months)
    const monthlyData = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      const month = date.toLocaleString('default', { month: 'short' });

      const monthAnnouncements = announcements.filter(a => {
        const aDate = new Date(a.created_at);
        return aDate.getMonth() === date.getMonth() && aDate.getFullYear() === date.getFullYear();
      }).length;

      const monthEvents = events.filter(e => {
        const eDate = new Date(e.date);
        return eDate.getMonth() === date.getMonth() && eDate.getFullYear() === date.getFullYear();
      }).length;

      const monthFeedback = feedback.filter(f => {
        const fDate = new Date(f.created_at);
        return fDate.getMonth() === date.getMonth() && fDate.getFullYear() === date.getFullYear();
      }).length;

      return { month, announcements: monthAnnouncements, events: monthEvents, feedback: monthFeedback };
    });

    // Medicine stock status
    const stockStatusData = [
      { name: "In Stock", value: medicines.filter(m => m.stock >= 30).length, color: "#0d9488" },
      { name: "Low Stock", value: medicines.filter(m => m.stock >= 10 && m.stock < 30).length, color: "#d97706" },
      { name: "Critical", value: medicines.filter(m => m.stock < 10).length, color: "#dc2626" },
    ];

    return {
      now,
      thisMonth,
      upcomingEvents,
      thisWeekFeedback,
      lowStockMeds,
      pendingRequests,
      approvedRequests,
      claimedRequests,
      deniedRequests,
      issueHistory,
      issueSummary,
      requestStatusData,
      monthlyData,
      stockStatusData,
    };
  }, [announcements, events, feedback, medicines, requests, claimHistory]);


  const handleDownloadPDF = () => {
    // Create a printable version
    const printContent = printRef.current;
    if (!printContent) return;

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Write the HTML content with proper styling
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>KaHealth Analytics Report - ${new Date().toLocaleDateString('en-PH')}</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              margin: 0;
              padding: 20px;
              background: white;
            }
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            .report-container {
              max-width: 800px;
              margin: 0 auto;
            }
            h1, h2, h3 { color: #1f2937; }
            h1 { font-size: 28px; margin-bottom: 8px; }
            h2 { font-size: 22px; margin-top: 24px; margin-bottom: 16px; }
            p { color: #4b5563; line-height: 1.6; }
            .text-center { text-align: center; }
            .mb-8 { margin-bottom: 32px; }
            .mb-6 { margin-bottom: 24px; }
            .mb-4 { margin-bottom: 16px; }
            .mb-3 { margin-bottom: 12px; }
            .mb-2 { margin-bottom: 8px; }
            .mb-1 { margin-bottom: 4px; }
            .mt-8 { margin-top: 32px; }
            .mt-4 { margin-top: 16px; }
            .mt-2 { margin-top: 8px; }
            .mt-1 { margin-top: 4px; }
            .p-4 { padding: 16px; }
            .pb-6 { padding-bottom: 24px; }
            .pt-6 { padding-top: 24px; }
            .border-b-2 { border-bottom: 3px solid #0d9488; }
            .border-t-2 { border-top: 2px solid #e5e7eb; }
            .grid { display: grid; gap: 16px; }
            .grid-cols-2 { grid-template-columns: 1fr 1fr; }
            .grid-cols-3 { grid-template-columns: 1fr 1fr 1fr; }
            .grid-cols-4 { grid-template-columns: 1fr 1fr 1fr 1fr; }
            .border { border: 1px solid #e5e7eb; }
            .rounded-lg { border-radius: 8px; }
            .text-3xl { font-size: 30px; }
            .text-2xl { font-size: 24px; }
            .text-lg { font-size: 18px; }
            .text-sm { font-size: 14px; }
            .text-xs { font-size: 12px; }
            .font-bold { font-weight: 700; }
            .font-semibold { font-weight: 600; }
            .text-gray-900 { color: #111827; }
            .text-gray-600 { color: #4b5563; }
            .text-gray-500 { color: #6b7280; }
            .text-teal-600 { color: #0d9488; }
            .text-amber-600 { color: #d97706; }
            .text-blue-600 { color: #2563eb; }
            .text-red-500 { color: #ef4444; }
            .text-amber-800 { color: #92400e; }
            .text-red-800 { color: #991b1b; }
            .text-amber-700 { color: #b45309; }
            .text-red-700 { color: #b91c1c; }
            .bg-amber-50 { background-color: #fffbeb; }
            .bg-red-50 { background-color: #fef2f2; }
            .bg-teal-50 { background-color: #f0fdfa; }
            .bg-blue-50 { background-color: #eff6ff; }
            .border-amber-200 { border-color: #fde68a; }
            .border-red-200 { border-color: #fecaca; }
            .border-teal-200 { border-color: #99f6e4; }
            .border-blue-200 { border-color: #bfdbfe; }
            .border-l-4 { border-left-width: 4px; }
            .border-amber-500 { border-color: #f59e0b; }
            .border-red-500 { border-color: #ef4444; }
            .flex { display: flex; }
            .items-center { align-items: center; }
            .justify-between { justify-content: space-between; }
            .gap-2 { gap: 8px; }
            .uppercase { text-transform: uppercase; }
            .italic { font-style: italic; }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 12px;
            }
            th, td {
              border: 1px solid #e5e7eb;
              padding: 12px;
              text-align: left;
              font-size: 14px;
            }
            th {
              background: #f9fafb;
              font-weight: 600;
            }
            tr:nth-child(even) {
              background: #f9fafb;
            }
            .text-left { text-align: left; }
            .text-center { text-align: center; }
            @media print {
              body { padding: 0; }
              .page-break { page-break-after: always; }
            }
          </style>
        </head>
        <body>
          <div class="report-container">
            ${printContent.innerHTML}
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    
    // Wait for content to load, then trigger print dialog
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
    <div className="bg-gray-50 min-h-screen">
      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-report, #printable-report * {
            visibility: visible;
          }
          #printable-report {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white;
          }
          .no-print {
            display: none !important;
          }
          .print-break {
            page-break-after: always;
          }
        }
      `}</style>

      <div className="bg-teal-700 text-white no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/15 rounded-lg">
                <Clock size={18} className="text-white" />
              </div>
              <div>
                <span className="font-semibold text-base sm:text-lg">Philippine Standard Time</span>
                <div className="text-teal-100 text-xs sm:text-sm">Analytics Dashboard</div>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <LiveClock />
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
        {/* Header with Print Button */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-3 bg-teal-600 rounded-xl">
                <BarChart3 className="text-white w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-sm sm:text-base text-gray-500 mt-1">Overview of your barangay health system performance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-teal-50 rounded-xl">
                <Megaphone className="text-teal-600" size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide truncate">Total Announcements</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{announcements.length}</p>
                <p className="text-xs text-teal-600 mt-1">{thisMonth.length} this month</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-teal-50 rounded-xl">
                <Calendar className="text-teal-600" size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide truncate">Total Events</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{events.length}</p>
                <p className="text-xs text-teal-600 mt-1">{upcomingEvents.length} upcoming</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-teal-50 rounded-xl">
                <MessageSquare className="text-teal-600" size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide truncate">Total Feedback</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{feedback.length}</p>
                <p className="text-xs text-teal-600 mt-1">{thisWeekFeedback.length} this week</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-teal-50 rounded-xl">
                <Pill className="text-teal-600" size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide truncate">Medicines</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{medicines.length}</p>
                <p className="text-xs text-red-600 mt-1">{lowStockMeds.length} low stock</p>
              </div>
            </div>
          </div>
        </div>

        {/* Medicine Requests Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-amber-50 rounded-xl">
                <Clock className="text-amber-600" size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide truncate">Pending Requests</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{pendingRequests.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-teal-50 rounded-xl">
                <CheckCircle2 className="text-teal-600" size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide truncate">Approved Requests</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{approvedRequests.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-teal-50 rounded-xl">
                <Shield className="text-teal-600" size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide truncate">Claimed Requests</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{claimedRequests.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-red-50 rounded-xl">
                <XCircle className="text-red-600" size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide truncate">Denied Requests</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{deniedRequests.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Activity Trend Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-teal-600 rounded-lg">
                <TrendingUp className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">6-Month Activity Trend</h3>
                <p className="text-sm text-gray-500">Announcements, Events & Feedback</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                <Legend />
                <Line type="monotone" dataKey="announcements" stroke="#0d9488" strokeWidth={2} name="Announcements" />
                <Line type="monotone" dataKey="events" stroke="#0891b2" strokeWidth={2} name="Events" />
                <Line type="monotone" dataKey="feedback" stroke="#64748b" strokeWidth={2} name="Feedback" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Request Status Pie Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-teal-600 rounded-lg">
                <PieChart className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Request Status Distribution</h3>
                <p className="text-sm text-gray-500">Current medicine request statuses</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RePieChart>
                <Pie
                  data={requestStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => {
                    if (!entry?.value) return "";
                    const name = entry?.name ?? "";
                    const percent = typeof entry?.percent === "number" ? entry.percent : 0;
                    return `${name}: ${(percent * 100).toFixed(0)}%`;
                  }}
                  outerRadius={100}
                  fill="#0d9488"
                  dataKey="value"
                >
                  {requestStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </div>

          {/* Medicine Stock Status */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-teal-600 rounded-lg">
                <Activity className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Medicine Stock Status</h3>
                <p className="text-sm text-gray-500">Current inventory levels</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RePieChart>
                <Pie
                  data={stockStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => {
                    if (!entry?.value) return "";
                    const name = entry?.name ?? "";
                    const percent = typeof entry?.percent === "number" ? entry.percent : 0;
                    return `${name}: ${(percent * 100).toFixed(0)}%`;
                  }}
                  outerRadius={100}
                  fill="#0d9488"
                  dataKey="value"
                >
                  {stockStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Insights */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-teal-600 rounded-lg">
                <AlertCircle className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Quick Insights</h3>
                <p className="text-sm text-gray-500">Important metrics to monitor</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3">
                  <Users className="text-teal-600" size={20} />
                  <span className="text-sm font-medium text-gray-900">Total Requests Handled</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{requests.length}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3">
                  <AlertCircle className="text-amber-600" size={20} />
                  <span className="text-sm font-medium text-gray-900">Action Required</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{pendingRequests.length}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3">
                  <Shield className="text-red-600" size={20} />
                  <span className="text-sm font-medium text-gray-900">Low Stock Medicines</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{lowStockMeds.length}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3">
                  <Calendar className="text-teal-600" size={20} />
                  <span className="text-sm font-medium text-gray-900">Upcoming Events</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{upcomingEvents.length}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-teal-600" size={20} />
                  <span className="text-sm font-medium text-gray-900">Success Rate</span>
                </div>
                <span className="text-lg font-bold text-gray-900">
                  {requests.length > 0 ? Math.round((claimedRequests.length / requests.length) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-teal-600 rounded-lg">
              <Activity className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Recent Activity Summary</h3>
              <p className="text-sm text-gray-500">Latest updates across all modules</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Latest Announcement */}
            {announcements.length > 0 && (
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <Megaphone className="text-teal-600" size={18} />
                  <span className="text-xs font-semibold text-gray-500 uppercase">Latest Announcement</span>
                </div>
                <h4 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2">{announcements[0].title}</h4>
                <p className="text-xs text-gray-600 line-clamp-2 mb-3">{announcements[0].content}</p>
                <div className="text-xs text-gray-500">
                  {new Date(announcements[0].created_at).toLocaleDateString('en-PH')}
                </div>
              </div>
            )}

            {/* Next Event */}
            {upcomingEvents.length > 0 && (
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="text-teal-600" size={18} />
                  <span className="text-xs font-semibold text-gray-500 uppercase">Next Event</span>
                </div>
                <h4 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2">{upcomingEvents[0].title}</h4>
                <p className="text-xs text-gray-600 line-clamp-2 mb-3">{upcomingEvents[0].description}</p>
                <div className="text-xs text-gray-500">
                  {new Date(upcomingEvents[0].date).toLocaleDateString('en-PH')} at {upcomingEvents[0].time}
                </div>
              </div>
            )}

            {/* Latest Feedback */}
            {feedback.length > 0 && (
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="text-teal-600" size={18} />
                  <span className="text-xs font-semibold text-gray-500 uppercase">Latest Feedback</span>
                </div>
                <p className="text-sm text-gray-800 line-clamp-3 mb-3">{feedback[0].message}</p>
                <div className="text-xs text-gray-500">
                  {new Date(feedback[0].created_at).toLocaleDateString('en-PH')}
                </div>
              </div>
            )}

            {/* Latest Request */}
            {requests.length > 0 && (
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="text-teal-600" size={18} />
                  <span className="text-xs font-semibold text-gray-500 uppercase">Latest Request</span>
                </div>
                <h4 className="font-bold text-gray-900 text-sm mb-2">{requests[0].requester_name}</h4>
                <p className="text-xs text-gray-600 mb-2">
                  Medicine: {requests[0].medicines?.name || 'N/A'}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Qty: {requests[0].quantity}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    requests[0].status === 'pending' ? 'bg-amber-100 text-amber-800' :
                    requests[0].status === 'approved' ? 'bg-teal-100 text-teal-800' :
                    requests[0].status === 'claimed' ? 'bg-teal-100 text-teal-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {requests[0].status || 'pending'}
                  </span>
                </div>
              </div>
            )}

            {/* Low Stock Alert */}
            {lowStockMeds.length > 0 && (
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="text-red-600" size={18} />
                  <span className="text-xs font-semibold text-gray-500 uppercase">Low Stock Alert</span>
                </div>
                <h4 className="font-bold text-gray-900 text-sm mb-2">{lowStockMeds[0].name}</h4>
                <p className="text-xs text-gray-600 mb-2">
                  {lowStockMeds[0].dosage} - {lowStockMeds[0].form}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Stock: {lowStockMeds[0].stock}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full font-semibold bg-red-100 text-red-800">
                    Restock Needed
                  </span>
                </div>
              </div>
            )}

            {/* System Status */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="text-teal-600" size={18} />
                <span className="text-xs font-semibold text-gray-500 uppercase">System Status</span>
              </div>
              <h4 className="font-bold text-gray-900 text-sm mb-3">All Systems Operational</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Announcements</span>
                  <span className="text-teal-600 font-semibold">✓ Active</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Events</span>
                  <span className="text-teal-600 font-semibold">✓ Active</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Requests</span>
                  <span className="text-teal-600 font-semibold">✓ Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-teal-600 rounded-lg">
                <TrendingUp className="text-white" size={20} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Engagement Rate</h3>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {feedback.length > 0 ? Math.round((feedback.length / announcements.length) * 100) : 0}%
            </div>
            <p className="text-sm text-gray-500">Feedback per announcement</p>
            <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-teal-600 transition-all duration-500"
                style={{ width: `${feedback.length > 0 ? Math.min((feedback.length / announcements.length) * 100, 100) : 0}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-teal-600 rounded-lg">
                <Users className="text-white" size={20} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Request Fulfillment</h3>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {requests.length > 0 ? Math.round(((approvedRequests.length + claimedRequests.length) / requests.length) * 100) : 0}%
            </div>
            <p className="text-sm text-gray-500">Approved or completed requests</p>
            <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-teal-600 transition-all duration-500"
                style={{ width: `${requests.length > 0 ? Math.min(((approvedRequests.length + claimedRequests.length) / requests.length) * 100, 100) : 0}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-teal-600 rounded-lg">
                <Activity className="text-white" size={20} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Event Participation</h3>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {upcomingEvents.length}
            </div>
            <p className="text-sm text-gray-500">Events scheduled ahead</p>
            <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-teal-600 transition-all duration-500"
                style={{ width: `${Math.min((upcomingEvents.length / Math.max(events.length, 1)) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </main>

      {/* Printable Report Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 no-print overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl my-8 shadow-xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-900">KaHealth Analytics Report</h2>
              <button
                onClick={() => setShowPrintModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div id="printable-report" ref={printRef} className="p-8 max-h-[70vh] overflow-y-auto">
              {/* Report Header */}
              <div className="text-center mb-8 border-b-2 border-teal-600 pb-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-16 h-16 bg-teal-600 rounded-xl flex items-center justify-center">
                    <Heart className="text-white" size={32} />
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">KaHealth Analytics Report</h1>
                <p className="text-lg text-gray-600">Community Wellness System</p>
                <p className="text-sm text-gray-500 mt-2">
                  Generated on: {new Date().toLocaleDateString('en-PH', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                  })}
                </p>
              </div>

              {/* Medicine Issue Summary */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Heart size={24} className="text-teal-600" />
                  Medicine Issue Summary
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {issueSummary.map((item) => (
                    <div key={item.label} className="border border-gray-200 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">{item.label}</p>
                      <p className="text-3xl font-bold text-teal-600">{item.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{item.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Issue Medicines */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp size={24} className="text-teal-600" />
                  Issue Medicines
                </h2>
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="w-full border-collapse">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="border-b border-gray-200 px-4 py-3 text-left text-sm font-semibold">Requester</th>
                        <th className="border-b border-gray-200 px-4 py-3 text-left text-sm font-semibold">Medicine</th>
                        <th className="border-b border-gray-200 px-4 py-3 text-center text-sm font-semibold">Qty</th>
                        <th className="border-b border-gray-200 px-4 py-3 text-center text-sm font-semibold">Status</th>
                        <th className="border-b border-gray-200 px-4 py-3 text-left text-sm font-semibold">Issued / Claimed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(issueHistory.length > 0 ? issueHistory : requests.filter((request) => request.status === "approved" || request.status === "claimed")).slice(0, 10).map((entry, index) => (
                        <tr key={entry.id || index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="border-b border-gray-200 px-4 py-3 text-sm text-gray-700">
                            {entry.request?.requester_name || entry.requester_name || "N/A"}
                          </td>
                          <td className="border-b border-gray-200 px-4 py-3 text-sm text-gray-700">
                            {entry.medicine?.name || entry.request?.medicines?.name || entry.medicines?.name || "N/A"}
                          </td>
                          <td className="border-b border-gray-200 px-4 py-3 text-center text-sm text-gray-700">
                            {entry.request?.quantity || entry.quantity || "N/A"}
                          </td>
                          <td className="border-b border-gray-200 px-4 py-3 text-center text-sm text-gray-700 capitalize">
                            {entry.request?.status || entry.status || "issued"}
                          </td>
                          <td className="border-b border-gray-200 px-4 py-3 text-sm text-gray-700">
                            {entry.issuedAt ? new Date(entry.issuedAt).toLocaleString("en-PH") : "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* History of Requests */}
              <div className="mb-8 print-break">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar size={24} className="text-teal-600" />
                  History of Requests
                </h2>
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="w-full border-collapse">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="border-b border-gray-200 px-4 py-3 text-left text-sm font-semibold">Requester</th>
                        <th className="border-b border-gray-200 px-4 py-3 text-left text-sm font-semibold">Medicine</th>
                        <th className="border-b border-gray-200 px-4 py-3 text-center text-sm font-semibold">Quantity</th>
                        <th className="border-b border-gray-200 px-4 py-3 text-center text-sm font-semibold">Status</th>
                        <th className="border-b border-gray-200 px-4 py-3 text-left text-sm font-semibold">Requested At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.slice(0, 15).map((request, index) => (
                        <tr key={request.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="border-b border-gray-200 px-4 py-3 text-sm text-gray-700">{request.requester_name}</td>
                          <td className="border-b border-gray-200 px-4 py-3 text-sm text-gray-700">{request.medicines?.name || "N/A"}</td>
                          <td className="border-b border-gray-200 px-4 py-3 text-center text-sm text-gray-700">{request.quantity}</td>
                          <td className="border-b border-gray-200 px-4 py-3 text-center text-sm text-gray-700 capitalize">{request.status}</td>
                          <td className="border-b border-gray-200 px-4 py-3 text-sm text-gray-700">{new Date(request.created_at).toLocaleString("en-PH")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Detailed Inventory Report */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Pill size={24} className="text-teal-600" />
                  Detailed Inventory Report
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Total Medicines</p>
                    <p className="text-3xl font-bold text-teal-600">{medicines.length}</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Low Stock</p>
                    <p className="text-3xl font-bold text-amber-600">{lowStockMeds.length}</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Pending Requests</p>
                    <p className="text-3xl font-bold text-teal-600">{pendingRequests.length}</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Prescription Required</p>
                    <p className="text-3xl font-bold text-teal-600">{medicines.filter((medicine) => medicine.requires_prescription).length}</p>
                  </div>
                </div>
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="w-full border-collapse">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="border-b border-gray-200 px-4 py-3 text-left text-sm font-semibold">Medicine</th>
                        <th className="border-b border-gray-200 px-4 py-3 text-left text-sm font-semibold">Dosage</th>
                        <th className="border-b border-gray-200 px-4 py-3 text-left text-sm font-semibold">Form</th>
                        <th className="border-b border-gray-200 px-4 py-3 text-center text-sm font-semibold">Stock</th>
                        <th className="border-b border-gray-200 px-4 py-3 text-left text-sm font-semibold">Expiry</th>
                        <th className="border-b border-gray-200 px-4 py-3 text-center text-sm font-semibold">Prescription</th>
                      </tr>
                    </thead>
                    <tbody>
                      {medicines.map((medicine, index) => {
                        const expiryDate = medicine.expiry_date ? new Date(medicine.expiry_date) : null;
                        const isExpired = expiryDate ? expiryDate.getTime() < now.getTime() : false;
                        const isLow = medicine.stock < 10;

                        return (
                          <tr key={medicine.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="border-b border-gray-200 px-4 py-3 text-sm font-medium text-gray-900">{medicine.name}</td>
                            <td className="border-b border-gray-200 px-4 py-3 text-sm text-gray-700">{medicine.dosage || "N/A"}</td>
                            <td className="border-b border-gray-200 px-4 py-3 text-sm text-gray-700">{medicine.form || "N/A"}</td>
                            <td className={`border-b border-gray-200 px-4 py-3 text-center text-sm font-semibold ${isLow ? "text-amber-700" : "text-teal-700"}`}>
                              {medicine.stock}
                            </td>
                            <td className={`border-b border-gray-200 px-4 py-3 text-sm ${isExpired ? "text-red-700 font-semibold" : "text-gray-700"}`}>
                              {expiryDate ? expiryDate.toLocaleDateString("en-PH") : "N/A"}
                            </td>
                            <td className="border-b border-gray-200 px-4 py-3 text-center text-sm text-gray-700">
                              {medicine.requires_prescription ? "Yes" : "No"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t-2 border-gray-200 pt-6 mt-8 text-center">
                <p className="text-sm text-gray-600">
                  This report is generated by KaHealth Community Wellness System
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  For official use only • Barangay Health Center
                </p>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-6 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 rounded-xl font-semibold transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleDownloadPDF}
                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-sm transition-colors flex items-center gap-2"
              >
                <Download size={20} />
                Print PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </AdminLayout>
  );
}