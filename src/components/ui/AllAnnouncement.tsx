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
      <div className="flex flex-col min-h-[calc(100vh-4rem)]">
        {/* Main content */}
        <div className="flex-grow">
          {/* Header row with Home button */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold border-l-4 border-[#f9a825] pl-3">
              📢 All Advisories & Announcements
            </h2>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-[#162942] text-white rounded hover:bg-[#1e3a5f] transition-colors"
            >
              Home
            </button>
          </div>

          <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-lg shadow-inner">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loading
                ? [...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm"
                    >
                      <Skeleton className="w-full h-36" />
                      <div className="p-4 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
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
                      className="cursor-pointer bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      {announcement.image_url ? (
                        <img
                          src={announcement.image_url}
                          alt={announcement.title}
                          className="w-full h-36 object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-36 text-gray-400 text-sm bg-gray-100">
                          No image
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="text-base font-semibold text-gray-900 leading-snug line-clamp-2">
                          {announcement.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {announcement.content}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {format(
                            new Date(announcement.created_at),
                            "MMMM d, yyyy"
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
            </div>

            {/* Numbered pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  ← Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (num) => (
                    <button
                      key={num}
                      onClick={() => setPage(num)}
                      className={`px-3 py-1 rounded ${
                        num === page
                          ? "bg-[#162942] text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      {num}
                    </button>
                  )
                )}

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="py-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Your Site Name
        </footer>
      </div>
    </PageLayout>
  );
}
