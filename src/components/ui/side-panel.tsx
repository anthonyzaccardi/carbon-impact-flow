
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidePanelProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: 'sm' | 'md' | 'lg' | 'xl';
  position?: 'right' | 'left';
}

const SidePanel: React.FC<SidePanelProps> = ({
  title,
  isOpen,
  onClose,
  children,
  width = 'md',
  position = 'right'
}) => {
  const [isRendered, setIsRendered] = useState(false);
  
  // Width classes
  const widthClasses = {
    sm: 'w-[300px]',
    md: 'w-[450px]',
    lg: 'w-[600px]',
    xl: 'w-[800px]'
  };
  
  // Position classes
  const positionClasses = {
    right: 'right-0',
    left: 'left-0'
  };
  
  // Animation classes
  const animationClasses = {
    right: {
      enter: 'animate-slide-in-right',
      exit: 'animate-slide-out-right',
    },
    left: {
      enter: 'transform -translate-x-full animate-slide-in-left',
      exit: 'animate-slide-out-left',
    }
  };
  
  // Add ESC key listener and handle animation states
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    // When opening, set rendered immediately to true
    if (isOpen) {
      setIsRendered(true);
      document.body.style.overflow = 'hidden'; // Prevent scrolling when panel is open
    } 
    // When closing, we need to let the animation finish before un-rendering
    else {
      const timer = setTimeout(() => {
        setIsRendered(false);
        document.body.style.overflow = ''; // Restore scrolling when panel is closed
      }, 300); // Match this to animation duration
      
      return () => clearTimeout(timer);
    }
    
    window.addEventListener('keydown', handleEscape);
    
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);
  
  if (!isRendered && !isOpen) return null;
  
  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/20 backdrop-blur-sm z-40",
          isOpen ? "animate-fade-in" : "animate-fade-out"
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Panel */}
      <div 
        className={cn(
          "fixed top-0 z-50 h-full bg-background border-border shadow-lg transform transition-transform duration-300",
          positionClasses[position],
          widthClasses[width],
          position === 'right' ? 'border-l' : 'border-r',
          isOpen 
            ? animationClasses[position].enter 
            : animationClasses[position].exit
        )}
      >
        <div className="border-b border-border p-4 flex items-center justify-between bg-background sticky top-0 z-10">
          <h2 className="text-lg font-medium">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        
        <ScrollArea className="h-[calc(100%-4rem)] w-full">
          <div className="p-6">
            {children}
          </div>
        </ScrollArea>
      </div>
    </>
  );
};

export default SidePanel;
