"use client";

import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../AdminLayout";
import { Input } from "../Input";
import { Badge } from "@/components/ui/badge";
import { Button } from "../Navbar/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/supabase-client";
import { getAdminDisplayName, getCurrentAdminIdentity, type AdminIdentity } from "@/lib/adminIdentity";
import { ChevronLeft, ChevronRight, Clock, History, Pill, Search, Shield, UserCircle2 } from "lucide-react";

type ClaimHistoryRow = {
  id: string;
  request_id: string | null;
  medicine_id?: string | null;
  admin_id?: string | null;
  delivered_by?: string | null;
  notes?: string | null;
  claimed_at?: string | null;
  created_at?: string | null;
};

type RequestRow = {
  id: string;
  requester_name?: string | null;
  quantity?: number | null;
  status?: string | null;
  medicines?: { name?: string | null; dosage?: string | null; form?: string | null } | null;
};

type ProfileRow = {
  id: string;
  full_name?: string | null;
  role?: string | null;
};

type AdminLoginRow = {
  id: string;
  admin_id: string;
  admin_name?: string | null;
  admin_email?: string | null;
  logged_in_at?: string | null;
};

type LogRow = ClaimHistoryRow & {
  request?: RequestRow | null;
  approvedBy?: ProfileRow | null;
  deliveredBy?: ProfileRow | null;
};

