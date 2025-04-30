
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
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
        aria-hidden="true"
      />
      
      <div className="fixed right-0 top-0 z-50 h-full w-[450px] bg-white border-l border-[#EEEEEE] transform transition-transform duration-300 animate-slide-in-right">
        <div className="border-b border-[#EEEEEE] p-4 flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-[#333336]">{title}</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="hover:bg-[#F9F9FA] text-[#71717A]"
          >
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
