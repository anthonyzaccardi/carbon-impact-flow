
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';

interface SidePanelProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const SidePanel: React.FC<SidePanelProps> = ({
  title,
  isOpen,
  onClose,
  children
}) => {
  // Add ESC key listener
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    
    // Disable body scroll when panel is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <>
      <div 
        className="side-panel-overlay animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      
      <div className="side-panel animate-slide-in-right bg-white">
        <div className="p-4 flex items-center justify-between border-b border-border bg-gradient-purple text-white">
          <h2 className="text-lg font-medium">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/10 hover:text-white">
            <X className="h-4 w-4" />
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
