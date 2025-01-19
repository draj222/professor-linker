import { useEffect, useState } from "react";
import { TopBar } from "@/components/TopBar";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { ProfessorCard } from "@/components/ProfessorCard";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Professor {
  id: string;
  name: string;
  email: string;
  position: string;
  institution: string;
  recentWork: string;
  generatedEmail: string;
}

const ProfessorLibrary = () => {
  const navigate = useNavigate();
  const [savedProfessors, setSavedProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
    };

    const fetchSavedProfessors = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_saved_professors')
        .select(`
          professor_id,
          professors (
            id,
            name,
            email,
            department,
            recent_publications
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching saved professors:', error);
        return;
      }

      const professors = data.map(item => ({
        id: item.professors.id,
        name: item.professors.name,
        email: item.professors.email,
        position: item.professors.department || 'Unknown Position',
        institution: 'Institution',
        recentWork: JSON.stringify(item.professors.recent_publications) || 'No recent work available',
        generatedEmail: '' // Adding the required generatedEmail property with a default empty string
      }));

      setSavedProfessors(professors);
      setLoading(false);
    };

    checkAuth();
    fetchSavedProfessors();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar />
        <main className="container mx-auto pt-20 px-4">
          <div className="text-center">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="container mx-auto pt-20 px-4">
        <h1 className="text-4xl font-bold mb-8">Professor Library</h1>
        <ScrollArea className="h-[600px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProfessors.map((professor) => (
              <ProfessorCard
                key={professor.id}
                professor={professor}
                isSelected={false}
                isFlipped={false}
                onClick={() => {}}
              />
            ))}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
};

export default ProfessorLibrary;