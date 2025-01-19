import { useState, useEffect, useCallback, useRef } from "react";
import { UniversitySearch } from "./UniversitySearch";
import { UniversityList } from "./UniversityList";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Sparkles, Loader2, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface UniversitySelectorProps {
  onComplete?: () => void;
}

export const UniversitySelector = ({ onComplete }: UniversitySelectorProps) => {
  const [universities, setUniversities] = useState([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup function to abort any pending requests
  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const generateUniversities = useCallback(async () => {
    const fieldOfInterest = localStorage.getItem("fieldOfInterest");
    const educationLevel = localStorage.getItem("educationLevel");
    const universityCount = localStorage.getItem("universityCount") || "6";
    
    if (!fieldOfInterest) {
      toast({
        title: "Missing Information",
        description: "Please complete your profile first",
        variant: "destructive",
      });
      navigate('/');
      return;
    }

    // Cleanup any existing requests
    cleanup();

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setUniversities([]); // Clear existing universities
    
    try {
      console.log("Generating universities with field:", fieldOfInterest, "Attempt:", retryCount + 1);
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 30000);
      });

      const fetchPromise = supabase.functions.invoke('getuniversities', {
        body: { 
          fieldOfInterest,
          educationLevel,
          universityCount
        },
        signal: abortControllerRef.current.signal,
      });

      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;

      // Check if the component was unmounted or a new request was started
      if (abortControllerRef.current?.signal.aborted) {
        console.log("Request was aborted");
        return;
      }

      if (error) throw error;

      if (!data || !Array.isArray(data)) {
        throw new Error('Invalid response format from server');
      }

      console.log("Generated universities:", data);
      
      if (data.length === 0) {
        throw new Error('No universities were generated');
      }

      setUniversities(data);
      
      toast({
        title: "Universities Found!",
        description: `Found ${data.length} universities matching your interests`,
      });
    } catch (error) {
      // Only show error if the request wasn't aborted
      if (!abortControllerRef.current?.signal.aborted) {
        console.error("Error generating universities:", error);
        
        let errorMessage = "Failed to generate university suggestions.";
        if (error.message === 'Request timeout') {
          errorMessage = "Request timed out. Please try again.";
        }
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        
        setUniversities([]);
      }
    } finally {
      if (!abortControllerRef.current?.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [retryCount, toast, navigate, cleanup]);

  useEffect(() => {
    const initializeGeneration = async () => {
      if (!isLoading) {
        await generateUniversities();
      }
    };
    
    initializeGeneration();

    // Cleanup on unmount
    return () => {
      cleanup();
    };
  }, [retryCount, generateUniversities, isLoading, cleanup]);

  const handleRetry = useCallback(() => {
    setRetryCount(prev => prev + 1);
  }, []);

  const handleComplete = async () => {
    if (favorites.length === 0) {
      toast({
        title: "No Universities Selected",
        description: "Please favorite at least one university before continuing.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        for (const universityId of favorites) {
          await supabase
            .from('user_favorite_universities')
            .upsert({ 
              user_id: user.id,
              university_id: universityId
            });
        }
      }

      navigate('/generating');
    } catch (error) {
      console.error('Error saving favorites:', error);
      toast({
        title: "Error",
        description: "Failed to save your selections. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#9b87f5]/30 to-[#D6BCFA]/30 blur-3xl -z-10" />
          <Loader2 className="h-12 w-12 animate-spin text-[#9b87f5]" />
        </div>
        <p className="text-xl text-foreground font-medium">Discovering Perfect Universities...</p>
        <p className="text-muted-foreground text-center max-w-md">
          We're analyzing universities worldwide to find the best matches for your academic interests
        </p>
        <Button
          variant="outline"
          onClick={handleRetry}
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-8">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-3xl -z-10" />
        <Card className="p-6 bg-white/5 backdrop-blur-lg border border-white/10">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2 text-foreground">
                <Sparkles className="h-6 w-6 text-[#9b87f5]" />
                Suggested Universities
              </h2>
              <p className="text-muted-foreground">
                Based on your academic interests and goals, we've found these universities that might be a great fit.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleRetry}
              className="flex items-center gap-2 hover:bg-white/10"
              disabled={isLoading}
            >
              <RefreshCw className="h-4 w-4" />
              Regenerate
            </Button>
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-white/5 backdrop-blur-lg border border-white/10">
        <h3 className="text-xl font-semibold mb-4 text-foreground">
          {universities.length > 0 ? "Recommended Universities" : "No Universities Found"}
        </h3>
        
        <UniversityList
          universities={universities}
          onFavorite={(universityId) => {
            setFavorites(prev => 
              prev.includes(universityId)
                ? prev.filter(id => id !== universityId)
                : [...prev, universityId]
            );
          }}
          favorites={favorites}
          matchedUniversities={universities}
        />
      </Card>
      
      <div className="flex justify-center mt-8">
        <Button
          onClick={handleComplete}
          className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white px-8 py-2 text-lg rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          disabled={favorites.length === 0}
        >
          Continue to Professor Search
        </Button>
      </div>
    </div>
  );
};
