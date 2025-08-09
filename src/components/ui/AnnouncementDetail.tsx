import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/supabase-client";

interface Announcement {
  id: number;
  title: string;
  content: string;
  created_at: string;
  image_url?: string;
}

export default function AnnouncementDetail() {
  const { id } = useParams();
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from("announcements")
        .select("*")
        .eq("id", id)
        .single();
      setAnnouncement(data);
    }
    fetchData();
  }, [id]);

  if (!announcement) return <p className="text-center py-20">Loading...</p>;

  return (
    <article className="max-w-4xl mx-auto p-6 bg-white dark:bg-[#162942] shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-4">{announcement.title}</h1>

      {announcement.image_url && (
        <img
          src={announcement.image_url}
          alt={announcement.title}
          className="w-full rounded mb-6"
        />
      )}

      <p className="text-sm text-gray-500 mb-6">
        {new Date(announcement.created_at).toLocaleDateString()}
      </p>

      <div
        className="text-gray-800 dark:text-gray-200 leading-relaxed gap-4"
        style={{
          columnCount: 2,
          columnGap: "2rem",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {announcement.content.split("\n").map((para, i) => (
          <p key={i} className="break-words mb-4">
            {para}
          </p>
        ))}
      </div>
    </article>
  );
}
