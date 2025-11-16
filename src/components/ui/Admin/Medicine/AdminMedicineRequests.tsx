"use client";

import { useEffect, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/supabase-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "../../Navbar/button";
import { Input } from "../../Input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import RequestDetailModal from "./RequestDetailModal";
import { toast } from "sonner";
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
  Pill,
  Users,
  CheckCircle2,
} from "lucide-react";

/**
 * AdminMedicineRequests
 * - shows a table of requests
 * - approve / reject / complete actions
 * - archive functionality
 * - deduct stock automatically when approving
 * - realtime updates
 * - Enhanced UI matching AdminDashboard design
 */

type RequestRow = {
  id: string;
  requester_name: string;
  age?: number;
  sex?: string;
  contact: string;
  address: string;
  medicine_id?: string;
  quantity: number;
  reason?: string;
  file_url?: string;
  status?: string;
  created_at?: string;
  medicines?: { name?: string; dosage?: string; form?: string; stock?: number } | null;
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
    { to: "/admin/requests", label: "Medicine Requests", icon: <Pill size={20} /> },
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

export default function AdminMedicineRequests() {
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<RequestRow | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Timer effect for live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("medicine_requests")
      .select(
        `id, requester_name, age, sex, contact, address, medicine_id, quantity, reason, file_url, status, created_at,
         medicines:medicine_id ( id, name, dosage, form, stock )`
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      toast.error("Failed to load requests");
      setLoading(false);
      return;
    }

    setRequests((data || []) as RequestRow[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRequests();

    const channel = supabase
      .channel("public:medicine_requests")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "medicine_requests" },
        () => {
          fetchRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchRequests]);

  const visible = requests.filter((r) =>
    `${r.requester_name} ${r.contact} ${r.medicines?.name || ""}`
      .toLowerCase()
      .includes(q.toLowerCase())
  );

  const handleArchive = async (req: RequestRow) => {
    const reason = prompt("Enter reason for archiving (optional):") || "manual_archive";
    const notes = prompt("Add any additional notes (optional):") || null;

    if (!confirm(`Archive request from ${req.requester_name}?`)) return;

    // Prepare archive data
    const archiveData = {
      original_id: req.id,
      requester_name: req.requester_name,
      age: req.age,
      sex: req.sex,
      contact: req.contact,
      address: req.address,
      medicine_id: req.medicine_id,
      medicine_name: req.medicines?.name,
      medicine_dosage: req.medicines?.dosage,
      medicine_form: req.medicines?.form,
      quantity: req.quantity,
      reason: req.reason,
      file_url: req.file_url,
      status: req.status,
      created_at: req.created_at,
      archive_reason: reason,
      notes: notes,
      data: req, // Store full object as backup
    };

    // Insert into archive
    const { error: archiveError } = await supabase
      .from("archive_medicine_requests")
      .insert([archiveData]);

    if (archiveError) {
      console.error("Archive error:", archiveError);
      toast.error("Failed to archive request.");
      return;
    }

    // Delete from main table
    const { error: deleteError } = await supabase
      .from("medicine_requests")
      .delete()
      .eq("id", req.id);

    if (deleteError) {
      console.error("Delete error:", deleteError);
      toast.error("Failed to remove request from active list.");
      return;
    }

    toast.success("Request archived successfully.");
    fetchRequests();
  };

  const handleApprove = async (req: RequestRow) => {
    if (!req.medicine_id) {
      toast.error("No medicine selected for this request.");
      return;
    }

    const { data: medData, error: medError } = await supabase
      .from("medicines")
      .select("stock")
      .eq("id", req.medicine_id)
      .single();

    if (medError || !medData) {
      toast.error("Failed to fetch medicine stock.");
      return;
    }

    const currentStock = Number(medData.stock || 0);
    if (currentStock < req.quantity) {
      toast.error(`Insufficient stock. Available: ${currentStock}`);
      return;
    }

    const { error: updateStockErr } = await supabase
      .from("medicines")
      .update({ stock: currentStock - req.quantity })
      .eq("id", req.medicine_id);

    if (updateStockErr) {
      console.error(updateStockErr);
      toast.error("Failed to deduct stock.");
      return;
    }

    const { error: updateReqErr } = await supabase
      .from("medicine_requests")
      .update({ status: "approved" })
      .eq("id", req.id);

    if (updateReqErr) {
      console.error(updateReqErr);
      toast.error("Failed to mark request approved.");
      return;
    }

    await supabase.from("claims_history").insert({
      request_id: req.id,
      medicine_id: req.medicine_id,
      delivered_by: null,
      admin_id: null,
      notes: `Approved and reserved ${req.quantity}.`,
    });

    toast.success("Request approved and stock updated.");
    fetchRequests();
  };

  const handleReject = async (req: RequestRow) => {
    const reason = prompt("Enter reason for rejection (optional):") || null;

    const { error } = await supabase
      .from("medicine_requests")
      .update({ status: "denied", reason: reason })
      .eq("id", req.id);

    if (error) {
      console.error(error);
      toast.error("Failed to reject request.");
      return;
    }

    toast.success("Request denied.");
    fetchRequests();
  };

  const handleComplete = async (req: RequestRow) => {
    const { error } = await supabase
      .from("medicine_requests")
      .update({ status: "claimed" })
      .eq("id", req.id);

    if (error) {
      console.error(error);
      toast.error("Failed to mark as completed.");
      return;
    }

    await supabase
      .from("claims_history")
      .insert({ request_id: req.id, medicine_id: req.medicine_id, claimed_at: new Date() });

    toast.success("Request marked as claimed/completed.");
    fetchRequests();
  };

  const openDetails = (row: RequestRow) => {
    setSelected(row);
    setDetailOpen(true);
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

  const pendingCount = requests.filter(r => r.status === "pending").length;
  const approvedCount = requests.filter(r => r.status === "approved").length;
  const claimedCount = requests.filter(r => r.status === "claimed").length;

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
                <div className="text-emerald-100 text-xs sm:text-sm">Medicine Request Management</div>
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
              <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <Users className="text-white" size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide truncate">Total Requests</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{requests.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg">
                <Clock className="text-white" size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide truncate">Pending</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{pendingCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                <CheckCircle2 className="text-white" size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide truncate">Approved</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{approvedCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
                <Shield className="text-white" size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide truncate">Claimed</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{claimedCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Medicine Requests Section */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-3 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl shadow-lg">
                <Pill className="text-white w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Medicine Requests</h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1">Manage community medicine requests</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Input 
                placeholder="Search name / medicine / contact" 
                value={q} 
                onChange={(e: any) => setQ(e.target.value)}
                className="w-full sm:w-64 px-4 py-2 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
              />
              <Button 
                onClick={() => fetchRequests()}
                className="px-4 sm:px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Refresh
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border-2 border-gray-100">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100">
                  <TableHead className="font-bold text-gray-700">Requester</TableHead>
                  <TableHead className="font-bold text-gray-700">Medicine</TableHead>
                  <TableHead className="font-bold text-gray-700">Qty</TableHead>
                  <TableHead className="font-bold text-gray-700">Contact</TableHead>
                  <TableHead className="font-bold text-gray-700">Date</TableHead>
                  <TableHead className="font-bold text-gray-700">Status</TableHead>
                  <TableHead className="text-right font-bold text-gray-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Pill className="text-emerald-400 w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">No requests found</h3>
                        <p className="text-sm text-gray-500">Try adjusting your search or check back later</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {visible.map((r) => (
                  <TableRow key={r.id} className="hover:bg-emerald-50/50 transition-colors">
                    <TableCell>
                      <div className="font-medium text-gray-900">{r.requester_name}</div>
                      <div className="text-xs text-gray-500">{r.age ? `${r.age} yrs • ${r.sex ?? ""}` : r.sex ?? ""}</div>
                    </TableCell>

                    <TableCell>
                      <div className="font-medium text-gray-900">{r.medicines?.name ?? "—"}</div>
                      <div className="text-xs text-gray-500">{r.medicines?.dosage ?? ""} {r.medicines?.form ?? ""}</div>
                    </TableCell>

                    <TableCell>
                      <div className="inline-flex items-center px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-lg font-semibold text-sm">
                        {r.quantity}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-gray-900">{r.contact}</div>
                      <div className="text-xs text-gray-500">{r.address}</div>
                    </TableCell>

                    <TableCell className="text-sm text-gray-600">
                      {r.created_at ? new Date(r.created_at).toLocaleString() : "-"}
                    </TableCell>

                    <TableCell>
                      <Badge
                        className="capitalize font-semibold"
                        variant={
                          r.status === "approved"
                            ? "secondary"
                            : r.status === "denied"
                            ? "destructive"
                            : r.status === "claimed"
                            ? "success"
                            : "default"
                        }
                      >
                        {r.status ?? "pending"}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2 flex-wrap">
                        <Button 
                          onClick={() => openDetails(r)}
                          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold shadow-md hover:shadow-lg transition-all"
                        >
                          View
                        </Button>

                        {r.status === "pending" && (
                          <>
                            <Button 
                              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold shadow-md hover:shadow-lg transition-all" 
                              onClick={() => handleApprove(r)}
                            >
                              Approve
                            </Button>
                            <Button 
                              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold shadow-md hover:shadow-lg transition-all" 
                              onClick={() => handleReject(r)}
                            >
                              Reject
                            </Button>
                          </>
                        )}

                        {r.status === "approved" && (
                          <Button 
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-md hover:shadow-lg transition-all" 
                            onClick={() => handleComplete(r)}
                          >
                            Mark Claimed
                          </Button>
                        )}

                        {/* Archive button - available for all statuses */}
                        <Button 
                          className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-1" 
                          onClick={() => handleArchive(r)}
                        >
                          <Archive size={16} />
                          Archive
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>

      {selected && (
        <RequestDetailModal open={detailOpen} setOpen={setDetailOpen} request={selected} refresh={fetchRequests} />
      )}
    </div>
  );
}