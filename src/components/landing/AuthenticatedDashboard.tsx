import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Mail } from "lucide-react";

interface AuthenticatedDashboardProps {
  planInfo: {
    plan_name: string;
    created_at: string;
    emails_sent: number;
    total_emails: number;
  };
}

export const AuthenticatedDashboard = ({ planInfo }: AuthenticatedDashboardProps) => {
  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">Your Dashboard</h1>
      
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card className="bg-white/10 backdrop-blur-lg border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Package className="h-6 w-6" />
              Current Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-400">{planInfo.plan_name}</p>
            <p className="text-gray-300 mt-2">Selected on {new Date(planInfo.created_at).toLocaleDateString()}</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-lg border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Mail className="h-6 w-6" />
              Email Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-blue-400">
                {planInfo.emails_sent} / {planInfo.total_emails}
              </p>
              <p className="text-gray-300">emails remaining</p>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-blue-500 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${((planInfo.total_emails - planInfo.emails_sent) / planInfo.total_emails) * 100}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};