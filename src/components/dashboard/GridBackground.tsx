
import React from 'react';

const GridBackground: React.FC = () => {
  const cells = Array(12 * 12).fill(0);
  
  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none grid grid-cols-12 gap-3" style={{ zIndex: 0 }}>
      {cells.map((_, index) => (
        <div key={index} className="aspect-square bg-[#F2F2F2] rounded-md"></div>
      ))}
    </div>
  );
};

export default GridBackground;
