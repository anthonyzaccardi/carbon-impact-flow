
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SlideshowProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  slidesToShow?: number;
  className?: string;
  gap?: number;
}

export function Slideshow<T>({
  items,
  renderItem,
  slidesToShow = 3,
  className,
  gap = 16,
}: SlideshowProps<T>) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [slidesToDisplay, setSlidesToDisplay] = useState(slidesToShow);

  // Adjust slides to show based on viewport width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) { // sm
        setSlidesToDisplay(1);
      } else if (window.innerWidth < 1024) { // md
        setSlidesToDisplay(2);
      } else {
        setSlidesToDisplay(slidesToShow);
      }
    };

    // Initial setup
    handleResize();

    // Event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [slidesToShow]);

  const maxIndex = Math.max(0, items.length - slidesToDisplay);

  const goToPrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };

  return (
    <div className={cn("relative group", className)}>
      <div 
        ref={containerRef}
        className="overflow-hidden"
      >
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ 
            transform: `translateX(-${currentIndex * (100 / slidesToDisplay)}%)`,
            gap: `${gap}px`,
            margin: `0 -${gap / 2}px`,
          }}
        >
          {items.map((item, index) => (
            <div 
              key={index} 
              className="flex-shrink-0"
              style={{ 
                width: `calc(${100 / slidesToDisplay}% - ${gap}px)`,
                padding: `0 ${gap / 2}px`,
              }}
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation buttons */}
      {currentIndex > 0 && (
        <Button
          variant="secondary"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-80 transition-opacity"
          onClick={goToPrevious}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
      
      {currentIndex < maxIndex && (
        <Button
          variant="secondary"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-80 transition-opacity"
          onClick={goToNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
      
      {/* Indicator dots */}
      {items.length > slidesToDisplay && (
        <div className="flex justify-center gap-1 mt-4">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button 
              key={index} 
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                currentIndex === index ? "bg-primary" : "bg-muted-foreground/30"
              )}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
