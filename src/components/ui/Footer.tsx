import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Footer = () => {
  return (
    <footer className="bg-[#162942] text-white py-10 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 sm:grid-cols-2 gap-6">
        <div>
          <h4 className="text-lg font-bold mb-2">KaHealth</h4>
          <p className="text-sm">
            A health information system developed for Barangay New Kalalake residents to stay updated on health news and advisories.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-2">Information</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Dialog>
                <DialogTrigger className="hover:underline">About the Website</DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>About the Website</DialogTitle>
                    <DialogDescription>
                      KaHealth is a digital health hub designed for the people of Barangay New Kalalake. It aims to deliver timely and accurate health news, advisories, and education, particularly catering to mobile users and elderly individuals.
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </li>
            <li>
              <Dialog>
                <DialogTrigger className="hover:underline">Mission & Vision</DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Mission & Vision</DialogTitle>
                    <DialogDescription>
                      <strong>Mission:</strong> To provide efficient and transparent governance that ensures the health and well-being of our community. <br /><br />
                      <strong>Vision:</strong> A progressive Barangay New Kalalake that is healthy, resilient, and inclusive, with accessible health information for all.
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-2">Contact</h4>
          <ul className="text-sm space-y-1">
            <li>Email: <a href="mailto:barangay.newkalalake@gmail.com" className="hover:underline">barangay.newkalalake@gmail.com</a></li>
            <li>Phone: (047) 222-5677</li>
            <li>Facebook: <a href="https://web.facebook.com/profile.php?id=100079624825596" className="hover:underline" target="_blank" rel="noopener noreferrer">Barangay New Kalalake</a></li>
          </ul>
        </div>
      </div>

      <div className="mt-10 text-center text-xs text-gray-300">
        © {new Date().getFullYear()} KaHealth. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
