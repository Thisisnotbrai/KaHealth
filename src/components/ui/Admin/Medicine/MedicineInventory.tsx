"use client";

import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/supabase-client";
import AdminLayout from "../../AdminLayout";
import { Button } from "../../Navbar/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Edit3,
  Archive,
  Pill,
  Package,
  AlertCircle,
  Shield,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Clock,
  Heart,
  Megaphone,
  MessageSquare,
  ScrollText,
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import AddMedicineModal from "./AddMedicineModal";
import EditMedicineModal from "./EditMedicineModal";
import ArchiveMedicineDialog from "./ArchiveMedicineDialog";

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

export default function MedicineInventory() {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal controls
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);

  const [selectedMedicine, setSelectedMedicine] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [dosageFormFilter, setDosageFormFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [expiryDateFilter, setExpiryDateFilter] = useState("");
  const [prescriptionFilter, setPrescriptionFilter] = useState("all");
  const pageSize = 10;
  const hasActiveFilters =
    Boolean(searchQuery) ||
    Boolean(dosageFormFilter) ||
    stockFilter !== "all" ||
    Boolean(expiryDateFilter) ||
    prescriptionFilter !== "all";

  const clearAllFilters = () => {
    setSearchQuery("");
    setDosageFormFilter("");
    setStockFilter("all");
    setExpiryDateFilter("");
    setPrescriptionFilter("all");
    setCurrentPage(1);
  };

  const fetchMedicines = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("medicines")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setMedicines(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  // Calculate stats
  const totalMedicines = medicines.length;
  const lowStock = medicines.filter((m) => m.stock < 10).length;
  const requiresPrescription = medicines.filter((m) => m.requires_prescription).length;
  const filteredMedicines = medicines.filter((medicine) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query || String(medicine.name || "").toLowerCase().includes(query);
    const dosageFormQuery = dosageFormFilter.trim().toLowerCase();
    const matchesDosageForm =
      !dosageFormQuery ||
      [medicine.dosage, medicine.form]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(dosageFormQuery));
    const stock = Number(medicine.stock) || 0;
    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "in_stock" && stock > 0) ||
      (stockFilter === "low_stock" && stock > 0 && stock < 10) ||
      (stockFilter === "out_of_stock" && stock === 0);
    const matchesExpiry =
      !expiryDateFilter ||
      String(medicine.expiry_date || "").slice(0, 10) === expiryDateFilter;
    const matchesPrescription =
      prescriptionFilter === "all" ||
      (prescriptionFilter === "required" && medicine.requires_prescription) ||
      (prescriptionFilter === "not_required" && !medicine.requires_prescription);

    return (
      matchesSearch &&
      matchesDosageForm &&
      matchesStock &&
      matchesExpiry &&
      matchesPrescription
    );
  });
  const totalPages = Math.ceil(filteredMedicines.length / pageSize);
  const paginatedMedicines = filteredMedicines.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, dosageFormFilter, stockFilter, expiryDateFilter, prescriptionFilter]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  if (loading) {
    return (
      <AdminLayout>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50/30 to-cyan-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading medicines...</p>
        </div>
      </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50/30 to-cyan-50">
      {/* Philippine Standard Time top bar */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Clock size={18} className="text-white" />
              </div>
              <div>
                <span className="font-semibold text-base sm:text-lg">Philippine Standard Time</span>
                <div className="text-emerald-100 text-xs sm:text-sm">Medicine Inventory System</div>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-lg sm:text-xl font-bold">
                {new Date().toLocaleString("en-PH", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "2-digit",
                  hour: "numeric",
                  minute: "numeric",
                  second: "numeric",
                  hour12: true,
                  timeZone: "Asia/Manila",
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-4 sm:p-6 lg:p-8 mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-3 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl shadow-lg">
                <Pill className="text-white w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Medicine Inventory
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  Manage your barangay health center medicines
                </p>
              </div>
            </div>

            <Button
              onClick={() => setAddOpen(true)}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Add Medicine
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-600 rounded-lg">
                  <Package className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-xs font-medium text-emerald-600 uppercase tracking-wide">
                    Total Medicines
                  </p>
                  <p className="text-2xl font-bold text-emerald-900">{totalMedicines}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-600 rounded-lg">
                  <AlertCircle className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-xs font-medium text-amber-600 uppercase tracking-wide">
                    Low Stock
                  </p>
                  <p className="text-2xl font-bold text-amber-900">{lowStock}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Shield className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                    Prescription Required
                  </p>
                  <p className="text-2xl font-bold text-blue-900">{requiresPrescription}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Medicine Filter and Table */}
        <div className="space-y-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Filter by medicine name, dosage, form, stock, or expiry date..."
                  aria-label="Filter medicines"
                  className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 text-sm text-gray-800 placeholder:text-gray-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilterOpen((open) => !open)}
                className={`h-10 gap-2 text-gray-700 ${filterOpen ? "border-emerald-500 bg-emerald-50 text-emerald-700" : ""}`}
                aria-expanded={filterOpen}
              >
                <SlidersHorizontal size={16} />
                Filter
              </Button>
              {searchQuery && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="h-10 text-gray-700"
                >
                  Clear
                </Button>
              )}
            </div>
            {filterOpen && (
              <div className="mt-4 grid grid-cols-1 gap-3 border-t border-gray-200 pt-4 sm:grid-cols-2 lg:grid-cols-4">
                <input
                  type="search"
                  value={dosageFormFilter}
                  onChange={(event) => setDosageFormFilter(event.target.value)}
                  placeholder="Dosage & form"
                  aria-label="Filter by dosage and form"
                  className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 placeholder:text-gray-500 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                />
                <select
                  value={stockFilter}
                  onChange={(event) => setStockFilter(event.target.value)}
                  aria-label="Filter by stock"
                  className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                >
                  <option value="all">All stock</option>
                  <option value="in_stock">In stock</option>
                  <option value="low_stock">Low stock (1-9)</option>
                  <option value="out_of_stock">Out of stock</option>
                </select>
                <input
                  type="date"
                  value={expiryDateFilter}
                  onChange={(event) => setExpiryDateFilter(event.target.value)}
                  aria-label="Filter by expiry date"
                  className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                />
                <select
                  value={prescriptionFilter}
                  onChange={(event) => setPrescriptionFilter(event.target.value)}
                  aria-label="Filter by prescription"
                  className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                >
                  <option value="all">All prescriptions</option>
                  <option value="required">Prescription required</option>
                  <option value="not_required">No prescription</option>
                </select>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  disabled={!hasActiveFilters}
                  className="h-10 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 sm:col-span-2 lg:col-span-1"
                >
                  Remove all filters
                </Button>
              </div>
            )}
          </div>

          {medicines.length === 0 ? (
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Pill className="text-emerald-400 w-10 h-10" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No medicines yet</h3>
            <p className="text-gray-500 mb-6">Add your first medicine to get started</p>
            <Button
              onClick={() => setAddOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Add Medicine
            </Button>
          </div>
          ) : (
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
            <div className="overflow-x-auto">
              {filteredMedicines.length === 0 ? (
                <div className="p-10 text-center">
                  <Search className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                  <h3 className="font-semibold text-gray-700">No medicines found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try changing your search or filter criteria.
                  </p>
                </div>
              ) : (
                <Table className="min-w-[900px] table-fixed">
                  <colgroup>
                    <col className="w-[28%]" />
                    <col className="w-[18%]" />
                    <col className="w-[10%]" />
                    <col className="w-[14%]" />
                    <col className="w-[15%]" />
                    <col className="w-[15%]" />
                  </colgroup>
                  <TableHeader className="bg-emerald-50/80">
                    <TableRow>
                      <TableHead>Medicine</TableHead>
                      <TableHead>Dosage & Form</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead className="whitespace-nowrap">Prescription</TableHead>
                      <TableHead className="whitespace-nowrap">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedMedicines.map((item) => (
                      <TableRow key={item.id}>
                      <TableCell className="min-w-[220px]">
                        <div className="flex items-center gap-3">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt=""
                              className="h-10 w-10 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                              <Pill className="h-5 w-5 text-emerald-600" />
                            </div>
                          )}
                          <span className="font-semibold text-gray-900">{item.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-gray-600">
                        {item.dosage || "—"} <span className="text-gray-400">•</span>{" "}
                        {item.form || "—"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            item.stock < 10
                              ? "bg-red-100 text-red-700"
                              : item.stock < 30
                              ? "bg-amber-100 text-amber-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {item.stock ?? 0}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-gray-600">
                        {item.expiry_date
                          ? new Date(item.expiry_date).toLocaleDateString()
                          : "—"}
                      </TableCell>
                      <TableCell>
                        {item.requires_prescription ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700">
                            <Shield size={14} /> Required
                          </span>
                        ) : (
                          <span className="text-gray-500">Not required</span>
                        )}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex justify-start gap-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedMedicine(item);
                              setEditOpen(true);
                            }}
                            className="bg-emerald-600 text-white hover:bg-emerald-700"
                          >
                            <Edit3 size={14} />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedMedicine(item);
                              setArchiveOpen(true);
                            }}
                            className="bg-amber-600 text-white hover:bg-amber-700"
                          >
                            <Archive size={14} />
                            <span className="hidden sm:inline">Archive</span>
                          </Button>
                        </div>
                      </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 px-4 py-4">
                <p className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * pageSize + 1}-
                  {Math.min(currentPage * pageSize, filteredMedicines.length)} of{" "}
                  {filteredMedicines.length}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((page) => page - 1)}
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <span className="text-sm font-medium text-gray-700">
                    Page {currentPage} of {Math.max(totalPages, 1)}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((page) => page + 1)}
                    aria-label="Next page"
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            )}
          </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddMedicineModal
        open={addOpen}
        setOpen={setAddOpen}
        onAdded={fetchMedicines}
      />

      <EditMedicineModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        medicine={selectedMedicine}
        onSave={fetchMedicines}
      />

      <ArchiveMedicineDialog
        open={archiveOpen}
        setOpen={setArchiveOpen}
        medicine={selectedMedicine}
        onArchived={fetchMedicines}
      />
    </div>
    </AdminLayout>
  );
}