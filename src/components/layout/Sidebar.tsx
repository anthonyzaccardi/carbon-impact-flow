
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
  ChevronDown
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
          `sidebar-nav-item ${isActive ? 'active' : ''} ${expanded ? 'pl-3' : 'justify-center'}`
        }
      >
        <Icon className="h-5 w-5 flex-shrink-0" />
        {expanded && <span className="text-sm">{label}</span>}
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
        className={`sidebar-nav-item ${expanded ? 'justify-between' : 'justify-center'}`}
      >
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 flex-shrink-0" />
          {expanded && <span className="text-sm">{label}</span>}
        </div>
        {expanded && (
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </button>
      {(isOpen || !expanded) && (
        <ul className={`${expanded ? 'ml-7 mt-1' : 'mt-1'} space-y-1`}>
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
      className={`fixed top-0 left-0 h-screen bg-sidebar border-r border-sidebar-border
      ${sidebarExpanded ? 'w-[260px]' : 'w-16'} flex flex-col z-10 transition-all duration-300`}
    >
      <div className="p-4 flex items-center justify-between border-b border-sidebar-border h-16">
        {sidebarExpanded && (
          <h2 className="text-lg font-semibold text-white">Carbon Impact</h2>
        )}
        <Button 
          variant="ghost" 
          size="sm" 
          className={`${sidebarExpanded ? '' : 'mx-auto'} p-1 text-white hover:bg-white/10`} 
          onClick={toggleSidebar}
        >
          {sidebarExpanded ? <ChevronLeft /> : <ChevronRight />}
        </Button>
      </div>

      <nav className="flex-1 p-3 space-y-6">
        <div>
          {sidebarExpanded && <p className="sidebar-section-header">OVERVIEW</p>}
          <ul className="space-y-1 mt-2">
            <NavItem to="/" icon={Home} label="Dashboard" expanded={sidebarExpanded} />
          </ul>
        </div>
        
        <div>
          {sidebarExpanded && <p className="sidebar-section-header">MEASURE</p>}
          <ul className="space-y-1 mt-2">
            <NavItem to="/tracks" icon={BarChart} label="Tracks" expanded={sidebarExpanded} />
            <NavItem to="/factors" icon={Database} label="Factors" expanded={sidebarExpanded} />
            <NavItem to="/measurements" icon={Activity} label="Measurements" expanded={sidebarExpanded} />
          </ul>
        </div>
        
        <div>
          {sidebarExpanded && <p className="sidebar-section-header">PLAN & ACT</p>}
          <ul className="space-y-1 mt-2">
            <NavItem to="/targets" icon={Target} label="Targets" expanded={sidebarExpanded} />
            <NavItem to="/initiatives" icon={Lightbulb} label="Initiatives" expanded={sidebarExpanded} />
            <NavItem to="/scenarios" icon={Settings} label="Scenarios" expanded={sidebarExpanded} />
            <NavItem to="/suppliers" icon={Users} label="Suppliers" expanded={sidebarExpanded} />
          </ul>
        </div>
      </nav>
      
      <div className="border-t border-sidebar-border p-4">
        {sidebarExpanded ? (
          <div className="text-xs text-sidebar-foreground/60">
            <p>Carbon Impact Flow</p>
            <p>v1.0.0</p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="h-2 w-2 bg-primary rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
