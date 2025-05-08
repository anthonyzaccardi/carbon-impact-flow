
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
  PlayCircle,
  MessageSquareText
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
          `flex items-center p-2 rounded-md mb-1 transition-colors duration-200
          ${isActive ? 'bg-accent text-primary' : 'hover:bg-accent/50 text-foreground/80'} 
          ${expanded ? 'justify-start' : 'justify-center'} nav-item ${isActive ? 'active' : ''}`
        }
      >
        <Icon className="h-4 w-4" />
        {expanded && <span className="ml-2 text-sm">{label}</span>}
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
        className={`flex items-center w-full p-2 rounded-md transition-colors duration-200
          hover:bg-accent/50 text-foreground/80
          ${expanded ? 'justify-start' : 'justify-center'}`}
      >
        <Icon className="h-4 w-4" />
        {expanded && (
          <>
            <span className="ml-2 text-sm flex-grow text-left">{label}</span>
            <ChevronRight className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
          </>
        )}
      </button>
      {(isOpen || !expanded) && (
        <ul className={`${expanded ? 'ml-6' : 'mt-1'} space-y-1`}>
          {children}
        </ul>
      )}
    </li>
  );
};

const Sidebar = () => {
  const { sidebarExpanded, toggleSidebar } = useAppContext();
  
  return (
    <div 
      className={`fixed top-0 left-0 h-screen bg-sidebar border-r border-border
      ${sidebarExpanded ? 'w-60' : 'w-16'} flex flex-col z-10 transition-all duration-200`}
    >
      <div className="p-3 flex items-center border-b border-border">
        {sidebarExpanded && (
          <h2 className="text-base font-medium mr-auto">Carbon Impact</h2>
        )}
        <Button 
          variant="ghost" 
          size="sm" 
          className={`${sidebarExpanded ? '' : 'mx-auto'} p-1`} 
          onClick={toggleSidebar}
        >
          {sidebarExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 p-2">
        <ul>
          <NavItem to="/" icon={Home} label="Overview" expanded={sidebarExpanded} />
          <NavItem to="/tracks" icon={BarChart} label="Tracks" expanded={sidebarExpanded} />
          <NavItem to="/factors" icon={Database} label="Factors" expanded={sidebarExpanded} />
          <NavItem to="/measurements" icon={Activity} label="Measurements" expanded={sidebarExpanded} />
          
          {/* Act group with sub-navigation */}
          <NavGroupItem icon={PlayCircle} label="Act" expanded={sidebarExpanded}>
            <NavItem to="/scenarios" icon={Settings} label="Scenarios" expanded={sidebarExpanded} />
            <NavItem to="/targets" icon={Target} label="Targets" expanded={sidebarExpanded} />
            <NavItem to="/initiatives" icon={Lightbulb} label="Initiatives" expanded={sidebarExpanded} />
          </NavGroupItem>
          
          <NavItem to="/suppliers" icon={Users} label="Suppliers" expanded={sidebarExpanded} />
          
          {/* New Ask Sweepy Button - Always visible at the bottom of navigation */}
          <li className="mt-4">
            <NavLink
              to="/ask-sweepy" 
              className={({ isActive }) => 
                `flex items-center p-2 rounded-md transition-colors duration-200
                ${isActive ? 'bg-black text-white' : 'bg-black text-white hover:bg-gray-800'} 
                ${sidebarExpanded ? 'justify-start' : 'justify-center'}`
              }
            >
              <MessageSquareText className="h-4 w-4" />
              {sidebarExpanded && <span className="ml-2 text-sm font-medium">Ask Sweepy</span>}
            </NavLink>
          </li>
        </ul>
      </nav>
      
      <div className="border-t border-border p-3">
        {sidebarExpanded ? (
          <div className="text-xs text-muted-foreground">
            <p>Carbon Impact Flow</p>
            <p>v1.0.0</p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="h-2 w-2 bg-primary/50 rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
