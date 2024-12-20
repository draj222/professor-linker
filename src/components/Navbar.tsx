import { Home, User, BookOpen } from "lucide-react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userDetails, setUserDetails] = useState({
    email: "",
    fieldOfInterest: "",
    name: "",
  });
  const [newFieldOfInterest, setNewFieldOfInterest] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

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
        setNewFieldOfInterest(session.user.user_metadata?.field_of_interest || "");
      } else {
        setIsAuthenticated(false);
      }
    };

    getUserDetails();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      if (session) {
        setIsAuthenticated(true);
        setUserDetails({
          email: session.user.email || "",
          name: session.user.user_metadata?.full_name || "",
          fieldOfInterest: session.user.user_metadata?.field_of_interest || "",
        });
        setNewFieldOfInterest(session.user.user_metadata?.field_of_interest || "");
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const updateFieldOfInterest = async () => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: { field_of_interest: newFieldOfInterest }
      });

      if (error) throw error;

      setUserDetails(prev => ({
        ...prev,
        fieldOfInterest: newFieldOfInterest
      }));

      toast({
        title: "Success",
        description: "Field of interest updated successfully",
      });

      setIsOpen(false);
    } catch (error) {
      console.error("Error updating field of interest:", error);
      toast({
        title: "Error",
        description: "Failed to update field of interest",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
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
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="text-white hover:text-blue-200 transition-colors">
                  <BookOpen className="h-5 w-5 mr-2" />
                  <span className="font-medium">Field of Interest</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium leading-none">Update Field of Interest</h4>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter your field of interest"
                      value={newFieldOfInterest}
                      onChange={(e) => setNewFieldOfInterest(e.target.value)}
                    />
                    <Button onClick={updateFieldOfInterest}>Save</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

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
      </div>
    </nav>
  );
};