import { Home } from "lucide-react";
import { Link } from "react-router-dom";

export const Navbar = () => {
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
        </div>
      </div>
    </nav>
  );
};