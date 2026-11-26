import { useCallback, useEffect, useState } from "react";
import * as XLSX from "xlsx-js-style";
import AdminLayout from "../AdminLayout";
import { supabase } from "@/supabase-client";
import {
  AlertTriangle,
  CalendarDays,
  FileBarChart,
  MessageSquare,
  Megaphone,
  Package,
  Pill,
  Printer,
  Download,
  ChevronDown,
  RefreshCw,
} from "lucide-react";

type ReportData = {
  announcementRows: AnnouncementRow[];
  eventRows: EventRow[];
  feedbackRows: FeedbackRow[];
  medicineRows: MedicineRow[];
  requestRows: RequestRow[];
  claimRows: ClaimRow[];
  announcements: number;
  events: number;
  feedback: number;
  medicines: number;
  lowStock: number;
  requests: number;
  pendingRequests: number;
  approvedRequests: number;
  claimedRequests: number;
};

type AnnouncementRow = { id: string; title?: string | null; content?: string | null; created_at?: string | null };
type EventRow = { id: string; title?: string | null; description?: string | null; date?: string | null; time?: string | null };
type FeedbackRow = { id: string; message?: string | null; created_at?: string | null };
type MedicineRow = {
  id: string;
  name?: string | null;
  dosage?: string | null;
  form?: string | null;
  stock?: number | null;
  expiry_date?: string | null;
  requires_prescription?: boolean | null;
};
type RequestRow = {
  id: string;
  requester_name?: string | null;
  quantity?: number | null;
  status?: string | null;
  created_at?: string | null;
  medicines?: { name?: string | null } | null;
};
type ClaimRow = { id: string; request_id?: string | null; medicine_id?: string | null; claimed_at?: string | null; created_at?: string | null };
type ReportTableProps = { title: string; headers: string[]; rows: (string | number)[][] };
type IssueReportRow = { issuedAt?: string | null };
type ReportType = "all" | "requests";
type ReportPeriod = "all" | "daily" | "weekly" | "monthly" | "quarterly";

const emptyReport: ReportData = {
  announcementRows: [],
  eventRows: [],
  feedbackRows: [],
  medicineRows: [],
  requestRows: [],
  claimRows: [],
  announcements: 0,
  events: 0,
  feedback: 0,
  medicines: 0,
  lowStock: 0,
  requests: 0,
  pendingRequests: 0,
  approvedRequests: 0,
  claimedRequests: 0,
};

const reportCards = [
  { key: "announcements", label: "Announcements", icon: Megaphone, color: "text-teal-700 bg-teal-50" },
  { key: "events", label: "Events", icon: CalendarDays, color: "text-blue-700 bg-blue-50" },
  { key: "feedback", label: "Feedback", icon: MessageSquare, color: "text-violet-700 bg-violet-50" },
  { key: "medicines", label: "Medicine items", icon: Pill, color: "text-emerald-700 bg-emerald-50" },
] as const;

