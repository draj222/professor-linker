import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      navigate('/login');
    }
  };

  const handleSuggestionClick = async (suggestion: string) => {
    setSearchQuery(suggestion);
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    navigate('/login');
  };

  return (
    <div className="text-center mb-16">
      <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
        The Smartest Way to Connect with Professors
      </h1>
      <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
        All-in-one AI tools for students and researchers to find and connect with leading academics in their field.
      </p>
      
      <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <Input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Try: How to connect with professors in quantum computing?"
            className="w-full px-6 py-6 text-lg bg-white/10 backdrop-blur-lg border-gray-700 text-white placeholder:text-gray-400"
            disabled={isLoading}
          />
          <Search className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${isLoading ? 'animate-spin text-blue-400' : 'text-gray-400'}`} />
        </div>
      </form>

      <div className="flex flex-col md:flex-row gap-4 justify-center mb-12">
        <p className="text-gray-400">Try asking about:</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button 
            variant="outline" 
            className="bg-white/5 border-gray-700 text-gray-300 hover:bg-white/10"
            onClick={() => handleSuggestionClick('Research Collaboration')}
            disabled={isLoading}
          >
            Research Collaboration
          </Button>
          <Button 
            variant="outline" 
            className="bg-white/5 border-gray-700 text-gray-300 hover:bg-white/10"
            onClick={() => handleSuggestionClick('PhD Applications')}
            disabled={isLoading}
          >
            PhD Applications
          </Button>
          <Button 
            variant="outline" 
            className="bg-white/5 border-gray-700 text-gray-300 hover:bg-white/10"
            onClick={() => handleSuggestionClick('Academic Networking')}
            disabled={isLoading}
          >
            Academic Networking
          </Button>
        </div>
      </div>
    </div>
  );
};