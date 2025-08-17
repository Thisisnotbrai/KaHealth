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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 flex items-center justify-center">
      <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl">
        <div className="bg-white shadow-xl rounded-3xl p-6 sm:p-8 w-full space-y-6 border border-emerald-100 backdrop-blur-sm">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Health Announcement</h2>
            <p className="text-gray-600 text-sm sm:text-base">Share important health updates with your community</p>
          </div>

          {/* Title Field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-emerald-700 mb-1">
              Announcement Title
            </label>
            <input
              type="text"
              placeholder="e.g., New Health Guidelines Available"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-xl border-2 border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 p-3 sm:p-4 outline-none transition-all duration-200 text-gray-800 placeholder-gray-400 text-sm sm:text-base"
            />
          </div>

          {/* Content Field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-emerald-700 mb-1">
              Message Content
            </label>
            <textarea
              placeholder="Share your health announcement details, tips, or important information..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={5}
              className="w-full rounded-xl border-2 border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 p-3 sm:p-4 outline-none resize-none transition-all duration-200 text-gray-800 placeholder-gray-400 text-sm sm:text-base"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-emerald-700 mb-2">
              Supporting Image
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <label className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-2 border-emerald-200 rounded-xl cursor-pointer hover:from-emerald-100 hover:to-teal-100 hover:border-emerald-300 transition-all duration-200 text-sm sm:text-base font-medium">
                <ImagePlus size={20} />
                <span>Choose Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
              {image && (
                <div className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border-2 border-emerald-200 shadow-md"
                  />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div
            onClick={handleSubmit}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold px-6 py-4 rounded-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none text-sm sm:text-base cursor-pointer"
            style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading && <Loader2 className="animate-spin" size={20} />}
            {loading ? "Publishing Announcement..." : "Publish Health Update"}
          </div>

          {/* Health-themed footer note */}
          <div className="text-center pt-2">
            <p className="text-xs text-gray-500">
              💚 Promoting community health and wellness
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}