export default function AdminLogs() {
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [loginLogs, setLoginLogs] = useState<AdminLoginRow[]>([]);
  const [currentAdmin, setCurrentAdmin] = useState<AdminIdentity | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activityPage, setActivityPage] = useState(1);
  const [loginPage, setLoginPage] = useState(1);

  const activityLogsPerPage = 8;
  const loginLogsPerPage = 8;

  useEffect(() => {
    const loadLogs = async () => {
      setLoading(true);

      const [identity, claimsRes, loginRes] = await Promise.all([
        getCurrentAdminIdentity(),
        supabase
          .from("claims_history")
          .select("id, request_id, medicine_id, admin_id, delivered_by, notes, claimed_at, created_at")
          .order("created_at", { ascending: false, nullsFirst: false })
          .order("claimed_at", { ascending: false, nullsFirst: false }),
        supabase
          .from("admin_login_logs")
          .select("id, admin_id, admin_name, admin_email, logged_in_at")
          .order("logged_in_at", { ascending: false, nullsFirst: false }),
      ]);

      setCurrentAdmin(identity);

      if (claimsRes.error) {
        console.error(claimsRes.error);
        setLogs([]);
      }

      if (loginRes.error) {
        console.error(loginRes.error);
      }

      const claims = (claimsRes.data || []) as ClaimHistoryRow[];
      const requestIds = [...new Set(claims.map((row) => row.request_id).filter((value): value is string => Boolean(value)))];
      const actorIds = [
        ...new Set(
          claims
            .flatMap((row) => [row.admin_id, row.delivered_by])
            .filter((value): value is string => Boolean(value))
        ),
      ];

      const [requestsRes, profilesRes] = await Promise.all([
        requestIds.length
          ? supabase
              .from("medicine_requests")
              .select("id, requester_name, quantity, status, medicine_id, medicines:medicine_id ( name, dosage, form )")
              .in("id", requestIds)
          : Promise.resolve({ data: [], error: null }),
        actorIds.length
          ? supabase.from("profiles").select("id, full_name, role").in("id", actorIds)
          : Promise.resolve({ data: [], error: null }),
      ]);

      if (requestsRes.error) {
        console.error(requestsRes.error);
      }

      if (profilesRes.error) {
        console.error(profilesRes.error);
      }

      const requestMap = new Map<string, RequestRow>(
        ((requestsRes.data || []) as RequestRow[]).map((row) => [row.id, row])
      );
      const profileMap = new Map<string, ProfileRow>(
        ((profilesRes.data || []) as ProfileRow[]).map((row) => [row.id, row])
      );

      setLogs(
        claims.map((row) => ({
          ...row,
          request: row.request_id ? requestMap.get(row.request_id) || null : null,
          approvedBy: row.admin_id ? profileMap.get(row.admin_id) || null : null,
          deliveredBy: row.delivered_by ? profileMap.get(row.delivered_by) || null : null,
        }))
      );
      setLoginLogs((loginRes.data || []) as AdminLoginRow[]);
      setLoading(false);
    };

    loadLogs();
  }, []);

  useEffect(() => {
    setActivityPage(1);
  }, [query]);

  const filteredLogs = useMemo(() => {
    const lower = query.trim().toLowerCase();
    if (!lower) return logs;

    return logs.filter((log) => {
      const requester = log.request?.requester_name || "";
      const medicine = log.request?.medicines?.name || "";
      const approvedBy = log.approvedBy?.full_name || log.admin_id || "—";
      const deliveredBy = log.deliveredBy?.full_name || log.delivered_by || "—";

      return [requester, medicine, approvedBy, deliveredBy, log.notes || "", log.request?.status || ""]
        .join(" ")
        .toLowerCase()
        .includes(lower);
    });
  }, [logs, query]);

  const activityTotalPages = Math.max(1, Math.ceil(filteredLogs.length / activityLogsPerPage));
  const loginTotalPages = Math.max(1, Math.ceil(loginLogs.length / loginLogsPerPage));

  const paginatedActivityLogs = filteredLogs.slice(
    (activityPage - 1) * activityLogsPerPage,
    activityPage * activityLogsPerPage
  );

  const paginatedLoginLogs = loginLogs.slice((loginPage - 1) * loginLogsPerPage, loginPage * loginLogsPerPage);

  const logCount = logs.length;
  const approvedCount = logs.filter((log) => log.admin_id).length;
  const loginCount = loginLogs.length;

  const resolvedAdminLabel = currentAdmin?.fullName || currentAdmin?.email || "Admin";

  const formatTime = (value?: string | null) => {
    if (!value) return "Not available";
    return new Date(value).toLocaleString();
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50/30 to-cyan-50">
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <History size={18} className="text-white" />
                </div>
                <div>
                  <h1 className="font-semibold text-base sm:text-lg">Transaction Logs</h1>
                  <p className="text-emerald-100 text-xs sm:text-sm">Approval and delivery history for medicine requests</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm sm:text-base">
                <UserCircle2 size={18} />
                <span>Signed in as {resolvedAdminLabel}</span>
              </div>
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-5 shadow-lg border border-white/60">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Log Entries</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{logCount}</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-5 shadow-lg border border-white/60">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Approved by Admin</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{approvedCount}</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-5 shadow-lg border border-white/60">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Admin Logins</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{loginCount}</p>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl shadow-lg">
                  <UserCircle2 className="text-white w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Admin Login History</h2>
                  <p className="text-sm sm:text-base text-gray-600">Exact sign-in time and date for each admin account.</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-100 mb-8">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableHead className="font-bold text-gray-700">Admin</TableHead>
                    <TableHead className="font-bold text-gray-700">Email</TableHead>
                    <TableHead className="font-bold text-gray-700">Login Time</TableHead>
                    <TableHead className="font-bold text-gray-700">Exact Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading && (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <div className="py-10 text-center text-gray-500">Loading admin login history...</div>
                      </TableCell>
                    </TableRow>
                  )}

                  {!loading && loginLogs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <div className="py-10 text-center text-gray-500">
                          No admin login history yet.
                        </div>
                      </TableCell>
                    </TableRow>
                  )}

                  {!loading && paginatedLoginLogs.map((entry) => (
                    <TableRow key={entry.id} className="hover:bg-slate-50/70 transition-colors">
                      <TableCell className="font-medium text-gray-900">
                        {getAdminDisplayName(entry.admin_email, entry.admin_name) || "Unknown admin"}
                      </TableCell>
                      <TableCell className="text-gray-700">{entry.admin_email || "—"}</TableCell>
                      <TableCell className="text-gray-700">{formatTime(entry.logged_in_at)}</TableCell>
                      <TableCell className="text-xs text-gray-500">{entry.logged_in_at || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {!loading && loginLogs.length > loginLogsPerPage && (
              <div className="flex justify-center items-center gap-2 mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
                <button
                  onClick={() => setLoginPage((page) => Math.max(1, page - 1))}
                  disabled={loginPage === 1}
                  className="p-2.5 rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-emerald-50 hover:border-emerald-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-2 max-w-full">
                  {Array.from({ length: loginTotalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setLoginPage(page)}
                      className={`w-10 h-10 rounded-xl font-semibold text-sm transition-all duration-200 flex-shrink-0 ${
                        page === loginPage
                          ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg"
                          : "bg-white/80 text-gray-600 border-2 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setLoginPage((page) => Math.min(loginTotalPages, page + 1))}
                  disabled={loginPage === loginTotalPages}
                  className="p-2.5 rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-emerald-50 hover:border-emerald-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl shadow-lg">
                  <Shield className="text-white w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Admin Activity Log</h2>
                  <p className="text-sm sm:text-base text-gray-600">Track who approved and who delivered each transaction.</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    value={query}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                    placeholder="Search requester, medicine, or admin"
                    className="pl-10 bg-white/80 border-2 border-gray-200 rounded-xl"
                  />
                </div>
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-semibold rounded-xl shadow-lg"
                >
                  Refresh
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-50 hover:to-teal-50">
                    <TableHead className="font-bold text-gray-700">Requester</TableHead>
                    <TableHead className="font-bold text-gray-700">Medicine</TableHead>
                    <TableHead className="font-bold text-gray-700">Approved By</TableHead>
                    <TableHead className="font-bold text-gray-700">Delivered By</TableHead>
                    <TableHead className="font-bold text-gray-700">Approved / Claimed</TableHead>
                    <TableHead className="font-bold text-gray-700">Notes</TableHead>
                    <TableHead className="font-bold text-gray-700">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading && (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <div className="py-12 text-center text-gray-500">Loading logs...</div>
                      </TableCell>
                    </TableRow>
                  )}

                  {!loading && filteredLogs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <div className="py-12 text-center">
                          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
                            <Clock className="h-8 w-8 text-emerald-500" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-700 mb-2">No logs found</h3>
                          <p className="text-sm text-gray-500">Approve or deliver a medicine request to start building the audit trail.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}

                  {!loading && paginatedActivityLogs.map((log) => {
                    const requester = log.request?.requester_name || "Unknown requester";
                    const medicineName = log.request?.medicines?.name || "Unknown medicine";
                    const approvedBy = log.approvedBy?.full_name || "";
                    const deliveredBy = log.deliveredBy?.full_name || "";

                    return (
                      <TableRow key={log.id} className="hover:bg-emerald-50/50 transition-colors">
                        <TableCell>
                          <div className="font-medium text-gray-900">{requester}</div>
                          <div className="text-xs text-gray-500">Request ID: {log.request_id}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-gray-900 flex items-center gap-2">
                            <Pill className="h-4 w-4 text-emerald-600" />
                            {medicineName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {log.request?.medicines?.dosage || ""} {log.request?.medicines?.form || ""}
                            {log.request?.quantity ? ` • Qty ${log.request.quantity}` : ""}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-gray-900">{approvedBy}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-gray-900">{deliveredBy}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-700">{formatTime(log.created_at)}</div>
                          <div className="text-xs text-gray-500">Claimed: {formatTime(log.claimed_at)}</div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <p className="truncate text-sm text-gray-700">{log.notes || "—"}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant={log.request?.status === "claimed" ? "success" : log.request?.status === "approved" ? "secondary" : "default"} className="capitalize">
                            {log.request?.status || "logged"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {!loading && filteredLogs.length > activityLogsPerPage && (
              <div className="flex justify-center items-center gap-2 mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
                <button
                  onClick={() => setActivityPage((page) => Math.max(1, page - 1))}
                  disabled={activityPage === 1}
                  className="p-2.5 rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-emerald-50 hover:border-emerald-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-2 max-w-full">
                  {Array.from({ length: activityTotalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setActivityPage(page)}
                      className={`w-10 h-10 rounded-xl font-semibold text-sm transition-all duration-200 flex-shrink-0 ${
                        page === activityPage
                          ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg"
                          : "bg-white/80 text-gray-600 border-2 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setActivityPage((page) => Math.min(activityTotalPages, page + 1))}
                  disabled={activityPage === activityTotalPages}
                  className="p-2.5 rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-emerald-50 hover:border-emerald-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </AdminLayout>
  );
}