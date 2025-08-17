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
    <div className="bg-gradient-to-br from-emerald-50 via-teal-50/30 to-cyan-50 dark:bg-gradient-to-br dark:from-[#0f2027] dark:via-[#203a43] dark:to-[#2c5364] text-gray-900 dark:text-white min-h-screen transition-all duration-500 ease-in-out">
      {/* Enhanced Sticky Navbar with Health Theme */}
      <header className="sticky top-0 z-50 shadow-lg backdrop-blur-md bg-white/90 dark:bg-[#162942]/90 transition-all duration-300 border-b border-emerald-200/50 dark:border-teal-500/20">
        <Navbar5 />
      </header>

      {/* Enhanced Hero / Header Section */}
      <div className="relative overflow-hidden">
        {/* Subtle health-themed background pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-500 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-teal-500 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 left-1/3 w-28 h-28 bg-cyan-500 rounded-full blur-3xl"></div>
        </div>
        <Header />
      </div>

      <main className="relative space-y-12 sm:space-y-16 lg:space-y-20 px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8 lg:py-12">
        {/* Enhanced Hero Section */}
        <section
          id="hero"
          className="rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] bg-gradient-to-r from-white/80 to-emerald-50/80 dark:from-white/5 dark:to-emerald-900/20 backdrop-blur-sm border border-white/50 dark:border-emerald-500/20"
        >
          <HeroSection />
        </section>

        {/* Enhanced Announcements Section */}
        <section id="announcements" className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-lg sm:text-xl">📢</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                Health Advisories & Announcements
              </h2>
            </div>
            <div className="hidden sm:flex flex-1 h-1 bg-gradient-to-r from-amber-500/50 to-transparent rounded-full"></div>
          </div>
          <div className="bg-gradient-to-br from-white/90 to-amber-50/50 dark:from-white/5 dark:to-amber-900/10 p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg border border-white/50 dark:border-amber-500/20 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <Announcement />
          </div>
        </section>

        {/* Enhanced Health Topics Section */}
        <section id="health-topics" className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-lg sm:text-xl">🩺</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                Community Health Topics
              </h2>
            </div>
            <div className="hidden sm:flex flex-1 h-1 bg-gradient-to-r from-emerald-500/50 to-transparent rounded-full"></div>
          </div>
          <div className="bg-gradient-to-br from-white/90 to-emerald-50/50 dark:from-white/5 dark:to-emerald-900/10 p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg border border-white/50 dark:border-emerald-500/20 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <div className="relative">
              {/* Health-themed decorative elements */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 bg-teal-500/10 rounded-full blur-lg"></div>
              <HealthAlmanac />
            </div>
          </div>
        </section>

        {/* Enhanced Latest News Section */}
        <section id="latest-news" className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-lg sm:text-xl">📰</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                Health News & Updates
              </h2>
            </div>
            <div className="hidden sm:flex flex-1 h-1 bg-gradient-to-r from-blue-500/50 to-transparent rounded-full"></div>
          </div>
          <div className="bg-gradient-to-br from-white/90 to-blue-50/50 dark:from-white/5 dark:to-blue-900/10 p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg border border-white/50 dark:border-blue-500/20 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <div className="relative">
              {/* News-themed decorative elements */}
              <div className="absolute top-2 right-2 w-20 h-20 bg-blue-500/5 rounded-full blur-2xl"></div>
              <News />
            </div>
          </div>
        </section>

        {/* Health Tips Quick Access Section (New Addition) */}
        <section id="health-tips" className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-lime-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-lg sm:text-xl">💡</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                Quick Health Tips
              </h2>
            </div>
            <div className="hidden sm:flex flex-1 h-1 bg-gradient-to-r from-green-500/50 to-transparent rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                icon: "💧",
                title: "Stay Hydrated",
                tip: "Drink at least 8 glasses of water daily for optimal health",
                color: "from-cyan-500 to-blue-600"
              },
              {
                icon: "🏃‍♂️",
                title: "Daily Exercise",
                tip: "30 minutes of physical activity can boost your immunity",
                color: "from-green-500 to-emerald-600"
              },
              {
                icon: "🥗",
                title: "Balanced Diet",
                tip: "Include fruits and vegetables in every meal",
                color: "from-orange-500 to-red-500"
              },
              {
                icon: "😴",
                title: "Quality Sleep",
                tip: "Get 7-9 hours of sleep for better mental health",
                color: "from-purple-500 to-indigo-600"
              },
              {
                icon: "🧼",
                title: "Hand Hygiene",
                tip: "Wash hands regularly to prevent infections",
                color: "from-teal-500 to-cyan-600"
              },
              {
                icon: "🩺",
                title: "Regular Checkups",
                tip: "Schedule routine health screenings and vaccinations",
                color: "from-pink-500 to-rose-600"
              }
            ].map((tip, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white/90 to-gray-50/50 dark:from-white/5 dark:to-gray-800/20 p-4 sm:p-6 rounded-2xl shadow-lg border border-white/50 dark:border-gray-600/20 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${tip.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-white text-xl sm:text-2xl">{tip.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg mb-2">
                      {tip.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                      {tip.tip}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Emergency Contact Section (New Addition) */}
        <section id="emergency-contact" className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                <span className="text-white text-lg sm:text-xl">🚨</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                Emergency Contacts
              </h2>
            </div>
            <div className="hidden sm:flex flex-1 h-1 bg-gradient-to-r from-red-500/50 to-transparent rounded-full"></div>
          </div>
          <div className="bg-gradient-to-br from-white/90 to-red-50/30 dark:from-white/5 dark:to-red-900/10 p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg border border-white/50 dark:border-red-500/20 backdrop-blur-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { service: "Emergency Hotline", number: "911", icon: "🚑" },
                { service: "Barangay Health Station", number: "(02) 8123-4567", icon: "🏥" },
                { service: "COVID Helpline", number: "1555", icon: "😷" },
                { service: "Mental Health Crisis", number: "0917-899-8727", icon: "🧠" }
              ].map((contact, index) => (
                <div
                  key={index}
                  className="bg-white/80 dark:bg-white/5 p-4 sm:p-6 rounded-xl shadow-md border border-gray-200/50 dark:border-gray-600/20 hover:shadow-lg transition-all duration-300 text-center group"
                >
                  <div className="text-3xl sm:text-4xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
                    {contact.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base mb-2">
                    {contact.service}
                  </h3>
                  <a
                    href={`tel:${contact.number}`}
                    className="text-red-600 dark:text-red-400 font-bold text-lg sm:text-xl hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200"
                  >
                    {contact.number}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Enhanced Footer */}
      <footer className="mt-12 sm:mt-16 lg:mt-20 border-t border-emerald-200/50 dark:border-teal-500/20 bg-gradient-to-r from-white/50 to-emerald-50/30 dark:from-gray-900/50 dark:to-emerald-900/10 backdrop-blur-sm">
        <Footer />
      </footer>
    </div>
  );
};

export default LandingPage;