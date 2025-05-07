
import { useMemo } from "react";
import SortableTable, { SortableColumn } from "@/components/ui/sortable-table";
import { Measurement, Track, Factor, Supplier } from "@/types";

interface MeasurementsTableProps {
  measurements: Measurement[];
  tracks: Track[];
  factors: Factor[];
  suppliers: Supplier[];
  onRowClick: (measurement: Measurement) => void;
}

const MeasurementsTable = ({
  measurements,
  tracks,
  factors,
  suppliers,
  onRowClick,
}: MeasurementsTableProps) => {
  const columns: SortableColumn<Measurement>[] = useMemo(() => [
    {
      header: "Date",
      accessorKey: "date",
      cell: (item) => new Date(item.date).toLocaleDateString(),
      sortable: true,
    },
    {
      header: "Track",
      accessorKey: "trackId",
      cell: (item) => {
        const track = tracks.find(t => t.id === item.trackId);
        return track ? (
          <div className="flex items-center">
            <span className="mr-1">{track.emoji}</span>
            <span>{track.name}</span>
          </div>
        ) : item.trackId;
      },
      sortable: true,
    },
    {
      header: "Factor",
      accessorKey: "factorId",
      cell: (item) => {
        const factor = factors.find(f => f.id === item.factorId);
        return factor ? factor.name : item.factorId;
      },
      sortable: true,
    },
    {
      header: "Supplier",
      accessorKey: "supplierId",
      cell: (item) => {
        if (!item.supplierId) return "—";
        const supplier = suppliers.find(s => s.id === item.supplierId);
        return supplier ? supplier.name : item.supplierId;
      },
      sortable: true,
    },
    {
      header: "Quantity",
      accessorKey: "quantity",
      cell: (item) => `${item.quantity} ${item.unit}`,
      sortable: true,
    },
    {
      header: "Calculated value",
      accessorKey: "calculatedValue",
      cell: (item) => `${item.calculatedValue.toLocaleString()} tCO₂e`,
      sortable: true,
    }
  ], [tracks, factors, suppliers]);

  return (
    <SortableTable 
      data={measurements} 
      columns={columns} 
      onRowClick={onRowClick}
      className="measurements-table"
    />
  );
};

export default MeasurementsTable;
