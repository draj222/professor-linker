import { Home, User } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Navbar = () => {
  const [userDetails, setUserDetails] = useState({
    email: "",
    fieldOfInterest: "",
    name: "",
  });

  useEffect(() => {
    const getUserDetails = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setUserDetails({
            email: session.user.email || "",
            name: profile.full_name || "",
            fieldOfInterest: profile.field_of_interest || "",
          });
        }
      }
    };

    getUserDetails();
  }, []);

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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-white hover:text-blue-200 transition-colors">
                <User className="h-5 w-5 mr-2" />
                <span className="font-medium">Profile</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>Personal Information</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-2 space-y-2 text-sm">
                <div>
                  <span className="font-semibold">Name:</span>
                  <p className="text-muted-foreground">{userDetails.name || "Not set"}</p>
                </div>
                <div>
                  <span className="font-semibold">Email:</span>
                  <p className="text-muted-foreground">{userDetails.email || "Not set"}</p>
                </div>
                <div>
                  <span className="font-semibold">Field of Interest:</span>
                  <p className="text-muted-foreground">{userDetails.fieldOfInterest || "Not set"}</p>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};