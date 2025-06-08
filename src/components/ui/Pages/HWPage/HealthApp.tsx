// import React, { useState, useEffect } from 'react';
// import { 
//   Bell, 
//   Heart, 
//   Newspaper, 
//   MessageSquare, 
//   Phone, 
//   Menu, 
//   X, 
//   Moon, 
//   Sun,
//   ChevronRight,
//   Users,
//   Calendar,
//   MapPin,
//   Mail,
//   Clock,
//   Star,
//   TrendingUp,
//   Shield
// } from 'lucide-react';

// const HealthApp = () => {
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [activeSection, setActiveSection] = useState('home');

//   const toggleDarkMode = () => {
//     setIsDarkMode(!isDarkMode);
//   };

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//   };

//   // Sample data
//   const announcements = [
//     {
//       id: 1,
//       title: "COVID-19 Vaccination Drive",
//       content: "Free vaccination available at the barangay hall every Monday and Wednesday, 8AM-5PM.",
//       date: "2025-06-08",
//       priority: "high"
//     },
//     {
//       id: 2,
//       title: "Health Screening Program",
//       content: "Monthly health screening for seniors aged 60 and above. Free blood pressure and diabetes check.",
//       date: "2025-06-07",
//       priority: "medium"
//     }
//   ];

//   const healthBlogs = [
//     {
//       id: 1,
//       title: "Understanding Hypertension: A Complete Guide",
//       author: "Dr. Maria Santos",
//       excerpt: "Learn about the silent killer and how to manage blood pressure effectively through lifestyle changes and medical intervention.",
//       readTime: "5 min read",
//       date: "2025-06-05",
//       image: "/api/placeholder/300/200"
//     },
//     {
//       id: 2,
//       title: "Mental Health During Pandemic",
//       author: "Nurse Patricia Cruz",
//       excerpt: "Practical tips for maintaining mental wellness and recognizing signs of depression and anxiety.",
//       readTime: "8 min read",
//       date: "2025-06-03",
//       image: "/api/placeholder/300/200"
//     }
//   ];

//   const contacts = [
//     {
//       sector: "Health Center",
//       name: "Barangay Health Station",
//       phone: "+63 917 123 4567",
//       landline: "(02) 8123-4567",
//       hours: "24/7 Emergency"
//     },
//     {
//       sector: "Captain's Office",
//       name: "Barangay Captain Maria Dela Cruz",
//       phone: "+63 918 765 4321",
//       landline: "(02) 8765-4321",
//       hours: "Mon-Fri 8AM-5PM"
//     },
//     {
//       sector: "Emergency Response",
//       name: "Barangay Emergency Unit",
//       phone: "+63 919 999 8888",
//       landline: "911",
//       hours: "24/7"
//     }
//   ];

//   const newsItems = [
//     {
//       id: 1,
//       title: "New Healthcare Facility Opens in District",
//       source: "Manila Bulletin",
//       time: "2 hours ago",
//       category: "Health"
//     },
//     {
//       id: 2,
//       title: "WHO Announces New Health Guidelines",
//       source: "Philippine Star",
//       time: "4 hours ago",
//       category: "International"
//     }
//   ];

//   return (
//     <div className={`min-h-screen transition-colors duration-300 ${
//       isDarkMode 
//         ? 'bg-gray-900 text-white' 
//         : 'bg-white text-gray-900'
//     }`}>
//       {/* Navigation */}
//       <nav className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
//         isDarkMode 
//           ? 'bg-gray-800 border-gray-700' 
//           : 'bg-white border-gray-200'
//       }`} style={{ backgroundColor: isDarkMode ? '#02343F' : '#02343F' }}>
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             {/* Logo */}
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 rounded-full flex items-center justify-center" 
//                    style={{ backgroundColor: '#F0EDCC' }}>
//                 <Heart className="w-6 h-6" style={{ color: '#02343F' }} />
//               </div>
//               <span className="text-xl font-bold text-white">HealthCare Portal</span>
//             </div>

//             {/* Desktop Navigation */}
//             <div className="hidden md:flex items-center space-x-8">
//               {['Home', 'Announcements', 'Health Blog', 'News', 'Contact'].map((item) => (
//                 <button
//                   key={item}
//                   onClick={() => setActiveSection(item.toLowerCase().replace(' ', ''))}
//                   className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
//                     activeSection === item.toLowerCase().replace(' ', '')
//                       ? 'text-white border-b-2' 
//                       : 'text-gray-300 hover:text-white'
//                   }`}
//                   style={{ borderColor: activeSection === item.toLowerCase().replace(' ', '') ? '#F0EDCC' : 'transparent' }}
//                 >
//                   {item}
//                 </button>
//               ))}
//             </div>