export default function Reports() {
  const [report, setReport] = useState<ReportData>(emptyReport);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatedAt, setGeneratedAt] = useState(new Date());
  const [reportType, setReportType] = useState<ReportType>("requests");
  const [reportPeriod, setReportPeriod] = useState<ReportPeriod>("daily");
  const [printingReport, setPrintingReport] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  const loadReport = useCallback(async () => {
    setLoading(true);
    setError(null);

    const [announcements, events, feedback, medicines, requests, claims] = await Promise.all([
      supabase.from("announcements").select("*").order("created_at", { ascending: false }),
      supabase.from("events").select("*").order("date", { ascending: true }),
      supabase.from("feedback").select("*").order("created_at", { ascending: false }),
      supabase.from("medicines").select("*"),
      supabase.from("medicine_requests").select("*, medicines:medicine_id(name)").order("created_at", { ascending: false }),
      supabase.from("claims_history").select("id, request_id, medicine_id, claimed_at, created_at").order("claimed_at", { ascending: false }),
    ]);

    const failed = [announcements, events, feedback, medicines, requests, claims].find((result) => result.error);
    if (failed?.error) {
      console.error("Failed to load reports:", failed.error);
      setError("Reports could not be loaded. Please try again.");
      setLoading(false);
      return;
    }

    const announcementRows = (announcements.data || []) as AnnouncementRow[];
    const eventRows = (events.data || []) as EventRow[];
    const feedbackRows = (feedback.data || []) as FeedbackRow[];
    const medicineRows = (medicines.data || []) as MedicineRow[];
    const requestRows = (requests.data || []) as RequestRow[];
    const claimRows = (claims.data || []) as ClaimRow[];
    setReport({
      announcementRows,
      eventRows,
      feedbackRows,
      medicineRows,
      requestRows,
      claimRows,
      announcements: announcementRows.length,
      events: eventRows.length,
      feedback: feedbackRows.length,
      medicines: medicineRows.length,
      lowStock: medicineRows.filter((medicine) => Number(medicine.stock) < 10).length,
      requests: requestRows.length,
      pendingRequests: requestRows.filter((request) => request.status === "pending").length,
      approvedRequests: requestRows.filter((request) => request.status === "approved").length,
      claimedRequests: requestRows.filter((request) => request.status === "claimed").length,
    });
    setGeneratedAt(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadReport();
  }, [loadReport]);

  const now = new Date();
  const thisMonth = report.announcementRows.filter((item) => item.created_at && new Date(item.created_at).getMonth() === now.getMonth()).length;
  const upcomingEvents = report.eventRows.filter((item) => item.date && new Date(item.date) >= now);
  const thisWeekFeedback = report.feedbackRows.filter((item) => item.created_at && (now.getTime() - new Date(item.created_at).getTime()) <= 7 * 86400000);
  const issueHistory: IssueReportRow[] = report.claimRows
    .filter((claim) => claim.claimed_at)
    .map((claim) => ({ issuedAt: claim.claimed_at }));
  const issueWindowCount = (days: number) => issueHistory.filter((item) => item.issuedAt && now.getTime() - new Date(item.issuedAt).getTime() <= days * 86400000).length;
  const monthlyData = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - index));
    const inMonth = (value?: string | null) => value && new Date(value).getMonth() === date.getMonth() && new Date(value).getFullYear() === date.getFullYear();
    return {
      month: date.toLocaleString("default", { month: "short" }),
      announcements: report.announcementRows.filter((item) => inMonth(item.created_at)).length,
      events: report.eventRows.filter((item) => inMonth(item.date)).length,
      feedback: report.feedbackRows.filter((item) => inMonth(item.created_at)).length,
    };
  });
  const stockStatus = {
    inStock: report.medicineRows.filter((item) => Number(item.stock) >= 30).length,
    lowStock: report.medicineRows.filter((item) => Number(item.stock) >= 10 && Number(item.stock) < 30).length,
    critical: report.medicineRows.filter((item) => Number(item.stock) < 10).length,
  };
  const periodDays: Record<Exclude<ReportPeriod, "all">, number> = {
    daily: 1,
    weekly: 7,
    monthly: 30,
    quarterly: 90,
  };
  const periodStartDate = new Date(now);
  periodStartDate.setHours(0, 0, 0, 0);
  if (reportPeriod !== "all") {
    periodStartDate.setDate(periodStartDate.getDate() - (periodDays[reportPeriod] - 1));
  }
  const periodStart = periodStartDate.getTime();
  const filteredRequests = reportPeriod === "all"
    ? report.requestRows
    : report.requestRows.filter((item) => item.created_at && new Date(item.created_at).getTime() >= periodStart);
  const selectedRows = filteredRequests;
  const selectedQuantity = filteredRequests.reduce((total, item) => total + (Number(item.quantity) || 0), 0);
  const periodLabel = reportPeriod === "all" ? "All time" : reportPeriod[0].toUpperCase() + reportPeriod.slice(1);
  const handlePrint = () => {
    setExportMenuOpen(false);
    setPrintingReport(true);
    document.body.classList.add("focused-report-print");
    window.setTimeout(() => {
      window.print();
      window.setTimeout(() => {
        document.body.classList.remove("focused-report-print");
        setPrintingReport(false);
      }, 500);
    }, 50);
  };
  const handleExportExcel = () => {
    setExportMenuOpen(false);
    const workbook = XLSX.utils.book_new();
    const reportTitle = reportType === "requests"
      ? "Request History Report"
      : "Complete KaHealth Report";
    const formatDate = (value?: string | null) => {
      if (!value) return "N/A";
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return "N/A";
      const datePart = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }).format(date);
      const timePart = new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(date);
      return `${datePart} ${timePart}`;
    };
    const cellBorder = {
      top: { style: "thin", color: { rgb: "D1D5DB" } },
      bottom: { style: "thin", color: { rgb: "D1D5DB" } },
      left: { style: "thin", color: { rgb: "D1D5DB" } },
      right: { style: "thin", color: { rgb: "D1D5DB" } },
    };
    const headerStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "0F766E" } },
      alignment: { horizontal: "center", vertical: "center" },
      border: cellBorder,
    };
    const titleStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" }, sz: 16 },
      fill: { fgColor: { rgb: "115E59" } },
      alignment: { horizontal: "left", vertical: "center", indent: 1 },
      border: cellBorder,
    };
    const metadataLabelStyle = {
      font: { bold: true, color: { rgb: "334155" } },
      fill: { fgColor: { rgb: "E2E8F0" } },
      alignment: { horizontal: "left", vertical: "center", indent: 1 },
      border: cellBorder,
    };
    const addSheet = (
      name: string,
      columns: string[],
      rows: Record<string, string | number>[],
    ) => {
      const worksheet = XLSX.utils.aoa_to_sheet([]);
      const titleRow = `${reportTitle} - ${name}`;
      XLSX.utils.sheet_add_aoa(worksheet, [[titleRow]], { origin: "A1" });
      XLSX.utils.sheet_add_aoa(worksheet, [
        ["Period", periodLabel, "Generated", formatDate(generatedAt.toISOString())],
      ], { origin: "A2" });
      XLSX.utils.sheet_add_aoa(worksheet, [
        columns,
        ...rows.map((row) => columns.map((column) => row[column])),
      ], { origin: "A4" });
      if (!rows.length) {
        XLSX.utils.sheet_add_aoa(worksheet, [["No records available for the selected filters."]], { origin: "A5" });
      }

      const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1:A1");
      const lastColumn = range.e.c;
      worksheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: lastColumn } }];
      worksheet["!freeze"] = { xSplit: 0, ySplit: 4 };
      worksheet["!autofilter"] = {
        ref: `A4:${XLSX.utils.encode_col(columns.length - 1)}${Math.max(rows.length + 4, 4)}`,
      };
      worksheet["!cols"] = Array.from({ length: lastColumn + 1 }, (_, columnIndex) => {
        let longestValue = 0;
        for (let rowIndex = 1; rowIndex <= range.e.r; rowIndex += 1) {
          const cell = worksheet[XLSX.utils.encode_cell({ r: rowIndex, c: columnIndex })];
          if (cell?.v !== undefined && cell?.v !== null) {
            longestValue = Math.max(longestValue, String(cell.v).length);
          }
        }
        return { wch: Math.min(40, Math.max(12, longestValue + 2)) };
      });
      worksheet["!rows"] = Array.from({ length: range.e.r + 1 }, (_, rowIndex) => ({
        hpt: rowIndex === 0 ? 36 : rowIndex === 2 ? 8 : rowIndex === 3 ? 28 : 22,
      }));

      for (let rowIndex = range.s.r; rowIndex <= range.e.r; rowIndex += 1) {
        for (let columnIndex = range.s.c; columnIndex <= range.e.c; columnIndex += 1) {
          const address = XLSX.utils.encode_cell({ r: rowIndex, c: columnIndex });
          const cell = worksheet[address];
          if (!cell) continue;

          if (rowIndex === 0) {
            cell.s = titleStyle;
            continue;
          }
          if (rowIndex === 3) {
            cell.s = headerStyle;
            continue;
          }

          const isNumber = typeof cell.v === "number";
          const columnName = columns[columnIndex];
          const alignment = {
            horizontal: columnName === "Status" || columnName === "Prescription"
              ? "center"
              : isNumber ? "right" : "left",
            vertical: "center",
            indent: isNumber ? 0 : 1,
          };
          const style = {
            alignment,
            border: cellBorder,
            fill: {
              fgColor: { rgb: rowIndex >= 4 && (rowIndex - 4) % 2 === 1 ? "F0FDFA" : "FFFFFF" },
            },
          };

          if (rowIndex === 1 && (columnIndex === 0 || columnIndex === 2)) {
            cell.s = { ...style, ...metadataLabelStyle };
          } else if (rowIndex >= 4 && columnName === "Status") {
            const statusColors: Record<string, { fill: string; font: string }> = {
              pending: { fill: "FEF3C7", font: "92400E" },
              claimed: { fill: "D1FAE5", font: "065F46" },
              denied: { fill: "FEE2E2", font: "991B1B" },
            };
            const colors = statusColors[String(cell.v).toLowerCase()];
            cell.s = colors
              ? {
                  ...style,
                  fill: { fgColor: { rgb: colors.fill } },
                  font: { color: { rgb: colors.font } },
                }
              : style;
          } else {
            cell.s = style;
          }
        }
      }
      XLSX.utils.book_append_sheet(workbook, worksheet, name);
    };
    const requestRows = filteredRequests.map((item) => ({
      Requester: item.requester_name || "N/A",
      Medicine: item.medicines?.name || "N/A",
      Quantity: item.quantity ?? "N/A",
      Status: item.status || "N/A",
      "Requested At": formatDate(item.created_at),
    }));

    addSheet("Summary", ["Metric", "Value"], [
      { Metric: "Report", Value: reportTitle },
      { Metric: "Period", Value: periodLabel },
      { Metric: "Generated", Value: formatDate(generatedAt.toISOString()) },
      { Metric: "Records", Value: selectedRows.length },
      { Metric: "Medicines", Value: selectedQuantity },
    ]);
    if (reportType === "requests" || reportType === "all") {
      addSheet("Requests", ["Requester", "Medicine", "Quantity", "Status", "Requested At"], requestRows);
    }
    if (reportType === "all") {
      addSheet("Inventory", ["Medicine", "Dosage", "Form", "Stock", "Expiry", "Prescription"], report.medicineRows.map((item) => ({
        Medicine: item.name || "N/A",
        Dosage: item.dosage || "N/A",
        Form: item.form || "N/A",
        Stock: item.stock ?? "N/A",
        Expiry: formatDate(item.expiry_date),
        Prescription: item.requires_prescription ? "Yes" : "No",
      })));
    }

    const dateStamp = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(workbook, `kahealth-${reportType}-${reportPeriod}-${dateStamp}.xlsx`);
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-50 print:bg-white">
        <style>{`
          @media print {
            body.focused-report-print [data-admin-sidebar] {
              display: none !important;
            }
          }
        `}</style>
        {printingReport ? (
          <main className="mx-auto max-w-5xl bg-white p-8 text-slate-900">
            <div className="mb-8 border-b-2 border-teal-700 pb-4 text-center">
              <h1 className="text-3xl font-bold">
                KaHealth {reportType === "requests" ? "Request History" : "Complete"} Report
              </h1>
              <p className="mt-2 text-sm text-slate-600">{periodLabel} report · Generated {generatedAt.toLocaleString("en-PH")}</p>
            </div>
            {reportType === "all" ? (
              <AllReportsPrint
                report={report}
                requestRows={filteredRequests}
                monthlyData={monthlyData}
                stockStatus={stockStatus}
                issueSummary={[
                  ["Daily", issueWindowCount(1)],
                  ["Weekly", issueWindowCount(7)],
                  ["Monthly", issueWindowCount(30)],
                  ["Quarterly", issueWindowCount(90)],
                ]}
              />
            ) : (
              <ReportTable
                title={`${periodLabel} requests (${selectedRows.length} records, ${selectedQuantity} medicines)`}
                headers={["Requester", "Medicine", "Quantity", "Status", "Requested At"]}
                rows={filteredRequests.map((item) => [
                    item.requester_name || "N/A",
                    item.medicines?.name || "N/A",
                    item.quantity || "N/A",
                    item.status || "N/A",
                    item.created_at ? new Date(item.created_at).toLocaleString("en-PH") : "N/A",
                  ])}
              />
            )}
          </main>
        ) : (
        <>
        <header className="bg-gradient-to-r from-teal-700 to-emerald-700 px-6 py-8 text-white sm:px-10 print:bg-white print:text-slate-900">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-white/15 p-3 print:bg-teal-50">
                <FileBarChart className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm font-medium uppercase tracking-wider text-teal-100 print:text-teal-700">
                  KaHealth Admin
                </p>
                <h1 className="text-3xl font-bold">Reports</h1>
              </div>
            </div>
            <div className="flex gap-2 print:hidden">
              <button
                type="button"
                onClick={() => void loadReport()}
                className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold hover:bg-white/25"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl space-y-6 p-6 sm:p-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">System summary</h2>
              <p className="text-sm text-slate-500">
                Generated {generatedAt.toLocaleString("en-PH")} · {thisMonth} announcements this month ·{" "}
                {upcomingEvents.length} upcoming events · {thisWeekFeedback.length} feedback this week
              </p>
            </div>
          </div>

            <section className="rounded-2xl border border-teal-200 bg-white p-4 shadow-sm sm:p-6">
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                <div className="min-w-0">
                  <h2 className="text-xl font-bold text-slate-900">Print a focused report</h2>
                  <p className="mt-1 text-sm text-slate-500">Choose exactly what to include in the printed report.</p>
                  <p className="mt-4 text-sm text-slate-600 lg:mt-5">
                    This selection contains <strong>{selectedQuantity}</strong>{" "}
                    requested medicines across{" "}
                    <strong>{selectedRows.length}</strong> records.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:flex lg:items-end">
                  <label className="min-w-0 text-sm font-medium text-slate-700">
                    Report
                    <select
                      value={reportType}
                      onChange={(event) => setReportType(event.target.value as ReportType)}
                      className="mt-1 block w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm lg:w-48"
                    >
                      <option className="text-slate-900" value="all">All reports</option>
                      <option className="text-slate-900" value="requests">History of requests</option>
                    </select>
                  </label>
                  <label className="min-w-0 text-sm font-medium text-slate-700">
                    Period
                    <select
                      value={reportPeriod}
                      onChange={(event) => setReportPeriod(event.target.value as ReportPeriod)}
                      className="mt-1 block w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm lg:w-40"
                    >
                      <option className="text-slate-900" value="all">All time</option>
                      <option className="text-slate-900" value="daily">Today</option>
                      <option className="text-slate-900" value="weekly">Last 7 days</option>
                      <option className="text-slate-900" value="monthly">Last 30 days</option>
                      <option className="text-slate-900" value="quarterly">Last 90 days</option>
                    </select>
                  </label>
                  <div className="relative sm:col-span-2 lg:flex">
                    <button
                      type="button"
                      onClick={() => setExportMenuOpen((isOpen) => !isOpen)}
                      aria-expanded={exportMenuOpen}
                      aria-haspopup="menu"
                      className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 py-2 text-center font-semibold text-white hover:bg-teal-800 lg:w-auto lg:whitespace-nowrap"
                    >
                      <Printer className="h-4 w-4" />
                      Print {periodLabel} report
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    {exportMenuOpen && (
                      <div role="menu" className="absolute right-0 top-full z-10 mt-2 w-full min-w-48 overflow-hidden rounded-lg border border-slate-200 bg-white p-1 shadow-lg lg:w-auto">
                        <button
                          type="button"
                          role="menuitem"
                          onClick={handlePrint}
                          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-teal-50"
                        >
                          <Printer className="h-4 w-4 text-teal-700" />
                          Print report
                        </button>
                        <button
                          type="button"
                          role="menuitem"
                          onClick={handleExportExcel}
                          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-teal-50"
                        >
                          <Download className="h-4 w-4 text-teal-700" />
                          Export to Excel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

          {error && (
            <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              {error}
            </div>
          )}

          {loading ? (
            <div className="rounded-2xl bg-white p-12 text-center text-slate-500 shadow-sm">
              Loading report data...
            </div>
          ) : (
            <>
              <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {reportCards.map(({ key, label, icon: Icon, color }) => (
                  <div key={key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className={`mb-4 inline-flex rounded-xl p-3 ${color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-medium text-slate-500">{label}</p>
                    <p className="mt-1 text-3xl font-bold text-slate-900">{report[key]}</p>
                  </div>
                ))}
              </section>

              <section className="grid gap-6 lg:grid-cols-2 print-break">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-5 flex items-center gap-3">
                    <Package className="h-5 w-5 text-emerald-700" />
                    <h2 className="font-bold text-slate-900">Inventory health</h2>
                  </div>
                  <div className="flex items-end justify-between border-b border-slate-100 pb-4">
                    <span className="text-slate-600">Total medicine items</span>
                    <strong className="text-2xl text-slate-900">{report.medicines}</strong>
                  </div>
                  <div className="flex items-end justify-between pt-4">
                    <span className="text-slate-600">Low-stock items</span>
                    <strong className={`text-2xl ${report.lowStock ? "text-amber-600" : "text-emerald-600"}`}>
                      {report.lowStock}
                    </strong>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-5 flex items-center gap-3">
                    <FileBarChart className="h-5 w-5 text-blue-700" />
                    <h2 className="font-bold text-slate-900">Medicine requests</h2>
                  </div>
                  <div className="mb-4 flex items-end justify-between border-b border-slate-100 pb-4">
                    <span className="text-slate-600">Total requests</span>
                    <strong className="text-2xl text-slate-900">{report.requests}</strong>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center text-sm">
                    <div className="rounded-xl bg-amber-50 p-3">
                      <strong className="block text-lg text-amber-700">{report.pendingRequests}</strong>
                      <span className="text-slate-600">Pending</span>
                    </div>
                    <div className="rounded-xl bg-blue-50 p-3">
                      <strong className="block text-lg text-blue-700">{report.approvedRequests}</strong>
                      <span className="text-slate-600">Approved</span>
                    </div>
                    <div className="rounded-xl bg-emerald-50 p-3">
                      <strong className="block text-lg text-emerald-700">{report.claimedRequests}</strong>
                      <span className="text-slate-600">Claimed</span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm print:shadow-none">
                <h2 className="mb-4 text-xl font-bold text-slate-900">Medicine issue summary</h2>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {[
                    ["Daily", issueWindowCount(1), "Last 24 hours"],
                    ["Weekly", issueWindowCount(7), "Last 7 days"],
                    ["Monthly", issueWindowCount(30), "Last 30 days"],
                    ["Quarterly", issueWindowCount(90), "Last 90 days"],
                  ].map(([label, value, note]) => (
                    <div key={label} className="rounded-xl border border-slate-200 p-4">
                      <p className="text-sm text-slate-500">{label}</p>
                      <p className="text-3xl font-bold text-teal-700">{value}</p>
                      <p className="text-xs text-slate-500">{note}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm print:shadow-none">
                <h2 className="mb-4 text-xl font-bold text-slate-900">Analytics breakdown</h2>
                <div className="grid gap-6 lg:grid-cols-3">
                  <div><h3 className="mb-2 font-semibold text-slate-700">6-month activity trend</h3>{monthlyData.map((item) => <p key={item.month} className="text-sm text-slate-600">{item.month}: {item.announcements} announcements, {item.events} events, {item.feedback} feedback</p>)}</div>
                  <div><h3 className="mb-2 font-semibold text-slate-700">Request status distribution</h3><p className="text-sm text-slate-600">Pending: {report.pendingRequests}</p><p className="text-sm text-slate-600">Approved: {report.approvedRequests}</p><p className="text-sm text-slate-600">Claimed: {report.claimedRequests}</p><p className="text-sm text-slate-600">Denied: {report.requestRows.filter((item) => item.status === "denied").length}</p></div>
                  <div><h3 className="mb-2 font-semibold text-slate-700">Medicine stock status</h3><p className="text-sm text-slate-600">In stock: {stockStatus.inStock}</p><p className="text-sm text-slate-600">Low stock: {stockStatus.lowStock}</p><p className="text-sm text-slate-600">Critical: {stockStatus.critical}</p></div>
                </div>
              </section>

              <ReportTable title="History of requests" headers={["Requester", "Medicine", "Quantity", "Status", "Requested At"]} rows={report.requestRows.slice(0, 15).map((item) => [
                item.requester_name || "N/A", item.medicines?.name || "N/A", item.quantity || "N/A", item.status || "N/A", item.created_at ? new Date(item.created_at).toLocaleString("en-PH") : "N/A",
              ])} />

              <ReportTable title="Detailed inventory report" headers={["Medicine", "Dosage", "Form", "Stock", "Expiry", "Prescription"]} rows={report.medicineRows.map((item) => [
                item.name || "N/A", item.dosage || "N/A", item.form || "N/A", item.stock ?? "N/A", item.expiry_date ? new Date(item.expiry_date).toLocaleDateString("en-PH") : "N/A", item.requires_prescription ? "Yes" : "No",
              ])} />
            </>
          )}
        </main>
        </>
        )}
      </div>
    </AdminLayout>
  );
}

function ReportTable({ title, headers, rows }: ReportTableProps) {
  return (
    <section className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-sm print:shadow-none">
      <h2 className="mb-4 text-xl font-bold text-slate-900">{title}</h2>
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            {headers.map((header) => <th key={header} className="px-4 py-3 font-semibold text-slate-700">{header}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.length ? rows.map((row, rowIndex) => (
            <tr key={`${title}-${rowIndex}`} className="border-b border-slate-100 last:border-0">
              {row.map((cell, cellIndex) => <td key={`${rowIndex}-${cellIndex}`} className="px-4 py-3 text-slate-600">{cell}</td>)}
            </tr>
          )) : (
            <tr><td colSpan={headers.length} className="px-4 py-6 text-center text-slate-500">No records available.</td></tr>
          )}
        </tbody>
      </table>
    </section>
  );
}

type AllReportsPrintProps = {
  report: ReportData;
  requestRows: RequestRow[];
  monthlyData: { month: string; announcements: number; events: number; feedback: number }[];
  stockStatus: { inStock: number; lowStock: number; critical: number };
  issueSummary: [string, number][];
};

function AllReportsPrint({
  report,
  requestRows,
  monthlyData,
  stockStatus,
  issueSummary,
}: AllReportsPrintProps) {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 p-6">
        <h2 className="mb-4 text-xl font-bold">System summary</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <SummaryValue label="Announcements" value={report.announcements} />
          <SummaryValue label="Events" value={report.events} />
          <SummaryValue label="Feedback" value={report.feedback} />
          <SummaryValue label="Medicine items" value={report.medicines} />
          <SummaryValue label="Pending requests" value={report.pendingRequests} />
          <SummaryValue label="Approved requests" value={report.approvedRequests} />
          <SummaryValue label="Claimed requests" value={report.claimedRequests} />
          <SummaryValue label="Low-stock items" value={report.lowStock} />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 p-6">
        <h2 className="mb-4 text-xl font-bold">Medicine issue summary</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {issueSummary.map(([label, value]) => <SummaryValue key={label} label={label} value={value} />)}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 p-6">
        <h2 className="mb-4 text-xl font-bold">Analytics breakdown</h2>
        <div className="grid gap-6 lg:grid-cols-3">
          <div>
            <h3 className="mb-2 font-semibold">6-month activity trend</h3>
            {monthlyData.map((item) => (
              <p key={item.month} className="text-sm text-slate-600">
                {item.month}: {item.announcements} announcements, {item.events} events, {item.feedback} feedback
              </p>
            ))}
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Request status distribution</h3>
            <p className="text-sm text-slate-600">Pending: {report.pendingRequests}</p>
            <p className="text-sm text-slate-600">Approved: {report.approvedRequests}</p>
            <p className="text-sm text-slate-600">Claimed: {report.claimedRequests}</p>
            <p className="text-sm text-slate-600">Denied: {report.requestRows.filter((item) => item.status === "denied").length}</p>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Medicine stock status</h3>
            <p className="text-sm text-slate-600">In stock: {stockStatus.inStock}</p>
            <p className="text-sm text-slate-600">Low stock: {stockStatus.lowStock}</p>
            <p className="text-sm text-slate-600">Critical: {stockStatus.critical}</p>
          </div>
        </div>
      </section>

      <ReportTable
        title={`History of requests (${requestRows.length} records)`}
        headers={["Requester", "Medicine", "Quantity", "Status", "Requested At"]}
        rows={requestRows.map((item) => [
          item.requester_name || "N/A",
          item.medicines?.name || "N/A",
          item.quantity || "N/A",
          item.status || "N/A",
          item.created_at ? new Date(item.created_at).toLocaleString("en-PH") : "N/A",
        ])}
      />
      <ReportTable
        title={`Detailed inventory report (${report.medicineRows.length} items)`}
        headers={["Medicine", "Dosage", "Form", "Stock", "Expiry", "Prescription"]}
        rows={report.medicineRows.map((item) => [
          item.name || "N/A",
          item.dosage || "N/A",
          item.form || "N/A",
          item.stock ?? "N/A",
          item.expiry_date ? new Date(item.expiry_date).toLocaleDateString("en-PH") : "N/A",
          item.requires_prescription ? "Yes" : "No",
        ])}
      />
    </div>
  );
}

function SummaryValue({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-2xl font-bold text-teal-700">{value}</p>
    </div>
  );
}
