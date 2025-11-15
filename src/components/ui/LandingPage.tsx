"use client";

import { useState, useEffect } from "react";
import { Navbar5 } from './Navbar/Navbar';
import Header from './Header';
import HeroSection from './HeroSection';
import Announcement from './Announcement'; 
import FeedbackForm from "./FeedbackForm";
import PublicEvents from './PublicEvents';
import News from './News';
import Footer from './Footer';
import RequestMedicineForm from "./RequestMedicineForm";
import { Button } from "./Navbar/button";

const LandingPage = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showMedicineForm, setShowMedicineForm] = useState(false);

  // Show/hide scroll to top button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-teal-50/30 to-cyan-50 dark:bg-gradient-to-br dark:from-[#0f2027] dark:via-[#203a43] dark:to-[#2c5364] text-gray-900 dark:text-white min-h-screen transition-all duration-500 ease-in-out overflow-x-hidden">
      {/* Enhanced Sticky Navbar with Health Theme */}
      <header className="fixed top-0 left-0 right-0 z-50 shadow-lg backdrop-blur-md bg-white/95 dark:bg-[#162942]/95 transition-all duration-300 border-b border-emerald-200/50 dark:border-teal-500/20">
        <Navbar5 />
      </header>

      {/* Enhanced Hero / Header Section with Performance Optimizations */}
      <div className="relative overflow-hidden will-change-transform pt-16 sm:pt-20">
        {/* Optimized health-themed background pattern */}
        <div className="absolute inset-0 opacity-3 dark:opacity-5 pointer-events-none" aria-hidden="true">
          <div className="absolute top-10 left-10 w-24 h-24 sm:w-32 sm:h-32 bg-emerald-400/30 rounded-full blur-3xl transform-gpu"></div>
          <div className="absolute top-40 right-10 sm:right-20 w-20 h-20 sm:w-24 sm:h-24 bg-teal-400/30 rounded-full blur-2xl transform-gpu"></div>
          <div className="absolute bottom-20 left-1/4 sm:left-1/3 w-24 h-24 sm:w-28 sm:h-28 bg-cyan-400/30 rounded-full blur-3xl transform-gpu"></div>
        </div>
        <Header />
      </div>

      <main className="relative space-y-6 sm:space-y-8 lg:space-y-12 xl:space-y-16 px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8" role="main">
        {/* Enhanced Hero Section with Performance */}
        <section
          id="hero"
          className="rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.005] bg-gradient-to-r from-white/90 to-emerald-50/80 dark:from-white/5 dark:to-emerald-900/20 backdrop-blur-sm border border-white/60 dark:border-emerald-500/20 will-change-transform"
          role="banner"
          aria-label="Hero section"
        >
          <HeroSection />
        </section>

        {/* Request Medicine Section */}
        <section className="space-y-3 sm:space-y-4 lg:space-y-6" role="region" aria-labelledby="request-medicine-heading">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg group hover:scale-110 transition-transform duration-300 transform-gpu" role="img" aria-label="Medicine icon">
                <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-white/90 rounded-md flex items-center justify-center">
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-teal-600 rounded-full"></div>
                </div>
              </div>
              <div>
                <h2 id="request-medicine-heading" className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                  Request Medicine
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 hidden sm:block">
                  Submit a request for available medicines from our health center
                </p>
              </div>
            </div>
            <div className="hidden lg:flex flex-1 h-0.5 bg-gradient-to-r from-teal-500/50 via-cyan-300/30 to-transparent rounded-full ml-4" aria-hidden="true"></div>
          </div>
          <div className="bg-gradient-to-br from-white/95 to-teal-50/40 dark:from-white/5 dark:to-teal-900/10 p-3 sm:p-4 lg:p-6 xl:p-8 rounded-xl sm:rounded-2xl shadow-lg border border-white/60 dark:border-teal-500/20 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <Button
              onClick={() => setShowMedicineForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Request Medicine
            </Button>
          </div>
       

      {/* Medicine Request Form Dialog */}
      <RequestMedicineForm open={showMedicineForm} setOpen={setShowMedicineForm} />
    </section>

        {/* Enhanced Events Section */}
        <section id="events" className="space-y-3 sm:space-y-4 lg:space-y-6" role="region" aria-labelledby="events-heading">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group hover:scale-110 transition-transform duration-300" role="img" aria-label="Events icon">
                <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-white/90 rounded-md flex items-center justify-center">
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-purple-600 rounded-sm"></div>
                </div>
              </div>
              <div>
                <h2 id="events-heading" className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                  Community Health Events
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 hidden sm:block">
                  Stay updated with barangay health programs and activities
                </p>
              </div>
            </div>
            <div className="hidden lg:flex flex-1 h-0.5 bg-gradient-to-r from-purple-500/50 via-purple-300/30 to-transparent rounded-full ml-4" aria-hidden="true"></div>
          </div>
          <div className="bg-gradient-to-br from-white/95 to-purple-50/40 dark:from-white/5 dark:to-purple-900/10 p-3 sm:p-4 lg:p-6 xl:p-8 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl border border-white/60 dark:border-purple-500/20 backdrop-blur-sm transition-all duration-300">
            <PublicEvents />
          </div>
        </section>

        {/* Enhanced Announcements Section */}
        <section id="announcements" className="space-y-3 sm:space-y-4 lg:space-y-6" role="region" aria-labelledby="announcements-heading">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group hover:scale-110 transition-transform duration-300 transform-gpu" role="img" aria-label="Announcements icon">
                <div className="relative">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-white/90 rounded-md flex items-center justify-center">
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-amber-600 rounded-full"></div>
                  </div>
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div>
                <h2 id="announcements-heading" className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                  Health Advisories & Announcements
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 hidden sm:block">
                  Important health updates and community announcements
                </p>
              </div>
            </div>
            <div className="hidden lg:flex flex-1 h-0.5 bg-gradient-to-r from-amber-500/50 via-amber-300/30 to-transparent rounded-full ml-4" aria-hidden="true"></div>
          </div>
          <div className="bg-gradient-to-br from-white/95 to-amber-50/60 dark:from-white/5 dark:to-amber-900/10 p-3 sm:p-4 lg:p-6 xl:p-8 rounded-xl sm:rounded-2xl shadow-lg border border-white/60 dark:border-amber-500/20 backdrop-blur-sm hover:shadow-xl transition-all duration-300 will-change-transform">
            <div className="min-h-[150px] sm:min-h-[200px] flex items-center justify-center">
              <Announcement />
            </div>
          </div>
        </section>

        {/* Enhanced Latest News Section */}
        <section id="latest-news" className="space-y-3 sm:space-y-4 lg:space-y-6" role="region" aria-labelledby="latest-news-heading">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group hover:scale-110 transition-transform duration-300 transform-gpu" role="img" aria-label="News icon">
                <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-white/90 rounded-md flex items-center justify-center">
                  <div className="space-y-0.5">
                    <div className="w-3 h-0.5 bg-blue-600 rounded-full"></div>
                    <div className="w-2 h-0.5 bg-blue-600 rounded-full"></div>
                    <div className="w-2.5 h-0.5 bg-blue-600 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div>
                <h2 id="latest-news-heading" className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                  Health News & Updates
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 hidden sm:block">
                  Latest health information and medical developments
                </p>
              </div>
            </div>
            <div className="hidden lg:flex flex-1 h-0.5 bg-gradient-to-r from-blue-500/50 via-blue-300/30 to-transparent rounded-full ml-4" aria-hidden="true"></div>
          </div>
          <div className="bg-gradient-to-br from-white/95 to-blue-50/60 dark:from-white/5 dark:to-blue-900/10 p-3 sm:p-4 lg:p-6 xl:p-8 rounded-xl sm:rounded-2xl shadow-lg border border-white/60 dark:border-blue-500/20 backdrop-blur-sm hover:shadow-xl transition-all duration-300 will-change-transform">
            <div className="relative">
              {/* Optimized news-themed decorative elements */}
              <div className="absolute top-2 right-2 w-16 h-16 sm:w-20 sm:h-20 bg-blue-500/5 rounded-full blur-2xl transform-gpu pointer-events-none" aria-hidden="true"></div>
              <div className="min-h-[150px] sm:min-h-[200px] flex items-center justify-center">
                <News />
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Emergency Contact Section with Better Mobile Layout */}
        <section id="emergency-contact" className="space-y-3 sm:space-y-4 lg:space-y-6" role="region" aria-labelledby="emergency-contact-heading">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse transform-gpu" role="img" aria-label="Emergency icon">
                <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-white/90 rounded-md flex items-center justify-center">
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-red-600 rounded-full animate-ping"></div>
                </div>
              </div>
              <div>
                <h2 id="emergency-contact-heading" className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                  Emergency Health Contacts
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 hidden sm:block">
                  Quick access to emergency medical services
                </p>
              </div>
            </div>
            <div className="hidden lg:flex flex-1 h-0.5 bg-gradient-to-r from-red-500/50 via-red-300/30 to-transparent rounded-full ml-4" aria-hidden="true"></div>
          </div>
          <div className="bg-gradient-to-br from-white/95 to-red-50/40 dark:from-white/5 dark:to-red-900/10 p-3 sm:p-4 lg:p-6 xl:p-8 rounded-xl sm:rounded-2xl shadow-lg border border-white/60 dark:border-red-500/20 backdrop-blur-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6" role="list">
              {[
                { 
                  service: "Emergency Hotline", 
                  number: "911", 
                  icon: "🚑", 
                  description: "For life-threatening emergencies",
                  color: "from-red-500 to-red-600"
                },
                { 
                  service: "Barangay New Kalalake Health Office", 
                  number: "639-5027", 
                  icon: "🏥", 
                  description: "Local health services & emergency health assistance",
                  color: "from-blue-500 to-blue-600"
                },
                { 
                  service: "COVID Helpline", 
                  number: "1555", 
                  icon: "😷", 
                  description: "COVID-19 assistance & information",
                  color: "from-yellow-500 to-yellow-600"
                },
                { 
                  service: "Mental Health Crisis", 
                  number: "0917-899-8727", 
                  icon: "🧠", 
                  description: "Mental health support & counseling",
                  color: "from-purple-500 to-purple-600"
                },
              ].map((contact, index) => (
                <article
                  key={index}
                  role="listitem"
                  className="bg-white/90 dark:bg-white/5 p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl shadow-md border border-gray-200/60 dark:border-gray-600/20 hover:shadow-lg focus-within:shadow-lg focus-within:ring-2 focus-within:ring-red-500/50 transition-all duration-300 text-center group will-change-transform hover:scale-105"
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${contact.color} rounded-xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 transform-gpu shadow-lg`}>
                    <span className="text-xl sm:text-2xl select-none" role="img" aria-label={`${contact.service} icon`}>
                      {contact.icon}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base lg:text-lg mb-2 leading-tight">
                    {contact.service}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 min-h-[2.5rem] sm:min-h-[3rem] flex items-center justify-center leading-relaxed px-2">
                    {contact.description}
                  </p>
                  <a
                    href={`tel:${contact.number}`}
                    className={`inline-flex items-center justify-center px-4 py-2 sm:py-3 bg-gradient-to-r ${contact.color} text-white font-bold text-sm sm:text-base lg:text-lg rounded-lg hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all duration-200 group-hover:scale-105 transform-gpu min-w-[120px] sm:min-w-[140px]`}
                    aria-label={`Call ${contact.service} at ${contact.number}`}
                  >
                    {contact.number}
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Health Resources Section with Better Mobile Experience */}
        <section id="health-resources" className="space-y-3 sm:space-y-4 lg:space-y-6" role="region" aria-labelledby="health-resources-heading">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group hover:scale-110 transition-transform duration-300 transform-gpu" role="img" aria-label="Resources icon">
                <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-white/90 rounded-md flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-0.5">
                    <div className="w-1 h-1 bg-indigo-600 rounded-full"></div>
                    <div className="w-1 h-1 bg-purple-600 rounded-full"></div>
                    <div className="w-1 h-1 bg-purple-600 rounded-full"></div>
                    <div className="w-1 h-1 bg-indigo-600 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div>
                <h2 id="health-resources-heading" className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                  Health Resources
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 hidden sm:block">
                  Essential health information and community resources
                </p>
              </div>
            </div>
            <div className="hidden lg:flex flex-1 h-0.5 bg-gradient-to-r from-indigo-500/50 via-purple-300/30 to-transparent rounded-full ml-4" aria-hidden="true"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6" role="list">
            {[
              {
                title: "Barangay Information",
                description: "Official Barangay information and resources for our community's health and wellness programs",
                icon: "📋",
                color: "from-blue-500 to-cyan-600",
                link: "/information"
              },
              {
                title: "Health Facilities",
                description: "Find nearby hospitals, clinics, and healthcare facilities in your area with contact information",
                icon: "🏥",
                color: "from-purple-500 to-indigo-600",
                link: "#facilities"
              },
              {
                title: "Request Medicine",
                description: "Submit a request for medicine from our barangay health center with your prescription",
                icon: "💊",
                color: "from-teal-500 to-cyan-600",
                link: "#",
                onClick: () => setShowMedicineForm(true)
              }
            ].map((resource, index) => (
              <article
                key={index}
                role="listitem"
                className="bg-gradient-to-br from-white/95 to-gray-50/60 dark:from-white/5 dark:to-gray-800/20 p-4 sm:p-5 lg:p-6 xl:p-8 rounded-xl sm:rounded-2xl shadow-lg border border-white/60 dark:border-gray-600/20 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:scale-105 group will-change-transform"
              >
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br ${resource.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 transform-gpu flex-shrink-0 mx-auto sm:mx-0`}>
                    <span className="text-2xl sm:text-3xl lg:text-4xl select-none" aria-hidden="true">{resource.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg sm:text-xl lg:text-2xl mb-2 sm:mb-3">
                      {resource.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6">
                      {resource.description}
                    </p>
                    <a
                      href={resource.link}
                      onClick={(e) => {
                        if (resource.onClick) {
                          e.preventDefault();
                          resource.onClick();
                        }
                      }}
                      className={`inline-flex items-center justify-center px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r ${resource.color} text-white font-semibold text-sm sm:text-base rounded-lg hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200 group-hover:scale-105 transform-gpu min-w-[120px]`}
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

        {/* Enhanced Feedback Section */}
        <section id="feedback" className="space-y-3 sm:space-y-4 lg:space-y-6" role="region" aria-labelledby="feedback-heading">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group hover:scale-110 transition-transform duration-300" role="img" aria-label="Feedback icon">
                <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-white/90 rounded-md flex items-center justify-center">
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-600 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div>
                <h2 id="feedback-heading" className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                  Community Feedback
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 hidden sm:block">
                  Share your thoughts and help improve our health services
                </p>
              </div>
            </div>
            <div className="hidden lg:flex flex-1 h-0.5 bg-gradient-to-r from-green-500/50 via-emerald-300/30 to-transparent rounded-full ml-4" aria-hidden="true"></div>
          </div>
          <div className="bg-gradient-to-br from-white/95 to-green-50/40 dark:from-white/5 dark:to-green-900/10 p-3 sm:p-4 lg:p-6 xl:p-8 rounded-xl sm:rounded-2xl shadow-lg border border-white/60 dark:border-green-500/20 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <FeedbackForm />
          </div>
        </section>
      </main>

      {/* Enhanced Footer with better performance */}
      <footer className="mt-8 sm:mt-12 lg:mt-16 xl:mt-20 border-t border-emerald-200/50 dark:border-teal-500/20 bg-gradient-to-r from-white/60 to-emerald-50/40 dark:from-gray-900/60 dark:to-emerald-900/10 backdrop-blur-sm will-change-transform" role="contentinfo">
        <Footer />
      </footer>

      {/* Enhanced Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 group animate-bounce"
          aria-label="Scroll to top"
          title="Back to top"
        >
          <div className="flex items-center justify-center h-full">
            <svg 
              className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 transform group-hover:scale-110 transition-transform duration-200" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              strokeWidth={3}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M5 10l7-7m0 0l7 7m-7-7v18" 
              />
            </svg>
          </div>
          
          {/* Health-themed pulse effect */}
          <div className="absolute inset-0 rounded-full bg-emerald-400 opacity-20 animate-ping"></div>
        </button>
      )}
      
    </div>
  );
};

export default LandingPage;