import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Database, User, BarChart2, List } from "lucide-react";

export const TopBar = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-b">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <Database className="h-6 w-6" />
            <span className="font-bold">Professor Linker</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Button
              variant="ghost"
              className="flex items-center gap-2"
              onClick={() => navigate('/dashboard')}
            >
              <BarChart2 className="h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className="flex items-center gap-2"
              onClick={() => navigate('/library')}
            >
              <List className="h-4 w-4" />
              Professor Library
            </Button>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={() => navigate('/profile')}
          >
            <User className="h-4 w-4" />
            Profile
          </Button>
        </div>
      </div>
    </div>
  );
};