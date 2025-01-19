import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Bell, Book, Mail, School, Search, Star, TrendingUp, Users } from "lucide-react";
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
      <h1 className="text-4xl font-bold mb-8">Welcome to Your Research Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Email Success Rate</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {emailStats.sent > 0 
                ? ((emailStats.replied / emailStats.sent) * 100).toFixed(1)
                : '0'}%
            </div>
            <Progress 
              value={emailStats.sent > 0 ? (emailStats.replied / emailStats.sent) * 100 : 0} 
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {emailStats.replied} replies from {emailStats.sent} emails
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Saved Professors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{savedProfessors}</div>
            <p className="text-xs text-muted-foreground">
              Click to view your saved professors
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Recent Updates</CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{emailStats.opened}</div>
            <p className="text-xs text-muted-foreground">Professors viewed your profile</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Saved Universities</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{savedUniversities}</div>
            <p className="text-xs text-muted-foreground">
              Across various countries
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Match Rate Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={matchStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => handleQuickAction('find')}
              className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors flex flex-col items-center gap-2"
            >
              <Search className="h-6 w-6" />
              <span>Find Professors</span>
            </button>
            <button 
              onClick={() => handleQuickAction('email')}
              className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors flex flex-col items-center gap-2"
            >
              <Mail className="h-6 w-6" />
              <span>Draft Email</span>
            </button>
            <button 
              onClick={() => handleQuickAction('browse')}
              className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors flex flex-col items-center gap-2"
            >
              <School className="h-6 w-6" />
              <span>Browse Universities</span>
            </button>
            <button 
              onClick={() => handleQuickAction('notifications')}
              className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors flex flex-col items-center gap-2"
            >
              <Bell className="h-6 w-6" />
              <span>Notifications</span>
            </button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
          <CardHeader>
            <CardTitle>Recent Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {emailStats.opened > 0 && (
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                  <Mail className="h-8 w-8 text-green-400" />
                  <div>
                    <h3 className="font-medium">Email Activity</h3>
                    <p className="text-sm text-muted-foreground">
                      {emailStats.opened} professors viewed your emails
                    </p>
                  </div>
                </div>
              )}
              {savedProfessors > 0 && (
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                  <Users className="h-8 w-8 text-purple-400" />
                  <div>
                    <h3 className="font-medium">Saved Professors</h3>
                    <p className="text-sm text-muted-foreground">
                      You have {savedProfessors} professors saved to your profile
                    </p>
                  </div>
                </div>
              )}
              {savedUniversities > 0 && (
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                  <School className="h-8 w-8 text-blue-400" />
                  <div>
                    <h3 className="font-medium">Saved Universities</h3>
                    <p className="text-sm text-muted-foreground">
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