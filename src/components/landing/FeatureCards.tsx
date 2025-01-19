import { Brain, Sparkles, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const FeatureCards = () => {
  return (
    <div className="grid md:grid-cols-3 gap-8 mb-16">
      <Card className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border-gray-700 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Brain className="h-6 w-6 text-purple-400" />
            AI-Powered Matching
          </CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300">
          Our advanced AI analyzes research papers and academic profiles to find the perfect professor matches for your interests.
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border-gray-700 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/20 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Sparkles className="h-6 w-6 text-pink-400" />
            Smart Email Generation
          </CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300">
          Generate personalized, professional emails that highlight your genuine interest and relevant background.
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border-gray-700 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 animate-fade-in" style={{ animationDelay: '0.6s' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Globe className="h-6 w-6 text-blue-400" />
            Global Network
          </CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300">
          Connect with leading academics from top universities worldwide in your field of research.
        </CardContent>
      </Card>
    </div>
  );
};