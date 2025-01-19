import { Card } from "@/components/ui/card";

export const Testimonials = () => {
  return (
    <div className="py-16 bg-gradient-to-b from-transparent to-blue-950/30">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-white mb-12">
          Trusted by Leading Academics
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-white/5 backdrop-blur-lg border-gray-700 p-6 transform transition-all hover:scale-105">
            <div className="flex flex-col h-full">
              <blockquote className="text-gray-300 mb-4">
                "Professor Linker helped me connect with my dream advisor. The personalized email suggestions were incredibly effective."
              </blockquote>
              <div className="mt-auto">
                <p className="text-white font-semibold">Sarah Chen</p>
                <p className="text-gray-400">PhD Student, Stanford University</p>
              </div>
            </div>
          </Card>

          <Card className="bg-white/5 backdrop-blur-lg border-gray-700 p-6 transform transition-all hover:scale-105">
            <div className="flex flex-col h-full">
              <blockquote className="text-gray-300 mb-4">
                "The AI-powered matching system is revolutionary. It saved me countless hours in my research collaboration search."
              </blockquote>
              <div className="mt-auto">
                <p className="text-white font-semibold">Dr. James Wilson</p>
                <p className="text-gray-400">Assistant Professor, MIT</p>
              </div>
            </div>
          </Card>

          <Card className="bg-white/5 backdrop-blur-lg border-gray-700 p-6 transform transition-all hover:scale-105">
            <div className="flex flex-col h-full">
              <blockquote className="text-gray-300 mb-4">
                "An essential tool for any academic looking to expand their research network. The results were impressive."
              </blockquote>
              <div className="mt-auto">
                <p className="text-white font-semibold">Emily Rodriguez</p>
                <p className="text-gray-400">Research Fellow, Harvard</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};