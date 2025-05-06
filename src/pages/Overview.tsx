
import { useAppContext } from "@/contexts/useAppContext";
import StatCard from "@/components/ui/stat-card";
import { Activity, ArrowUp, Users, Calendar, Cloud, Battery, Leaf, TrendingUp } from "lucide-react";
import MiniSparkline from "@/components/charts/MiniSparkline";
import MiniBarChart from "@/components/charts/MiniBarChart";
import MiniDonutChart from "@/components/charts/MiniDonutChart";
import ProgressIndicator from "@/components/charts/ProgressIndicator";
import BreadcrumbNav from "@/components/ui/breadcrumb-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GridLayout from "react-grid-layout";
import { useEffect, useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, GripVertical } from "lucide-react";
import "react-grid-layout/css/styles.css";
import { cn } from "@/lib/utils";
import { ChartContainer } from "@/components/ui/chart";
import { Area, AreaChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

// Define the possible widget sizes
type WidgetSize = "3x3" | "6x6" | "9x3" | "3x9" | "6x3" | "3x6" | "6x9" | "9x6";

// Widget configuration interface
interface WidgetConfig {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  static?: boolean;
}

// Helper to convert size string to grid units
const sizeToGridUnits = (size: WidgetSize): { w: number, h: number } => {
  const [w, h] = size.split("x").map(Number);
  return { w, h };
};

const Overview = () => {
  const {
    tracks,
    measurements,
    targets,
    initiatives,
  } = useAppContext();
  
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const [gridWidth, setGridWidth] = useState(0);
  const [rowHeight, setRowHeight] = useState(0);
  const [layouts, setLayouts] = useState<WidgetConfig[]>([]);
  
  // Generate more comprehensive emissions data for chart
  const emissionsData = [
    { name: 'Jan', value: 5200 },
    { name: 'Feb', value: 4800 },
    { name: 'Mar', value: 6100 },
    { name: 'Apr', value: 5400 },
    { name: 'May', value: 5000 },
    { name: 'Jun', value: 4700 },
    { name: 'Jul', value: 5300 },
    { name: 'Aug', value: 5600 },
    { name: 'Sep', value: 4900 },
    { name: 'Oct', value: 4600 },
    { name: 'Nov', value: 5100 },
    { name: 'Dec', value: 4800 },
  ];
  
  const totalEmissions = tracks.reduce((sum, track) => {
    const trackMeasurements = measurements.filter(m => m.trackId === track.id);
    const trackEmissions = trackMeasurements.reduce((trackSum, measurement) => trackSum + measurement.calculatedValue, 0);
    return sum + trackEmissions;
  }, 0);
  
  const emissionsChange = 5.2; // Example trend
  
  const trackDistributionData = tracks.slice(0, 4).map(track => ({
    name: track.name,
    value: track.totalEmissions
  }));
  
  const measurementTrendsData = [
    { name: 'Week 1', value: 25 },
    { name: 'Week 2', value: 40 },
    { name: 'Week 3', value: 30 },
    { name: 'Week 4', value: 45 },
  ];
  
  // Fix for the reduction goals chart
  const targetProgressData = {
    current: targets.reduce((sum, target) => {
      // Calculate the absolute reduction amount
      const reductionAmount = target.baselineValue * Math.abs(target.targetPercentage) / 100;
      return sum + reductionAmount;
    }, 0),
    target: targets.reduce((sum, target) => sum + (target.baselineValue * 0.3), 0) // Assuming 30% reduction goal
  };
  
  // Initialize layouts
  useEffect(() => {
    const initialLayouts: WidgetConfig[] = [
      { i: "tracks", x: 0, y: 0, w: 3, h: 3 },
      { i: "measurements", x: 3, y: 0, w: 3, h: 3 },
      { i: "targets", x: 6, y: 0, w: 3, h: 3 },
      { i: "initiatives", x: 9, y: 0, w: 3, h: 3 },
      { i: "emissions", x: 0, y: 3, w: 9, h: 6 },
      { i: "sources", x: 0, y: 9, w: 6, h: 6 },
      { i: "goals", x: 6, y: 9, w: 6, h: 6 },
    ];
    
    setLayouts(initialLayouts);
  }, []);
  
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
  
  // Function to handle layout changes from drag events
  const handleLayoutChange = (newLayout: WidgetConfig[]) => {
    setLayouts(newLayout);
  };
  
  // Function to resize a widget
  const resizeWidget = (id: string, newSize: WidgetSize) => {
    const { w, h } = sizeToGridUnits(newSize);
    
    setLayouts(currentLayouts => {
      return currentLayouts.map(item => {
        if (item.i === id) {
          return { ...item, w, h };
        }
        return item;
      });
    });
  };
  
  // Widget header component with drag handle and resize dropdown
  const WidgetHeader = ({ title, id }: { title: string, id: string }) => {
    return (
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-0">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <div className="flex items-center space-x-1">
          <DropdownMenu>
            <DropdownMenuTrigger className="p-1 rounded-sm hover:bg-gray-100">
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => resizeWidget(id, "3x3")}>Small (3×3)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => resizeWidget(id, "6x3")}>Wide (6×3)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => resizeWidget(id, "3x6")}>Tall (3×6)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => resizeWidget(id, "6x6")}>Medium (6×6)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => resizeWidget(id, "9x3")}>Extra Wide (9×3)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => resizeWidget(id, "3x9")}>Extra Tall (3×9)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => resizeWidget(id, "9x6")}>Large Wide (9×6)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => resizeWidget(id, "6x9")}>Large Tall (6×9)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="cursor-grab p-1 rounded-sm hover:bg-gray-100 drag-handle">
            <GripVertical className="h-4 w-4 text-gray-500" />
          </div>
        </div>
      </CardHeader>
    );
  };
  
  // Grid cell background element
  const GridBackground = () => {
    const cells = Array(12 * 12).fill(0);
    
    return (
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none grid grid-cols-12 gap-3" style={{ zIndex: 0 }}>
        {cells.map((_, index) => (
          <div key={index} className="aspect-square bg-[#F2F2F2] rounded-md"></div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <BreadcrumbNav items={[{ label: "Overview", icon: <TrendingUp className="h-4 w-4" /> }]} />
      
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold tracking-tight mb-2">Overview</h1>
        <p className="text-muted-foreground max-w-3xl">
          Track your environmental impact metrics and progress toward reduction goals across all emission sources.
        </p>
      </div>
      
      {/* Grid Layout Container */}
      <div ref={gridContainerRef} className="relative min-h-[800px]">
        <GridBackground />
        
        {gridWidth > 0 && rowHeight > 0 && layouts.length > 0 && (
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
          >
            {/* Tracks Widget */}
            <div key="tracks" className="z-10">
              <Card className="h-full border shadow-sm">
                <WidgetHeader title="Total Tracks" id="tracks" />
                <CardContent className="p-4">
                  <div className="flex flex-col h-full justify-between">
                    <div className="text-2xl font-semibold">{tracks.length}</div>
                    <div className="text-sm text-muted-foreground">Active emission tracking categories</div>
                    <div className="mt-2">
                      <MiniBarChart data={trackDistributionData} color="#10B981" height={60} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Measurements Widget */}
            <div key="measurements" className="z-10">
              <Card className="h-full border shadow-sm">
                <WidgetHeader title="Active Measurements" id="measurements" />
                <CardContent className="p-4">
                  <div className="flex flex-col h-full justify-between">
                    <div className="text-2xl font-semibold">{measurements.length}</div>
                    <div className="text-sm text-muted-foreground">Total recorded measurements</div>
                    <div className="mt-2">
                      <MiniSparkline data={measurementTrendsData} color="#1EAEDB" height={60} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Targets Widget */}
            <div key="targets" className="z-10">
              <Card className="h-full border shadow-sm">
                <WidgetHeader title="Set Targets" id="targets" />
                <CardContent className="p-4">
                  <div className="flex flex-col h-full justify-between">
                    <div className="text-2xl font-semibold">{targets.length}</div>
                    <div className="text-sm text-muted-foreground">Emission reduction targets</div>
                    <div className="mt-2">
                      <ProgressIndicator 
                        current={targetProgressData.current} 
                        target={targetProgressData.target} 
                        color="#10B981" 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Initiatives Widget */}
            <div key="initiatives" className="z-10">
              <Card className="h-full border shadow-sm">
                <WidgetHeader title="Ongoing Initiatives" id="initiatives" />
                <CardContent className="p-4">
                  <div className="flex flex-col h-full justify-between">
                    <div className="text-2xl font-semibold">{initiatives.length}</div>
                    <div className="text-sm text-muted-foreground">Active reduction programs</div>
                    <div className="mt-2">
                      <MiniBarChart 
                        data={initiatives.slice(0, 5).map((i, idx) => ({ 
                          name: `Initiative ${idx + 1}`, 
                          value: Math.random() * 100 
                        }))}
                        color="#F97316" 
                        height={60} 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Emissions Widget - Fixed with improved chart */}
            <div key="emissions" className="z-10">
              <Card className="h-full border shadow-sm">
                <WidgetHeader title="Total Emissions" id="emissions" />
                <CardContent className="p-4">
                  <div className="flex flex-col h-full">
                    <div className="flex items-end gap-2 mb-2">
                      <span className="text-2xl font-semibold">
                        {totalEmissions.toLocaleString(undefined, {
                          maximumFractionDigits: 2
                        })} tCO₂e
                      </span>
                      <span className={cn(
                        "text-xs px-1.5 py-0.5 rounded-full",
                        emissionsChange > 0 
                          ? "bg-red-100 text-red-700" 
                          : "bg-green-100 text-green-700"
                      )}>
                        {emissionsChange > 0 ? "+" : ""}{emissionsChange}%
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground mb-4">Carbon dioxide equivalent (Annual)</div>
                    <div className="flex-1 w-full h-full min-h-[120px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={emissionsData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                          <defs>
                            <linearGradient id="emissionsGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis 
                            dataKey="name" 
                            tick={{ fontSize: 10 }}
                            tickLine={false}
                            axisLine={{ stroke: '#E5E5E5' }}
                          />
                          <YAxis 
                            tick={{ fontSize: 10 }}
                            tickLine={false}
                            axisLine={{ stroke: '#E5E5E5' }}
                            tickFormatter={(value) => `${value}`}
                          />
                          <Tooltip 
                            formatter={(value) => [`${value} tCO₂e`, 'Emissions']}
                            labelFormatter={(label) => `${label} 2023`}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#10B981" 
                            fillOpacity={1} 
                            fill="url(#emissionsGradient)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Emission Sources Widget */}
            <div key="sources" className="z-10">
              <Card className="h-full border shadow-sm">
                <WidgetHeader title="Emission Sources" id="sources" />
                <CardContent className="p-4 overflow-auto">
                  <div className="space-y-4">
                    {tracks.slice(0, 5).map((track, idx) => (
                      <div key={track.id} className="flex items-center gap-4">
                        <div className="bg-primary/10 p-2 rounded-md">
                          {track.emoji}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between">
                            <span className="font-medium">{track.name}</span>
                            <span>{track.totalEmissions.toLocaleString()} tCO₂e</span>
                          </div>
                          <ProgressIndicator 
                            current={track.totalEmissions}
                            target={totalEmissions}
                            color={['#10B981', '#1EAEDB', '#F97316', '#8B5CF6', '#FBBF24'][idx % 5]}
                            size="sm"
                            variant="slim"
                            showLabels={false}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Reduction Goals Widget */}
            <div key="goals" className="z-10">
              <Card className="h-full border shadow-sm">
                <WidgetHeader title="Reduction Goals" id="goals" />
                <CardContent className="p-4">
                  <div className="flex flex-col h-full">
                    <div className="flex-1 flex items-center justify-center">
                      <MiniDonutChart
                        data={[
                          { name: 'Achieved', value: targetProgressData.current },
                          { name: 'Remaining', value: Math.max(0, targetProgressData.target - targetProgressData.current) }
                        ]}
                        colors={["#10B981", "#D1D5DB"]}
                        height={180}
                      />
                    </div>
                    <div className="mt-2 text-center">
                      <p className="text-lg font-semibold">
                        {targetProgressData.target > 0 
                          ? ((targetProgressData.current / targetProgressData.target) * 100).toFixed(1) 
                          : "0"}%
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Of reduction goals complete
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </GridLayout>
        )}
      </div>
    </div>
  );
};

export default Overview;
