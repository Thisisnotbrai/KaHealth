import PageLayout from "@/components/ui/PageLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabase-client";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/Navbar/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

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

    if (typeof count === "number") setTotal(count);

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
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-white/90 shadow-[0_25px_80px_-35px_rgba(15,118,110,0.35)] backdrop-blur-xl">
            <div className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between lg:p-10">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
                  <span className="text-2xl text-white" aria-hidden="true">🏥</span>
                </div>
                <div className="space-y-3">
                  <Badge className="w-fit border-emerald-200 bg-emerald-50 text-emerald-700 shadow-sm">
                    Health advisories
                  </Badge>
                  <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                      Health Advisories & Announcements
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                      Stay informed with the latest health updates, announcements, and community notices in a clean, easy-to-read layout.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                type="button"
                onClick={() => navigate("/")}
                variant="outline"
                className="h-11 rounded-full border-emerald-200 bg-white/90 px-5 text-emerald-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50"
              >
                Back to home
              </Button>
            </div>

            <div className="border-t border-emerald-100 bg-gradient-to-r from-emerald-50/70 to-teal-50/70 px-6 py-4 sm:px-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="border-slate-200 bg-white text-slate-700 shadow-sm">
                    {total} total announcements
                  </Badge>
                  <Badge className="border-teal-200 bg-teal-50 text-teal-700 shadow-sm">
                    Page {page} of {totalPages}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600">
                  Updated in real time as new advisories are published.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-4 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-6 lg:p-8">
            {/* Responsive grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {loading
                ? [...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-sm"
                    >
                      <Skeleton className="h-48 w-full" />
                      <div className="space-y-3 p-5">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-5 w-4/5" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </div>
                  ))
                : announcements.map((announcement) => (
                    <button
                      type="button"
                      key={announcement.id}
                      onClick={() =>
                        navigate(`/announcement/${announcement.id}`)
                      }
                      className="group text-left"
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
                              <div className="mb-2 text-4xl" aria-hidden="true">🏥</div>
                              <p className="text-sm font-medium">Health advisory</p>
                            </div>
                          )}

                          <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm backdrop-blur-sm">
                            {format(new Date(announcement.created_at), "MMM d")}
                          </div>

                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        </div>

                        <CardContent className="space-y-4 p-5">
                          <div className="space-y-2">
                            <Badge className="w-fit border-emerald-200 bg-emerald-50 text-emerald-700 shadow-sm">
                              Health advisory
                            </Badge>
                            <h3 className="line-clamp-2 text-lg font-semibold leading-snug tracking-tight text-slate-900 transition-colors duration-200 group-hover:text-emerald-700">
                              {announcement.title}
                            </h3>
                          </div>

                          <p className="line-clamp-3 text-sm leading-6 text-slate-600">
                            {announcement.content}
                          </p>
                        </CardContent>

                        <CardFooter className="flex items-center justify-between gap-3 border-t border-slate-100 px-5 py-4">
                          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                            <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
                            <span>
                              {format(
                                new Date(announcement.created_at),
                                "MMMM d, yyyy"
                              )}
                            </span>
                          </div>
                          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                            Open
                          </span>
                        </CardFooter>
                      </Card>
                    </button>
                  ))}
            </div>

            {/* Enhanced pagination */}
            {!loading && totalPages > 1 && (
              <div className="mt-8 border-t border-slate-200 pt-6">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <Button
                    type="button"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    variant="outline"
                    className="h-10 rounded-full border-slate-200 bg-white px-4 text-slate-700 shadow-sm hover:border-emerald-200 hover:bg-emerald-50"
                  >
                    <span className="hidden sm:inline">Previous</span>
                    <span className="sm:hidden">Prev</span>
                  </Button>

                  <div className="flex items-center gap-1 mx-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((num) => {
                        // Show first page, last page, current page, and 2 pages around current
                        return (
                          num === 1 ||
                          num === totalPages ||
                          (num >= page - 1 && num <= page + 1)
                        );
                      })
                      .map((num, idx, arr) => (
                        <div key={num} className="flex items-center">
                          {idx > 0 && arr[idx - 1] !== num - 1 && (
                            <span className="px-2 text-slate-400">...</span>
                          )}
                          <button
                            onClick={() => setPage(num)}
                            className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                              num === page
                                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20"
                                : "border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-emerald-200 hover:bg-emerald-50"
                            }`}
                          >
                            {num}
                          </button>
                        </div>
                      ))}
                  </div>

                  <Button
                    type="button"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    variant="outline"
                    className="h-10 rounded-full border-slate-200 bg-white px-4 text-slate-700 shadow-sm hover:border-emerald-200 hover:bg-emerald-50"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <span className="sm:hidden">Next</span>
                  </Button>
                </div>
                
                {/* Mobile page indicator */}
                <div className="sm:hidden text-center mt-4">
                  <span className="text-sm text-slate-600">
                    Page {page} of {totalPages}
                  </span>
                </div>
              </div>
            )}

            {/* Empty state */}
            {!loading && announcements.length === 0 && (
              <div className="py-16 text-center">
                <div className="mb-4 text-6xl" aria-hidden="true">🏥</div>
                <h3 className="mb-2 text-xl font-semibold text-slate-800">
                  No announcements yet
                </h3>
                <p className="text-slate-600">
                  Check back later for health updates and advisories.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced footer */}
        <footer className="mt-2 py-6 text-center">
          <div className="mx-auto max-w-md rounded-2xl border border-white/70 bg-white/70 px-6 py-4 shadow-sm backdrop-blur-sm">
            <p className="text-sm text-slate-600">
              © {new Date().getFullYear()} Health Information System
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Keeping you informed and healthy.
            </p>
          </div>
        </footer>
      </div>
    </PageLayout>
  );
}