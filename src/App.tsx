import { Route, Routes, Navigate } from "react-router-dom";
import AdminLogin from "./components/ui/Admin/AdminLogin";
import UserDashboard from "./components/ui/user/UserDashboard";
import LandingPage from "./components/ui/LandingPage";
import AdminDashboard from "./components/ui/Admin/AdminDashboard";
import IntroAnimation from "./components/ui/IntroAnimation";
import AnnouncementDetail from "./components/ui/AnnouncementDetail";
import AdminEvents from "./components/ui/Admin/AdminEvents";
import AdminFeedback from "./components/ui/Admin/AdminFeedback";
import AllAnnouncements from "./components/ui/AllAnnouncement";
import Information from "./components/ui/Information";
import ArchivePage from "./components/ui/Admin/ArchivePage";
import MedicineInventory from "./components/ui/Admin/Medicine/MedicineInventory";
import AdminMedicineRequests from "./components/ui/Admin/Medicine/AdminMedicineRequests";
import Analytics from "./components/ui/Admin/Analytics";
import AdminLogs from "./components/ui/Admin/Logs";
import { ThemeProvider } from "./components/ui/Darkmode/theme-provider";
import { useEffect, useRef, useState, type JSX } from "react";
import { Toaster } from "sonner";
import { supabase } from "@/supabase-client";
import { getAdminDisplayName, isKnownAdminEmail } from "@/lib/adminIdentity";
import { logAdminLogin } from "@/lib/adminAudit";

function App() {
  const [showIntro, setShowIntro] = useState(false);
  const [loadingRole, setLoadingRole] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const lastLoggedAdminId = useRef<string | null>(null);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisited");
    if (!hasVisited) {
      setShowIntro(true);
      sessionStorage.setItem("hasVisited", "true");
      setTimeout(() => {
        setShowIntro(false);
      }, 2500);
    }
    const checkRole = async (event?: string, sessionUserId?: string | null) => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const user = session?.user;

      if (user?.id) {
        const { data } = await supabase
          .from("profiles")
          .select("email")
          .eq("id", user.id)
          .maybeSingle();

        const email = data?.email || user.email;
        const admin = isKnownAdminEmail(email);
        setIsAdmin(admin);

        if (admin && event === "SIGNED_IN" && sessionUserId && lastLoggedAdminId.current !== sessionUserId) {
          lastLoggedAdminId.current = sessionUserId;

          try {
            await logAdminLogin({
              adminId: user.id,
              adminName: getAdminDisplayName(email, data?.full_name || user.user_metadata?.full_name) || email || "Admin",
              adminEmail: email || user.email || "",
            });
          } catch (error) {
            console.error("Failed to record admin login:", error);
          }
        }
      } else {
        setIsAdmin(false);
        lastLoggedAdminId.current = null;
      }
      setLoadingRole(false);
    };

    checkRole();
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      checkRole(event, session?.user?.id || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
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
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Toaster richColors position="top-right" />

      {showIntro ? (
        <IntroAnimation />
      ) : (
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/login" element={
            <div className="light"> <AdminLogin /> </div> } />
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
            path="/admin/archive"
            element={
              <ProtectedRoute>
                <ArchivePage/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/medicine-inventory"
            element={
              <ProtectedRoute>
                <MedicineInventory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/medicine-requests"
            element={
              <ProtectedRoute>
                <AdminMedicineRequests />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/logs"
            element={
              <ProtectedRoute>
                <AdminLogs />
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
