import { Card } from "@/components/ui/card";

export const NewsFeatures = () => {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-white mb-4">Featured In</h2>
        <p className="text-gray-400 text-center mb-12">Recognized by leading publications in academia and technology</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <Card className="bg-white/5 backdrop-blur-lg border-gray-700 p-6 flex items-center justify-center transform transition-all hover:scale-105">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              TechCrunch
            </div>
          </Card>

          <Card className="bg-white/5 backdrop-blur-lg border-gray-700 p-6 flex items-center justify-center transform transition-all hover:scale-105">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Nature
            </div>
          </Card>

          <Card className="bg-white/5 backdrop-blur-lg border-gray-700 p-6 flex items-center justify-center transform transition-all hover:scale-105">
            <div className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent">
              Science
            </div>
          </Card>

          <Card className="bg-white/5 backdrop-blur-lg border-gray-700 p-6 flex items-center justify-center transform transition-all hover:scale-105">
            <div className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              Forbes
            </div>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex gap-2 items-center justify-center bg-white/5 backdrop-blur-lg border border-gray-700 rounded-full px-6 py-2">
            <span className="text-blue-400">★</span>
            <span className="text-gray-300">Featured as one of the Top 10 AI Tools for Academia in 2024</span>
          </div>
        </div>
      </div>
    </div>
  );
};