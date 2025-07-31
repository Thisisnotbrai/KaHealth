import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { useEffect, useState } from "react";
import { Button } from "./Navbar/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const carouselImages = [
  "/carousel/slide1.png",
  "/carousel/slide2.jpg",
  "/carousel/slide3.jpg",
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    slides: {
      perView: 1,
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      instanceRef.current?.next();
    }, 5000); // 5 seconds
    return () => clearInterval(interval);
  }, [instanceRef]);

  return (
    <section className="w-full max-w-screen-xl mx-auto px-4">
      <div className="relative">
        <div ref={sliderRef} className="keen-slider rounded-xl overflow-hidden">
          {carouselImages.map((img, idx) => (
            <div
              key={idx}
              className="keen-slider__slide flex justify-center items-center bg-gray-100"
            >
              <img
                src={img}
                alt={`Carousel ${idx + 1}`}
                className="max-h-[500px] w-auto h-auto object-contain"
              />
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <Button
          variant="ghost"
          className="absolute top-1/2 left-2 transform -translate-y-1/2 z-10 bg-white/70 backdrop-blur rounded-full"
          onClick={() => instanceRef.current?.prev()}
        >
          <ChevronLeft className="w-6 h-6 text-[#162942]" />
        </Button>
        <Button
          variant="ghost"
          className="absolute top-1/2 right-2 transform -translate-y-1/2 z-10 bg-white/70 backdrop-blur rounded-full"
          onClick={() => instanceRef.current?.next()}
        >
          <ChevronRight className="w-6 h-6 text-[#162942]" />
        </Button>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {carouselImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => instanceRef.current?.moveToIdx(idx)}
              className={`w-3 h-3 rounded-full ${
                currentSlide === idx ? "bg-[#162942]" : "bg-gray-300"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
