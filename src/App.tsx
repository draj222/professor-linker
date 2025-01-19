import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useEffect } from "react";
import Index from "./pages/Index";
import Loading from "./pages/Loading";
import Pricing from "./pages/Pricing";
import Results from "./pages/Results";
import GeneratingResults from "./pages/GeneratingResults";
import LoginPage from "./pages/LoginPage";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const loadFont = async () => {
      const font = new FontFace(
        'Inter',
        'url(https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2)'
      );

      try {
        await font.load();
        document.fonts.add(font);
        console.log('Inter font loaded successfully');
      } catch (error) {
        console.error('Error loading Inter font:', error);
      }
    };

    loadFont();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="app-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/loading" element={<Loading />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/generating" element={<GeneratingResults />} />
              <Route path="/results" element={<Results />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;