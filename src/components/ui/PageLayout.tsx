import Footer from "./Footer";
import { Navbar5 } from "./Navbar/Navbar";

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#162942] text-[#162942] dark:text-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 shadow-md backdrop-blur-md bg-white/80 dark:bg-[#162942]/80 transition-all">
        <Navbar5 />
      </header>

      {/* Main Content */}
      <main className="flex-grow px-4 sm:px-6 md:px-8 py-8">{children}</main>

      {/* Footer stays at bottom */}
      <footer className="mt-auto border-t border-gray-200 dark:border-white/10">
        <Footer />
      </footer>
    </div>
  );
}
