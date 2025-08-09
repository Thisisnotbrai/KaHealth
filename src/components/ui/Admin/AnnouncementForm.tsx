import { useState } from "react";
import { supabase } from "@/supabase-client";

export default function AnnouncementForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = null;

    try {
      // 1️⃣ Upload image if selected
      if (image) {
        const fileName = `${Date.now()}-${image.name}`;
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from("announcement-images") // bucket name
          .upload(fileName, image);

        if (uploadError) throw uploadError;

        // 2️⃣ Get public URL of the uploaded image
        const { data: publicUrlData } = supabase
          .storage
          .from("announcement-images")
          .getPublicUrl(fileName);

        imageUrl = publicUrlData.publicUrl;
      }

      // 3️⃣ Insert announcement into DB
      const { error: insertError } = await supabase
        .from("announcements")
        .insert([
          {
            title,
            content,
            image_url: imageUrl,
          },
        ]);

      if (insertError) throw insertError;

      alert("Announcement posted successfully!");
      setTitle("");
      setContent("");
      setImage(null);
    } catch (err: any) {
      console.error(err.message);
      alert("Error posting announcement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-md max-w-md">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="border p-2 w-full mb-2"
      />

      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        className="border p-2 w-full mb-2"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
        className="mb-2"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Posting..." : "Post Announcement"}
      </button>
    </form>
  );
}
