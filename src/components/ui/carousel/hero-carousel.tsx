"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  backgroundColor: string;
  textColor: string;
}

interface HeroCarouselProps {
  slides: HeroSlide[];
  autoPlayInterval?: number;
}

export function HeroCarousel({ slides, autoPlayInterval = 5000 }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Auto-play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isAutoPlaying && slides.length > 1) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, autoPlayInterval);
    }

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length, autoPlayInterval]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), autoPlayInterval);
  }, [slides.length, autoPlayInterval]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), autoPlayInterval);
  }, [slides.length, autoPlayInterval]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), autoPlayInterval);
  }, [autoPlayInterval]);

  // Touch handlers for swipe functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsAutoPlaying(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }

    setTimeout(() => setIsAutoPlaying(true), autoPlayInterval);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === "ArrowRight") {
        nextSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  if (slides.length === 0) {
    return null;
  }

  const currentSlideData = slides[currentSlide];

  return (
    <div className="relative w-full overflow-hidden">
      {/* Slides Container */}
      <div 
        className="relative h-[600px] md:h-[700px] w-full transition-all duration-500 ease-in-out"
        style={{ backgroundColor: currentSlideData.backgroundColor }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500"
          style={{ 
            backgroundImage: `url(${currentSlideData.imageUrl})`,
            opacity: 0.3
          }}
        />
        
        <div className="absolute inset-0 bg-black/20" />

        {/* Slide Content */}
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h1 
                    className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight transition-all duration-500"
                    style={{ color: currentSlideData.textColor }}
                  >
                    {currentSlideData.title}
                  </h1>
                  <h2 
                    className="text-2xl md:text-3xl font-semibold transition-all duration-500"
                    style={{ color: currentSlideData.textColor }}
                  >
                    {currentSlideData.subtitle}
                  </h2>
                  <p 
                    className="text-lg md:text-xl leading-relaxed transition-all duration-500"
                    style={{ color: currentSlideData.textColor }}
                  >
                    {currentSlideData.description}
                  </p>
                </div>
                
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg transition-all duration-500 transform hover:scale-105"
                  onClick={() => {
                    // Navigate to the CTA link
                    window.location.href = currentSlideData.ctaLink;
                  }}
                >
                  {currentSlideData.ctaText}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white border-white/20 hover:border-white/30"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white border-white/20 hover:border-white/30"
              onClick={nextSlide}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}

        {/* Slide Indicators */}
        {slides.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-white scale-125"
                    : "bg-white/50 hover:bg-white/75"
                }`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {slides.length > 1 && isAutoPlaying && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div 
            className="h-full bg-white transition-all duration-1000 ease-linear"
            style={{ 
              width: "100%",
              animation: `progressBar ${autoPlayInterval}ms linear infinite`
            }}
          />
        </div>
      )}
    </div>
  );
}

// Add CSS animation for progress bar
const style = document.createElement('style');
style.textContent = `
  @keyframes progressBar {
    from { width: 0%; }
    to { width: 100%; }
  }
`;
document.head.appendChild(style);