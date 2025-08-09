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

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching announcements:", error);
    } else {
      setAnnouncements(data || []);
    }
    setLoading(false);
  };

  const displayedAnnouncements = showAll
    ? announcements
    : announcements.slice(0, 4);

  return (
    <section className="max-w-6xl mx-auto">
      {/* Heading */}
      <div className="flex items-center justify-between mb-6 border-b-2 border-[#00623B] pb-2">
        <h2 className="text-xl font-bold text-[#00623B]">📢 Advisories</h2>
        {announcements.length > 4 && (
          <button
            onClick={() => navigate("/announcements")}
            className="text-sm font-semibold text-[#00623B] hover:underline"
          >
            Read More
          </button>
        )}
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading
          ? [...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm"
              >
                <Skeleton className="w-full h-44" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))
          : displayedAnnouncements.map((announcement) => (
              <div
                key={announcement.id}
                onClick={() => navigate(`/announcement/${announcement.id}`)}
                className="cursor-pointer bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                {announcement.image_url ? (
                  <img
                    src={announcement.image_url}
                    alt={announcement.title}
                    className="w-full h-44 object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-44 text-gray-400 text-sm bg-gray-100">
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
                    {format(new Date(announcement.created_at), "MMMM d, yyyy")}
                  </p>
                </div>
              </div>
            ))}
      </div>
    </section>
  );
}
