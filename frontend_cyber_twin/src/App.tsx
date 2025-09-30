import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Layout } from "@/components/layout/layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import OrganizationalChart from "./pages/OrganizationalChart";
import DivisionSecurity from "./pages/DivisionSecurity";
import DataCenters from "./pages/DataCenters";
import AttackScenarios from "./pages/AttackScenarios";
import LiveMonitoring from "./pages/LiveMonitoring";
import FinancialServices from "./pages/division/FinancialServices";
import Technology from "./pages/division/Technology";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import SOCSettings from "./pages/SOCSettings";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="cybertwin-theme">
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<ProtectedRoute><Layout><Index /></Layout></ProtectedRoute>} />
              <Route path="/org-chart" element={<ProtectedRoute><Layout><OrganizationalChart /></Layout></ProtectedRoute>} />
              <Route path="/division-security" element={<ProtectedRoute><Layout><DivisionSecurity /></Layout></ProtectedRoute>} />
              <Route path="/data-centers" element={<ProtectedRoute><Layout><DataCenters /></Layout></ProtectedRoute>} />
              <Route path="/attack-scenarios" element={<ProtectedRoute><Layout><AttackScenarios /></Layout></ProtectedRoute>} />
              <Route path="/live-monitoring" element={<ProtectedRoute><Layout><LiveMonitoring /></Layout></ProtectedRoute>} />
              <Route path="/financial-services" element={<ProtectedRoute><Layout><FinancialServices /></Layout></ProtectedRoute>} />
              <Route path="/technology" element={<ProtectedRoute><Layout><Technology /></Layout></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
              <Route path="/soc-settings" element={<ProtectedRoute><Layout><SOCSettings /></Layout></ProtectedRoute>} />
              <Route path="/help" element={<ProtectedRoute><Layout><Help /></Layout></ProtectedRoute>} />
              <Route path="*" element={<ProtectedRoute><Layout><NotFound /></Layout></ProtectedRoute>} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
