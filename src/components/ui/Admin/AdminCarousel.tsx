import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/supabase-client";
import { uploadCarouselImage } from "@/lib/CarouselService";
import { deleteCarouselImage } from "@/lib/CarouselService";
import { Button } from "../Navbar/button";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { toast } from "sonner";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Plus,
  Trash2,
  Clock,
  Heart,
  TrendingUp,
  MessageCircle,
  ImageIcon,
  Upload,
  Eye,
  Activity
} from "lucide-react";

interface CarouselImage {
  id: string;
  image_url: string;
  created_at: string;
}

// Admin Navbar Component
function AdminNavbar() {
  const location = useLocation();
  const pathname = location.pathname;
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { to: "/admin/feedback", label: "User Feedback", icon: <MessageCircle size={20} /> },
    { to: "/admin/events", label: "Events", icon: <Clock size={20} /> },
    { to: "/admin/carousel", label: "Carousel", icon: <ImageIcon size={20} /> },
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

const AdminCarousel = () => {
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Timer effect for live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchImages = async () => {
    const { data, error } = await supabase
      .from("carousel_images")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error.message);
      toast("Error fetching carousel images.");
    } else {
      setImages(data || []);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpload = async () => {
    if (!file) return toast("Please select an image.");
    setLoading(true);

    try {
      await uploadCarouselImage(file);
      setFile(null);
      toast("Carousel image uploaded successfully!");
      fetchImages();
    } catch (err) {
      console.error(err);
      toast("Error uploading carousel image.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm("Delete this carousel image?")) return;

    try {
      await deleteCarouselImage(id, imageUrl);
      toast("Carousel image deleted successfully.");
      fetchImages();
    } catch (err) {
      console.error(err);
      toast("Error deleting carousel image.");
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
                <div className="text-emerald-100 text-xs sm:text-sm">Carousel Management System</div>
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
        {/* Enhanced Stats Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 lg:mb-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                <ImageIcon className="text-white" size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide truncate">Carousel Images</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{images.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
                <Activity className="text-white" size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide truncate">Active Banners</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{images.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg">
                <TrendingUp className="text-white" size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide truncate">This Month</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{images.filter(img => new Date(img.created_at).getMonth() === new Date().getMonth()).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl shadow-lg">
                <Eye className="text-white" size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide truncate">Display Ready</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{images.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Carousel Manager Section */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 lg:mb-8">
            <div className="p-3 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl shadow-lg">
              <ImageIcon className="text-white w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Health Banner Carousel Manager</h2>
              <p className="text-sm sm:text-base text-gray-600 mt-1">Upload and manage homepage health awareness banners and promotional images</p>
            </div>
          </div>

          {/* Enhanced Upload Section */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-4 sm:p-6 mb-6 lg:mb-8 border-2 border-purple-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg">
                <Upload className="text-white" size={18} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Upload New Health Banner</h3>
            </div>
            
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
              <div className="flex-1">
                <label
                  htmlFor="carousel-image"
                  className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-white to-gray-50 text-gray-700 border-2 border-purple-200 rounded-xl cursor-pointer hover:from-purple-50 hover:to-indigo-50 hover:border-purple-300 transition-all font-medium shadow-sm group w-full sm:w-auto"
                >
                  <Plus size={20} className="group-hover:scale-110 transition-transform" />
                  <span className="text-sm sm:text-base">Choose Health Banner Image</span>
                </label>
                <input
                  id="carousel-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <p className="text-xs text-gray-500 mt-2 text-center sm:text-left">Recommended: 1920x600px for optimal banner display</p>
              </div>
              
              {file && (
                <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-6 bg-white/80 rounded-xl p-4 border border-purple-200">
                  <div className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Health banner preview"
                      className="w-24 h-16 sm:w-28 sm:h-20 object-cover rounded-xl border-2 border-gray-200 shadow-lg group-hover:shadow-xl transition-shadow"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-xl transition-colors flex items-center justify-center">
                      <Eye className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium text-gray-700 text-center sm:text-left">{file.name}</p>
                    <Button
                      onClick={handleUpload}
                      disabled={loading}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Uploading Banner...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Upload size={16} />
                          Upload Health Banner
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Carousel Images Grid */}
          {images.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-purple-100 to-indigo-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="text-purple-400 w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No health banners yet</h3>
              <p className="text-sm sm:text-base text-gray-500">Upload your first health awareness banner to get started</p>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Activity className="text-purple-600" size={20} />
                <h3 className="text-lg font-semibold text-gray-900">Active Health Banners ({images.length})</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {images.map((img) => (
                  <div
                    key={img.id}
                    className="relative group bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden border-2 border-gray-200 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                  >
                    <div className="relative">
                      <img
                        src={img.image_url}
                        alt="Health banner"
                        className="w-full h-32 sm:h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Enhanced Delete Button */}
                      <button
                        onClick={() => handleDelete(img.id, img.image_url)}
                        className="absolute top-3 right-3 p-2 bg-red-500/90 backdrop-blur-sm text-white rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-600 hover:scale-110"
                        title="Delete health banner"
                      >
                        <Trash2 size={16} />
                      </button>

                      {/* Image Info Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex items-center gap-2">
                          <Clock size={14} />
                          <span className="text-xs font-medium">
                            {formatDistanceToNow(new Date(img.created_at), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Health Banner Badge */}
                    <div className="absolute top-3 left-3 px-2 py-1 bg-purple-600/90 backdrop-blur-sm text-white text-xs font-semibold rounded-lg shadow-lg">
                      Health Banner
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminCarousel;