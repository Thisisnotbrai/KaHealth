import PageLayout from "@/components/ui/PageLayout";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/supabase-client";
import { format } from "date-fns";
import { Button } from "@/components/ui/Navbar/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

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
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-4">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg animate-pulse">
              <span className="text-2xl" aria-hidden="true">🏥</span>
            </div>
            <p className="text-lg font-medium text-slate-700">Loading health advisory...</p>
            <div className="mt-4 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-500" />
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error || !announcement) {
    return (
      <PageLayout>
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-4">
          <div className="mx-auto max-w-md rounded-[2rem] border border-slate-200/80 bg-white/90 px-6 py-8 text-center shadow-[0_25px_80px_-35px_rgba(15,23,42,0.35)] backdrop-blur-xl">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100">
              <span className="text-2xl" aria-hidden="true">❌</span>
            </div>
            <h2 className="mb-2 text-xl font-semibold text-slate-800">Announcement not found</h2>
            <p className="mb-6 text-slate-600">The health advisory you're looking for doesn't exist or has been removed.</p>
            <Link to="/">
              <Button
                type="button"
                className="h-11 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-5 text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
              >
                Back to home
              </Button>
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link to="/">
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-full border-emerald-200 bg-white/90 px-5 text-emerald-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50"
              >
                Back to home
              </Button>
            </Link>
            <Badge className="w-fit border-emerald-200 bg-emerald-50 text-emerald-700 shadow-sm">
              Health advisory
            </Badge>
          </div>

          <Card className="overflow-hidden rounded-[2rem] border-slate-200/80 bg-white/90 shadow-[0_25px_80px_-35px_rgba(15,23,42,0.35)] backdrop-blur-xl">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-6 text-white sm:px-8 sm:py-8 lg:px-10 lg:py-10">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 shadow-sm backdrop-blur-sm">
                  <span className="text-2xl" aria-hidden="true">📢</span>
                </div>
                <div className="min-w-0 flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="border-white/20 bg-white/15 text-white shadow-sm backdrop-blur-sm">
                      Published {format(new Date(announcement.created_at), "MMMM d, yyyy")}
                    </Badge>
                    <Badge className="border-white/20 bg-white/15 text-white shadow-sm backdrop-blur-sm">
                      {format(new Date(announcement.created_at), "h:mm a")}
                    </Badge>
                  </div>
                  <h1 className="text-2xl font-semibold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
                    {announcement.title}
                  </h1>
                  <p className="max-w-3xl text-sm leading-7 text-white/85 sm:text-base">
                    A clean announcement detail page with clearer hierarchy, calmer spacing, and better scanability.
                  </p>
                </div>
              </div>
            </div>

            <CardContent className="space-y-8 p-6 sm:p-8 lg:p-10">
              {announcement.image_url && (
                <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50 shadow-sm">
                  <img
                    src={announcement.image_url}
                    alt={announcement.title}
                    className="max-h-[68vh] w-full object-cover"
                  />
                </div>
              )}

              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
                <div className="space-y-4">
                  <Badge className="w-fit border-teal-200 bg-teal-50 text-teal-700 shadow-sm">
                    Announcement details
                  </Badge>
                  <div className="prose prose-slate max-w-none prose-p:leading-8 prose-p:text-slate-700 prose-headings:tracking-tight">
                    <div className="whitespace-pre-wrap text-base leading-8 text-slate-700 sm:text-lg">
                      {announcement.content}
                    </div>
                  </div>
                </div>

                <aside className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 shadow-sm">
                  <p className="text-sm font-medium text-slate-500">Quick summary</p>
                  <div className="mt-3 space-y-3 text-sm text-slate-600">
                    <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
                      <span>Published</span>
                      <span className="font-medium text-slate-800">
                        {format(new Date(announcement.created_at), "MMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
                      <span>Time</span>
                      <span className="font-medium text-slate-800">
                        {format(new Date(announcement.created_at), "h:mm a")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span>Type</span>
                      <span className="font-medium text-slate-800">Health advisory</span>
                    </div>
                  </div>
                </aside>
              </div>

              <div className="rounded-[1.5rem] border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm">
                    <span className="text-sm font-bold" aria-hidden="true">ℹ️</span>
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-slate-800">Important health information</h3>
                    <p className="text-sm leading-7 text-slate-600">
                      This announcement contains health-related information. Please consult healthcare professionals for personalized medical advice when needed.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.print()}
                    className="h-11 rounded-full border-slate-200 bg-white px-5 text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50"
                  >
                    Print
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (navigator.share) {
                        void navigator.share({
                          title: announcement.title,
                          url: window.location.href,
                        });
                      }
                    }}
                    className="h-11 rounded-full border-slate-200 bg-white px-5 text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50"
                  >
                    Share
                  </Button>
                </div>

                <Link to="/announcements">
                  <Button
                    type="button"
                    className="h-11 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-5 text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    View all announcements
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <footer className="py-6 text-center">
          <div className="mx-auto max-w-md rounded-2xl border border-white/70 bg-white/70 px-6 py-4 shadow-sm backdrop-blur-sm">
            <p className="text-sm text-slate-600">
              © {new Date().getFullYear()} KaHealth
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Your trusted health information partner.
            </p>
          </div>
        </footer>
      </div>
    </PageLayout>
  );
}