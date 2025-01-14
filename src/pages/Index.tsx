import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import { Mail, Package, Globe, Rocket, Users } from 'lucide-react';
import { Login } from '@/components/Login';
import { MultiStepForm } from '@/components/MultiStepForm';
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

  const LandingContent = () => (
    <div className="container mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-white mb-6">
          Connect with Leading Professors in Your Field
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Professor Linker helps you reach out to academics who share your research interests. Generate personalized emails and start meaningful academic conversations.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <Card className="bg-white/10 backdrop-blur-lg border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Globe className="h-6 w-6 text-blue-400" />
              Global Network
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300">
            Access a worldwide network of professors and researchers in your field of interest.
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-lg border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Rocket className="h-6 w-6 text-blue-400" />
              Smart Matching
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300">
            Our AI matches you with professors based on your research interests and academic goals.
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-lg border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Users className="h-6 w-6 text-blue-400" />
              Personalized Outreach
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300">
            Generate customized emails that highlight your genuine interest and relevant background.
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <Button 
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-lg"
          onClick={() => document.getElementById('login-section')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Get Started
        </Button>
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black">
        <Navbar />
        <LandingContent />
        <div id="login-section" className="container mx-auto px-4 py-20">
          <h2 className="text-4xl font-bold text-white mb-8 text-center">Join Professor Linker</h2>
          <Login />
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