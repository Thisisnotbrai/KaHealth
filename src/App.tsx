import { ThemeProvider } from "./components/ui/Darkmode/theme-provider";
import LandingPage from "./components/ui/LandingPage";
import IntroAnimation from "./components/ui/IntroAnimation";

function App() {
  return (
    <div>
      <IntroAnimation />
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <LandingPage />
      </ThemeProvider>
    </div>
  );
}

export default App;
