import { ModeToggle } from "./components/ui/Darkmode/mode-toggle"
import { ThemeProvider } from "./components/ui/Darkmode/theme-provider"
import LandingPage from "./components/ui/LandingPage"

function App() {
  return (
    <div>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ModeToggle />
      <LandingPage />
    </ThemeProvider>
    </div>
  )
}

export default App
