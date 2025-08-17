import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 text-white py-8 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Health-themed background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true">
        <div className="absolute top-10 left-10 w-24 h-24 bg-emerald-400 rounded-full blur-2xl transform-gpu"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-teal-400 rounded-full blur-3xl transform-gpu"></div>
        <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-cyan-400 rounded-full blur-xl transform-gpu"></div>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-6">
          
          {/* Brand Section - Enhanced */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl font-bold" aria-hidden="true">💚</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                KaHealth
              </h4>
            </div>
            <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
              A comprehensive health information system developed for Barangay New Kalalake residents to stay informed about health news, advisories, and community wellness programs.
            </p>
            <div className="flex items-center gap-2 text-emerald-200">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-xs sm:text-sm font-medium">Serving the community since 2024</span>
            </div>
          </div>

          {/* Information Section - Enhanced */}
          <div className="space-y-4">
            <h4 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center text-sm" aria-hidden="true">ℹ️</span>
              Information
            </h4>
            <ul className="space-y-3 text-sm sm:text-base">
              <li>
                <Dialog>
                  <DialogTrigger className="text-emerald-200 hover:text-emerald-100 hover:underline focus:text-emerald-100 focus:underline focus:outline-none focus:ring-2 focus:ring-emerald-400/50 rounded px-1 py-0.5 transition-all duration-200 flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full group-hover:scale-125 transition-transform duration-200"></span>
                    About the Website
                  </DialogTrigger>
                  <DialogContent className="bg-white dark:bg-gray-900 border border-emerald-200 dark:border-emerald-700 max-w-md sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm" aria-hidden="true">🏥</span>
                        </div>
                        About KaHealth
                      </DialogTitle>
                      <DialogDescription className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        KaHealth is a digital health hub designed specifically for the people of Barangay New Kalalake. Our platform aims to deliver timely and accurate health news, advisories, and educational content, with a special focus on accessibility for mobile users and elderly community members. We strive to bridge the gap between healthcare information and our community.
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </li>
              <li>
                <Dialog>
                  <DialogTrigger className="text-emerald-200 hover:text-emerald-100 hover:underline focus:text-emerald-100 focus:underline focus:outline-none focus:ring-2 focus:ring-emerald-400/50 rounded px-1 py-0.5 transition-all duration-200 flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full group-hover:scale-125 transition-transform duration-200"></span>
                    Mission & Vision
                  </DialogTrigger>
                  <DialogContent className="bg-white dark:bg-gray-900 border border-emerald-200 dark:border-emerald-700 max-w-md sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm" aria-hidden="true">🎯</span>
                        </div>
                        Mission & Vision
                      </DialogTitle>
                      <DialogDescription className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg border border-emerald-200 dark:border-emerald-700">
                          <h4 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-2 flex items-center gap-2">
                            <span aria-hidden="true">🎯</span> Mission
                          </h4>
                          <p className="text-gray-700 dark:text-gray-300">
                            To provide efficient and transparent governance that ensures the health and well-being of our community through accessible digital health information and services.
                          </p>
                        </div>
                        <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg border border-teal-200 dark:border-teal-700">
                          <h4 className="font-semibold text-teal-800 dark:text-teal-300 mb-2 flex items-center gap-2">
                            <span aria-hidden="true">👁️</span> Vision
                          </h4>
                          <p className="text-gray-700 dark:text-gray-300">
                            A progressive Barangay New Kalalake that is healthy, resilient, and inclusive, with accessible health information and resources for all community members.
                          </p>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </li>
            </ul>
          </div>

          {/* Contact Section - Enhanced */}
          <div className="space-y-4">
            <h4 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center text-sm" aria-hidden="true">📞</span>
              Contact Us
            </h4>
            <ul className="text-sm sm:text-base space-y-3">
              <li className="flex items-center gap-3 group">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-300 text-sm" aria-hidden="true">✉️</span>
                </div>
                <div>
                  <span className="text-emerald-200 text-xs block">Email</span>
                  <a 
                    href="mailto:barangay.newkalalake@gmail.com" 
                    className="text-white hover:text-emerald-200 focus:text-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 rounded transition-colors duration-200 break-all"
                    aria-label="Send email to barangay.newkalalake@gmail.com"
                  >
                    barangay.newkalalake@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-green-300 text-sm" aria-hidden="true">📱</span>
                </div>
                <div>
                  <span className="text-emerald-200 text-xs block">Phone</span>
                  <a 
                    href="tel:(047) 222-5677" 
                    className="text-white hover:text-emerald-200 focus:text-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 rounded transition-colors duration-200"
                    aria-label="Call (047) 222-5677"
                  >
                    (047) 222-5677
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-300 text-sm" aria-hidden="true">📘</span>
                </div>
                <div>
                  <span className="text-emerald-200 text-xs block">Facebook</span>
                  <a 
                    href="https://web.facebook.com/profile.php?id=100079624825596" 
                    className="text-white hover:text-emerald-200 focus:text-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 rounded transition-colors duration-200" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label="Visit Barangay New Kalalake Facebook page"
                  >
                    Barangay New Kalalake
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Health Resources Section - New */}
          <div className="space-y-4">
            <h4 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-gradient-to-br from-pink-400 to-rose-500 rounded-lg flex items-center justify-center text-sm" aria-hidden="true">🩺</span>
              Health Resources
            </h4>
            <ul className="text-sm sm:text-base space-y-3">
              <li>
                <a 
                  href="#emergency-contact" 
                  className="text-emerald-200 hover:text-emerald-100 focus:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 rounded px-1 py-0.5 transition-all duration-200 flex items-center gap-2 group"
                  aria-label="Go to emergency contacts section"
                >
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full group-hover:scale-125 transition-transform duration-200 animate-pulse"></span>
                  Emergency Contacts
                </a>
              </li>
              <li>
                <a 
                  href="#health-tips" 
                  className="text-emerald-200 hover:text-emerald-100 focus:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 rounded px-1 py-0.5 transition-all duration-200 flex items-center gap-2 group"
                  aria-label="Go to health tips section"
                >
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full group-hover:scale-125 transition-transform duration-200"></span>
                  Health Tips & Guidelines
                </a>
              </li>
              <li>
                <a 
                  href="#health-topics" 
                  className="text-emerald-200 hover:text-emerald-100 focus:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 rounded px-1 py-0.5 transition-all duration-200 flex items-center gap-2 group"
                  aria-label="Go to health topics section"
                >
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full group-hover:scale-125 transition-transform duration-200"></span>
                  Community Health Topics
                </a>
              </li>
              <li>
                <a 
                  href="#announcements" 
                  className="text-emerald-200 hover:text-emerald-100 focus:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 rounded px-1 py-0.5 transition-all duration-200 flex items-center gap-2 group"
                  aria-label="Go to health announcements section"
                >
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full group-hover:scale-125 transition-transform duration-200"></span>
                  Health Announcements
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Enhanced Footer Bottom */}
        <div className="mt-8 sm:mt-10 lg:mt-12 pt-6 sm:pt-8 border-t border-emerald-700/50">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="text-center sm:text-left">
              <p className="text-xs sm:text-sm text-emerald-200">
                © {new Date().getFullYear()} KaHealth - Barangay New Kalalake Health Information System
              </p>
              <p className="text-xs text-emerald-300 mt-1">
                Committed to community health and wellness
              </p>
            </div>
            <div className="flex items-center justify-center sm:justify-end gap-4">
              <div className="flex items-center gap-2 text-emerald-300">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-xs">System Active</span>
              </div>
              <div className="text-xs text-emerald-200 bg-emerald-800/30 px-3 py-1 rounded-full border border-emerald-600/30">
                Health First 💚
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;