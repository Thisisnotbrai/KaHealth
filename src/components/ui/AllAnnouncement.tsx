import PageLayout from "@/components/ui/PageLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabase-client";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface AnnouncementData {
  id: number;
  title: string;
  content: string;
  created_at: string;
  image_url?: string;
}

export default function AllAnnouncement() {
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const pageSize = 6;

  useEffect(() => {
    fetchAnnouncements();
  }, [page]);

  const fetchAnnouncements = async () => {
    setLoading(true);

    const { count } = await supabase
      .from("announcements")
      .select("*", { count: "exact", head: true });

    if (count) setTotal(count);

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (!error) setAnnouncements(data || []);
    setLoading(false);
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <PageLayout>
      <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-white to-green-50">
        {/* Main content */}
        <div className="flex-grow px-4 sm:px-6 lg:px-8 py-6">
          {/* Header section with improved health styling */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🏥</span>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 leading-tight">
                  Health Advisories & Announcements
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  Stay informed with the latest health updates
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/")}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl hover:from-blue-700 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
            >
              🏠 Back to Home
            </button>
          </div>

          {/* Enhanced content area */}
          <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-2xl shadow-xl border border-white/20">
            {/* Statistics bar */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-100 to-green-100 rounded-xl border-l-4 border-blue-500">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <p className="text-sm font-medium text-gray-700">
                  📊 Total Announcements: <span className="font-bold text-blue-600">{total}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Page {page} of {totalPages}
                </p>
              </div>
            </div>

            {/* Responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
              {loading
                ? [...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-lg"
                    >
                      <Skeleton className="w-full h-44 sm:h-48" />
                      <div className="p-4 sm:p-5 space-y-3">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))
                : announcements.map((announcement) => (
                    <div
                      key={announcement.id}
                      onClick={() =>
                        navigate(`/announcement/${announcement.id}`)
                      }
                      className="group cursor-pointer bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <div className="relative overflow-hidden">
                        {announcement.image_url ? (
                          <img
                            src={announcement.image_url}
                            alt={announcement.title}
                            className="w-full h-44 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-44 sm:h-48 bg-gradient-to-br from-blue-100 to-green-100">
                            <div className="text-center">
                              <div className="text-4xl mb-2">🏥</div>
                              <p className="text-sm text-gray-500 font-medium">Health Advisory</p>
                            </div>
                          </div>
                        )}
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                          <span className="text-xs font-medium text-gray-600">
                            {format(new Date(announcement.created_at), "MMM d")}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-4 sm:p-5">
                        <h3 className="text-base sm:text-lg font-bold text-gray-800 leading-snug line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                          {announcement.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-3 mb-3 leading-relaxed">
                          {announcement.content}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>📅</span>
                            <span className="font-medium">
                              {format(
                                new Date(announcement.created_at),
                                "MMMM d, yyyy"
                              )}
                            </span>
                          </div>
                          <div className="text-blue-500 group-hover:translate-x-1 transition-transform">
                            <span className="text-sm">→</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>

            {/* Enhanced pagination */}
            {!loading && totalPages > 1 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-center items-center gap-2 flex-wrap">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm"
                  >
                    <span className="hidden sm:inline">← Previous</span>
                    <span className="sm:hidden">←</span>
                  </button>

                  <div className="flex items-center gap-1 mx-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((num) => {
                        // Show first page, last page, current page, and 2 pages around current
                        return (
                          num === 1 ||
                          num === totalPages ||
                          (num >= page - 1 && num <= page + 1)
                        );
                      })
                      .map((num, idx, arr) => (
                        <div key={num} className="flex items-center">
                          {idx > 0 && arr[idx - 1] !== num - 1 && (
                            <span className="px-2 text-gray-400">...</span>
                          )}
                          <button
                            onClick={() => setPage(num)}
                            className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                              num === page
                                ? "bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg"
                                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
                            }`}
                          >
                            {num}
                          </button>
                        </div>
                      ))}
                  </div>

                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm"
                  >
                    <span className="hidden sm:inline">Next →</span>
                    <span className="sm:hidden">→</span>
                  </button>
                </div>
                
                {/* Mobile page indicator */}
                <div className="sm:hidden text-center mt-4">
                  <span className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                  </span>
                </div>
              </div>
            )}

            {/* Empty state */}
            {!loading && announcements.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🏥</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No announcements yet
                </h3>
                <p className="text-gray-600">
                  Check back later for health updates and advisories.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced footer */}
        <footer className="mt-8 py-6 text-center">
          <div className="max-w-md mx-auto px-6 py-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} Health Information System
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Keeping you informed and healthy 💙
            </p>
          </div>
        </footer>
      </div>
    </PageLayout>
  );
}