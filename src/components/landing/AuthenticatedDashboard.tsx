import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Mail, Search, User, CreditCard, ChartBar, Sparkles, Building, BookOpen } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthenticatedDashboardProps {
  planInfo: {
    plan_name: string;
    created_at: string;
    emails_sent: number;
    total_emails: number;
  };
}

export const AuthenticatedDashboard = ({ planInfo }: AuthenticatedDashboardProps) => {
  const navigate = useNavigate();
  const [favoriteUniversities, setFavoriteUniversities] = useState(0);
  const [savedProfessors, setSavedProfessors] = useState(0);
  const [recentActivity, setRecentActivity] = useState<string[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch favorite universities count
        const { count: uniCount } = await supabase
          .from('user_favorite_universities')
          .select('*', { count: 'exact' })
          .eq('user_id', user.id);

        setFavoriteUniversities(uniCount || 0);

        // Fetch saved professors count
        const { count: profCount } = await supabase
          .from('user_saved_professors')
          .select('*', { count: 'exact' })
          .eq('user_id', user.id);

        setSavedProfessors(profCount || 0);

        // Fetch recent activities
        const { data: activities } = await supabase
          .from('user_activities')
          .select('activities')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (activities && activities.length > 0) {
          setRecentActivity(activities.map(a => a.activities));
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load some dashboard data');
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-start mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">
            Your Dashboard
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
                  {planInfo.emails_sent} / {planInfo.total_emails}
                </p>
                <p className="text-muted-foreground">emails remaining</p>
                <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                  <div 
                    className="bg-blue-500 h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${((planInfo.total_emails - planInfo.emails_sent) / planInfo.total_emails) * 100}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-gray-700 hover:bg-white/15 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Building className="h-6 w-6 text-purple-400" />
                Favorite Universities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-400">
                {favoriteUniversities}
              </p>
              <p className="text-muted-foreground">universities saved</p>
              <Button 
                variant="ghost" 
                className="mt-4 w-full hover:bg-purple-500/20"
                onClick={() => navigate('/universities')}
              >
                View All
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-gray-700 hover:bg-white/15 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <BookOpen className="h-6 w-6 text-green-400" />
                Saved Professors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-400">
                {savedProfessors}
              </p>
              <p className="text-muted-foreground">professors tracked</p>
              <Button 
                variant="ghost" 
                className="mt-4 w-full hover:bg-green-500/20"
                onClick={() => navigate('/professors')}
              >
                View All
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="bg-white/10 backdrop-blur-lg border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <ChartBar className="h-6 w-6 text-yellow-400" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Your latest interactions and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivity.length > 0 ? (
                <ul className="space-y-2">
                  {recentActivity.map((activity, index) => (
                    <li key={index} className="text-muted-foreground">
                      {activity}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No recent activity</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Sparkles className="h-6 w-6 text-yellow-400" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Start your academic journey or manage your existing connections
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Button 
                className="h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
                onClick={() => navigate('/')}
              >
                <Search className="mr-2 h-5 w-5" />
                Find Professors
              </Button>
              <Button 
                variant="outline"
                className="h-12 text-lg font-semibold border-gray-600 hover:bg-white/5"
                onClick={() => {
                  toast.info("Profile management coming soon!");
                }}
              >
                <User className="mr-2 h-5 w-5" />
                View Profile
              </Button>
              <Button 
                variant="outline"
                className="h-12 text-lg font-semibold border-gray-600 hover:bg-white/5"
                onClick={() => navigate('/pricing')}
              >
                <CreditCard className="mr-2 h-5 w-5" />
                Manage Plan
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};