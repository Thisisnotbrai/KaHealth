import { Route, Routes } from "react-router-dom";
import AdminLogin from "./components/ui/Admin/AdminLogin";
import LandingPage from "./components/ui/LandingPage";
import AdminDashboard from "./components/ui/Admin/AdminDashboard";
import IntroAnimation from "./components/ui/IntroAnimation";
import { ThemeProvider } from "./components/ui/Darkmode/theme-provider";
import { useEffect, useState } from "react";

// ✅ Import Toaster from sonner
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
      {/* ✅ Mount toaster here */}
      <Toaster richColors position="top-right" />
      
      {showIntro ? (
        <IntroAnimation />
      ) : (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      )}
    </ThemeProvider>
  );
}

export default App;
