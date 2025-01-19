import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "@/components/ThemeProvider";

export const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();

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
    <div className="text-center mb-16 animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-3xl -z-10" />
        <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${
          theme === 'light' 
            ? 'text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600' 
            : 'text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300'
        }`}>
          The Smartest Way to Connect with Professors
        </h1>
      </div>
      <p className={`text-xl max-w-2xl mx-auto mb-8 animate-fade-in ${
        theme === 'light' ? 'text-gray-700' : 'text-gray-300'
      }`} style={{ animationDelay: '0.2s' }}>
        All-in-one AI tools for students and researchers to find and connect with leading academics in their field.
      </p>
      
      <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto mb-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <div className="relative transform transition-all duration-300 hover:scale-[1.02]">
          <Input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Try: How to connect with professors in quantum computing?"
            className={`w-full px-6 py-6 text-lg backdrop-blur-lg border-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500/50 transition-all ${
              theme === 'light' 
                ? 'bg-white/80 text-gray-800' 
                : 'bg-white/10 text-white'
            }`}
            disabled={isLoading}
          />
          <Search className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${
            isLoading ? 'animate-spin text-purple-400' : theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`} />
        </div>
      </form>

      <div className="flex flex-col md:flex-row gap-4 justify-center mb-12 animate-fade-in" style={{ animationDelay: '0.6s' }}>
        <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>Try asking about:</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button 
            variant="outline" 
            className={`border-gray-700 hover:scale-105 transition-all duration-300 ${
              theme === 'light' 
                ? 'bg-white/80 text-gray-800 hover:bg-gray-100' 
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
            onClick={() => handleSuggestionClick('Research Collaboration')}
            disabled={isLoading}
          >
            Research Collaboration
          </Button>
          <Button 
            variant="outline" 
            className={`border-gray-700 hover:scale-105 transition-all duration-300 ${
              theme === 'light' 
                ? 'bg-white/80 text-gray-800 hover:bg-gray-100' 
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
            onClick={() => handleSuggestionClick('PhD Applications')}
            disabled={isLoading}
          >
            PhD Applications
          </Button>
          <Button 
            variant="outline" 
            className={`border-gray-700 hover:scale-105 transition-all duration-300 ${
              theme === 'light' 
                ? 'bg-white/80 text-gray-800 hover:bg-gray-100' 
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
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