 
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
    <div>
      <Navbar5 /> {/* Add Navbar at the top */}
      <Header />
      <HeroSection />
      <Announcement />
      <HealthAlmanac />
      <News />
      <Footer />
      {/* <HealthApp /> */}
    </div>
  );
};

export default LandingPage;