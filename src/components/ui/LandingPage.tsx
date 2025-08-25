"use client";

import { Navbar5 } from './Navbar/Navbar';
import Header from './Header';
import HeroSection from './HeroSection';
import Announcement from './Announcement'; // now Supabase-powered
import HealthAlmanac from './HealthAlmanac';
import PublicEvents from './PublicEvents'; // now Supabase-powered
import News from './News';
import Footer from './Footer';

const LandingPage = () => {
  return (
    <div className="bg-gradient-to-br from-emerald-50 via-teal-50/30 to-cyan-50 dark:bg-gradient-to-br dark:from-[#0f2027] dark:via-[#203a43] dark:to-[#2c5364] text-gray-900 dark:text-white min-h-screen transition-all duration-500 ease-in-out overflow-x-hidden">
      {/* Enhanced Sticky Navbar with Health Theme */}
      <header className="sticky top-0 z-50 shadow-lg backdrop-blur-md bg-white/90 dark:bg-[#162942]/90 transition-all duration-300 border-b border-emerald-200/50 dark:border-teal-500/20 will-change-transform">
        <Navbar5 />
      </header>

      {/* Enhanced Hero / Header Section with Performance Optimizations */}
      <div className="relative overflow-hidden will-change-transform">
        {/* Optimized health-themed background pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none" aria-hidden="true">
          <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-500 rounded-full blur-3xl transform-gpu"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-teal-500 rounded-full blur-2xl transform-gpu"></div>
          <div className="absolute bottom-20 left-1/3 w-28 h-28 bg-cyan-500 rounded-full blur-3xl transform-gpu"></div>
        </div>
        <Header />
      </div>

      <main className="relative space-y-8 sm:space-y-12 lg:space-y-16 px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8 lg:py-12" role="main">
        {/* Enhanced Hero Section with Performance */}
        <section
          id="hero"
          className="rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.01] bg-gradient-to-r from-white/80 to-emerald-50/80 dark:from-white/5 dark:to-emerald-900/20 backdrop-blur-sm border border-white/50 dark:border-emerald-500/20 will-change-transform"
          role="banner"
          aria-label="Hero section"
        >
          <HeroSection />
        </section>

        {/* Barangay Calendar / Events Section */}
<section id="events" className="space-y-4 sm:space-y-6" role="region" aria-labelledby="events-heading">
  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg" role="img" aria-label="Events icon">
        <span className="text-white text-lg sm:text-xl select-none" aria-hidden="true">📅</span>
      </div>
      <h2 id="events-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
        Barangay Calendar of Events
      </h2>
    </div>
    <div className="hidden sm:flex flex-1 h-1 bg-gradient-to-r from-purple-500/50 to-transparent rounded-full" aria-hidden="true"></div>
  </div>
  <div className="bg-gradient-to-br from-white/90 to-purple-50/30 dark:from-white/5 dark:to-purple-900/10 p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg border border-white/50 dark:border-purple-500/20 backdrop-blur-sm">
    <PublicEvents />
  </div>
</section>

        {/* Enhanced Announcements Section with Loading States */}
        <section id="announcements" className="space-y-4 sm:space-y-6" role="region" aria-labelledby="announcements-heading">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg transform-gpu" role="img" aria-label="Announcements icon">
                <span className="text-white text-lg sm:text-xl select-none" aria-hidden="true">📢</span>
              </div>
              <h2 id="announcements-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                Health Advisories & Announcements
              </h2>
            </div>
            <div className="hidden sm:flex flex-1 h-1 bg-gradient-to-r from-amber-500/50 to-transparent rounded-full" aria-hidden="true"></div>
          </div>
          <div className="bg-gradient-to-br from-white/90 to-amber-50/50 dark:from-white/5 dark:to-amber-900/10 p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg border border-white/50 dark:border-amber-500/20 backdrop-blur-sm hover:shadow-xl transition-all duration-300 will-change-transform">
            <div className="min-h-[200px] flex items-center justify-center">
              <Announcement />
            </div>
          </div>
        </section>

        {/* Enhanced Health Topics Section */}
        <section id="health-topics" className="space-y-4 sm:space-y-6" role="region" aria-labelledby="health-topics-heading">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg transform-gpu" role="img" aria-label="Health topics icon">
                <span className="text-white text-lg sm:text-xl select-none" aria-hidden="true">🩺</span>
              </div>
              <h2 id="health-topics-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                Community Health Topics
              </h2>
            </div>
            <div className="hidden sm:flex flex-1 h-1 bg-gradient-to-r from-emerald-500/50 to-transparent rounded-full" aria-hidden="true"></div>
          </div>
          <div className="bg-gradient-to-br from-white/90 to-emerald-50/50 dark:from-white/5 dark:to-emerald-900/10 p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg border border-white/50 dark:border-emerald-500/20 backdrop-blur-sm hover:shadow-xl transition-all duration-300 will-change-transform">
            <div className="relative">
              {/* Optimized health-themed decorative elements */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl transform-gpu pointer-events-none" aria-hidden="true"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 bg-teal-500/10 rounded-full blur-lg transform-gpu pointer-events-none" aria-hidden="true"></div>
              <div className="min-h-[200px] flex items-center justify-center">
                <HealthAlmanac />
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Emergency Contact Section with Better Accessibility */}
        <section id="emergency-contact" className="space-y-4 sm:space-y-6" role="region" aria-labelledby="emergency-contact-heading">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse transform-gpu" role="img" aria-label="Emergency icon">
                <span className="text-white text-lg sm:text-xl select-none" aria-hidden="true">🚨</span>
              </div>
              <h2 id="emergency-contact-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                Emergency Contacts
              </h2>
            </div>
            <div className="hidden sm:flex flex-1 h-1 bg-gradient-to-r from-red-500/50 to-transparent rounded-full" aria-hidden="true"></div>
          </div>
          <div className="bg-gradient-to-br from-white/90 to-red-50/30 dark:from-white/5 dark:to-red-900/10 p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg border border-white/50 dark:border-red-500/20 backdrop-blur-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6" role="list">
              {[
                { service: "Emergency Hotline", number: "911", icon: "🚑", description: "For life-threatening emergencies" },
                { service: "Barangay Health Station", number: "(02) 8123-4567", icon: "🏥", description: "Local health services" },
                { service: "COVID Helpline", number: "1555", icon: "😷", description: "COVID-19 assistance" },
                { service: "Mental Health Crisis", number: "0917-899-8727", icon: "🧠", description: "Mental health support" }
              ].map((contact, index) => (
                <article
                  key={index}
                  role="listitem"
                  className="bg-white/80 dark:bg-white/5 p-4 sm:p-6 rounded-xl shadow-md border border-gray-200/50 dark:border-gray-600/20 hover:shadow-lg focus-within:shadow-lg focus-within:ring-2 focus-within:ring-red-500/50 transition-all duration-300 text-center group will-change-transform"
                >
                  <div 
                    className="text-3xl sm:text-4xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300 transform-gpu select-none" 
                    role="img" 
                    aria-label={`${contact.service} icon`}
                  >
                    {contact.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base mb-1 sm:mb-2">
                    {contact.service}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-3 min-h-[2.5rem] flex items-center justify-center">
                    {contact.description}
                  </p>
                  <a
                    href={`tel:${contact.number}`}
                    className="inline-block text-red-600 dark:text-red-400 font-bold text-base sm:text-lg hover:text-red-700 dark:hover:text-red-300 focus:text-red-700 dark:focus:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500/50 rounded px-2 py-1 transition-all duration-200"
                    aria-label={`Call ${contact.service} at ${contact.number}`}
                  >
                    {contact.number}
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* New Health Resources Section */}
        <section id="health-resources" className="space-y-4 sm:space-y-6" role="region" aria-labelledby="health-resources-heading">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform-gpu" role="img" aria-label="Resources icon">
                <span className="text-white text-lg sm:text-xl select-none" aria-hidden="true">📚</span>
              </div>
              <h2 id="health-resources-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                Health Resources
              </h2>
            </div>
            <div className="hidden sm:flex flex-1 h-1 bg-gradient-to-r from-indigo-500/50 to-transparent rounded-full" aria-hidden="true"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" role="list">
            {[
              {
                title: "Health Guidelines",
                description: "Official health protocols and safety guidelines for our community",
                icon: "📋",
                color: "from-blue-500 to-cyan-600",
                link: "#guidelines"
              },
              {
                title: "Vaccination Schedule",
                description: "Stay updated with vaccination programs and immunization schedules",
                icon: "💉",
                color: "from-green-500 to-teal-600",
                link: "#vaccination"
              },
              {
                title: "Health Facilities",
                description: "Find nearby hospitals, clinics, and healthcare facilities",
                icon: "🏥",
                color: "from-purple-500 to-indigo-600",
                link: "#facilities"
              }
            ].map((resource, index) => (
              <article
                key={index}
                role="listitem"
                className="bg-gradient-to-br from-white/90 to-gray-50/50 dark:from-white/5 dark:to-gray-800/20 p-6 rounded-2xl shadow-lg border border-white/50 dark:border-gray-600/20 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:scale-105 group will-change-transform"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${resource.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 transform-gpu flex-shrink-0`}>
                    <span className="text-white text-2xl select-none" aria-hidden="true">{resource.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">
                      {resource.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                      {resource.description}
                    </p>
                    <a
                      href={resource.link}
                      className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 rounded px-2 py-1 transition-colors duration-200"
                      aria-label={`Learn more about ${resource.title}`}
                    >
                      Learn More →
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* Enhanced Footer with better performance */}
      <footer className="mt-12 sm:mt-16 lg:mt-20 border-t border-emerald-200/50 dark:border-teal-500/20 bg-gradient-to-r from-white/50 to-emerald-50/30 dark:from-gray-900/50 dark:to-emerald-900/10 backdrop-blur-sm will-change-transform" role="contentinfo">
        <Footer />
      </footer>
    </div>
  );
};

export default LandingPage;