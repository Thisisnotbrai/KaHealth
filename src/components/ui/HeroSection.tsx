import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Heart, Shield, Activity } from "lucide-react";

type CarouselImage = {
  id: string;
  image_url: string;
};

// Static images - replace these URLs with your own images
const staticImages: CarouselImage[] = [
  {
    id: "1",
    image_url: "/carousel/KaHealth banner.png"
  },
  {
    id: "2",
    image_url: "/carousel/medicine 1.jpg"
  },
  {
    id: "3",
    image_url: "/carousel/medicine 2.jpg"
  },
  {
    id: "4",
    image_url: "/carousel/medicine 3.png"
  
  },
  {
    id: "5",
    image_url: "/carousel/medicine dis.png"
  }
];

const Button = ({ children, className, onClick }: any) => (
  <button className={className} onClick={onClick}>
    {children}
  </button>
);

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    slides: {
      perView: 1,
    },
    created() {
      setLoaded(true);
    },
  });

  // Auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      instanceRef.current?.next();
    }, 5000); // 5 seconds
    return () => clearInterval(interval);
  }, [instanceRef]);

  return (
    <section className="w-full max-w-screen-xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
      <div className="relative group">
        {/* Health-themed container */}
        <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl shadow-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 border-2 border-white/50">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 z-20"></div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 z-20"></div>
          
          <div ref={sliderRef} className="keen-slider">
            {staticImages.map((img, idx) => (
              <div
                key={img.id}
                className="keen-slider__slide relative aspect-[16/9] sm:aspect-[21/9] md:aspect-[24/9] lg:aspect-[3/1] w-full bg-gradient-to-br from-white/80 via-emerald-50/30 to-teal-50/30"
              >
                {/* Decorative health icons */}
                <div className="absolute inset-0 opacity-5 z-10">
                  <div className="absolute top-4 left-4 text-emerald-300">
                    <Heart size={24} />
                  </div>
                  <div className="absolute top-4 right-4 text-teal-300">
                    <Shield size={24} />
                  </div>
                  <div className="absolute bottom-4 left-4 text-cyan-300">
                    <Activity size={24} />
                  </div>
                  <div className="absolute bottom-4 right-4 text-emerald-300">
                    <Heart size={24} />
                  </div>
                </div>
                
                <img
                  src={img.image_url}
                  alt={`Health Banner ${idx + 1}`}
                  className="absolute inset-0 w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />

                
                {/* Health indicator badge */}
                <div className="absolute top-4 left-4 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs sm:text-sm font-semibold rounded-full shadow-lg backdrop-blur-sm border border-white/20">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    Health Banner
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation buttons */}
          {loaded && (
            <>
              <Button
                variant="ghost"
                className="absolute top-1/2 left-2 sm:left-3 lg:left-4 transform -translate-y-1/2 z-30 w-11 h-11 sm:w-14 sm:h-14 bg-gradient-to-br from-white to-emerald-50 hover:from-emerald-50 hover:to-white backdrop-blur-md border-2 border-emerald-300/60 hover:border-emerald-400 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95"
                onClick={() => instanceRef.current?.prev()}
              >
                <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600 transition-transform duration-300 hover:-translate-x-0.5" strokeWidth={2.5} />
              </Button>
              <Button
                variant="ghost"
                className="absolute top-1/2 right-2 sm:right-3 lg:right-4 transform -translate-y-1/2 z-30 w-11 h-11 sm:w-14 sm:h-14 bg-gradient-to-br from-white to-emerald-50 hover:from-emerald-50 hover:to-white backdrop-blur-md border-2 border-emerald-300/60 hover:border-emerald-400 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95"
                onClick={() => instanceRef.current?.next()}
              >
                <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600 transition-transform duration-300 hover:translate-x-0.5" strokeWidth={2.5} />
              </Button>
            </>
          )}
        </div>

        {/* Dots navigation */}
        {loaded && (
          <div className="flex justify-center items-center gap-2 sm:gap-3 mt-4 sm:mt-6 px-4">
            <div className="flex gap-2 p-2 sm:p-3 bg-white/80 backdrop-blur-md rounded-full border border-emerald-100 shadow-lg">
              {staticImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => instanceRef.current?.moveToIdx(idx)}
                  className={`relative w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                    currentSlide === idx 
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg scale-125" 
                      : "bg-gray-300 hover:bg-emerald-200 hover:scale-110"
                  }`}
                  aria-label={`Go to health banner ${idx + 1}`}
                >
                  {currentSlide === idx && (
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;