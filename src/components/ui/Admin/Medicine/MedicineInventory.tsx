"use client";

import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/supabase-client";
import { Button } from "../../Navbar/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  Edit3,
  Archive,
  Pill,
  Calendar,
  Package,
  AlertCircle,
  Shield,
  ImageOff,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Clock,
  Heart,
  Megaphone,
  MessageSquare,
} from "lucide-react";

import AddMedicineModal from "./AddMedicineModal";
import EditMedicineModal from "./EditMedicineModal";
import ArchiveMedicineDialog from "./ArchiveMedicineDialog";

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
    { to: "/admin/medicine-inventory", label: "Medicine Inventory", icon: <Shield size={20} /> },
    { to: "/admin/medicine-requests", label: "Medicine Requests", icon: <Heart size={20} /> },
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50/30 to-cyan-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading medicines...</p>
        </div>
      </div>
    );
  }

  return (
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

      <AdminNavbar />

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

        {/* Medicines Grid */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {medicines.map((item) => (
              <Card
                key={item.id}
                className="bg-white/90 backdrop-blur-sm border-2 border-gray-200 hover:border-emerald-300 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden"
              >
                <CardContent className="p-0">
                  {/* Medicine Image */}
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                      <ImageOff className="text-emerald-300 w-16 h-16" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    {/* Header with Stock Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-gray-900 text-lg leading-tight flex-1">
                        {item.name}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                          item.stock < 10
                            ? "bg-red-100 text-red-700"
                            : item.stock < 30
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {item.stock} in stock
                      </span>
                    </div>

                    {/* Dosage & Form */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Pill size={16} className="text-emerald-500" />
                      <span className="font-medium">{item.dosage}</span>
                      <span className="text-gray-400">•</span>
                      <span>{item.form}</span>
                    </div>

                    {/* Expiry Date */}
                    {item.expiry_date && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar size={16} className="text-red-500" />
                        <span className="text-red-700 font-medium">
                          Expires: {new Date(item.expiry_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    {/* Prescription Badge */}
                    {item.requires_prescription && (
                      <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
                        <Shield size={16} className="text-blue-600" />
                        <span className="text-xs font-semibold text-blue-700">
                          Requires Prescription
                        </span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-3 border-t border-gray-100">
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedMedicine(item);
                          setEditOpen(true);
                        }}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Edit3 size={14} />
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedMedicine(item);
                          setArchiveOpen(true);
                        }}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Archive size={14} />
                        Archive
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
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
  );
}