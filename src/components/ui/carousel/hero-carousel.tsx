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
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isAutoPlaying && slides.length > 1) {
      interval = setInterval(() => {
        nextSlide();
      }, autoPlayInterval);
    }

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length, autoPlayInterval]);

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setIsTransitioning(false);
    }, 300); // Match fade duration
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), autoPlayInterval);
  }, [slides.length, autoPlayInterval, isTransitioning]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      setIsTransitioning(false);
    }, 300); // Match fade duration
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), autoPlayInterval);
  }, [slides.length, autoPlayInterval, isTransitioning]);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsTransitioning(false);
    }, 300); // Match fade duration
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), autoPlayInterval);
  }, [autoPlayInterval, isTransitioning]);

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

  return (
    <div className="relative w-full overflow-hidden">
      {/* Slides Container with Fade Effect */}
      <div className="relative h-[600px] md:h-[700px] w-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            style={{ backgroundColor: slide.backgroundColor }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Background Image with Overlay */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ 
                backgroundImage: `url(${slide.imageUrl})`,
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
                        className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                        style={{ color: slide.textColor }}
                      >
                        {slide.title}
                      </h1>
                      <h2 
                        className="text-2xl md:text-3xl font-semibold"
                        style={{ color: slide.textColor }}
                      >
                        {slide.subtitle}
                      </h2>
                      <p 
                        className="text-lg md:text-xl leading-relaxed"
                        style={{ color: slide.textColor }}
                      >
                        {slide.description}
                      </p>
                    </div>
                    
                    <Button
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg transform hover:scale-105"
                      onClick={() => {
                        window.location.href = slide.ctaLink;
                      }}
                    >
                      {slide.ctaText}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows - Hidden on Mobile */}
      {slides.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white border-white/20 hover:border-white/30"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white border-white/20 hover:border-white/30"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Slide Indicators - Enhanced for Mobile */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-8 h-8 md:w-3 md:h-3 rounded-full transition-all duration-300 flex items-center justify-center ${
                index === currentSlide
                  ? "bg-white text-white scale-110"
                  : "bg-white/30 hover:bg-white/50 text-white/70"
              }`}
              onClick={() => goToSlide(index)}
            >
              {/* Show slide number on mobile */}
              <span className="text-xs font-medium md:hidden">
                {index + 1}
              </span>
            </button>
          ))}
        </div>
      )}

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