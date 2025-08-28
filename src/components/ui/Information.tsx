import PageLayout from "@/components/ui/PageLayout";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const offices = [
  {
    name: "Punong Barangay's Office",
    address:
      "2nd Floor, Barangay New Kalalake Multi-Purpose Hall, 14th St corner Murphy Street",
    hotlines: ["Landline: 047 224-8264", "Hotline: 639-5027"],
    icon: "🏛️",
    category: "Leadership"
  },
  {
    name: "Barangay Secretary's Office",
    address:
      "2nd Floor, Barangay New Kalalake Multi-Purpose Hall, 14th St corner Murphy Street",
    hotlines: ["09086140304 (Sec)", "Landline: 047 224-8264"],
    icon: "📋",
    category: "Administration"
  },
  {
    name: "Barangay Treasurer's Office",
    address:
      "2nd Floor, Barangay New Kalalake Multi-Purpose Hall, 14th St corner Murphy Street",
    hotlines: ["Landline: 047 224-8264", "Hotline: 639-5027"],
    icon: "💰",
    category: "Finance"
  },
  {
    name: "Administration Office",
    address:
      "2nd Floor, Barangay New Kalalake Multi-Purpose Hall, 14th St corner Murphy Street",
    hotlines: ["Landline: 047 224-8264", "Hotline: 639-5027"],
    icon: "🏢",
    category: "Administration"
  },
  {
    name: "Lupong Tagapamayapa Office",
    address:
      "2nd Floor, Barangay New Kalalake Multi-Purpose Hall, 14th St corner Murphy Street",
    hotlines: ["Landline: 047 224-8264", "Hotline: 639-5027"],
    icon: "⚖️",
    category: "Justice"
  },
  {
    name: "Sangguniang Panglunsod Office",
    address:
      "2nd Floor, Session Hall, Barangay New Kalalake Multi-Purpose Hall, 14th St corner Murphy Street",
    hotlines: ["Landline: 047 224-8264"],
    icon: "🏛️",
    category: "Council"
  },
  {
    name: "BPAT Office",
    address:
      "Ground Floor, Barangay New Kalalake Multi-Purpose Hall, 14th St corner Murphy Street",
    hotlines: ["Landline: 047 224-8264", "Hotline: 639-5027"],
    icon: "🛡️",
    category: "Security"
  },
  {
    name: "Barangay Health Office",
    address:
      "Ground Floor, Barangay New Kalalake Multi-Purpose Hall, 14th St corner Murphy Street",
    hotlines: ["Landline: 047 224-8264", "Hotline: 639-5027"],
    icon: "🏥",
    category: "Healthcare",
    isHealthOffice: true
  },
  {
    name: "KABRU",
    address:
      "Ground Floor, Barangay New Kalalake Multi-Purpose Hall, 14th St corner Murphy Street",
    hotlines: ["Landline: 047 224-8264", "Hotline: 639-5027"],
    icon: "👥",
    category: "Community"
  },
  {
    name: "Sangguniang Kabataan Office",
    address:
      "Ground Floor, Barangay New Kalalake Multi-Purpose Hall, 14th St corner Murphy Street",
    hotlines: ["Landline: 047 224-8264", "Hotline: 639-5027"],
    icon: "🧑‍🎓",
    category: "Youth"
  },
];

