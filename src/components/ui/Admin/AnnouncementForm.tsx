import { useState } from "react";
import { supabase } from "@/supabase-client";
import { ImagePlus, Loader2 } from "lucide-react"; // nice icons

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
      if (image) {
        const fileName = `${Date.now()}-${image.name}`;
        const { error: uploadError } = await supabase
          .storage
          .from("announcement-images")
          .upload(fileName, image);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase
          .storage
          .from("announcement-images")
          .getPublicUrl(fileName);

        imageUrl = publicUrlData.publicUrl;
      }

      const { error: insertError } = await supabase
        .from("announcements")
        .insert([{ title, content, image_url: imageUrl }]);

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
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg space-y-5"
    >
      <h2 className="text-2xl font-semibold text-gray-800">New Announcement</h2>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Title
        </label>
        <input
          type="text"
          placeholder="Enter announcement title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 p-3 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Content
        </label>
        <textarea
          placeholder="Write your announcement..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={5}
          className="w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 p-3 outline-none resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Image
        </label>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 transition">
            <ImagePlus size={18} />
            <span>Select Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="hidden"
            />
          </label>
          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className="w-14 h-14 object-cover rounded-lg border"
            />
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-3 rounded-lg transition disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading && <Loader2 className="animate-spin" size={18} />}
        {loading ? "Posting..." : "Post Announcement"}
      </button>
    </form>
  );
}