//             {/* Right side buttons */}
//             <div className="flex items-center space-x-4">
//               <button
//                 onClick={toggleDarkMode}
//                 className="p-2 rounded-lg transition-colors duration-200 hover:bg-gray-700"
//               >
//                 {isDarkMode ? (
//                   <Sun className="w-5 h-5 text-gray-300" />
//                 ) : (
//                   <Moon className="w-5 h-5 text-gray-300" />
//                 )}
//               </button>
              
//               <button
//                 onClick={toggleMobileMenu}
//                 className="md:hidden p-2 rounded-lg transition-colors duration-200 hover:bg-gray-700"
//               >
//                 {isMobileMenuOpen ? (
//                   <X className="w-6 h-6 text-white" />
//                 ) : (
//                   <Menu className="w-6 h-6 text-white" />
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {isMobileMenuOpen && (
//           <div className="md:hidden border-t border-gray-700">
//             <div className="px-2 pt-2 pb-3 space-y-1">
//               {['Home', 'Announcements', 'Health Blog', 'News', 'Contact'].map((item) => (
//                 <button
//                   key={item}
//                   onClick={() => {
//                     setActiveSection(item.toLowerCase().replace(' ', ''));
//                     setIsMobileMenuOpen(false);
//                   }}
//                   className={`block w-full text-left px-3 py-2 text-base font-medium transition-colors duration-200 ${
//                     activeSection === item.toLowerCase().replace(' ', '')
//                       ? 'text-white bg-gray-700' 
//                       : 'text-gray-300 hover:text-white hover:bg-gray-700'
//                   }`}
//                 >
//                   {item}
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}
//       </nav>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Home Section */}
//         {activeSection === 'home' && (
//           <div className="space-y-12">
//             {/* Hero Section */}
//             <section className={`rounded-2xl p-8 lg:p-12 ${
//               isDarkMode ? 'bg-gray-800' : 'bg-gradient-to-r from-gray-50 to-gray-100'
//             }`}>
//               <div className="grid lg:grid-cols-2 gap-8 items-center">
//                 <div>
//                   <h1 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: '#02343F' }}>
//                     Your Health, Our Priority
//                   </h1>
//                   <p className={`text-lg mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//                     Access reliable health information, stay updated with community announcements, 
//                     and connect with local healthcare services in one convenient platform.
//                   </p>
//                   <div className="flex flex-col sm:flex-row gap-4">
//                     <button 
//                       className="px-6 py-3 rounded-lg font-semibold text-white transition-transform hover:scale-105"
//                       style={{ backgroundColor: '#02343F' }}
//                       onClick={() => setActiveSection('announcements')}
//                     >
//                       View Announcements
//                     </button>
//                     <button 
//                       className="px-6 py-3 rounded-lg font-semibold border-2 transition-colors hover:bg-gray-50"
//                       style={{ borderColor: '#02343F', color: '#02343F' }}
//                       onClick={() => setActiveSection('contact')}
//                     >
//                       Contact Us
//                     </button>
//                   </div>
//                 </div>
//                 <div className="relative">
//                   <div className={`w-full h-64 lg:h-80 rounded-xl ${
//                     isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
//                   } flex items-center justify-center`}>
//                     <Shield className="w-24 h-24" style={{ color: '#02343F' }} />
//                   </div>
//                 </div>
//               </div>
//             </section>

//             {/* Quick Stats */}
//             <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {[
//                 { icon: Bell, label: 'Active Announcements', value: '12', color: '#02343F' },
//                 { icon: Heart, label: 'Health Articles', value: '48', color: '#02343F' },
//                 { icon: Users, label: 'Community Members', value: '2.5K', color: '#02343F' }
//               ].map((stat, index) => (
//                 <div key={index} className={`p-6 rounded-xl border ${
//                   isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
//                 } hover:shadow-lg transition-shadow`}>
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//                         {stat.label}
//                       </p>
//                       <p className="text-2xl font-bold mt-2">{stat.value}</p>
//                     </div>
//                     <stat.icon className="w-8 h-8" style={{ color: stat.color }} />
//                   </div>
//                 </div>
//               ))}
//             </section>

//             {/* Recent Updates Preview */}
//             <section className="grid lg:grid-cols-2 gap-8">
//               {/* Recent Announcements */}
//               <div className={`p-6 rounded-xl border ${
//                 isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
//               }`}>
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-xl font-semibold">Recent Announcements</h3>
//                   <button 
//                     onClick={() => setActiveSection('announcements')}
//                     className="text-sm hover:underline"
//                     style={{ color: '#02343F' }}
//                   >
//                     View All
//                   </button>
//                 </div>
//                 <div className="space-y-4">
//                   {announcements.slice(0, 2).map((announcement) => (
//                     <div key={announcement.id} className={`p-4 rounded-lg ${
//                       isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
//                     }`}>
//                       <h4 className="font-medium mb-2">{announcement.title}</h4>
//                       <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//                         {announcement.content.substring(0, 80)}...
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Recent Health Articles */}
//               <div className={`p-6 rounded-xl border ${
//                 isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
//               }`}>
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-xl font-semibold">Latest Health Articles</h3>
//                   <button 
//                     onClick={() => setActiveSection('healthblog')}
//                     className="text-sm hover:underline"
//                     style={{ color: '#02343F' }}
//                   >
//                     View All
//                   </button>
//                 </div>
//                 <div className="space-y-4">
//                   {healthBlogs.slice(0, 2).map((blog) => (
//                     <div key={blog.id} className={`p-4 rounded-lg ${
//                       isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
//                     }`}>
//                       <h4 className="font-medium mb-2">{blog.title}</h4>
//                       <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//                         By {blog.author} • {blog.readTime}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </section>
//           </div>
//         )}

