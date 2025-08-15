import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/supabase-client";
import { Button } from "../Navbar/button";
import { Input } from "../Input";
import { Textarea } from "../Textarea";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { toast } from "sonner";
import {
  LayoutDashboard,
  FileText,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  Plus,
  Edit3,
  Trash2,
  Clock,
  Users,
  Activity
} from "lucide-react";

// Types
interface Announcement {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
}

// Admin Navbar
function AdminNavbar() {
  const location = useLocation();
  const pathname = location.pathname;
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { to: "/announcements", label: "Announcements", icon: <Bell size={20} /> },
    { to: "/posts", label: "Posts", icon: <FileText size={20} /> },
    { to: "/settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Enhanced Logo / Title */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <LayoutDashboard className="text-white" size={22} />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Barangay Admin</h1>
              <p className="text-sm text-gray-500">Management System</p>
            </div>
          </div>

          {/* Enhanced Desktop Menu */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 hover:scale-105 ${
                  pathname === link.to
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-200"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {link.icon}
                <span className="font-medium">{link.label}</span>
              </Link>
            ))}
            <div className="ml-4 pl-4 border-l border-gray-200">
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.href = "/admin/login";
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 font-medium"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </nav>

          {/* Enhanced Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Enhanced Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-100">
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    pathname === link.to
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {link.icon}
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}
              <div className="pt-2 mt-2 border-t border-gray-100">
                <button
                  onClick={async () => {
                    await supabase.auth.signOut();
                    window.location.href = "/admin/login";
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 font-medium"
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

export default function AdminDashboard() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const announcementsPerPage = 4;

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Added time state for Philippine Standard Time bar
  const [currentTime, setCurrentTime] = useState(new Date());

  const indexOfLast = currentPage * announcementsPerPage;
  const indexOfFirst = indexOfLast - announcementsPerPage;
  const currentAnnouncements = announcements.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.max(
    1,
    Math.ceil(announcements.length / announcementsPerPage)
  );

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Timer effect for live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (currentAnnouncements.length === 0) {
      setSelectAll(false);
      return;
    }
    const allSelected = currentAnnouncements.every((a) =>
      selectedIds.includes(a.id)
    );
    setSelectAll(allSelected);
  }, [selectedIds, currentPage, announcements]);

  async function fetchAnnouncements() {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setAnnouncements(data);
      setSelectedIds([]);
      setSelectAll(false);
    }
  }

  function toggleSelect(id: number) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function toggleSelectAll() {
    if (selectAll) {
      setSelectedIds((prev) =>
        prev.filter((id) => !currentAnnouncements.some((a) => a.id === id))
      );
      setSelectAll(false);
    } else {
      setSelectedIds((prev) => {
        const visibleIds = currentAnnouncements.map((a) => a.id);
        return Array.from(new Set([...prev, ...visibleIds]));
      });
      setSelectAll(true);
    }
  }

  async function handleDeleteSelected() {
    if (selectedIds.length === 0) return toast("No announcements selected.");
    if (!confirm(`Delete ${selectedIds.length} announcement(s)?`)) return;

    const { error } = await supabase
      .from("announcements")
      .delete()
      .in("id", selectedIds);

    if (!error) {
      toast(`${selectedIds.length} announcement(s) deleted.`);
      setSelectedIds([]);
      setSelectAll(false);
      fetchAnnouncements();
    } else {
      toast("Error deleting announcements.");
    }
  }

  async function uploadImage(file: File) {
    const fileName = `${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("announcement-images")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from("announcement-images")
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  async function handlePost() {
    if (!title.trim() || !content.trim())
      return toast("Please fill all fields.");
    setLoading(true);

    try {
      const imageUrl = image ? await uploadImage(image) : null;
      const { error } = await supabase
        .from("announcements")
        .insert([{ title, content, image_url: imageUrl }]);

      if (error) throw error;

      toast("Announcement posted successfully!");
      resetPostForm();
      fetchAnnouncements();
    } catch {
      toast("Error posting announcement.");
    } finally {
      setLoading(false);
    }
  }

  function resetPostForm() {
    setTitle("");
    setContent("");
    setImage(null);
  }

  function openEditModal(a: Announcement) {
    setEditId(a.id);
    setEditTitle(a.title);
    setEditContent(a.content);
    setEditImage(null);
    setEditDialogOpen(true);
  }

  async function handleEditSave() {
    if (editId === null) return;
    try {
      const imageUrl = editImage ? await uploadImage(editImage) : null;
      const { error } = await supabase
        .from("announcements")
        .update({
          title: editTitle,
          content: editContent,
          ...(imageUrl && { image_url: imageUrl }),
        })
        .eq("id", editId);

      if (error) throw error;
      toast("Announcement updated successfully.");
      setEditDialogOpen(false);
      fetchAnnouncements();
    } catch {
      toast("Error updating announcement.");
    }
  }

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
    <div className="bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100 min-h-screen">
      {/* Enhanced Philippine Standard Time top bar */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Clock size={20} className="text-white" />
              </div>
              <div>
                <span className="font-semibold text-lg">Philippine Standard Time</span>
                <div className="text-blue-100 text-sm">Republic of the Philippines</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold">{formattedTime}</div>
            </div>
          </div>
        </div>
      </div>

      <AdminNavbar />

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <Bell className="text-white" size={28} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Announcements</p>
                <p className="text-3xl font-bold text-gray-900">{announcements.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                <Activity className="text-white" size={28} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Active Posts</p>
                <p className="text-3xl font-bold text-gray-900">{announcements.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                <Users className="text-white" size={28} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">This Month</p>
                <p className="text-3xl font-bold text-gray-900">{announcements.filter(a => new Date(a.created_at).getMonth() === new Date().getMonth()).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Post Form */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
              <Plus className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Create New Announcement</h2>
              <p className="text-gray-600">Share important updates with your barangay community</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Announcement Title</label>
              <Input
                placeholder="Enter a clear and descriptive title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Content</label>
              <Textarea
                placeholder="Write your announcement content here. Be clear and informative..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all min-h-32 text-base leading-relaxed"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Image (Optional)
                <span className="text-gray-500 font-normal ml-2">- Add an image to make your announcement more engaging</span>
              </label>
              <div className="flex items-center gap-6">
                <label
                  htmlFor="post-image"
                  className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-2 border-gray-300 rounded-xl cursor-pointer hover:from-gray-200 hover:to-gray-300 transition-all font-medium shadow-sm"
                >
                  <Plus size={20} />
                  Choose Image
                </label>
                <input
                  id="post-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                  className="hidden"
                />
                {image && (
                  <div className="relative group">
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-xl border-2 border-gray-200 shadow-lg"
                    />
                    <button
                      onClick={() => setImage(null)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="pt-4">
              <Button
                onClick={handlePost}
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Publishing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Plus size={20} />
                    Publish Announcement
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Announcements Header */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Recent Announcements</h2>
              <p className="text-gray-600 mt-1">Manage your community updates</p>
            </div>
            <div className="flex items-center gap-4">
              {currentAnnouncements.length > 0 && (
                <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                    className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Select All</span>
                </div>
              )}
              {selectedIds.length > 0 && (
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 px-3 py-2 rounded-lg">
                    <span className="text-sm font-semibold text-blue-800">
                      {selectedIds.length} selected
                    </span>
                  </div>
                  <Button
                    onClick={handleDeleteSelected}
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                  >
                    <Trash2 size={16} />
                    Delete Selected
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Announcements List */}
          {announcements.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Bell className="text-gray-400" size={40} />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No announcements yet</h3>
              <p className="text-gray-500">Create your first announcement to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentAnnouncements.map((a) => (
                <div
                  key={a.id}
                  className={`relative bg-white/80 backdrop-blur-sm border-2 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] max-w-md w-full mx-auto ${
                    selectedIds.includes(a.id)
                      ? "border-blue-400 ring-4 ring-blue-100 shadow-blue-200"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="absolute top-4 left-4 z-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(a.id)}
                      onChange={() => toggleSelect(a.id)}
                      className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 bg-white"
                    />
                  </div>
                  
                  {a.image_url ? (
                    <img
                      src={a.image_url}
                      alt={a.title}
                      className="w-full h-48 object-cover rounded-t-2xl"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400 rounded-t-2xl">
                      <FileText size={56} />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 text-xl mb-3 line-clamp-2 leading-tight">
                      {a.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                      {a.content}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock size={14} />
                        <span className="font-medium">
                          {formatDistanceToNow(new Date(a.created_at), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                        onClick={() => openEditModal(a)}
                      >
                        <Edit3 size={14} />
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8 pt-8 border-t border-gray-200">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  onClick={() => setCurrentPage(page)}
                  className={`w-12 h-12 rounded-xl font-semibold transition-all duration-300 ${
                    page === currentPage
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl"
                      : "bg-white/80 text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Enhanced Edit Modal */}
        {editDialogOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl w-full max-w-lg shadow-2xl border border-white/50">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl">
                      <Edit3 className="text-white" size={20} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Edit Announcement</h2>
                  </div>
                  <button
                    onClick={() => setEditDialogOpen(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                    <Input
                      placeholder="Title"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Content</label>
                    <Textarea
                      placeholder="Content"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all min-h-24"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Image</label>
                    <div className="flex items-center gap-4">
                      <label
                        htmlFor="edit-image"
                        className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-2 border-gray-300 rounded-xl cursor-pointer hover:from-gray-200 hover:to-gray-300 transition-all font-medium"
                      >
                        <Plus size={16} />
                        Choose Image
                      </label>
                      <input
                        id="edit-image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setEditImage(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      {editImage && (
                        <div className="relative group">
                          <img
                            src={URL.createObjectURL(editImage)}
                            alt="Preview"
                            className="w-16 h-16 object-cover rounded-xl border-2 border-gray-200 shadow-lg"
                          />
                          <button
                            onClick={() => setEditImage(null)}
                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                  <Button
                    onClick={() => setEditDialogOpen(false)}
                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-200 hover:border-gray-300 rounded-xl font-semibold transition-all duration-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleEditSave}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}