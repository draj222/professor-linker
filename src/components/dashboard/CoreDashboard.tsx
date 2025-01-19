import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Bell, Book, Mail, School, Search, Star, TrendingUp, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch email statistics
        const { data: emailData } = await supabase
          .from('sent_emails')
          .select('status')
          .eq('user_id', user.id);

        if (emailData) {
          const stats = emailData.reduce((acc, email) => {
            acc.sent++;
            if (email.status === 'opened') acc.opened++;
            if (email.status === 'replied') acc.replied++;
            return acc;
          }, { sent: 0, opened: 0, replied: 0 });
          
          setEmailStats(stats);
        }

        // Generate some sample match rate data
        const sampleMatchData = Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
          rate: 65 + Math.random() * 20
        }));
        setMatchStats(sampleMatchData);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading dashboard...</div>;
  }

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
              {((emailStats.replied / emailStats.sent) * 100 || 0).toFixed(1)}%
            </div>
            <Progress 
              value={(emailStats.replied / emailStats.sent) * 100 || 0} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Professor Matches</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+12% from last week</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Research Updates</CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">New publications this week</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Saved Universities</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Across 3 countries</p>
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
            <button className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors flex flex-col items-center gap-2">
              <Search className="h-6 w-6" />
              <span>Find Professors</span>
            </button>
            <button className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors flex flex-col items-center gap-2">
              <Mail className="h-6 w-6" />
              <span>Draft Email</span>
            </button>
            <button className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors flex flex-col items-center gap-2">
              <School className="h-6 w-6" />
              <span>Browse Universities</span>
            </button>
            <button className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors flex flex-col items-center gap-2">
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
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                <Book className="h-8 w-8 text-blue-400" />
                <div>
                  <h3 className="font-medium">New Publication</h3>
                  <p className="text-sm text-muted-foreground">
                    Prof. Sarah Chen published "Advances in Quantum Computing"
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                <Mail className="h-8 w-8 text-green-400" />
                <div>
                  <h3 className="font-medium">Email Response</h3>
                  <p className="text-sm text-muted-foreground">
                    Prof. Michael Brown replied to your research inquiry
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                <Users className="h-8 w-8 text-purple-400" />
                <div>
                  <h3 className="font-medium">New Match</h3>
                  <p className="text-sm text-muted-foreground">
                    Found 3 new professors matching your research interests
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};