//         {/* Announcements Section */}
//         {activeSection === 'announcements' && (
//           <div className="space-y-8">
//             <div className="flex items-center justify-between">
//               <h2 className="text-3xl font-bold">Barangay Announcements</h2>
//               <Bell className="w-8 h-8" style={{ color: '#02343F' }} />
//             </div>
            
//             <div className="grid gap-6">
//               {announcements.map((announcement) => (
//                 <div key={announcement.id} className={`p-6 rounded-xl border ${
//                   isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
//                 } hover:shadow-lg transition-shadow`}>
//                   <div className="flex items-start justify-between mb-4">
//                     <div className="flex items-center space-x-3">
//                       <div className={`px-3 py-1 rounded-full text-xs font-medium ${
//                         announcement.priority === 'high' 
//                           ? 'bg-red-100 text-red-800' 
//                           : 'bg-yellow-100 text-yellow-800'
//                       }`}>
//                         {announcement.priority.toUpperCase()}
//                       </div>
//                       <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
//                         {announcement.date}
//                       </span>
//                     </div>
//                   </div>
//                   <h3 className="text-xl font-semibold mb-3">{announcement.title}</h3>
//                   <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
//                     {announcement.content}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Health Blog Section */}
//         {activeSection === 'healthblog' && (
//           <div className="space-y-8">
//             <div className="flex items-center justify-between">
//               <h2 className="text-3xl font-bold">Health Blog</h2>
//               <Heart className="w-8 h-8" style={{ color: '#02343F' }} />
//             </div>
            
//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {healthBlogs.map((blog) => (
//                 <article key={blog.id} className={`rounded-xl border overflow-hidden ${
//                   isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
//                 } hover:shadow-lg transition-shadow`}>
//                   <div className={`h-48 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center`}>
//                     <Heart className="w-12 h-12" style={{ color: '#02343F' }} />
//                   </div>
//                   <div className="p-6">
//                     <h3 className="text-lg font-semibold mb-3">{blog.title}</h3>
//                     <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//                       {blog.excerpt}
//                     </p>
//                     <div className="flex items-center justify-between text-sm">
//                       <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
//                         By {blog.author}
//                       </span>
//                       <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
//                         {blog.readTime}
//                       </span>
//                     </div>
//                   </div>
//                 </article>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* News Section */}
//         {activeSection === 'news' && (
//           <div className="space-y-8">
//             <div className="flex items-center justify-between">
//               <h2 className="text-3xl font-bold">Health News</h2>
//               <Newspaper className="w-8 h-8" style={{ color: '#02343F' }} />
//             </div>
            
//             <div className="grid gap-4">
//               {newsItems.map((news) => (
//                 <div key={news.id} className={`p-6 rounded-xl border ${
//                   isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
//                 } hover:shadow-lg transition-shadow`}>
//                   <div className="flex items-center justify-between mb-3">
//                     <span className={`px-3 py-1 rounded-full text-xs font-medium ${
//                       isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
//                     }`}>
//                       {news.category}
//                     </span>
//                     <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
//                       {news.time}
//                     </span>
//                   </div>
//                   <h3 className="text-lg font-semibold mb-2">{news.title}</h3>
//                   <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
//                     Source: {news.source}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Contact Section */}
//         {activeSection === 'contact' && (
//           <div className="space-y-8">
//             <div className="flex items-center justify-between">
//               <h2 className="text-3xl font-bold">Contact Information</h2>
//               <Phone className="w-8 h-8" style={{ color: '#02343F' }} />
//             </div>
            
