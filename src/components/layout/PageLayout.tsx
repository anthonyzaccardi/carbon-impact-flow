
import { ReactNode } from 'react';
import BreadcrumbNav, { BreadcrumbItem } from '@/components/ui/breadcrumb-nav';

interface PageLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
  breadcrumbItems?: BreadcrumbItem[];
}

const PageLayout = ({ 
  title, 
  description, 
  children, 
  breadcrumbItems = [] 
}: PageLayoutProps) => {
  // Default breadcrumb will show home if no items provided
  const items = breadcrumbItems.length > 0 
    ? breadcrumbItems 
    : [{ label: title }];

  return (
    <div className="space-y-4">
      <BreadcrumbNav items={items} />
      
      {(title || description) && (
        <div className="mb-6">
          {title && <h1 className="text-2xl font-semibold mb-1">{title}</h1>}
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
      )}
      
      {children}
    </div>
  );
};

export default PageLayout;
