import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Search, User } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      <Navbar />
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-white mb-8">Welcome back, {userDetails.name || 'User'}</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white/10 backdrop-blur-lg border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Mail className="h-6 w-6" />
                Email Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-400">
                {planInfo.emails_sent} / {planInfo.total_emails}
              </p>
              <p className="text-gray-300">emails remaining</p>
              <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                <div 
                  className="bg-blue-500 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${((planInfo.total_emails - planInfo.emails_sent) / planInfo.total_emails) * 100}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <User className="h-6 w-6" />
                Account Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">Email: {userDetails.email}</p>
              <p className="text-gray-300">Plan: {planInfo.plan_name}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Search className="h-6 w-6" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full"
                onClick={() => navigate('/')}
              >
                Find Professors
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;