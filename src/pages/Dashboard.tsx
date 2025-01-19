import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Search, User, CreditCard, ChartBar, Sparkles } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    email: '',
    name: '',
  });
  const [planInfo, setPlanInfo] = useState({
    plan_name: '',
    emails_sent: 0,
    total_emails: 0,
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }

      setUserDetails({
        email: session.user.email || '',
        name: session.user.user_metadata?.full_name || '',
      });

      // Fetch user's plan information
      const { data: userPlan } = await supabase
        .from('user_plans')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (userPlan) {
        setPlanInfo({
          plan_name: userPlan.plan_name,
          emails_sent: userPlan.emails_sent || 0,
          total_emails: userPlan.total_emails,
        });
      }
    };

    checkAuth();
  }, [navigate]);

  const handleStartSearch = () => {
    if (!planInfo.plan_name) {
      navigate('/pricing');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      <Navbar />
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-start mb-12">
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome back, {userDetails.name || 'User'}
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage your academic outreach and track your progress
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card className="bg-white/10 backdrop-blur-lg border-gray-700 hover:bg-white/15 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Mail className="h-6 w-6 text-blue-400" />
                  Email Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <p className="text-3xl font-bold text-blue-400">
                    {planInfo.emails_sent} / {planInfo.total_emails || '∞'}
                  </p>
                  <p className="text-muted-foreground">emails remaining</p>
                  {planInfo.total_emails > 0 && (
                    <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                      <div 
                        className="bg-blue-500 h-2.5 rounded-full transition-all duration-500" 
                        style={{ width: `${((planInfo.total_emails - planInfo.emails_sent) / planInfo.total_emails) * 100}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-gray-700 hover:bg-white/15 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <CreditCard className="h-6 w-6 text-green-400" />
                  Current Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-400 capitalize">
                  {planInfo.plan_name || 'No Plan'}
                </p>
                <p className="text-muted-foreground">
                  {planInfo.plan_name ? 'Active subscription' : 'Select a plan to start'}
                </p>
                {!planInfo.plan_name && (
                  <Button 
                    className="mt-4 w-full"
                    onClick={() => navigate('/pricing')}
                  >
                    Choose Plan
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-gray-700 hover:bg-white/15 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <ChartBar className="h-6 w-6 text-purple-400" />
                  Activity Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-purple-400">
                  {planInfo.emails_sent}
                </p>
                <p className="text-muted-foreground">total emails sent</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/10 backdrop-blur-lg border-gray-700 p-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white text-2xl">
                <Sparkles className="h-6 w-6 text-yellow-400" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Start your academic journey or manage your existing connections
              </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <Button 
                className="h-24 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
                onClick={handleStartSearch}
              >
                <Search className="mr-2 h-5 w-5" />
                Find Professors
              </Button>
              <Button 
                variant="outline"
                className="h-24 text-lg font-semibold border-gray-600 hover:bg-white/5"
                onClick={() => {
                  toast.info("Coming soon!");
                }}
              >
                <User className="mr-2 h-5 w-5" />
                View Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;