import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Bell, Book, Mail, School, Search, Star, TrendingUp, Users, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface EmailStats {
  sent: number;
  opened: number;
  replied: number;
}

interface MatchStats {
  date: string;
  rate: number;
}

export const CoreDashboard = () => {
  const [emailStats, setEmailStats] = useState<EmailStats>({ sent: 0, opened: 0, replied: 0 });
  const [matchStats, setMatchStats] = useState<MatchStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedProfessors, setSavedProfessors] = useState(0);
  const [savedUniversities, setSavedUniversities] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast({
            title: "Authentication required",
            description: "Please sign in to view your dashboard",
            variant: "destructive"
          });
          navigate('/login');
          return;
        }

        // Fetch email statistics
        const { data: emailData, error: emailError } = await supabase
          .from('sent_emails')
          .select('status')
          .eq('user_id', user.id);

        if (emailError) throw emailError;

        if (emailData) {
          const stats = emailData.reduce((acc, email) => {
            acc.sent++;
            if (email.status === 'opened') acc.opened++;
            if (email.status === 'replied') acc.replied++;
            return acc;
          }, { sent: 0, opened: 0, replied: 0 });
          
          setEmailStats(stats);
        }

        // Fetch saved professors count
        const { count: professorCount, error: profError } = await supabase
          .from('user_saved_professors')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        if (profError) throw profError;
        setSavedProfessors(professorCount || 0);

        // Fetch saved universities count
        const { count: uniCount, error: uniError } = await supabase
          .from('user_favorite_universities')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        if (uniError) throw uniError;
        setSavedUniversities(uniCount || 0);

        // Generate match rate data for the last 7 days
        const matchData = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          return {
            date: date.toLocaleDateString(),
            rate: Math.floor(65 + Math.random() * 20) // Simulated match rate
          };
        });
        setMatchStats(matchData);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'find':
        navigate('/universities');
        break;
      case 'email':
        navigate('/professors');
        break;
      case 'browse':
        navigate('/universities');
        break;
      case 'notifications':
        toast({
          title: "Coming Soon",
          description: "Notifications feature will be available soon!",
        });
        break;
      default:
        break;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] text-transparent bg-clip-text animate-fade-in">
        Welcome to Your Research Dashboard
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-[#9b87f5]/20 animate-float" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] text-transparent bg-clip-text">Email Success Rate</CardTitle>
            <Mail className="h-4 w-4 text-[#9b87f5]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {emailStats.sent > 0 
                ? ((emailStats.replied / emailStats.sent) * 100).toFixed(1)
                : '0'}%
            </div>
            <Progress 
              value={emailStats.sent > 0 ? (emailStats.replied / emailStats.sent) * 100 : 0} 
              className="mt-2 bg-purple-950 [&>div]:bg-gradient-to-r [&>div]:from-[#9b87f5] [&>div]:to-[#7E69AB]"
            />
            <p className="text-xs text-[#9b87f5] mt-2">
              {emailStats.replied} replies from {emailStats.sent} emails
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-[#7E69AB]/20 animate-float" style={{ animationDelay: '0.4s' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-[#9b87f5] to-[#6E59A5] text-transparent bg-clip-text">Saved Professors</CardTitle>
            <Users className="h-4 w-4 text-[#7E69AB]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{savedProfessors}</div>
            <p className="text-xs text-[#7E69A5]">
              Click to view your saved professors
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-[#6E59A5]/20 animate-float" style={{ animationDelay: '0.6s' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-[#7E69AB] to-[#6E59A5] text-transparent bg-clip-text">Recent Updates</CardTitle>
            <Book className="h-4 w-4 text-[#6E59A5]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{emailStats.opened}</div>
            <p className="text-xs text-[#6E59A5]">Professors viewed your profile</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-[#9b87f5]/20 animate-float" style={{ animationDelay: '0.8s' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] text-transparent bg-clip-text">Saved Universities</CardTitle>
            <School className="h-4 w-4 text-[#9b87f5]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{savedUniversities}</div>
            <p className="text-xs text-[#9b87f5]">
              Across various countries
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10 transform transition-all duration-500 hover:shadow-2xl hover:shadow-[#9b87f5]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] text-transparent bg-clip-text">
              <TrendingUp className="h-5 w-5 text-[#9b87f5]" />
              Match Rate Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={matchStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255,255,255,0.1)', 
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px',
                      backdropFilter: 'blur(10px)'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="url(#colorGradient)" 
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#9b87f5" />
                      <stop offset="100%" stopColor="#D946EF" />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] text-transparent bg-clip-text">
              <Sparkles className="h-5 w-5 text-[#9b87f5]" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => handleQuickAction('find')}
              className="p-4 bg-gradient-to-br from-[#9b87f5]/10 to-[#6E59A5]/10 rounded-lg hover:from-[#9b87f5]/20 hover:to-[#6E59A5]/20 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm flex flex-col items-center gap-2 group"
            >
              <Search className="h-6 w-6 text-[#9b87f5] group-hover:scale-110 transition-transform" />
              <span className="text-white group-hover:text-[#9b87f5] transition-colors">Find Professors</span>
            </button>
            <button 
              onClick={() => handleQuickAction('email')}
              className="p-4 bg-gradient-to-br from-[#6E59A5]/10 to-[#9b87f5]/10 rounded-lg hover:from-[#6E59A5]/20 hover:to-[#9b87f5]/20 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm flex flex-col items-center gap-2 group"
            >
              <Mail className="h-6 w-6 text-[#6E59A5] group-hover:scale-110 transition-transform" />
              <span className="text-white group-hover:text-[#6E59A5] transition-colors">Draft Email</span>
            </button>
            <button 
              onClick={() => handleQuickAction('browse')}
              className="p-4 bg-gradient-to-br from-[#9b87f5]/10 to-[#6E59A5]/10 rounded-lg hover:from-[#9b87f5]/20 hover:to-[#6E59A5]/20 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm flex flex-col items-center gap-2 group"
            >
              <School className="h-6 w-6 text-[#9b87f5] group-hover:scale-110 transition-transform" />
              <span className="text-white group-hover:text-[#9b87f5] transition-colors">Browse Universities</span>
            </button>
            <button 
              onClick={() => handleQuickAction('notifications')}
              className="p-4 bg-gradient-to-br from-[#6E59A5]/10 to-[#9b87f5]/10 rounded-lg hover:from-[#6E59A5]/20 hover:to-[#9b87f5]/20 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm flex flex-col items-center gap-2 group"
            >
              <Bell className="h-6 w-6 text-[#6E59A5] group-hover:scale-110 transition-transform" />
              <span className="text-white group-hover:text-[#6E59A5] transition-colors">Notifications</span>
            </button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] text-transparent bg-clip-text">Recent Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {emailStats.opened > 0 && (
                <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg backdrop-blur-sm transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
                  <Mail className="h-8 w-8 text-green-400" />
                  <div>
                    <h3 className="font-medium text-white">Email Activity</h3>
                    <p className="text-sm text-green-200">
                      {emailStats.opened} professors viewed your emails
                    </p>
                  </div>
                </div>
              )}
              {savedProfessors > 0 && (
                <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-[#9b87f5]/10 to-[#6E59A5]/10 rounded-lg backdrop-blur-sm transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
                  <Users className="h-8 w-8 text-[#9b87f5]" />
                  <div>
                    <h3 className="font-medium text-white">Saved Professors</h3>
                    <p className="text-sm text-[#9b87f5]">
                      You have {savedProfessors} professors saved to your profile
                    </p>
                  </div>
                </div>
              )}
              {savedUniversities > 0 && (
                <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-[#6E59A5]/10 to-[#9b87f5]/10 rounded-lg backdrop-blur-sm transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
                  <School className="h-8 w-8 text-[#6E59A5]" />
                  <div>
                    <h3 className="font-medium text-white">Saved Universities</h3>
                    <p className="text-sm text-[#6E59A5]">
                      You have {savedUniversities} universities in your favorites
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
