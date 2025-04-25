
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts/AppContext';
import { 
  Home, 
  BarChart, 
  Database, 
  Target, 
  Activity, 
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Lightbulb
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
          ${isActive ? 'bg-primary/10 text-primary' : 'hover:bg-primary/5 text-foreground/80'} 
          ${expanded ? 'justify-start' : 'justify-center'} nav-item ${isActive ? 'active' : ''}`
        }
      >
        <Icon className="h-5 w-5" />
        {expanded && <span className="ml-3 text-sm">{label}</span>}
      </NavLink>
    </li>
  );
};

const Sidebar = () => {
  const { sidebarExpanded, toggleSidebar } = useAppContext();
  
  return (
    <div 
      className={`h-screen bg-sidebar border-r border-border sidebar-transition 
      ${sidebarExpanded ? 'w-60' : 'w-16'} flex flex-col`}
    >
      <div className="p-4 flex items-center border-b border-border">
        {sidebarExpanded && (
          <h2 className="text-lg font-semibold mr-auto">Carbon Impact</h2>
        )}
        <Button 
          variant="ghost" 
          size="sm" 
          className={`${sidebarExpanded ? '' : 'mx-auto'} p-1`} 
          onClick={toggleSidebar}
        >
          {sidebarExpanded ? <ChevronLeft /> : <ChevronRight />}
        </Button>
      </div>

      <nav className="flex-1 p-2">
        <ul>
          <NavItem to="/" icon={Home} label="Overview" expanded={sidebarExpanded} />
          <NavItem to="/tracks" icon={BarChart} label="Tracks" expanded={sidebarExpanded} />
          <NavItem to="/factors" icon={Database} label="Factors" expanded={sidebarExpanded} />
          <NavItem to="/measurements" icon={Activity} label="Measurements" expanded={sidebarExpanded} />
          <NavItem to="/targets" icon={Target} label="Targets" expanded={sidebarExpanded} />
          <NavItem to="/initiatives" icon={Lightbulb} label="Initiatives" expanded={sidebarExpanded} />
          <NavItem to="/scenarios" icon={Settings} label="Scenarios" expanded={sidebarExpanded} />
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
  );
};

export default Sidebar;
