import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Mail, Search, User, CreditCard, ChartBar, Sparkles, Building, BookOpen, Star } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AnalyticsSection } from "../dashboard/AnalyticsSection";
import { RecommendationsSection } from "../dashboard/RecommendationsSection";
import { ResearchUpdatesSection } from "../dashboard/ResearchUpdatesSection";
import { DetailedMetricsSection } from "../dashboard/DetailedMetricsSection";
import { OutreachSection } from "../dashboard/OutreachSection";
import { SearchSection } from "../dashboard/SearchSection";

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
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    emailStats: {
      sent: 0,
      opened: 0,
      replied: 0,
    },
    matchRates: [],
    recommendations: [],
    updates: [],
    metrics: {
      researchCompatibility: [
        {
          category: "Research Interests Alignment",
          score: 85,
          description: "Strong alignment with AI and Machine Learning focus"
        },
        {
          category: "Publication Impact",
          score: 92,
          description: "High citation rates in relevant fields"
        },
        {
          category: "Collaboration Potential",
          score: 78,
          description: "Active in collaborative research projects"
        }
      ],
      academicSuccess: {
        applications: 12,
        acceptances: 5,
        pending: 7
      }
    },
    followUps: [
      {
        id: "1",
        professorName: "Dr. Sarah Johnson",
        dueDate: "2024-03-20",
        status: "pending",
        type: "follow_up"
      },
      {
        id: "2",
        professorName: "Dr. Michael Chen",
        dueDate: "2024-03-22",
        status: "completed",
        type: "initial_contact"
      }
    ],
    professors: [
      {
        id: "1",
        name: "Dr. Sarah Johnson",
        institution: "Stanford University",
        department: "Computer Science",
        isFavorite: true
      },
      {
        id: "2",
        name: "Dr. Michael Chen",
        institution: "MIT",
        department: "Artificial Intelligence",
        isFavorite: false
      }
    ]
  });

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
          const stats = {
            sent: emailData.length,
            opened: emailData.filter(e => e.status === 'opened').length,
            replied: emailData.filter(e => e.status === 'replied').length,
          };
          setDashboardData(prev => ({ ...prev, emailStats: stats }));
        }

        // Mock data for demonstration
        setDashboardData(prev => ({
          ...prev,
          matchRates: [
            { date: '2024-01', rate: 65 },
            { date: '2024-02', rate: 75 },
            { date: '2024-03', rate: 85 },
          ],
          recommendations: [
            {
              id: '1',
              name: 'Dr. Sarah Johnson',
              institution: 'Stanford University',
              matchScore: 95,
            },
            {
              id: '2',
              name: 'Dr. Michael Chen',
              institution: 'MIT',
              matchScore: 90,
            },
          ],
          updates: [
            {
              id: '1',
              type: 'publication',
              title: 'New Research Paper on AI Ethics',
              professor: 'Dr. Sarah Johnson',
              date: 'Today',
            },
            {
              id: '2',
              type: 'project',
              title: 'Machine Learning Research Project',
              professor: 'Dr. Michael Chen',
              date: 'Yesterday',
            },
          ],
        }));

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load some dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleScheduleFollowUp = (professorId: string) => {
    toast.success("Follow-up scheduled successfully");
  };

  const handleToggleFavorite = (professorId: string) => {
    setDashboardData(prev => ({
      ...prev,
      professors: prev.professors.map(prof =>
        prof.id === professorId ? { ...prof, isFavorite: !prof.isFavorite } : prof
      )
    }));
    toast.success("Professor favorite status updated");
  };

  const handleViewProfile = (professorId: string) => {
    navigate(`/professor/${professorId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/10 backdrop-blur-lg border-gray-700 hover:bg-white/15 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-6 w-6 text-blue-400" />
              Email Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400">
              {planInfo.emails_sent} / {planInfo.total_emails}
            </div>
            <p className="text-gray-400">emails remaining</p>
            <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
              <div 
                className="bg-blue-500 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${((planInfo.total_emails - planInfo.emails_sent) / planInfo.total_emails) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-lg border-gray-700 hover:bg-white/15 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChartBar className="h-6 w-6 text-green-400" />
              Response Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">
              {Math.round((dashboardData.emailStats.replied / dashboardData.emailStats.sent) * 100 || 0)}%
            </div>
            <p className="text-gray-400">average response rate</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-lg border-gray-700 hover:bg-white/15 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-6 w-6 text-yellow-400" />
              Match Quality
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-400">92%</div>
            <p className="text-gray-400">average match score</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DetailedMetricsSection metrics={dashboardData.metrics} />
        <OutreachSection
          followUps={dashboardData.followUps}
          onScheduleFollowUp={handleScheduleFollowUp}
        />
      </div>

      <SearchSection
        professors={dashboardData.professors}
        onToggleFavorite={handleToggleFavorite}
        onViewProfile={handleViewProfile}
      />

      <AnalyticsSection
        emailStats={dashboardData.emailStats}
        matchRates={dashboardData.matchRates}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecommendationsSection recommendations={dashboardData.recommendations} />
        <ResearchUpdatesSection updates={dashboardData.updates} />
      </div>

      <Card className="bg-white/10 backdrop-blur-lg border-gray-700 hover:bg-white/15 transition-colors">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-400" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <Button
            className="h-16 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate('/')}
          >
            <Search className="mr-2 h-5 w-5" />
            Find Professors
          </Button>
          <Button
            variant="outline"
            className="h-16 text-lg font-semibold border-gray-600 hover:bg-white/5"
            onClick={() => navigate('/pricing')}
          >
            <CreditCard className="mr-2 h-5 w-5" />
            Manage Plan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
