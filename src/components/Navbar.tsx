import { Home, Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProfileDropdown } from "./navbar/ProfileDropdown";
import { FieldOfInterest } from "./navbar/FieldOfInterest";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";

export const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userDetails, setUserDetails] = useState({
    email: "",
    fieldOfInterest: "",
    name: "",
  });
  const { theme, setTheme } = useTheme();

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
      } else {
        setIsAuthenticated(false);
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
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleFieldOfInterestUpdate = (newValue: string) => {
    setUserDetails(prev => ({
      ...prev,
      fieldOfInterest: newValue
    }));
  };

  // Only show navbar if user is authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-foreground hover:text-primary/80 transition-colors"
            >
              <img 
                src="/lovable-uploads/5ab766c0-0ce8-49e6-afb2-85be053a6f87.png" 
                alt="ResearchLink Logo" 
                className="h-8 w-8"
              />
            </Link>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="text-foreground hover:text-primary/80 transition-colors"
              >
                {theme === "light" ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </Button>
              <FieldOfInterest 
                initialValue={userDetails.fieldOfInterest}
                onUpdate={handleFieldOfInterestUpdate}
              />
              <ProfileDropdown userDetails={userDetails} />
            </div>
          </div>
        </div>
      </nav>
      <div className="h-16" />
    </>
  );
};