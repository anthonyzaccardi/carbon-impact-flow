
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
  ChevronDown,
  ChevronRight,
  Lightbulb,
  PlayCircle,
  FileText,
  Heart
} from 'lucide-react';

const NavItem = ({ 
  to, 
  icon: Icon, 
  label, 
  count
}: { 
  to: string; 
  icon: React.ElementType; 
  label: string;
  count?: number;
}) => {
  return (
    <li>
      <NavLink 
        to={to} 
        className={({ isActive }) => 
          `nav-item ${isActive ? 'active' : ''}`
        }
      >
        <Icon className="h-5 w-5 text-[#717175]" />
        <span className="ml-3">{label}</span>
        {count !== undefined && (
          <span className="count-badge">{count}</span>
        )}
      </NavLink>
    </li>
  );
};

const NavGroupItem = ({ 
  label, 
  icon: Icon, 
  children 
}: { 
  label: string; 
  icon: React.ElementType; 
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <li className="mb-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="nav-item w-full justify-between"
      >
        <div className="flex items-center">
          <Icon className="h-5 w-5 text-[#717175]" />
          <span className="ml-3">{label}</span>
        </div>
        {isOpen ? 
          <ChevronDown className="h-4 w-4 text-[#717175]" /> : 
          <ChevronRight className="h-4 w-4 text-[#717175]" />
        }
      </button>
      {isOpen && (
        <ul className="ml-7 space-y-1">
          {children}
        </ul>
      )}
    </li>
  );
};

const Sidebar = () => {
  const { sidebarExpanded, toggleSidebar } = useAppContext();
  
  return (
    <div className={`fixed top-0 left-0 h-screen bg-white border-r border-[#EEEEEE] w-[230px] flex flex-col z-10`}>
      <div className="p-4 flex items-center border-b border-[#EEEEEE]">
        <h2 className="text-lg font-semibold text-[#333336]">Carbon Impact</h2>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <div className="report-folder-header">MAIN</div>
        <ul className="space-y-1">
          <NavItem to="/" icon={Home} label="Overview" />
          <NavItem to="/tracks" icon={BarChart} label="Tracks" count={5} />
          <NavItem to="/factors" icon={Database} label="Factors" count={12} />
          <NavItem to="/measurements" icon={Activity} label="Measurements" count={28} />
        </ul>
        
        <div className="report-folder-header">REPORT FOLDERS</div>
        <ul className="space-y-1">
          {/* Act group with sub-navigation */}
          <NavGroupItem icon={PlayCircle} label="Act">
            <NavItem to="/targets" icon={Target} label="Targets" />
            <NavItem to="/initiatives" icon={Lightbulb} label="Initiatives" />
            <NavItem to="/scenarios" icon={Settings} label="Scenarios" />
          </NavGroupItem>
          
          <NavGroupItem icon={FileText} label="Reports">
            <NavItem to="/reports/all" icon={FileText} label="All reports" count={22} />
            <NavItem to="/reports/my" icon={Heart} label="My reports" count={5} />
          </NavGroupItem>
          
          <NavItem to="/suppliers" icon={Users} label="Suppliers" count={8} />
        </ul>
      </nav>
      
      <div className="border-t border-[#EEEEEE] p-4">
        <div className="text-xs text-[#71717A] flex items-center">
          <div className="h-2 w-2 bg-[#286EF1] rounded-full mr-2"></div>
          <p>Carbon Impact v1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