export default function Information() {
  return (
    <PageLayout>
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Navigation Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl hover:from-blue-700 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium text-sm sm:text-base"
              >
                ← Back to Home
              </Link>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>🏛️</span>
                <span className="font-medium">Office Directory</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-green-600 px-6 sm:px-8 py-6 sm:py-8 text-white">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-xl sm:text-2xl">🏛️</span>
                </div>
                <div className="flex-grow min-w-0">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 leading-tight">
                    Barangay New Kalalake
                  </h1>
                  <p className="text-base sm:text-lg text-white/90 font-medium mb-2">
                    Office Directory & Contact Information
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-white/90">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🏢</span>
                      <span className="text-sm sm:text-base font-medium">
                        10 Offices Available
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">📞</span>
                      <span className="text-sm font-medium">
                        24/7 Emergency Services
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats Section */}
            <div className="px-6 sm:px-8 py-6 bg-gray-50">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                  <div className="text-2xl font-bold text-blue-600">10</div>
                  <div className="text-xs text-gray-600 font-medium">Total Offices</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                  <div className="text-2xl font-bold text-green-600">2</div>
                  <div className="text-xs text-gray-600 font-medium">Floors</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                  <div className="text-2xl font-bold text-blue-600">24/7</div>
                  <div className="text-xs text-gray-600 font-medium">Emergency</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                  <div className="text-2xl font-bold text-green-600">🏥</div>
                  <div className="text-xs text-gray-600 font-medium">Health Ready</div>
                </div>
              </div>
            </div>

            {/* Office Directory Section */}
            <div className="px-6 sm:px-8 py-6 sm:py-8">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Office Directory</h2>
                <p className="text-gray-600">Complete list of barangay offices and their contact information</p>
              </div>

              {/* Office Cards Grid */}
              <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                {offices.map((office, index) => (
                  <Card 
                    key={index} 
                    className={`hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-l-4 ${
                      office.isHealthOffice 
                        ? 'border-l-green-500 bg-gradient-to-br from-green-50 to-blue-50' 
                        : 'border-l-blue-300 bg-white'
                    } group`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className={`flex items-center justify-center w-12 h-12 rounded-lg shadow-md ${
                          office.isHealthOffice 
                            ? 'bg-gradient-to-br from-green-500 to-blue-600' 
                            : 'bg-gradient-to-br from-blue-500 to-green-600'
                        }`}>
                          <span className="text-xl text-white">{office.icon}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          office.isHealthOffice
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-600'
                        }`}>
                          {office.category}
                        </span>
                      </div>
                      <CardTitle className="text-lg group-hover:text-blue-700 transition-colors">
                        {office.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Address */}
                      <div className="flex items-start space-x-3">
                        <div className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full flex-shrink-0 mt-0.5">
                          <span className="text-xs">📍</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {office.address}
                        </p>
                      </div>

                      {/* Hotlines */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full">
                            <span className="text-xs">📞</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-700">Contact Numbers</span>
                        </div>
                        <div className="ml-8 space-y-2">
                          {office.hotlines.map((num, i) => (
                            <div key={i} className="flex items-center space-x-3">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span className="text-sm font-medium text-gray-800 hover:text-blue-600 cursor-pointer transition-colors">
                                {num}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Emergency Badge for Health Office */}
                      {office.isHealthOffice && (
                        <div className="bg-green-100 border border-green-200 rounded-lg p-3 mt-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-green-600">🚨</span>
                            <span className="text-sm font-semibold text-green-800">
                              Emergency Health Services Available
                            </span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Emergency Information Banner */}
              <div className="mt-8 p-4 sm:p-6 bg-gradient-to-r from-blue-100 to-green-100 rounded-xl border-l-4 border-blue-500">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">🚨</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Emergency Hotlines</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-700">
                      <div className="flex items-center space-x-2">
                        <span className="text-red-500">🚨</span>
                        <span className="font-semibold">Emergency: 911</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-green-500">🏥</span>
                        <span className="font-semibold">Health: 639-5027</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-500">📞</span>
                        <span className="font-semibold">Main: 047 224-8264</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4 sm:justify-between">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={() => window.print()}
                      className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-sm text-sm font-medium"
                    >
                      🖨️ Print Directory
                    </button>
                    <button 
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: 'Barangay New Kalalake Office Directory',
                            url: window.location.href
                          });
                        }
                      }}
                      className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-sm text-sm font-medium"
                    >
                      📤 Share
                    </button>
                  </div>
                  
                  <Link
                    to="/announcements"
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:from-blue-600 hover:to-green-600 transition-all duration-200 shadow-sm text-sm font-medium text-center"
                  >
                    📋 View Announcements
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Footer */}
        <footer className="mt-12 py-6 text-center">
          <div className="max-w-md mx-auto px-6 py-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} KaHealth
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Your trusted health information partner 💙
            </p>
          </div>
        </footer>
      </div>
    </PageLayout>
  );
}