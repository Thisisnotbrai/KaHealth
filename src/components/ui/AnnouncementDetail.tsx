import PageLayout from "@/components/ui/PageLayout";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/supabase-client";
import { format } from "date-fns";

export default function AnnouncementDetail() {
  const { id } = useParams();
  const [announcement, setAnnouncement] = useState<any>(null);

  useEffect(() => {
    fetchAnnouncement();
  }, []);

  const fetchAnnouncement = async () => {
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .eq("id", id)
      .single();

    setAnnouncement(data);
  };

  if (!announcement) {
    return (
      <PageLayout>
        <div className="flex-grow flex items-center justify-center">
          <p>Loading...</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="flex flex-col min-h-[calc(100vh-4rem)]"> 
        {/* Content area */}
        <div className="flex-grow bg-gray-50 dark:bg-white/5 p-6 rounded-lg shadow-inner">
          {/* Home Button */}
          <div className="mb-4">
            <Link
              to="/"
              className="inline-block bg-[#162942] text-white px-4 py-2 rounded hover:bg-[#1d3a5f] transition"
            >
              ← Home
            </Link>
          </div>

          <h1 className="text-3xl font-bold mb-4">{announcement.title}</h1>
          <p className="text-sm text-gray-500 mb-6">
            {format(new Date(announcement.created_at), "MMMM d, yyyy")}
          </p>

          {announcement.image_url && (
            <img
              src={announcement.image_url}
              alt={announcement.title}
              className="w-full max-h-96 object-cover rounded-lg mb-6"
            />
          )}

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {announcement.content}
          </p>
        </div>

        {/* Footer */}
        <footer className="py-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Your Site Name
        </footer>
      </div>
    </PageLayout>
  );
}
