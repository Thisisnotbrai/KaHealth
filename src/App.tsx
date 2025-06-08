import { ThemeProvider } from "./components/ui/Darkmode/theme-provider"
import LandingPage from "./components/ui/LandingPage"

function App() {
  return (
    <div>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <LandingPage />
      </ThemeProvider>
    </div>
  )
}

export default App
