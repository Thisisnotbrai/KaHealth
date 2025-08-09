"use client";

import { Navbar5 } from './Navbar/Navbar';
import Header from './Header';
import HeroSection from './HeroSection';
import Announcement from './Announcement'; // now Supabase-powered
import HealthAlmanac from './HealthAlmanac';
import News from './News';
import Footer from './Footer';

const LandingPage = () => {
  return (
    <div className="bg-white dark:bg-[#162942] text-[#162942] dark:text-white min-h-screen transition-colors duration-300 ease-in-out">
      {/* Sticky Navbar */}
      <header className="sticky top-0 z-50 shadow-md backdrop-blur-md bg-white/80 dark:bg-[#162942]/80 transition-all">
        <Navbar5 />
      </header>

      {/* Hero / Header Section */}
      <Header />

      <main className="space-y-16 px-4 sm:px-6 md:px-8 py-8">
        {/* Hero Section */}
        <section
          id="hero"
          className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <HeroSection />
        </section>

        {/* Announcements */}
        <section id="announcements">
          <h2 className="text-3xl font-bold mb-6 border-l-4 border-[#f9a825] pl-3">
            📢 Advisories & Announcements
          </h2>
          <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-lg shadow-inner">
            <Announcement />
          </div>
        </section>

        {/* Health Topics */}
        <section id="health-topics">
          <h2 className="text-3xl font-bold mb-6 border-l-4 border-green-500 pl-3">
            🩺 Health Topics
          </h2>
          <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-lg shadow-inner">
            <HealthAlmanac />
          </div>
        </section>

        {/* Latest News */}
        <section id="latest-news">
          <h2 className="text-3xl font-bold mb-6 border-l-4 border-blue-500 pl-3">
            📰 Latest News
          </h2>
          <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-lg shadow-inner">
            <News />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 dark:border-white/10">
        <Footer />
      </footer>
    </div>
  );
};

export default LandingPage;
