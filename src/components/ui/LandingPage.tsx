"use client";

import { Navbar5 } from './Navbar/Navbar';
import Header from './Header';
import HeroSection from './HeroSection';
import Announcement from './Announcement';
import HealthAlmanac from './HealthAlmanac';
import News from './News';
import Footer from './Footer';
// import HealthApp from './Pages/HWPage/HealthApp';

const LandingPage = () => {
  return (
    <div className="bg-white dark:bg-[#162942] text-[#162942] dark:text-white min-h-screen transition-colors duration-300 ease-in-out">
      <Navbar5 />
      <Header />

      <main className="space-y-8 px-4 sm:px-6 md:px-8 py-6">
        <section id="hero">
          <HeroSection />
        </section>

        <section id="announcements">
          <h2 className="text-2xl font-semibold mb-4">Advisories & Announcements</h2>
          <Announcement />
        </section>

        <section id="health-topics">
          <h2 className="text-2xl font-semibold mb-4">Health Topics</h2>
          <HealthAlmanac />
        </section>

        <section id="latest-news">
          <h2 className="text-2xl font-semibold mb-4">Latest News</h2>
          <News />
        </section>
      </main>

      <Footer />
      {/* <HealthApp /> */}
    </div>
  );
};

export default LandingPage;
