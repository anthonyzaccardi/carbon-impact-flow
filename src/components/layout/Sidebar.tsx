
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts/useAppContext';
import { 
  Home, 
  BarChart, 
  Database, 
  Activity, 
  Target, 
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  PlayCircle
} from 'lucide-react';

const NavItem = ({ 
  to, 
  icon: Icon, 
  label, 
  expanded 
}: { 
  to: string; 
  icon: React.ElementType; 
  label: string; 
  expanded: boolean;
}) => {
  return (
    <li>
      <NavLink 
        to={to} 
        className={({ isActive }) => 
          `flex items-center p-2 rounded-md mb-1 transition-all duration-200
          ${isActive ? 'bg-eco-purple/10 text-eco-purple' : 'hover:bg-eco-purple/5 text-foreground/80'} 
          ${expanded ? 'justify-start' : 'justify-center'} nav-item ${isActive ? 'active' : ''}`
        }
      >
        <Icon className="h-5 w-5" />
        {expanded && <span className="ml-3 text-sm font-medium">{label}</span>}
      </NavLink>
    </li>
  );
};

const NavGroupItem = ({ 
  label, 
  icon: Icon, 
  expanded,
  children 
}: { 
  label: string; 
  icon: React.ElementType; 
  expanded: boolean;
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <li className="mb-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center w-full p-2 rounded-md transition-all duration-200
          hover:bg-eco-purple/5 text-foreground/80
          ${expanded ? 'justify-start' : 'justify-center'}`}
      >
        <Icon className="h-5 w-5" />
        {expanded && (
          <>
            <span className="ml-3 text-sm flex-grow text-left font-medium">{label}</span>
            <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
          </>
        )}
      </button>
      {(isOpen || !expanded) && (
        <ul className={`${expanded ? 'ml-7' : 'mt-1'} space-y-1 animate-slide-in-bottom`}>
          {children}
        </ul>
      )}
    </li>
  );
};

const Sidebar = () => {
  const { sidebarExpanded, toggleSidebar } = useAppContext();
  
  return (
    <div className="flex h-screen">
      {/* Colorful icon column */}
      <div className="w-[60px] bg-gradient-sidebar flex flex-col items-center py-4 z-20">
        <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center mb-8">
          <div className="h-6 w-6 bg-eco-purple rounded-full"></div>
        </div>
        
        <div className="flex flex-col space-y-6 mt-6">
          <NavLink to="/" className={({ isActive }) => `h-10 w-10 rounded-md flex items-center justify-center transition-all ${isActive ? 'bg-white text-eco-purple' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>
            <Home size={20} />
          </NavLink>
          
          <NavLink to="/tracks" className={({ isActive }) => `h-10 w-10 rounded-md flex items-center justify-center transition-all ${isActive ? 'bg-white text-eco-purple' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>
            <BarChart size={20} />
          </NavLink>
          
          <NavLink to="/targets" className={({ isActive }) => `h-10 w-10 rounded-md flex items-center justify-center transition-all ${isActive ? 'bg-white text-eco-purple' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>
            <Target size={20} />
          </NavLink>
          
          <NavLink to="/measurements" className={({ isActive }) => `h-10 w-10 rounded-md flex items-center justify-center transition-all ${isActive ? 'bg-white text-eco-purple' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>
            <Activity size={20} />
          </NavLink>
          
          <NavLink to="/suppliers" className={({ isActive }) => `h-10 w-10 rounded-md flex items-center justify-center transition-all ${isActive ? 'bg-white text-eco-purple' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>
            <Users size={20} />
          </NavLink>
        </div>
      </div>
      
      {/* Main sidebar */}
      <div 
        className={`h-screen bg-sidebar border-r border-border
        ${sidebarExpanded ? 'w-60' : 'w-0 -ml-16'} flex flex-col z-10 transition-all duration-300 overflow-hidden`}
      >
        <div className="p-4 flex items-center border-b border-border">
          {sidebarExpanded && (
            <h2 className="text-lg font-semibold mr-auto text-gradient">Carbon Impact</h2>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            className={`${sidebarExpanded ? '' : 'mx-auto'} p-1 text-eco-purple hover:text-eco-darkPurple hover:bg-eco-purple/10`} 
            onClick={toggleSidebar}
          >
            {sidebarExpanded ? <ChevronLeft /> : <ChevronRight />}
          </Button>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            <NavItem to="/" icon={Home} label="Overview" expanded={sidebarExpanded} />
            <NavItem to="/tracks" icon={BarChart} label="Tracks" expanded={sidebarExpanded} />
            <NavItem to="/factors" icon={Database} label="Factors" expanded={sidebarExpanded} />
            <NavItem to="/measurements" icon={Activity} label="Measurements" expanded={sidebarExpanded} />
            
            {/* Act group with sub-navigation */}
            <NavGroupItem icon={PlayCircle} label="Act" expanded={sidebarExpanded}>
              <NavItem to="/targets" icon={Target} label="Targets" expanded={sidebarExpanded} />
              <NavItem to="/initiatives" icon={Lightbulb} label="Initiatives" expanded={sidebarExpanded} />
              <NavItem to="/scenarios" icon={Settings} label="Scenarios" expanded={sidebarExpanded} />
            </NavGroupItem>
            
            <NavItem to="/suppliers" icon={Users} label="Suppliers" expanded={sidebarExpanded} />
          </ul>
        </nav>
        
        <div className="border-t border-border p-4">
          {sidebarExpanded ? (
            <div className="text-xs text-muted-foreground">
              <p>Carbon Impact Flow</p>
              <p>v1.0.0</p>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="h-2 w-2 bg-eco-purple rounded-full"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
