
import { supabase } from '@/integrations/supabase/client';
import { Layout } from 'react-grid-layout';

export interface DashboardLayout {
  id: string;
  page_name: string;
  layout: Layout[];
  created_at: string;
  updated_at: string;
}

export async function fetchLayout(pageName: string): Promise<Layout[]> {
  try {
    const { data, error } = await supabase
      .from('dashboard_layouts')
      .select('*')
      .eq('page_name', pageName)
      .single();

    if (error) {
      console.error("Error fetching layout:", error);
      return [];
    }

    return data?.layout || [];
  } catch (error) {
    console.error("Failed to fetch layout:", error);
    return [];
  }
}

export async function saveLayout(pageName: string, layout: Layout[]): Promise<void> {
  try {
    const { error } = await supabase
      .from('dashboard_layouts')
      .update({ 
        layout, 
        updated_at: new Date().toISOString() 
      })
      .eq('page_name', pageName);

    if (error) {
      console.error("Error saving layout:", error);
    }
  } catch (error) {
    console.error("Failed to save layout:", error);
  }
}
