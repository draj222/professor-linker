import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const PricingPage = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);

  const plans = [
    {
      name: "Basic",
      price: "$3.99",
      emails: "100",
      features: ["100 personalized emails per month", "AI-powered personalization", "Email templates"]
    },
    {
      name: "Pro",
      price: "$6.99",
      emails: "500",
      features: ["500 personalized emails per month", "Priority support", "Advanced analytics"]
    },
    {
      name: "Enterprise",
      price: "$25.99",
      emails: "∞",
      features: ["Unlimited personalized emails", "24/7 support", "Custom templates"]
    }
  ];

  const handleGetStarted = async (plan: string) => {
    if (plan === "Basic") {
      setIsGenerating(true);
      
      const fieldOfInterest = localStorage.getItem("fieldOfInterest");
      if (!fieldOfInterest) {
        toast.error("Please complete the form first to specify your field of interest.");
        navigate("/");
        return;
      }

      navigate("/generating");
    } else {
      toast.info("Coming soon! Only Basic plan is available now.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="max-w-6xl mx-auto pt-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">Choose Your Plan</h1>
          <p className="text-gray-400 text-xl">Unlock access to personalized academic outreach</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 px-4">
          {plans.map((plan) => (
            <Card key={plan.name} className="relative backdrop-blur-lg bg-white/10 border-gray-700 p-6 rounded-xl">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-white mb-4">
                  {plan.price}
                  <span className="text-lg text-gray-400">/month</span>
                </div>
                <div className="text-3xl font-bold text-blue-400 mb-6">
                  {plan.emails} emails
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => handleGetStarted(plan.name)}
                disabled={isGenerating}
              >
                {isGenerating ? "Generating..." : "Get Started"}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;