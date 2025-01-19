import { Brain, Sparkles, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const FeatureCards = () => {
  return (
    <div className="grid md:grid-cols-3 gap-8 mb-16">
      <Card className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border-gray-700 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 animate-float" style={{ animationDelay: '0.2s' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Brain className="h-6 w-6 text-purple-400" />
            AI-Powered Matching
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-300">Our advanced AI analyzes research papers and academic profiles to find the perfect professor matches for your interests.</p>
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 text-purple-300 text-sm">
                <span className="block w-2 h-2 rounded-full bg-purple-400"></span>
                98% Match Rate
              </div>
              <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full w-[98%] bg-gradient-to-r from-purple-400 to-pink-400 animate-shine"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border-gray-700 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/20 animate-float" style={{ animationDelay: '0.4s' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Sparkles className="h-6 w-6 text-pink-400" />
            Smart Email Generation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-300">Generate personalized, professional emails that highlight your genuine interest and relevant background.</p>
            <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg p-4">
              <div className="relative overflow-hidden rounded-md bg-black/30 p-2">
                <div className="text-xs text-gray-300 font-mono">
                  <span className="text-pink-400">{">"}</span> Generating email...
                  <div className="mt-1 text-gray-400">
                    Subject: Research Collaboration in Quantum Computing
                  </div>
                  <div className="animate-pulse text-gray-500 mt-1">|</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border-gray-700 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 animate-float" style={{ animationDelay: '0.6s' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Globe className="h-6 w-6 text-blue-400" />
            Global Network
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-300">Connect with leading academics from top universities worldwide in your field of research.</p>
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-4">
              <div className="grid grid-cols-3 gap-2">
                {['MIT', 'Stanford', 'Harvard', 'Oxford', 'Cambridge', 'ETH Zurich'].map((uni, i) => (
                  <div key={uni} className="text-xs bg-black/30 rounded px-2 py-1 text-center text-gray-300">
                    {uni}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};