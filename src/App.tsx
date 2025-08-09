import { Route, Routes } from "react-router-dom";
import AdminLogin from "./components/ui/Admin/AdminLogin";
import LandingPage from "./components/ui/LandingPage";
import AdminDashboard from "./components/ui/Admin/AdminDashboard";
import IntroAnimation from "./components/ui/IntroAnimation";
import AnnouncementDetail from "./components/ui/AnnouncementDetail";
import AllAnnouncements from "./components/ui/AllAnnouncement";
import { ThemeProvider } from "./components/ui/Darkmode/theme-provider";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";

function App() {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisited");
    if (!hasVisited) {
      setShowIntro(true);
      sessionStorage.setItem("hasVisited", "true");
      setTimeout(() => {
        setShowIntro(false);
      }, 2500);
    }
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster richColors position="top-right" />
      {showIntro ? (
        <IntroAnimation />
      ) : (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/announcement/:id" element={<AnnouncementDetail />} />
          <Route path="/announcements" element={<AllAnnouncements />} />
        </Routes>
      )}
    </ThemeProvider>
  );
}

export default App;
