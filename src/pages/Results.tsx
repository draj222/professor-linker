import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { LayoutDashboard } from "lucide-react";
import { Link } from 'react-router-dom';

const Results = () => {
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfessors = async () => {
      const { data, error } = await supabase
        .from('professors')
        .select('*');

      if (error) {
        console.error('Error fetching professors:', error);
      } else {
        setProfessors(data);
      }
      setLoading(false);
    };

    fetchProfessors();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      <Navbar />
      <div className="container mx-auto px-4 py-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Generated Professors</h1>
          <Link 
            to="/dashboard"
            className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors"
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Go to Dashboard</span>
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {professors.map((professor) => (
            <div key={professor.id} className="bg-white/10 backdrop-blur-lg border-gray-700 p-4 rounded-lg">
              <h2 className="text-xl font-bold text-white">{professor.name}</h2>
              <p className="text-gray-300">{professor.department}</p>
              <p className="text-gray-300">{professor.email}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Results;
