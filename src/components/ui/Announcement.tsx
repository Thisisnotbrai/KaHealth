import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { supabase } from "@/supabase-client";
import { Button } from "./Navbar/button";
import { Badge } from "./badge";
import { Card, CardContent, CardFooter } from "./card";
import { Skeleton } from "./skeleton";


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

  const featuredAnnouncements = announcements.slice(0, 4);
  const showViewAll = announcements.length > featuredAnnouncements.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-8 px-4 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2rem] border border-emerald-100 bg-white/90 shadow-[0_25px_80px_-35px_rgba(15,118,110,0.35)] backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute -top-20 -right-16 h-52 w-52 rounded-full bg-emerald-100/70 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-teal-100/70 blur-3xl" />
          </div>

          <div className="relative px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:items-center">
              <div className="space-y-6 text-center lg:text-left">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg lg:mx-0">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </div>

                <div className="space-y-3">
                  <Badge className="w-fit border-emerald-200 bg-emerald-50 text-emerald-700 shadow-sm">
                    Health Advisories
                  </Badge>
                  <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                    Clear, timely updates for the community
                  </h2>
                  <p className="mx-auto max-w-2xl text-sm leading-7 text-slate-600 sm:text-base lg:mx-0 lg:text-lg">
                    Stay informed with the latest health announcements, urgent notices, and community updates in one calm, easy-to-scan space.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                  <Badge className="border-slate-200 bg-white text-slate-700 shadow-sm">
                    {announcements.length} total updates
                  </Badge>
                  <Badge className="border-teal-200 bg-teal-50 text-teal-700 shadow-sm">
                    Stay up to date
                  </Badge>
                  <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 shadow-sm">
                    kalalake news
                  </Badge>
                </div>

                {showViewAll && (
                  <div className="flex justify-center lg:justify-start">
                    <Button
                      type="button"
                      onClick={() => navigate("/announcements")}
                      className="h-11 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-5 text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/25"
                    >
                      View all announcements
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-2xl border border-emerald-100 bg-white/80 p-5 shadow-sm">
                  <p className="text-sm font-medium text-slate-500">Latest update</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {announcements[0]?.title ?? "No announcements yet"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {announcements[0]?.created_at
                      ? format(new Date(announcements[0].created_at), "MMMM d, yyyy")
                      : "Announcements will appear here once published."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Card Grid */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {loading
            ? [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-sm"
                >
                  <Skeleton className="h-52 w-full" />
                  <div className="space-y-3 p-5">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-4/5" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))
            : featuredAnnouncements.map((announcement, index) => (
                <button
                  type="button"
                  key={announcement.id}
                  onClick={() => navigate(`/announcement/${announcement.id}`)}
                  className="group text-left"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Card className="h-full overflow-hidden rounded-[1.5rem] border-slate-200/80 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-focus-visible:-translate-y-1 group-focus-visible:shadow-xl group-focus-visible:outline-none group-focus-visible:ring-2 group-focus-visible:ring-emerald-500/30">
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                      {announcement.image_url ? (
                        <img
                          src={announcement.image_url}
                          alt={announcement.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 text-slate-500 transition-colors duration-300 group-hover:from-emerald-100 group-hover:to-teal-100">
                          <svg className="mb-3 h-14 w-14 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-sm font-medium">Health update</span>
                        </div>
                      )}

                      <div className="absolute left-4 top-4">
                        <Badge className="border-emerald-200 bg-white/90 text-emerald-700 shadow-sm backdrop-blur-sm">
                          Health advisory
                        </Badge>
                      </div>

                      <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm backdrop-blur-sm">
                        {format(new Date(announcement.created_at), "MMM d, yyyy")}
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>

                    <CardContent className="space-y-4 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <h3 className="line-clamp-2 text-lg font-semibold leading-snug tracking-tight text-slate-900 transition-colors duration-200 group-hover:text-emerald-700">
                            {announcement.title}
                          </h3>
                        </div>
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 transition-colors duration-200 group-hover:bg-emerald-100">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>

                      <p className="line-clamp-3 text-sm leading-6 text-slate-600">
                        {announcement.content}
                      </p>
                    </CardContent>

                    <CardFooter className="flex items-center justify-between gap-3 border-t border-slate-100 px-5 py-4">
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
                        <span>{format(new Date(announcement.created_at), "MMMM d, yyyy")}</span>
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                        Open
                      </span>
                    </CardFooter>
                  </Card>
                </button>
              ))}
        </div>

        {/* Empty State */}
        {!loading && announcements.length === 0 && (
          <div className="py-16 text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-emerald-100 to-teal-100">
              <svg className="h-12 w-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="mb-2 text-2xl font-semibold text-slate-800">No announcements yet</h3>
            <p className="mx-auto max-w-md text-slate-500">
              Health advisories and community announcements will appear here when available.
            </p>
          </div>
        )}

        {/* Health Tips Footer */}
        <div className="mt-12 text-center sm:mt-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-5 py-3 shadow-sm">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-medium text-slate-600">
              Stay healthy, stay informed
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}