import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const Footer = () => {
  return (
    <footer className="bg-[#162942] text-white mt-16">
      <div className="max-w-screen-xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* About the Website (Modal) */}
        <div>
          <h2 className="text-lg font-semibold mb-3">About</h2>
          <Dialog>
            <DialogTrigger asChild>
              <button className="text-sm underline text-left hover:text-gray-300">
                Learn more about the website
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>About the Website</DialogTitle>
                <DialogDescription>
                  KaHealth is a mobile-first health information platform designed for residents of Barangay New Kalalake. It provides easy access to public health announcements, medical tips, and local health news to ensure community awareness and promote well-being.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>

        {/* Mission and Vision (Modal) */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Mission & Vision</h2>
          <Dialog>
            <DialogTrigger asChild>
              <button className="text-sm underline text-left hover:text-gray-300">
                View Mission and Vision
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Mission & Vision</DialogTitle>
                <DialogDescription>
                  <p className="mb-2">
                    <strong>Mission (New Kalalake):</strong> To promote transparency, accountability, and efficiency in the delivery of basic services for the betterment of its citizens.
                  </p>
                  <p>
                    <strong>Vision (KaHealth):</strong> A healthy, informed, and empowered community in New Kalalake through accessible digital health communication.
                  </p>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>

        {/* Contact Info */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Contact Us</h2>
          <ul className="text-sm space-y-1">
            <li>📍 New Kalalake Health Center</li>
            <li>Murphy St, New Kalalake, Olongapo City, 2200</li>
            <li>☎️ +63 47 224 8264</li>
            <li>🕘 Mon – Fri: 8:00 AM – 5:00 PM</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-10 py-4 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} KaHealth • Barangay New Kalalake, Olongapo City
      </div>
    </footer>
  );
};

export default Footer;
