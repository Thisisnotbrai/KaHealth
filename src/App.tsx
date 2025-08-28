import { Route, Routes, Navigate } from "react-router-dom";
import AdminLogin from "./components/ui/Admin/AdminLogin";
import LandingPage from "./components/ui/LandingPage";
import AdminDashboard from "./components/ui/Admin/AdminDashboard";
import IntroAnimation from "./components/ui/IntroAnimation";
import AnnouncementDetail from "./components/ui/AnnouncementDetail";
import AdminEvents from "./components/ui/Admin/AdminEvents";
import AdminFeedback from "./components/ui/Admin/AdminFeedback";
import AdminCarousel from "./components/ui/Admin/AdminCarousel";
import AllAnnouncements from "./components/ui/AllAnnouncement";
import Information from "./components/ui/Information";
import { ThemeProvider } from "./components/ui/Darkmode/theme-provider";
import { useEffect, useState, type JSX } from "react";
import { Toaster } from "sonner";
import { supabase } from "@/supabase-client";

function App() {
  const [showIntro, setShowIntro] = useState(false);
  const [loadingRole, setLoadingRole] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisited");
    if (!hasVisited) {
      setShowIntro(true);
      sessionStorage.setItem("hasVisited", "true");
      setTimeout(() => {
        setShowIntro(false);
      }, 2500);
    }
    const checkRole = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user?.id) {
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (!error && data?.role === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoadingRole(false);
    };

    checkRole();
    supabase.auth.onAuthStateChange(() => {
      checkRole();
    });
  }, []);

  if (loadingRole) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading...
      </div>
    );
  }

  // ProtectedRoute component
  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    if (!isAdmin) {
      return <Navigate to="/admin/login" replace />;
    }
    return children;
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster richColors position="top-right" />

      {showIntro ? (
        <IntroAnimation />
      ) : (
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/announcement/:id" element={<AnnouncementDetail />} />
          <Route path="/announcements" element={<AllAnnouncements />} />
          <Route path="/information" element={<Information />} />
          {/* ✅ Protected Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/events"
            element={
              <ProtectedRoute>
                <AdminEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/feedback"
            element={
              <ProtectedRoute>
                <AdminFeedback />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/carousel"
            element={
              <ProtectedRoute>
                <AdminCarousel />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </ThemeProvider>
  );
}

export default App;
