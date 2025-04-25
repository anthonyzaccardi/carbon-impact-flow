
import { useAppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table";
import StatCard from "@/components/ui/stat-card";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const SuppliersPage = () => {
  const { suppliers, measurements, targets, openSidePanel } = useAppContext();
  
  const [searchTerm, setSearchTerm] = useState("");
  
  // Apply filters
  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Metrics
  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter(s => s.status === 'active').length;
  
  // Get association counts for each supplier
  const getMeasurementCount = (supplierId) => {
    return measurements.filter(m => m.supplierId === supplierId).length;
  };
  
  const getTargetCount = (supplierId) => {
    return targets.filter(t => t.supplierId === supplierId).length;
  };
  
  // Table columns
  const columns = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Industry",
      accessorKey: "industry",
    },
    {
      header: "Location",
      accessorKey: "location",
    },
    {
      header: "Contact",
      accessorKey: "contactPerson",
      cell: (item) => (
        <div className="text-sm">
          <div>{item.contactPerson}</div>
          <div className="text-muted-foreground">{item.email}</div>
        </div>
      ),
    },
    {
      header: "Measurements",
      accessorKey: "measurements",
      cell: (item) => getMeasurementCount(item.id),
    },
    {
      header: "Targets",
      accessorKey: "targets",
      cell: (item) => getTargetCount(item.id),
    },
    {
      header: "Status",
      accessorKey: "status",
    }
  ];

  // Handle row click
  const handleRowClick = (supplier) => {
    openSidePanel('view', 'supplier', supplier);
  };
  
  // Handle create new
  const handleCreateNew = () => {
    openSidePanel('create', 'supplier');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Suppliers</h1>
          <p className="text-muted-foreground">
            Manage organizations in your supply chain
          </p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add Supplier
        </Button>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Total Suppliers" 
          value={totalSuppliers}
        />
        <StatCard 
          title="Active Suppliers" 
          value={activeSuppliers}
        />
        <StatCard 
          title="Industries" 
          value={new Set(suppliers.map(s => s.industry)).size}
        />
      </div>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search suppliers..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Suppliers Table */}
      <DataTable 
        data={filteredSuppliers} 
        columns={columns} 
        onRowClick={handleRowClick}
      />
    </div>
  );
};

export default SuppliersPage;
