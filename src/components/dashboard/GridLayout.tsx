
import React, { useState, useRef, useEffect, useCallback } from 'react';
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "@/components/ui/grid-layout.css";
import { debounce } from "lodash";
import { Layout } from "react-grid-layout";
import { fetchLayout, saveLayout } from "@/services/supabase/layoutService";
import GridBackground from './GridBackground';

// Define the possible widget sizes
export type WidgetSize = "3x3" | "6x6" | "9x3" | "3x9" | "6x3" | "3x6" | "6x9" | "9x6";

// Widget configuration interface
export interface WidgetConfig {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
  static?: boolean;
}

interface GridContainerProps {
  children: React.ReactNode;
  pageName: string;
}

const GridContainer: React.FC<GridContainerProps> = ({ children, pageName }) => {
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const [gridWidth, setGridWidth] = useState(0);
  const [rowHeight, setRowHeight] = useState(0);
  const [layouts, setLayouts] = useState<WidgetConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Helper to convert size string to grid units
  const sizeToGridUnits = (size: WidgetSize): { w: number, h: number } => {
    const [w, h] = size.split("x").map(Number);
    return { w, h };
  };
  
  // Load saved layout from Supabase
  useEffect(() => {
    async function loadSavedLayout() {
      setIsLoading(true);
      try {
        const savedLayout = await fetchLayout(pageName);
        
        if (savedLayout && savedLayout.length > 0) {
          console.log("Loaded layout from database:", savedLayout);
          setLayouts(savedLayout);
        } else {
          // Use default layout if no saved layout exists
          const defaultLayouts: WidgetConfig[] = [
            { i: "tracks", x: 0, y: 0, w: 3, h: 3, minW: 3, minH: 3, maxW: 9, maxH: 9 },
            { i: "measurements", x: 3, y: 0, w: 3, h: 3, minW: 3, minH: 3, maxW: 9, maxH: 9 },
            { i: "targets", x: 6, y: 0, w: 3, h: 3, minW: 3, minH: 3, maxW: 9, maxH: 9 },
            { i: "initiatives", x: 9, y: 0, w: 3, h: 3, minW: 3, minH: 3, maxW: 9, maxH: 9 },
            { i: "emissions", x: 0, y: 3, w: 9, h: 6, minW: 3, minH: 3, maxW: 9, maxH: 9 },
            { i: "sources", x: 0, y: 9, w: 6, h: 6, minW: 3, minH: 3, maxW: 9, maxH: 9 },
            { i: "goals", x: 6, y: 9, w: 6, h: 6, minW: 3, minH: 3, maxW: 9, maxH: 9 },
          ];
          console.log("Using default layout");
          setLayouts(defaultLayouts);
        }
      } catch (error) {
        console.error("Error loading layout:", error);
        // Fallback to default layout
        const defaultLayouts: WidgetConfig[] = [
          { i: "tracks", x: 0, y: 0, w: 3, h: 3, minW: 3, minH: 3, maxW: 9, maxH: 9 },
          { i: "measurements", x: 3, y: 0, w: 3, h: 3, minW: 3, minH: 3, maxW: 9, maxH: 9 },
          { i: "targets", x: 6, y: 0, w: 3, h: 3, minW: 3, minH: 3, maxW: 9, maxH: 9 },
          { i: "initiatives", x: 9, y: 0, w: 3, h: 3, minW: 3, minH: 3, maxW: 9, maxH: 9 },
          { i: "emissions", x: 0, y: 3, w: 9, h: 6, minW: 3, minH: 3, maxW: 9, maxH: 9 },
          { i: "sources", x: 0, y: 9, w: 6, h: 6, minW: 3, minH: 3, maxW: 9, maxH: 9 },
          { i: "goals", x: 6, y: 9, w: 6, h: 6, minW: 3, minH: 3, maxW: 9, maxH: 9 },
        ];
        setLayouts(defaultLayouts);
      } finally {
        setIsLoading(false);
      }
    }

    loadSavedLayout();
  }, [pageName]);
  
  // Calculate grid dimensions on mount and resize
  useEffect(() => {
    const calculateGridDimensions = () => {
      if (gridContainerRef.current) {
        const containerWidth = gridContainerRef.current.offsetWidth;
        const cellWidth = (containerWidth - (11 * 12)) / 12; // 12 columns with 12px gap
        setGridWidth(containerWidth);
        setRowHeight(cellWidth); // Make cells square
      }
    };
    
    calculateGridDimensions();
    
    const resizeObserver = new ResizeObserver(calculateGridDimensions);
    if (gridContainerRef.current) {
      resizeObserver.observe(gridContainerRef.current);
    }
    
    return () => {
      if (gridContainerRef.current) {
        resizeObserver.unobserve(gridContainerRef.current);
      }
    };
  }, []);
  
  // Debounced save function to avoid too many DB writes
  const debouncedSaveLayout = useCallback(
    debounce((layout: Layout[]) => {
      saveLayout(pageName, layout);
    }, 500),
    [pageName]
  );

  // Function to handle layout changes from drag events
  const handleLayoutChange = (newLayout: WidgetConfig[]) => {
    setLayouts(newLayout);
    debouncedSaveLayout(newLayout);
  };
  
  // Function to resize a widget
  const resizeWidget = useCallback((id: string, newSize: WidgetSize) => {
    const { w, h } = sizeToGridUnits(newSize);
    
    setLayouts(currentLayouts => {
      const updatedLayouts = currentLayouts.map(item => {
        if (item.i === id) {
          return { ...item, w, h };
        }
        return item;
      });
      
      debouncedSaveLayout(updatedLayouts);
      return updatedLayouts;
    });
  }, [debouncedSaveLayout]);

  return (
    <div ref={gridContainerRef} className="relative min-h-[800px]">
      <GridBackground />
      
      {!isLoading && gridWidth > 0 && rowHeight > 0 && layouts.length > 0 && (
        <GridLayout
          className="layout"
          layout={layouts}
          cols={12}
          rowHeight={rowHeight}
          width={gridWidth}
          margin={[12, 12]}
          containerPadding={[0, 0]}
          onLayoutChange={handleLayoutChange}
          draggableHandle=".drag-handle"
          useCSSTransforms={true}
          compactType="vertical"
          preventCollision={false}
          isResizable={false} // Disable resize handles, we use dropdown instead
          autoSize={true} // Auto-size container to fit content
        >
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              // Pass resizeWidget to cloned children
              return React.cloneElement(child as React.ReactElement<any>, {
                resizeWidget
              });
            }
            return child;
          })}
        </GridLayout>
      )}
    </div>
  );
};

export { GridContainer };
