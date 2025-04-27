
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import MainLayout from "./components/layout/MainLayout";
import Overview from "./pages/Overview";
import TracksPage from "./pages/TracksPage";
import FactorsPage from "./pages/FactorsPage";
import MeasurementsPage from "./pages/MeasurementsPage";
import TargetsPage from "./pages/TargetsPage";
import InitiativesPage from "./pages/InitiativesPage";
import ScenariosPage from "./pages/ScenariosPage";
import ScenarioDetailPage from "./pages/ScenarioDetailPage";
import TargetDetailPage from "./pages/TargetDetailPage";
import SuppliersPage from "./pages/SuppliersPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={
                <MainLayout>
                  <Overview />
                </MainLayout>
              } 
            />
            <Route 
              path="/tracks" 
              element={
                <MainLayout>
                  <TracksPage />
                </MainLayout>
              } 
            />
            <Route 
              path="/factors" 
              element={
                <MainLayout>
                  <FactorsPage />
                </MainLayout>
              } 
            />
            <Route 
              path="/measurements" 
              element={
                <MainLayout>
                  <MeasurementsPage />
                </MainLayout>
              } 
            />
            <Route 
              path="/targets" 
              element={
                <MainLayout>
                  <TargetsPage />
                </MainLayout>
              } 
            />
            <Route 
              path="/initiatives" 
              element={
                <MainLayout>
                  <InitiativesPage />
                </MainLayout>
              } 
            />
            <Route 
              path="/scenarios" 
              element={
                <MainLayout>
                  <ScenariosPage />
                </MainLayout>
              } 
            />
            <Route 
              path="/scenarios/:scenarioId" 
              element={
                <MainLayout>
                  <ScenarioDetailPage />
                </MainLayout>
              } 
            />
            <Route 
              path="/scenarios/:scenarioId/targets/:targetId" 
              element={
                <MainLayout>
                  <TargetDetailPage />
                </MainLayout>
              } 
            />
            <Route 
              path="/suppliers" 
              element={
                <MainLayout>
                  <SuppliersPage />
                </MainLayout>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
