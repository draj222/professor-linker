import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Book, Award, Mail, Brain } from "lucide-react";

interface ResearchMetric {
  category: string;
  score: number;
  description: string;
}

interface DetailedMetricsSectionProps {
  metrics: {
    researchCompatibility: ResearchMetric[];
    academicSuccess: {
      applications: number;
      acceptances: number;
      pending: number;
    };
  };
}

export const DetailedMetricsSection = ({ metrics }: DetailedMetricsSectionProps) => {
  return (
    <Card className="bg-white/10 backdrop-blur-lg border-gray-700 hover:bg-white/15 transition-colors">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-purple-400" />
          Detailed Research Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-6">
            {metrics.researchCompatibility.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">{metric.category}</span>
                  <span className="text-gray-300">{metric.score}%</span>
                </div>
                <Progress value={metric.score} className="h-2" />
                <p className="text-xs text-gray-400">{metric.description}</p>
              </div>
            ))}
            
            <div className="pt-4 border-t border-gray-700">
              <h4 className="text-sm font-medium mb-4">Academic Success Metrics</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {metrics.academicSuccess.applications}
                  </div>
                  <div className="text-xs text-gray-400">Applications</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {metrics.academicSuccess.acceptances}
                  </div>
                  <div className="text-xs text-gray-400">Acceptances</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {metrics.academicSuccess.pending}
                  </div>
                  <div className="text-xs text-gray-400">Pending</div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};