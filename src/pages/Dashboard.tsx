import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { TopBar } from "@/components/TopBar";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    savedProfessors: 0,
    emailsSent: 0,
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
    };

    const fetchStats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { count: savedCount } = await supabase
        .from('user_saved_professors')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      const { count: emailCount } = await supabase
        .from('sent_emails')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      setStats({
        savedProfessors: savedCount || 0,
        emailsSent: emailCount || 0,
      });
    };

    checkAuth();
    fetchStats();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="container mx-auto pt-20 px-4">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-2">Saved Professors</h3>
            <p className="text-3xl font-bold">{stats.savedProfessors}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-2">Emails Sent</h3>
            <p className="text-3xl font-bold">{stats.emailsSent}</p>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;