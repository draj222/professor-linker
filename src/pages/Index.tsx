import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { MultiStepForm } from '@/components/MultiStepForm';
import { Navigation } from '@/components/landing/Navigation';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeatureCards } from '@/components/landing/FeatureCards';
import { AuthenticatedDashboard } from '@/components/landing/AuthenticatedDashboard';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [user, setUser] = useState(null);
  const [planInfo, setPlanInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Current session:', session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchUserPlan(session.user.id);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchUserPlan(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserPlan = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_plans')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching plan:', error);
        return;
      }

      console.log('Fetched plan data:', data);
      setPlanInfo(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black text-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black">
        <Navigation />
        <div className="container mx-auto px-4 py-12 md:py-24">
          <HeroSection />
          <FeatureCards />
          <div className="text-center">
            <Button 
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-lg"
              onClick={() => navigate('/login')}
            >
              Get Started Free
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!planInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">Tell Us About Your Interests</h1>
          <p className="text-lg text-center text-gray-300 mb-12">
            Help us understand your academic interests so we can find the perfect professors for you.
          </p>
          <MultiStepForm />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black">
      <Navbar />
      <AuthenticatedDashboard planInfo={planInfo} />
    </div>
  );
};

export default Index;