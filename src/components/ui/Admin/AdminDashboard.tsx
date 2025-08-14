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
    { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { to: "/announcements", label: "Announcements", icon: <Bell size={18} /> },
    { to: "/posts", label: "Posts", icon: <FileText size={18} /> },
    { to: "/settings", label: "Settings", icon: <Settings size={18} /> },
  ];


  
  return (
    <header className="sticky top-0 z-50 shadow-md backdrop-blur-md bg-white/80 dark:bg-[#162942]/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo / Title */}
        <h1 className="text-lg font-bold text-[#162942] dark:text-white">
          Admin Panel
        </h1>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-1 font-medium transition ${
                pathname === link.to
                  ? "text-[#f9a825] dark:text-[#f9a825]"
                  : "text-[#162942] dark:text-gray-200 hover:text-[#f9a825]"
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = "/admin/login";
            }}
            className="flex items-center gap-1 text-red-600 dark:text-red-400 hover:text-red-700"
          >
            <LogOut size={18} /> Logout
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-lg text-[#162942] dark:text-white"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-[#162942] shadow-md">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`block px-4 py-2 border-b border-gray-200 dark:border-white/10 ${
                pathname === link.to
                  ? "bg-[#f9a825]/10 text-[#f9a825]"
                  : "hover:bg-gray-100 dark:hover:bg-white/10"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = "/admin/login";
            }}
            className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-white/10"
          >
            Logout
          </button>
        </div>
      )}
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

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen">
      <AdminNavbar />

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Post Form */}
        <div className="space-y-4 border border-gray-700 p-6 rounded-xl shadow-sm bg-gray-800">
          <h2 className="text-xl font-bold">Post Announcement</h2>
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-gray-700 text-white border-gray-600"
          />
          <Textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="bg-gray-700 text-white border-gray-600"
          />
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Image
            </label>
            <div className="flex items-center gap-4">
              <label
                htmlFor="post-image"
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-600 transition"
              >
                Select Image
              </label>
              <input
                id="post-image"
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="hidden"
              />
              {image && (
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="w-14 h-14 object-cover rounded-lg border border-gray-600"
                />
              )}
            </div>
          </div>
          <Button
            onClick={handlePost}
            disabled={loading}
            className="transition hover:scale-105 w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? "Posting..." : "Post"}
          </Button>
        </div>

        {/* Announcements Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={toggleSelectAll}
              className="w-4 h-4 accent-blue-600"
            />
            <span className="text-sm">Select All</span>
          </div>
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-300">
                {selectedIds.length} selected
              </span>
              <Button
                onClick={handleDeleteSelected}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete Selected
              </Button>
            </div>
          )}
        </div>

        {/* Announcements List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentAnnouncements.map((a) => (
            <div
              key={a.id}
              className={`relative border rounded-lg shadow-sm transition bg-gray-800 flex flex-col justify-between max-w-sm w-full mx-auto ${
                selectedIds.includes(a.id)
                  ? "border-blue-500 ring-2 ring-blue-500/30"
                  : "border-gray-700"
              }`}
            >
              <div className="absolute top-2 left-2">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(a.id)}
                  onChange={() => toggleSelect(a.id)}
                  className="w-4 h-4 accent-blue-600"
                />
              </div>
              {a.image_url ? (
                <img
                  src={a.image_url}
                  alt={a.title}
                  className="w-full h-36 object-cover rounded-t-lg"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-36 bg-gray-700 text-gray-500 text-sm rounded-t-lg">
                  No image
                </div>
              )}
              <div className="flex flex-col justify-between flex-1 p-3">
                <div>
                  <h3 className="font-semibold text-md line-clamp-2 break-words">
                    {a.title}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-3 break-words">
                    {a.content}
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(a.created_at), {
                      addSuffix: true,
                    })}
                  </span>
                  <Button
                    size="sm"
                    className="bg-blue-600 text-white hover:bg-blue-700 transition"
                    onClick={() => openEditModal(a)}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center space-x-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              onClick={() => setCurrentPage(page)}
              className={
                page === currentPage
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600"
              }
            >
              {page}
            </Button>
          ))}
        </div>

        {/* Edit Modal */}
        {editDialogOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md space-y-4">
              <h2 className="text-xl font-bold">Edit Announcement</h2>
              <Input
                placeholder="Title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="bg-gray-700 text-white border-gray-600"
              />
              <Textarea
                placeholder="Content"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="bg-gray-700 text-white border-gray-600"
              />
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Image
                </label>
                <div className="flex items-center gap-4">
                  <label
                    htmlFor="edit-image"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-600 transition"
                  >
                    Select Image
                  </label>
                  <input
                    id="edit-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditImage(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  {editImage && (
                    <img
                      src={URL.createObjectURL(editImage)}
                      alt="Preview"
                      className="w-14 h-14 object-cover rounded-lg border border-gray-600"
                    />
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  onClick={() => setEditDialogOpen(false)}
                  className="bg-gray-600 hover:bg-gray-500"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleEditSave}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
