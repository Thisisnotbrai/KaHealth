import { ModeToggle } from "./components/ui/mode-toggle"
import { Navbar5 } from "./components/ui/Navbar"
import { ThemeProvider } from "./components/ui/theme-provider"

function App() {
  return (
    <div>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ModeToggle />
    </ThemeProvider>
     <Navbar5 />
    </div>
  )
}

export default App
