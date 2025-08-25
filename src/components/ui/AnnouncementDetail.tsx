import PageLayout from "@/components/ui/PageLayout";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/supabase-client";
import { format } from "date-fns";

export default function AnnouncementDetail() {
  const { id } = useParams();
  const [announcement, setAnnouncement] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchAnnouncement();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchAnnouncement = async () => {
    try {
      setLoading(true);
      setError(false);
      const { data } = await supabase
        .from("announcements")
        .select("*")
        .eq("id", id)
        .single();

      setAnnouncement(data);
    } catch (err) {
      console.error("Failed to fetch announcement:", err);
      setAnnouncement(null);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center mb-4 animate-pulse mx-auto">
              <span className="text-2xl">🏥</span>
            </div>
            <p className="text-lg font-medium text-gray-700">Loading health advisory...</p>
            <div className="mt-4 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error || !announcement) {
    return (
      <PageLayout>
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">❌</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Announcement Not Found</h2>
            <p className="text-gray-600 mb-6">The health advisory you're looking for doesn't exist or has been removed.</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl hover:from-blue-700 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
            >
              🏠 Back to Home
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Navigation Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl hover:from-blue-700 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium text-sm sm:text-base"
              >
                ← Back to Home
              </Link>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>🏥</span>
                <span className="font-medium">Health Advisory</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-green-600 px-6 sm:px-8 py-6 sm:py-8 text-white">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-xl sm:text-2xl">📢</span>
                </div>
                <div className="flex-grow min-w-0">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 leading-tight">
                    {announcement.title}
                  </h1>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-white/90">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">📅</span>
                      <span className="text-sm sm:text-base font-medium">
                        Published: {format(new Date(announcement.created_at), "MMMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">⏰</span>
                      <span className="text-sm font-medium">
                        {format(new Date(announcement.created_at), "h:mm a")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Section */}
            {announcement.image_url && (
              <div className="relative">
                <div className="px-6 sm:px-8 py-6 sm:py-8 bg-gray-50">
                  <div className="flex justify-center">
                    <div className="relative group max-w-full">
                      <img
                        src={announcement.image_url}
                        alt={announcement.title}
                        className="max-w-full h-auto rounded-xl shadow-lg group-hover:shadow-2xl transition-shadow duration-300"
                        style={{ maxHeight: "70vh" }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Content Section */}
            <div className="px-6 sm:px-8 py-6 sm:py-8">
              {/* Content with better typography */}
              <div className="prose prose-lg max-w-none">
                <div className="text-gray-800 leading-relaxed text-base sm:text-lg whitespace-pre-wrap">
                  {announcement.content}
                </div>
              </div>

              {/* Important Notice Banner */}
              <div className="mt-8 p-4 sm:p-6 bg-gradient-to-r from-blue-100 to-green-100 rounded-xl border-l-4 border-blue-500">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">ℹ️</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Important Health Information</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      This announcement contains important health-related information. 
                      Please consult with healthcare professionals for personalized medical advice.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4 sm:justify-between">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={() => window.print()}
                      className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-sm text-sm font-medium"
                    >
                      🖨️ Print
                    </button>
                    <button 
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: announcement.title,
                            url: window.location.href
                          });
                        }
                      }}
                      className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-sm text-sm font-medium"
                    >
                      📤 Share
                    </button>
                  </div>
                  
                  <Link
                    to="/announcements"
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:from-blue-600 hover:to-green-600 transition-all duration-200 shadow-sm text-sm font-medium text-center"
                  >
                    📋 View All Announcements
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Related Information Card */}
          <div className="mt-8 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>💡</span>
              Health Resources
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="text-blue-500 text-2xl mb-2">🏥</div>
                <h4 className="font-semibold text-gray-800 mb-1">Emergency Services</h4>
                <p className="text-sm text-gray-600">24/7 emergency healthcare</p>
              </div>
              <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="text-green-500 text-2xl mb-2">📞</div>
                <h4 className="font-semibold text-gray-800 mb-1">Health Hotline</h4>
                <p className="text-sm text-gray-600">Get health information</p>
              </div>
              <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 sm:col-span-2 lg:col-span-1">
                <div className="text-purple-500 text-2xl mb-2">🩺</div>
                <h4 className="font-semibold text-gray-800 mb-1">Find a Doctor</h4>
                <p className="text-sm text-gray-600">Locate healthcare providers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Footer */}
        <footer className="mt-12 py-6 text-center">
          <div className="max-w-md mx-auto px-6 py-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} KaHealth
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Your trusted health information partner 💙
            </p>
          </div>
        </footer>
      </div>
    </PageLayout>
  );
}