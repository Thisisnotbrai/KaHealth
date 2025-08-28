import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { useEffect, useState } from "react";
import { Button } from "./Navbar/button";
import { ChevronLeft, ChevronRight, Heart, Shield, Activity } from "lucide-react";
import { supabase } from "@/supabase-client";

type CarouselImage = {
  id: string;
  image_url: string;
};

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [images, setImages] = useState<CarouselImage[]>([]);
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

  // Fetch carousel images from Supabase
  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase
        .from("carousel_images")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching carousel images:", error.message);
      } else {
        setImages(data || []);
      }
    };

    fetchImages();

    // Optional: live updates when admin uploads/deletes
    const channel = supabase
      .channel("carousel-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "carousel_images" },
        () => fetchImages()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
        {/* Enhanced Health-themed container with better shadows and gradients */}
        <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl shadow-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 border-2 border-white/50">
          {/* Health accent bars */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 z-20"></div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 z-20"></div>
          
          <div ref={sliderRef} className="keen-slider">
            {images.length > 0 ? (
              images.map((img, idx) => (
                <div
                  key={img.id}
                  className="keen-slider__slide relative flex justify-center items-center min-h-[280px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[450px] xl:min-h-[500px] bg-gradient-to-br from-white/80 via-emerald-50/30 to-teal-50/30"
                >
                  {/* Health-themed background pattern */}
                  <div className="absolute inset-0 opacity-5">
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
                    className="max-h-full w-full h-auto object-contain px-4 sm:px-6 md:px-8 py-4 sm:py-6 transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Health indicator badge */}
                  <div className="absolute top-4 left-4 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs sm:text-sm font-semibold rounded-full shadow-lg backdrop-blur-sm border border-white/20">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      Health Banner
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="keen-slider__slide relative flex flex-col justify-center items-center min-h-[280px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[450px] xl:min-h-[500px] bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
                {/* Enhanced empty state with health theme */}
                <div className="text-center px-4 sm:px-6">
                  <div className="mb-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-100 to-teal-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-500" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">Health Banners Loading</h3>
                    <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto leading-relaxed">
                      Community health information and wellness updates will appear here
                    </p>
                  </div>
                  
                  {/* Health-themed decorative elements */}
                  <div className="flex justify-center items-center gap-4 opacity-40">
                    <Shield className="w-5 h-5 text-emerald-400" />
                    <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                    <Activity className="w-5 h-5 text-teal-400" />
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    <Heart className="w-5 h-5 text-cyan-400" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Navigation Buttons with health theme */}
          {images.length > 0 && loaded && (
            <>
              <Button
                variant="ghost"
                className="absolute top-1/2 left-2 sm:left-3 lg:left-4 transform -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 backdrop-blur-md hover:bg-white border-2 border-emerald-200 hover:border-emerald-300 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group/btn"
                onClick={() => instanceRef.current?.prev()}
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-700 group-hover/btn:text-emerald-800" />
              </Button>
              <Button
                variant="ghost"
                className="absolute top-1/2 right-2 sm:right-3 lg:right-4 transform -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 backdrop-blur-md hover:bg-white border-2 border-emerald-200 hover:border-emerald-300 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group/btn"
                onClick={() => instanceRef.current?.next()}
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-700 group-hover/btn:text-emerald-800" />
              </Button>
            </>
          )}
        </div>

        {/* Enhanced health-themed dots navigation */}
        {images.length > 0 && loaded && (
          <div className="flex justify-center items-center gap-2 sm:gap-3 mt-4 sm:mt-6 px-4">
            <div className="flex gap-2 p-2 sm:p-3 bg-white/80 backdrop-blur-md rounded-full border border-emerald-100 shadow-lg">
              {images.map((_, idx) => (
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
            
            {/* Health status indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-emerald-50/80 backdrop-blur-sm rounded-full border border-emerald-200">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-emerald-700">
                {images.length} Health {images.length === 1 ? 'Banner' : 'Banners'}
              </span>
            </div>
          </div>
        )}

        {/* Health-themed progress indicator */}
        {images.length > 1 && loaded && (
          <div className="absolute bottom-2 left-4 right-4 sm:bottom-3 sm:left-6 sm:right-6">
            <div className="w-full bg-white/30 backdrop-blur-sm rounded-full h-1 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-5000 ease-linear"
                style={{
                  width: `${((currentSlide + 1) / images.length) * 100}%`
                }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;