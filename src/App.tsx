import { ThemeProvider } from "./components/ui/Darkmode/theme-provider";
import LandingPage from "./components/ui/LandingPage";
import IntroAnimation from "./components/ui/IntroAnimation";
import { useEffect, useState } from "react";

function App() {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisited");

    if (!hasVisited) {
      setShowIntro(true);
      sessionStorage.setItem("hasVisited", "true");

      setTimeout(() => {
        setShowIntro(false);
      }, 2500); // match animation duration
    }
  }, []);

  return (
    <div>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        {showIntro ? <IntroAnimation /> : <LandingPage />}
      </ThemeProvider>
    </div>
  );
}

export default App;