//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {contacts.map((contact, index) => (
//                 <div key={index} className={`p-6 rounded-xl border ${
//                   isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
//                 } hover:shadow-lg transition-shadow`}>
//                   <h3 className="text-lg font-semibold mb-4" style={{ color: '#02343F' }}>
//                     {contact.sector}
//                   </h3>
//                   <div className="space-y-3">
//                     <p className="font-medium">{contact.name}</p>
//                     <div className="flex items-center space-x-2">
//                       <Phone className="w-4 h-4" style={{ color: '#02343F' }} />
//                       <span className="text-sm">{contact.phone}</span>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <Phone className="w-4 h-4" style={{ color: '#02343F' }} />
//                       <span className="text-sm">{contact.landline}</span>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <Clock className="w-4 h-4" style={{ color: '#02343F' }} />
//                       <span className="text-sm">{contact.hours}</span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Feedback Form */}
//             <div className={`p-8 rounded-xl border ${
//               isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
//             }`}>
//               <h3 className="text-2xl font-semibold mb-6">Send Us Feedback</h3>
//               <div className="space-y-6">
//                 <div className="grid md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium mb-2">Name</label>
//                     <input
//                       type="text"
//                       className={`w-full px-4 py-3 rounded-lg border ${
//                         isDarkMode 
//                           ? 'bg-gray-700 border-gray-600 text-white' 
//                           : 'bg-white border-gray-300'
//                       } focus:ring-2 focus:ring-opacity-50 focus:ring-[#02343F]`}
//                       placeholder="Your full name"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-2">Email</label>
//                     <input
//                       type="email"
//                       className={`w-full px-4 py-3 rounded-lg border ${
//                         isDarkMode 
//                           ? 'bg-gray-700 border-gray-600 text-white' 
//                           : 'bg-white border-gray-300'
//                       } focus:ring-2 focus:ring-opacity-50 focus:ring-[#02343F]`}
//                       placeholder="your.email@example.com"
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2">Message</label>
//                   <textarea
//                     rows={4}
//                     className={`w-full px-4 py-3 rounded-lg border ${
//                       isDarkMode 
//                         ? 'bg-gray-700 border-gray-600 text-white' 
//                         : 'bg-white border-gray-300'
//                     } focus:ring-2 focus:ring-opacity-50 focus:ring-[#02343F]`}
//                     placeholder="Your feedback or message..."
//                   ></textarea>
//                 </div>
//                 <button
//                   onClick={() => alert('Feedback submitted! Thank you for your input.')}
//                   className="px-6 py-3 rounded-lg font-semibold text-white transition-transform hover:scale-105"
//                   style={{ backgroundColor: '#02343F' }}
//                 >
//                   Send Feedback
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </main>

//       {/* Footer */}
//       <footer className={`mt-16 border-t ${
//         isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
//       }`}>
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="grid md:grid-cols-3 gap-8">
//             <div>
//               <div className="flex items-center space-x-3 mb-4">
//                 <div className="w-8 h-8 rounded-full flex items-center justify-center" 
//                      style={{ backgroundColor: '#F0EDCC' }}>
//                   <Heart className="w-5 h-5" style={{ color: '#02343F' }} />
//                 </div>
//                 <span className="text-lg font-bold">HealthCare Portal</span>
//               </div>
//               <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//                 Your trusted source for community health information and services.
//               </p>
//             </div>
//             <div>
//               <h4 className="font-semibold mb-4">Quick Links</h4>
//               <div className="space-y-2">
//                 {['Announcements', 'Health Blog', 'News', 'Contact'].map((link) => (
//                   <button
//                     key={link}
//                     onClick={() => setActiveSection(link.toLowerCase().replace(' ', ''))}
//                     className={`block text-sm hover:underline ${
//                       isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
//                     }`}
//                   >
//                     {link}
//                   </button>
//                 ))}
//               </div>
//             </div>
//             <div>
//               <h4 className="font-semibold mb-4">Emergency Contacts</h4>
//               <div className="space-y-2 text-sm">
//                 <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
//                   Emergency: 911
//                 </p>
//                 <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
//                   Health Center: +63 917 123 4567
//                 </p>
//                 <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
//                   Barangay Hall: (02) 8123-4567
//                 </p>
//               </div>
//             </div>
//           </div>
//           <div className={`mt-8 pt-8 border-t text-center text-sm ${
//             isDarkMode ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-600'
//           }`}>
//             <p>&copy; 2025 HealthCare Portal. All rights reserved.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default HealthApp;