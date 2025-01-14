import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import { Mail, Package, Globe, Rocket, Users, Search, Brain, Sparkles } from 'lucide-react';
import { MultiStepForm } from '@/components/MultiStepForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Index = () => {
  const [user, setUser] = useState(null);
  const [planInfo, setPlanInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/login');
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

  const LandingContent = () => (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            <div className="text-white text-xl font-bold">Professor Linker</div>
            <Button 
              variant="outline"
              className="bg-white/10 border-gray-700 text-white hover:bg-white/20"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            The Smartest Way to Connect with Professors
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            All-in-one AI tools for students and researchers to find and connect with leading academics in their field.
          </p>
          
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Try: How to connect with professors in quantum computing?"
                className="w-full px-6 py-6 text-lg bg-white/10 backdrop-blur-lg border-gray-700 text-white placeholder:text-gray-400"
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </form>

          <div className="flex flex-col md:flex-row gap-4 justify-center mb-12">
            <p className="text-gray-400">Try asking about:</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button variant="outline" className="bg-white/5 border-gray-700 text-gray-300 hover:bg-white/10">
                Research Collaboration
              </Button>
              <Button variant="outline" className="bg-white/5 border-gray-700 text-gray-300 hover:bg-white/10">
                PhD Applications
              </Button>
              <Button variant="outline" className="bg-white/5 border-gray-700 text-gray-300 hover:bg-white/10">
                Academic Networking
              </Button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white/5 backdrop-blur-lg border-gray-700 transform transition-all hover:scale-105">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Brain className="h-6 w-6 text-blue-400" />
                AI-Powered Matching
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300">
              Our advanced AI analyzes research papers and academic profiles to find the perfect professor matches for your interests.
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-lg border-gray-700 transform transition-all hover:scale-105">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Sparkles className="h-6 w-6 text-blue-400" />
                Smart Email Generation
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300">
              Generate personalized, professional emails that highlight your genuine interest and relevant background.
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-lg border-gray-700 transform transition-all hover:scale-105">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Globe className="h-6 w-6 text-blue-400" />
                Global Network
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300">
              Connect with leading academics from top universities worldwide in your field of research.
            </CardContent>
          </Card>
        </div>

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
    </>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black">
        <LandingContent />
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
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Your Dashboard</h1>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-lg border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Package className="h-6 w-6" />
                Current Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-400">{planInfo.plan_name}</p>
              <p className="text-gray-300 mt-2">Selected on {new Date(planInfo.created_at).toLocaleDateString()}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Mail className="h-6 w-6" />
                Email Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-blue-400">
                  {planInfo.emails_sent} / {planInfo.total_emails}
                </p>
                <p className="text-gray-300">emails remaining</p>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-blue-500 h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${((planInfo.total_emails - planInfo.emails_sent) / planInfo.total_emails) * 100}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
