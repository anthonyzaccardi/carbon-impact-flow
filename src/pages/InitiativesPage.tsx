
import { useAppContext } from '@/contexts/useAppContext';
import PageLayout from '@/components/layout/PageLayout';
import { InitiativeStatCards } from '@/components/initiatives/InitiativeStatCards';
import { InitiativeHeader } from '@/components/initiatives/InitiativeHeader';
import { InitiativeSearch } from '@/components/initiatives/InitiativeSearch';
import { InitiativeTable } from '@/components/initiatives/InitiativeTable';
import { useInitiativeFilter } from '@/hooks/useInitiativeFilter';
import { useInitiativeCalculation } from '@/hooks/useInitiativeCalculation';

const InitiativesPage = () => {
  const { initiatives, targets, openSidePanel, extractPercentage } = useAppContext();
  const { searchQuery, setSearchQuery, filteredInitiatives } = useInitiativeFilter(initiatives);
  const { calculateInitiativeAbsoluteValue } = useInitiativeCalculation(targets, extractPercentage);

  const handleCreateInitiative = () => {
    openSidePanel('create', 'initiative');
  };

  const handleViewInitiative = (initiative) => {
    openSidePanel('view', 'initiative', initiative);
  };

  const handleManageTargets = (initiative) => {
    openSidePanel('view', 'initiative-targets', initiative);
  };

  return (
    <PageLayout
      title="Initiatives"
      description="Manage climate action initiatives and interventions"
      breadcrumbItems={[
        { label: "Dashboard", href: "/" },
        { label: "Initiatives" }
      ]}
    >
      <InitiativeHeader onCreateInitiative={handleCreateInitiative} />
      
      <InitiativeStatCards initiatives={initiatives} />
      
      <InitiativeSearch 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />
      
      <InitiativeTable
        initiatives={filteredInitiatives}
        targets={targets}
        extractPercentage={extractPercentage}
        onInitiativeClick={handleViewInitiative}
        onManageTargets={handleManageTargets}
        calculateInitiativeAbsoluteValue={calculateInitiativeAbsoluteValue}
      />
    </PageLayout>
  );
};

export default InitiativesPage;
