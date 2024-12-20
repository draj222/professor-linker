import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProfileDropdown } from "./navbar/ProfileDropdown";
import { FieldOfInterest } from "./navbar/FieldOfInterest";

export const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasPlan, setHasPlan] = useState(false);
  const [userDetails, setUserDetails] = useState({
    email: "",
    fieldOfInterest: "",
    name: "",
  });

  useEffect(() => {
    const getUserDetails = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Current session:", session);
      
      if (session?.user) {
        setIsAuthenticated(true);
        setUserDetails({
          email: session.user.email || "",
          name: session.user.user_metadata?.full_name || "",
          fieldOfInterest: session.user.user_metadata?.field_of_interest || "",
        });

        // Check if user has a plan
        const { data: userPlan } = await supabase
          .from('user_plans')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        console.log("User plan:", userPlan);
        setHasPlan(!!userPlan);
      } else {
        setIsAuthenticated(false);
        setHasPlan(false);
      }
    };

    getUserDetails();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      if (session) {
        setIsAuthenticated(true);
        setUserDetails({
          email: session.user.email || "",
          name: session.user.user_metadata?.full_name || "",
          fieldOfInterest: session.user.user_metadata?.field_of_interest || "",
        });

        // Check if user has a plan when auth state changes
        const { data: userPlan } = await supabase
          .from('user_plans')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        console.log("User plan on auth change:", userPlan);
        setHasPlan(!!userPlan);
      } else {
        setIsAuthenticated(false);
        setHasPlan(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Only show navbar if user is authenticated AND has a plan
  if (!isAuthenticated || !hasPlan) {
    return null;
  }

  return (
    <nav className="bg-blue-900/50 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors"
          >
            <Home className="h-5 w-5" />
            <span className="font-medium">Home</span>
          </Link>

          <div className="flex items-center space-x-4">
            <FieldOfInterest 
              initialValue={userDetails.fieldOfInterest}
              onUpdate={handleFieldOfInterestUpdate}
            />
            <ProfileDropdown userDetails={userDetails} />
          </div>
        </div>
      </div>
    </nav>
  );
};