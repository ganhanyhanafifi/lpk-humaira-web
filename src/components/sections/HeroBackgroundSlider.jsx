import React, { useState, useEffect, useRef } from 'react';

const heroImages = [
  '/hero/hero-1.jpg',
  '/hero/hero-2.jpg',
  '/hero/hero-3.jpg',
  '/hero/hero-4.jpg',
  '/hero/hero-5.jpg',
];

export default function HeroBackgroundSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef(null);

  // Preload all 5 images at start
  useEffect(() => {
    heroImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Guaranteed Unconditional Auto-Slide Interval (every 4000ms / 4 seconds)
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 8000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % heroImages.length);
      }, 4000);
    }
  };

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
      {/* Horizontal Sliding Track (Moves every 3000ms with opacity 0.23) */}
      <div
        className="flex w-full h-full transition-transform duration-1000 ease-in-out"
        style={{
          width: `${heroImages.length * 100}%`,
          transform: `translateX(-${(currentIndex * 100) / heroImages.length}%)`
        }}
      >
        {heroImages.map((src, index) => (
          <div
            key={src}
            className="w-[20%] h-full flex-shrink-0 relative opacity-[0.23]"
          >
            <img
              src={src}
              alt={`LPK Humaira Hero Background ${index + 1}`}
              className="w-full h-full object-cover object-center"
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
      </div>

      {/* Subtle Overlay gradient so headline text is 100% readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent z-10"></div>

      {/* Dot Indicators at Bottom Center */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 pointer-events-auto">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2.5 rounded-full transition-all duration-300 ${index === currentIndex
                ? 'w-8 bg-primary-700'
                : 'w-2.5 bg-gray-300 hover:bg-gray-400'
              }`}
          />
        ))}
      </div>
    </div>
  );
}
