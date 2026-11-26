"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/supabase-client";
import AdminLayout from "../../AdminLayout";
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
  ScrollText,
} from "lucide-react";
import { getCurrentAdminIdentity } from "@/lib/adminIdentity";

/**
 * AdminMedicineRequests
 * - shows a table of requests
 * - approve / reject / complete actions
 * - single + bulk archive functionality
 * - deduct stock automatically when approving
 * - realtime updates
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

// Isolated clock: ticks every second on its own, so the table/list doesn't
// have to re-render just because a second passed.
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

export default function AdminMedicineRequests() {
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<RequestRow | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Multi-select archive state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [archiving, setArchiving] = useState(false);

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

  const visible = useMemo(
    () =>
      requests.filter((r) =>
        `${r.requester_name} ${r.contact} ${r.medicines?.name || ""}`
          .toLowerCase()
          .includes(q.toLowerCase())
      ),
    [requests, q]
  );

  // Keep selection valid whenever the visible list changes (search, refresh, etc.)
  useEffect(() => {
    setSelectedIds((prev) => prev.filter((id) => visible.some((r) => r.id === id)));
  }, [visible]);

  const allVisibleSelected = visible.length > 0 && visible.every((r) => selectedIds.includes(r.id));

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      setSelectedIds((prev) => prev.filter((id) => !visible.some((r) => r.id === id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...visible.map((r) => r.id)])));
    }
  };

  const buildArchiveRow = (req: RequestRow, reason: string, notes: string | null) => ({
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
    data: req,
  });

  const handleArchive = async (req: RequestRow) => {
    const reason = prompt("Enter reason for archiving (optional):") || "manual_archive";
    const notes = prompt("Add any additional notes (optional):") || null;

    if (!confirm(`Archive request from ${req.requester_name}?`)) return;

    const { error: archiveError } = await supabase
      .from("archive_medicine_requests")
      .insert([buildArchiveRow(req, reason, notes)]);

    if (archiveError) {
      console.error("Archive error:", archiveError);
      toast.error("Failed to archive request.");
      return;
    }

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

  const handleArchiveSelected = async () => {
    if (selectedIds.length === 0) {
      toast.error("No requests selected.");
      return;
    }

    const reason = prompt(`Enter reason for archiving ${selectedIds.length} request(s) (optional):`) || "manual_archive";
    const notes = prompt("Add any additional notes (optional):") || null;

    if (!confirm(`Archive ${selectedIds.length} request(s)?`)) return;

    setArchiving(true);

    try {
      const toArchive = requests.filter((r) => selectedIds.includes(r.id));
      const archiveRows = toArchive.map((req) => buildArchiveRow(req, reason, notes));

      const { error: archiveError } = await supabase
        .from("archive_medicine_requests")
        .insert(archiveRows);

      if (archiveError) throw archiveError;

      const idsToDelete = toArchive.map((r) => r.id);
      const { error: deleteError } = await supabase
        .from("medicine_requests")
        .delete()
        .in("id", idsToDelete);

      if (deleteError) throw deleteError;

      toast.success(`${selectedIds.length} request(s) archived successfully.`);
      setSelectedIds([]);
      fetchRequests();
    } catch (err) {
      console.error(err);
      toast.error("Failed to archive selected requests.");
    } finally {
      setArchiving(false);
    }
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

    const { error: updateReqErr } = await supabase
      .from("medicine_requests")
      .update({ status: "approved" })
      .eq("id", req.id);

    if (updateReqErr) {
      console.error(updateReqErr);
      toast.error("Failed to mark request approved.");
      return;
    }

    const admin = await getCurrentAdminIdentity();
    const { error: historyError } = await supabase.from("claims_history").upsert({
      request_id: req.id,
      medicine_id: req.medicine_id,
      admin_id: admin?.id || null,
      delivered_by: null,
      claimed_at: null,
      notes: `Approved and reserved ${req.quantity}.`,
    }, {
      onConflict: "request_id",
    });

    if (historyError) {
      console.error(historyError);
      toast.error("Approved, but failed to save the activity log.");
    }

    toast.success("Request approved and stock updated.");
    fetchRequests();
  };

  const handleReject = async (req: RequestRow) => {
    const reason = prompt("Enter reason for Declination (optional):") || null;

    const { error } = await supabase
      .from("medicine_requests")
      .update({ status: "denied", reason: reason })
      .eq("id", req.id);

    if (error) {
      console.error(error);
      toast.error("Failed to Decline request.");
      return;
    }

    const admin = await getCurrentAdminIdentity();
    const { error: historyError } = await supabase.from("claims_history").upsert({
      request_id: req.id,
      medicine_id: req.medicine_id || null,
      admin_id: admin?.id || null,
      delivered_by: null,
      claimed_at: null,
      notes: reason ? `Declined request. Reason: ${reason}` : "Declined request.",
    }, {
      onConflict: "request_id",
    });

    if (historyError) {
      console.error(historyError);
      toast.error("Denied, but failed to save the activity log.");
    }

    toast.success("Request denied.");
    fetchRequests();
  };

  const handleComplete = async (req: RequestRow) => {
    const admin = await getCurrentAdminIdentity();
    const { error } = await supabase
      .from("medicine_requests")
      .update({ status: "claimed" })
      .eq("id", req.id);

    if (error) {
      console.error(error);
      toast.error("Failed to mark as completed.");
      return;
    }

    const { error: historyError } = await supabase.from("claims_history").upsert({
      request_id: req.id,
      medicine_id: req.medicine_id,
      delivered_by: admin?.id || null,
      claimed_at: new Date().toISOString(),
      notes: "Marked as claimed/completed.",
    }, {
      onConflict: "request_id",
    });

    if (historyError) {
      console.error(historyError);
      toast.error("Completed, but failed to save the activity log.");
    }

    toast.success("Request marked as claimed/completed.");
    fetchRequests();
  };

  const openDetails = (row: RequestRow) => {
    setSelected(row);
    setDetailOpen(true);
  };

  const pendingCount = requests.filter(r => r.status === "pending").length;
  const approvedCount = requests.filter(r => r.status === "approved").length;
  const claimedCount = requests.filter(r => r.status === "claimed").length;

  return (
    <AdminLayout>
    <div className="bg-gray-50 min-h-screen">
      {/* Philippine Standard Time top bar */}
      <div className="bg-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/15 rounded-lg">
                <Clock size={18} className="text-white" />
              </div>
              <div>
                <span className="font-semibold text-base sm:text-lg">Philippine Standard Time</span>
                <div className="text-teal-100 text-xs sm:text-sm">Medicine Request Management</div>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <LiveClock />
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 lg:mb-8">
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-teal-50 rounded-xl">
                <Users className="text-teal-600" size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide truncate">Total Requests</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{requests.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-amber-50 rounded-xl">
                <Clock className="text-amber-600" size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide truncate">Pending</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{pendingCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-teal-50 rounded-xl">
                <CheckCircle2 className="text-teal-600" size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide truncate">Approved</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{approvedCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-teal-50 rounded-xl">
                <Shield className="text-teal-600" size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide truncate">Claimed</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{claimedCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Medicine Requests Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-3 bg-teal-600 rounded-xl">
                <Pill className="text-white w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Medicine Requests</h1>
                <p className="text-sm sm:text-base text-gray-500 mt-1">Manage community medicine requests</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Input
                placeholder="Search name / medicine / contact"
                value={q}
                onChange={(e: any) => setQ(e.target.value)}
                className="w-full sm:w-64 px-4 py-2 bg-white border border-gray-300 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-colors"
              />
              <Button
                onClick={() => fetchRequests()}
                className="px-4 sm:px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-sm transition-colors"
              >
                Refresh
              </Button>
            </div>
          </div>

          {/* Bulk selection bar */}
          {selectedIds.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 p-3 bg-teal-50 border border-teal-200 rounded-xl">
              <span className="text-sm font-semibold text-teal-700">
                {selectedIds.length} request{selectedIds.length > 1 ? "s" : ""} selected
              </span>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setSelectedIds([])}
                  className="px-4 py-2 bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 font-medium rounded-xl text-sm transition-colors"
                >
                  Clear
                </Button>
                <Button
                  onClick={handleArchiveSelected}
                  disabled={archiving}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white font-semibold rounded-xl shadow-sm transition-colors flex items-center gap-2 text-sm disabled:opacity-50"
                >
                  <Archive size={16} />
                  {archiving ? "Archiving..." : "Archive Selected"}
                </Button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="w-10">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleSelectAll}
                      disabled={visible.length === 0}
                      className="w-4 h-4 text-teal-600 border-2 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                    />
                  </TableHead>
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
                    <TableCell colSpan={8}>
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Pill className="text-teal-400 w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">No requests found</h3>
                        <p className="text-sm text-gray-500">Try adjusting your search or check back later</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {visible.map((r) => (
                  <TableRow
                    key={r.id}
                    className={`transition-colors ${selectedIds.includes(r.id) ? "bg-teal-50/60 hover:bg-teal-50" : "hover:bg-gray-50"}`}
                  >
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(r.id)}
                        onChange={() => toggleSelect(r.id)}
                        className="w-4 h-4 text-teal-600 border-2 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                      />
                    </TableCell>

                    <TableCell>
                      <div className="font-medium text-gray-900">{r.requester_name}</div>
                      <div className="text-xs text-gray-500">{r.age ? `${r.age} yrs • ${r.sex ?? ""}` : r.sex ?? ""}</div>
                    </TableCell>

                    <TableCell>
                      <div className="font-medium text-gray-900">{r.medicines?.name ?? "—"}</div>
                      <div className="text-xs text-gray-500">{r.medicines?.dosage ?? ""} {r.medicines?.form ?? ""}</div>
                    </TableCell>

                    <TableCell>
                      <div className="inline-flex items-center px-2.5 py-1 bg-teal-50 text-teal-700 rounded-lg font-semibold text-sm">
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
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-colors"
                        >
                          View
                        </Button>

                        {r.status === "pending" && (
                          <>
                            <Button
                              className="bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-sm transition-colors"
                              onClick={() => handleApprove(r)}
                            >
                              Approve
                            </Button>
                            <Button
                              className="bg-red-600 hover:bg-red-700 text-white font-semibold shadow-sm transition-colors"
                              onClick={() => handleReject(r)}
                            >
                              Decline
                            </Button>
                          </>
                        )}

                        {r.status === "approved" && (
                          <Button
                            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-sm transition-colors"
                            onClick={() => handleComplete(r)}
                          >
                            Mark Claimed
                          </Button>
                        )}

                        {/* Archive button - available for all statuses */}
                        <Button
                          className="bg-gray-700 hover:bg-gray-800 text-white font-semibold shadow-sm transition-colors flex items-center gap-1"
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
    </AdminLayout>
  );
}