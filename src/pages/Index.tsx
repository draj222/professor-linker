import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { MultiStepForm } from '@/components/MultiStepForm';
import { Navigation } from '@/components/landing/Navigation';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeatureCards } from '@/components/landing/FeatureCards';
import { Testimonials } from '@/components/landing/Testimonials';
import { NewsFeatures } from '@/components/landing/NewsFeatures';
import { CoreDashboard } from '@/components/dashboard/CoreDashboard';
import { Button } from '@/components/ui/button';
import { useTheme } from "@/components/ThemeProvider";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [user, setUser] = useState(null);
  const [planInfo, setPlanInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error retrieving session:', error);
          throw error;
        }

        if (session?.user && mounted) {
          console.log('Retrieved session for user:', session.user.id);
          setUser(session.user);
          await fetchUserPlan(session.user.id);
        } else {
          console.log('No active session found');
          setUser(null);
          setPlanInfo(null);
        }
      } catch (error) {
        console.error('Error during initialization:', error);
        toast({
          title: "Error",
          description: "Failed to restore your session. Please try logging in again.",
          variant: "destructive"
        });
      } finally {
        if (mounted) {
          console.log('Setting loading to false');
          setLoading(false);
        }
      }
    };

    // Run the initial session check
    initializeAuth();

    // Set up auth state listener for future changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      
      if (mounted) {
        if (session?.user) {
          setUser(session.user);
          await fetchUserPlan(session.user.id);
        } else {
          setUser(null);
          setPlanInfo(null);
        }
        setLoading(false);
      }
    });

    // Cleanup function
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [toast]);

  const fetchUserPlan = async (userId) => {
    try {
      console.log('Fetching user plan for:', userId);
      const { data, error } = await supabase
        .from('user_plans')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching plan:', error);
        toast({
          title: "Error",
          description: "Failed to fetch user plan",
          variant: "destructive"
        });
        return;
      }

      console.log('Fetched plan data:', data);
      setPlanInfo(data);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  const handleProfileSubmit = () => {
    setShowProfileForm(false);
    navigate('/pricing');
  };

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background/80 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading your session...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show landing page
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
        <Navigation />
        <div className="container mx-auto px-4 py-12 md:py-24">
          <HeroSection />
          <FeatureCards />
          <Testimonials />
          <NewsFeatures />
          <div className="text-center mt-16">
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-lg"
              onClick={() => navigate('/login')}
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // If user is authenticated but showing profile form
  if (showProfileForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <h1 className="text-4xl font-bold text-foreground mb-8 text-center">Tell Us About Your Interests</h1>
          <p className="text-lg text-center text-muted-foreground mb-12">
            Help us understand your academic interests so we can find the perfect professors for you.
          </p>
          <MultiStepForm onSubmit={handleProfileSubmit} />
        </div>
      </div>
    );
  }

  // Show dashboard with option to complete profile if no plan
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      <Navbar />
      <div className="pt-16">
        <CoreDashboard />
      </div>
      {!planInfo && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-lg shadow-lg"
            onClick={() => setShowProfileForm(true)}
          >
            Complete Your Profile
          </Button>
        </div>
      )}
    </div>
  );
};

export default Index;